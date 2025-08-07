import * as Location from 'expo-location';

// OpenStreetMap Overpass API - Free and reliable
const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

// Nominatim API for additional search (also free)
const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/search';

// Cache for API results (expires after 30 minutes)
const cache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export class LocationService {
  static getCacheKey(type, latitude, longitude, radius) {
    return `${type}_${latitude.toFixed(3)}_${longitude.toFixed(3)}_${radius}`;
  }

  static getCachedResult(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached result for:', key);
      return cached.data;
    }
    return null;
  }

static setCachedResult(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

static async getCurrentLocation() {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      // Fallback to a default location (you can customize this)
      return {
        latitude: 31.5204, // Lahore, Pakistan (example)
        longitude: 74.3587,
      };
    }
  }

  // Find nearby pharmacies using OpenStreetMap (Free API)
  static async findNearbyPharmacies(latitude, longitude, radius = 8000) {
    const cacheKey = this.getCacheKey('pharmacies', latitude, longitude, radius);
    const cachedResult = this.getCachedResult(cacheKey);
    if (cachedResult) return cachedResult;

    try {
      // Expanded query to include more pharmacy types and medical stores
      const query = `
        [out:json][timeout:30];
        (
          node["amenity"="pharmacy"](around:${radius},${latitude},${longitude});
          way["amenity"="pharmacy"](around:${radius},${latitude},${longitude});
          relation["amenity"="pharmacy"](around:${radius},${latitude},${longitude});
          node["shop"="chemist"](around:${radius},${latitude},${longitude});
          way["shop"="chemist"](around:${radius},${latitude},${longitude});
          node["healthcare"="pharmacy"](around:${radius},${latitude},${longitude});
          way["healthcare"="pharmacy"](around:${radius},${latitude},${longitude});
          node["name"~"pharmacy|chemist|medical store|drug store|dawakhana|medical centre"](around:${radius},${latitude},${longitude});
          way["name"~"pharmacy|chemist|medical store|drug store|dawakhana|medical centre"](around:${radius},${latitude},${longitude});
        );
        out geom;
      `;

      const response = await fetch(OVERPASS_API_URL, {
        method: 'POST',
        body: query,
        headers: { 'Content-Type': 'text/plain' }
      });

      const data = await response.json();
      
      const pharmacies = data.elements
        .filter(element => {
          // Must have coordinates and filter out invalid results
          if (!element.lat && !element.lon) return false;
          
          const name = element.tags?.name || '';
          const lowerName = name.toLowerCase();
          
          // Filter out wheelchair makers and invalid results
          const invalidKeywords = ['wheelchair', 'mobility equipment', 'surgical instruments', 'veterinary', 'vet clinic'];
          return !invalidKeywords.some(keyword => lowerName.includes(keyword));
        })
        .map((element, index) => ({
          id: element.id || `pharmacy_${index}`,
          name: element.tags?.name || 'Local Pharmacy',
          address: this.formatAddress(element.tags),
          latitude: element.lat || element.center?.lat,
          longitude: element.lon || element.center?.lon,
          rating: 0,
          isOpen: this.parseOpeningHours(element.tags?.opening_hours),
          distance: this.calculateDistance(latitude, longitude, element.lat || element.center?.lat, element.lon || element.center?.lon),
          phone: element.tags?.phone || null,
          type: 'pharmacy',
          website: element.tags?.website || null,
          operator: element.tags?.operator || null,
          amenity: element.tags?.amenity || element.tags?.shop || element.tags?.healthcare
        }))
        .sort((a, b) => a.distance - b.distance) // Sort by distance
        .slice(0, 25); // Increase to 25 closest results
      
      this.setCachedResult(cacheKey, pharmacies);
      
      // If we got very few results, try additional search with Nominatim
      if (pharmacies.length < 10) {
        console.log('Few pharmacies found, trying additional search...');
        const additionalPharmacies = await this.searchNominatimPharmacies(latitude, longitude, radius);
        const combinedResults = [...pharmacies, ...additionalPharmacies]
          .filter((pharmacy, index, self) => 
            index === self.findIndex(p => p.name === pharmacy.name && Math.abs(p.latitude - pharmacy.latitude) < 0.001)
          ) // Remove duplicates
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 25);
        
        this.setCachedResult(cacheKey, combinedResults);
        return combinedResults;
      }
      
      return pharmacies;
    } catch (error) {
      console.error('Error finding pharmacies:', error);
      return [];
    }
  }

  // Find nearby hospitals with NICU detection using OpenStreetMap
  static async findNearbyHospitalsWithNICU(latitude, longitude, radius = 15000) {
    const cacheKey = this.getCacheKey('hospitals', latitude, longitude, radius);
    const cachedResult = this.getCachedResult(cacheKey);
    if (cachedResult) return cachedResult;

    try {
      // Expanded query to include more hospital types and medical facilities
      const query = `
        [out:json][timeout:30];
        (
          node["amenity"="hospital"](around:${radius},${latitude},${longitude});
          way["amenity"="hospital"](around:${radius},${latitude},${longitude});
          relation["amenity"="hospital"](around:${radius},${latitude},${longitude});
          node["healthcare"="hospital"](around:${radius},${latitude},${longitude});
          way["healthcare"="hospital"](around:${radius},${latitude},${longitude});
          node["amenity"="clinic"]["emergency"="yes"](around:${radius},${latitude},${longitude});
          way["amenity"="clinic"]["emergency"="yes"](around:${radius},${latitude},${longitude});
          node["name"~"hospital|medical center|medical centre|emergency|trauma|maternity|gynecology"](around:${radius},${latitude},${longitude});
          way["name"~"hospital|medical center|medical centre|emergency|trauma|maternity|gynecology"](around:${radius},${latitude},${longitude});
        );
        out geom;
      `;

      const response = await fetch(OVERPASS_API_URL, {
        method: 'POST',
        body: query,
        headers: { 'Content-Type': 'text/plain' }
      });

      const data = await response.json();
      
      const hospitals = data.elements
        .filter(element => {
          // Must have coordinates and filter out invalid results
          if (!element.lat && !element.lon) return false;
          
          const name = element.tags?.name || '';
          const lowerName = name.toLowerCase();
          
          // Filter out veterinary clinics and non-human medical facilities
          const invalidKeywords = ['veterinary', 'vet clinic', 'animal hospital', 'pet clinic'];
          return !invalidKeywords.some(keyword => lowerName.includes(keyword));
        })
        .map((element, index) => {
          const hospitalName = element.tags?.name || 'Local Hospital';
          const specialtyInfo = this.getHospitalSpecialties(element.tags);
          const nicuConfidence = this.detectNICUConfidence(hospitalName, specialtyInfo);
          
          return {
            id: element.id || `hospital_${index}`,
            name: hospitalName,
            address: this.formatAddress(element.tags),
            latitude: element.lat || element.center?.lat,
            longitude: element.lon || element.center?.lon,
            rating: 0,
            isOpen: element.tags?.['opening_hours'] ? this.parseOpeningHours(element.tags.opening_hours) : 'Open 24/7', // Default hospitals to 24/7
            distance: this.calculateDistance(latitude, longitude, element.lat || element.center?.lat, element.lon || element.center?.lon),
            hasNICU: nicuConfidence >= 2,
            nicuConfidence,
            nicuStatus: this.getNICUStatus(nicuConfidence),
            phone: element.tags?.phone || null,
            type: 'hospital',
            website: element.tags?.website || null,
            emergency: element.tags?.emergency === 'yes',
            specialties: specialtyInfo.specialties,
            beds: element.tags?.beds || null,
            amenity: element.tags?.amenity || element.tags?.healthcare
          };
        })
        .sort((a, b) => {
          // Sort by NICU confidence first, then distance
          if (a.nicuConfidence !== b.nicuConfidence) return b.nicuConfidence - a.nicuConfidence;
          return a.distance - b.distance;
        })
        .slice(0, 30); // Increase to 30 results
      
      this.setCachedResult(cacheKey, hospitals);
      
      // If we got very few results, try additional search
      if (hospitals.length < 20) {
        console.log('Few hospitals found, trying additional search...');
        const additionalHospitals = await this.searchNominatimHospitals(latitude, longitude, radius);
        const combinedResults = [...hospitals, ...additionalHospitals]
          .filter((hospital, index, self) => 
            index === self.findIndex(h => h.name === hospital.name && Math.abs(h.latitude - hospital.latitude) < 0.001)
          ) // Remove duplicates
          .sort((a, b) => {
            if (a.nicuConfidence !== b.nicuConfidence) return b.nicuConfidence - a.nicuConfidence;
            return a.distance - b.distance;
          })
          .slice(0, 30);
        
        this.setCachedResult(cacheKey, combinedResults);
        return combinedResults;
      }
      
      return hospitals;
    } catch (error) {
      console.error('Error finding hospitals:', error);
      return [];
    }
  }

  // Backup search using Nominatim API for pharmacies
  static async searchNominatimPharmacies(latitude, longitude, radius) {
    try {
      const radiusInDegrees = radius / 111000; // Convert meters to approximate degrees
      const searchTerms = ['pharmacy', 'chemist', 'medical store', 'drug store', 'dawakhana'];
      let allResults = [];
      
      for (const term of searchTerms) {
        try {
          const url = `${NOMINATIM_API_URL}?format=json&q=${encodeURIComponent(term)}&limit=20&bounded=1&viewbox=${longitude-radiusInDegrees},${latitude+radiusInDegrees},${longitude+radiusInDegrees},${latitude-radiusInDegrees}`;
          
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'GynAI-LocationService/1.0'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const pharmacies = data
              .filter(item => {
                const displayName = item.display_name?.toLowerCase() || '';
                return displayName.includes('pharmacy') || displayName.includes('chemist') || displayName.includes('medical');
              })
              .map(item => ({
                id: `nominatim_pharmacy_${item.osm_id}`,
                name: item.name || item.display_name?.split(',')[0] || 'Local Pharmacy',
                address: item.display_name || 'Address not available',
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
                rating: 0,
                isOpen: null,
                distance: this.calculateDistance(latitude, longitude, parseFloat(item.lat), parseFloat(item.lon)),
                phone: null,
                type: 'pharmacy',
                website: null,
                operator: null,
                source: 'nominatim'
              }));
            
            allResults = [...allResults, ...pharmacies];
          }
        } catch (err) {
          console.log(`Failed Nominatim search for ${term}:`, err);
        }
      }
      
      return allResults
        .filter(pharmacy => pharmacy.distance <= radius / 1000) // Filter by actual distance
        .sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Nominatim pharmacy search error:', error);
      return [];
    }
  }

  // Backup search using Nominatim API for hospitals
  static async searchNominatimHospitals(latitude, longitude, radius) {
    try {
      const radiusInDegrees = radius / 111000;
      const searchTerms = ['hospital', 'medical center', 'clinic', 'emergency', 'maternity hospital'];
      let allResults = [];
      
      for (const term of searchTerms) {
        try {
          const url = `${NOMINATIM_API_URL}?format=json&q=${encodeURIComponent(term)}&limit=15&bounded=1&viewbox=${longitude-radiusInDegrees},${latitude+radiusInDegrees},${longitude+radiusInDegrees},${latitude-radiusInDegrees}`;
          
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'GynAI-LocationService/1.0'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const hospitals = data
              .filter(item => {
                const displayName = item.display_name?.toLowerCase() || '';
                return displayName.includes('hospital') || displayName.includes('medical') || displayName.includes('clinic');
              })
              .map(item => {
                const hospitalName = item.name || item.display_name?.split(',')[0] || 'Local Hospital';
                const nicuConfidence = this.detectNICUConfidence(hospitalName, { specialties: [], nicuIndicators: [] });
                
                return {
                  id: `nominatim_hospital_${item.osm_id}`,
                  name: hospitalName,
                  address: item.display_name || 'Address not available',
                  latitude: parseFloat(item.lat),
                  longitude: parseFloat(item.lon),
                  rating: 0,
                  isOpen: 'Open 24/7', // Default hospitals to 24/7
                  distance: this.calculateDistance(latitude, longitude, parseFloat(item.lat), parseFloat(item.lon)),
                  hasNICU: nicuConfidence >= 2,
                  nicuConfidence,
                  nicuStatus: this.getNICUStatus(nicuConfidence),
                  phone: null,
                  type: 'hospital',
                  website: null,
                  emergency: false,
                  specialties: [],
                  beds: null,
                  source: 'nominatim'
                };
              });
            
            allResults = [...allResults, ...hospitals];
          }
        } catch (err) {
          console.log(`Failed Nominatim search for ${term}:`, err);
        }
      }
      
      return allResults
        .filter(hospital => hospital.distance <= radius / 1000)
        .sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Nominatim hospital search error:', error);
      return [];
    }
  }

  // Helper methods for OpenStreetMap data processing
  static formatAddress(tags) {
    if (!tags) return 'Address not available';
    
    const parts = [];
    if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
    if (tags['addr:street']) parts.push(tags['addr:street']);
    if (tags['addr:city']) parts.push(tags['addr:city']);
    if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
    
    if (parts.length > 0) return parts.join(', ');
    
    // Fallback to generic address info
    if (tags.addr) return tags.addr;
    return 'Address not available';
  }

  static parseOpeningHours(openingHours) {
    if (!openingHours) return 'Open 24/7'; // Most hospitals are 24/7 by default
    
    // Simple check for common patterns
    if (openingHours.includes('24/7')) return 'Open 24/7';
    if (openingHours.includes('Mo-Su') && openingHours.includes('00:00-24:00')) return 'Open 24/7';
    if (openingHours.includes('Mo-Su')) return 'Open daily';
    if (openingHours.includes('closed')) return 'Closed';
    
    // For hospitals, assume 24/7 unless explicitly stated otherwise
    return openingHours.length > 20 ? 'Check hours' : openingHours;
  }

  static getHospitalSpecialties(tags) {
    const specialties = [];
    let nicuIndicators = [];
    
    // Check specific medical specialty tags
    if (tags['healthcare:speciality']) {
      const specialtiesStr = tags['healthcare:speciality'];
      specialties.push(...specialtiesStr.split(';').map(s => s.trim()));
      
      // NICU-related specialties
      if (specialtiesStr.toLowerCase().includes('neonatology')) nicuIndicators.push('neonatology_specialty');
      if (specialtiesStr.toLowerCase().includes('obstetrics')) nicuIndicators.push('obstetrics_specialty');
      if (specialtiesStr.toLowerCase().includes('gynaecology')) nicuIndicators.push('gynecology_specialty');
      if (specialtiesStr.toLowerCase().includes('pediatrics')) nicuIndicators.push('pediatrics_specialty');
    }
    
    // Check other relevant tags
    if (tags.emergency === 'yes') {
      specialties.push('Emergency');
      nicuIndicators.push('emergency_services');
    }
    
    if (tags['healthcare'] === 'hospital' && tags['hospital'] === 'general') {
      specialties.push('General Hospital');
      nicuIndicators.push('general_hospital');
    }
    
    return { specialties, nicuIndicators };
  }

  static detectNICUConfidence(hospitalName, specialtyInfo) {
    const lowerName = hospitalName.toLowerCase();
    let confidence = 0;
    
    // High confidence indicators (3 points each)
    const highNICUKeywords = [
      'nicu', 'neonatal intensive care', 'newborn intensive care',
      'neonatology', 'children hospital', 'maternity hospital'
    ];
    
    highNICUKeywords.forEach(keyword => {
      if (lowerName.includes(keyword)) confidence += 3;
    });
    
    // Check specialty indicators from OpenStreetMap tags
    if (specialtyInfo.nicuIndicators.includes('neonatology_specialty')) confidence += 3;
    if (specialtyInfo.nicuIndicators.includes('obstetrics_specialty')) confidence += 2;
    if (specialtyInfo.nicuIndicators.includes('pediatrics_specialty')) confidence += 2;
    
    // Medium confidence indicators (2 points each)
    const mediumNICUKeywords = [
      'maternity', 'obstetric', 'gynecology', 'gynaecology', 'women hospital',
      'mother', 'pediatric', 'paediatric', 'baby', 'newborn', 'perinatal'
    ];
    
    mediumNICUKeywords.forEach(keyword => {
      if (lowerName.includes(keyword)) confidence += 2;
    });
    
    // Low confidence indicators (1 point each)
    const lowNICUKeywords = [
      'intensive care', 'emergency', 'general hospital', 'medical center',
      'teaching hospital', 'university hospital', 'regional hospital'
    ];
    
    lowNICUKeywords.forEach(keyword => {
      if (lowerName.includes(keyword)) confidence += 1;
    });
    
    // Bonus for emergency services (often correlates with NICU)
    if (specialtyInfo.nicuIndicators.includes('emergency_services')) confidence += 1;
    if (specialtyInfo.nicuIndicators.includes('general_hospital')) confidence += 1;
    
    return Math.min(confidence, 5); // Cap at 5
  }

  static getNICUStatus(confidence) {
    if (confidence >= 4) return { text: 'NICU Confirmed ✅', color: '#10B981', badge: '🏥' };
    if (confidence >= 3) return { text: 'NICU Very Likely ✅', color: '#059669', badge: '🏥' };
    if (confidence >= 2) return { text: 'NICU Likely 🟡', color: '#F59E0B', badge: '🏥' };
    if (confidence >= 1) return { text: 'NICU Possible ⚪', color: '#6B7280', badge: '🏥' };
    return { text: 'NICU Unknown ❓', color: '#9CA3AF', badge: '🏥' };
  }

  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  static formatDistance(distance) {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance}km`;
  }
}

// Default export to prevent expo-router warnings
export default LocationService;

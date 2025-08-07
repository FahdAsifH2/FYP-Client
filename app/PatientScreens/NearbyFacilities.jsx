import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Linking,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LocationService } from '../services/locationService';

const PHONE_NUMBER_CLEAN_REGEX = /[^+\d]/g;

const NearbyFacilities = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pharmacies');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      setLoading(true);
      const location = await LocationService.getCurrentLocation();
      setUserLocation(location);
      
      // Load both pharmacies and hospitals
      await Promise.all([
        loadPharmacies(location),
        loadHospitals(location)
      ]);
    } catch (error) {
      Alert.alert(
        'Location Required', 
        'This feature requires location access to find nearby facilities. Please enable location services in your device settings and try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: () => initializeLocation() }
        ]
      );
      console.error('Location error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPharmacies = async (location) => {
    try {
      const result = await LocationService.findNearbyPharmacies(
        location.latitude,
        location.longitude,
        5000 // 5km radius
      );
      setPharmacies(result);
    } catch (error) {
      console.error('Error loading pharmacies:', error);
      Alert.alert('Error', 'Could not load nearby pharmacies');
    }
  };

  const loadHospitals = async (location) => {
    try {
      const result = await LocationService.findNearbyHospitalsWithNICU(
        location.latitude,
        location.longitude,
        15000 // 15km radius
      );
      setHospitals(result);
    } catch (error) {
      console.error('Error loading hospitals:', error);
      Alert.alert('Error', 'Could not load nearby hospitals');
    }
  };

  const openMaps = (latitude, longitude, name) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const label = name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url).catch(err => {
      console.error('Error opening maps:', err);
      Alert.alert('Error', 'Could not open maps application');
    });
  };

  const callPhone = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert('No Phone Number', 'Phone number not available for this facility');
      return;
    }
    
    const cleanNumber = phoneNumber.replace(PHONE_NUMBER_CLEAN_REGEX, '');
    Linking.openURL(`tel:${cleanNumber}`).catch(err => {
      console.error('Error making call:', err);
      Alert.alert('Error', 'Could not make phone call');
    });
  };

  const getNICUBadgeColor = (confidence) => {
    if (confidence >= 4) return '#10B981'; // High confidence - Green
    if (confidence >= 2) return '#F59E0B'; // Medium confidence - Orange
    return '#6B7280'; // Low confidence - Gray
  };

  const getNICUBadgeText = (confidence) => {
    if (confidence >= 4) return 'NICU ✓';
    if (confidence >= 2) return 'Likely NICU';
    return 'NICU?';
  };

  const FacilityCard = ({ facility }) => (
    <View style={styles.facilityCard}>
      <View style={styles.facilityHeader}>
        <View style={styles.facilityInfo}>
          <Text style={styles.facilityName}>{facility.name}</Text>
          <Text style={styles.facilityAddress}>{facility.address}</Text>
          <View style={styles.facilityMeta}>
            <View style={styles.distanceContainer}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.distance}>
                {LocationService.formatDistance(facility.distance)}
              </Text>
            </View>
            
            {facility.rating > 0 && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.rating}>{facility.rating}</Text>
              </View>
            )}
            
            {facility.isOpen !== null && (
              <View style={[
                styles.statusContainer,
                { backgroundColor: facility.isOpen ? '#10B981' : '#EF4444' }
              ]}>
                <Text style={styles.statusText}>
                  {facility.isOpen ? 'Open' : 'Closed'}
                </Text>
              </View>
            )}
            
            {facility.hasNICU && (
              <View style={[
                styles.nicuBadge,
                { backgroundColor: getNICUBadgeColor(facility.nicuConfidence || 0) }
              ]}>
                <Text style={styles.nicuText}>
                  {getNICUBadgeText(facility.nicuConfidence || 0)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.directionsButton]}
          onPress={() => openMaps(facility.latitude, facility.longitude, facility.name)}
        >
          <Ionicons name="navigate" size={16} color="white" />
          <Text style={styles.actionButtonText}>Directions</Text>
        </TouchableOpacity>
        
        {facility.phone && (
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={() => callPhone(facility.phone)}
          >
            <Ionicons name="call" size={16} color="white" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const TabButton = ({ id, title, icon, count }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === id && styles.activeTab]}
      onPress={() => setActiveTab(id)}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color={activeTab === id ? '#8B5CF6' : '#6B7280'} 
      />
      <Text style={[styles.tabText, activeTab === id && styles.activeTabText]}>
        {title}
      </Text>
      {count > 0 && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const currentData = activeTab === 'pharmacies' ? pharmacies : hospitals;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Facilities</Text>
        <TouchableOpacity onPress={initializeLocation}>
          <Ionicons name="refresh" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Location Status */}
      {userLocation && (
        <View style={styles.locationStatus}>
          <Ionicons name="location" size={16} color="#10B981" />
          <Text style={styles.locationText}>
            Searching near your location
          </Text>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TabButton
          id="pharmacies"
          title="Pharmacies"
          icon="medical-outline"
          count={pharmacies.length}
        />
        <TabButton
          id="hospitals"
          title="Hospitals & NICU"
          icon="business-outline"
          count={hospitals.length}
        />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingText}>Finding nearby facilities...</Text>
          </View>
        ) : currentData.length > 0 ? (
          <>
            <Text style={styles.resultsCount}>
              Found {currentData.length} {activeTab === 'pharmacies' ? 'pharmacies' : 'hospitals'} nearby
            </Text>
            {currentData.map((facility, index) => (
              <FacilityCard key={facility.id || index} facility={facility} />
            ))}
          </>
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons 
              name={activeTab === 'pharmacies' ? 'medical-outline' : 'business-outline'} 
              size={48} 
              color="#9CA3AF" 
            />
            <Text style={styles.noResultsTitle}>No facilities found</Text>
            <Text style={styles.noResultsText}>
              Try expanding your search radius or check your internet connection
            </Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={initializeLocation}
            >
              <Text style={styles.retryButtonText}>Retry Search</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#ECFDF5',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#065F46',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#F3F4F6',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  countBadge: {
    marginLeft: 8,
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    marginVertical: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  facilityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  facilityHeader: {
    marginBottom: 12,
  },
  facilityInfo: {
    flex: 1,
  },
  facilityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  facilityAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  facilityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  statusContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  nicuBadge: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  nicuText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  directionsButton: {
    backgroundColor: '#3B82F6',
  },
  callButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NearbyFacilities;

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Alert, Linking } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import config from '../_config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const CATEGORIES = {
  lab_report: { label: 'Lab Report', icon: 'flask', color: '#3B82F6' },
  ultrasound: { label: 'Ultrasound', icon: 'scan', color: '#8B5CF6' },
  prescription: { label: 'Prescription', icon: 'document-text', color: '#10B981' },
  blood_work: { label: 'Blood Work', icon: 'water', color: '#EF4444' },
  scan: { label: 'Scan', icon: 'image', color: '#F59E0B' },
  discharge_summary: { label: 'Discharge', icon: 'clipboard', color: '#6366F1' },
  general: { label: 'General', icon: 'folder', color: '#6B7280' },
};

export default function SharedDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(null);

  const getToken = async () => await AsyncStorage.getItem('userToken');

  const fetchDocuments = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${config.API_URL}/api/documents/shared/with-me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(res.data.data || []);
    } catch (err) {
      console.error('Error fetching shared docs:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchDocuments();
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDocuments();
    setRefreshing(false);
  }, []);

  const viewDocument = async (docId, fileName, fileType) => {
    setDownloading(docId);
    try {
      const token = await getToken();
      const res = await axios.get(`${config.API_URL}/api/documents/${docId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const base64Data = res.data.data.file_data;
      const fileUri = FileSystem.cacheDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: fileType || 'application/pdf' });
      } else {
        Alert.alert('Downloaded', `File saved to cache: ${fileName}`);
      }
    } catch (err) {
      console.error('Error viewing document:', err);
      Alert.alert('Error', 'Failed to load document');
    }
    setDownloading(null);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  // Group by patient
  const groupedByPatient = documents.reduce((acc, doc) => {
    const name = doc.patient_name || 'Unknown';
    if (!acc[name]) acc[name] = [];
    acc[name].push(doc);
    return acc;
  }, {});

  const sections = Object.entries(groupedByPatient).map(([name, docs]) => ({ name, docs }));

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="pt-16 pb-4 px-6 bg-white shadow-sm flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800 flex-1">Shared Documents</Text>
        <Text className="text-sm text-gray-400">{documents.length} files</Text>
      </View>

      <FlatList
        className="flex-1 px-6 pt-4"
        data={sections}
        keyExtractor={item => item.name}
        renderItem={({ item: section }) => (
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-full bg-pink-100 justify-center items-center mr-2">
                <Ionicons name="person" size={16} color="#EC4899" />
              </View>
              <Text className="text-lg font-bold text-gray-800">{section.name}</Text>
              <View className="bg-gray-200 rounded-full px-2 py-0.5 ml-2">
                <Text className="text-gray-600 text-xs font-bold">{section.docs.length}</Text>
              </View>
            </View>

            {section.docs.map((doc) => {
              const cat = CATEGORIES[doc.category] || CATEGORIES.general;
              return (
                <TouchableOpacity
                  key={doc.id}
                  onPress={() => viewDocument(doc.id, doc.file_name, doc.file_type)}
                  disabled={downloading === doc.id}
                  className="bg-white rounded-2xl p-4 mb-2 border border-gray-100 flex-row items-center"
                >
                  <View className="w-10 h-10 rounded-xl justify-center items-center mr-3" style={{ backgroundColor: cat.color + '20' }}>
                    {downloading === doc.id ? (
                      <ActivityIndicator size="small" color={cat.color} />
                    ) : (
                      <Ionicons name={cat.icon} size={20} color={cat.color} />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-gray-900" numberOfLines={1}>{doc.title}</Text>
                    <Text className="text-xs text-gray-500">{cat.label} {doc.file_size ? `• ${formatSize(doc.file_size)}` : ''} • {new Date(doc.uploaded_at).toLocaleDateString()}</Text>
                  </View>
                  <Ionicons name="open-outline" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center py-16">
            <Ionicons name="documents-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 mt-4 text-lg">No shared documents</Text>
            <Text className="text-gray-300 text-sm mt-1">Documents shared by patients will appear here</Text>
          </View>
        )}
        ListFooterComponent={<View className="h-10" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

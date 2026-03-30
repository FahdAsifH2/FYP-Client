import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, Modal, TextInput, RefreshControl, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import config from '../_config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');
const GRID_GAP = 10;
const GRID_PADDING = 24;
const CELL = (width - GRID_PADDING * 2 - GRID_GAP * 2) / 3;

const CATEGORIES = [
  { value: 'lab_report', label: 'Lab Report', icon: 'flask', color: '#3B82F6', bg: '#EFF6FF' },
  { value: 'ultrasound', label: 'Ultrasound', icon: 'scan', color: '#ec4899', bg: '#F5F3FF' },
  { value: 'prescription', label: 'Rx', icon: 'document-text', color: '#10B981', bg: '#ECFDF5' },
  { value: 'blood_work', label: 'Blood', icon: 'water', color: '#EF4444', bg: '#FEF2F2' },
  { value: 'scan', label: 'Scan', icon: 'image', color: '#F59E0B', bg: '#FFFBEB' },
  { value: 'discharge_summary', label: 'Discharge', icon: 'clipboard', color: '#6366F1', bg: '#EEF2FF' },
  { value: 'general', label: 'General', icon: 'folder', color: '#6B7280', bg: '#F3F4F6' },
];

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [myDoctor, setMyDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [downloading, setDownloading] = useState(null);

  // Upload form state
  const [docTitle, setDocTitle] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [docCategory, setDocCategory] = useState('general');
  const [selectedFile, setSelectedFile] = useState(null);

  const getToken = async () => await AsyncStorage.getItem('userToken');

  const fetchDocuments = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${config.API_URL}/api/documents/my-documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(res.data.data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  const fetchMyDoctor = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${config.API_URL}/api/relationships/my-doctor`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyDoctor(res.data.data);
    } catch (err) {
      console.error('Error fetching doctor:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchDocuments(), fetchMyDoctor()]);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
        if (!docTitle) {
          setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    } catch (err) {
      console.error('Picker error:', err);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const uploadDocument = async () => {
    if (!selectedFile) {
      Alert.alert('No File', 'Please select a file first');
      return;
    }
    if (!docTitle.trim()) {
      Alert.alert('Title Required', 'Please enter a title for the document');
      return;
    }

    setUploading(true);
    try {
      const token = await getToken();
      const base64 = await FileSystem.readAsStringAsync(selectedFile.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await axios.post(`${config.API_URL}/api/documents/upload`, {
        title: docTitle.trim(),
        description: docDescription.trim() || null,
        fileName: selectedFile.name,
        fileType: selectedFile.mimeType || 'application/pdf',
        fileSize: selectedFile.size || 0,
        fileData: base64,
        category: docCategory,
      }, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 60000,
      });

      Alert.alert('Uploaded!', 'Your document has been uploaded successfully.');
      setShowUploadModal(false);
      resetUploadForm();
      await fetchDocuments();
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Error', 'Failed to upload document. The file may be too large.');
    }
    setUploading(false);
  };

  const resetUploadForm = () => {
    setDocTitle('');
    setDocDescription('');
    setDocCategory('general');
    setSelectedFile(null);
  };

  const shareWithDoctor = (docId, docTitle) => {
    if (!myDoctor) {
      Alert.alert('No Doctor', 'Connect with a doctor first to share documents.', [
        { text: 'Go to My Doctor', onPress: () => router.push('/PatientScreens/MyDoctor') },
        { text: 'Cancel', style: 'cancel' }
      ]);
      return;
    }

    Alert.alert('Share Document', `Share "${docTitle}" with ${myDoctor.doctor_name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Share',
        onPress: async () => {
          try {
            const token = await getToken();
            await axios.patch(`${config.API_URL}/api/documents/${docId}/share`,
              { doctorId: myDoctor.doctor_id },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert('Shared!', `Document shared with ${myDoctor.doctor_name}`);
            await fetchDocuments();
          } catch (err) {
            Alert.alert('Error', 'Failed to share document');
          }
        }
      }
    ]);
  };

  const unshareDocument = async (docId) => {
    try {
      const token = await getToken();
      await axios.patch(`${config.API_URL}/api/documents/${docId}/unshare`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchDocuments();
    } catch (err) {
      Alert.alert('Error', 'Failed to unshare document');
    }
  };

  const deleteDocument = (docId, title) => {
    Alert.alert('Delete Document', `Delete "${title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            const token = await getToken();
            await axios.delete(`${config.API_URL}/api/documents/${docId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            await fetchDocuments();
          } catch (err) {
            Alert.alert('Error', 'Failed to delete document');
          }
        }
      }
    ]);
  };

  const openDocument = async (docId, fileName, fileType) => {
    setDownloading(docId);
    try {
      const token = await getToken();
      const res = await axios.get(`${config.API_URL}/api/documents/${docId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const base64Data = res.data.data.file_data;
      const fileUri = FileSystem.cacheDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: fileType || 'application/pdf' });
      } else {
        Alert.alert('Downloaded', `File saved: ${fileName}`);
      }
    } catch (err) {
      console.error('Open document error:', err);
      Alert.alert('Error', 'Failed to open document');
    }
    setDownloading(null);
  };

  const getCategoryInfo = (cat) => CATEGORIES.find(c => c.value === cat) || CATEGORIES[6];

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  // Count docs per category
  const getCategoryCount = (catValue) => documents.filter(d => d.category === catValue).length;

  const filteredDocs = filterCategory === 'all' ? documents : documents.filter(d => d.category === filterCategory);

  const renderDocument = ({ item }) => {
    const catInfo = getCategoryInfo(item.category);
    return (
      <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm">
        <View className="flex-row items-start">
          <View className="w-12 h-12 rounded-xl justify-center items-center mr-3" style={{ backgroundColor: catInfo.color + '20' }}>
            <Ionicons name={catInfo.icon} size={24} color={catInfo.color} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-900" numberOfLines={1}>{item.title}</Text>
            <Text className="text-xs text-gray-500 mt-1">{catInfo.label} {item.file_size ? `• ${formatSize(item.file_size)}` : ''}</Text>
            {item.description && <Text className="text-xs text-gray-400 mt-1" numberOfLines={1}>{item.description}</Text>}
            <Text className="text-xs text-gray-400 mt-1">{new Date(item.uploaded_at).toLocaleDateString()}</Text>
          </View>
        </View>

        {item.shared_with_doctor && (
          <View className="bg-green-50 rounded-xl p-2 mt-3 flex-row items-center">
            <Ionicons name="share-social" size={14} color="#10B981" />
            <Text className="text-green-700 text-xs font-medium ml-1">Shared with your doctor</Text>
          </View>
        )}

        <View className="flex-row mt-3 border-t border-gray-50 pt-3" style={{ gap: 16 }}>
          <TouchableOpacity
            onPress={() => openDocument(item.id, item.file_name, item.file_type)}
            disabled={downloading === item.id}
            className="flex-row items-center"
          >
            {downloading === item.id
              ? <ActivityIndicator size="small" color="#ec4899" />
              : <Ionicons name="open-outline" size={18} color="#ec4899" />}
            <Text className="text-gynai-pink text-xs font-bold ml-1">Open</Text>
          </TouchableOpacity>

          {!item.shared_with_doctor ? (
            <TouchableOpacity onPress={() => shareWithDoctor(item.id, item.title)} className="flex-row items-center">
              <Ionicons name="share-outline" size={18} color="#10B981" />
              <Text className="text-green-600 text-xs font-bold ml-1">Share</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => unshareDocument(item.id)} className="flex-row items-center">
              <Ionicons name="eye-off-outline" size={18} color="#F59E0B" />
              <Text className="text-yellow-600 text-xs font-bold ml-1">Unshare</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => deleteDocument(item.id, item.title)} className="flex-row items-center">
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
            <Text className="text-red-500 text-xs font-bold ml-1">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-16 pb-4 px-6 bg-white shadow-sm border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800 tracking-tight flex-1">My Documents</Text>
          <View className="bg-gynai-pink-bg rounded-full px-3 py-1">
            <Text className="text-gynai-pink-dark font-bold text-xs">{documents.length}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Bento Grid - Upload + Category Tiles */}
        <View style={{ padding: GRID_PADDING, paddingBottom: 0 }}>
          {/* Row 1: Upload (2/3) + Stats (1/3) */}
          <View style={{ flexDirection: 'row', gap: GRID_GAP, marginBottom: GRID_GAP }}>
            <TouchableOpacity
              onPress={() => setShowUploadModal(true)}
              style={{
                flex: 2,
                backgroundColor: '#ec4899',
                borderRadius: 20,
                padding: 20,
                justifyContent: 'center',
                minHeight: CELL + 20,
              }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                <Ionicons name="cloud-upload" size={26} color="white" />
              </View>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '800' }}>Upload</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 }}>PDF, Images</Text>
            </TouchableOpacity>

            <View style={{ flex: 1, gap: GRID_GAP }}>
              <View style={{
                flex: 1,
                backgroundColor: '#F5F3FF',
                borderRadius: 16,
                padding: 14,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#ec4899' }}>{documents.length}</Text>
                <Text style={{ fontSize: 10, color: '#7C3AED', fontWeight: '600', marginTop: 2 }}>Total Files</Text>
              </View>
              <View style={{
                flex: 1,
                backgroundColor: documents.filter(d => d.shared_with_doctor).length > 0 ? '#ECFDF5' : '#F3F4F6',
                borderRadius: 16,
                padding: 14,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: documents.filter(d => d.shared_with_doctor).length > 0 ? '#10B981' : '#9CA3AF' }}>
                  {documents.filter(d => d.shared_with_doctor).length}
                </Text>
                <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '600', marginTop: 2 }}>Shared</Text>
              </View>
            </View>
          </View>

          {/* Category Bento Grid - 3 columns */}
          <View style={{ marginBottom: 8 }}>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-bold text-gray-500 tracking-wide">CATEGORIES</Text>
              {filterCategory !== 'all' && (
                <TouchableOpacity onPress={() => setFilterCategory('all')}>
                  <Text className="text-xs font-bold text-gynai-pink">Clear Filter</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP }}>
              {CATEGORIES.map(cat => {
                const count = getCategoryCount(cat.value);
                const isActive = filterCategory === cat.value;
                return (
                  <TouchableOpacity
                    key={cat.value}
                    onPress={() => setFilterCategory(isActive ? 'all' : cat.value)}
                    style={{
                      width: CELL,
                      backgroundColor: isActive ? cat.color : cat.bg,
                      borderRadius: 16,
                      padding: 14,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: isActive ? 0 : 1,
                      borderColor: isActive ? 'transparent' : cat.color + '20',
                      minHeight: CELL * 0.85,
                    }}
                  >
                    <View style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : cat.color + '20',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}>
                      <Ionicons name={cat.icon} size={18} color={isActive ? 'white' : cat.color} />
                    </View>
                    <Text style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: isActive ? 'white' : '#374151',
                      textAlign: 'center',
                    }}>{cat.label}</Text>
                    {count > 0 && (
                      <View style={{
                        backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : cat.color + '20',
                        borderRadius: 8,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        marginTop: 4,
                      }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: isActive ? 'white' : cat.color }}>{count}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Documents List */}
        <View style={{ paddingHorizontal: GRID_PADDING }}>
          <View className="flex-row items-center justify-between mb-3 mt-2">
            <Text className="text-sm font-bold text-gray-500 tracking-wide">
              {filterCategory === 'all' ? 'ALL DOCUMENTS' : getCategoryInfo(filterCategory).label.toUpperCase()}
            </Text>
            <Text className="text-xs text-gray-400">{filteredDocs.length} files</Text>
          </View>

          {filteredDocs.length === 0 ? (
            <View className="items-center py-12">
              <Ionicons name="documents-outline" size={64} color="#D1D5DB" />
              <Text className="text-gray-400 mt-4 text-lg">No documents yet</Text>
              <Text className="text-gray-300 text-sm mt-1">Upload your first clinical document</Text>
            </View>
          ) : (
            filteredDocs.map(item => (
              <View key={String(item.id)}>
                {renderDocument({ item })}
              </View>
            ))
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Floating Upload Button */}
      <TouchableOpacity
        onPress={() => setShowUploadModal(true)}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundColor: '#ec4899',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#ec4899',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Upload Modal */}
      <Modal visible={showUploadModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <ScrollView className="bg-white rounded-t-3xl px-6 pt-6 pb-10" style={{ maxHeight: '90%' }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-900">Upload Document</Text>
              <TouchableOpacity onPress={() => { setShowUploadModal(false); resetUploadForm(); }}>
                <Ionicons name="close" size={28} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* File Picker */}
            <TouchableOpacity
              onPress={pickDocument}
              className="border-2 border-dashed border-gynai-pink-border rounded-2xl p-6 items-center mb-4 bg-gynai-pink-bg"
            >
              {selectedFile ? (
                <View className="items-center">
                  <Ionicons name="document-attach" size={36} color="#ec4899" />
                  <Text className="text-gynai-pink-dark font-bold mt-2" numberOfLines={1}>{selectedFile.name}</Text>
                  <Text className="text-gynai-muted text-xs mt-1">{formatSize(selectedFile.size)} - Tap to change</Text>
                </View>
              ) : (
                <View className="items-center">
                  <Ionicons name="cloud-upload-outline" size={48} color="#ec4899" />
                  <Text className="text-gynai-pink font-bold mt-2">Tap to select file</Text>
                  <Text className="text-gynai-muted text-xs mt-1">PDF, Images supported</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Title */}
            <Text className="text-gray-700 font-bold mb-2">Title *</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 text-gray-800"
              placeholder="e.g., Blood Test Results - March 2026"
              placeholderTextColor="#9CA3AF"
              value={docTitle}
              onChangeText={setDocTitle}
            />

            {/* Category - Grid of squares */}
            <Text className="text-gray-700 font-bold mb-3">Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {CATEGORIES.map(cat => {
                const isSelected = docCategory === cat.value;
                return (
                  <TouchableOpacity
                    key={cat.value}
                    onPress={() => setDocCategory(cat.value)}
                    style={{
                      width: (width - 48 - 24) / 4,
                      backgroundColor: isSelected ? cat.color : cat.bg,
                      borderRadius: 14,
                      paddingVertical: 14,
                      alignItems: 'center',
                      borderWidth: isSelected ? 0 : 1,
                      borderColor: cat.color + '30',
                    }}
                  >
                    <Ionicons name={cat.icon} size={20} color={isSelected ? 'white' : cat.color} />
                    <Text style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: isSelected ? 'white' : '#374151',
                      marginTop: 4,
                    }}>{cat.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Description */}
            <Text className="text-gray-700 font-bold mb-2">Description (optional)</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-gray-800"
              placeholder="Add any notes about this document..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={docDescription}
              onChangeText={setDocDescription}
            />

            <TouchableOpacity
              onPress={uploadDocument}
              disabled={uploading || !selectedFile}
              className={`rounded-2xl py-4 items-center ${uploading || !selectedFile ? 'bg-gray-300' : 'bg-gynai-pink'}`}
            >
              {uploading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator color="white" />
                  <Text className="text-white font-bold text-lg ml-2">Uploading...</Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-lg">Upload Document</Text>
              )}
            </TouchableOpacity>
            <View className="h-6" />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../_contexts/AuthContext';
import config from '../_config/config';

const SUGGESTION_QUERIES = [
  'All patients in 2nd trimester with cousin marriage',
  'Patients with family history of thalassemia',
  'List all high-risk patients with hypertension',
  'Patients with diabetes in third trimester',
  'How many patients have previous C-sections?',
];

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hello Doctor 👋\n\nI am GynAI — your intelligent medical assistant. I have access to your patients\' antenatal records and can answer questions like:\n\n• "All 2nd trimester patients with cousin marriages"\n• "Full report on [Patient Name]"\n• "Patients with family history of thalassemia"\n\nHow can I assist you today?',
  timestamp: new Date(),
};

export default function DoctorChatbot() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const flatListRef = useRef(null);

  const sendMessage = useCallback(
    async (text) => {
      const query = (text || inputText).trim();
      if (!query || isLoading) return;

      setInputText('');
      setIsLoading(true);

      const userMsg = {
        id: Date.now().toString(),
        role: 'user',
        content: query,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const response = await fetch(`${config.EXPRESS_API_URL}/api/chatbot/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: query,
            conversationHistory,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Request failed');
        }

        const assistantMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          llmUsed: data.llmUsed,
          resultsCount: data.resultsCount,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setConversationHistory((prev) => [
          ...prev,
          { role: 'user', content: query },
          { role: 'assistant', content: data.response },
        ]);
      } catch (err) {
        const errMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Sorry, I encountered an error: ${err.message}. Please check your connection or try again.`,
          timestamp: new Date(),
          isError: true,
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsLoading(false);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }
    },
    [inputText, isLoading, conversationHistory, token]
  );

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';

    return (
      <View
        className={`mb-3 max-w-[85%] ${isUser ? 'self-end' : 'self-start'}`}
      >
        {!isUser && (
          <View className="flex-row items-center mb-1">
            <View className="w-6 h-6 rounded-full bg-primary-500 items-center justify-center mr-2">
              <Ionicons name="medical" size={12} color="white" />
            </View>
            <Text className="text-xs text-gynai-gray-500 font-medium">GynAI</Text>
            {item.llmUsed && (
              <Text className="text-xs text-gynai-gray-400 ml-2">
                via {item.llmUsed === 'ollama' ? '🦙 Ollama' : '✨ Gemini'}
              </Text>
            )}
          </View>
        )}

        <View
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-primary-500 rounded-tr-sm'
              : item.isError
              ? 'bg-red-50 border border-red-200 rounded-tl-sm'
              : 'bg-white shadow-sm shadow-black/5 rounded-tl-sm'
          }`}
        >
          <Text
            className={`text-sm leading-5 ${
              isUser
                ? 'text-white'
                : item.isError
                ? 'text-red-700'
                : 'text-gynai-gray-800'
            }`}
          >
            {item.content}
          </Text>
        </View>

        {!isUser && item.resultsCount !== undefined && (
          <Text className="text-xs text-gynai-gray-400 mt-1 ml-1">
            {item.resultsCount} record{item.resultsCount !== 1 ? 's' : ''} found
          </Text>
        )}
      </View>
    );
  };

  const renderSuggestion = (query, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => sendMessage(query)}
      className="bg-white border border-gynai-gray-200 rounded-full px-4 py-2 mr-2 mb-2"
    >
      <Text className="text-xs text-gynai-gray-600">{query}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={{ backgroundColor: '#fff', paddingTop: Platform.OS === 'ios' ? 54 : 36, paddingBottom: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-bold text-gynai-gray-800">AI Medical Assistant</Text>
          <Text className="text-xs text-gynai-gray-500">Ask anything about your patients</Text>
        </View>
        <View className="w-2 h-2 rounded-full bg-green-400" />
      </View>

      {/* KAV wraps everything below header so input lifts above keyboard */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Suggestions (only visible at start) */}
        {messages.length <= 1 && (
          <View className="px-4 pt-3">
            <Text className="text-xs text-gynai-gray-500 mb-2 font-medium">Try asking:</Text>
            <View className="flex-row flex-wrap">
              {SUGGESTION_QUERIES.map((q, i) => renderSuggestion(q, i))}
            </View>
          </View>
        )}

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Typing indicator */}
        {isLoading && (
          <View className="px-4 pb-2 self-start">
            <View className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm shadow-black/5 flex-row items-center">
              <ActivityIndicator size="small" color="#ec4899" />
              <Text className="text-gynai-gray-500 text-sm ml-2">Analysing patient records…</Text>
            </View>
          </View>
        )}

        {/* Input bar */}
        <View className="bg-white border-t border-gynai-gray-100 px-4 py-3 flex-row items-end">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about your patients…"
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm text-gynai-gray-800 max-h-28 mr-3"
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          <TouchableOpacity
            onPress={() => sendMessage()}
            disabled={!inputText.trim() || isLoading}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              inputText.trim() && !isLoading ? 'bg-primary-500' : 'bg-gynai-gray-200'
            }`}
          >
            <Ionicons
              name="send"
              size={18}
              color={inputText.trim() && !isLoading ? 'white' : '#9CA3AF'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  View,
  useColorScheme,
} from "react-native";

export default function Index() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [form, setForm] = useState({
    name: "",
    gravida: "",
    previousCSections: "no",
    age: "",
    height: "",
    bloodPressure: "",
    bloodSugar: "",
    fetalPosition: "unknown",
  });

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    const data = {
      ...form,
      gravida: Number(form.gravida),
      age: Number(form.age),
      height: Number(form.height),
      bloodSugar: Number(form.bloodSugar),
      previous_c_sections: form.previousCSections === "yes",
    };
    
    Alert.alert("Form Submitted", JSON.stringify(data, null, 2));
  };

  const styles = createStyles(isDark);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Patient Info</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={form.name}
            onChangeText={(value) => updateForm('name', value)}
            returnKeyType="next"
            blurOnSubmit={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Gravida"
            value={form.gravida}
            onChangeText={(value) => updateForm('gravida', value)}
            keyboardType="numeric"
            returnKeyType="next"
            blurOnSubmit={false}
          />

          <Text style={styles.label}>Previous C-Sections</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                form.previousCSections === "no" && styles.toggleButtonActive
              ]}
              onPress={() => updateForm('previousCSections', 'no')}
            >
              <Text style={[
                styles.toggleText,
                form.previousCSections === "no" && styles.toggleTextActive
              ]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                form.previousCSections === "yes" && styles.toggleButtonActive
              ]}
              onPress={() => updateForm('previousCSections', 'yes')}
            >
              <Text style={[
                styles.toggleText,
                form.previousCSections === "yes" && styles.toggleTextActive
              ]}>Yes</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Age"
            value={form.age}
            onChangeText={(value) => updateForm('age', value)}
            keyboardType="numeric"
            returnKeyType="next"
            blurOnSubmit={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Height (cm)"
            value={form.height}
            onChangeText={(value) => updateForm('height', value)}
            keyboardType="numeric"
            returnKeyType="next"
            blurOnSubmit={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Blood Pressure (120/80)"
            value={form.bloodPressure}
            onChangeText={(value) => updateForm('bloodPressure', value)}
            returnKeyType="next"
            blurOnSubmit={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Blood Sugar (fasting)"
            value={form.bloodSugar}
            onChangeText={(value) => updateForm('bloodSugar', value)}
            keyboardType="numeric"
            returnKeyType="done"
          />

          <Text style={styles.label}>Fetal Position</Text>
          <View style={styles.segmentContainer}>
            {['unknown', 'cephalic', 'breech'].map((position) => (
              <TouchableOpacity
                key={position}
                style={[
                  styles.segmentButton,
                  form.fetalPosition === position && styles.segmentButtonActive
                ]}
                onPress={() => updateForm('fetalPosition', position)}
              >
                <Text style={[
                  styles.segmentText,
                  form.fetalPosition === position && styles.segmentTextActive
                ]}>
                  {position.charAt(0).toUpperCase() + position.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const createStyles = (isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? "#1a1a1a" : "#f8f9fa",
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: isDark ? "#ffffff" : "#2c3e50",
    marginBottom: 30,
  },
  input: {
    backgroundColor: isDark ? "#2d2d2d" : "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: isDark ? "#404040" : "#e1e8ed",
    fontSize: 16,
    color: isDark ? "#ffffff" : "#000000",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: isDark ? "#e0e0e0" : "#34495e",
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: isDark ? "#2d2d2d" : "#fff",
    borderWidth: 1,
    borderColor: isDark ? "#404040" : "#e1e8ed",
    overflow: "hidden",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: isDark ? "#2d2d2d" : "#fff",
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#3498db",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: isDark ? "#b0b0b0" : "#7f8c8d",
  },
  toggleTextActive: {
    color: "#fff",
  },
  segmentContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: isDark ? "#2d2d2d" : "#fff",
    borderWidth: 1,
    borderColor: isDark ? "#404040" : "#e1e8ed",
    overflow: "hidden",
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: isDark ? "#2d2d2d" : "#fff",
    alignItems: "center",
  },
  segmentButtonActive: {
    backgroundColor: "#3498db",
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "600",
    color: isDark ? "#b0b0b0" : "#7f8c8d",
  },
  segmentTextActive: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});
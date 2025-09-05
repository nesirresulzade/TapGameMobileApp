import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createUserProfile } from '../../firebaseConfig';
import { auth } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const { alertState, showError, showSuccess, hideAlert } = useCustomAlert();

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !nickname.trim()) {
      showError('Xəta', 'Bütün sahələri doldurun');
      return;
    }

    if (password !== confirmPassword) {
      showError('Xəta', 'Şifrələr uyğun gəlmir');
      return;
    }

    if (password.length < 6) {
      showError('Xəta', 'Şifrə ən azı 6 simvol olmalıdır');
      return;
    }

    if (nickname.length < 3) {
      showError('Xəta', 'Nickname ən azı 3 simvol olmalıdır');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userData = {
        email: user.email,
        nickname: nickname.trim(),
        displayName: nickname.trim(),
        photoURL: null,
        emailVerified: false
      };

      const profileCreated = await createUserProfile(user.uid, userData);
      
      if (profileCreated) {
        showSuccess(
          'Uğurlu!',
          'Hesab yaradıldı və profil yaradıldı!',
          [{ text: 'Tamam' }]
        );
      } else {
        showError(
          'Diqqət',
          'Hesab yaradıldı amma profil yaradılmadı. Daha sonra yenidən cəhd edin.',
          [{ text: 'Tamam' }]
        );
      }
    } catch (error) {
      let errorMessage = 'Qeydiyyat zamanı xəta baş verdi';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Bu email artıq istifadə olunub';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Düzgün email daxil edin';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Şifrə çox zəifdir';
      }
      
      showError('Xəta', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>⚡</Text>
            </View>
            <Text style={styles.title}>Tap Game</Text>
            <Text style={styles.subtitle}>Yeni hesab yaradın</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Nickname Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <Ionicons name="person" size={20} color="#0f3460" />
                <Text style={styles.inputLabel}>Nickname</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={nickname}
                onChangeText={setNickname}
                placeholder="Nickname daxil edin"
                placeholderTextColor="#a8a8a8"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <Ionicons name="mail" size={20} color="#0f3460" />
                <Text style={styles.inputLabel}>Email</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Email daxil edin"
                placeholderTextColor="#a8a8a8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <Ionicons name="lock-closed" size={20} color="#0f3460" />
                <Text style={styles.inputLabel}>Şifrə</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Şifrə daxil edin"
                placeholderTextColor="#a8a8a8"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <Ionicons name="lock-closed" size={20} color="#0f3460" />
                <Text style={styles.inputLabel}>Şifrəni Təsdiqlə</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Şifrəni təkrar daxil edin"
                placeholderTextColor="#a8a8a8"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.disabledButton]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Ionicons name="person-add" size={24} color="#ffffff" />
              <Text style={styles.signUpButtonText}>
                {loading ? 'Yaradılır...' : 'Qeydiyyatdan Keç'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginLinkText}>Artıq hesabınız var?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Giriş edin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        type={alertState.type}
        onClose={hideAlert}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#0f3460',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#27ae60',
  },
  logoText: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: '#0f3460',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#a8a8a8',
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  textInput: {
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#0f3460',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#ffffff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  signUpButton: {
    backgroundColor: '#27ae60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  disabledButton: {
    backgroundColor: '#7f8c8d',
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loginLinkText: {
    fontSize: 16,
    color: '#a8a8a8',
  },
  loginLink: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '600',
  },
});

export default SignUpScreen;

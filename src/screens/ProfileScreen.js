import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { auth } from '../../firebaseConfig';
import { getUserProfile, updateUserProfile } from '../../firebaseConfig';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import CustomAlert from '../components/CustomAlert';
import LoadingScreen from '../components/LoadingScreen';
import useCustomAlert from '../hooks/useCustomAlert';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { alertState, showError, showSuccess, hideAlert } = useCustomAlert();

  const getVisibleId = () => {
    const pid = userProfile?.publicId;
    if (pid && typeof pid === 'string') {
      return pid.startsWith('#') ? pid : `#${pid}`;
    }
    const uid = auth.currentUser?.uid || '';
    if (!uid) return '';
    return `#${uid.slice(0, 2)}${uid.slice(-4)}`;
  };

  const TAP_LEVELS = [10, 20, 30, 40, 50];

  const getTapBestTime = () => {
    const lp = userProfile?.levelProgress || {};
    const times = TAP_LEVELS
      .map(k => (lp[k] && typeof lp[k].bestTime === 'number' ? lp[k].bestTime : 0))
      .filter(t => t && t > 0);
    if (!times.length) return 0;
    return Math.min(...times);
  };

  const getTapAvgTime = () => {
    const lp = userProfile?.levelProgress || {};
    const times = TAP_LEVELS
      .map(k => (lp[k] && typeof lp[k].bestTime === 'number' ? lp[k].bestTime : 0))
      .filter(t => t && t > 0);
    if (!times.length) return 0;
    return times.reduce((s, t) => s + t, 0) / times.length;
  };

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      if (auth.currentUser) {
        const profile = await getUserProfile(auth.currentUser.uid);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      showError('Xəta', 'Profil yüklənərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  // Refresh profile data every time screen is focused
  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, [])
  );

  const handleEditProfile = () => {
    if (userProfile) {
      setEditNickname(userProfile.nickname || '');
      setEditModalVisible(true);
    }
  };

  const saveProfileChanges = async () => {
    if (!editNickname.trim()) {
      showError('Xəta', 'Nickname boş ola bilməz');
      return;
    }

    if (editNickname.length < 3) {
      showError('Xəta', 'Nickname ən azı 3 simvol olmalıdır');
      return;
    }

    try {
      const success = await updateUserProfile(auth.currentUser.uid, {
        nickname: editNickname.trim(),
        displayName: editNickname.trim()
      });

      if (success) {
        await loadUserProfile();
        setEditModalVisible(false);
        showSuccess('Uğurlu!', 'Profil yeniləndi');
      } else {
        showError('Xəta', 'Profil yenilənərkən xəta baş verdi');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Xəta', 'Profil yenilənərkən xəta baş verdi');
    }
  };

  const handleChangePassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordModalVisible(true);
  };

  const savePasswordChanges = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      showError('Xəta', 'Bütün sahələri doldurun');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showError('Xəta', 'Yeni şifrələr uyğun gəlmir');
      return;
    }

    if (newPassword.length < 6) {
      showError('Xəta', 'Yeni şifrə ən azı 6 simvol olmalıdır');
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      
      setPasswordModalVisible(false);
      showSuccess('Uğurlu!', 'Şifrə yeniləndi');
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        showError('Xəta', 'Cari şifrə yanlışdır');
      } else {
        showError('Xəta', 'Şifrə yenilənərkən xəta baş verdi');
      }
    }
  };

  const getLevelProgress = (level) => {
    if (!userProfile?.levelProgress?.[level]) return { completed: false, stars: 0, bestScore: 0 };
    return userProfile.levelProgress[level];
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>👤 Profil</Text>
          <Text style={styles.subtitle}>Şəxsi məlumatlarınız</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userProfile?.nickname?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.nickname}>{userProfile?.nickname || 'Nickname yoxdur'}</Text>
            <Text style={styles.email}>{auth.currentUser?.email}</Text>
            <Text style={styles.userId}>ID: {getVisibleId()}</Text>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="pencil" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Tap Game Statistics */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>⚡ Tap Game Statistika</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="flash" size={24} color="#f1c40f" />
              <Text style={styles.statValue}>{(getTapBestTime() || 0) ? `${getTapBestTime().toFixed(2)}s` : '-'}</Text>
              <Text style={styles.statLabel}>Ən sürətli vaxt</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color="#3498db" />
              <Text style={styles.statValue}>{(getTapAvgTime() || 0) ? `${getTapAvgTime().toFixed(2)}s` : '-'}</Text>
              <Text style={styles.statLabel}>Orta vaxt</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="game-controller" size={24} color="#f39c12" />
              <Text style={styles.statValue}>{userProfile?.gamesPlayed || 0}</Text>
              <Text style={styles.statLabel}>Oyun sayı</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="trophy" size={24} color="#27ae60" />
              <Text style={styles.statValue}>{userProfile?.totalScore?.toLocaleString() || 0}</Text>
              <Text style={styles.statLabel}>Ümumi xal</Text>
            </View>
          </View>
        </View>

        {/* Tap Game Progress by Target Count */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>🎯 Hədəf Tərəqqisi</Text>
          
          {TAP_LEVELS.map((level) => {
            const lp = userProfile?.levelProgress || {};
            const progress = lp[level] || { bestTime: 0 };
            const has = typeof progress.bestTime === 'number' && progress.bestTime > 0;
            return (
              <View key={level} style={styles.levelProgressCard}>
                <View style={styles.levelHeader}>
                  <Text style={styles.levelNumber}>{level} Hədəf</Text>
                  <View style={styles.levelStatus}>
                    {has ? (
                      <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
                    ) : (
                      <Ionicons name="time" size={20} color="#a8a8a8" />
                    )}
                  </View>
                </View>
                <View style={styles.levelStats}>
                  <View style={styles.levelStat}>
                    <Ionicons name="time" size={16} color="#3498db" />
                    <Text style={styles.levelStatText}>{has ? `${progress.bestTime.toFixed(2)}s` : '-'}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
            <Ionicons name="key" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Şifrəni Dəyiş</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nickname Dəyiş</Text>
            
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Yeni Nickname</Text>
              <TextInput
                style={styles.modalTextInput}
                value={editNickname}
                onChangeText={setEditNickname}
                placeholder="Nickname daxil edin"
                placeholderTextColor="#a8a8a8"
                maxLength={20}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Ləğv Et</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveProfileChanges}
              >
                <Text style={styles.saveButtonText}>Yadda Saxla</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={passwordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Şifrəni Dəyiş</Text>
            
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Cari Şifrə</Text>
              <TextInput
                style={styles.modalTextInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Cari şifrəni daxil edin"
                placeholderTextColor="#a8a8a8"
                secureTextEntry
              />
            </View>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Yeni Şifrə</Text>
              <TextInput
                style={styles.modalTextInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Yeni şifrə daxil edin"
                placeholderTextColor="#a8a8a8"
                secureTextEntry
              />
            </View>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Yeni Şifrəni Təsdiqlə</Text>
              <TextInput
                style={styles.modalTextInput}
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                placeholder="Yeni şifrəni təkrar daxil edin"
                placeholderTextColor="#a8a8a8"
                secureTextEntry
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setPasswordModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Ləğv Et</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={savePasswordChanges}
              >
                <Text style={styles.saveButtonText}>Yadda Saxla</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: '#0f3460',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#a8a8a8',
  },
  userCard: {
    backgroundColor: '#16213e',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#a8a8a8',
    marginBottom: 2,
  },
  userId: {
    fontSize: 13,
    color: '#7aa2ff',
    fontWeight: '700',
  },
  editButton: {
    backgroundColor: '#0f3460',
    padding: 10,
    borderRadius: 20,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  statCard: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '47%',
    borderWidth: 1,
    borderColor: '#0f3460',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a8a8a8',
    textAlign: 'center',
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  levelProgressCard: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#0f3460',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  levelStatus: {
    alignItems: 'center',
  },
  levelStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  levelStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelStatText: {
    fontSize: 14,
    color: '#a8a8a8',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  actionButton: {
    backgroundColor: '#0f3460',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInputContainer: {
    marginBottom: 15,
  },
  modalInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  modalTextInput: {
    backgroundColor: '#0f3460',
    borderWidth: 1,
    borderColor: '#27ae60',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#7f8c8d',
  },
  saveButton: {
    backgroundColor: '#27ae60',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;

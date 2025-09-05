import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { searchUsers } from '../../firebaseConfig';

const ChallengeScreen = () => {
  const navigation = useNavigation();
  const [friendName, setFriendName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  

  const runSearch = async () => {
    const term = searchTerm.trim();
    if (!term) {
      setResults([]);
      return;
    }
    try {
      setSearching(true);
      const data = await searchUsers(term, 25);
      setResults(data);
    } catch (e) {
      // ignore
    } finally {
      setSearching(false);
    }
  };

  const viewPlayerProfile = (player) => {
    setSelectedPlayer(player);
    setShowProfileModal(true);
  };

  const selectPlayer = (player) => {
    setFriendName(player.nickname || `#${player.publicId || player.id.slice(0,2) + player.id.slice(-4)}`);
    setSearchTerm('');
    setResults([]);
  };

  const getVisibleId = (player) => {
    if (player.publicId) return `#${player.publicId}`;
    const uid = player.id;
    if (!uid) return '';
    return `#${uid.slice(0, 2)}${uid.slice(-4)}`;
  };

  const calculateAverageTapTime = (player) => {
    const lp = player.levelProgress || {};
    const TAP_LEVELS = [10, 20, 30, 40, 50];
    const times = TAP_LEVELS
      .map(k => (lp[k] && typeof lp[k].bestTime === 'number' ? lp[k].bestTime : 0))
      .filter(t => t > 0);
    return times.length ? (times.reduce((s, t) => s + t, 0) / times.length).toFixed(2) : '-';
  };

  

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>👥 Oyuncu axtar</Text>
          <Text style={styles.subtitle}>
            Tap Game oyununda dostlarınızla yarışın!
          </Text>
        </View>

        {/* Search Players */}
        <View style={styles.configSection}>
          <Text style={styles.sectionTitle}>Oyunçu Axtar</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nickname və ya #publicId</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Məs: aysu və ya #ab12-cd34"
                placeholderTextColor="#a8a8a8"
              />
              <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={runSearch}>
                <Ionicons name={searching ? 'hourglass' : 'search'} size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          {results.length > 0 && (
            <View style={{ gap: 8 }}>
              {results.map((u) => (
                <View key={u.id} style={styles.resultRow}>
                  <View style={styles.resultAvatar}>
                    <Text style={{ color: '#fff', fontWeight: '700' }}>{(u.nickname || 'U').charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultName}>{u.nickname || 'Naməlum'}</Text>
                    <Text style={styles.resultId}>{getVisibleId(u)}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.profileButton} 
                    onPress={() => viewPlayerProfile(u)}
                  >
                    <Ionicons name="person" size={18} color="#3498db" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.selectButton} 
                    onPress={() => selectPlayer(u)}
                  >
                    <Ionicons name="checkmark" size={18} color="#27ae60" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Removed Invitation Configuration and related sections as requested */}

        {/* Player Profile Modal */}
        <Modal
          visible={showProfileModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setShowProfileModal(false)}
        >
          <View style={styles.modalContent}>
              {selectedPlayer && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Oyunçu Profili</Text>
                  </View>

                  <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                    {/* Player Info */}
                    <View style={styles.playerInfoCard}>
                      <View style={styles.playerAvatar}>
                        <Text style={styles.playerAvatarText}>
                          {(selectedPlayer.nickname || 'U').charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.playerDetails}>
                        <Text style={styles.playerName}>{selectedPlayer.nickname || 'Naməlum'}</Text>
                        <Text style={styles.playerId}>{getVisibleId(selectedPlayer)}</Text>
                      </View>
                    </View>

                    {/* Statistics */}
                    <View style={styles.statsCard}>
                      <Text style={styles.cardTitle}>📊 Statistika</Text>
                      <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                          <Ionicons name="trophy" size={20} color="#f1c40f" />
                          <Text style={styles.statValue}>{selectedPlayer.totalScore?.toLocaleString() || 0}</Text>
                          <Text style={styles.statLabel}>Ümumi Xal</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="game-controller" size={20} color="#3498db" />
                          <Text style={styles.statValue}>{selectedPlayer.gamesPlayed || 0}</Text>
                          <Text style={styles.statLabel}>Oyun Sayı</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="flash" size={20} color="#e74c3c" />
                          <Text style={styles.statValue}>
                            {selectedPlayer.bestTimeOverall && selectedPlayer.bestTimeOverall > 0 
                              ? `${selectedPlayer.bestTimeOverall.toFixed(2)}s` : '-'}
                          </Text>
                          <Text style={styles.statLabel}>Ən Sürətli</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="timer" size={20} color="#9b59b6" />
                          <Text style={styles.statValue}>{calculateAverageTapTime(selectedPlayer)}s</Text>
                          <Text style={styles.statLabel}>Ortalama</Text>
                        </View>
                      </View>
                    </View>

                    {/* Tap Game Levels */}
                    <View style={styles.levelsCard}>
                      <Text style={styles.cardTitle}>⚡ Tap Game Səviyyələri</Text>
                      {[10, 20, 30, 40, 50].map((level) => {
                        const progress = selectedPlayer.levelProgress?.[level] || {};
                        return (
                          <View key={level} style={styles.levelItem}>
                            <Text style={styles.levelNumber}>{level} Hədəf</Text>
                            <View style={styles.levelStatus}>
                              {progress.bestTime > 0 ? (
                                <>
                                  <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
                                  <Text style={styles.levelTime}>{progress.bestTime.toFixed(2)}s</Text>
                                </>
                              ) : (
                                <>
                                  <Ionicons name="lock-closed" size={16} color="#a8a8a8" />
                                  <Text style={styles.levelTime}>-</Text>
                                </>
                              )}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </ScrollView>

                  <View style={styles.modalActions}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.secondaryButton]}
                      onPress={() => setShowProfileModal(false)}
                    >
                      <Text style={styles.actionButtonText}>Bağla</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
        </Modal>

      </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 22,
  },
  configSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: '#0f3460',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#0f3460',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  levelSection: {
    marginBottom: 20,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  levelCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  selectedLevelCard: {
    borderColor: '#27ae60',
    backgroundColor: '#1e3a2e',
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 5,
  },
  levelName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 3,
  },
  levelDifficulty: {
    fontSize: 12,
    color: '#a8a8a8',
  },
  previewSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  previewCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
  },
  previewMessage: {
    fontSize: 14,
    color: '#a8a8a8',
    lineHeight: 20,
    backgroundColor: '#0f3460',
    padding: 15,
    borderRadius: 8,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#27ae60',
  },
  secondaryButton: {
    backgroundColor: '#3498db',
  },
  tertiaryButton: {
    backgroundColor: '#9b59b6',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#0f3460',
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#a8a8a8',
    flex: 1,
    lineHeight: 20,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0f3460',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  resultAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#27ae60',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  resultName: {
    color: '#ffffff',
    fontWeight: '700',
  },
  resultId: {
    color: '#7aa2ff',
    fontSize: 12,
  },
  profileButton: {
    padding: 8,
    backgroundColor: '#0f3460',
    borderRadius: 8,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  selectButton: {
    padding: 8,
    backgroundColor: '#0f3460',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  // Modal styles
  modalContent: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  playerInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  playerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#27ae60',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  playerAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  playerId: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 5,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#a8a8a8',
    textAlign: 'center',
  },
  levelsCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  levelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  levelNumber: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  levelStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelTime: {
    fontSize: 14,
    color: '#a8a8a8',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
  },
});

export default ChallengeScreen;

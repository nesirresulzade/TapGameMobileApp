import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GameZone from '../components/GameZone';

const LEVELS = [
  { id: 'L1', label: '10 hədəf', targets: 10 },
  { id: 'L2', label: '20 hədəf', targets: 20 },
  { id: 'L3', label: '30 hədəf', targets: 30 },
  { id: 'L4', label: '40 hədəf', targets: 40 },
  { id: 'L5', label: '50 hədəf', targets: 50 },
];

export default function TapGameScreen() {
  const navigation = useNavigation();
  const [selectedLevel, setSelectedLevel] = useState(LEVELS[0]);
  const [showGameZone, setShowGameZone] = useState(false);

  const handleGameEnd = () => {
    setShowGameZone(false);
  };

  if (showGameZone) {
    return (
      <GameZone 
        selectedLevel={selectedLevel} 
        onGameEnd={handleGameEnd}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerBtn} 
          onPress={() => navigation.openDrawer?.() || navigation.dispatch({ type: 'OPEN_DRAWER' })}
        >
          <Ionicons name="menu" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>⚡ Tap Game</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Game Info */}
        <View style={styles.gameInfo}>
          <Text style={styles.gameTitle}>Hədəf Vurma Oyunu</Text>
          <Text style={styles.gameDescription}>
            Ekranda görünən hədəfləri ən sürətli şəkildə vurun!
          </Text>
        </View>

        {/* Level Selection */}
        <View style={styles.levelSection}>
          <Text style={styles.sectionTitle}>Səviyyə Seçin</Text>
          <View style={styles.levels}>
            {LEVELS.map((lvl) => (
              <TouchableOpacity
                key={lvl.id}
                style={[
                  styles.levelBtn, 
                  selectedLevel.id === lvl.id && styles.levelBtnActive
                ]}
                onPress={() => setSelectedLevel(lvl)}
              >
                <Text style={[
                  styles.levelText, 
                  selectedLevel.id === lvl.id && styles.levelTextActive
                ]}>
                  {lvl.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Game Rules */}
        <View style={styles.rulesSection}>
          <Text style={styles.sectionTitle}>Oyun Qaydaları</Text>
          <View style={styles.rulesList}>
            <View style={styles.ruleItem}>
              <Ionicons name="flash" size={16} color="#27ae60" />
              <Text style={styles.ruleText}>Qırmızı hədəfləri vurun</Text>
            </View>
            <View style={styles.ruleItem}>
              <Ionicons name="time" size={16} color="#3498db" />
              <Text style={styles.ruleText}>Ən sürətli vaxtda bitirin</Text>
            </View>
            <View style={styles.ruleItem}>
              <Ionicons name="trophy" size={16} color="#f1c40f" />
              <Text style={styles.ruleText}>Yüksək xal qazanın</Text>
            </View>
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity 
          style={styles.startBtn} 
          onPress={() => setShowGameZone(true)}
        >
          <Ionicons name="play" color="#ffffff" size={24} />
          <Text style={styles.startText}>Oyunu Başlat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#16213e',
    borderBottomWidth: 2,
    borderBottomColor: '#0f3460',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f3460',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRight: {
    width: 36,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: '#0f3460',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  gameInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: '#0f3460',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  gameDescription: {
    fontSize: 16,
    color: '#a8a8a8',
    textAlign: 'center',
    lineHeight: 24,
  },
  levelSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 15,
    textAlign: 'center',
  },
  levels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  levelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#16213e',
    borderWidth: 2,
    borderColor: '#0f3460',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 80,
    alignItems: 'center',
  },
  levelBtnActive: {
    backgroundColor: '#27ae60',
    borderColor: '#2ecc71',
  },
  levelText: {
    color: '#a8a8a8',
    fontSize: 14,
    fontWeight: '600',
  },
  levelTextActive: {
    color: '#ffffff',
  },
  rulesSection: {
    marginBottom: 40,
  },
  rulesList: {
    gap: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0f3460',
    gap: 12,
  },
  ruleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  startBtn: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#2ecc71',
  },
  startText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});



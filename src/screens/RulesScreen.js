import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const RulesScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📖 Oyun Qaydaları</Text>
          <Text style={styles.subtitle}>Tap Game (Vurma Oyunu) haqqında məlumat</Text>
        </View>

        {/* Game Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Oyun Haqqında</Text>
          <Text style={styles.description}>
            Tap Game, ekranda peyda olan hədəfləri mümkün qədər tez vurmaq üzərində qurulub.
            Məqsəd seçdiyiniz səviyyədəki bütün hədəfləri ən qısa zamanda tamamlayaraq yüksək xal toplamaqdır.
          </Text>
        </View>

        {/* How to Play */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Necə Oynamaq</Text>

          <View style={styles.ruleItem}>
            <Ionicons name="1" size={20} color="#27ae60" />
            <Text style={styles.ruleText}>Ekranda görünən hədəfə toxunun</Text>
          </View>

          <View style={styles.ruleItem}>
            <Ionicons name="2" size={20} color="#27ae60" />
            <Text style={styles.ruleText}>Hər düzgün toxunuşdan sonra yeni hədəf təsadüfi yerdə yaranır</Text>
          </View>

          <View style={styles.ruleItem}>
            <Ionicons name="3" size={20} color="#27ae60" />
            <Text style={styles.ruleText}>Səviyyə seçiminə uyğun sayda hədəfi tamamlayın (10 / 20 / 30 / 40 / 50)</Text>
          </View>

          <View style={styles.ruleItem}>
            <Ionicons name="4" size={20} color="#27ae60" />
            <Text style={styles.ruleText}>Vaxt sağ üst hissədə canlı olaraq artır</Text>
          </View>

          <View style={styles.ruleItem}>
            <Ionicons name="5" size={20} color="#27ae60" />
            <Text style={styles.ruleText}>Səhv toxunuşlar dəqiqliyi azaldır və xala cərimə kimi təsir edir</Text>
          </View>
        </View>

        {/* Levels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Səviyyələr</Text>

          <View style={styles.levelItem}>
            <Text style={styles.levelName}>10 Hədəf</Text>
            <Text style={styles.levelDetails}>Yeni başlayanlar üçün ideal – ən sürətli vaxt toplanır</Text>
          </View>

          <View style={styles.levelItem}>
            <Text style={styles.levelName}>20 Hədəf</Text>
            <Text style={styles.levelDetails}>Daha sürətli reaksiya və sabitlik tələb edir</Text>
          </View>

          <View style={styles.levelItem}>
            <Text style={styles.levelName}>30 Hədəf</Text>
            <Text style={styles.levelDetails}>Orta çətinlik – ritmi qoruyun</Text>
          </View>

          <View style={styles.levelItem}>
            <Text style={styles.levelName}>40 Hədəf</Text>
            <Text style={styles.levelDetails}>Yüksək fokus – səhvləri minimuma endirin</Text>
          </View>

          <View style={styles.levelItem}>
            <Text style={styles.levelName}>50 Hədəf</Text>
            <Text style={styles.levelDetails}>Profesional səviyyə – ən yaxşı vaxt lider olur</Text>
          </View>
        </View>

        {/* Scoring System */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Xal Sistemi</Text>

          <View style={styles.scoringItem}>
            <Ionicons name="flash" size={20} color="#f1c40f" />
            <Text style={styles.scoringText}>Xal vaxtla tərs mütənasibdir: nə qədər tez, bir o qədər çox xal</Text>
          </View>

          <View style={styles.scoringItem}>
            <Ionicons name="hand-left" size={20} color="#f1c40f" />
            <Text style={styles.scoringText}>Səhv toxunuşlar cərimədir və ümumi xalı azaldır</Text>
          </View>

          <View style={styles.scoringItem}>
            <Ionicons name="star" size={20} color="#f1c40f" />
            <Text style={styles.scoringText}>Ulduzlar: 3★ (90%+ baza xal), 2★ (75%+), 1★ (qalan)</Text>
          </View>

          <View style={styles.scoringItem}>
            <Ionicons name="trophy" size={20} color="#f1c40f" />
            <Text style={styles.scoringText}>Lider cədvəli: ən sürətli vaxt siyahının zirvəsindədir</Text>
          </View>

          <View style={styles.bonusInfo}>
            <Text style={styles.bonusText}>💡 Bonus: Daha sürətli və az səhv daha yüksək xal gətirir</Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 İpuclar</Text>

          <View style={styles.tipItem}>
            <Ionicons name="bulb" size={20} color="#f39c12" />
            <Text style={styles.tipText}>Hədəfə fokuslanın və ekrandakı boş toxunuşlardan qaçın</Text>
          </View>

          <View style={styles.tipItem}>
            <Ionicons name="bulb" size={20} color="#f39c12" />
            <Text style={styles.tipText}>Kiçik, sürətli toxunuşlarla ritmi qoruyun</Text>
          </View>

          <View style={styles.tipItem}>
            <Ionicons name="bulb" size={20} color="#f39c12" />
            <Text style={styles.tipText}>Səviyyəni seçərkən öz sürətinizə uyğun başlanğıc edin</Text>
          </View>

          <View style={styles.tipItem}>
            <Ionicons name="bulb" size={20} color="#f39c12" />
            <Text style={styles.tipText}>Məqsəd: daha az səhv + daha sürətli vaxt = daha çox xal</Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Xüsusiyyətlər</Text>

          <View style={styles.featureItem}>
            <Ionicons name="game-controller" size={20} color="#3498db" />
            <Text style={styles.featureText}>5 hədəf səviyyəsi (10/20/30/40/50)</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="timer" size={20} color="#3498db" />
            <Text style={styles.featureText}>Canlı vaxt və dəqiqlik</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="trophy" size={20} color="#3498db" />
            <Text style={styles.featureText}>Ulduz sistemi və yüksək xal saxlanması</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="person" size={20} color="#3498db" />
            <Text style={styles.featureText}>Profil və publicId ilə paylaşım</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="stats-chart" size={20} color="#3498db" />
            <Text style={styles.featureText}>Liderlər cədvəli və oyunçu axtarışı</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ⚡ Uğurlar və əyləncəli oyunlar! ⚡
          </Text>
        </View>
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#16213e',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#0f3460',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: '#0f3460',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#a8a8a8',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#16213e',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0f3460',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    textAlign: 'center',
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  ruleText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
    lineHeight: 22,
  },
  levelItem: {
    backgroundColor: '#0f3460',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#27ae60',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  levelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  levelDetails: {
    fontSize: 14,
    color: '#ffffff',
  },
  scoringItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  scoringText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  bonusInfo: {
    backgroundColor: '#0f3460',
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#27ae60',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  bonusText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  tipText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 18,
    color: '#27ae60',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default RulesScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const LeaderboardScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const visibleId = (item) => {
    const pid = item && item.publicId;
    if (pid && typeof pid === 'string') {
      return pid.startsWith('#') ? pid : `#${pid}`;
    }
    const raw = (item && item.id) || '';
    if (!raw || typeof raw !== 'string') return '';
    const left = raw.slice(0, 2);
    const right = raw.slice(-4);
    return `#${left}${right}`;
  };


  // Fetch real data from Firestore
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { getLeaderboard } = await import('../../firebaseConfig');
        const data = await getLeaderboard();
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        // Fallback to mock data if Firestore fails
        const mockData = [
          { id: 1, nickname: 'Əli', totalScore: 8500, gamesPlayed: 15, bestScore: 1200, totalStars: 45 },
          { id: 2, nickname: 'Aysu', totalScore: 7200, gamesPlayed: 12, bestScore: 1100, totalStars: 38 },
          { id: 3, nickname: 'Mehdi', totalScore: 6800, gamesPlayed: 18, bestScore: 1000, totalStars: 42 },
        ];
        setLeaderboardData(mockData);
      }
    };
    
    fetchLeaderboard();
  }, []);

  const filters = [
    { id: 'all', label: 'Hamısı', icon: 'trophy' },
    { id: 'tap10', label: '10 Hədəf', icon: 'flash' },
    { id: 'tap20', label: '20 Hədəf', icon: 'flash' },
    { id: 'tap30', label: '30 Hədəf', icon: 'flash' },
    { id: 'tap40', label: '40 Hədəf', icon: 'flash' },
    { id: 'tap50', label: '50 Hədəf', icon: 'flash' },
  ];

  const getFilteredData = () => {
    if (selectedFilter === 'all') {
      // Average tap time across available tap levels (lower is better)
      return [...leaderboardData]
        .map(u => {
          const lp = u.levelProgress || {};
          const tapKeys = [10, 20, 30, 40, 50];
          const times = tapKeys
            .map(k => (lp[k] && typeof lp[k].bestTime === 'number' ? lp[k].bestTime : 0))
            .filter(t => t && t > 0);
          const avg = times.length ? times.reduce((s, t) => s + t, 0) / times.length : 0;
          return { ...u, _avgTapTime: avg };
        })
        .sort((a, b) => {
          const aa = a._avgTapTime || 0;
          const bb = b._avgTapTime || 0;
          if (aa === 0 && bb === 0) return 0;
          if (aa === 0) return 1; // users without times go below
          if (bb === 0) return -1;
          return aa - bb;
        });
    }
    // Tap levels: sort by best (lowest) time for that target count
    const targetCount = parseInt(selectedFilter.replace('tap', ''));
    return [...leaderboardData]
      .map(u => {
        const lp = u.levelProgress || {};
        const stats = lp[targetCount] || {};
        return {
          ...u,
          tapBestTime: typeof stats.bestTime === 'number' ? stats.bestTime : 0,
        };
      })
      .filter(u => u.tapBestTime && u.tapBestTime > 0)
      .sort((a, b) => a.tapBestTime - b.tapBestTime);
  };

  const getRankColor = (rank) => {
    if (rank === 1) return '#f1c40f'; // Gold
    if (rank === 2) return '#bdc3c7'; // Silver
    if (rank === 3) return '#e67e22'; // Bronze
    return '#a8a8a8'; // Default
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}`;
  };

  const renderLeaderboardItem = ({ item, index }) => {
    const rank = index + 1;
    const filteredData = getFilteredData();
    const actualRank = filteredData.findIndex(i => i.id === item.id) + 1;
    const isFirstPlace = actualRank === 1;

    return (
      <View style={[
        styles.leaderboardItem,
        isFirstPlace && styles.firstPlaceItem
      ]}>
        <View style={[
          styles.rankContainer,
          isFirstPlace && styles.firstPlaceRankContainer
        ]}>
          <Text style={[styles.rankText, { color: getRankColor(actualRank) }]}>
            {getRankIcon(actualRank)}
          </Text>
        </View>

        <View style={styles.playerInfo}>
          <View style={styles.playerNameContainer}>
            <Text style={[
              styles.playerName,
              isFirstPlace && styles.firstPlacePlayerName
            ]}>
              {item.nickname}
            </Text>
            {isFirstPlace && (
              <View style={styles.championBadge}>
                <Text style={styles.championText}>ÇEMPİON</Text>
              </View>
            )}
          </View>
          <Text style={styles.playerIdText}>{visibleId(item)}</Text>
        </View>

        <View style={styles.scoreContainer}>
          {selectedFilter === 'all' ? (
            <>
              <Text style={styles.scoreValue}>
                {item._avgTapTime && item._avgTapTime > 0 ? `${item._avgTapTime.toFixed(2)}s` : '-'}
              </Text>
              <Text style={styles.levelText}>Ortalama vaxt</Text>
            </>
          ) : (
            <>
              <Text style={styles.scoreValue}>
                {(() => {
                  const targetCount = parseInt(selectedFilter.replace('tap', ''));
                  const lp = item.levelProgress || {};
                  const stats = lp[targetCount] || {};
                  const t = typeof stats.bestTime === 'number' ? stats.bestTime : 0;
                  return t ? `${t.toFixed(2)}s` : '-';
                })()}
              </Text>
              <Text style={styles.levelText}>Ən yaxşı vaxt</Text>
            </>
          )}
        </View>
      </View>
    );
  };

  const renderFilterButton = (filter) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterButton,
        selectedFilter === filter.id && styles.selectedFilterButton
      ]}
      onPress={() => setSelectedFilter(filter.id)}
    >
      <Ionicons 
        name={filter.icon} 
        size={16} 
        color={selectedFilter === filter.id ? '#ffffff' : '#0f3460'} 
      />
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter.id && styles.selectedFilterButtonText
      ]}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Liderlər Cədvəli</Text>
        <Text style={styles.subtitle}>Ən yaxşı oyunçuları gör</Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {filters.map(renderFilterButton)}
        </ScrollView>
      </View>

      {/* Champion Spotlight */}
      {selectedFilter === 'all' && getFilteredData().length > 0 && (() => {
        const fastestPlayer = getFilteredData()[0];
        return (
          <View style={styles.championSpotlight}>
            <View style={styles.championCrown}>
              <Text style={styles.crownIcon}>👑</Text>
            </View>
            <View style={styles.championInfo}>
              <Text style={styles.championTitle}>Ən Sürətli Oyunçu</Text>
              <Text style={styles.championName}>{fastestPlayer.nickname}</Text>
              <Text style={styles.championTime}>
                {fastestPlayer._avgTapTime ? `${fastestPlayer._avgTapTime.toFixed(2)}s` : '-'} ortalama vaxt
              </Text>
            </View>
          </View>
        );
      })()}

      {/* Statistics Summary (dynamic by filter) */}
      <View style={styles.statsSummary}>
        {selectedFilter === 'all' ? (
          <>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Ümumi Oyunçu</Text>
              <Text style={styles.summaryValue}>{leaderboardData.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Ortalama liderin vaxtı</Text>
              <Text style={styles.summaryValue}>
                {(() => {
                  const withAvg = (leaderboardData || []).map(u => {
                    const lp = u.levelProgress || {};
                    const times = [10,20,30,40,50]
                      .map(k => (lp[k] && typeof lp[k].bestTime === 'number' ? lp[k].bestTime : 0))
                      .filter(t => t && t > 0);
                    const avg = times.length ? times.reduce((s,t)=>s+t,0)/times.length : 0;
                    return avg;
                  }).filter(t => t && t > 0);
                  if (!withAvg.length) return '-';
                  return `${Math.min(...withAvg).toFixed(2)}s`;
                })()}
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Ümumi Oyunçu</Text>
              <Text style={styles.summaryValue}>{getFilteredData().length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Bu modun ən yaxşı vaxtı</Text>
              <Text style={styles.summaryValue}>
                {(() => {
                  const filtered = getFilteredData();
                  const times = filtered
                    .map(u => {
                      const targetCount = parseInt(selectedFilter.replace('tap', ''));
                      const lp = u.levelProgress || {};
                      const t = lp[targetCount] && typeof lp[targetCount].bestTime === 'number' ? lp[targetCount].bestTime : 0;
                      return t;
                    })
                    .filter(t => t && t > 0);
                  if (!times.length) return '-';
                  return `${Math.min(...times).toFixed(2)}s`;
                })()}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Leaderboard List */}
      <View style={styles.leaderboardContainer}>
        <View style={styles.leaderboardHeader}>
          <Text style={styles.leaderboardTitle}>
            {selectedFilter === 'all' ? 'Bütün Səviyyələr' : `Səviyyə ${selectedFilter.replace('level', '')}`}
          </Text>
          <Text style={styles.leaderboardSubtitle}>
            {getFilteredData().length} oyunçu
          </Text>
        </View>

                 <FlatList
           data={getFilteredData().sort((a, b) => b.totalScore - a.totalScore)}
           renderItem={renderLeaderboardItem}
           keyExtractor={item => item.id.toString()}
           showsVerticalScrollIndicator={false}
           contentContainerStyle={styles.listContainer}
         />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
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
    textShadowColor: '#0f3460',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#a8a8a8',
    textAlign: 'center',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterContainer: {
    paddingHorizontal: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#0f3460',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedFilterButton: {
    backgroundColor: '#27ae60',
    borderColor: '#2ecc71',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#a8a8a8',
    fontWeight: '600',
  },
  selectedFilterButtonText: {
    color: '#ffffff',
  },
  statsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0f3460',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#a8a8a8',
    marginBottom: 5,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  leaderboardContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  leaderboardSubtitle: {
    fontSize: 14,
    color: '#a8a8a8',
  },
  listContainer: {
    paddingBottom: 60,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#0f3460',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  playerIdText: {
    fontSize: 12,
    color: '#7aa2ff',
  },
  playerStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f3460',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  statChipText: {
    fontSize: 12,
    color: '#a8a8a8',
    fontWeight: '600',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 4,
  },
  levelText: {
    fontSize: 12,
    color: '#a8a8a8',
  },
  // First place special styles
  firstPlaceItem: {
    backgroundColor: '#1a2a3a',
    borderColor: '#f1c40f',
    borderWidth: 2,
    shadowColor: '#f1c40f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  firstPlaceRankContainer: {
    backgroundColor: '#f1c40f',
    shadowColor: '#f1c40f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  playerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  firstPlacePlayerName: {
    color: '#f1c40f',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  championBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c0392b',
  },
  championText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  // Champion spotlight styles
  championSpotlight: {
    backgroundColor: '#1a2a3a',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f1c40f',
    shadowColor: '#f1c40f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  championCrown: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1c40f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  crownIcon: {
    fontSize: 30,
  },
  championInfo: {
    flex: 1,
  },
  championTitle: {
    fontSize: 14,
    color: '#a8a8a8',
    marginBottom: 4,
    fontWeight: '600',
  },
  championName: {
    fontSize: 20,
    color: '#f1c40f',
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  championTime: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default LeaderboardScreen;

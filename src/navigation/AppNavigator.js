import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, getUserProfile } from '../../firebaseConfig';
import CustomAlert from '../components/CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import RulesScreen from '../screens/RulesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoadingScreen from '../components/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import TapGameScreen from '../screens/TapGameScreen';
import SplashScreen from '../components/SplashScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content
const CustomDrawerContent = (props) => {
  const { navigation } = props;
  const [userProfile, setUserProfile] = useState(null);
  const { alertState, showError, hideAlert } = useCustomAlert();


  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      if (auth.currentUser) {
        const profile = await getUserProfile(auth.currentUser.uid);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      showError('Xəta', 'Çıxış zamanı xəta baş verdi');
    }
  };

  const confirmLogout = () => {
    showError(
      'Çıxış',
      'Hesabınızdan çıxmaq istədiyinizə əminsiniz?',
      [
        {
          text: 'Ləğv et',
          style: 'cancel',
        },
        {
          text: 'Çıx',
          onPress: handleLogout,
          style: 'destructive',
        },
      ]
    );
  };

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
    navigation.closeDrawer();
  };

  return (
    <View style={styles.drawerContainer}>
      {/* Header */}
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>⚡ Tap Game</Text>
        <Text style={styles.drawerSubtitle}>
          Xoş gəlmisiniz, {userProfile?.nickname || auth.currentUser?.email?.split('@')[0] || 'Oyunçu'}!
        </Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationSection}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateToScreen('Home')}
        >
          <Ionicons name="home" size={24} color="#ffffff" />
          <Text style={styles.navButtonText}>Ana Səhifə</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateToScreen('Profile')}
        >
          <Ionicons name="person" size={24} color="#ffffff" />
          <Text style={styles.navButtonText}>Profil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateToScreen('Rules')}
        >
          <Ionicons name="book" size={24} color="#ffffff" />
          <Text style={styles.navButtonText}>Oyun Qaydaları</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateToScreen('Leaderboard')}
        >
          <Ionicons name="trophy" size={24} color="#ffffff" />
          <Text style={styles.navButtonText}>Liderlər Cədvəli</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateToScreen('Challenge')}
        >
          <Ionicons name="people" size={24} color="#ffffff" />
          <Text style={styles.navButtonText}>Oyunçu axtar</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={confirmLogout}
      >
        <Ionicons name="exit-outline" size={24} color="#ffffff" />
        <Text style={styles.logoutButtonText}>Çıxış</Text>
      </TouchableOpacity>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        type={alertState.type}
        onClose={hideAlert}
      />
    </View>
  );
};

// Drawer Navigator
const GameDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#ffffff',
          width: 300,
        },
        drawerActiveTintColor: '#2F6FED',
        drawerInactiveTintColor: '#5f6b7a',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
        },
        drawerItemStyle: {
          marginVertical: 5,
        },
        swipeEnabled: true,
        swipeEdgeWidth: 50,
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Home"
        component={TapGameScreen}
        options={{
          drawerLabel: 'Ana Səhifə',
        }}
      />
      <Drawer.Screen
        name="Rules"
        component={RulesScreen}
        options={{
          drawerLabel: 'Oyun Qaydaları',
        }}
      />
      <Drawer.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          drawerLabel: 'Liderlər Cədvəli',
        }}
      />
      <Drawer.Screen
        name="Challenge"
        component={ChallengeScreen}
        options={{
          drawerLabel: 'Dostu Dəvət Et',
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: 'Profil',
        }}
      />
    </Drawer.Navigator>
  );
};


const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Animasiyanı 4 saniyə sonra avtomatik bitir
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      clearTimeout(splashTimer);
      unsubscribe();
    };
  }, []);

  if (showSplash) {
    return <SplashScreen onAnimationFinish={() => setShowSplash(false)} />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1a1a2e',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <GameDrawer />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 20,
  },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#0f3460',
    marginBottom: 20,
    backgroundColor: '#16213e',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: '#0f3460',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  drawerSubtitle: {
    fontSize: 16,
    color: '#a8a8a8',
    textAlign: 'center',
  },
  navigationSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f3460',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27ae60',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 55,
    borderWidth: 1,
    borderColor: '#c0392b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 16,
  },
});

export default AppNavigator;

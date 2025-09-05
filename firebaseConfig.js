// Firebase SDK-larını import et
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCVPwEcEsiPZ7j7RYti1igArhpDDwJ7z14",
    authDomain: "moblegame-44f34.firebaseapp.com",
    projectId: "moblegame-44f34",
    storageBucket: "moblegame-44f34.firebasestorage.app",
    messagingSenderId: "1089669267591",
    appId: "1:1089669267591:web:d7131f4e79fd9e806ff822"
};

// Firebase-i initialize et (təkrar initialize-ın qarşısını al)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth servisini AsyncStorage persistence ilə initialize et (yalnız bir dəfə)
let authInstance;
try {
    authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
} catch (e) {
    // Əgər artıq initialize olunubsa, mövcud auth instansını götür
    authInstance = getAuth(app);
}

export const auth = authInstance;

// Firestore çıxart
export const db = getFirestore(app);

// User Data Management Functions
export const createUserProfile = async (userId, userData) => {
    try {
        const userRef = doc(db, 'users', userId);
        // Generate a short public id for UI display (does not replace real UID)
        const generatePublicId = () =>
            Math.random().toString(36).slice(2, 6) + '-' + Math.random().toString(36).slice(2, 6);

        const publicId = userData.publicId || generatePublicId();

        await setDoc(userRef, {
            ...userData,
            publicId,
            createdAt: new Date(),
            updatedAt: new Date(),
            totalScore: 0,
            gamesPlayed: 0,
            bestScore: 0,
            bestTimeOverall: 0,
            bestTapTime: 0,
            totalStars: 0,
            levelProgress: {
                1: { bestScore: 0, bestTime: 0, stars: 0, completed: false },
                2: { bestScore: 0, bestTime: 0, stars: 0, completed: false },
                3: { bestScore: 0, bestTime: 0, stars: 0, completed: false },
                4: { bestScore: 0, bestTime: 0, stars: 0, completed: false },
                5: { bestScore: 0, bestTime: 0, stars: 0, completed: false }
            }
        });
        return true;
    } catch (error) {
        console.error('Error creating user profile:', error);
        return false;
    }
};

export const getUserProfile = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return userSnap.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        return null;
    }
};

export const updateUserProfile = async (userId, updates) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            ...updates,
            updatedAt: new Date()
        });
        return true;
    } catch (error) {
        console.error('Error updating user profile:', error);
        return false;
    }
};

export const saveGameResult = async (userId, gameData) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            const userData = userSnap.data();
            const level = gameData.level;
            const score = gameData.score;
            const time = gameData.time;
            const stars = gameData.stars;
            
            // Update level progress (handle undefined safely)
            const existingLevelStats = (userData.levelProgress && userData.levelProgress[level]) || {
                bestScore: 0,
                bestTime: 0,
                stars: 0,
                completed: false,
            };

            const prevBestScore = typeof existingLevelStats.bestScore === 'number' ? existingLevelStats.bestScore : 0;
            const prevBestTime = typeof existingLevelStats.bestTime === 'number' ? existingLevelStats.bestTime : 0;
            const prevStars = typeof existingLevelStats.stars === 'number' ? existingLevelStats.stars : 0;

            const newBestScore = Math.max(prevBestScore, score);
            const newBestTime = prevBestTime === 0 ? time : Math.min(prevBestTime, time);
            const newStars = Math.max(prevStars, stars);
            
            const newTotalScore = (userData.totalScore || 0) + score;
            const newGamesPlayed = (userData.gamesPlayed || 0) + 1;
            const newBestScoreOverall = Math.max(userData.bestScore || 0, score);
            const newBestTimeOverall = (userData.bestTimeOverall || 0) === 0
                ? time
                : Math.min(userData.bestTimeOverall, time);
            const newBestTapTime = gameData.gameType === 'tap'
                ? ((userData.bestTapTime || 0) === 0 ? time : Math.min(userData.bestTapTime, time))
                : (userData.bestTapTime || 0);
            const newTotalStars = (userData.totalStars || 0) + stars;

            const updates = {
                totalScore: newTotalScore,
                gamesPlayed: newGamesPlayed,
                bestScore: newBestScoreOverall,
                bestTimeOverall: newBestTimeOverall,
                bestTapTime: newBestTapTime,
                totalStars: newTotalStars,
                [`levelProgress.${level}.bestScore`]: newBestScore,
                [`levelProgress.${level}.bestTime`]: newBestTime,
                [`levelProgress.${level}.stars`]: newStars,
                [`levelProgress.${level}.completed`]: true,
                updatedAt: new Date()
            };
            
            await updateDoc(userRef, updates);
            
            // Save to game history
            const gameHistoryRef = doc(collection(db, 'gameHistory'));
            await setDoc(gameHistoryRef, {
                userId,
                level,
                gameType: gameData.gameType || 'memory',
                score,
                time,
                stars,
                moves: gameData.moves,
                completedAt: new Date()
            });
            
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error saving game result:', error);
        return false;
    }
};

export const getLeaderboard = async (limitCount = 50) => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('totalScore', 'desc'), limit(limitCount));
        const querySnapshot = await getDocs(q);
        
        const leaderboard = [];
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            leaderboard.push({
                id: doc.id,
                nickname: userData.nickname,
                publicId: userData.publicId,
                totalScore: userData.totalScore,
                gamesPlayed: userData.gamesPlayed,
                bestScore: userData.bestScore,
                totalStars: userData.totalStars,
                bestTimeOverall: userData.bestTimeOverall || 0,
                bestTapTime: userData.bestTapTime || 0,
                levelProgress: userData.levelProgress || {},
            });
        });
        
        return leaderboard;
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        return [];
    }
};

// Search users by nickname or publicId (prefix match)
export const searchUsers = async (term, limitCount = 20) => {
    try {
        if (!term || typeof term !== 'string') return [];
        const usersRef = collection(db, 'users');

        const start = term;
        const end = term + '\uf8ff';

        const q1 = query(usersRef, where('nickname', '>=', start), where('nickname', '<=', end), limit(limitCount));
        const q2 = query(usersRef, where('publicId', '>=', start.replace(/^#/, '')), where('publicId', '<=', end.replace(/^#/, '')), limit(limitCount));

        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

        const map = new Map();
        const pushDoc = (d) => {
            const data = d.data();
            map.set(d.id, {
                id: d.id,
                nickname: data.nickname,
                publicId: data.publicId,
                totalScore: data.totalScore,
                gamesPlayed: data.gamesPlayed,
                bestScore: data.bestScore,
                bestTimeOverall: data.bestTimeOverall || 0,
                bestTapTime: data.bestTapTime || 0,
                levelProgress: data.levelProgress || {},
            });
        };

        snap1.forEach(pushDoc);
        snap2.forEach(pushDoc);

        return Array.from(map.values()).slice(0, limitCount);
    } catch (error) {
        console.error('Error searching users:', error);
        return [];
    }
};

export default app;
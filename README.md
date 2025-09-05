# Oyun Dünyası - React Native Mobil Oyun Tətbiqi

Bu layihə React Native və Expo istifadə edərək yaradılmış mobil oyun tətbiqidir. Firebase Authentication ilə istifadəçi qeydiyyatı və giriş funksionallığı təmin edir.

## Xüsusiyyətlər

- ✅ Modern və mobilə uyğun dizayn
- ✅ Firebase Authentication (Email + Şifrə)
- ✅ Login və Sign Up səhifələri
- ✅ Input validation
- ✅ React Navigation ilə səhifələr arası keçid
- ✅ Avtomatik authentication state management
- ✅ Responsive və user-friendly interface

## Tələblər

- Node.js (v16 və ya daha yuxarı)
- Expo CLI
- Firebase layihəsi

## Quraşdırma

### 1. Layihəni klonlayın və asılılıqları quraşdırın

```bash
cd MyApp
npm install
```

### 2. Firebase layihəsi yaradın

1. [Firebase Console](https://console.firebase.google.com/) -ə daxil olun
2. Yeni layihə yaradın
3. Authentication bölməsində "Email/Password" provider-i aktivləşdirin
4. Layihə parametrlərini kopyalayın

### 3. Firebase konfiqurasiyasını yeniləyin

`firebaseConfig.js` faylını açın və öz Firebase layihə məlumatlarınızı əlavə edin:

```javascript
const firebaseConfig = {
  apiKey: "SİZİN_API_KEY",
  authDomain: "SİZİN_AUTH_DOMAIN",
  projectId: "SİZİN_PROJECT_ID",
  storageBucket: "SİZİN_STORAGE_BUCKET",
  messagingSenderId: "SİZİN_MESSAGING_SENDER_ID",
  appId: "SİZİN_APP_ID"
};
```

### 4. Tətbiqi işə salın

```bash
npm start
```

## Layihə Strukturu

```
MyApp/
├── App.js                 # Ana tətbiq komponenti
├── firebaseConfig.js      # Firebase konfiqurasiyası
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js    # Əsas navigasiya
│   └── screens/
│       ├── LoginScreen.js     # Giriş səhifəsi
│       ├── SignUpScreen.js    # Qeydiyyat səhifəsi
│       └── HomeScreen.js      # Ana səhifə
└── package.json
```

## Səhifələr

### Login Screen
- Email və şifrə ilə giriş
- Input validation
- Firebase authentication
- Sign Up səhifəsinə keçid

### Sign Up Screen
- Yeni istifadəçi qeydiyyatı
- Şifrə təsdiqləmə
- Validation
- Login səhifəsinə keçid

### Home Screen
- Uğurlu giriş sonrası
- İstifadəçi məlumatları
- Çıxış funksiyası

## Validation

- **Email**: Boş buraxıla bilməz, düzgün format olmalıdır
- **Şifrə**: Minimum 6 simvol olmalıdır
- **Şifrə təsdiqi**: Şifrələr uyğun gəlməlidir

## Dizayn

- Modern dark theme (#1a1a2e)
- Responsive layout
- Shadow və elevation effektləri
- Azerbaijani dilində interface
- Oyun temasına uyğun dizayn

## Firebase Authentication

Layihə aşağıdakı Firebase Auth funksiyalarından istifadə edir:

- `signInWithEmailAndPassword` - Giriş
- `createUserWithEmailAndPassword` - Qeydiyyat
- `signOut` - Çıxış
- `onAuthStateChanged` - Authentication state monitoring

## Əlavə Funksionallıq

Bu əsas struktur üzərində aşağıdakı funksiyaları əlavə edə bilərsiniz:

- Oyun səhifələri
- İstifadəçi profili
- Oyun statistikaları
- Leaderboard
- Push notifications
- Offline mode

## Problemlər və Həllər

### Expo Go-da Firebase problemi
Əgər Expo Go-da Firebase işləmirsə, development build istifadə edin:

```bash
expo install expo-dev-client
expo run:android
# və ya
expo run:ios
```

### Navigation xətaları
Əgər navigation xətaları alırsınızsa, babel konfiqurasiyasını yoxlayın və `react-native-gesture-handler` import-unu `App.js`-də ən yuxarıda saxlayın.

## Dəstək

Hər hansı sual və ya problem üçün:
- GitHub Issues yaradın
- Firebase documentation-ı yoxlayın
- Expo documentation-ı yoxlayın

## Lisenziya

Bu layihə MIT lisenziyası altında yayımlanır.

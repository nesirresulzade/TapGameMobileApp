import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const SplashScreen = ({ onAnimationFinish }) => {
    const animation = useRef(null);

    useEffect(() => {
        // Animasiya avtomatik başlayacaq (autoPlay=true)
        // Əlavə play() çağırmağa ehtiyac yoxdur
    }, []);

    return (
        <View style={styles.container}>
            <LottieView
                ref={animation}
                source={require('../../assets/animations/Scene-1.json')}
                autoPlay={true}
                loop={false}
                style={styles.animation}
                onAnimationFinish={onAnimationFinish}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e', // Layihənizin rəngi
        justifyContent: 'center',
        alignItems: 'center',
    },
    animation: {
        width: '100%',
        height: '100%',
    },
});

export default SplashScreen;

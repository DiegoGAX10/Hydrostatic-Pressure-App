// components/LoadingAnimation.js
import React, { useState, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const LoadingAnimation = () => {
    const [rotation] = useState(new Animated.Value(0));

    useEffect(() => {
        const startRotation = () => {
            Animated.loop(
                Animated.timing(rotation, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                })
            ).start();
        };
        startRotation();
    }, [rotation]);

    const rotateData = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.loaderContainer}>
            <Animated.View
                style={[
                    styles.wheel,
                    {
                        transform: [{ rotate: rotateData }],
                    },
                ]}
            >
                <View style={styles.wheelInner}>
                    <View style={styles.spoke} />
                    <View style={[styles.spoke, { transform: [{ rotate: '45deg' }] }]} />
                    <View style={[styles.spoke, { transform: [{ rotate: '90deg' }] }]} />
                    <View style={[styles.spoke, { transform: [{ rotate: '135deg' }] }]} />
                </View>
            </Animated.View>
            <View style={styles.waterFlow}>
                <View style={[styles.waterDrop, { backgroundColor: '#4FC3F7' }]} />
                <View style={[styles.waterDrop, { backgroundColor: '#29B6F6', width: 12, height: 12 }]} />
                <View style={[styles.waterDrop, { backgroundColor: '#03A9F4', width: 14, height: 14 }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    wheel: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#0277BD',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    wheelInner: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#01579B',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    spoke: {
        position: 'absolute',
        width: 2,
        height: 20,
        backgroundColor: '#B3E5FC',
        borderRadius: 1,
    },
    waterFlow: {
        flexDirection: 'row',
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 60,
    },
    waterDrop: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
});

export default LoadingAnimation;
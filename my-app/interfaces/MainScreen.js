// screens/MainScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import UnitCard from '../components/UnitCard';
import LoadingAnimation from '../components/LoadingAnimation';
import { unitsData } from '../data/unitsData';

export default function MainScreen({ navigation }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleUnitPress = (unit) => {
        navigation.navigate(unit.screen, { unitData: unit });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar style="light" />
                <LoadingAnimation />
                <Text style={styles.loadingText}>Cargando Sistema Hidráulico...</Text>
                <Text style={styles.loadingSubtext}>Preparando contenido educativo</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <LoadingAnimation />
                    <Text style={styles.appTitle}>Hidráulica</Text>
                    <Text style={styles.subtitle}>Sistema de Aprendizaje Interactivo</Text>
                </View>
            </View>

            {/* Main Content */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    <Text style={styles.sectionTitle}>Unidades de Estudio</Text>
                    <Text style={styles.sectionSubtitle}>
                        Selecciona una unidad para comenzar tu aprendizaje
                    </Text>

                    {unitsData.map((unit, index) => (
                        <UnitCard
                            key={unit.id}
                            unit={unit}
                            onPress={() => handleUnitPress(unit)}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerDot} />
                <Text style={styles.footerText}>Ingeniería Hidráulica - Sistema Educativo</Text>
                <View style={styles.footerDot} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 20,
        color: '#0277BD',
        fontWeight: '600',
        textAlign: 'center',
    },
    loadingSubtext: {
        marginTop: 8,
        fontSize: 16,
        color: '#0277BD',
        textAlign: 'center',
    },
    header: {
        backgroundColor: '#01579B',
        paddingTop: 50,
        paddingBottom: 30,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    headerContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    appTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 15,
    },
    subtitle: {
        fontSize: 16,
        color: '#B3E5FC',
        marginTop: 5,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingTop: 30,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#01579B',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 16,
        color: '#37474F',
        marginBottom: 24,
        opacity: 0.8,
    },
    footer: {
        backgroundColor: '#0277BD',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#B3E5FC',
    },
    footerText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
        marginHorizontal: 12,
    },
});
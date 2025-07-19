// screens/units/Unit2Screen.js
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Unit2Screen({ navigation, route }) {
    const { unitData } = route.params;

    const handleSimulationPress = (simulation) => {
        navigation.navigate(simulation.screen);
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: unitData.color }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                        <Text style={styles.backButtonText}>← Volver</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.headerContent}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.headerIcon}>{unitData.icon}</Text>
                    </View>
                    <Text style={styles.unitNumber}>{unitData.unit}</Text>
                    <Text style={styles.unitTitle}>{unitData.title}</Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>

                    {/* Descripción */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📚 Descripción General</Text>
                        <View style={styles.descriptionCard}>
                            <Text style={styles.descriptionText}>
                                La hidrostática estudia los fluidos en reposo y las fuerzas que
                                actúan sobre ellos. Esta unidad abarca los conceptos fundamentales
                                de presión en fluidos estáticos, fuerzas sobre superficies sumergidas
                                y principios de flotación.
                            </Text>
                        </View>
                    </View>

                    {/* Temas */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📖 Temas de Estudio</Text>
                        {unitData.topics.map((topic, index) => (
                            <View key={index} style={styles.topicCard}>
                                <View style={styles.topicNumber}>
                                    <Text style={styles.topicNumberText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.topicText}>{topic}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Simulaciones */}
                    {unitData.simulations && unitData.simulations.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>🧪 Simulaciones Interactivas</Text>
                            <Text style={styles.simulationsSubtitle}>
                                Practica con simulaciones que te ayudarán a visualizar los conceptos
                            </Text>

                            {unitData.simulations.map((simulation, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.simulationCard}
                                    onPress={() => handleSimulationPress(simulation)}
                                >
                                    <View style={styles.simulationIcon}>
                                        <Text style={styles.simulationIconText}>⚡</Text>
                                    </View>
                                    <View style={styles.simulationInfo}>
                                        <Text style={styles.simulationName}>{simulation.name}</Text>
                                        <Text style={styles.simulationDescription}>
                                            Simulación interactiva para comprender mejor este tema
                                        </Text>
                                    </View>
                                    <View style={styles.simulationArrow}>
                                        <Text style={styles.simulationArrowText}>→</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Objetivos de Aprendizaje */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🎯 Objetivos de Aprendizaje</Text>
                        <View style={styles.objectivesCard}>
                            <View style={styles.objective}>
                                <Text style={styles.objectiveBullet}>•</Text>
                                <Text style={styles.objectiveText}>
                                    Comprender los principios fundamentales de la hidrostática
                                </Text>
                            </View>
                            <View style={styles.objective}>
                                <Text style={styles.objectiveBullet}>•</Text>
                                <Text style={styles.objectiveText}>
                                    Calcular fuerzas sobre superficies sumergidas
                                </Text>
                            </View>
                            <View style={styles.objective}>
                                <Text style={styles.objectiveBullet}>•</Text>
                                <Text style={styles.objectiveText}>
                                    Aplicar principios de flotación y estabilidad
                                </Text>
                            </View>
                            <View style={styles.objective}>
                                <Text style={styles.objectiveBullet}>•</Text>
                                <Text style={styles.objectiveText}>
                                    Utilizar instrumentos de medición de presión
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        paddingBottom: 30,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    headerTop: {
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: '#01579B',
        fontSize: 16,
        fontWeight: '600',
    },
    headerContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 4,
    },
    headerIcon: {
        fontSize: 40,
    },
    unitNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#01579B',
        marginBottom: 8,
    },
    unitTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#01579B',
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#01579B',
        marginBottom: 16,
    },
    descriptionCard: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#37474F',
    },
    topicCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    topicNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    topicNumberText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0277BD',
    },
    topicText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 22,
        color: '#37474F',
    },
    simulationsSubtitle: {
        fontSize: 16,
        color: '#37474F',
        marginBottom: 16,
        opacity: 0.8,
    },
    simulationCard: {
        backgroundColor: '#4CAF50',
        padding: 20,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    simulationIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    simulationIconText: {
        fontSize: 24,
    },
    simulationInfo: {
        flex: 1,
    },
    simulationName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    simulationDescription: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    simulationArrow: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    simulationArrowText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    objectivesCard: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    objective: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    objectiveBullet: {
        fontSize: 18,
        color: '#4CAF50',
        marginRight: 12,
        marginTop: 2,
    },
    objectiveText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 22,
        color: '#37474F',
    },
});
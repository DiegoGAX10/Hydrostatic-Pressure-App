import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function UnitTemplateScreen({ navigation, route }) {
    const { unitData } = route.params;

    const handleSimulationPress = (simulation) => {
        navigation.navigate(simulation.screen);
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    // Contenido de prueba con Lorem Ipsum
    const testContent = {
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                     Sed do eiusmod tempor incididunt ut labore et dolore magna 
                     aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
                     ullamco laboris nisi ut aliquip ex ea commodo consequat.`,

        objectives: [
            "Lorem ipsum dolor sit amet consectetur adipiscing elit",
            "Sed do eiusmod tempor incididunt ut labore et dolore",
            "Ut enim ad minim veniam quis nostrud exercitation",
            "Duis aute irure dolor in reprehenderit in voluptate"
        ],

        keyFormulas: [
            { name: "Formula Lorem", formula: "L = i/p", description: "Lorem ipsum dolor sit" },
            { name: "Formula Ipsum", formula: "I = p/s", description: "Ipsum lorem sit dolor" },
            { name: "Formula Test", formula: "T = l/o", description: "Test lorem ipsum sit" }
        ]
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: unitData?.color || '#2196F3' }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                        <Text style={styles.backButtonText}>← Volver</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.headerContent}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.headerIcon}>🧪</Text>
                    </View>
                    <Text style={styles.unitNumber}>PRUEBA</Text>
                    <Text style={styles.unitTitle}>Template Lorem Ipsum</Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>

                    {/* Descripción */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📚 Lorem Ipsum</Text>
                        <View style={styles.descriptionCard}>
                            <Text style={styles.descriptionText}>
                                {testContent.description}
                            </Text>
                        </View>
                    </View>

                    {/* Temas */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📖 Temas Lorem</Text>
                        {['Lorem ipsum dolor', 'Consectetur adipiscing', 'Sed do eiusmod', 'Tempor incididunt'].map((topic, index) => (
                            <View key={index} style={styles.topicCard}>
                                <View style={styles.topicNumber}>
                                    <Text style={styles.topicNumberText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.topicText}>{topic}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Fórmulas Clave */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📐 Fórmulas Lorem</Text>
                        {testContent.keyFormulas.map((formula, index) => (
                            <View key={index} style={styles.formulaCard}>
                                <View style={styles.formulaHeader}>
                                    <Text style={styles.formulaName}>{formula.name}</Text>
                                    <Text style={styles.formulaText}>{formula.formula}</Text>
                                </View>
                                <Text style={styles.formulaDescription}>{formula.description}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Simulaciones de Prueba */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🧪 Simulaciones Lorem</Text>
                        <Text style={styles.simulationsSubtitle}>
                            Lorem ipsum dolor sit amet consectetur adipiscing elit
                        </Text>

                        <TouchableOpacity style={styles.simulationCard}>
                            <View style={styles.simulationIcon}>
                                <Text style={styles.simulationIconText}>⚡</Text>
                            </View>
                            <View style={styles.simulationInfo}>
                                <Text style={styles.simulationName}>Simulación Lorem</Text>
                                <Text style={styles.simulationDescription}>
                                    Lorem ipsum dolor sit amet consectetur
                                </Text>
                            </View>
                            <View style={styles.simulationArrow}>
                                <Text style={styles.simulationArrowText}>→</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.simulationCard}>
                            <View style={styles.simulationIcon}>
                                <Text style={styles.simulationIconText}>⚡</Text>
                            </View>
                            <View style={styles.simulationInfo}>
                                <Text style={styles.simulationName}>Simulación Ipsum</Text>
                                <Text style={styles.simulationDescription}>
                                    Sed do eiusmod tempor incididunt
                                </Text>
                            </View>
                            <View style={styles.simulationArrow}>
                                <Text style={styles.simulationArrowText}>→</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Objetivos de Aprendizaje */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🎯 Objetivos Lorem</Text>
                        <View style={styles.objectivesCard}>
                            {testContent.objectives.map((objective, index) => (
                                <View key={index} style={styles.objective}>
                                    <Text style={styles.objectiveBullet}>•</Text>
                                    <Text style={styles.objectiveText}>{objective}</Text>
                                </View>
                            ))}
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
    formulaCard: {
        backgroundColor: '#FFF3E0',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
    },
    formulaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    formulaName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E65100',
    },
    formulaText: {
        fontSize: 18,
        fontFamily: 'monospace',
        color: '#BF360C',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    formulaDescription: {
        fontSize: 14,
        color: '#5D4037',
        fontStyle: 'italic',
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
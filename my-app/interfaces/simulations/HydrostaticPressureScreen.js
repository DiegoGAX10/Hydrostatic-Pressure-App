import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    PanResponder,
    Animated,
    Dimensions,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Rect, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CONTAINER_WIDTH = screenWidth - 40;
const CONTAINER_HEIGHT = 300;
const WATER_DENSITY = 1000; // kg/m³
const GRAVITY = 9.81; // m/s²

const HydrostaticPressureScreen = ({ navigation }) => {
    const [depth, setDepth] = useState(50); // profundidad en cm
    const [pressure, setPressure] = useState(0);
    const [waterLevel, setWaterLevel] = useState(200); // nivel de agua desde arriba
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedFluid, setSelectedFluid] = useState('water');

    const fluids = {
        water: { density: 1000, color: '#4FC3F7', name: 'Agua' },
        oil: { density: 800, color: '#FFA726', name: 'Aceite' },
        mercury: { density: 13600, color: '#9E9E9E', name: 'Mercurio' }
    };

    // Animación para el punto de medición
    const pointAnimation = new Animated.Value(0);

    useEffect(() => {
        // Calcular presión hidrostática: P = ρgh
        const depthInMeters = depth / 100;
        const fluidDensity = fluids[selectedFluid].density;
        const calculatedPressure = fluidDensity * GRAVITY * depthInMeters;
        setPressure(calculatedPressure);
    }, [depth, selectedFluid]);

    useEffect(() => {
        if (isPlaying) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pointAnimation, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pointAnimation, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        } else {
            pointAnimation.stopAnimation();
            pointAnimation.setValue(0);
        }
    }, [isPlaying]);

    // PanResponder para arrastrar el punto de medición
    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gestureState) => {
            const newDepth = Math.max(10, Math.min(waterLevel - 20, gestureState.moveY - 100));
            setDepth(((newDepth - 50) / CONTAINER_HEIGHT) * 100 + 10);
        },
    });

    const getDepthPosition = () => {
        return 50 + ((depth - 10) / 100) * CONTAINER_HEIGHT;
    };

    const formatPressure = (pressure) => {
        if (pressure >= 1000) {
            return `${(pressure / 1000).toFixed(2)} kPa`;
        }
        return `${pressure.toFixed(0)} Pa`;
    };

    const scale = pointAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.3],
    });

    const opacity = pointAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
    });

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Presión Hidrostática</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Simulación */}
                <View style={styles.simulationContainer}>
                    <View style={styles.tankContainer}>
                        <Svg width={CONTAINER_WIDTH} height={CONTAINER_HEIGHT + 100}>
                            <Defs>
                                <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <Stop offset="0%" stopColor={fluids[selectedFluid].color} stopOpacity="0.3" />
                                    <Stop offset="100%" stopColor={fluids[selectedFluid].color} stopOpacity="0.8" />
                                </LinearGradient>
                            </Defs>

                            {/* Tanque */}
                            <Rect
                                x="50"
                                y="50"
                                width={CONTAINER_WIDTH - 100}
                                height={CONTAINER_HEIGHT}
                                fill="none"
                                stroke="#0277BD"
                                strokeWidth="3"
                            />

                            {/* Agua */}
                            <Rect
                                x="53"
                                y={waterLevel}
                                width={CONTAINER_WIDTH - 106}
                                height={CONTAINER_HEIGHT - waterLevel + 50}
                                fill="url(#waterGradient)"
                            />

                            {/* Superficie del agua */}
                            <Line
                                x1="53"
                                y1={waterLevel}
                                x2={CONTAINER_WIDTH - 53}
                                y2={waterLevel}
                                stroke="#0277BD"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                            />

                            {/* Punto de medición */}
                            <Circle
                                cx={CONTAINER_WIDTH / 2}
                                cy={getDepthPosition()}
                                r="8"
                                fill="#E91E63"
                                stroke="#FFFFFF"
                                strokeWidth="2"
                            />

                            {/* Línea de profundidad */}
                            <Line
                                x1={CONTAINER_WIDTH / 2}
                                y1={waterLevel}
                                x2={CONTAINER_WIDTH / 2}
                                y2={getDepthPosition()}
                                stroke="#E91E63"
                                strokeWidth="2"
                                strokeDasharray="3,3"
                            />

                            {/* Escala de profundidad */}
                            {[0, 25, 50, 75, 100].map((mark, index) => (
                                <React.Fragment key={index}>
                                    <Line
                                        x1="40"
                                        y1={50 + (mark / 100) * CONTAINER_HEIGHT}
                                        x2="50"
                                        y2={50 + (mark / 100) * CONTAINER_HEIGHT}
                                        stroke="#0277BD"
                                        strokeWidth="1"
                                    />
                                    <SvgText
                                        x="30"
                                        y={55 + (mark / 100) * CONTAINER_HEIGHT}
                                        fontSize="10"
                                        fill="#0277BD"
                                        textAnchor="middle"
                                    >
                                        {mark}
                                    </SvgText>
                                </React.Fragment>
                            ))}

                            {/* Etiqueta de profundidad */}
                            <SvgText
                                x="20"
                                y={CONTAINER_HEIGHT / 2 + 50}
                                fontSize="12"
                                fill="#0277BD"
                                textAnchor="middle"
                                transform={`rotate(-90, 20, ${CONTAINER_HEIGHT / 2 + 50})`}
                            >
                                Profundidad (cm)
                            </SvgText>
                        </Svg>

                        {/* Punto de medición animado */}
                        <Animated.View
                            style={[
                                styles.measurementPoint,
                                {
                                    left: CONTAINER_WIDTH / 2 - 10,
                                    top: getDepthPosition() - 10,
                                    transform: [{ scale }],
                                    opacity,
                                }
                            ]}
                            {...panResponder.panHandlers}
                        >
                            <View style={styles.pointInner} />
                        </Animated.View>
                    </View>
                </View>

                {/* Controles */}
                <View style={styles.controlsContainer}>
                    <View style={styles.fluidSelector}>
                        <Text style={styles.controlLabel}>Seleccionar Fluido:</Text>
                        <View style={styles.fluidButtons}>
                            {Object.entries(fluids).map(([key, fluid]) => (
                                <TouchableOpacity
                                    key={key}
                                    style={[
                                        styles.fluidButton,
                                        selectedFluid === key && styles.selectedFluidButton,
                                        { backgroundColor: fluid.color }
                                    ]}
                                    onPress={() => setSelectedFluid(key)}
                                >
                                    <Text style={[
                                        styles.fluidButtonText,
                                        selectedFluid === key && styles.selectedFluidButtonText
                                    ]}>
                                        {fluid.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.playButton, isPlaying && styles.playButtonActive]}
                        onPress={() => setIsPlaying(!isPlaying)}
                    >
                        <Text style={styles.playButtonText}>
                            {isPlaying ? '⏸️ Pausar' : '▶️ Animar'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Resultados */}
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultsTitle}>Mediciones</Text>

                    <View style={styles.resultItem}>
                        <Text style={styles.resultLabel}>Profundidad:</Text>
                        <Text style={styles.resultValue}>{depth.toFixed(1)} cm</Text>
                    </View>

                    <View style={styles.resultItem}>
                        <Text style={styles.resultLabel}>Presión Hidrostática:</Text>
                        <Text style={styles.resultValue}>{formatPressure(pressure)}</Text>
                    </View>

                    <View style={styles.resultItem}>
                        <Text style={styles.resultLabel}>Densidad del fluido:</Text>
                        <Text style={styles.resultValue}>{fluids[selectedFluid].density} kg/m³</Text>
                    </View>

                    <View style={styles.resultItem}>
                        <Text style={styles.resultLabel}>Presión atmosférica:</Text>
                        <Text style={styles.resultValue}>101.325 kPa</Text>
                    </View>

                    <View style={styles.resultItem}>
                        <Text style={styles.resultLabel}>Presión absoluta:</Text>
                        <Text style={styles.resultValue}>{formatPressure(pressure + 101325)}</Text>
                    </View>
                </View>

                {/* Fórmula */}
                <View style={styles.formulaContainer}>
                    <Text style={styles.formulaTitle}>Fórmula de Presión Hidrostática</Text>
                    <Text style={styles.formula}>P = ρ × g × h</Text>
                    <Text style={styles.formulaDescription}>
                        P = Presión hidrostática (Pa){'\n'}
                        ρ = Densidad del fluido (kg/m³){'\n'}
                        g = Aceleración gravitacional (9.81 m/s²){'\n'}
                        h = Profundidad (m)
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E3F2FD',
    },
    header: {
        backgroundColor: '#01579B',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    simulationContainer: {
        padding: 20,
        alignItems: 'center',
    },
    tankContainer: {
        position: 'relative',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    measurementPoint: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#E91E63',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    pointInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    controlsContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    fluidSelector: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    controlLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0277BD',
        marginBottom: 12,
    },
    fluidButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    fluidButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 80,
        alignItems: 'center',
    },
    selectedFluidButton: {
        borderWidth: 2,
        borderColor: '#0277BD',
    },
    fluidButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    selectedFluidButtonText: {
        color: '#0277BD',
    },
    playButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    playButtonActive: {
        backgroundColor: '#FF9800',
    },
    playButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    resultsContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0277BD',
        marginBottom: 16,
    },
    resultItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    resultLabel: {
        fontSize: 14,
        color: '#37474F',
        flex: 1,
    },
    resultValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0277BD',
    },
    formulaContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    formulaTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0277BD',
        marginBottom: 12,
    },
    formula: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E91E63',
        textAlign: 'center',
        marginBottom: 12,
    },
    formulaDescription: {
        fontSize: 14,
        color: '#37474F',
        lineHeight: 20,
    },
});

export default HydrostaticPressureScreen;
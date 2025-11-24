import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Switch
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLanguage } from '../../contexts/LanguageContext';
import Svg, { Rect, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop, Path, Polygon } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');
const CONTAINER_WIDTH = screenWidth - 60;
const CONTAINER_HEIGHT = 400;
const GRAVITY = 9.81;
const ATM_PRESSURE = 101325; // Pa

const UnderPressureScreen = ({ navigation }) => {
    const { t } = useLanguage();
    
    // Estados para los controles
    const [selectedFluid, setSelectedFluid] = useState('water');
    const [depth, setDepth] = useState(5); // metros
    const [showPressureGauge, setShowPressureGauge] = useState(true);
    const [showForces, setShowForces] = useState(true);
    const [atmosphericPressure, setAtmosphericPressure] = useState(101.325); // kPa
    const [selectedObject, setSelectedObject] = useState('ball');
    const [objectDepth, setObjectDepth] = useState(3); // metros desde la superficie
    
    const fluids = {
        water: { 
            density: 1000, 
            color: '#2196F3', 
            name: 'Agua',
            gradient: ['#64B5F6', '#1976D2']
        },
        oil: { 
            density: 920, 
            color: '#FF9800', 
            name: 'Aceite',
            gradient: ['#FFB74D', '#F57C00']
        },
        honey: { 
            density: 1420, 
            color: '#FFA726', 
            name: 'Miel',
            gradient: ['#FFCA28', '#F57F17']
        },
        mercury: { 
            density: 13600, 
            color: '#9E9E9E', 
            name: 'Mercurio',
            gradient: ['#BDBDBD', '#616161']
        },
        gasoline: { 
            density: 680, 
            color: '#4CAF50', 
            name: 'Gasolina',
            gradient: ['#81C784', '#388E3C']
        }
    };

    const objects = {
        ball: { name: 'Pelota', volume: 0.00524, mass: 0.4, icon: '⚽' },
        brick: { name: 'Ladrillo', volume: 0.002, mass: 4, icon: '🧱' },
        wood: { name: 'Madera', volume: 0.008, mass: 4, icon: '🪵' },
        anchor: { name: 'Ancla', volume: 0.01, mass: 100, icon: '⚓' }
    };

    // Cálculos de presión
    const fluidDensity = fluids[selectedFluid].density;
    const hydrostaticPressure = fluidDensity * GRAVITY * depth; // Pa
    const absolutePressure = atmosphericPressure * 1000 + hydrostaticPressure; // Pa
    const pressureAtObject = fluidDensity * GRAVITY * objectDepth; // Pa
    
    // Cálculos para el objeto sumergido
    const objectData = objects[selectedObject];
    const objectWeight = objectData.mass * GRAVITY; // N
    const buoyantForce = fluidDensity * GRAVITY * objectData.volume; // N
    const netForce = buoyantForce - objectWeight; // N
    const willFloat = netForce > 0;
    
    // Calcular la posición visual del objeto
    const maxDepthPixels = CONTAINER_HEIGHT - 60;
    const objectPixelPosition = (objectDepth / depth) * maxDepthPixels;

    const formatPressure = (pressure) => {
        if (pressure >= 1000) {
            return `${(pressure / 1000).toFixed(2)} kPa`;
        }
        return `${pressure.toFixed(0)} Pa`;
    };

    const formatForce = (force) => {
        return `${Math.abs(force).toFixed(2)} N`;
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← {t('common.back')}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bajo Presión</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Visualización del sistema */}
                <View style={styles.visualizationContainer}>
                    <View style={styles.tankContainer}>
                        <Svg width={CONTAINER_WIDTH} height={CONTAINER_HEIGHT + 100}>
                            <Defs>
                                <LinearGradient id="fluidDepthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <Stop offset="0%" stopColor={fluids[selectedFluid].gradient[0]} stopOpacity="0.5" />
                                    <Stop offset="50%" stopColor={fluids[selectedFluid].gradient[1]} stopOpacity="0.7" />
                                    <Stop offset="100%" stopColor={fluids[selectedFluid].gradient[1]} stopOpacity="0.9" />
                                </LinearGradient>
                            </Defs>

                            {/* Tanque principal */}
                            <Rect
                                x="40"
                                y="40"
                                width={CONTAINER_WIDTH - 80}
                                height={CONTAINER_HEIGHT}
                                fill="none"
                                stroke="#01579B"
                                strokeWidth="4"
                            />

                            {/* Fluido */}
                            <Rect
                                x="44"
                                y="44"
                                width={CONTAINER_WIDTH - 88}
                                height={CONTAINER_HEIGHT - 8}
                                fill="url(#fluidDepthGradient)"
                            />

                            {/* Línea de superficie */}
                            <Line
                                x1="40"
                                y1="40"
                                x2={CONTAINER_WIDTH - 40}
                                y2="40"
                                stroke="#0277BD"
                                strokeWidth="3"
                            />
                            <SvgText x="10" y="35" fontSize="12" fill="#0277BD" fontWeight="bold">
                                0m
                            </SvgText>

                            {/* Escala de profundidad */}
                            {[...Array(Math.floor(depth) + 1)].map((_, index) => {
                                const y = 40 + (index / depth) * CONTAINER_HEIGHT;
                                return (
                                    <React.Fragment key={index}>
                                        <Line
                                            x1="30"
                                            y1={y}
                                            x2="40"
                                            y2={y}
                                            stroke="#01579B"
                                            strokeWidth="2"
                                        />
                                        <SvgText x="10" y={y + 5} fontSize="12" fill="#01579B">
                                            {index}m
                                        </SvgText>
                                    </React.Fragment>
                                );
                            })}

                            {/* Objeto sumergido */}
                            {objectDepth <= depth && (
                                <>
                                    <Circle
                                        cx={CONTAINER_WIDTH / 2}
                                        cy={40 + objectPixelPosition}
                                        r="25"
                                        fill={willFloat ? '#4CAF50' : '#F44336'}
                                        stroke="#01579B"
                                        strokeWidth="3"
                                        opacity="0.8"
                                    />
                                    <SvgText
                                        x={CONTAINER_WIDTH / 2}
                                        y={40 + objectPixelPosition + 8}
                                        fontSize="24"
                                        textAnchor="middle"
                                    >
                                        {objectData.icon}
                                    </SvgText>

                                    {/* Flechas de fuerzas */}
                                    {showForces && (
                                        <>
                                            {/* Fuerza de flotación (hacia arriba) */}
                                            <Line
                                                x1={CONTAINER_WIDTH / 2}
                                                y1={40 + objectPixelPosition}
                                                x2={CONTAINER_WIDTH / 2}
                                                y2={40 + objectPixelPosition - Math.min(buoyantForce * 2, 60)}
                                                stroke="#4CAF50"
                                                strokeWidth="4"
                                                markerEnd="url(#arrowUp)"
                                            />
                                            <Polygon
                                                points={`${CONTAINER_WIDTH / 2 - 6},${40 + objectPixelPosition - Math.min(buoyantForce * 2, 60)} 
                                                        ${CONTAINER_WIDTH / 2},${40 + objectPixelPosition - Math.min(buoyantForce * 2, 60) - 10} 
                                                        ${CONTAINER_WIDTH / 2 + 6},${40 + objectPixelPosition - Math.min(buoyantForce * 2, 60)}`}
                                                fill="#4CAF50"
                                            />
                                            <SvgText
                                                x={CONTAINER_WIDTH / 2 + 15}
                                                y={40 + objectPixelPosition - Math.min(buoyantForce * 2, 60) / 2}
                                                fontSize="12"
                                                fill="#4CAF50"
                                                fontWeight="bold"
                                            >
                                                Fb
                                            </SvgText>

                                            {/* Peso (hacia abajo) */}
                                            <Line
                                                x1={CONTAINER_WIDTH / 2}
                                                y1={40 + objectPixelPosition}
                                                x2={CONTAINER_WIDTH / 2}
                                                y2={40 + objectPixelPosition + Math.min(objectWeight * 2, 60)}
                                                stroke="#F44336"
                                                strokeWidth="4"
                                            />
                                            <Polygon
                                                points={`${CONTAINER_WIDTH / 2 - 6},${40 + objectPixelPosition + Math.min(objectWeight * 2, 60)} 
                                                        ${CONTAINER_WIDTH / 2},${40 + objectPixelPosition + Math.min(objectWeight * 2, 60) + 10} 
                                                        ${CONTAINER_WIDTH / 2 + 6},${40 + objectPixelPosition + Math.min(objectWeight * 2, 60)}`}
                                                fill="#F44336"
                                            />
                                            <SvgText
                                                x={CONTAINER_WIDTH / 2 + 15}
                                                y={40 + objectPixelPosition + Math.min(objectWeight * 2, 60) / 2}
                                                fontSize="12"
                                                fill="#F44336"
                                                fontWeight="bold"
                                            >
                                                W
                                            </SvgText>
                                        </>
                                    )}

                                    {/* Línea de profundidad del objeto */}
                                    <Line
                                        x1={CONTAINER_WIDTH / 2 - 25}
                                        y1={40 + objectPixelPosition}
                                        x2={CONTAINER_WIDTH / 2 + 25}
                                        y2={40 + objectPixelPosition}
                                        stroke="#E91E63"
                                        strokeWidth="2"
                                        strokeDasharray="5,5"
                                    />
                                </>
                            )}

                            {/* Medidor de presión en el fondo */}
                            {showPressureGauge && (
                                <>
                                    <Rect
                                        x={CONTAINER_WIDTH - 100}
                                        y={CONTAINER_HEIGHT - 40}
                                        width="60"
                                        height="60"
                                        fill="#FFFFFF"
                                        stroke="#01579B"
                                        strokeWidth="3"
                                        rx="5"
                                    />
                                    <Circle
                                        cx={CONTAINER_WIDTH - 70}
                                        cy={CONTAINER_HEIGHT - 10}
                                        r="20"
                                        fill="none"
                                        stroke="#0277BD"
                                        strokeWidth="2"
                                    />
                                    <Line
                                        x1={CONTAINER_WIDTH - 70}
                                        y1={CONTAINER_HEIGHT - 10}
                                        x2={CONTAINER_WIDTH - 70 + Math.cos(-Math.PI / 4 + (hydrostaticPressure / 100000) * Math.PI / 2) * 15}
                                        y2={CONTAINER_HEIGHT - 10 + Math.sin(-Math.PI / 4 + (hydrostaticPressure / 100000) * Math.PI / 2) * 15}
                                        stroke="#E91E63"
                                        strokeWidth="2"
                                    />
                                    <SvgText
                                        x={CONTAINER_WIDTH - 70}
                                        y={CONTAINER_HEIGHT + 10}
                                        fontSize="10"
                                        fill="#01579B"
                                        textAnchor="middle"
                                        fontWeight="bold"
                                    >
                                        Manómetro
                                    </SvgText>
                                </>
                            )}

                            {/* Etiqueta del fluido */}
                            <Rect
                                x="50"
                                y="50"
                                width="80"
                                height="30"
                                fill={fluids[selectedFluid].color}
                                opacity="0.9"
                                rx="5"
                            />
                            <SvgText
                                x="90"
                                y="70"
                                fontSize="14"
                                fill="#FFFFFF"
                                textAnchor="middle"
                                fontWeight="bold"
                            >
                                {fluids[selectedFluid].name}
                            </SvgText>
                        </Svg>
                    </View>
                </View>

                {/* Controles */}
                <View style={styles.controlsSection}>
                    <Text style={styles.sectionTitle}>⚙️ Controles</Text>

                    {/* Selector de fluido */}
                    <View style={styles.controlCard}>
                        <Text style={styles.controlLabel}>Tipo de Fluido</Text>
                        <View style={styles.fluidButtonsGrid}>
                            {Object.entries(fluids).map(([key, fluid]) => (
                                <TouchableOpacity
                                    key={key}
                                    style={[
                                        styles.fluidButtonSmall,
                                        selectedFluid === key && styles.selectedFluidButton,
                                        { backgroundColor: fluid.color }
                                    ]}
                                    onPress={() => setSelectedFluid(key)}
                                >
                                    <Text style={styles.fluidButtonTextSmall}>{fluid.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Control de profundidad máxima */}
                    <View style={styles.controlCard}>
                        <Text style={styles.controlLabel}>Profundidad Máxima del Tanque: {depth.toFixed(1)} m</Text>
                        <View style={styles.sliderButtons}>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setDepth(Math.max(1, depth - 1))}
                            >
                                <Text style={styles.adjustButtonText}>-</Text>
                            </TouchableOpacity>
                            <View style={styles.valueDisplay}>
                                <Text style={styles.valueText}>{depth.toFixed(1)} m</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setDepth(Math.min(15, depth + 1))}
                            >
                                <Text style={styles.adjustButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Selector de objeto */}
                    <View style={styles.controlCard}>
                        <Text style={styles.controlLabel}>Seleccionar Objeto</Text>
                        <View style={styles.objectButtonsGrid}>
                            {Object.entries(objects).map(([key, obj]) => (
                                <TouchableOpacity
                                    key={key}
                                    style={[
                                        styles.objectButton,
                                        selectedObject === key && styles.selectedObjectButton
                                    ]}
                                    onPress={() => setSelectedObject(key)}
                                >
                                    <Text style={styles.objectIcon}>{obj.icon}</Text>
                                    <Text style={styles.objectName}>{obj.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Control de profundidad del objeto */}
                    <View style={styles.controlCard}>
                        <Text style={styles.controlLabel}>Profundidad del Objeto: {objectDepth.toFixed(1)} m</Text>
                        <View style={styles.sliderButtons}>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setObjectDepth(Math.max(0.5, objectDepth - 0.5))}
                            >
                                <Text style={styles.adjustButtonText}>-</Text>
                            </TouchableOpacity>
                            <View style={styles.valueDisplay}>
                                <Text style={styles.valueText}>{objectDepth.toFixed(1)} m</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setObjectDepth(Math.min(depth, objectDepth + 0.5))}
                            >
                                <Text style={styles.adjustButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Control de presión atmosférica */}
                    <View style={styles.controlCard}>
                        <Text style={styles.controlLabel}>Presión Atmosférica: {atmosphericPressure.toFixed(1)} kPa</Text>
                        <View style={styles.sliderButtons}>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setAtmosphericPressure(Math.max(80, atmosphericPressure - 5))}
                            >
                                <Text style={styles.adjustButtonText}>-</Text>
                            </TouchableOpacity>
                            <View style={styles.valueDisplay}>
                                <Text style={styles.valueText}>{atmosphericPressure.toFixed(1)} kPa</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setAtmosphericPressure(Math.min(120, atmosphericPressure + 5))}
                            >
                                <Text style={styles.adjustButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Toggles */}
                    <View style={styles.controlCard}>
                        <View style={styles.switchRow}>
                            <Text style={styles.controlLabel}>Mostrar Manómetro</Text>
                            <Switch
                                value={showPressureGauge}
                                onValueChange={setShowPressureGauge}
                                trackColor={{ false: '#767577', true: '#4CAF50' }}
                                thumbColor={showPressureGauge ? '#ffffff' : '#f4f3f4'}
                            />
                        </View>
                    </View>

                    <View style={styles.controlCard}>
                        <View style={styles.switchRow}>
                            <Text style={styles.controlLabel}>Mostrar Fuerzas</Text>
                            <Switch
                                value={showForces}
                                onValueChange={setShowForces}
                                trackColor={{ false: '#767577', true: '#4CAF50' }}
                                thumbColor={showForces ? '#ffffff' : '#f4f3f4'}
                            />
                        </View>
                    </View>
                </View>

                {/* Resultados */}
                <View style={styles.resultsSection}>
                    <Text style={styles.sectionTitle}>Mediciones</Text>
                    
                    <View style={styles.resultCard}>
                        <Text style={styles.resultCardTitle}>Presión del Fluido</Text>
                        <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Densidad del fluido:</Text>
                            <Text style={styles.resultValue}>{fluidDensity} kg/m³</Text>
                        </View>
                        <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Presión hidrostática (fondo):</Text>
                            <Text style={styles.resultValue}>{formatPressure(hydrostaticPressure)}</Text>
                        </View>
                        <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Presión atmosférica:</Text>
                            <Text style={styles.resultValue}>{formatPressure(atmosphericPressure * 1000)}</Text>
                        </View>
                        <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Presión absoluta (fondo):</Text>
                            <Text style={[styles.resultValue, styles.resultHighlight]}>{formatPressure(absolutePressure)}</Text>
                        </View>
                    </View>

                    <View style={styles.resultCard}>
                        <Text style={styles.resultCardTitle}>Análisis del Objeto</Text>
                        <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Objeto:</Text>
                            <Text style={styles.resultValue}>{objectData.icon} {objectData.name}</Text>
                        </View>
                        <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Masa:</Text>
                            <Text style={styles.resultValue}>{objectData.mass} kg</Text>
                        </View>
                        <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Volumen:</Text>
                            <Text style={styles.resultValue}>{(objectData.volume * 1000).toFixed(2)} L</Text>
                        </View>
                        <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Peso:</Text>
                            <Text style={styles.resultValue}>{formatForce(objectWeight)}</Text>
                        </View>
                        <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Fuerza de flotación:</Text>
                            <Text style={styles.resultValue}>{formatForce(buoyantForce)}</Text>
                        </View>
                        <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Fuerza neta:</Text>
                            <Text style={[styles.resultValue, { color: netForce > 0 ? '#4CAF50' : '#F44336' }]}>
                                {formatForce(netForce)} {netForce > 0 ? '↑' : '↓'}
                            </Text>
                        </View>
                        <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Presión en el objeto:</Text>
                            <Text style={styles.resultValue}>{formatPressure(pressureAtObject + atmosphericPressure * 1000)}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: willFloat ? '#4CAF50' : '#F44336' }]}>
                            <Text style={styles.statusText}>
                                {willFloat ? 'El objeto FLOTARÁ' : 'El objeto SE HUNDIRÁ'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>💡 Observaciones</Text>
                        <Text style={styles.infoText}>
                            • La presión aumenta linealmente con la profundidad
                        </Text>
                        <Text style={styles.infoText}>
                            • Fluidos más densos generan mayor presión a la misma profundidad
                        </Text>
                        <Text style={styles.infoText}>
                            • Un objeto flota cuando la fuerza de flotación supera su peso
                        </Text>
                        <Text style={styles.infoText}>
                            • La presión actúa en todas las direcciones por igual
                        </Text>
                    </View>
                </View>

                {/* Fórmulas */}
                <View style={styles.formulaSection}>
                    <Text style={styles.sectionTitle}> Ecuaciones</Text>
                    
                    <View style={styles.formulaCard}>
                        <Text style={styles.formulaTitle}>Presión Hidrostática</Text>
                        <Text style={styles.formula}>P = ρ × g × h</Text>
                        <Text style={styles.formulaDescription}>
                            ρ = densidad del fluido, g = 9.81 m/s², h = profundidad
                        </Text>
                    </View>

                    <View style={styles.formulaCard}>
                        <Text style={styles.formulaTitle}>Presión Absoluta</Text>
                        <Text style={styles.formula}>P_abs = P_atm + P_hidrostática</Text>
                        <Text style={styles.formulaDescription}>
                            La presión total incluye la presión atmosférica
                        </Text>
                    </View>

                    <View style={styles.formulaCard}>
                        <Text style={styles.formulaTitle}>Principio de Arquímedes</Text>
                        <Text style={styles.formula}>F_b = ρ_fluido × g × V_objeto</Text>
                        <Text style={styles.formulaDescription}>
                            La fuerza de flotación depende del volumen desplazado
                        </Text>
                    </View>
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
    visualizationContainer: {
        padding: 20,
        alignItems: 'center',
    },
    tankContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    controlsSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#01579B',
        marginBottom: 16,
    },
    controlCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    controlLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0277BD',
        marginBottom: 8,
    },
    fluidButtonsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 8,
    },
    fluidButtonSmall: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 15,
        minWidth: '30%',
        alignItems: 'center',
        marginBottom: 8,
    },
    selectedFluidButton: {
        borderWidth: 3,
        borderColor: '#01579B',
    },
    fluidButtonTextSmall: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    objectButtonsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 8,
    },
    objectButton: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 12,
        minWidth: '45%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    selectedObjectButton: {
        borderColor: '#01579B',
        backgroundColor: '#E3F2FD',
        borderWidth: 3,
    },
    objectIcon: {
        fontSize: 32,
        marginBottom: 4,
    },
    objectName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#01579B',
    },
    sliderButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    adjustButton: {
        backgroundColor: '#0277BD',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    adjustButtonText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    valueDisplay: {
        flex: 1,
        alignItems: 'center',
    },
    valueText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#01579B',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resultsSection: {
        padding: 20,
    },
    resultCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    resultCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#01579B',
        marginBottom: 12,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    resultLabel: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    resultValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0277BD',
        textAlign: 'right',
    },
    resultHighlight: {
        fontSize: 16,
        color: '#E91E63',
    },
    statusBadge: {
        marginTop: 12,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoCard: {
        backgroundColor: '#FFF3E0',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E65100',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#5D4037',
        marginBottom: 8,
        lineHeight: 20,
    },
    formulaSection: {
        padding: 20,
        paddingTop: 0,
    },
    formulaCard: {
        backgroundColor: '#E8F5E9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    formulaTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 8,
    },
    formula: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1B5E20',
        textAlign: 'center',
        marginVertical: 8,
        fontFamily: 'monospace',
    },
    formulaDescription: {
        fontSize: 14,
        color: '#33691E',
        fontStyle: 'italic',
        textAlign: 'center',
    },
});

export default UnderPressureScreen;

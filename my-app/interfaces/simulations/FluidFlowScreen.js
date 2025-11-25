import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Switch
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLanguage } from '../../contexts/LanguageContext';
import Svg, { Rect, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop, Path, Polygon } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');
const PIPE_WIDTH = screenWidth - 60;
const PIPE_HEIGHT = 80;
const GRAVITY = 9.81;

const FluidFlowScreen = ({ navigation }) => {
    const { t } = useLanguage();
    
    // Estados para los controles
    const [diameter1, setDiameter1] = useState(40); // diámetro sección 1 en pixels
    const [diameter2, setDiameter2] = useState(20); // diámetro sección 2 en pixels
    const [flowRate, setFlowRate] = useState(2.0); // caudal en L/s
    const [height1, setHeight1] = useState(100); // altura sección 1 en cm
    const [height2, setHeight2] = useState(50); // altura sección 2 en cm
    const [selectedFluid, setSelectedFluid] = useState('water');
    const [showParticles, setShowParticles] = useState(true);
    const [isAnimating, setIsAnimating] = useState(true);
    
    // Estados calculados
    const [velocity1, setVelocity1] = useState(0);
    const [velocity2, setVelocity2] = useState(0);
    const [pressure1, setPressure1] = useState(0);
    const [pressure2, setPressure2] = useState(0);
    const [particles, setParticles] = useState([]);
    
    const animationFrame = useRef(null);
    const particleIdCounter = useRef(0);

    const fluids = {
        water: { density: 1000, color: '#2196F3', name: t('fluidFlowSimulation.water'), viscosity: 0.001 },
        oil: { density: 920, color: '#FF9800', name: t('fluidFlowSimulation.oil'), viscosity: 0.1 },
        honey: { density: 1420, color: '#FFA726', name: t('fluidFlowSimulation.honey'), viscosity: 10 }
    };

    // Convertir diámetros de pixels a metros para cálculos
    const area1 = Math.PI * Math.pow((diameter1 / 1000), 2); // m²
    const area2 = Math.PI * Math.pow((diameter2 / 1000), 2); // m²
    
    // Calcular velocidades usando ecuación de continuidad: A1*v1 = A2*v2 = Q
    useEffect(() => {
        const Q = flowRate / 1000; // convertir L/s a m³/s
        
        const v1 = area1 > 0 ? Q / area1 : 0; // m/s
        const v2 = area2 > 0 ? Q / area2 : 0; // m/s
        
        setVelocity1(v1);
        setVelocity2(v2);
        
        // Aplicar ecuación de Bernoulli para calcular presiones
        // P1 + 0.5*ρ*v1² + ρ*g*h1 = P2 + 0.5*ρ*v2² + ρ*g*h2
        const density = fluids[selectedFluid].density;
        const h1 = height1 / 100; // convertir cm a m
        const h2 = height2 / 100; // convertir cm a m
        
        // Asumimos P1 = Patm (presión de referencia = 0)
        const p1 = 0;
        
        // Calcular P2 usando Bernoulli
        const p2 = p1 + 0.5 * density * (v1*v1 - v2*v2) + density * GRAVITY * (h1 - h2);
        
        setPressure1(101325); // Presión atmosférica en Pa
        setPressure2(101325 + p2); // Presión atmosférica + presión dinámica
        
    }, [diameter1, diameter2, flowRate, height1, height2, selectedFluid, area1, area2]);

    // Animación de partículas
    useEffect(() => {
        if (!isAnimating || !showParticles) {
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current);
            }
            return;
        }

        let lastSpawn = 0;
        const spawnInterval = 500; // ms entre generación de partículas

        const animate = (timestamp) => {
            // Generar nueva partícula
            if (timestamp - lastSpawn > spawnInterval) {
                const newParticle = {
                    id: particleIdCounter.current++,
                    x: 0,
                    y: diameter1 / 2,
                    section: 1,
                    progress: 0
                };
                setParticles(prev => [...prev, newParticle]);
                lastSpawn = timestamp;
            }

            // Actualizar posición de partículas existentes
            setParticles(prev => {
                return prev
                    .map(particle => {
                        let newProgress = particle.progress + (velocity1 > 0 ? 0.01 : 0);
                        
                        // Partícula en sección 1
                        if (particle.section === 1) {
                            if (newProgress >= 0.4) {
                                // Transición a sección 2
                                return {
                                    ...particle,
                                    section: 2,
                                    progress: 0,
                                    y: diameter2 / 2
                                };
                            }
                            return {
                                ...particle,
                                progress: newProgress,
                                x: newProgress * PIPE_WIDTH * 0.4
                            };
                        }
                        
                        // Partícula en sección 2
                        if (particle.section === 2) {
                            if (newProgress >= 0.6) {
                                // Eliminar partícula al salir
                                return null;
                            }
                            return {
                                ...particle,
                                progress: newProgress,
                                x: PIPE_WIDTH * 0.4 + newProgress * PIPE_WIDTH * 0.6
                            };
                        }
                        
                        return particle;
                    })
                    .filter(p => p !== null);
            });

            animationFrame.current = requestAnimationFrame(animate);
        };

        animationFrame.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current);
            }
        };
    }, [isAnimating, showParticles, velocity1, velocity2, diameter1, diameter2]);

    const formatPressure = (pressure) => {
        if (pressure >= 1000) {
            return `${(pressure / 1000).toFixed(2)} kPa`;
        }
        return `${pressure.toFixed(0)} Pa`;
    };

    const formatVelocity = (velocity) => {
        return `${velocity.toFixed(2)} m/s`;
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
                <Text style={styles.headerTitle}>{t('fluidFlowSimulation.title')}</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Visualización del sistema */}
                <View style={styles.visualizationContainer}>
                    <View style={styles.pipeContainer}>
                        <Svg width={PIPE_WIDTH + 40} height={300}>
                            <Defs>
                                <LinearGradient id="fluidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <Stop offset="0%" stopColor={fluids[selectedFluid].color} stopOpacity="0.6" />
                                    <Stop offset="40%" stopColor={fluids[selectedFluid].color} stopOpacity="0.7" />
                                    <Stop offset="100%" stopColor={fluids[selectedFluid].color} stopOpacity="0.8" />
                                </LinearGradient>
                            </Defs>

                            {/* Tubería sección 1 (más ancha) */}
                            <Rect
                                x="20"
                                y={150 - height1 + (PIPE_HEIGHT - diameter1) / 2}
                                width={PIPE_WIDTH * 0.4}
                                height={diameter1}
                                fill="url(#fluidGradient)"
                                stroke="#01579B"
                                strokeWidth="3"
                                rx="5"
                            />

                            {/* Tubería sección 2 (más angosta) */}
                            <Rect
                                x={20 + PIPE_WIDTH * 0.4}
                                y={150 - height2 + (PIPE_HEIGHT - diameter2) / 2}
                                width={PIPE_WIDTH * 0.6}
                                height={diameter2}
                                fill="url(#fluidGradient)"
                                stroke="#01579B"
                                strokeWidth="3"
                                rx="5"
                            />

                            {/* Conexión entre secciones */}
                            <Path
                                d={`M ${20 + PIPE_WIDTH * 0.4} ${150 - height1 + (PIPE_HEIGHT - diameter1) / 2}
                                    L ${20 + PIPE_WIDTH * 0.4} ${150 - height2 + (PIPE_HEIGHT - diameter2) / 2}
                                    L ${20 + PIPE_WIDTH * 0.4 + 10} ${150 - height2 + (PIPE_HEIGHT - diameter2) / 2}
                                    L ${20 + PIPE_WIDTH * 0.4 + 10} ${150 - height2 + (PIPE_HEIGHT - diameter2) / 2 + diameter2}
                                    L ${20 + PIPE_WIDTH * 0.4} ${150 - height1 + (PIPE_HEIGHT - diameter1) / 2 + diameter1}
                                    Z`}
                                fill={fluids[selectedFluid].color}
                                opacity="0.7"
                                stroke="#01579B"
                                strokeWidth="2"
                            />

                            {/* Líneas de nivel de referencia */}
                            <Line
                                x1="10"
                                y1="240"
                                x2={PIPE_WIDTH + 30}
                                y2="240"
                                stroke="#666"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                            />
                            <SvgText x="10" y="255" fontSize="12" fill="#666">
                                {t('fluidFlowSimulation.referenceLevel')}
                            </SvgText>

                            {/* Indicadores de altura */}
                            <Line
                                x1={20 + PIPE_WIDTH * 0.2}
                                y1={150 - height1 + PIPE_HEIGHT / 2}
                                x2={20 + PIPE_WIDTH * 0.2}
                                y2="240"
                                stroke="#E91E63"
                                strokeWidth="2"
                                strokeDasharray="3,3"
                            />
                            <SvgText 
                                x={20 + PIPE_WIDTH * 0.2 - 15} 
                                y={150 - height1 + PIPE_HEIGHT / 2 - 10}
                                fontSize="14" 
                                fill="#E91E63"
                                fontWeight="bold"
                            >
                                h1
                            </SvgText>

                            <Line
                                x1={20 + PIPE_WIDTH * 0.7}
                                y1={150 - height2 + PIPE_HEIGHT / 2}
                                x2={20 + PIPE_WIDTH * 0.7}
                                y2="240"
                                stroke="#E91E63"
                                strokeWidth="2"
                                strokeDasharray="3,3"
                            />
                            <SvgText 
                                x={20 + PIPE_WIDTH * 0.7 - 15} 
                                y={150 - height2 + PIPE_HEIGHT / 2 - 10}
                                fontSize="14" 
                                fill="#E91E63"
                                fontWeight="bold"
                            >
                                h2
                            </SvgText>

                            {/* Partículas de flujo */}
                            {showParticles && particles.map(particle => (
                                <Circle
                                    key={particle.id}
                                    cx={20 + particle.x}
                                    cy={particle.section === 1 
                                        ? 150 - height1 + (PIPE_HEIGHT - diameter1) / 2 + particle.y
                                        : 150 - height2 + (PIPE_HEIGHT - diameter2) / 2 + particle.y
                                    }
                                    r="3"
                                    fill="#FFFFFF"
                                    opacity="0.9"
                                />
                            ))}

                            {/* Etiquetas de sección */}
                            <SvgText 
                                x={20 + PIPE_WIDTH * 0.2} 
                                y={150 - height1 + (PIPE_HEIGHT - diameter1) / 2 + diameter1 + 20}
                                fontSize="16" 
                                fill="#01579B"
                                fontWeight="bold"
                                textAnchor="middle"
                            >
                                {t('fluidFlowSimulation.section1')}
                            </SvgText>
                            <SvgText 
                                x={20 + PIPE_WIDTH * 0.7} 
                                y={150 - height2 + (PIPE_HEIGHT - diameter2) / 2 + diameter2 + 20}
                                fontSize="16" 
                                fill="#01579B"
                                fontWeight="bold"
                                textAnchor="middle"
                            >
                                {t('fluidFlowSimulation.section2')}
                            </SvgText>

                            {/* Flechas de velocidad */}
                            <Polygon
                                points={`${20 + PIPE_WIDTH * 0.15},${150 - height1 + PIPE_HEIGHT / 2 - 5} 
                                        ${20 + PIPE_WIDTH * 0.15 + 20},${150 - height1 + PIPE_HEIGHT / 2} 
                                        ${20 + PIPE_WIDTH * 0.15},${150 - height1 + PIPE_HEIGHT / 2 + 5}`}
                                fill="#4CAF50"
                            />
                            <Polygon
                                points={`${20 + PIPE_WIDTH * 0.65},${150 - height2 + PIPE_HEIGHT / 2 - 5} 
                                        ${20 + PIPE_WIDTH * 0.65 + 30},${150 - height2 + PIPE_HEIGHT / 2} 
                                        ${20 + PIPE_WIDTH * 0.65},${150 - height2 + PIPE_HEIGHT / 2 + 5}`}
                                fill="#4CAF50"
                            />
                        </Svg>
                    </View>
                </View>

                {/* Controles */}
                <View style={styles.controlsSection}>
                    <Text style={styles.sectionTitle}>{t('fluidFlowSimulation.controls')}</Text>

                    {/* Selector de fluido */}
                    <View style={styles.controlCard}>
                        <Text style={styles.controlLabel}>{t('fluidFlowSimulation.fluidType')}</Text>
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
                                    <Text style={styles.fluidButtonText}>{fluid.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Control de caudal */}
                    <View style={styles.controlCard}>
                        <Text style={styles.controlLabel}>{t('fluidFlowSimulation.flowRate')}: {flowRate.toFixed(1)}</Text>
                        <View style={styles.sliderButtons}>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setFlowRate(Math.max(0.5, flowRate - 0.5))}
                            >
                                <Text style={styles.adjustButtonText}>-</Text>
                            </TouchableOpacity>
                            <View style={styles.valueDisplay}>
                                <Text style={styles.valueText}>{flowRate.toFixed(1)} L/s</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setFlowRate(Math.min(10, flowRate + 0.5))}
                            >
                                <Text style={styles.adjustButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Control de diámetros */}
                    <View style={styles.controlCard}>
                        <Text style={styles.controlLabel}>{t('fluidFlowSimulation.diameterSection1')}: {diameter1}</Text>
                        <View style={styles.sliderButtons}>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setDiameter1(Math.max(20, diameter1 - 5))}
                            >
                                <Text style={styles.adjustButtonText}>-</Text>
                            </TouchableOpacity>
                            <View style={styles.valueDisplay}>
                                <Text style={styles.valueText}>{diameter1} mm</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setDiameter1(Math.min(60, diameter1 + 5))}
                            >
                                <Text style={styles.adjustButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.controlCard}>
                        <Text style={styles.controlLabel}>{t('fluidFlowSimulation.diameterSection2')}: {diameter2}</Text>
                        <View style={styles.sliderButtons}>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setDiameter2(Math.max(15, diameter2 - 5))}
                            >
                                <Text style={styles.adjustButtonText}>-</Text>
                            </TouchableOpacity>
                            <View style={styles.valueDisplay}>
                                <Text style={styles.valueText}>{diameter2} mm</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setDiameter2(Math.min(50, diameter2 + 5))}
                            >
                                <Text style={styles.adjustButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Control de alturas */}
                    <View style={styles.controlCard}>
                        <Text style={styles.controlLabel}>{t('fluidFlowSimulation.heightSection1')}: {height1}</Text>
                        <View style={styles.sliderButtons}>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setHeight1(Math.max(20, height1 - 10))}
                            >
                                <Text style={styles.adjustButtonText}>-</Text>
                            </TouchableOpacity>
                            <View style={styles.valueDisplay}>
                                <Text style={styles.valueText}>{height1} cm</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setHeight1(Math.min(120, height1 + 10))}
                            >
                                <Text style={styles.adjustButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.controlCard}>
                        <Text style={styles.controlLabel}>{t('fluidFlowSimulation.heightSection2')}: {height2}</Text>
                        <View style={styles.sliderButtons}>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setHeight2(Math.max(20, height2 - 10))}
                            >
                                <Text style={styles.adjustButtonText}>-</Text>
                            </TouchableOpacity>
                            <View style={styles.valueDisplay}>
                                <Text style={styles.valueText}>{height2} cm</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.adjustButton}
                                onPress={() => setHeight2(Math.min(120, height2 + 10))}
                            >
                                <Text style={styles.adjustButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Toggle de partículas */}
                    <View style={styles.controlCard}>
                        <View style={styles.switchRow}>
                            <Text style={styles.controlLabel}>{t('fluidFlowSimulation.showParticles')}</Text>
                            <Switch
                                value={showParticles}
                                onValueChange={setShowParticles}
                                trackColor={{ false: '#767577', true: '#4CAF50' }}
                                thumbColor={showParticles ? '#ffffff' : '#f4f3f4'}
                            />
                        </View>
                    </View>

                    {/* Toggle de animación */}
                    <View style={styles.controlCard}>
                        <View style={styles.switchRow}>
                            <Text style={styles.controlLabel}>{t('fluidFlowSimulation.animateFlow')}</Text>
                            <Switch
                                value={isAnimating}
                                onValueChange={setIsAnimating}
                                trackColor={{ false: '#767577', true: '#4CAF50' }}
                                thumbColor={isAnimating ? '#ffffff' : '#f4f3f4'}
                            />
                        </View>
                    </View>
                </View>

                {/* Resultados */}
                <View style={styles.resultsSection}>
                    <Text style={styles.sectionTitle}>{t('fluidFlowSimulation.results')}</Text>
                    
                    <View style={styles.resultGrid}>
                        <View style={styles.resultCard}>
                            <Text style={styles.resultTitle}>{t('fluidFlowSimulation.section1')}</Text>
                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>{t('fluidFlowSimulation.area')}</Text>
                                <Text style={styles.resultValue}>{(area1 * 10000).toFixed(2)} cm²</Text>
                            </View>
                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>{t('fluidFlowSimulation.velocity')}</Text>
                                <Text style={styles.resultValue}>{formatVelocity(velocity1)}</Text>
                            </View>
                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>{t('fluidFlowSimulation.pressure')}</Text>
                                <Text style={styles.resultValue}>{formatPressure(pressure1)}</Text>
                            </View>
                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>{t('fluidFlowSimulation.height')}</Text>
                                <Text style={styles.resultValue}>{height1} cm</Text>
                            </View>
                        </View>

                        <View style={styles.resultCard}>
                            <Text style={styles.resultTitle}>{t('fluidFlowSimulation.section2')}</Text>
                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>{t('fluidFlowSimulation.area')}</Text>
                                <Text style={styles.resultValue}>{(area2 * 10000).toFixed(2)} cm²</Text>
                            </View>
                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>{t('fluidFlowSimulation.velocity')}</Text>
                                <Text style={styles.resultValue}>{formatVelocity(velocity2)}</Text>
                            </View>
                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>{t('fluidFlowSimulation.pressure')}</Text>
                                <Text style={styles.resultValue}>{formatPressure(pressure2)}</Text>
                            </View>
                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>{t('fluidFlowSimulation.height')}</Text>
                                <Text style={styles.resultValue}>{height2} cm</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>{t('fluidFlowSimulation.observations')}</Text>
                        <Text style={styles.infoText}>
                            {t('fluidFlowSimulation.observation1')}
                        </Text>
                        <Text style={styles.infoText}>
                            {t('fluidFlowSimulation.observation2')}
                        </Text>
                        <Text style={styles.infoText}>
                            {t('fluidFlowSimulation.observation3')}
                        </Text>
                    </View>
                </View>

                {/* Fórmulas */}
                <View style={styles.formulaSection}>
                    <Text style={styles.sectionTitle}>{t('fluidFlowSimulation.fundamentalEquations')}</Text>
                    
                    <View style={styles.formulaCard}>
                        <Text style={styles.formulaTitle}>{t('fluidFlowSimulation.continuityEquation')}</Text>
                        <Text style={styles.formula}>{t('fluidFlowSimulation.continuityFormula')}</Text>
                        <Text style={styles.formulaDescription}>
                            {t('fluidFlowSimulation.continuityDescription')}
                        </Text>
                    </View>

                    <View style={styles.formulaCard}>
                        <Text style={styles.formulaTitle}>{t('fluidFlowSimulation.bernoulliEquation')}</Text>
                        <Text style={styles.formula}>{t('fluidFlowSimulation.bernoulliFormula')}</Text>
                        <Text style={styles.formulaDescription}>
                            {t('fluidFlowSimulation.bernoulliDescription')}
                        </Text>
                    </View>

                    <View style={styles.formulaCard}>
                        <Text style={styles.formulaTitle}>{t('fluidFlowSimulation.volumetricFlow')}</Text>
                        <Text style={styles.formula}>{t('fluidFlowSimulation.volumetricFormula')}</Text>
                        <Text style={styles.formulaDescription}>
                            {t('fluidFlowSimulation.volumetricDescription')}
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
    pipeContainer: {
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
    fluidButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8,
    },
    fluidButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        minWidth: 80,
        alignItems: 'center',
    },
    selectedFluidButton: {
        borderWidth: 3,
        borderColor: '#01579B',
    },
    fluidButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
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
    resultGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    resultCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        flex: 1,
        marginHorizontal: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#01579B',
        marginBottom: 12,
        textAlign: 'center',
    },
    resultRow: {
        marginBottom: 8,
    },
    resultLabel: {
        fontSize: 12,
        color: '#666',
    },
    resultValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0277BD',
    },
    infoCard: {
        backgroundColor: '#FFF3E0',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
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

export default FluidFlowScreen;

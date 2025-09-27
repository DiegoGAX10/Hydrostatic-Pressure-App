import React, { useState, useEffect, useRef } from 'react';
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
import { useLanguage } from '../../contexts/LanguageContext';
import Svg, { Rect, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop, Path, Polygon, Ellipse } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CONTAINER_WIDTH = screenWidth - 40;
const CONTAINER_HEIGHT = 300;
const WATER_DENSITY = 1000; // kg/m³
const GRAVITY = 9.81; // m/s²

// Object properties - moved outside component to avoid runtime issues
const OBJECT_SIZE = 30; // tamaño en pixels del objeto
const OBJECT_VOLUME = Math.pow(0.03, 3); // volumen real en m³ (3cm x 3cm x 3cm)
const OBJECT_DENSITY = 2000; // kg/m³ (más denso que el agua)
const CONTAINER_CROSS_SECTION = 0.01; // área transversal del tanque en m² (simulada)

const HydrostaticPressureScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const [objectPosition, setObjectPosition] = useState(150); // posición del objeto desde arriba (más cerca del agua)
    const [pressure, setPressure] = useState(0);
    const [baseWaterLevel, setBaseWaterLevel] = useState(200); // nivel base de agua sin objeto
    const [currentWaterLevel, setCurrentWaterLevel] = useState(200); // nivel actual de agua
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedFluid, setSelectedFluid] = useState('water');
    const [buoyantForce, setBuoyantForce] = useState(0);
    const [volumeDisplaced, setVolumeDisplaced] = useState(0);
    const [isDragging, setIsDragging] = useState(false); // para pausar la simulación mientras se arrastra
    const [scrollEnabled, setScrollEnabled] = useState(true); // controlar el scroll
    const [ripples, setRipples] = useState([]); // ondas en el agua

    const scrollViewRef = useRef(null);
    const rippleAnimations = useRef(new Map());

    const fluids = {
        water: { density: 1000, color: '#4FC3F7', name: t('simulation.water') },
        oil: { density: 800, color: '#FFA726', name: t('simulation.oil') },
        mercury: { density: 13600, color: '#9E9E9E', name: t('simulation.mercury') }
    };

    // Animación para el punto de medición
    const pointAnimation = useRef(new Animated.Value(0)).current;
    const objectAnimatedValue = useRef(new Animated.Value(objectPosition)).current;

    // Función para crear ondas cuando el objeto entra al agua
    const createRipple = (x, y) => {
        const rippleId = Date.now() + Math.random();
        const animation = new Animated.Value(0);
        
        const newRipple = {
            id: rippleId,
            x,
            y,
            animation
        };

        // Store animation reference for cleanup
        rippleAnimations.current.set(rippleId, animation);
        
        setRipples(prev => [...prev, newRipple]);

        Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                setRipples(prev => prev.filter(r => r.id !== rippleId));
                rippleAnimations.current.delete(rippleId);
            }
        });
    };

    useEffect(() => {
        // Coordenadas del contenedor (tanque empieza en y=50 y termina en y=350)
        const tankTop = 50;
        const tankBottom = tankTop + CONTAINER_HEIGHT;
        const objectTop = objectPosition;
        const objectBottom = objectPosition + OBJECT_SIZE;
        const fluidDensity = fluids[selectedFluid].density;
        
        let submergedVolume = 0;
        let submergedHeight = 0;
        let newWaterLevel = baseWaterLevel;
        let depth = 0;

        // Variable para detectar si el objeto acaba de tocar el agua
        const wasAboveWater = objectBottom <= baseWaterLevel;

        // Calcular cuánto del objeto está sumergido
        if (objectBottom > baseWaterLevel && objectTop < tankBottom) {
            // El objeto está tocando o está dentro del fluido
            const submergedTop = Math.max(objectTop, baseWaterLevel);
            const submergedBottom = Math.min(objectBottom, tankBottom);
            submergedHeight = Math.max(0, submergedBottom - submergedTop);
            
            // Calcular el ratio de submersión
            const submergedRatio = submergedHeight / OBJECT_SIZE;
            submergedVolume = OBJECT_VOLUME * submergedRatio;

            // Calcular elevación del líquido por desplazamiento
            // Mayor factor multiplicador para efecto visual más notorio
            const volumeDisplacementInPixels = (submergedVolume / CONTAINER_CROSS_SECTION) * 5000;
            newWaterLevel = baseWaterLevel - volumeDisplacementInPixels;

            // Calcular profundidad real del objeto sumergido
            // La profundidad es desde la superficie del agua hasta la parte más baja del objeto sumergido
            if (objectBottom > newWaterLevel) {
                depth = Math.max(0, (objectBottom - newWaterLevel)) / 100; // convertir pixels a metros (aprox)
            }

            // Ripple animations disabled to prevent immutable object errors
            // if ((wasAboveWater || Math.abs(volumeDisplacementInPixels) > 3) && !isDragging) {
            //     createRipple(CONTAINER_WIDTH / 2, newWaterLevel);
            // }
        }

        // Actualizar estados
        setCurrentWaterLevel(newWaterLevel);
        setVolumeDisplaced(submergedVolume * 1000000); // convertir a cm³

        // Calcular presión hidrostática
        const calculatedPressure = fluidDensity * GRAVITY * depth;
        setPressure(calculatedPressure);

        // Calcular fuerza de flotación: F = ρ_fluid * g * V_displaced
        const buoyancy = fluidDensity * GRAVITY * submergedVolume;
        setBuoyantForce(buoyancy);

    }, [objectPosition, selectedFluid, baseWaterLevel, isDragging]);

    useEffect(() => {
        if (isPlaying && !isDragging) {
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
            Animated.timing(pointAnimation, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
            }).start();
        }
    }, [isPlaying, isDragging]);

    // Cleanup effect for animations
    useEffect(() => {
        return () => {
            // Stop all animations on unmount
            pointAnimation.stopAnimation();
            objectAnimatedValue.stopAnimation();
            
            // Clear all ripple animations
            rippleAnimations.current.forEach((animation) => {
                animation.stopAnimation();
            });
            rippleAnimations.current.clear();
        };
    }, []);

    // PanResponder para arrastrar el objeto
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
            setIsDragging(true);
            setScrollEnabled(false); // deshabilitar scroll

            // Obtener la posición inicial del toque
            const { locationY } = event.nativeEvent;

            // Crear una animación suave para seguir el dedo
            Animated.timing(objectAnimatedValue, {
                toValue: objectPosition,
                duration: 0,
                useNativeDriver: true,
            }).start();
        },
        onPanResponderMove: (event, gestureState) => {
            const { moveY, dy } = gestureState;
            const containerTopOffset = 170; // offset ajustado del contenedor desde la parte superior

            // Limitar el movimiento dentro del contenedor y un poco arriba
            const minPosition = 20; // permite que el objeto esté completamente fuera del agua
            const maxPosition = 50 + CONTAINER_HEIGHT - OBJECT_SIZE; // puede llegar hasta el fondo del tanque

            let newPosition = objectPosition + dy * 0.8; // factor de suavizado
            newPosition = Math.max(minPosition, Math.min(maxPosition, newPosition));

            // Actualizar posición directamente sin animación durante el arrastre
            Animated.timing(objectAnimatedValue, {
                toValue: newPosition,
                duration: 0,
                useNativeDriver: true,
            }).start();
            setObjectPosition(newPosition);
        },
        onPanResponderRelease: (event, gestureState) => {
            setIsDragging(false);
            setScrollEnabled(true); // rehabilitar scroll

            // Animación de rebote suave al soltar
            Animated.spring(objectAnimatedValue, {
                toValue: objectPosition,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }).start();
        },
        onPanResponderTerminate: () => {
            setIsDragging(false);
            setScrollEnabled(true);
        },
    });

    const formatPressure = (pressure) => {
        if (pressure >= 1000) {
            return `${(pressure / 1000).toFixed(2)} kPa`;
        }
        return `${pressure.toFixed(0)} Pa`;
    };

    const formatForce = (force) => {
        if (force >= 1) {
            return `${force.toFixed(3)} N`;
        }
        return `${(force * 1000).toFixed(1)} mN`;
    };

    const scale = pointAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.3],
    });

    const opacity = pointAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
    });

    // Calcular la profundidad del objeto en el fluido para el efecto visual
    const getSubmergedDepth = () => {
        const tankBottom = 50 + CONTAINER_HEIGHT;
        const objectTop = objectPosition;
        const objectBottom = objectPosition + OBJECT_SIZE;
        
        // Verificar si el objeto está tocando o dentro del fluido
        if (objectBottom > currentWaterLevel && objectTop < tankBottom) {
            const submergedTop = Math.max(objectTop, currentWaterLevel);
            const submergedBottom = Math.min(objectBottom, tankBottom);
            return Math.max(0, submergedBottom - submergedTop);
        }
        return 0;
    };

    // Calcular el desplazamiento visual del agua para mayor efecto
    const getWaterDisplacement = () => {
        const tankBottom = 50 + CONTAINER_HEIGHT;
        const objectTop = objectPosition;
        const objectBottom = objectPosition + OBJECT_SIZE;
        
        if (objectBottom > baseWaterLevel && objectTop < tankBottom) {
            const submergedTop = Math.max(objectTop, baseWaterLevel);
            const submergedBottom = Math.min(objectBottom, tankBottom);
            const submergedHeight = Math.max(0, submergedBottom - submergedTop);
            const submergedRatio = submergedHeight / OBJECT_SIZE;
            return submergedRatio * 20; // Factor para efecto visual
        }
        return 0;
    };


    // Función para obtener la intensidad del color del fluido basado en la profundidad
    const getFluidIntensity = () => {
        const displacement = getWaterDisplacement();
        return Math.min(1, 0.3 + displacement * 0.05); // Aumenta la intensidad con la profundidad
    };

    // Calcular el peso del objeto
    const getObjectWeight = () => {
        // Peso = masa * gravedad = densidad * volumen * gravedad
        const objectWeight = OBJECT_DENSITY * OBJECT_VOLUME * GRAVITY;
        return objectWeight; // en Newtons
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
                <Text style={styles.headerTitle}>{t('simulation.hydrostaticPressure')}</Text>
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                scrollEnabled={scrollEnabled}
            >
                {/* Simulación */}
                <View style={styles.simulationContainer}>
                    <View style={styles.tankContainer}>
                        <Svg width={CONTAINER_WIDTH} height={CONTAINER_HEIGHT + 100}>
                            <Defs>
                                <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <Stop offset="0%" stopColor={fluids[selectedFluid].color} stopOpacity="0.3" />
                                    <Stop offset="100%" stopColor={fluids[selectedFluid].color} stopOpacity={getFluidIntensity()} />
                                </LinearGradient>
                                <LinearGradient id="submergedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <Stop offset="0%" stopColor={fluids[selectedFluid].color} stopOpacity="0.6" />
                                    <Stop offset="100%" stopColor={fluids[selectedFluid].color} stopOpacity="0.9" />
                                </LinearGradient>
                                <LinearGradient id="depthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <Stop offset="0%" stopColor={fluids[selectedFluid].color} stopOpacity="0.4" />
                                    <Stop offset="50%" stopColor={fluids[selectedFluid].color} stopOpacity="0.7" />
                                    <Stop offset="100%" stopColor={fluids[selectedFluid].color} stopOpacity="0.95" />
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

                            {/* Líquido con gradiente de profundidad */}
                            <Rect
                                x="53"
                                y={Math.max(currentWaterLevel, 50)}
                                width={CONTAINER_WIDTH - 106}
                                height={Math.max(0, 50 + CONTAINER_HEIGHT - Math.max(currentWaterLevel, 50))}
                                fill="url(#depthGradient)"
                            />

                            {/* Superficie del líquido con ondas más pronunciadas */}
                            <Path
                                d={`M 53 ${currentWaterLevel} 
                                   Q 80 ${currentWaterLevel - (isDragging ? 5 + getWaterDisplacement() : 0)} 120 ${currentWaterLevel}
                                   Q 160 ${currentWaterLevel + (isDragging ? 3 + getWaterDisplacement() * 0.5 : 0)} 200 ${currentWaterLevel}
                                   Q 240 ${currentWaterLevel - (isDragging ? 2 + getWaterDisplacement() * 0.3 : 0)} ${CONTAINER_WIDTH - 53} ${currentWaterLevel}`}
                                stroke="#0277BD"
                                strokeWidth="3"
                                fill="none"
                            />


                            {/* Ondas en el agua - simplified to avoid SVG animation issues */}
                            {ripples.map((ripple) => {
                                const waterDisplacement = getWaterDisplacement();
                                const baseRadius = Math.max(40, 40 + waterDisplacement * 2);
                                
                                const animatedRadius = ripple.animation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [3, baseRadius],
                                    extrapolate: 'clamp',
                                });
                                const animatedOpacity = ripple.animation.interpolate({
                                    inputRange: [0, 0.2, 0.8, 1],
                                    outputRange: [0, 0.8, 0.3, 0],
                                    extrapolate: 'clamp',
                                });

                                return (
                                    <React.Fragment key={ripple.id}>
                                        <Circle
                                            cx={ripple.x}
                                            cy={ripple.y}
                                            r={animatedRadius}
                                            fill="none"
                                            stroke={fluids[selectedFluid].color}
                                            strokeWidth="2"
                                            strokeOpacity={animatedOpacity}
                                        />
                                        <Circle
                                            cx={ripple.x}
                                            cy={ripple.y}
                                            r={animatedRadius}
                                            fill="none"
                                            stroke="#FFFFFF"
                                            strokeWidth="1"
                                            strokeOpacity={animatedOpacity}
                                        />
                                    </React.Fragment>
                                );
                            })}

                            {/* Línea del nivel original del agua */}
                            {currentWaterLevel !== baseWaterLevel && (
                                <Line
                                    x1="53"
                                    y1={baseWaterLevel}
                                    x2={CONTAINER_WIDTH - 53}
                                    y2={baseWaterLevel}
                                    stroke="#0277BD"
                                    strokeWidth="1"
                                    strokeDasharray="2,2"
                                    strokeOpacity="0.5"
                                />
                            )}




                            {/* Línea indicadora del nivel del líquido en el objeto */}
                            {objectPosition + OBJECT_SIZE > currentWaterLevel && (
                                <Line
                                    x1={CONTAINER_WIDTH / 2 - OBJECT_SIZE / 2 - 10}
                                    y1={currentWaterLevel}
                                    x2={CONTAINER_WIDTH / 2 + OBJECT_SIZE / 2 + 10}
                                    y2={currentWaterLevel}
                                    stroke="#00ACC1"
                                    strokeWidth="2"
                                    strokeDasharray="2,2"
                                />
                            )}

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
                                {t('simulation.depth')}
                            </SvgText>
                        </Svg>

                        {/* Objeto animado con mejor interacción */}
                        <Animated.View
                            style={[
                                styles.objectContainer,
                                {
                                    left: CONTAINER_WIDTH / 2 - OBJECT_SIZE / 2,
                                    top: 0,
                                    transform: [
                                        { translateY: objectAnimatedValue },
                                        { scale },
                                        { rotateZ: isDragging ? '2deg' : '0deg' }
                                    ],
                                    opacity,
                                    elevation: isDragging ? 8 : 5,
                                    shadowOpacity: isDragging ? 0.4 : 0.3,
                                }
                            ]}
                            {...panResponder.panHandlers}
                        >
                            <View style={[
                                styles.draggableObject,
                                isDragging && styles.draggableObjectDragging
                            ]} />
                            {isDragging && (
                                <View style={styles.dragIndicator}>
                                    <Text style={styles.dragIndicatorText}>⇅</Text>
                                </View>
                            )}
                        </Animated.View>
                    </View>
                </View>

                {/* Controles */}
                <View style={styles.controlsContainer}>
                    <View style={styles.fluidSelector}>
                        <Text style={styles.controlLabel}>{t('simulation.selectFluid')}</Text>
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


                </View>

                {/* Resultados */}
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultsTitle}>{t('simulation.measurements')}</Text>

                    <View style={styles.resultItem}>
                        <Text style={styles.resultLabel}>{t('simulation.objectWeight')}</Text>
                        <Text style={styles.resultValue}>{formatForce(getObjectWeight())}</Text>
                    </View>

                    <View style={styles.resultItem}>
                        <Text style={styles.resultLabel}>{t('simulation.waterElevation')}</Text>
                        <Text style={[styles.resultValue, {color: Math.abs(baseWaterLevel - currentWaterLevel) > 0 ? '#4CAF50' : '#0277BD'}]}>
                            {Math.abs(baseWaterLevel - currentWaterLevel).toFixed(1)} px
                        </Text>
                    </View>

                    <View style={styles.resultItem}>
                        <Text style={styles.resultLabel}>{t('simulation.objectPosition')}</Text>
                        <Text style={styles.resultValue}>{((objectPosition - 50) / CONTAINER_HEIGHT * 100).toFixed(1)}%</Text>
                    </View>

                    <View style={styles.resultItem}>
                        <Text style={styles.resultLabel}>{t('simulation.displacedVolume')}</Text>
                        <Text style={styles.resultValue}>{volumeDisplaced.toFixed(2)} cm³</Text>
                    </View>

                    <View style={styles.resultItem}>
                        <Text style={styles.resultLabel}>{t('simulation.hydrostaticPressure')}</Text>
                        <Text style={styles.resultValue}>{formatPressure(pressure)}</Text>
                    </View>

                    <View style={styles.resultItem}>
                        <Text style={styles.resultLabel}>{t('simulation.buoyantForce')}</Text>
                        <Text style={styles.resultValue}>{formatForce(buoyantForce)}</Text>
                    </View>

                    <View style={styles.resultItem}>
                        <Text style={styles.resultLabel}>{t('simulation.fluidDensity')}</Text>
                        <Text style={styles.resultValue}>{fluids[selectedFluid].density} kg/m³</Text>
                    </View>

                    <View style={styles.resultItem}>
                        <Text style={styles.resultLabel}>{t('simulation.atmosphericPressure')}</Text>
                        <Text style={styles.resultValue}>101.325 kPa</Text>
                    </View>

                    <View style={styles.resultItem}>
                        <Text style={styles.resultLabel}>{t('simulation.absolutePressure')}</Text>
                        <Text style={styles.resultValue}>{formatPressure(pressure + 101325)}</Text>
                    </View>
                </View>

                {/* Fórmulas */}
                <View style={styles.formulaContainer}>
                    <Text style={styles.formulaTitle}>{t('simulation.archimedesPrinciple')}</Text>

                    <Text style={styles.formula}>F_b = ρ_f × g × V_d</Text>
                    <Text style={styles.formulaSubtitle}>{t('simulation.buoyantForceFormula')}</Text>

                    <Text style={styles.formula}>P = ρ × g × h</Text>
                    <Text style={styles.formulaSubtitle}>{t('simulation.hydrostaticPressureFormula')}</Text>

                    <Text style={styles.formulaDescription}>
                        {t('simulation.formulaDescription')}
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
    objectContainer: {
        position: 'absolute',
        width: OBJECT_SIZE,
        height: OBJECT_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
    },
    draggableObject: {
        width: OBJECT_SIZE,
        height: OBJECT_SIZE,
        backgroundColor: 'rgba(255, 107, 53, 0.9)',
        borderWidth: 2,
        borderColor: '#D84315',
        borderRadius: 2,
        transition: 'all 0.2s ease',
    },
    draggableObjectDragging: {
        backgroundColor: 'rgba(255, 107, 53, 1)',
        borderWidth: 3,
        borderColor: '#FF3D00',
        transform: [{ scale: 1.05 }],
    },
    dragIndicator: {
        position: 'absolute',
        top: -25,
        left: OBJECT_SIZE / 2 - 8,
        width: 16,
        height: 16,
        backgroundColor: '#FF3D00',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dragIndicatorText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
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
        marginBottom: 4,
    },
    formulaSubtitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 12,
        fontStyle: 'italic',
    },
    formulaDescription: {
        fontSize: 14,
        color: '#37474F',
        lineHeight: 20,
    },
});

export default HydrostaticPressureScreen;
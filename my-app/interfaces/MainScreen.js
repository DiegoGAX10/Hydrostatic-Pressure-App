import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const MainScreen = () => {
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
    }, []);

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

const MenuItem = ({ unit, icon, children, isOpen, onToggle }) => {
    return (
        <View style={styles.menuItem}>
            <TouchableOpacity style={styles.menuHeader} onPress={onToggle}>
                <View style={styles.menuTitleContainer}>
                    <Text style={styles.iconText}>{icon}</Text>
                    <Text style={styles.menuTitle}>{unit}</Text>
                </View>
                <View style={styles.chevron}>
                    <Text style={styles.chevronText}>{isOpen ? '▲' : '▼'}</Text>
                </View>
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.menuContent}>
                    {children}
                </View>
            )}
        </View>
    );
};

const UnitContent = ({ title, topics }) => {
    return (
        <View style={styles.unitContent}>
            <Text style={styles.unitTitle}>{title}</Text>
            {topics.map((topic, index) => (
                <View key={index} style={styles.topicItem}>
                    <Text style={styles.topicBullet}>•</Text>
                    <Text style={styles.topicText}>{topic}</Text>
                </View>
            ))}
        </View>
    );
};

export default function App() {
    const [openUnit, setOpenUnit] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const toggleUnit = (unitIndex) => {
        setOpenUnit(openUnit === unitIndex ? null : unitIndex);
    };

    const unitsData = [
        {
            unit: "Unidad 1",
            icon: "💧",
            title: "Fundamentos de la Hidráulica",
            topics: [
                "Propiedades de los fluidos: densidad, viscosidad y compresibilidad",
                "Principio de Pascal y sus aplicaciones en sistemas hidráulicos",
                "Principio de Arquímedes y flotación de cuerpos",
                "Presión hidrostática y variación con la profundidad",
                "Densidad y peso específico de diferentes fluidos",
                "Viscosidad cinemática y dinámica de los fluidos",
                "Tensión superficial y capilaridad"
            ]
        },
        {
            unit: "Unidad 2",
            icon: "🌊",
            title: "Hidrostática",
            topics: [
                "Presión en fluidos en reposo y ecuación fundamental",
                "Manómetros, barómetros y medición de presión",
                "Fuerzas sobre superficies sumergidas planas",
                "Fuerzas sobre superficies sumergidas curvas",
                "Centro de presión y centro de gravedad",
                "Principio de flotación y estabilidad",
                "Metacentro y condiciones de equilibrio"
            ]
        },
        {
            unit: "Unidad 3",
            icon: "⚡",
            title: "Hidrodinámica",
            topics: [
                "Ecuación de continuidad para flujo permanente",
                "Ecuación de Bernoulli y sus aplicaciones",
                "Teorema de Torricelli y descarga de orificios",
                "Flujo laminar y turbulento (número de Reynolds)",
                "Pérdidas de energía por fricción en tuberías",
                "Coeficiente de fricción de Darcy-Weisbach",
                "Pérdidas menores y localizadas"
            ]
        },
        {
            unit: "Unidad 4",
            icon: "⚙️",
            title: "Sistemas Hidráulicos",
            topics: [
                "Bombas hidráulicas: clasificación y principios",
                "Bombas centrífugas y de desplazamiento positivo",
                "Curvas características de bombas",
                "Punto de operación y selección de bombas",
                "Cavitación: causas, efectos y prevención",
                "Sistemas de bombeo en serie y paralelo",
                "Mantenimiento predictivo y correctivo"
            ]
        },
        {
            unit: "Unidad 5",
            icon: "🔧",
            title: "Aplicaciones Industriales",
            topics: [
                "Diseño de sistemas de tuberías",
                "Válvulas: tipos, selección y aplicaciones",
                "Redes de distribución de agua",
                "Análisis de redes mediante métodos numéricos",
                "Golpe de ariete: causas y protección",
                "Sistemas de control hidráulico",
                "Eficiencia energética en sistemas hidráulicos"
            ]
        }
    ];

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar style="light" />
                <MainScreen />
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
                <MainScreen />
                <Text style={styles.appTitle}>Hidráulica</Text>
            </View>

            {/* Main Content */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.menuContainer}>
                    {unitsData.map((unit, index) => (
                        <MenuItem
                            key={index}
                            unit={unit.unit}
                            icon={unit.icon}
                            isOpen={openUnit === index}
                            onToggle={() => toggleUnit(index)}
                        >
                            <UnitContent
                                title={unit.title}
                                topics={unit.topics}
                            />
                        </MenuItem>
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
        backgroundColor: '#E3F2FD',
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
        paddingBottom: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 4,
        borderBottomColor: '#0277BD',
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
    menuContainer: {
        padding: 16,
    },
    menuItem: {
        backgroundColor: '#FFFFFF',
        marginBottom: 12,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderLeftWidth: 4,
        borderLeftColor: '#0277BD',
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
    },
    menuTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 24,
        marginRight: 12,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0277BD',
    },
    chevron: {
        padding: 4,
    },
    chevronText: {
        fontSize: 16,
        color: '#0277BD',
        fontWeight: 'bold',
    },
    menuContent: {
        paddingHorizontal: 18,
        paddingBottom: 18,
    },
    unitContent: {
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#4FC3F7',
    },
    unitTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#01579B',
        marginBottom: 12,
    },
    topicItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    topicBullet: {
        fontSize: 16,
        color: '#0277BD',
        marginRight: 8,
        marginTop: 2,
    },
    topicText: {
        fontSize: 14,
        color: '#37474F',
        flex: 1,
        lineHeight: 20,
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
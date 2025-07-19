// components/UnitCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UnitCard = ({ unit, onPress }) => {
    return (
        <TouchableOpacity style={[styles.card, { backgroundColor: unit.color }]} onPress={onPress}>
            <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{unit.icon}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.unitNumber}>{unit.unit}</Text>
                    <Text style={styles.unitTitle}>{unit.title}</Text>
                    <Text style={styles.topicsCount}>
                        {unit.topics.length} temas • {unit.simulations.length} simulaciones
                    </Text>
                </View>
                <View style={styles.arrow}>
                    <Text style={styles.arrowText}>→</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        borderRadius: 16,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    icon: {
        fontSize: 28,
    },
    textContainer: {
        flex: 1,
        marginLeft: 16,
    },
    unitNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#01579B',
        marginBottom: 4,
    },
    unitTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0277BD',
        marginBottom: 6,
    },
    topicsCount: {
        fontSize: 14,
        color: '#37474F',
        opacity: 0.8,
    },
    arrow: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowText: {
        fontSize: 20,
        color: '#0277BD',
        fontWeight: 'bold',
    },
});

export default UnitCard;
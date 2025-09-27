// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider } from './contexts/LanguageContext';
import MainScreen from './interfaces/MainScreen';
import Unit1Screen from './interfaces/units/Unit1Screen';
import Unit2Screen from './interfaces/units/Unit2Screen';
import Unit3Screen from './interfaces/units/Unit3Screen';
import Unit4Screen from './interfaces/units/Unit4Screen';
import Unit5Screen from './interfaces/units/Unit5Screen';
import HydrostaticPressureScreen from './interfaces/simulations/HydrostaticPressureScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <LanguageProvider>
                <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Main"
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#F5F5F5' },
                }}
            >
                <Stack.Screen
                    name="Main"
                    component={MainScreen}
                    options={{
                        title: 'Hidráulica - Inicio'
                    }}
                />
                <Stack.Screen
                    name="Unit1"
                    component={Unit1Screen}
                    options={{
                        title: 'Fundamentos de la Hidráulica'
                    }}
                />
                <Stack.Screen
                    name="Unit2"
                    component={Unit2Screen}
                    options={{
                        title: 'Hidrostática'
                    }}
                />

                <Stack.Screen
                    name="Unit3"
                    component={Unit3Screen}
                    options={{
                        title: 'Hidrodinámica'
                    }}
                />
                <Stack.Screen
                    name="Unit4"
                    component={Unit4Screen}
                    options={{
                        title: 'Sistemas Hidráulicos'
                    }}
                />
                <Stack.Screen
                    name="Unit5"
                    component={Unit5Screen}
                    options={{
                        title: 'Aplicaciones Industriales'
                    }}
                />
                <Stack.Screen
                    name="HydrostaticPressure"
                    component={HydrostaticPressureScreen}
                    options={{
                        title: 'Simulación: Presión Hidrostática'
                    }}
                />
            </Stack.Navigator>
                </NavigationContainer>
            </LanguageProvider>
        </SafeAreaProvider>
    );
}
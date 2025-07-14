import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./interfaces/MainScreen";
import HydrostaticPressureSimulation from "./interfaces/HydrostaticPressureSimulation";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false, // Oculta el encabezado en todas las pantallas
                }}
            >
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="HydrostaticPressure" component={HydrostaticPressureSimulation} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
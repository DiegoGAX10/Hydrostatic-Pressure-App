// data/unitsData.js

// Function to get units data with translations
export const getUnitsData = (t) => [
    {
        id: 1,
        unit: "Unidad 1",
        icon: "💧",
        title: t('units.unit1.title'),
        description: t('units.unit1.description'),
        screen: "Unit1",
        color: "#E3F2FD",
        topics: [
            "Propiedades de los fluidos: densidad, viscosidad y compresibilidad"
        ],
        simulations: []
    },
    {
        id: 2,
        unit: "Unidad 2",
        icon: "🌊",
        title: t('units.unit2.title'),
        description: t('units.unit2.description'),
        screen: "Unit2",
        color: "#BBDEFB",
        topics: [
        ],
        simulations: [
            {
                name: t('simulation.hydrostaticPressure'),
                screen: "HydrostaticPressure"
            }
        ]
    },
    {
        id: 3,
        unit: "Unidad 3",
        icon: "💨",
        title: t('units.unit3.title'),
        description: t('units.unit3.description'),
        screen: "Unit3",
        color: "#90CAF9",
        topics: [],
        simulations: [
            {
                name: t('simulation.fluidFlow'),
                screen: "FluidFlow"
            }
        ]
    },
    {
        id: 4,
        unit: "Unidad 4",
        icon: "⛓️",
        title: t('units.unit4.title'),
        description: t('units.unit4.description'),
        screen: "Unit4",
        color: "#64B5F6",
        topics: [],
        simulations: [
            {
                name: t('simulation.underPressure'),
                screen: "UnderPressure"
            }
        ]
    }
];

// Legacy export for backward compatibility (using Spanish as default)
export const unitsData = [
    {
        id: 1,
        unit: "Unidad 1",
        icon: "💧",
        title: "Principios Fundamentales",
        description: "Fundamentos básicos de la hidrostática y presión de fluidos",
        screen: "Unit1",
        color: "#E3F2FD",
        topics: [
            "Propiedades de los fluidos: densidad, viscosidad y compresibilidad"
        ],
        simulations: []
    },
    {
        id: 2,
        unit: "Unidad 2",
        icon: "🌊",
        title: "Presión Hidrostática",
        description: "Estudio de la presión en fluidos en reposo y sus aplicaciones",
        screen: "Unit2",
        color: "#BBDEFB",
        topics: [],
        simulations: [
            {
                name: "Presión Hidrostática",
                screen: "HydrostaticPressure"
            }
        ]
    },
    {
        id: 3,
        unit: "Unidad 3",
        icon: "💨",
        title: "Hidrodinámica",
        description: "Estudio del comportamiento de fluidos en movimiento",
        screen: "Unit3",
        color: "#90CAF9",
        topics: [],
        simulations: [
            {
                name: "Flujo de Fluidos",
                screen: "FluidFlow"
            }
        ]
    },
    {
        id: 4,
        unit: "Unidad 4",
        icon: "⛓️",
        title: "Presión en Fluidos",
        description: "Estudio de la presión, densidad y flotación en fluidos",
        screen: "Unit4",
        color: "#64B5F6",
        topics: [],
        simulations: [
            {
                name: "Bajo Presión",
                screen: "UnderPressure"
            }
        ]
    }
];

// data/unitsData.js
export const unitsData = [
    {
        id: 1,
        unit: "Unidad 1",
        icon: "💧",
        title: "Trivia de Hidrostática",
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
        title: "Hidrostática",
        screen: "Unit2",
        color: "#BBDEFB",
        topics: [
            "Presión en fluidos en reposo y ecuación fundamental",
            "Manómetros, barómetros y medición de presión",
            "Fuerzas sobre superficies sumergidas planas",
            "Fuerzas sobre superficies sumergidas curvas",
            "Centro de presión y centro de gravedad",
            "Principio de flotación y estabilidad",
            "Metacentro y condiciones de equilibrio"
        ],
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
        icon: "⚡",
        title: "Hidrodinámica",
        screen: "Unit3",
        color: "#90CAF9",
        topics: [
            "Ecuación de continuidad para flujo permanente",
            "Ecuación de Bernoulli y sus aplicaciones",
            "Teorema de Torricelli y descarga de orificios",
            "Flujo laminar y turbulento (número de Reynolds)",
            "Pérdidas de energía por fricción en tuberías",
            "Coeficiente de fricción de Darcy-Weisbach",
            "Pérdidas menores y localizadas"
        ],
        simulations: []
    },
    {
        id: 4,
        unit: "Unidad 4",
        icon: "⚙️",
        title: "Sistemas Hidráulicos",
        screen: "Unit4",
        color: "#64B5F6",
        topics: [
            "Bombas hidráulicas: clasificación y principios",
            "Bombas centrífugas y de desplazamiento positivo",
            "Curvas características de bombas",
            "Punto de operación y selección de bombas",
            "Cavitación: causas, efectos y prevención",
            "Sistemas de bombeo en serie y paralelo",
            "Mantenimiento predictivo y correctivo"
        ],
        simulations: []
    },
    {
        id: 5,
        unit: "Unidad 5",
        icon: "🔧",
        title: "Aplicaciones Industriales",
        screen: "Unit5",
        color: "#42A5F5",
        topics: [
            "Diseño de sistemas de tuberías",
            "Válvulas: tipos, selección y aplicaciones",
            "Redes de distribución de agua",
            "Análisis de redes mediante métodos numéricos",
            "Golpe de ariete: causas y protección",
            "Sistemas de control hidráulico",
            "Eficiencia energética en sistemas hidráulicos"
        ],
        simulations: []
    }
];
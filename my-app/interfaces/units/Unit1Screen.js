import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function Unit1Screen({ navigation, route }) {
    const { unitData } = route.params;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [triviaCompleted, setTriviaCompleted] = useState(false);
    const [dragDropActive, setDragDropActive] = useState(false);
    const [matchedPairs, setMatchedPairs] = useState({});
    const [selectedConcept, setSelectedConcept] = useState(null);

    // Preguntas de trivia del documento

    const triviaQuestions = [
        {
            question: "¿Cuál de las siguientes NO es una propiedad física del agua?",
            options: ["Viscosidad", "Densidad", "Tensión superficial", "Conductividad eléctrica"],
            correct: 3,
            explanation: "Aunque el agua puede conducir electricidad, esta no es una propiedad física fundamental que se estudie en hidráulica básica."
        },
        {
            question: "¿Qué unidad se usa para medir presión en el Sistema Internacional?",
            options: ["Newton", "Pascal", "Joule", "Watt"],
            correct: 1,
            explanation: "El Pascal (Pa) es igual a N/m² y es la unidad de presión en el SI."
        },
        {
            question: "¿Cuál es la densidad aproximada del agua a 4°C?",
            options: ["500 kg/m³", "1000 kg/m³", "1200 kg/m³", "980 kg/m³"],
            correct: 1,
            explanation: "A 4°C, el agua tiene su máxima densidad: 1000 kg/m³."
        },
        {
            question: "¿Qué propiedad del fluido se relaciona con la resistencia interna al flujo?",
            options: ["Densidad", "Viscosidad", "Peso específico", "Tensión superficial"],
            correct: 1,
            explanation: "La viscosidad mide la resistencia al deslizamiento entre capas del fluido."
        },
        {
            question: "¿Cuál de los siguientes instrumentos se usa para medir presión?",
            options: ["Manómetro", "Pluviómetro", "Dinamómetro", "Barómetro de mercurio"],
            correct: 0,
            explanation: "El manómetro es un instrumento diseñado para medir presión de fluidos confinados."
        },
        {
            question: "¿Qué representa el número adimensional de Reynolds?",
            options: ["Relación entre presión y temperatura", "Relación entre fuerzas inerciales y viscosas", "Relación entre densidad y gravedad", "Relación entre área y caudal"],
            correct: 1,
            explanation: "Reynolds se usa para clasificar el tipo de flujo (laminar o turbulento)."
        },
        {
            question: "¿Qué sistema de unidades se basa en el metro, kilogramo y segundo?",
            options: ["Sistema Técnico", "Sistema Inglés", "Sistema Cegesimal", "Sistema Internacional (SI)"],
            correct: 3,
            explanation: "El SI se basa en m, kg, s, y es el sistema estándar usado en hidráulica."
        },
        {
            question: "¿Qué propiedad del agua permite que los insectos caminen sobre ella?",
            options: ["Densidad", "Capilaridad", "Tensión superficial", "Presión hidrostática"],
            correct: 2,
            explanation: "La tensión superficial forma una 'película' que resiste fuerzas externas leves."
        },
        {
            question: "¿Qué unidad representa el peso específico?",
            options: ["N/m²", "kg/m³", "N/m³", "Pa·s"],
            correct: 2,
            explanation: "El peso específico es el peso por unidad de volumen (N/m³)."
        },
        {
            question: "¿Qué propiedad física del agua se ve afectada principalmente por la temperatura?",
            options: ["Viscosidad", "Masa", "Altura", "Área transversal"],
            correct: 0,
            explanation: "La viscosidad del agua disminuye a medida que la temperatura aumenta."
        }
    ];

    // Datos para el ejercicio de arrastrar y unir
    const dragDropData = {
        concepts: [
            { id: 1, name: "Densidad" },
            { id: 2, name: "Viscosidad" },
            { id: 3, name: "Tensión superficial" },
            { id: 4, name: "Presión hidrostática" },
            { id: 5, name: "Peso específico" },
            { id: 6, name: "Sistema Internacional" },
            { id: 7, name: "Manómetro" },
            { id: 8, name: "Fluido" },
            { id: 9, name: "Capilaridad" },
            { id: 10, name: "Masa específica" }
        ],
        definitions: [
            { id: 1, text: "Cantidad de masa por unidad de volumen (kg/m³)" },
            { id: 2, text: "Resistencia interna del fluido al flujo, depende de la temperatura" },
            { id: 3, text: "Fuerza que mantiene unidas las moléculas en la superficie del líquido" },
            { id: 4, text: "Fuerza que ejerce un fluido en reposo por unidad de área" },
            { id: 5, text: "Peso por unidad de volumen de un fluido (N/m³)" },
            { id: 6, text: "Sistema de unidades basado en metro, kilogramo y segundo" },
            { id: 7, text: "Instrumento para medir presión en fluidos confinados" },
            { id: 8, text: "Sustancia que puede fluir y cambiar de forma al aplicar una fuerza" },
            { id: 9, text: "Propiedad que permite a un líquido subir por tubos delgados por acción de fuerzas" },
            { id: 10, text: "Sinónimo de densidad (aunque depende del contexto)" }
        ]
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleAnswerSelect = (answerIndex) => {
        if (selectedAnswer !== null) return; // Ya se seleccionó una respuesta

        setSelectedAnswer(answerIndex);
        setShowExplanation(true);

        if (answerIndex === triviaQuestions[currentQuestion].correct) {
            setScore(score + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestion + 1 < triviaQuestions.length) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setTriviaCompleted(true);
        }
    };

    const resetTrivia = () => {
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setTriviaCompleted(false);
    };

    const handleConceptPress = (concept) => {
        if (matchedPairs[concept.id]) return; // Ya está emparejado
        setSelectedConcept(concept);
    };

    const handleDefinitionPress = (definition) => {
        if (selectedConcept && selectedConcept.id === definition.id) {
            setMatchedPairs({
                ...matchedPairs,
                [definition.id]: true
            });
            setSelectedConcept(null);
        } else if (selectedConcept) {
            Alert.alert("Incorrecto", "Esta definición no corresponde al concepto seleccionado.");
            setSelectedConcept(null);
        }
    };

    const getDragDropScore = () => {
        return Object.keys(matchedPairs).length;
    };

    const resetDragDrop = () => {
        setMatchedPairs({});
        setSelectedConcept(null);
    };

    if (dragDropActive) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" />

                <View style={[styles.header, { backgroundColor: unitData.color }]}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity style={styles.backButton} onPress={() => setDragDropActive(false)}>
                            <Text style={styles.backButtonText}>← Volver a Trivia</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerContent}>
                        <Text style={styles.unitTitle}>Arrastra y Une</Text>
                        <Text style={styles.scoreText}>Emparejados: {getDragDropScore()}/10</Text>
                    </View>
                </View>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.instructionText}>
                            Selecciona un concepto y luego toca su definición correspondiente
                        </Text>

                        <View style={styles.dragDropContainer}>
                            <View style={styles.conceptsColumn}>
                                <Text style={styles.columnTitle}>Conceptos</Text>
                                {dragDropData.concepts.map((concept) => (
                                    <TouchableOpacity
                                        key={concept.id}
                                        style={[
                                            styles.conceptCard,
                                            matchedPairs[concept.id] && styles.matchedCard,
                                            selectedConcept?.id === concept.id && styles.selectedCard
                                        ]}
                                        onPress={() => handleConceptPress(concept)}
                                        disabled={matchedPairs[concept.id]}
                                    >
                                        <Text style={[
                                            styles.conceptText,
                                            matchedPairs[concept.id] && styles.matchedText
                                        ]}>
                                            {concept.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.definitionsColumn}>
                                <Text style={styles.columnTitle}>Definiciones</Text>
                                {dragDropData.definitions.map((definition) => (
                                    <TouchableOpacity
                                        key={definition.id}
                                        style={[
                                            styles.definitionCard,
                                            matchedPairs[definition.id] && styles.matchedCard
                                        ]}
                                        onPress={() => handleDefinitionPress(definition)}
                                        disabled={matchedPairs[definition.id]}
                                    >
                                        <Text style={[
                                            styles.definitionText,
                                            matchedPairs[definition.id] && styles.matchedText
                                        ]}>
                                            {definition.text}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {getDragDropScore() === 10 && (
                            <View style={styles.completionCard}>
                                <Text style={styles.completionTitle}>¡Excelente trabajo! 🎉</Text>
                                <Text style={styles.completionText}>
                                    Has completado correctamente todos los emparejamientos
                                </Text>
                                <TouchableOpacity style={styles.resetButton} onPress={resetDragDrop}>
                                    <Text style={styles.resetButtonText}>Reintentar</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            <View style={[styles.header, { backgroundColor: unitData.color }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                        <Text style={styles.backButtonText}>← Volver</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.headerContent}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.headerIcon}>{unitData.icon}</Text>
                    </View>
                    <Text style={styles.unitNumber}>{unitData.unit}</Text>
                    <Text style={styles.unitTitle}>Trivia de Hidrostática</Text>
                    {!showResult && (
                        <Text style={styles.scoreText}>
                            Pregunta {currentQuestion + 1} de {triviaQuestions.length} | Puntuación: {score}
                        </Text>
                    )}
                </View>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.contentContainer}>
                    {!triviaCompleted ? (
                        <View style={styles.questionContainer}>
                            <View style={styles.questionCard}>
                                <Text style={styles.questionNumber}>
                                    Pregunta {currentQuestion + 1}
                                </Text>
                                <Text style={styles.questionText}>
                                    {triviaQuestions[currentQuestion].question}
                                </Text>
                            </View>

                            <View style={styles.optionsContainer}>
                                {triviaQuestions[currentQuestion].options.map((option, index) => {
                                    const isCorrect = index === triviaQuestions[currentQuestion].correct;
                                    const isSelected = selectedAnswer === index;

                                    let optionStyle = styles.optionCard;
                                    if (showExplanation && isSelected && isCorrect) {
                                        optionStyle = [styles.optionCard, styles.correctOption];
                                    } else if (showExplanation && isSelected && !isCorrect) {
                                        optionStyle = [styles.optionCard, styles.incorrectOption];
                                    } else if (showExplanation && isCorrect) {
                                        optionStyle = [styles.optionCard, styles.correctOption];
                                    } else if (isSelected) {
                                        optionStyle = [styles.optionCard, styles.selectedOption];
                                    }

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={optionStyle}
                                            onPress={() => handleAnswerSelect(index)}
                                            disabled={selectedAnswer !== null}
                                        >
                                            <View style={[
                                                styles.optionNumber,
                                                showExplanation && isCorrect && styles.correctOptionNumber,
                                                showExplanation && isSelected && !isCorrect && styles.incorrectOptionNumber
                                            ]}>
                                                <Text style={[
                                                    styles.optionNumberText,
                                                    showExplanation && isCorrect && styles.correctOptionNumberText,
                                                    showExplanation && isSelected && !isCorrect && styles.incorrectOptionNumberText
                                                ]}>
                                                    {String.fromCharCode(65 + index)}
                                                </Text>
                                            </View>
                                            <Text style={[
                                                styles.optionText,
                                                showExplanation && isCorrect && styles.correctOptionText,
                                                showExplanation && isSelected && !isCorrect && styles.incorrectOptionText
                                            ]}>
                                                {option}
                                            </Text>
                                            {showExplanation && isCorrect && (
                                                <Text style={styles.checkmark}>✓</Text>
                                            )}
                                            {showExplanation && isSelected && !isCorrect && (
                                                <Text style={styles.crossmark}>✗</Text>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {showExplanation && (
                                <View style={[
                                    styles.explanationCard,
                                    selectedAnswer === triviaQuestions[currentQuestion].correct
                                        ? styles.correctExplanation
                                        : styles.incorrectExplanation
                                ]}>
                                    <View style={styles.explanationHeader}>
                                        <Text style={[
                                            styles.explanationTitle,
                                            selectedAnswer === triviaQuestions[currentQuestion].correct
                                                ? styles.correctTitle
                                                : styles.incorrectTitle
                                        ]}>
                                            {selectedAnswer === triviaQuestions[currentQuestion].correct
                                                ? "¡Correcto! ✅"
                                                : "Incorrecto ❌"
                                            }
                                        </Text>
                                    </View>
                                    <Text style={styles.explanationText}>
                                        {triviaQuestions[currentQuestion].explanation}
                                    </Text>
                                </View>
                            )}

                            <TouchableOpacity
                                style={[
                                    styles.nextButton,
                                    !showExplanation && styles.disabledButton
                                ]}
                                onPress={handleNextQuestion}
                                disabled={!showExplanation}
                            >
                                <Text style={styles.nextButtonText}>
                                    {currentQuestion + 1 === triviaQuestions.length ? 'Finalizar' : 'Siguiente'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.resultContainer}>
                            <View style={styles.resultCard}>
                                <Text style={styles.resultTitle}>¡Trivia Completada! 🎉</Text>
                                <Text style={styles.finalScore}>
                                    Puntuación Final: {score}/{triviaQuestions.length}
                                </Text>
                                <Text style={styles.percentage}>
                                    {Math.round((score / triviaQuestions.length) * 100)}% de aciertos
                                </Text>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.retryButton} onPress={resetTrivia}>
                                        <Text style={styles.retryButtonText}>Reintentar Trivia</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.dragDropButton}
                                        onPress={() => setDragDropActive(true)}
                                    >
                                        <Text style={styles.dragDropButtonText}>Arrastra y Une</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}

                    {!triviaCompleted && (
                        <View style={styles.extraSection}>
                            <TouchableOpacity
                                style={styles.dragDropPreview}
                                onPress={() => setDragDropActive(true)}
                            >
                                <Text style={styles.dragDropPreviewTitle}>🎯 Ejercicio Adicional</Text>
                                <Text style={styles.dragDropPreviewText}>
                                    Practica con el ejercicio de "Arrastra y Une" para reforzar los conceptos
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        paddingBottom: 30,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    headerTop: {
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: '#01579B',
        fontSize: 16,
        fontWeight: '600',
    },
    headerContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 4,
    },
    headerIcon: {
        fontSize: 40,
    },
    unitNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#01579B',
        marginBottom: 8,
    },
    unitTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#01579B',
        textAlign: 'center',
        marginBottom: 8,
    },
    scoreText: {
        fontSize: 16,
        color: '#01579B',
        opacity: 0.8,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    questionContainer: {
        marginBottom: 20,
    },
    questionCard: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 16,
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    questionNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0277BD',
        marginBottom: 12,
    },
    questionText: {
        fontSize: 18,
        lineHeight: 26,
        color: '#37474F',
        fontWeight: '500',
    },
    optionsContainer: {
        marginBottom: 24,
    },
    optionCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedOption: {
        borderColor: '#2196F3',
        backgroundColor: '#E3F2FD',
    },
    correctOption: {
        borderColor: '#4CAF50',
        backgroundColor: '#E8F5E8',
    },
    incorrectOption: {
        borderColor: '#F44336',
        backgroundColor: '#FFEBEE',
    },
    optionNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    correctOptionNumber: {
        backgroundColor: '#4CAF50',
    },
    incorrectOptionNumber: {
        backgroundColor: '#F44336',
    },
    optionNumberText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0277BD',
    },
    correctOptionNumberText: {
        color: '#FFFFFF',
    },
    incorrectOptionNumberText: {
        color: '#FFFFFF',
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        color: '#37474F',
    },
    correctOptionText: {
        color: '#2E7D32',
        fontWeight: '600',
    },
    incorrectOptionText: {
        color: '#C62828',
    },
    checkmark: {
        fontSize: 20,
        color: '#4CAF50',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    crossmark: {
        fontSize: 20,
        color: '#F44336',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    nextButton: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginTop: 16,
    },
    disabledButton: {
        backgroundColor: '#BDBDBD',
        elevation: 0,
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    explanationCard: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    correctExplanation: {
        backgroundColor: '#E8F5E8',
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    incorrectExplanation: {
        backgroundColor: '#FFEBEE',
        borderLeftWidth: 4,
        borderLeftColor: '#F44336',
    },
    explanationHeader: {
        marginBottom: 12,
    },
    explanationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    correctTitle: {
        color: '#2E7D32',
    },
    incorrectTitle: {
        color: '#C62828',
    },
    explanationText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#37474F',
        textAlign: 'center',
    },
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultCard: {
        backgroundColor: '#FFFFFF',
        padding: 32,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        width: '100%',
    },
    resultTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 16,
        textAlign: 'center',
    },
    finalScore: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#01579B',
        marginBottom: 8,
    },
    percentage: {
        fontSize: 18,
        color: '#37474F',
        marginBottom: 32,
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    retryButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    retryButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    dragDropButton: {
        backgroundColor: '#FF9800',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    dragDropButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    extraSection: {
        marginTop: 24,
    },
    dragDropPreview: {
        backgroundColor: '#FFF3E0',
        padding: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FF9800',
        borderStyle: 'dashed',
    },
    dragDropPreviewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E65100',
        marginBottom: 8,
    },
    dragDropPreviewText: {
        fontSize: 16,
        color: '#5D4037',
        lineHeight: 22,
    },
    instructionText: {
        fontSize: 16,
        color: '#37474F',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 16,
        lineHeight: 22,
    },
    dragDropContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    conceptsColumn: {
        flex: 1,
    },
    definitionsColumn: {
        flex: 1,
    },
    columnTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#01579B',
        textAlign: 'center',
        marginBottom: 16,
    },
    conceptCard: {
        backgroundColor: '#E3F2FD',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    definitionCard: {
        backgroundColor: '#FFF3E0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    matchedCard: {
        backgroundColor: '#E8F5E8',
        borderColor: '#4CAF50',
    },
    selectedCard: {
        borderColor: '#2196F3',
        backgroundColor: '#BBDEFB',
    },
    conceptText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0277BD',
        textAlign: 'center',
    },
    definitionText: {
        fontSize: 12,
        color: '#E65100',
        lineHeight: 16,
    },
    matchedText: {
        color: '#388E3C',
    },
    completionCard: {
        backgroundColor: '#E8F5E8',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 20,
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    completionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#388E3C',
        marginBottom: 12,
    },
    completionText: {
        fontSize: 16,
        color: '#2E7D32',
        textAlign: 'center',
        marginBottom: 20,
    },
    resetButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
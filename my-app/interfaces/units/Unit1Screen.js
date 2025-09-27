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
import { useLanguage } from '../../contexts/LanguageContext';

export default function Unit1Screen({ navigation, route }) {
    const { unitData } = route.params;
    const { t } = useLanguage();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [triviaCompleted, setTriviaCompleted] = useState(false);
    const [dragDropActive, setDragDropActive] = useState(false);
    const [matchedPairs, setMatchedPairs] = useState({});
    const [selectedConcept, setSelectedConcept] = useState(null);
    const [shuffledConcepts, setShuffledConcepts] = useState([]);
    const [shuffledDefinitions, setShuffledDefinitions] = useState([]);

    // Get trivia questions from translations
    const triviaQuestions = t('trivia.questions').map((q, index) => ({
        question: q.question,
        options: q.options,
        correct: getCorrectAnswerIndex(index), // We need to maintain the correct answer indices
        explanation: q.explanation
    }));

    // Helper function to get correct answer indices (same as original)
    function getCorrectAnswerIndex(questionIndex) {
        const correctIndices = [3, 1, 1, 1, 0, 1, 3, 2, 2, 0];
        return correctIndices[questionIndex];
    }

    // Get drag-drop data from translations
    const dragDropData = t('trivia.dragDropData');

    // Function to shuffle an array
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Function to initialize shuffled data
    const initializeShuffledData = () => {
        setShuffledConcepts(shuffleArray(dragDropData.concepts));
        setShuffledDefinitions(shuffleArray(dragDropData.definitions));
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
        initializeShuffledData(); // Mezclamos de nuevo cuando se reinicia
    };

    if (dragDropActive) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" />

                <View style={[styles.header, { backgroundColor: unitData.color }]}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity style={styles.backButton} onPress={() => setDragDropActive(false)}>
                            <Text style={styles.backButtonText}>← {t('trivia.backToTrivia')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerContent}>
                        <Text style={styles.unitTitle}>{t('trivia.dragAndDrop')}</Text>
                        <Text style={styles.scoreText}>Emparejados: {getDragDropScore()}/10</Text>
                    </View>
                </View>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.instructionText}>
                            {t('trivia.selectConcept')}
                        </Text>

                        <View style={styles.dragDropContainer}>
                            <View style={styles.conceptsColumn}>
                                <Text style={styles.columnTitle}>{t('trivia.concepts')}</Text>
                                {shuffledConcepts.map((concept) => (
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
                                <Text style={styles.columnTitle}>{t('trivia.definitions')}</Text>
                                {shuffledDefinitions.map((definition) => (
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
                                <Text style={styles.completionTitle}>{t('trivia.excellentWork')} 🎉</Text>
                                <Text style={styles.completionText}>
                                    {t('trivia.completedMatches')}
                                </Text>
                                <TouchableOpacity style={styles.resetButton} onPress={resetDragDrop}>
                                    <Text style={styles.resetButtonText}>{t('trivia.retry')}</Text>
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
                        <Text style={styles.backButtonText}>← {t('common.back')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.headerContent}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.headerIcon}>{unitData.icon}</Text>
                    </View>
                    <Text style={styles.unitNumber}>{unitData.unit}</Text>
                    <Text style={styles.unitTitle}>{t('units.unit1.title')}</Text>
                    {!showResult && (
                        <Text style={styles.scoreText}>
                            {t('trivia.question')} {currentQuestion + 1} {t('trivia.of')} {triviaQuestions.length} | Puntuación: {score}
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
                                    {t('trivia.question')} {currentQuestion + 1}
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
                                                ? `${t('trivia.correct')} ✅`
                                                : `${t('trivia.incorrect')} ❌`
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
                                    {currentQuestion + 1 === triviaQuestions.length ? t('common.finish') : t('trivia.nextQuestion')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.resultContainer}>
                            <View style={styles.resultCard}>
                                <Text style={styles.resultTitle}>
                                    {score >= triviaQuestions.length * 0.8 ? t('trivia.excellent') : score >= triviaQuestions.length * 0.6 ? t('trivia.good') : t('trivia.needsImprovement')} 🎉
                                </Text>
                                <Text style={styles.finalScore}>
                                    {t('trivia.finalScore')}: {score}/{triviaQuestions.length}
                                </Text>
                                <Text style={styles.percentage}>
                                    {Math.round((score / triviaQuestions.length) * 100)}% de aciertos
                                </Text>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.retryButton} onPress={resetTrivia}>
                                        <Text style={styles.retryButtonText}>{t('trivia.tryAgain')}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.dragDropButton}
                                        onPress={() => {
                                            initializeShuffledData();
                                            setDragDropActive(true);
                                        }}
                                    >
                                        <Text style={styles.dragDropButtonText}>{t('trivia.dragAndDrop')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}

                    {!triviaCompleted && (
                        <View style={styles.extraSection}>
                            <TouchableOpacity
                                style={styles.dragDropPreview}
                                onPress={() => {
                                    initializeShuffledData();
                                    setDragDropActive(true);
                                }}
                            >
                                <Text style={styles.dragDropPreviewTitle}>{t('trivia.additionalExercise')}</Text>
                                <Text style={styles.dragDropPreviewText}>
                                    {t('trivia.practiceDescription')}
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
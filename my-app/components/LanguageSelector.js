// components/LanguageSelector.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Dimensions
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

const { width: screenWidth } = Dimensions.get('window');

const LanguageSelector = ({ style }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { currentLanguage, changeLanguage, availableLanguages, t } = useLanguage();

    const currentLangData = availableLanguages.find(lang => lang.code === currentLanguage);

    const handleLanguageChange = (languageCode) => {
        changeLanguage(languageCode);
        setModalVisible(false);
    };

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                style={styles.languageButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.flagText}>{currentLangData?.flag}</Text>
                <Text style={styles.languageText}>{currentLangData?.name}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('common.selectLanguage')}</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.languageOptions}>
                            {availableLanguages.map((language) => (
                                <TouchableOpacity
                                    key={language.code}
                                    style={[
                                        styles.languageOption,
                                        currentLanguage === language.code && styles.selectedLanguageOption
                                    ]}
                                    onPress={() => handleLanguageChange(language.code)}
                                >
                                    <Text style={styles.optionFlag}>{language.flag}</Text>
                                    <Text style={[
                                        styles.optionText,
                                        currentLanguage === language.code && styles.selectedOptionText
                                    ]}>
                                        {language.name}
                                    </Text>
                                    {currentLanguage === language.code && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    flagText: {
        fontSize: 16,
        marginRight: 6,
    },
    languageText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
        marginRight: 6,
    },
    dropdownArrow: {
        color: '#FFFFFF',
        fontSize: 10,
        opacity: 0.8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 0,
        width: screenWidth * 0.8,
        maxWidth: 300,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#01579B',
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: 'bold',
    },
    languageOptions: {
        padding: 10,
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginVertical: 2,
    },
    selectedLanguageOption: {
        backgroundColor: '#E3F2FD',
    },
    optionFlag: {
        fontSize: 20,
        marginRight: 12,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    selectedOptionText: {
        color: '#01579B',
        fontWeight: '600',
    },
    checkmark: {
        color: '#01579B',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LanguageSelector;
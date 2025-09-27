// contexts/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState('es'); // Default to Spanish
    const [isLoading, setIsLoading] = useState(true);

    // Load saved language on app start
    useEffect(() => {
        loadSavedLanguage();
    }, []);

    const loadSavedLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
            if (savedLanguage && ['es', 'en', 'de'].includes(savedLanguage)) {
                setCurrentLanguage(savedLanguage);
            }
        } catch (error) {
            console.error('Error loading saved language:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const changeLanguage = async (languageCode) => {
        try {
            setCurrentLanguage(languageCode);
            await AsyncStorage.setItem('selectedLanguage', languageCode);
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    const t = (key) => {
        const keys = key.split('.');
        let translation = translations[currentLanguage];
        
        for (const k of keys) {
            if (translation && typeof translation === 'object') {
                translation = translation[k];
            } else {
                return key; // Return key if translation not found
            }
        }
        
        return translation || key;
    };

    const value = {
        currentLanguage,
        changeLanguage,
        t,
        isLoading,
        availableLanguages: [
            { code: 'es', name: 'Español', flag: '🇲🇽' },
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
        ]
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageContext;
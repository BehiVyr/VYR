import React from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageSelectionScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  const selectLanguage = async (language) => {
    try {
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem('hasLaunched', 'true');
      
      // Set RTL for Persian
      const isRTL = language === 'fa';
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
      
      navigation.replace('ProjectList');
    } catch (error) {
      console.error('Error selecting language:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>{t('selectLanguage')}</Text>
          
          <Button
            mode="contained"
            onPress={() => selectLanguage('en')}
            style={[styles.button, styles.englishButton]}
            labelStyle={styles.buttonLabel}
          >
            {t('english')}
          </Button>
          
          <Button
            mode="contained"
            onPress={() => selectLanguage('fa')}
            style={[styles.button, styles.persianButton]}
            labelStyle={[styles.buttonLabel, styles.persianLabel]}
          >
            {t('persian')}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1E90FF',
  },
  button: {
    marginVertical: 10,
    paddingVertical: 8,
  },
  englishButton: {
    backgroundColor: '#1E90FF',
  },
  persianButton: {
    backgroundColor: '#1E90FF',
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  persianLabel: {
    fontFamily: 'Vazir',
  },
});

export default LanguageSelectionScreen;
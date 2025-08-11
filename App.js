import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import i18n from './src/i18n/i18n';
import { theme } from './src/styles/theme';
import { AuthProvider } from './src/context/AuthContext';
import { ProjectProvider } from './src/context/ProjectContext';

// Screens
import SplashScreenComponent from './src/screens/SplashScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import ProjectListScreen from './src/screens/ProjectListScreen';
import UIBuilderScreen from './src/screens/UIBuilderScreen';
import ProjectSettingsScreen from './src/screens/ProjectSettingsScreen';
import GitHubLoginScreen from './src/screens/GitHubLoginScreen';
import BuildOutputScreen from './src/screens/BuildOutputScreen';

const Stack = createStackNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await Font.loadAsync({
          'Vazir': require('./assets/fonts/Vazir.ttf'),
          'Roboto': require('./assets/fonts/Roboto-Regular.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
      <I18nextProvider i18n={i18n}>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <ProjectProvider>
              <NavigationContainer>
                <Stack.Navigator
                  initialRouteName="Splash"
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: theme.colors.primary,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                  }}
                >
                  <Stack.Screen 
                    name="Splash" 
                    component={SplashScreenComponent}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen 
                    name="LanguageSelection" 
                    component={LanguageSelectionScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen 
                    name="ProjectList" 
                    component={ProjectListScreen}
                    options={{ title: 'Projects' }}
                  />
                  <Stack.Screen 
                    name="UIBuilder" 
                    component={UIBuilderScreen}
                    options={{ title: 'UI Builder' }}
                  />
                  <Stack.Screen 
                    name="ProjectSettings" 
                    component={ProjectSettingsScreen}
                    options={{ title: 'Project Settings' }}
                  />
                  <Stack.Screen 
                    name="GitHubLogin" 
                    component={GitHubLoginScreen}
                    options={{ title: 'GitHub Login' }}
                  />
                  <Stack.Screen 
                    name="BuildOutput" 
                    component={BuildOutputScreen}
                    options={{ title: 'Build Output' }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </ProjectProvider>
          </AuthProvider>
        </PaperProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
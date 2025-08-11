import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  const discovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'your-github-client-id', // Replace with your GitHub OAuth app client ID
      scopes: ['user', 'repo'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'uibuilder',
      }),
    },
    discovery
  );

  useEffect(() => {
    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCodeForToken(code);
    }
  }, [response]);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('github_token');
      const storedUser = await AsyncStorage.getItem('github_user');
      
      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const exchangeCodeForToken = async (code) => {
    try {
      // In a real app, this should be done through your backend server
      // for security reasons. This is a simplified example.
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: 'your-github-client-id',
          client_secret: 'your-github-client-secret', // This should be handled by your backend
          code: code,
        }),
      });

      const data = await response.json();
      
      if (data.access_token) {
        await storeToken(data.access_token);
        await fetchUserData(data.access_token);
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    }
  };

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('github_token', token);
      setAccessToken(token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
        },
      });

      const userData = await response.json();
      
      await AsyncStorage.setItem('github_user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const login = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('github_token');
      await AsyncStorage.removeItem('github_user');
      setAccessToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    user,
    accessToken,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
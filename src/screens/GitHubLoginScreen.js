import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const GitHubLoginScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { login, logout, user, isAuthenticated, loading } = useAuth();

  const handleLogin = async () => {
    await login();
  };

  const handleLogout = async () => {
    await logout();
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.githubLogo}
            />
            <Text style={styles.title}>{t('github')}</Text>
          </View>

          {isAuthenticated ? (
            <View style={styles.userInfo}>
              <Image
                source={{ uri: user?.avatar_url }}
                style={styles.avatar}
              />
              <Text style={styles.username}>{user?.name || user?.login}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              
              <Button
                mode="contained"
                onPress={handleLogout}
                style={styles.logoutButton}
              >
                {t('logout')}
              </Button>
            </View>
          ) : (
            <View style={styles.loginSection}>
              <Text style={styles.description}>
                Connect your GitHub account to save projects and enable automatic builds
              </Text>
              
              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                icon="github"
              >
                {t('connect')}
              </Button>
            </View>
          )}
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  githubLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  userInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  loginSection: {
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
});

export default GitHubLoginScreen;
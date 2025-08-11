import React, { useState } from 'react';
import { View, StyleSheet, FlatList, I18nManager } from 'react-native';
import { 
  FAB, 
  Card, 
  Text, 
  Button, 
  Dialog, 
  Portal, 
  TextInput,
  IconButton,
  Menu,
  Divider
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

const ProjectListScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { projects, createProject, deleteProject } = useProjects();
  const { isAuthenticated } = useAuth();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [menuVisible, setMenuVisible] = useState({});

  const isRTL = i18n.language === 'fa';

  const handleCreateProject = async () => {
    if (projectName.trim()) {
      await createProject({
        name: projectName.trim(),
        description: projectDescription.trim(),
      });
      setProjectName('');
      setProjectDescription('');
      setDialogVisible(false);
    }
  };

  const toggleMenu = (projectId) => {
    setMenuVisible(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const handleDeleteProject = async (projectId) => {
    await deleteProject(projectId);
    setMenuVisible(prev => ({
      ...prev,
      [projectId]: false
    }));
  };

  const renderProject = ({ item }) => (
    <Card style={styles.projectCard}>
      <Card.Content>
        <View style={[styles.projectHeader, isRTL && styles.rtlRow]}>
          <View style={styles.projectInfo}>
            <Text style={styles.projectName}>{item.name}</Text>
            {item.description ? (
              <Text style={styles.projectDescription}>{item.description}</Text>
            ) : null}
            <Text style={styles.projectDate}>
              {new Date(item.updatedAt).toLocaleDateString()}
            </Text>
          </View>
          <Menu
            visible={menuVisible[item.id] || false}
            onDismiss={() => toggleMenu(item.id)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => toggleMenu(item.id)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                toggleMenu(item.id);
                navigation.navigate('ProjectSettings', { project: item });
              }}
              title={t('settings')}
            />
            <Divider />
            <Menu.Item
              onPress={() => handleDeleteProject(item.id)}
              title={t('delete')}
            />
          </Menu>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('UIBuilder', { project: item })}
          style={styles.editButton}
        >
          {t('edit')}
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, isRTL && styles.rtlRow]}>
        <Text style={styles.headerTitle}>{t('projects')}</Text>
        {!isAuthenticated && (
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('GitHubLogin')}
            style={styles.loginButton}
          >
            {t('connect')}
          </Button>
        )}
      </View>

      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        style={[styles.fab, isRTL && styles.rtlFab]}
        icon="plus"
        onPress={() => setDialogVisible(true)}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>{t('createProject')}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={t('projectName')}
              value={projectName}
              onChangeText={setProjectName}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label={t('description')}
              value={projectDescription}
              onChangeText={setProjectDescription}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>{t('cancel')}</Button>
            <Button onPress={handleCreateProject}>{t('create')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  loginButton: {
    borderColor: '#1E90FF',
  },
  listContainer: {
    padding: 16,
  },
  projectCard: {
    marginBottom: 12,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  projectDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  editButton: {
    backgroundColor: '#1E90FF',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1E90FF',
  },
  rtlFab: {
    right: undefined,
    left: 0,
  },
  input: {
    marginBottom: 12,
  },
});

export default ProjectListScreen;
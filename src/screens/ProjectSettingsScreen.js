import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, I18nManager } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  Switch, 
  List,
  Divider
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

const ProjectSettingsScreen = ({ route, navigation }) => {
  const { t, i18n } = useTranslation();
  const { updateProject } = useProjects();
  const { isAuthenticated } = useAuth();
  const project = route.params?.project;

  const [projectName, setProjectName] = useState(project?.name || '');
  const [projectDescription, setProjectDescription] = useState(project?.description || '');
  const [autoSave, setAutoSave] = useState(true);
  const [enablePreview, setEnablePreview] = useState(true);

  const isRTL = i18n.language === 'fa';

  const handleSave = async () => {
    if (project) {
      await updateProject(project.id, {
        name: projectName,
        description: projectDescription,
      });
      navigation.goBack();
    }
  };

  const handleBuildSettings = () => {
    navigation.navigate('BuildOutput', { project });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={t('projectName')} />
        <Card.Content>
          <TextInput
            value={projectName}
            onChangeText={setProjectName}
            mode="outlined"
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title={t('description')} />
        <Card.Content>
          <TextInput
            value={projectDescription}
            onChangeText={setProjectDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Editor Settings" />
        <Card.Content>
          <List.Item
            title="Auto Save"
            description="Automatically save changes"
            right={() => (
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Enable Preview"
            description="Show preview mode in editor"
            right={() => (
              <Switch
                value={enablePreview}
                onValueChange={setEnablePreview}
              />
            )}
          />
        </Card.Content>
      </Card>

      {isAuthenticated && (
        <Card style={styles.card}>
          <Card.Title title={t('github')} />
          <Card.Content>
            <List.Item
              title={t('repository')}
              description={project?.repositoryUrl || 'Not connected'}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title={t('buildStatus')}
              description={project?.buildStatus || 'No builds'}
              onPress={handleBuildSettings}
            />
          </Card.Content>
        </Card>
      )}

      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          {t('cancel')}
        </Button>
        <Button
          mode="contained"
          onPress={handleSave}
          style={[styles.button, styles.saveButton]}
        >
          {t('save')}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  saveButton: {
    backgroundColor: '#1E90FF',
  },
});

export default ProjectSettingsScreen;
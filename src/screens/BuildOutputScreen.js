import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, I18nManager } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  ProgressBar, 
  Chip,
  List,
  Divider
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';

const BuildOutputScreen = ({ route }) => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, accessToken } = useAuth();
  const { updateProject } = useProjects();
  const project = route.params?.project;

  const [buildStatus, setBuildStatus] = useState(project?.buildStatus || 'idle');
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildLogs, setBuildLogs] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const isRTL = i18n.language === 'fa';

  useEffect(() => {
    if (buildStatus === 'building') {
      simulateBuild();
    }
  }, [buildStatus]);

  const simulateBuild = () => {
    const steps = [
      'Initializing build environment...',
      'Installing dependencies...',
      'Building React Native project...',
      'Generating APK file...',
      'Upload to GitHub releases...',
      'Build completed successfully!'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setBuildLogs(prev => [...prev, {
          id: Date.now() + currentStep,
          message: steps[currentStep],
          timestamp: new Date().toLocaleTimeString(),
          type: currentStep === steps.length - 1 ? 'success' : 'info'
        }]);
        setBuildProgress((currentStep + 1) / steps.length);
        currentStep++;
      } else {
        clearInterval(interval);
        setBuildStatus('success');
        setDownloadUrl('https://github.com/user/repo/releases/download/v1.0.0/app-release.apk');
      }
    }, 2000);
  };

  const handleStartBuild = async () => {
    if (!isAuthenticated) {
      return;
    }

    setBuildStatus('building');
    setBuildProgress(0);
    setBuildLogs([]);
    setDownloadUrl(null);

    // Update project build status
    await updateProject(project.id, { buildStatus: 'building' });
  };

  const handleDownload = () => {
    // In a real app, this would trigger the download
    console.log('Downloading APK from:', downloadUrl);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'failed': return '#F44336';
      case 'building': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success': return t('success');
      case 'failed': return t('failed');
      case 'building': return t('inProgress');
      default: return t('pending');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title 
          title={project?.name}
          subtitle={`${t('buildStatus')}: ${getStatusText(buildStatus)}`}
        />
        <Card.Content>
          <View style={[styles.statusRow, isRTL && styles.rtlRow]}>
            <Chip 
              mode="outlined"
              style={[styles.statusChip, { borderColor: getStatusColor(buildStatus) }]}
            >
              {getStatusText(buildStatus)}
            </Chip>
            {buildStatus === 'building' && (
              <Text style={styles.progressText}>
                {Math.round(buildProgress * 100)}%
              </Text>
            )}
          </View>

          {buildStatus === 'building' && (
            <ProgressBar 
              progress={buildProgress} 
              color="#1E90FF"
              style={styles.progressBar}
            />
          )}
        </Card.Content>
      </Card>

      {!isAuthenticated ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.warningText}>
              {t('connect')} GitHub to enable automatic builds
            </Text>
          </Card.Content>
        </Card>
      ) : (
        <Card style={styles.card}>
          <Card.Title title="Build Actions" />
          <Card.Content>
            <Button
              mode="contained"
              onPress={handleStartBuild}
              disabled={buildStatus === 'building'}
              style={styles.buildButton}
            >
              {buildStatus === 'building' ? t('inProgress') : t('build')}
            </Button>

            {downloadUrl && (
              <Button
                mode="outlined"
                onPress={handleDownload}
                style={styles.downloadButton}
                icon="download"
              >
                {t('download')} APK
              </Button>
            )}
          </Card.Content>
        </Card>
      )}

      {buildLogs.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="Build Logs" />
          <Card.Content>
            {buildLogs.map((log) => (
              <List.Item
                key={log.id}
                title={log.message}
                description={log.timestamp}
                left={() => (
                  <View style={[
                    styles.logIndicator,
                    { backgroundColor: log.type === 'success' ? '#4CAF50' : '#2196F3' }
                  ]} />
                )}
              />
            ))}
          </Card.Content>
        </Card>
      )}
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  statusChip: {
    borderWidth: 2,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  warningText: {
    textAlign: 'center',
    color: '#FF9800',
    fontSize: 16,
  },
  buildButton: {
    backgroundColor: '#1E90FF',
    marginBottom: 12,
  },
  downloadButton: {
    borderColor: '#4CAF50',
  },
  logIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
  },
});

export default BuildOutputScreen;
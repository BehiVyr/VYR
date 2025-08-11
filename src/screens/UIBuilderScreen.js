import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, I18nManager } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  FAB, 
  Portal, 
  Dialog,
  Chip
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../context/ProjectContext';
import ComponentPalette from '../components/ComponentPalette';
import CanvasArea from '../components/CanvasArea';

const { width } = Dimensions.get('window');

const UIBuilderScreen = ({ route, navigation }) => {
  const { t, i18n } = useTranslation();
  const { selectProject, currentProject, updateProject } = useProjects();
  const [showPalette, setShowPalette] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const isRTL = i18n.language === 'fa';
  const project = route.params?.project;

  useEffect(() => {
    if (project) {
      selectProject(project);
    }
  }, [project]);

  const handleSave = async () => {
    if (currentProject) {
      await updateProject(currentProject.id, {
        components: currentProject.components,
      });
    }
  };

  const handleExport = () => {
    navigation.navigate('BuildOutput', { project: currentProject });
  };

  if (!currentProject) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.toolbar, isRTL && styles.rtlRow]}>
        <View style={[styles.toolbarLeft, isRTL && styles.rtlRow]}>
          <Chip
            mode={previewMode ? 'flat' : 'outlined'}
            onPress={() => setPreviewMode(!previewMode)}
            style={styles.modeChip}
          >
            {previewMode ? t('edit') : t('preview')}
          </Chip>
        </View>
        
        <View style={[styles.toolbarRight, isRTL && styles.rtlRow]}>
          <Button
            mode="outlined"
            onPress={handleSave}
            style={styles.toolbarButton}
            compact
          >
            {t('save')}
          </Button>
          <Button
            mode="contained"
            onPress={handleExport}
            style={styles.toolbarButton}
            compact
          >
            {t('export')}
          </Button>
        </View>
      </View>

      <View style={styles.content}>
        <CanvasArea 
          project={currentProject}
          previewMode={previewMode}
          isRTL={isRTL}
        />
      </View>

      {!previewMode && (
        <FAB
          style={[styles.fab, isRTL && styles.rtlFab]}
          icon="plus"
          onPress={() => setShowPalette(true)}
          label={t('components')}
        />
      )}

      <Portal>
        <Dialog 
          visible={showPalette} 
          onDismiss={() => setShowPalette(false)}
          style={styles.paletteDialog}
        >
          <Dialog.Title>{t('components')}</Dialog.Title>
          <Dialog.Content>
            <ComponentPalette 
              onComponentSelect={() => setShowPalette(false)}
              isRTL={isRTL}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowPalette(false)}>
              {t('cancel')}
            </Button>
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
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeChip: {
    marginRight: 8,
  },
  toolbarButton: {
    marginLeft: 8,
  },
  content: {
    flex: 1,
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
  paletteDialog: {
    maxHeight: '80%',
  },
});

export default UIBuilderScreen;
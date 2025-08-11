import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../context/ProjectContext';
import RenderableComponent from './RenderableComponent';

const { width, height } = Dimensions.get('window');

const CanvasArea = ({ project, previewMode, isRTL }) => {
  const { t } = useTranslation();
  const { updateProject } = useProjects();

  const handleDragEnd = async ({ data }) => {
    if (project) {
      await updateProject(project.id, { components: data });
    }
  };

  const renderComponent = ({ item, drag, isActive }) => (
    <RenderableComponent
      component={item}
      onDrag={drag}
      isActive={isActive}
      previewMode={previewMode}
      isRTL={isRTL}
    />
  );

  if (!project?.components || project.components.length === 0) {
    return (
      <View style={styles.emptyCanvas}>
        <Text style={styles.emptyText}>
          {previewMode ? t('preview') : 'Drag components here to start building'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.canvas}
        contentContainerStyle={styles.canvasContent}
        showsVerticalScrollIndicator={false}
      >
        <DraggableFlatList
          data={project.components}
          renderItem={renderComponent}
          keyExtractor={(item) => item.id}
          onDragEnd={handleDragEnd}
          scrollEnabled={!previewMode}
          style={styles.list}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  canvas: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  canvasContent: {
    minHeight: height - 200,
    padding: 16,
  },
  list: {
    flex: 1,
  },
  emptyCanvas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default CanvasArea;
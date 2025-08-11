import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Button, TextInput, List } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useProjects } from '../context/ProjectContext';

const RenderableComponent = ({ component, onDrag, isActive, previewMode, isRTL }) => {
  const { removeComponent, updateComponent } = useProjects();

  const handleDelete = async () => {
    await removeComponent(component.id);
  };

  const renderComponentContent = () => {
    switch (component.type) {
      case 'button':
        return (
          <Button
            mode="contained"
            style={[
              styles.button,
              { backgroundColor: component.props.backgroundColor || '#1E90FF' }
            ]}
            labelStyle={{ color: component.props.textColor || '#FFFFFF' }}
            onPress={() => console.log('Button pressed')}
          >
            {component.props.title || 'Button'}
          </Button>
        );

      case 'text':
        return (
          <Text
            style={[
              styles.text,
              {
                fontSize: component.props.fontSize || 16,
                color: component.props.color || '#000000',
                textAlign: isRTL ? 'right' : 'left',
              }
            ]}
          >
            {component.props.content || 'Sample Text'}
          </Text>
        );

      case 'image':
        return (
          <Image
            source={{ uri: component.props.source }}
            style={[
              styles.image,
              {
                width: component.props.width || 200,
                height: component.props.height || 150,
              }
            ]}
            resizeMode="cover"
          />
        );

      case 'input':
        return (
          <TextInput
            placeholder={component.props.placeholder || 'Enter text...'}
            mode="outlined"
            style={[
              styles.input,
              { backgroundColor: component.props.backgroundColor || '#FFFFFF' }
            ]}
            outlineColor={component.props.borderColor || '#CCCCCC'}
          />
        );

      case 'list':
        return (
          <View style={styles.listContainer}>
            {(component.props.items || ['Item 1', 'Item 2', 'Item 3']).map((item, index) => (
              <List.Item
                key={index}
                title={item}
                style={[
                  styles.listItem,
                  { backgroundColor: component.props.backgroundColor || '#FFFFFF' }
                ]}
              />
            ))}
          </View>
        );

      default:
        return <Text>Unknown Component</Text>;
    }
  };

  return (
    <TouchableOpacity
      onLongPress={previewMode ? undefined : onDrag}
      style={[
        styles.container,
        isActive && styles.activeContainer,
        isRTL && styles.rtlContainer
      ]}
    >
      <View style={styles.componentWrapper}>
        {renderComponentContent()}
        
        {!previewMode && (
          <TouchableOpacity
            style={[styles.deleteButton, isRTL && styles.rtlDeleteButton]}
            onPress={handleDelete}
          >
            <MaterialIcons name="close" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 4,
  },
  activeContainer: {
    opacity: 0.8,
    transform: [{ scale: 1.05 }],
  },
  rtlContainer: {
    alignItems: 'flex-end',
  },
  componentWrapper: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  button: {
    marginVertical: 4,
  },
  text: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  image: {
    borderRadius: 8,
    marginVertical: 4,
  },
  input: {
    marginVertical: 4,
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginVertical: 4,
    elevation: 1,
  },
  listItem: {
    paddingVertical: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  rtlDeleteButton: {
    right: undefined,
    left: -8,
  },
});

export default RenderableComponent;
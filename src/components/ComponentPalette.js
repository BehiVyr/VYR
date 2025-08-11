import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, TouchableRipple } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../context/ProjectContext';

const ComponentPalette = ({ onComponentSelect, isRTL }) => {
  const { t } = useTranslation();
  const { addComponent } = useProjects();

  const components = [
    {
      type: 'button',
      icon: 'smart-button',
      label: t('button'),
      defaultProps: {
        title: 'Button',
        backgroundColor: '#1E90FF',
        textColor: '#FFFFFF',
      },
    },
    {
      type: 'text',
      icon: 'text-fields',
      label: t('text'),
      defaultProps: {
        content: 'Sample Text',
        fontSize: 16,
        color: '#000000',
      },
    },
    {
      type: 'image',
      icon: 'image',
      label: t('image'),
      defaultProps: {
        source: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
        width: 200,
        height: 150,
      },
    },
    {
      type: 'input',
      icon: 'input',
      label: t('input'),
      defaultProps: {
        placeholder: 'Enter text...',
        borderColor: '#CCCCCC',
        backgroundColor: '#FFFFFF',
      },
    },
    {
      type: 'list',
      icon: 'list',
      label: t('list'),
      defaultProps: {
        items: ['Item 1', 'Item 2', 'Item 3'],
        backgroundColor: '#FFFFFF',
      },
    },
  ];

  const handleComponentSelect = async (component) => {
    await addComponent({
      type: component.type,
      props: component.defaultProps,
      position: { x: 50, y: 50 },
    });
    onComponentSelect();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {components.map((component) => (
          <TouchableRipple
            key={component.type}
            onPress={() => handleComponentSelect(component)}
            style={styles.componentCard}
          >
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <MaterialIcons
                  name={component.icon}
                  size={32}
                  color="#1E90FF"
                  style={styles.icon}
                />
                <Text style={[styles.label, isRTL && styles.rtlText]}>
                  {component.label}
                </Text>
              </Card.Content>
            </Card>
          </TouchableRipple>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  componentCard: {
    width: '48%',
    marginBottom: 12,
  },
  card: {
    elevation: 2,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  icon: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  rtlText: {
    fontFamily: 'Vazir',
  },
});

export default ComponentPalette;
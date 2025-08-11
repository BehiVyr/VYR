import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const storedProjects = await AsyncStorage.getItem('projects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProjects = async (updatedProjects) => {
    try {
      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

  const createProject = async (projectData) => {
    const newProject = {
      id: Date.now().toString(),
      name: projectData.name,
      description: projectData.description,
      components: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      buildStatus: null,
      repositoryUrl: null,
    };

    const updatedProjects = [...projects, newProject];
    await saveProjects(updatedProjects);
    return newProject;
  };

  const updateProject = async (projectId, updates) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId
        ? { ...project, ...updates, updatedAt: new Date().toISOString() }
        : project
    );
    await saveProjects(updatedProjects);
    
    if (currentProject && currentProject.id === projectId) {
      setCurrentProject({ ...currentProject, ...updates });
    }
  };

  const deleteProject = async (projectId) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    await saveProjects(updatedProjects);
    
    if (currentProject && currentProject.id === projectId) {
      setCurrentProject(null);
    }
  };

  const selectProject = (project) => {
    setCurrentProject(project);
  };

  const addComponent = async (component) => {
    if (!currentProject) return;

    const newComponent = {
      id: Date.now().toString(),
      type: component.type,
      props: component.props || {},
      position: component.position || { x: 0, y: 0 },
    };

    const updatedComponents = [...currentProject.components, newComponent];
    await updateProject(currentProject.id, { components: updatedComponents });
  };

  const updateComponent = async (componentId, updates) => {
    if (!currentProject) return;

    const updatedComponents = currentProject.components.map(component =>
      component.id === componentId
        ? { ...component, ...updates }
        : component
    );

    await updateProject(currentProject.id, { components: updatedComponents });
  };

  const removeComponent = async (componentId) => {
    if (!currentProject) return;

    const updatedComponents = currentProject.components.filter(
      component => component.id !== componentId
    );

    await updateProject(currentProject.id, { components: updatedComponents });
  };

  const value = {
    projects,
    currentProject,
    loading,
    createProject,
    updateProject,
    deleteProject,
    selectProject,
    addComponent,
    updateComponent,
    removeComponent,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
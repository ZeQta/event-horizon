import React from 'react';
import { Plus, Folder, Trash2, Clock } from 'lucide-react';
import { Project } from '../types';

interface ProjectSidebarProps {
  projects: Project[];
  currentProject: Project | null;
  onProjectSelect: (project: Project) => void;
  onNewProject: () => void;
  onDeleteProject: (projectId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  currentProject,
  onProjectSelect,
  onNewProject,
  onDeleteProject,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-700 z-50 lg:relative lg:z-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={onNewProject}
              className="w-full flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Projects</h3>
            
            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No projects yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`group p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentProject?.id === project.id
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => onProjectSelect(project)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{project.name}</h4>
                        <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                          <Clock className="w-3 h-3" />
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="mt-2 text-xs opacity-60">
                      {project.messages.length} messages
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
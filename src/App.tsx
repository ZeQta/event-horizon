import React, { useState, useEffect } from 'react';
import { Menu, Sparkles, Code, Eye, FolderOpen } from 'lucide-react';
import { ChatPanel } from './components/ChatPanel';
import { CodeEditor } from './components/CodeEditor';
import { PreviewPanel } from './components/PreviewPanel';
import { ProjectSidebar } from './components/ProjectSidebar';
import { ConversationSidebar } from './components/ConversationSidebar';
import { LandingPage } from './components/LandingPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Project, Message } from './types';

function App() {
  const [projects, setProjects] = useLocalStorage<Project[]>('event-horizon-projects', []);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversationSidebarCollapsed, setConversationSidebarCollapsed] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load first project or show landing
  useEffect(() => {
    if (projects.length > 0 && !currentProject && !showLanding) {
      setCurrentProject(projects[0]);
    }
  }, [projects, currentProject, showLanding]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createNewProject = () => {
    const newProject: Project = {
      id: generateId(),
      name: `Project ${projects.length + 1}`,
      htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 600px;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Event Horizon</h1>
        <p>Your AI-powered website is ready! Describe what you want to build and I'll generate the complete HTML code for you.</p>
    </div>
</body>
</html>`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    setCurrentProject(newProject);
    setSidebarOpen(false);
    setShowLanding(false);
  };

  const handleGetStarted = () => {
    setShowLanding(false);
    if (projects.length === 0) {
      createNewProject();
    } else {
      setCurrentProject(projects[0]);
    }
  };

  const updateProject = (updates: Partial<Project>) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      ...updates,
      updatedAt: Date.now(),
    };

    setCurrentProject(updatedProject);
    setProjects(projects.map(p => p.id === currentProject.id ? updatedProject : p));
  };

  const handleMessagesChange = (messages: Message[]) => {
    updateProject({ messages });
  };

  const handleCodeChange = (code: string) => {
    updateProject({ htmlCode: code });
  };

  const handleCodeGenerated = (code: string) => {
    updateProject({ htmlCode: code });
    if (isMobile) {
      setActiveTab('preview');
    }
  };

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project);
    setSidebarOpen(false);
    setShowLanding(false);
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    
    if (currentProject?.id === projectId) {
      if (updatedProjects.length > 0) {
        setCurrentProject(updatedProjects[0]);
      } else {
        setShowLanding(true);
        setCurrentProject(null);
      }
    }
  };

  const handlePreviewRefresh = () => {
    // This will trigger a re-render of the preview
    setCurrentProject({ ...currentProject! });
  };

  const handleClearHistory = () => {
    if (currentProject) {
      updateProject({ messages: [] });
    }
  };

  // Show landing page
  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading Event Horizon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-gradient-to-r from-purple-900 to-blue-900 border-b border-gray-700 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 flex-1">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h1 className="text-lg font-bold">Event Horizon</h1>
          <span className="text-sm text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full">
            Lite
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLanding(true)}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Home</span>
          </button>
          
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            <span className="text-sm">Projects</span>
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Project Sidebar */}
        <ProjectSidebar
          projects={projects}
          currentProject={currentProject}
          onProjectSelect={handleProjectSelect}
          onNewProject={createNewProject}
          onDeleteProject={handleDeleteProject}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Chat Panel with Conversation Sidebar */}
          <div className={`${isMobile ? 'flex-1' : 'flex-shrink-0'} flex`}>
            {/* Conversation History Sidebar - Desktop only */}
            {!isMobile && (
              <ConversationSidebar
                messages={currentProject.messages}
                isCollapsed={conversationSidebarCollapsed}
                onToggle={() => setConversationSidebarCollapsed(!conversationSidebarCollapsed)}
                onClearHistory={handleClearHistory}
              />
            )}
            
            {/* Chat Panel */}
            <div className={`${isMobile ? 'w-full' : conversationSidebarCollapsed ? 'w-96' : 'w-80'} transition-all duration-300`}>
              <ChatPanel
                messages={currentProject.messages}
                onMessagesChange={handleMessagesChange}
                onCodeGenerated={handleCodeGenerated}
              />
            </div>
          </div>

          {/* Code/Preview Panel */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile Tab Navigation */}
            {isMobile && (
              <div className="flex bg-gray-800 border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === 'code'
                      ? 'text-purple-400 bg-gray-700'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  Code
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === 'preview'
                      ? 'text-purple-400 bg-gray-700'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>
            )}

            {/* Desktop Split View / Mobile Single View */}
            <div className="flex-1 flex overflow-hidden">
              {/* Code Editor */}
              <div className={`${isMobile ? (activeTab === 'code' ? 'flex-1' : 'hidden') : 'w-1/2'} overflow-hidden`}>
                <CodeEditor
                  code={currentProject.htmlCode}
                  onChange={handleCodeChange}
                  onPreview={handlePreviewRefresh}
                />
              </div>

              {/* Preview Panel */}
              <div className={`${isMobile ? (activeTab === 'preview' ? 'flex-1' : 'hidden') : 'w-1/2'} overflow-hidden`}>
                <PreviewPanel code={currentProject.htmlCode} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
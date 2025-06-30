import React from 'react';
import { Sparkles, Code, Eye, Zap, Globe, Palette, ArrowRight, Play } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Generate complete websites in seconds with AI-powered code generation"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Production Ready",
      description: "Clean, semantic HTML with inline CSS and JavaScript - ready to deploy"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Live Preview",
      description: "See your website come to life in real-time as the AI generates code"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Beautiful Designs",
      description: "Modern, responsive designs with smooth animations and professional styling"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Mobile First",
      description: "Every website is optimized for all devices from mobile to desktop"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Powered",
      description: "Advanced AI understands your vision and creates exactly what you need"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-purple-600 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white">
              Event Horizon
              <span className="text-purple-400 ml-3">Lite</span>
            </h1>
          </div>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The most advanced AI website builder that creates stunning, production-ready websites 
            in seconds. Just describe your vision and watch it come to life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              <Play className="w-5 h-5" />
              Start Building Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="text-sm text-gray-400">
              No sign-up required • Free to use • Instant results
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-600/20 text-purple-400 rounded-lg group-hover:bg-purple-600/30 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">⚡</div>
            <div className="text-2xl font-bold text-white mb-1">Seconds</div>
            <div className="text-gray-400">Average generation time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">🎨</div>
            <div className="text-2xl font-bold text-white mb-1">Beautiful</div>
            <div className="text-gray-400">Professional designs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">📱</div>
            <div className="text-2xl font-bold text-white mb-1">Responsive</div>
            <div className="text-gray-400">Mobile-first approach</div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to build something amazing?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of creators who are building beautiful websites with AI. 
            No coding experience required - just your imagination.
          </p>
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
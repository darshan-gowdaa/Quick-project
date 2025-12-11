import React from 'react';
import { Film, Star, Ticket } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-24">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-orange-500/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="glass-strong p-4 rounded-2xl animate-scale-in">
              <Film className="w-12 h-12 text-yellow-400" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-slide-up">
            MovieMania
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Dive into Cinematic Worlds
          </p>
        <div className="flex justify-center mb-8 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <span className="glass-strong px-4 py-2 rounded-full text-white/80 text-sm">
            Location: Home
          </span>
        </div>
          
          <div className="flex justify-center space-x-6 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card p-4 rounded-xl hover:scale-110 smooth-transition">
              <Film className="w-8 h-8 text-yellow-400 mx-auto" />
            </div>
            <div className="glass-card p-4 rounded-xl hover:scale-110 smooth-transition" style={{ animationDelay: '0.1s' }}>
              <Star className="w-8 h-8 text-yellow-400 mx-auto" />
            </div>
            <div className="glass-card p-4 rounded-xl hover:scale-110 smooth-transition" style={{ animationDelay: '0.2s' }}>
              <Ticket className="w-8 h-8 text-yellow-400 mx-auto" />
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default HeroSection;

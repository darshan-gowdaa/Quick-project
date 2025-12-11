import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Home, PlusCircle, Star, Menu, X } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-strong py-2' : 'glass py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold gradient-text smooth-transition hover:scale-105"
          >
            <Film className="w-6 h-6" />
            <span>MovieMania</span>
          </Link>
          
          <div className="hidden md:flex space-x-2">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl smooth-transition ${
                isActive('/') 
                  ? 'glass-strong text-yellow-400' 
                  : 'glass text-white/80 hover:text-yellow-400 hover:scale-105'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/add-movie"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl smooth-transition ${
                isActive('/add-movie') 
                  ? 'glass-strong text-yellow-400' 
                  : 'glass text-white/80 hover:text-yellow-400 hover:scale-105'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Movie</span>
            </Link>
            
            <Link
              to="/reviews"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl smooth-transition ${
                isActive('/reviews') 
                  ? 'glass-strong text-yellow-400' 
                  : 'glass text-white/80 hover:text-yellow-400 hover:scale-105'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Reviews</span>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden glass p-2 rounded-lg text-white hover:text-yellow-400 smooth-transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-slide-up">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl smooth-transition ${
                isActive('/') 
                  ? 'glass-strong text-yellow-400' 
                  : 'glass text-white/80 hover:text-yellow-400'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/add-movie"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl smooth-transition ${
                isActive('/add-movie') 
                  ? 'glass-strong text-yellow-400' 
                  : 'glass text-white/80 hover:text-yellow-400'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Movie</span>
            </Link>
            
            <Link
              to="/reviews"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl smooth-transition ${
                isActive('/reviews') 
                  ? 'glass-strong text-yellow-400' 
                  : 'glass text-white/80 hover:text-yellow-400'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Reviews</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

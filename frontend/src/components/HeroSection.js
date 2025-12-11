import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Film, Star, Ticket, MapPin } from 'lucide-react';

const HeroSection = ({ searchTerm, setSearchTerm }) => {
  const [location, setLocation] = useState('Locating...');
  const [fullAddress, setFullAddress] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || 'Unknown City';
          const state = data.address.state || '';
          setLocation(`${city}, ${state}`);
          setFullAddress(data.display_name);
        } catch (error) {
          console.error("Error fetching location:", error);
          setLocation("Bengaluru, Karnataka"); // Fallback
        }
      }, (error) => {
        console.error("Geolocation denied/error:", error);
        setLocation("Bengaluru, Karnataka"); // Fallback
      });
    } else {
      setLocation("Bengaluru, Karnataka");
    }
  }, []);

  return (
    <section className="relative min-h-[45vh] flex items-center justify-center overflow-hidden pt-24 pb-10">
      {/* Subtle Moving Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: "linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)",
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Location Badge */}
          <motion.div
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-8 text-sm text-white/80"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MapPin className="w-4 h-4 text-red-500" />
            <span>{location}</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 gradient-text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            MovieMania
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/80 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Dive into Cinematic Worlds
          </motion.p>

          {/* Functional Search Bar */}
          <motion.div
            className="max-w-xl mx-auto relative group mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or genre..."
              className="w-full py-4 pl-12 pr-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-yellow-400/50 transition-all shadow-xl"
            />
          </motion.div>

          <motion.div
            className="flex justify-center flex-wrap gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="glass-card p-4 rounded-full border border-white/10 hover:border-yellow-400/50 hover:bg-white/5 smooth-transition group cursor-pointer">
              <Film className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="glass-card p-4 rounded-full border border-white/10 hover:border-yellow-400/50 hover:bg-white/5 smooth-transition group cursor-pointer">
              <Star className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="glass-card p-4 rounded-full border border-white/10 hover:border-yellow-400/50 hover:bg-white/5 smooth-transition group cursor-pointer">
              <Ticket className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

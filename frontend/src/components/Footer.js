import React from 'react';
import { Mail, Phone, Facebook, Twitter, Instagram, Youtube, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="relative bg-[#0F0F0F] text-white/80 pt-16 pb-8 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30"></div>

            <div className="container mx-auto px-4">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-4">
                        <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="text-3xl">🍿</span> MovieMania
                        </h3>
                        <p className="text-sm leading-relaxed text-white/50">
                            Your ultimate destination for cinematic experiences. Book tickets, read reviews, and discover the magic of movies.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <motion.a whileHover={{ scale: 1.2, color: '#1877F2' }} href="#" className="text-white/40 hover:text-white transition-colors"><Facebook size={20} /></motion.a>
                            <motion.a whileHover={{ scale: 1.2, color: '#1DA1F2' }} href="#" className="text-white/40 hover:text-white transition-colors"><Twitter size={20} /></motion.a>
                            <motion.a whileHover={{ scale: 1.2, color: '#E4405F' }} href="#" className="text-white/40 hover:text-white transition-colors"><Instagram size={20} /></motion.a>
                            <motion.a whileHover={{ scale: 1.2, color: '#FF0000' }} href="#" className="text-white/40 hover:text-white transition-colors"><Youtube size={20} /></motion.a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Movies Now Showing</h4>
                        <ul className="space-y-2 text-sm text-white/50">
                            <li><a href="#" className="hover:text-red-400 transition-colors">Action Movies</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors">Comedy Classics</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors">Romantic Dramas</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors">Sci-Fi Adventures</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors">Horror Hits</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Help & Support</h4>
                        <ul className="space-y-2 text-sm text-white/50">
                            <li><a href="#" className="hover:text-red-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors">Contact Support</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Contact</h4>
                        <div className="space-y-3 text-sm text-white/50">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-red-500 shrink-0 mt-0.5" />
                                <span>Christ University, Bengaluru</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-red-500 shrink-0" />
                                <a href="mailto:amith.gowda@example.com" className="hover:text-white">amith.gowda@example.com</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-red-500 shrink-0" />
                                <a href="tel:+919999999999" className="hover:text-white">+91 999 999 9999</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 mt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-white/30">
                    <p>&copy; 2024 MovieMania. All rights reserved.</p>
                    <div className="mt-4 md:mt-0 flex gap-6">
                        <span className="flex items-center gap-1">
                            Made by <span className="text-white font-semibold">Amith Gowda</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

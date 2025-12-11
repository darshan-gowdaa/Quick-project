import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Star, MapPin, User, Mail, Film, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Reviews = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    movieTitle: '',
    rating: ''
  });
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          setLocationError('Geolocation access denied or unavailable');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.movieTitle.trim()) {
      newErrors.movieTitle = 'Movie title is required';
    }

    if (!formData.rating.trim()) {
      newErrors.rating = 'Rating is required';
    } else {
      const rating = parseFloat(formData.rating);
      if (isNaN(rating) || rating < 1 || rating > 10) {
        newErrors.rating = 'Rating must be a number between 1 and 10';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/reviews`, {
        ...formData,
        rating: parseFloat(formData.rating)
      });
      toast.success('Review submitted successfully!');
      setSubmitted(true);
      setFormData({
        userName: '',
        email: '',
        movieTitle: '',
        rating: ''
      });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      toast.error('Failed to submit review. Please try again.');
      console.error('Error submitting review:', err);
    } finally {
      setLoading(false);
    }
  };

  const bengaluruTheaters = [
    'PVR Cinemas - Forum Mall',
    'INOX - Garuda Mall',
    'Cinepolis - Orion Mall',
    'PVR Cinemas - Phoenix Marketcity',
    'INOX - Mantri Square'
  ];

  return (
    <main className="min-h-screen pt-24 pb-12">
      <section className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="glass-strong p-4 rounded-2xl">
              <Star className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold gradient-text mb-3">
            Movie Reviews & Feedback
          </h1>
          <p className="text-white/60 text-lg">Share your thoughts about the movies you've watched</p>
        </header>

        <article className="glass-strong rounded-3xl p-6 md:p-8 mb-6 animate-scale-in">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-yellow-400" />
            <span>Your Location</span>
          </h2>
          {location ? (
            <div className="text-white/80 space-y-3">
              <div className="glass-card p-4 rounded-xl">
                <p className="mb-2">
                  <strong className="text-white">Latitude:</strong> {location.latitude.toFixed(6)}
                </p>
                <p>
                  <strong className="text-white">Longitude:</strong> {location.longitude.toFixed(6)}
                </p>
              </div>
              <div className="glass-card p-4 rounded-xl mt-4">
                <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-yellow-400" />
                  <span>Suggested Theaters in Bengaluru:</span>
                </h3>
                <ul className="space-y-2">
                  {bengaluruTheaters.map((theater, index) => (
                    <li key={index} className="text-white/70 flex items-start space-x-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>{theater}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-white/60">
              {locationError ? (
                <div className="glass-card p-4 rounded-xl border-yellow-500/50">
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <AlertCircle className="w-5 h-5" />
                    <p>{locationError}</p>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-4 rounded-xl">
                  <Loader2 className="w-5 h-5 animate-spin text-yellow-400 inline mr-2" />
                  <span>Loading location...</span>
                </div>
              )}
              <div className="glass-card p-4 rounded-xl mt-4">
                <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-yellow-400" />
                  <span>Suggested Theaters in Bengaluru:</span>
                </h3>
                <ul className="space-y-2">
                  {bengaluruTheaters.map((theater, index) => (
                    <li key={index} className="text-white/70 flex items-start space-x-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>{theater}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </article>

        <article className="glass-strong rounded-3xl p-8 md:p-10 animate-scale-in">
          {submitted && (
            <div className="glass-card bg-green-500/20 border-green-500/50 text-green-300 p-4 rounded-xl mb-6 flex items-center space-x-2 animate-scale-in">
              <CheckCircle2 className="w-5 h-5" />
              <span>Thank you! Your review has been submitted successfully.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="userName" className="flex items-center space-x-2 text-white/90 font-semibold mb-3">
                <User className="w-5 h-5 text-yellow-400" />
                <span>Your Name *</span>
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className={`input-glass w-full px-4 py-3 text-white rounded-xl ${
                  errors.userName ? 'border-red-500/50' : ''
                }`}
                placeholder="Enter your name"
              />
              {errors.userName && (
                <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.userName}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="flex items-center space-x-2 text-white/90 font-semibold mb-3">
                <Mail className="w-5 h-5 text-yellow-400" />
                <span>Email *</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input-glass w-full px-4 py-3 text-white rounded-xl ${
                  errors.email ? 'border-red-500/50' : ''
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="movieTitle" className="flex items-center space-x-2 text-white/90 font-semibold mb-3">
                <Film className="w-5 h-5 text-yellow-400" />
                <span>Movie Title Reviewed *</span>
              </label>
              <input
                type="text"
                id="movieTitle"
                name="movieTitle"
                value={formData.movieTitle}
                onChange={handleInputChange}
                className={`input-glass w-full px-4 py-3 text-white rounded-xl ${
                  errors.movieTitle ? 'border-red-500/50' : ''
                }`}
                placeholder="Enter the movie title"
              />
              {errors.movieTitle && (
                <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.movieTitle}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="rating" className="flex items-center space-x-2 text-white/90 font-semibold mb-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Rating (1-10) *</span>
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="1"
                max="10"
                step="0.1"
                className={`input-glass w-full px-4 py-3 text-white rounded-xl ${
                  errors.rating ? 'border-red-500/50' : ''
                }`}
                placeholder="Enter rating (1-10)"
              />
              {errors.rating && (
                <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.rating}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full button-primary text-gray-900 px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Star className="w-5 h-5" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </form>
        </article>
      </section>
    </main>
  );
};

export default Reviews;

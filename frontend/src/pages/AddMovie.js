import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PlusCircle, Film, Tag, AlignLeft, Image, Star, Download, Loader2, ArrowLeft, BadgeCheck, Languages, ThumbsUp } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const AddMovie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    description: '',
    poster_url: '',
    rating: '',
    certificate: 'UA',
    language: '',
    votes: '',
    likes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingExternal, setFetchingExternal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleFetchExternalData = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a movie title first');
      return;
    }

    setFetchingExternal(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/movies/search/external`, {
        params: { title: formData.title }
      });
      toast.success('External API integration ready. This feature can be extended with OMDB or TMDB API.');
    } catch (err) {
      toast.error('Failed to fetch external movie data');
      console.error('Error fetching external data:', err);
    } finally {
      setFetchingExternal(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.title || !formData.genre || !formData.description || !formData.poster_url || !formData.rating) {
      setError('All fields are required');
      toast.error('All fields are required');
      setLoading(false);
      return;
    }

    const rating = parseFloat(formData.rating);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      setError('Rating must be a number between 0 and 10');
      toast.error('Rating must be between 0 and 10');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/movies`, {
        ...formData,
        rating,
        votes: formData.votes ? parseInt(formData.votes, 10) : 0,
        likes: formData.likes ? parseInt(formData.likes, 10) : 0
      });
      toast.success('Movie added successfully!');
      setFormData({
        title: '',
        genre: '',
        description: '',
        poster_url: '',
        rating: '',
        certificate: 'UA',
        language: '',
        votes: '',
        likes: ''
      });
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to add movie. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Error adding movie:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12">
      <section className="container mx-auto px-4 max-w-3xl">
        <header className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="glass-strong p-4 rounded-2xl">
              <PlusCircle className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold gradient-text mb-3">
            Add New Movie
          </h1>
          <p className="text-white/60 text-lg">Share your favorite movies with the community</p>
        </header>

        <article className="glass-strong rounded-3xl p-8 md:p-10 animate-scale-in">
          {error && (
            <div className="glass-card bg-red-500/20 border-red-500/50 text-red-300 p-4 rounded-xl mb-6 animate-scale-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="title" className="flex items-center space-x-2 text-white/90 font-semibold">
                  <Film className="w-5 h-5 text-yellow-400" />
                  <span>Title *</span>
                </label>
                <button
                  type="button"
                  onClick={handleFetchExternalData}
                  disabled={fetchingExternal || !formData.title.trim()}
                  className="button-secondary text-sm px-3 py-1.5 rounded-lg flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {fetchingExternal ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Fetch Data</span>
                    </>
                  )}
                </button>
              </div>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="input-glass w-full px-4 py-3 text-white rounded-xl"
                placeholder="Enter movie title"
              />
            </div>

            <div>
              <label htmlFor="genre" className="flex items-center space-x-2 text-white/90 font-semibold mb-3">
                <Tag className="w-5 h-5 text-yellow-400" />
                <span>Genre *</span>
              </label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                required
                className="input-glass w-full px-4 py-3 text-white rounded-xl"
                placeholder="e.g., Action, Drama, Comedy"
              />
            </div>

            <div>
              <label htmlFor="description" className="flex items-center space-x-2 text-white/90 font-semibold mb-3">
                <AlignLeft className="w-5 h-5 text-yellow-400" />
                <span>Description *</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="5"
                className="input-glass w-full px-4 py-3 text-white rounded-xl resize-none"
                placeholder="Enter movie description"
              />
            </div>

            <div>
              <label htmlFor="poster_url" className="flex items-center space-x-2 text-white/90 font-semibold mb-3">
                <Image className="w-5 h-5 text-yellow-400" />
                <span>Poster URL *</span>
              </label>
              <input
                type="url"
                id="poster_url"
                name="poster_url"
                value={formData.poster_url}
                onChange={handleInputChange}
                required
                className="input-glass w-full px-4 py-3 text-white rounded-xl"
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            <div>
              <label htmlFor="rating" className="flex items-center space-x-2 text-white/90 font-semibold mb-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Rating (0-10) *</span>
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="0"
                max="10"
                step="0.1"
                required
                className="input-glass w-full px-4 py-3 text-white rounded-xl"
                placeholder="e.g., 8.5"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="certificate" className="flex items-center space-x-2 text-white/90 font-semibold mb-3">
                  <BadgeCheck className="w-5 h-5 text-yellow-400" />
                  <span>Certificate</span>
                </label>
                <input
                  type="text"
                  id="certificate"
                  name="certificate"
                  value={formData.certificate}
                  onChange={handleInputChange}
                  className="input-glass w-full px-4 py-3 text-white rounded-xl"
                  placeholder="UA16+, U, A"
                />
              </div>

              <div>
                <label htmlFor="language" className="flex items-center space-x-2 text-white/90 font-semibold mb-3">
                  <Languages className="w-5 h-5 text-yellow-400" />
                  <span>Languages</span>
                </label>
                <input
                  type="text"
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="input-glass w-full px-4 py-3 text-white rounded-xl"
                  placeholder="Hindi, English"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="votes" className="flex items-center space-x-2 text-white/90 font-semibold mb-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>Votes</span>
                </label>
                <input
                  type="number"
                  id="votes"
                  name="votes"
                  value={formData.votes}
                  onChange={handleInputChange}
                  min="0"
                  className="input-glass w-full px-4 py-3 text-white rounded-xl"
                  placeholder="e.g., 88000"
                />
              </div>

              <div>
                <label htmlFor="likes" className="flex items-center space-x-2 text-white/90 font-semibold mb-3">
                  <ThumbsUp className="w-5 h-5 text-yellow-400" />
                  <span>Likes</span>
                </label>
                <input
                  type="number"
                  id="likes"
                  name="likes"
                  value={formData.likes}
                  onChange={handleInputChange}
                  min="0"
                  className="input-glass w-full px-4 py-3 text-white rounded-xl"
                  placeholder="e.g., 8200"
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 button-primary text-gray-900 px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    <span>Add Movie</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="button-secondary px-6 py-3 rounded-xl text-white flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
};

export default AddMovie;

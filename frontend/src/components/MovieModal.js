import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Edit, Trash2, Star, Tag, Film, Loader2, ThumbsUp, Languages, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const MovieModal = ({ movie, onClose, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: movie?.title || '',
    genre: movie?.genre || '',
    description: movie?.description || '',
    poster_url: movie?.poster_url || '',
    rating: movie?.rating || 0,
    certificate: movie?.certificate || 'UA',
    language: movie?.language || '',
    votes: movie?.votes || 0,
    likes: movie?.likes || 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title,
        genre: movie.genre,
        description: movie.description,
        poster_url: movie.poster_url,
        rating: movie.rating,
        certificate: movie.certificate || 'UA',
        language: movie.language || '',
        votes: movie.votes || 0,
        likes: movie.likes || 0
      });
    }
  }, [movie]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'rating'
          ? parseFloat(value) || 0
          : name === 'votes' || name === 'likes'
          ? parseInt(value, 10) || 0
          : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(`${API_URL}/movies/${movie.id}`, formData);
      toast.success('Movie updated successfully');
      onUpdate();
    } catch (err) {
      setError('Failed to update movie. Please try again.');
      toast.error('Failed to update movie');
      console.error('Error updating movie:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    onDelete(movie.id);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="glass-strong rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 glass-strong border-b border-white/10 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold gradient-text flex items-center space-x-2">
            <Film className="w-8 h-8" />
            <span>{isEditing ? 'Edit Movie' : 'Movie Details'}</span>
          </h2>
          <div className="flex space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="button-secondary px-4 py-2 rounded-xl text-blue-400 hover:text-blue-300 flex items-center space-x-2 smooth-transition"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="button-secondary px-4 py-2 rounded-xl text-red-400 hover:text-red-300 flex items-center space-x-2 smooth-transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="button-secondary p-2 rounded-xl text-white/80 hover:text-white smooth-transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              {error && (
                <div className="glass-card bg-red-500/20 border-red-500/50 text-red-300 p-4 rounded-xl">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-white/90 mb-2 font-semibold">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="input-glass w-full px-4 py-3 text-white rounded-xl"
                />
              </div>

              <div>
                <label className="block text-white/90 mb-2 font-semibold">Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                  className="input-glass w-full px-4 py-3 text-white rounded-xl"
                />
              </div>

              <div>
                <label className="block text-white/90 mb-2 font-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="input-glass w-full px-4 py-3 text-white rounded-xl resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 mb-2 font-semibold">Poster URL</label>
                  <input
                    type="url"
                    name="poster_url"
                    value={formData.poster_url}
                    onChange={handleInputChange}
                    required
                    className="input-glass w-full px-4 py-3 text-white rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-white/90 mb-2 font-semibold">Rating (0-10)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    step="0.1"
                    required
                    className="input-glass w-full px-4 py-3 text-white rounded-xl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 mb-2 font-semibold">Certificate</label>
                  <input
                    type="text"
                    name="certificate"
                    value={formData.certificate}
                    onChange={handleInputChange}
                    className="input-glass w-full px-4 py-3 text-white rounded-xl"
                    placeholder="UA16+, U, A, etc."
                  />
                </div>
                <div>
                  <label className="block text-white/90 mb-2 font-semibold">Languages</label>
                  <input
                    type="text"
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
                  <label className="block text-white/90 mb-2 font-semibold">Votes</label>
                  <input
                    type="number"
                    name="votes"
                    value={formData.votes}
                    onChange={handleInputChange}
                    min="0"
                    className="input-glass w-full px-4 py-3 text-white rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-white/90 mb-2 font-semibold">Likes</label>
                  <input
                    type="number"
                    name="likes"
                    value={formData.likes}
                    onChange={handleInputChange}
                    min="0"
                    className="input-glass w-full px-4 py-3 text-white rounded-xl"
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
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Edit className="w-5 h-5" />
                      <span>Update Movie</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      title: movie.title,
                      genre: movie.genre,
                      description: movie.description,
                      poster_url: movie.poster_url,
                      rating: movie.rating
                    });
                    setError(null);
                  }}
                  className="flex-1 button-secondary px-6 py-3 rounded-xl text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
              <div className="glass-card rounded-2xl overflow-hidden">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x600?text=No+Poster';
                  }}
                />
              </div>
              <div className="text-white space-y-6">
                <div>
                  <h3 className="text-4xl font-bold mb-3 gradient-text">{movie.title}</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <Tag className="w-5 h-5 text-yellow-400" />
                    <p className="text-yellow-400 text-lg font-medium">{movie.genre}</p>
                  </div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="glass-card inline-flex items-center space-x-2 px-4 py-2 rounded-xl">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-bold text-xl">
                        {movie.rating > 0 ? `${movie.rating.toFixed(1)}/10` : 'Not Rated'}
                      </span>
                      {movie.votes !== undefined && (
                        <span className="text-white/70 text-sm">· {movie.votes.toLocaleString()} Votes</span>
                      )}
                    </div>
                    <div className="glass-card inline-flex items-center space-x-2 px-4 py-2 rounded-xl">
                      <ThumbsUp className="w-5 h-5 text-green-400" />
                      <span className="text-white font-semibold">
                        {movie.likes !== undefined ? movie.likes.toLocaleString() : 0} Likes
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-white/70">
                    <BadgeCheck className="w-5 h-5 text-cyan-300" />
                    <span>{movie.certificate || 'UA'}</span>
                    <span className="text-white/40">|</span>
                    <Languages className="w-5 h-5 text-cyan-300" />
                    <span>{movie.language || '—'}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-white/90">Description</h4>
                  <p className="text-white/70 leading-relaxed text-lg">{movie.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieModal;

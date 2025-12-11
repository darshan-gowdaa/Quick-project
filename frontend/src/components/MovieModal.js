import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Edit, Trash2, Star, Tag, Film, Loader2, ThumbsUp, Languages, BadgeCheck, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

const MovieModal = ({ movie, onClose, onDelete, onUpdate }) => {
  const rating = movie?.rating ? Number(movie.rating) : 0;
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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#09090b] border border-white/10 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#09090b]/95 backdrop-blur z-10 border-b border-white/10 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white tracking-tight flex items-center space-x-2">
            {!isEditing && <Film className="w-6 h-6 mr-2 text-white/50" />}
            <span>{isEditing ? 'Edit Movie' : movie.title}</span>
          </h2>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-2 rounded-md hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-colors flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 rounded-md hover:bg-red-500/10 text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-0 overflow-y-auto flex-1">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 resize-none"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Certificate</label>
                  <input
                    type="text"
                    name="certificate"
                    value={formData.certificate}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Language</label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Poster URL</label>
                <input
                  type="url"
                  name="poster_url"
                  value={formData.poster_url}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-md border border-white/10 text-white/70 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-md bg-white text-black hover:bg-white/90 text-sm font-medium transition-colors flex items-center"
                >
                  {loading && <Loader2 className="w-3 h-3 animate-spin mr-2" />}
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid md:grid-cols-[300px_1fr] gap-8 p-6 md:p-8">
              <div className="space-y-4">
                <div className="aspect-[2/3] rounded-lg overflow-hidden border border-white/10 shadow-lg relative bg-[#18181b]">
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x600?text=No+Poster';
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/10">
                    <div className="flex items-center text-sm font-medium text-white/80">
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
                      {rating > 0 ? rating.toFixed(1) : 'NR'} / 10
                    </div>
                    <span className="text-xs text-white/40">{movie.votes || 0} votes</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/10">
                    <div className="flex items-center text-sm font-medium text-white/80">
                      <ThumbsUp className="w-4 h-4 text-green-500 mr-2" />
                      {movie.likes || 0} Likes
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2.5 py-0.5 rounded-full border border-white/20 text-xs font-medium text-white/70 uppercase">
                      {movie.certificate || 'UA'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full border border-white/20 text-xs font-medium text-white/70 uppercase">
                      {movie.language || 'English'}
                    </span>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">{movie.title}</h3>
                  <div className="flex items-center text-white/50 text-base">
                    <span className="mr-3">{movie.genre}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-white/40 uppercase tracking-wider">Synopsis</h4>
                  <p className="text-white/80 leading-relaxed text-lg font-light">
                    {movie.description}
                  </p>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <button className="w-full md:w-auto px-8 py-3 bg-white text-black font-semibold rounded-md hover:bg-white/90 transition-all flex items-center justify-center">
                    <Ticket className="w-5 h-5 mr-2" />
                    Book Tickets
                  </button>
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

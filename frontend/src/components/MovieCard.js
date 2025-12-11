import React from 'react';
import { Star, Eye, Edit, Trash2, Tag, ThumbsUp } from 'lucide-react';

const formatCount = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
  return `${num}`;
};

const MovieCard = ({ movie, onViewDetails, onEdit, onDelete }) => {
  const hasRating = movie.rating && movie.rating > 0;
  return (
    <article className="glass-card movie-card rounded-2xl overflow-hidden group animate-fade-in">
      <div className="relative overflow-hidden">
        <img
          src={movie.poster_url}
          alt={movie.title}
          loading="lazy"
          className="w-full h-80 object-cover smooth-transition group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 smooth-transition"></div>
        
        <div className="absolute top-3 right-3 glass-strong px-3 py-1.5 rounded-xl flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white font-bold text-sm">{movie.rating.toFixed(1)}</span>
        </div>
        <div className="absolute top-3 left-3 glass px-3 py-1 rounded-xl text-white/80 text-xs font-semibold">
          {movie.certificate || 'UA'}
        </div>
      </div>
      
      <div className="p-5">
        <h2 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-yellow-400 smooth-transition">
          {movie.title}
        </h2>
        
        <div className="flex items-center space-x-1 mb-3">
          <Tag className="w-4 h-4 text-yellow-400" />
          <p className="text-yellow-400/90 text-sm font-medium">{movie.genre}</p>
        </div>
        
        <p className="text-white/60 text-sm mb-3 line-clamp-3 leading-relaxed">
          {movie.description}
        </p>

        <div className="flex items-center space-x-3 mb-5">
          <div className="glass px-3 py-1.5 rounded-xl text-white/80 text-xs flex items-center space-x-1">
            {hasRating ? (
              <>
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span>{movie.rating.toFixed(1)}/10</span>
                <span className="text-white/50">·</span>
                <span>{movie.votes ? `${formatCount(movie.votes)} Votes` : 'Votes'}</span>
              </>
            ) : (
              <span>Not Rated</span>
            )}
          </div>
          <div className="glass px-3 py-1.5 rounded-xl text-white/80 text-xs flex items-center space-x-1">
            <ThumbsUp className="w-3 h-3 text-green-400" />
            <span>{movie.likes ? `${formatCount(movie.likes)} Likes` : 'Likes'}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(movie)}
            className="flex-1 button-primary text-gray-900 px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </button>
          
          <button
            onClick={() => onEdit(movie)}
            className="button-secondary p-2.5 rounded-xl text-blue-400 hover:text-blue-300 smooth-transition"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(movie.id)}
            className="button-secondary p-2.5 rounded-xl text-red-400 hover:text-red-300 smooth-transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;

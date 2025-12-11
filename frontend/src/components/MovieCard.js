import React from 'react';
import { Star, Eye, Edit, Trash2, Tag, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

const formatCount = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
  return `${num}`;
};

const MovieCard = ({ movie, onViewDetails, onEdit, onDelete }) => {
  const rating = movie.rating ? Number(movie.rating) : 0;
  const hasRating = rating > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="glass-card rounded-lg overflow-hidden group h-full flex flex-col w-full max-w-[240px] mx-auto bg-[#1A1A1A] border-none shadow-lg"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster_url}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/240x360?text=No+Poster';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center z-10">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onViewDetails(movie); }}
              className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-black transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onEdit(movie); }}
              className="bg-white/20 backdrop-blur-md p-2 rounded-full text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
              title="Edit"
            >
              <Edit size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onDelete(movie.id); }}
              className="bg-white/20 backdrop-blur-md p-2 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>

        {hasRating && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1">
            <Star className="w-3 h-3 text-red-500 fill-red-500" />
            <span className="text-white text-xs font-bold">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <h2 className="text-white text-base font-medium mb-1 line-clamp-1 group-hover:text-red-500 transition-colors" title={movie.title}>
          {movie.title}
        </h2>

        <div className="flex items-center gap-2 mb-2 text-xs text-white/50">
          <span>{movie.certificate || 'UA'}</span>
          <span>•</span>
          <span className="truncate max-w-[100px]">{movie.genre}</span>
        </div>

        <div className="mt-auto pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-1">
            <ThumbsUp size={12} className="text-green-500" />
            <span>{movie.likes ? formatCount(movie.likes) : '0'}</span>
          </div>
          <div>
            {movie.votes ? `${formatCount(movie.votes)} Votes` : 'New'}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default MovieCard;

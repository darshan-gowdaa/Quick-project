import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import toast from 'react-hot-toast';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import HeroSection from '../components/HeroSection';
import { Search, Film, Loader2 } from 'lucide-react';

const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

const FALLBACK_MOVIES = [
  {
    id: 1,
    title: 'Sholay: The Final Cut',
    genre: 'Action',
    description: 'Classic action drama.',
    poster_url: 'https://picsum.photos/seed/sholay/400/600',
    rating: 8.5,
    certificate: 'U',
    language: 'Hindi',
    votes: 1200,
    likes: 8200,
  },
  {
    id: 2,
    title: 'Zootopia 2',
    genre: 'Family',
    description: 'Animated adventure sequel.',
    poster_url: 'https://picsum.photos/seed/zootopia2/400/600',
    rating: 9.1,
    certificate: 'UA7+',
    language: 'English, Hindi, Tamil, Telugu',
    votes: 500,
    likes: 11300,
  },
  {
    id: 3,
    title: 'Midnight Metro',
    genre: 'Thriller',
    description: 'A race against time on the last train.',
    poster_url: 'https://picsum.photos/seed/midnightmetro/400/600',
    rating: 7.9,
    certificate: 'UA13+',
    language: 'English',
    votes: 2400,
    likes: 6400,
  },
  {
    id: 4,
    title: 'Neon Bazaar',
    genre: 'Drama',
    description: 'Interwoven tales in a bustling night market.',
    poster_url: 'https://picsum.photos/seed/neonbazaar/400/600',
    rating: 8.2,
    certificate: 'UA16+',
    language: 'Hindi, English',
    votes: 1800,
    likes: 7200,
  },
  {
    id: 5,
    title: 'Skyward Bound',
    genre: 'Adventure',
    description: 'Teens build a glider to chase a storm.',
    poster_url: 'https://picsum.photos/seed/skywardbound/400/600',
    rating: 8.0,
    certificate: 'U',
    language: 'English',
    votes: 950,
    likes: 4100,
  },
  {
    id: 6,
    title: 'Monsoon Letters',
    genre: 'Romance',
    description: 'Two pen pals meet every rainy season.',
    poster_url: 'https://picsum.photos/seed/monsoonletters/400/600',
    rating: 8.4,
    certificate: 'U',
    language: 'Hindi',
    votes: 1320,
    likes: 5600,
  },
  {
    id: 7,
    title: 'Parallel Lines',
    genre: 'Sci-Fi',
    description: 'When physics bends, friendships are tested.',
    poster_url: 'https://picsum.photos/seed/parallellines/400/600',
    rating: 8.7,
    certificate: 'UA13+',
    language: 'English',
    votes: 2100,
    likes: 9800,
  },
  {
    id: 8,
    title: 'Crimson Harbor',
    genre: 'Thriller',
    description: 'A dockside mystery under crimson skies.',
    poster_url: 'https://picsum.photos/seed/crimsonharbor/400/600',
    rating: 7.8,
    certificate: 'UA16+',
    language: 'English, Hindi',
    votes: 1750,
    likes: 6400,
  },
  {
    id: 9,
    title: 'Garden of Echoes',
    genre: 'Drama',
    description: 'Secrets surface in an old courtyard.',
    poster_url: 'https://picsum.photos/seed/gardenechoes/400/600',
    rating: 8.3,
    certificate: 'U',
    language: 'Hindi, English',
    votes: 2200,
    likes: 7200,
  },
  {
    id: 10,
    title: 'Starlit Diner',
    genre: 'Romance',
    description: 'Two chefs find love during night shifts.',
    poster_url: 'https://picsum.photos/seed/starlitdiner/400/600',
    rating: 8.1,
    certificate: 'U',
    language: 'English',
    votes: 1400,
    likes: 5200,
  },
  {
    id: 11,
    title: 'Chai & Circuits',
    genre: 'Comedy',
    description: 'A coder café where humor debugs life.',
    poster_url: 'https://picsum.photos/seed/chaicircuits/400/600',
    rating: 7.6,
    certificate: 'U',
    language: 'Hindi, English',
    votes: 1100,
    likes: 4300,
  },
  {
    id: 12,
    title: 'Last Monsoon',
    genre: 'Adventure',
    description: 'An expedition races the final rains.',
    poster_url: 'https://picsum.photos/seed/lastmonsoon/400/600',
    rating: 8.0,
    certificate: 'UA13+',
    language: 'English, Hindi',
    votes: 1600,
    likes: 5800,
  },
];

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const connectedRef = useRef(false);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/movies`);
      setMovies(response.data);
      setFilteredMovies(response.data);
      if (!connectedRef.current) {
        toast.success('Connected to backend and database successfully');
        connectedRef.current = true;
      }
    } catch (err) {
      // Show error to user for debugging
      console.error('API Error:', err);
      toast.error(`Failed to fetch movies: ${err.message}. Using fallback data.`);

      // Fallback to static data if backend/database is unreachable
      setMovies(FALLBACK_MOVIES);
      setFilteredMovies(FALLBACK_MOVIES);
    } finally {
      setLoading(false);
    }
  }, []);

  const { ref: moviesRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchTerm, movies]);

  const handleViewDetails = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await axios.delete(`${API_URL}/movies/${id}`);
        toast.success('Movie deleted successfully');
        fetchMovies();
        if (selectedMovie && selectedMovie.id === id) {
          handleCloseModal();
        }
      } catch (err) {
        toast.error('Failed to delete movie');
        console.error('Error deleting movie:', err);
      }
    }
  };

  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleMovieUpdated = () => {
    fetchMovies();
    handleCloseModal();
    toast.success('Movie updated successfully');
  };

  return (
    <main className="min-h-screen pt-16">
      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <section className="container mx-auto px-4 py-12">


        {loading && (
          <div className="text-center py-20 animate-fade-in">
            <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-lg">Loading movies...</p>
          </div>
        )}

        {!loading && (
          <div ref={moviesRef} className="min-h-[50vh]">
            {filteredMovies.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="glass-card inline-block p-8 rounded-2xl mb-6">
                  <Film className="w-16 h-16 text-white/40 mx-auto mb-4" />
                </div>
                <p className="text-white/60 text-xl">
                  {searchTerm ? 'No movies found matching your search.' : 'No movies available.'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </motion.div>
            )}
          </div>
        )}

        {isModalOpen && selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            onClose={handleCloseModal}
            onDelete={handleDelete}
            onUpdate={handleMovieUpdated}
          />
        )}
      </section>
    </main>
  );
};

export default Home;

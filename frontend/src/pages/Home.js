import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
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
    poster_url: 'https://picsum.photos/id/1024/400/600',
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
    poster_url: 'https://picsum.photos/id/1011/400/600',
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
    poster_url: 'https://picsum.photos/id/1015/400/600',
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
    poster_url: 'https://picsum.photos/id/1016/400/600',
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
    poster_url: 'https://picsum.photos/id/1018/400/600',
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
    poster_url: 'https://picsum.photos/id/1021/400/600',
    rating: 8.4,
    certificate: 'U',
    language: 'Hindi',
    votes: 1320,
    likes: 5600,
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
      // Fallback to static data if backend/database is unreachable
      setMovies(FALLBACK_MOVIES);
      setFilteredMovies(FALLBACK_MOVIES);
      console.error('Error fetching movies, using fallback data:', err);
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
      <HeroSection />
      
      <section className="container mx-auto px-4 py-12">
        <div className="mb-10 animate-slide-up">
          <div className="max-w-2xl mx-auto relative">
            <div className="glass-strong rounded-2xl p-2 flex items-center">
              <Search className="w-5 h-5 text-white/60 ml-3" />
              <input
                type="text"
                placeholder="Search by title or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/50 px-4 py-3"
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-20 animate-fade-in">
            <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-lg">Loading movies...</p>
          </div>
        )}

        {!loading && (
          <div ref={moviesRef}>
            {filteredMovies.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="glass-card inline-block p-8 rounded-2xl mb-6">
                  <Film className="w-16 h-16 text-white/40 mx-auto mb-4" />
                </div>
                <p className="text-white/60 text-xl">
                  {searchTerm ? 'No movies found matching your search.' : 'No movies available.'}
                </p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${
                inView ? 'animate-fade-in' : ''
              }`}>
                {filteredMovies.map((movie, index) => (
                  <div
                    key={movie.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <MovieCard
                      movie={movie}
                      onViewDetails={handleViewDetails}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
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

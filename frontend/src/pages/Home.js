import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import toast from 'react-hot-toast';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import HeroSection from '../components/HeroSection';
import { Search, Film, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { ref: moviesRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    fetchMovies();
  }, []);

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

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/movies`);
      setMovies(response.data);
      setFilteredMovies(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch movies. Please make sure the backend server is running.');
      toast.error('Failed to fetch movies');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <div className="glass-strong rounded-2xl p-6 mb-8 text-center animate-scale-in max-w-2xl mx-auto">
            <div className="text-red-400 mb-2">⚠️</div>
            <p className="text-white">{error}</p>
          </div>
        )}

        {!loading && !error && (
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

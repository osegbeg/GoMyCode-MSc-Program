// src/App.js
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import MovieList from './MovieList';
import Filter from './Filter';
import AddMovie from './AddMovie';

function App() {
  // 1. Main Movies State
  const [movies, setMovies] = useState([
    {
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      posterURL: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500",
      rating: 5
    },
    {
      title: "Inception",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task.",
      posterURL: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500",
      rating: 4
    }
  ]);

  // 2. Filter States
  const [titleFilter, setTitleFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  // 3. Handler to add a new movie
  const handleAddMovie = (movie) => {
    setMovies([...movies, movie]);
  };

  // 4. Filter logic based on title and rating
  const filteredMovies = movies.filter((movie) => {
    const matchesTitle = movie.title.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesRating = ratingFilter === '' || movie.rating >= Number(ratingFilter);
    return matchesTitle && matchesRating;
  });

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4 fw-bold text-primary">🎬 My Favorite Movies Collection</h1>
      
      {/* Filter Component */}
      <Filter 
        titleFilter={titleFilter} 
        setTitleFilter={setTitleFilter} 
        ratingFilter={ratingFilter} 
        setRatingFilter={setRatingFilter} 
      />

      {/* Add Movie Form */}
      <AddMovie onAddMovie={handleAddMovie} />

      {/* Movie List Display */}
      <MovieList movies={filteredMovies} />
    </Container>
  );
}

export default App;
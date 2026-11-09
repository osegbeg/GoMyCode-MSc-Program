// src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import MovieList from './MovieList';
import Filter from './Filter';
import AddMovie from './AddMovie';
import MovieDetail from './MovieDetail';

function App() {
  // 1. Main Movies State
  const [movies, setMovies] = useState([
    {
      id: "1",
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      posterURL: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500",
      trailerLink: "https://www.youtube.com/embed/zSWdZVtXT7E?si=05KCbL1Txq1cgBhU",
      rating: 5
    },
    {
      id: "2",
      title: "Inception",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task.",
      posterURL: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500",
      trailerLink: "https://www.youtube.com/embed/YoHD9XEInc0?si=89FSaN9YvGDGSK7l",
      rating: 4
    }
  ]);


  const [titleFilter, setTitleFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  const handleAddMovie = (movie) => {
    setMovies([...movies, { ...movie, id: Date.now().toString() }]);
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesTitle = movie.title.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesRating = ratingFilter === '' || movie.rating >= Number(ratingFilter);
    return matchesTitle && matchesRating;
  });

  return (
    <BrowserRouter>
      <Container className="py-5">
        <h1 className="text-center mb-4 fw-bold text-primary">🎬 My Favorite Movies Collection</h1>
        
        <Routes>
          {/* HOME PAGE ROUTE */}
          <Route 
            path="/" 
            element={
              <>
                <Filter 
                  titleFilter={titleFilter} 
                  setTitleFilter={setTitleFilter} 
                  ratingFilter={ratingFilter} 
                  setRatingFilter={setRatingFilter} 
                />
                <AddMovie onAddMovie={handleAddMovie} />
                <MovieList movies={filteredMovies} />
              </>
            } 
          />

          {/* MOVIE DETAIL PAGE ROUTE */}
          <Route path="/movie/:id" element={<MovieDetail movies={movies} />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
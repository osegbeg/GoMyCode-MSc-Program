import { useParams, Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

function MovieDetail({ movies }) {
  // 1. Extract the dynamic ID from the URL parameter
  const { id } = useParams();

  // 2. Find the specific movie that matches this ID
  const movie = movies.find((m) => m.id === id);

  // Fallback if the movie isn't found
  if (!movie) {
    return (
      <Container className="text-center mt-5">
        <h2>Movie not found!</h2>
        <Link to="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* Back to Home Button */}
      <Link to="/">
        <Button variant="secondary" className="mb-4">
          ← Back to Home
        </Button>
      </Link>

      {/* Movie Details */}
      <h1 className="mb-3">{movie.title}</h1>
      <p className="lead">{movie.description}</p>

      {/* Embedded Trailer Video */}
      <div className="ratio ratio-16x9 my-4">
        <iframe
          src={movie.trailerLink}
          title={`${movie.title} Trailer`}
          allowFullScreen
        ></iframe>
      </div>
    </Container>
  );
}

export default MovieDetail;
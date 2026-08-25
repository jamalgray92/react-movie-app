import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./App.css";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

function MovieDetails() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [message, setMessage] = useState("Loading movie details...");

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const url =
  `https://api.themoviedb.org/3/movie/${movieId}` +
  "?language=en-US";

const response = await fetch(url, {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    Accept: "application/json",
  },
});

        if (!response.ok) {
          throw new Error("Unable to load movie details.");
        }

        const data = await response.json();
        setMovie(data);
        setMessage("");
      } catch (error) {
        setMessage(error.message);
      }
    }

    fetchMovieDetails();
  }, [movieId]);

  if (!movie) {
    return (
      <main className="details-page">
        <p>{message}</p>
        <Link to="/">Return to search</Link>
      </main>
    );
  }

  const poster = movie.poster_path
    ? `${IMAGE_URL}${movie.poster_path}`
    : "https://placehold.co/300x450?text=No+Poster";

  return (
    <main className="details-page">
      <Link className="back-link" to="/">
        ← Back to movie search
      </Link>

      <article className="movie-details">
        <img src={poster} alt={`${movie.title} poster`} />

        <div className="details-info">
          <h1>{movie.title}</h1>

          {movie.tagline && <h2>{movie.tagline}</h2>}

          <p>
            <strong>Release date:</strong>{" "}
            {movie.release_date || "Unknown"}
          </p>

          <p>
            <strong>Rating:</strong>{" "}
            {movie.vote_average.toFixed(1)}/10
          </p>

          <p>
            <strong>Runtime:</strong>{" "}
            {movie.runtime ? `${movie.runtime} minutes` : "Unknown"}
          </p>

          <p>
            <strong>Genres:</strong>{" "}
            {movie.genres.map((genre) => genre.name).join(", ")}
          </p>

          <p className="overview">{movie.overview}</p>
        </div>
      </article>
    </main>
  );
}

export default MovieDetails;
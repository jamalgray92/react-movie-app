import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useMemo, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import MovieDetails from "./MovieDetails";
import "./App.css";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

function MovieCard({ movie }) {
  const poster = movie.poster_path
    ? `${IMAGE_URL}${movie.poster_path}`
    : "https://placehold.co/300x450?text=No+Poster";

 return (
  <Link className="movie-link" to={`/movie/${movie.id}`}>
    <article className="movie-card" data-aos="fade-right">
      <img src={poster} alt={`${movie.title} poster`} />

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>
          Year:{" "}
          {movie.release_date
            ? movie.release_date.slice(0, 4)
            : "Unknown"}
        </p>
        <p>Rating: {movie.vote_average.toFixed(1)}/10</p>
      </div>
    </article>
  </Link>
);
}
function MovieSearchPage() {
  useEffect(() => {
  AOS.init({
    duration: 800,
    once: true,
  });
}, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sortedMovies = useMemo(() => {
    const results = [...movies];

    if (sortOption === "a-z") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortOption === "z-a") {
      results.sort((a, b) => b.title.localeCompare(a.title));
    }

    if (sortOption === "newest") {
      results.sort(
        (a, b) =>
          new Date(b.release_date || 0) -
          new Date(a.release_date || 0)
      );
    }

    if (sortOption === "oldest") {
      results.sort(
        (a, b) =>
          new Date(a.release_date || 0) -
          new Date(b.release_date || 0)
      );
    }

    return results;
  }, [movies, sortOption]);

  async function fetchMovies(event) {
    event.preventDefault();

    const cleanedSearch = searchTerm.trim();

    if (!cleanedSearch) {
      setMessage("Please enter a movie name.");
      setMovies([]);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const url =
        "https://api.themoviedb.org/3/search/movie" +
        `?query=${encodeURIComponent(cleanedSearch)}` +
        "&include_adult=false&language=en-US&page=1";

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `${response.status}: ${errorData.status_message}`
       );
      }

      const data = await response.json();

      if (data.results.length === 0) {
        setMovies([]);
        setMessage("No movies were found.");
        return;
      }

      setMovies(data.results);
    } catch (error) {
      console.error(error);
      setMovies([]);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <nav>
        <h2>MovieFinder</h2>
      </nav>

      <main>
        <section className="hero">
          <h1>Find Your Favorite Movies</h1>
          <p>
            Search thousands of movies and discover something to watch.
          </p>

          <form id="search-form" onSubmit={fetchMovies}>
            <input
              id="search-input"
              type="text"
              placeholder="Search for a movie..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <button type="submit">Search</button>
          </form>

          <select
            id="filter"
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
          >
            <option value="">Sort Movies</option>
            <option value="a-z">A to Z</option>
            <option value="z-a">Z to A</option>
            <option value="newest">Newest to Oldest</option>
            <option value="oldest">Oldest to Newest</option>
          </select>
        </section>

        {loading && <section className="loading">Loading...</section>}

        {message && <p className="status-message">{message}</p>}

        <section className="movies">
          {sortedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </section>
      </main>

     <footer>
  <p>© 2026 MovieFinder</p>
  <p className="tmdb-credit">
    This product uses the TMDB API but is not endorsed or certified by{" "}
    <a
      href="https://www.themoviedb.org"
      target="_blank"
      rel="noreferrer"
    >
      TMDB
    </a>.
  </p>
</footer>
    </>
  );
}
function App() {
  return (
    <Routes>
      <Route path="/" element={<MovieSearchPage />} />
      <Route path="/movie/:movieId" element={<MovieDetails />} />
    </Routes>
  );
}
export default App;

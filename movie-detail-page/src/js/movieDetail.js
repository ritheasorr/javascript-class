function loadMovieDetail(movieId) {
    fetch('data/movies.js')
        .then(response => response.json())
        .then(movies => {
            const movie = movies.find(m => m.id === movieId);
            if (movie) {
                document.getElementById('movie-title').innerText = movie.title;
                document.getElementById('movie-poster').src = movie.posterUrl;
                document.getElementById('movie-description').innerText = movie.description;
            } else {
                console.error('Movie not found');
            }
        })
        .catch(error => console.error('Error fetching movie data:', error));
}

export default loadMovieDetail;
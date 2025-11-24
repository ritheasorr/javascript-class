const movieData = require('../data/movies');

document.addEventListener('DOMContentLoaded', () => {
    const movieContainer = document.getElementById('movie-container');

    movieData.forEach(movie => {
        const card = createMovieCard(movie);
        movieContainer.appendChild(card);
    });
});

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title} Poster" />
        <h3>${movie.title}</h3>
    `;
    card.addEventListener('click', () => {
        localStorage.setItem('selectedMovie', JSON.stringify(movie));
        window.location.href = 'movie-detail.html';
    });
    return card;
}
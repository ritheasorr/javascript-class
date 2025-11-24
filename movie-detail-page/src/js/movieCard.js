function createMovieCard(movie) {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    
    const title = document.createElement('h3');
    title.textContent = movie.title;
    
    const poster = document.createElement('img');
    poster.src = movie.posterUrl;
    poster.alt = `${movie.title} poster`;
    
    card.appendChild(poster);
    card.appendChild(title);
    
    card.addEventListener('click', () => {
        localStorage.setItem('selectedMovie', JSON.stringify(movie));
        window.location.href = 'movie-detail.html';
    });
    
    return card;
}

export default createMovieCard;
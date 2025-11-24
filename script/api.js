defaultHomePage = (letter) =>  {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = `<p>Loading movies starting with "${letter}"...</p>`;

    fetch(`https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(letter)}`)
        .then(response => response.json())
        .then(data => {
            resultsDiv.innerHTML = ''; // clear loading text

            if (!data.description || data.description.length === 0) {
                resultsDiv.innerHTML = `<p>No movies found starting with "${letter}".</p>`;
                return;
            }

            // Cache movies for recommendations
            let moviePool = JSON.parse(localStorage.getItem('moviePool') || '[]');
            
            data.description.forEach(movie => {
                // Only show titles that start with that letter
                if (movie['#TITLE'] && movie['#TITLE'].toUpperCase().startsWith(letter.toUpperCase())) {
                    const movieDiv = document.createElement('div');
                    movieDiv.classList.add('movie-card');
                    movieDiv.style.cursor = 'pointer';

                    movieDiv.innerHTML = `
                        <img src="${movie['#IMG_POSTER']}" alt="${movie['#TITLE']}" width="120"><br>
                        <h3>${movie['#TITLE']} (${movie['#YEAR'] || 'N/A'})</h3>
                        <p><strong>Actors:</strong> ${movie['#ACTORS'] || 'N/A'}</p>
                        <a href="${movie['#IMDB_URL']}" target="_blank" onclick="event.stopPropagation()">IMDB Link</a>
                    `;

                    // Add click event to navigate to movie detail page
                    movieDiv.addEventListener('click', () => {
                        // Store movie data in localStorage
                        localStorage.setItem('selectedMovie', JSON.stringify(movie));
                        // Navigate to movie detail page
                        window.location.href = 'movie-detail.html';
                    });

                    resultsDiv.appendChild(movieDiv);
                    
                    // Add to movie pool if not already present
                    if (!moviePool.some(m => m['#IMDB_ID'] === movie['#IMDB_ID'])) {
                        moviePool.push(movie);
                    }
                }
            });
            
            // Keep pool size reasonable (max 100 movies)
            if (moviePool.length > 100) {
                moviePool = moviePool.slice(-100);
            }
            localStorage.setItem('moviePool', JSON.stringify(moviePool));
        })
        .catch(error => {
            console.error('Error:', error);
            resultsDiv.innerHTML = '<p>Error fetching results.</p>';
        });
}

searchTitle = (title) => {
    fetch('https://imdb.iamidiotareyoutoo.com/search?q=' + encodeURIComponent(title))
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('searchResults');
            resultsDiv.innerHTML = '';

            if (!data.description || data.description.length === 0) {
                resultsDiv.innerHTML = '<p>No results found.</p>';
                return;
            }

            // Cache movies for recommendations
            let moviePool = JSON.parse(localStorage.getItem('moviePool') || '[]');
            
            data.description.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('movie-card');
                movieDiv.style.cursor = 'pointer';
                movieDiv.innerHTML = `
                    <img src="${movie['#IMG_POSTER']}" alt="${movie['#TITLE']}" width="120"><br>
                    <h3>${movie['#TITLE']} (${movie['#YEAR']})</h3>
                    <p><strong>Actors:</strong> ${movie['#ACTORS']}</p>
                    <a href="${movie['#IMDB_URL']}" target="_blank" onclick="event.stopPropagation()">IMDB Link</a>
                `;

                // Add click event to navigate to movie detail page
                movieDiv.addEventListener('click', () => {
                    // Store movie data in localStorage
                    localStorage.setItem('selectedMovie', JSON.stringify(movie));
                    // Navigate to movie detail page
                    window.location.href = 'movie-detail.html';
                });

                resultsDiv.appendChild(movieDiv);
                
                // Add to movie pool if not already present
                if (!moviePool.some(m => m['#IMDB_ID'] === movie['#IMDB_ID'])) {
                    moviePool.push(movie);
                }
            });
            
            // Keep pool size reasonable (max 100 movies)
            if (moviePool.length > 100) {
                moviePool = moviePool.slice(-100);
            }
            localStorage.setItem('moviePool', JSON.stringify(moviePool));
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('searchResults').innerHTML = '<p>Error fetching results.</p>';
        });
}
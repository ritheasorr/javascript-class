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

            data.description.forEach(movie => {
                // Only show titles that start with that letter
                if (movie['#TITLE'] && movie['#TITLE'].toUpperCase().startsWith(letter.toUpperCase())) {
                    const movieDiv = document.createElement('div');
                    movieDiv.classList.add('movie-card');

                    movieDiv.innerHTML = `
                        <img src="${movie['#IMG_POSTER']}" alt="${movie['#TITLE']}" width="120"><br>
                        <h3>${movie['#TITLE']} (${movie['#YEAR'] || 'N/A'})</h3>
                        <p><strong>Actors:</strong> ${movie['#ACTORS'] || 'N/A'}</p>
                        <a href="${movie['#IMDB_URL']}" target="_blank">IMDB Link</a>
                    `;

                    resultsDiv.appendChild(movieDiv);
                }
            });
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

            data.description.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.innerHTML = `
                    <h3>${movie['#TITLE']} (${movie['#YEAR']})</h3>
                    <img src="${movie['#IMG_POSTER']}" alt="${movie['#TITLE']}" width="120"><br>
                    <strong>Actors:</strong> ${movie['#ACTORS']}<br>
                    <a href="${movie['#IMDB_URL']}" target="_blank">IMDB Link</a>
                    <hr>
                `;
                resultsDiv.appendChild(movieDiv);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('searchResults').innerHTML = '<p>Error fetching results.</p>';
        });
}
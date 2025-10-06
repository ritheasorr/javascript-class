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
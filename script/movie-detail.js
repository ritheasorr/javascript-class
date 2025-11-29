// Load movie details from localStorage
window.addEventListener('DOMContentLoaded', () => {
    const movieData = localStorage.getItem('selectedMovie');
    
    if (!movieData) {
        // If no movie data found, redirect back to home
        window.location.href = 'home.html';
        return;
    }
    
    try {
        const movie = JSON.parse(movieData);
        displayMovieDetails(movie);
        displayRecommendations(movie);
    } catch (error) {
        console.error('Error parsing movie data:', error);
        window.location.href = 'home.html';
    }
});

function displayMovieDetails(movie) {
    // Update poster
    const posterImg = document.getElementById('posterImg');
    posterImg.src = movie['#IMG_POSTER'] || '';
    posterImg.alt = movie['#TITLE'] || 'Movie Poster';
    
    // Update title
    document.getElementById('movieTitle').textContent = movie['#TITLE'] || 'Unknown Title';
    
    // Update year
    document.getElementById('movieYear').textContent = movie['#YEAR'] 
        ? `Released: ${movie['#YEAR']}` 
        : 'Release year unknown';
    
    // Update actors
    document.getElementById('movieActors').textContent = movie['#ACTORS'] || 'Cast information not available';
    
    // Update ranking
    document.getElementById('movieRank').textContent = movie['#RANK'] 
        ? `IMDb Rank: #${movie['#RANK']}` 
        : 'Ranking not available';
    
    // Update IMDb ID
    document.getElementById('movieImdbId').textContent = movie['#IMDB_ID'] 
        ? movie['#IMDB_ID'] 
        : 'ID not available';
    
    // Update IMDb link
    const imdbLink = document.getElementById('imdbLink');
    if (movie['#IMDB_URL']) {
        imdbLink.href = movie['#IMDB_URL'];
    } else {
        imdbLink.style.display = 'none';
    }
    
    // Update page title
    document.title = movie['#TITLE'] ? `${movie['#TITLE']} - Movie Details` : 'Movie Details';
    
    // Fetch additional details from IMDb IV endpoint
    if (movie['#IMDB_IV']) {
        fetchExtendedDetails(movie['#IMDB_IV']);
    }
}

// Fetch extended movie details from IMDb IV endpoint
async function fetchExtendedDetails(imdbIVUrl) {
    try {
        const response = await fetch(imdbIVUrl);
        
        // Check if response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Parse HTML to extract additional information
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const articleElement = doc.querySelector('article');
        if (!articleElement) {
            setLoadingFieldsToUnavailable();
            return;
        }
        
        const text = articleElement.textContent;
        const innerHTML = articleElement.innerHTML;
        
        // Extract rating (8.8/10 format)
        const ratingMatch = text.match(/Usᴇʀ Rᴀᴛɪɴɢs.*?(\d+\.\d+)\/₁₀/);
        if (ratingMatch) {
            const ratingEl = document.getElementById('movieRating');
            if (ratingEl) {
                ratingEl.innerHTML = `⭐ ${ratingMatch[1]}/10`;
            }
        }
        
        // Extract genre - improved method using innerHTML to parse links
        const genreSection = innerHTML.match(/📟\s*<b>Gᴇɴʀᴇ<\/b>:(.+?)<br/i);
        if (genreSection) {
            const genreHTML = genreSection[1];
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = genreHTML;
            const genreLinks = tempDiv.querySelectorAll('a');
            const genres = Array.from(genreLinks).map(link => {
                // Extract text after emoji
                return link.textContent.replace(/[🚀🌋🌠🎭🎬😂🔪💀❤️🎵📚⚔️🎪👨‍⚕️⚡🏛️🌟🎸⚽👨‍👩‍👧‍👦]/g, '').trim();
            }).filter(g => g.length > 0);
            
            if (genres.length > 0) {
                const genreEl = document.getElementById('movieGenre');
                if (genreEl) {
                    genreEl.textContent = genres.join(', ');
                }
            }
        }
        
        // Extract duration
        const durationMatch = text.match(/Dᴜʀᴀᴛɪᴏɴ.*?:\s*([^🗓️]+)/);
        if (durationMatch) {
            const durationEl = document.getElementById('movieDuration');
            if (durationEl) {
                durationEl.textContent = durationMatch[1].trim();
            }
        }
        
        // Extract storyline
        const storylineMatch = text.match(/Sᴛᴏʀy Lɪɴᴇ.*?:\s*(.+?)\.\.\./);
        if (storylineMatch) {
            const storylineEl = document.getElementById('movieStoryline');
            if (storylineEl) {
                storylineEl.textContent = storylineMatch[1].trim();
            }
        }
        
        // Extract awards
        const awardsMatch = text.match(/ᴀᴡᴀʀᴅꜱ.*?:\s*(\d+\s*ωιηѕ\s*&\s*\d+[^📋🏆\n]*)/);
        if (awardsMatch) {
            const awardsEl = document.getElementById('movieAwards');
            if (awardsEl) {
                awardsEl.textContent = awardsMatch[1].trim().replace(/&amp;/g, '&');
            }
        }
        
        // Extract language
        const langMatch = text.match(/Lᴀɴɢᴜᴀɢᴇ.*?:\s*([^📟]+)/);
        if (langMatch) {
            const langText = langMatch[1].trim();
            const languages = langText.match(/(English|Japanese|French|Spanish|German|Italian|Korean|Chinese|Hindi|Russian|Portuguese|Arabic)/gi);
            if (languages) {
                const langEl = document.getElementById('movieLanguage');
                if (langEl) {
                    langEl.textContent = languages.join(', ');
                }
            }
        }
        
        // After extraction, set any remaining "Loading..." fields to "Not available"
        setLoadingFieldsToUnavailable();
        
    } catch (error) {
        console.error('Error fetching extended details:', error);
        // Set all loading fields to "Not available"
        setLoadingFieldsToUnavailable();
    }
}

// Helper function to replace "Loading..." with "Not available"
function setLoadingFieldsToUnavailable() {
    const loadingFields = [
        'movieGenre',
        'movieDuration',
        'movieStoryline',
        'movieLanguage',
        'movieAwards'
    ];
    
    loadingFields.forEach(fieldId => {
        const el = document.getElementById(fieldId);
        if (el && (el.textContent === 'Loading...' || el.textContent.trim() === '')) {
            el.textContent = 'Not available';
            el.style.color = '#9ca3af';
            el.style.fontStyle = 'italic';
        }
    });
}

// Recommendation system using JSON data
async function displayRecommendations(currentMovie) {
    const recommendationsContainer = document.getElementById('recommendations');
    
    if (!recommendationsContainer) {
        return;
    }
    
    try {
        // Fetch recommendations JSON
        const response = await fetch('../recommendations.json');
        const data = await response.json();
        
        // Create movie key from title and year
        const movieKey = `${currentMovie['#TITLE']} (${currentMovie['#YEAR']})`;
        
        // Get recommended movie titles from JSON
        let recommendedTitles = data.recommendations[movieKey];
        
        if (!recommendedTitles || recommendedTitles.length === 0) {
            recommendationsContainer.innerHTML = '<p class="no-recommendations">No recommendations available for this movie yet.</p>';
            return;
        }
        
        // Fetch movie details for each recommended title
        const recommendations = await fetchRecommendedMovies(recommendedTitles.slice(0, 6));
        
        if (recommendations.length === 0) {
            recommendationsContainer.innerHTML = '<p class="no-recommendations">Unable to load recommendations at this time.</p>';
            return;
        }
        
        // Clear container
        recommendationsContainer.innerHTML = '<h2>You May Also Like</h2><div class="recommendations-grid"></div>';
        const grid = recommendationsContainer.querySelector('.recommendations-grid');
        
        // Display each recommendation
        recommendations.forEach((movie, index) => {
            const card = document.createElement('div');
            card.classList.add('recommendation-card');
            card.style.cursor = 'pointer';
            
            card.innerHTML = `
                <img src="${movie['#IMG_POSTER']}" alt="${movie['#TITLE']}">
                <div class="rec-info">
                    <h4>${movie['#TITLE']}</h4>
                    <p class="rec-year">${movie['#YEAR'] || 'N/A'}</p>
                    <p class="rec-match">Recommended #${index + 1}</p>
                </div>
            `;
            
            card.addEventListener('click', () => {
                localStorage.setItem('selectedMovie', JSON.stringify(movie));
                window.location.reload();
            });
            
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading recommendations:', error);
        recommendationsContainer.innerHTML = '<p class="no-recommendations">Unable to load recommendations at this time.</p>';
    }
}

// Fetch movie details from API for recommended titles
async function fetchRecommendedMovies(titles) {
    const movies = [];
    
    for (const titleWithYear of titles) {
        try {
            // Extract title without year for search
            const titleMatch = titleWithYear.match(/^(.+?)\s*\((\d{4})\)$/);
            if (!titleMatch) continue;
            
            const title = titleMatch[1];
            const year = titleMatch[2];
            
            // Search for the movie
            const response = await fetch(`https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(title)}`);
            const data = await response.json();
            
            if (data.description && data.description.length > 0) {
                // Find exact match by title and year
                const movie = data.description.find(m => 
                    m['#TITLE'] === title && m['#YEAR'] == year
                );
                
                // If exact match not found, try partial match
                if (movie) {
                    movies.push(movie);
                } else {
                    const partialMatch = data.description.find(m => 
                        m['#TITLE'].toLowerCase().includes(title.toLowerCase()) && 
                        Math.abs(m['#YEAR'] - year) <= 1
                    );
                    if (partialMatch) {
                        movies.push(partialMatch);
                    }
                }
            }
            
            // Limit API calls to avoid overwhelming the server
            if (movies.length >= 6) break;
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
            console.error(`Error fetching movie ${titleWithYear}:`, error);
        }
    }
    
    return movies;
}

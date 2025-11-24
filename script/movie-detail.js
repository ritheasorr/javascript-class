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
        const html = await response.text();
        
        // Parse HTML to extract additional information
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract genre
        const genreElement = doc.querySelector('article');
        if (genreElement) {
            const text = genreElement.textContent;
            
            // Extract rating (8.8/10 format)
            const ratingMatch = text.match(/Usᴇʀ Rᴀᴛɪɴɢs.*?(\d+\.\d+)\/₁₀/);
            if (ratingMatch) {
                const ratingEl = document.getElementById('movieRating');
                if (ratingEl) {
                    ratingEl.innerHTML = `⭐ ${ratingMatch[1]}/10`;
                }
            }
            
            // Extract genre
            const genreMatch = text.match(/Gᴇɴʀᴇ.*?:\s*([^📋]+)/);
            if (genreMatch) {
                const genreText = genreMatch[1].trim();
                const genres = genreText.match(/(Action|Adventure|Sci-Fi|Drama|Comedy|Thriller|Horror|Romance|Mystery|Crime|Fantasy|Animation|Documentary|Biography|History|War|Western|Musical|Sport|Family)/gi);
                if (genres) {
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
        }
    } catch (error) {
        console.error('Error fetching extended details:', error);
        // Don't show error to user, just log it
    }
    if (movie['#IMDB_URL']) {
        imdbLink.href = movie['#IMDB_URL'];
    } else {
        imdbLink.style.display = 'none';
    }
    
    // Update page title
    document.title = movie['#TITLE'] ? `${movie['#TITLE']} - Movie Details` : 'Movie Details';
}

// Recommendation system
function displayRecommendations(currentMovie) {
    const moviePool = JSON.parse(localStorage.getItem('moviePool') || '[]');
    const recommendationsContainer = document.getElementById('recommendations');
    
    if (!recommendationsContainer || moviePool.length < 2) {
        if (recommendationsContainer) {
            recommendationsContainer.innerHTML = '<p class="no-recommendations">Not enough movies for recommendations. Browse more movies to see recommendations!</p>';
        }
        return;
    }
    
    // Get top recommendations
    const recommendations = getRecommendations(currentMovie, moviePool, 6);
    
    if (recommendations.length === 0) {
        recommendationsContainer.innerHTML = '<p class="no-recommendations">No similar movies found.</p>';
        return;
    }
    
    // Clear container
    recommendationsContainer.innerHTML = '<h2>You May Also Like</h2><div class="recommendations-grid"></div>';
    const grid = recommendationsContainer.querySelector('.recommendations-grid');
    
    // Display each recommendation
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.classList.add('recommendation-card');
        card.style.cursor = 'pointer';
        
        card.innerHTML = `
            <img src="${rec.movie['#IMG_POSTER']}" alt="${rec.movie['#TITLE']}">
            <div class="rec-info">
                <h4>${rec.movie['#TITLE']}</h4>
                <p class="rec-year">${rec.movie['#YEAR'] || 'N/A'}</p>
                <p class="rec-match">Match: ${Math.round(rec.score)}%</p>
            </div>
        `;
        
        card.addEventListener('click', () => {
            localStorage.setItem('selectedMovie', JSON.stringify(rec.movie));
            window.location.reload();
        });
        
        grid.appendChild(card);
    });
}

function getRecommendations(currentMovie, moviePool, count = 6) {
    // Filter out current movie
    const candidates = moviePool.filter(m => m['#IMDB_ID'] !== currentMovie['#IMDB_ID']);
    
    if (candidates.length === 0) return [];
    
    // Calculate similarity scores
    const scored = candidates.map(movie => ({
        movie,
        score: calculateSimilarity(currentMovie, movie)
    }));
    
    // Sort by score descending and return top N
    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, count)
        .filter(item => item.score > 0); // Only return movies with some similarity
}

function calculateSimilarity(movie1, movie2) {
    let score = 0;
    
    // Actor overlap (highest weight: 40%)
    const actorScore = calculateActorOverlap(movie1['#ACTORS'], movie2['#ACTORS']);
    score += actorScore * 40;
    
    // Title keyword overlap (medium weight: 30%)
    const titleScore = calculateTitleOverlap(movie1['#TITLE'], movie2['#TITLE']);
    score += titleScore * 30;
    
    // Year proximity (small weight: 15%)
    const yearScore = calculateYearProximity(movie1['#YEAR'], movie2['#YEAR']);
    score += yearScore * 15;
    
    // Rank proximity (small weight: 15%)
    const rankScore = calculateRankProximity(movie1['#RANK'], movie2['#RANK']);
    score += rankScore * 15;
    
    return score;
}

function calculateActorOverlap(actors1, actors2) {
    if (!actors1 || !actors2) return 0;
    
    const list1 = actors1.split(',').map(a => a.trim().toLowerCase());
    const list2 = actors2.split(',').map(a => a.trim().toLowerCase());
    
    const overlap = list1.filter(actor => list2.includes(actor)).length;
    const total = Math.max(list1.length, list2.length);
    
    return total > 0 ? overlap / total : 0;
}

function calculateTitleOverlap(title1, title2) {
    if (!title1 || !title2) return 0;
    
    const stopwords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'of'];
    
    const words1 = title1.toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 2 && !stopwords.includes(w));
    const words2 = title2.toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 2 && !stopwords.includes(w));
    
    const overlap = words1.filter(word => words2.includes(word)).length;
    const total = Math.max(words1.length, words2.length);
    
    return total > 0 ? overlap / total : 0;
}

function calculateYearProximity(year1, year2) {
    if (!year1 || !year2) return 0;
    
    const y1 = parseInt(year1);
    const y2 = parseInt(year2);
    
    if (isNaN(y1) || isNaN(y2)) return 0;
    
    const diff = Math.abs(y1 - y2);
    
    // Perfect match within 2 years, decreasing score up to 20 years
    if (diff <= 2) return 1;
    if (diff > 20) return 0;
    
    return 1 - (diff / 20);
}

function calculateRankProximity(rank1, rank2) {
    if (!rank1 || !rank2) return 0;
    
    const r1 = parseInt(rank1);
    const r2 = parseInt(rank2);
    
    if (isNaN(r1) || isNaN(r2)) return 0;
    
    const diff = Math.abs(r1 - r2);
    
    // Perfect match within 100 ranks, decreasing up to 1000
    if (diff <= 100) return 1;
    if (diff > 1000) return 0;
    
    return 1 - (diff / 1000);
}

# API Data Analysis - IMDb Movie Information

## Available Data Sources

### 1. Search API Endpoint
**URL:** `https://imdb.iamidiotareyoutoo.com/search?q={query}`

**Available Fields:**
- `#TITLE` - Movie title
- `#YEAR` - Release year
- `#IMDB_ID` - IMDb ID (e.g., tt1375666)
- `#RANK` - IMDb ranking number
- `#ACTORS` - Main cast members (comma-separated)
- `#AKA` - Also known as / Alternative title
- `#IMDB_URL` - Direct link to IMDb page
- `#IMDB_IV` - Link to IMDb IV endpoint (HTML page with extended details)
- `#IMG_POSTER` - Poster image URL
- `photo_width` - Poster width in pixels
- `photo_height` - Poster height in pixels

### 2. IMDb IV Endpoint (Extended Details)
**URL:** `{#IMDB_IV from search results}` (e.g., https://IMDb.iamidiotareyoutoo.com/title/tt1375666)

**Additional Fields Extracted from HTML:**
- **User Rating** - Rating score (e.g., 8.8/10)
- **Rating Count** - Number of user ratings
- **Content Rating** - Age rating (e.g., PG-13)
- **Genre** - Multiple genres (Action, Adventure, Sci-Fi, etc.)
- **Duration** - Runtime (e.g., 2h 28m)
- **Languages** - Spoken languages
- **Storyline/Plot** - Movie synopsis/description
- **Awards** - Number of wins and nominations
- **Release Date** - Specific release date with country
- **Reviews** - User and critic review counts
- **Metascore** - Metacritic score

## Implementation Status

### ✅ Currently Implemented:
- Title, Year, Actors, Rank, IMDb ID, Poster
- **NEW:** Genre, Duration, Storyline, Rating, Awards, Language
- Recommendation system based on actors, title keywords, year, and rank
- Click-through navigation to movie details
- Movie pool caching for recommendations

### 🎯 Enhancement Features:
- Automatic fetching of extended details from IMDb IV endpoint
- Parsing HTML to extract additional metadata
- Display of user ratings, genres, duration, storyline, awards, and languages
- Graceful handling of missing data

## Data Quality Notes:
- Not all movies have complete information in both endpoints
- HTML parsing is used for extended details (may need updates if API HTML structure changes)
- Awards and language data may have formatting variations
- Storyline is truncated with "..." in the HTML

## Usage:
The system now automatically fetches and displays all available data when you click on a movie card!

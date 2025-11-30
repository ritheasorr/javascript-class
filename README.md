# JavaScript Class Project

A full-featured web application demonstrating modern JavaScript practices with user authentication, movie browsing, and theme switching capabilities.

## Features

- **User Authentication** - Login system with credential validation
- **Movie Browsing** - Browse and view movie information in card format
- **Movie Details** - Detailed movie pages with poster and descriptions
- **Dark/Light Theme** - Toggle between dark and light themes
- **Responsive Design** - Mobile-friendly interface

## Project Structure

```
javascript-class/
├── auth.json                 # Authentication data
├── recommendations.json      # Movie recommendations data
├── test-api.html            # API testing page
├── public/                  # Public assets
├── script/                  # Core JavaScript files
│   ├── api.js              # API requests and data fetching
│   ├── login.js            # Authentication logic
│   ├── movie-detail.js     # Movie detail functionality
│   └── theme-toggle.js     # Dark/light theme toggle
├── view/                    # HTML pages and styles
│   ├── home.html           # Home page
│   ├── home.css            # Home page styles
│   ├── login.html          # Login page
│   ├── login.css           # Login styles
│   ├── movie-detail.html   # Movie detail page
│   ├── movie-detail.css    # Movie detail styles
│   ├── theme-toggle.css    # Theme styles
└── README.md
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE (VS Code recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ritheasorr/javascript-class.git
cd javascript-class
```

2. Open the application:
   - Open `view/login.html` in your browser to start with login
   - Or open `view/home.html` to go directly to the home page

### Usage

**Login Page:**
- Enter credentials to authenticate
- Credentials are validated against `auth.json`

**Home Page:**
- Browse available movies in card format
- Click on a movie card to view detailed information

**Movie Detail Page:**
- View full movie information including poster and description
- Navigate back to browse more movies

**Theme Toggle:**
- Switch between dark and light themes
- Preference is maintained during your session

## File Descriptions

### Script Files
- **api.js** - Handles all API calls and data fetching from JSON files
- **login.js** - Manages user authentication and session handling
- **movie-detail.js** - Controls movie detail page rendering and interactions
- **theme-toggle.js** - Implements dark/light theme switching

### View Files
- **home.html/css** - Movie browsing interface
- **login.html/css** - User authentication interface
- **movie-detail.html/css** - Movie information display
- **theme-toggle.css** - Theme styling utilities

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- JSON (for data storage)

## Contributing

Feel free to submit issues or pull requests for improvements and new features.

## License

This project is open source and available under the MIT License.

---

For questions or support, please open an issue on the GitHub repository.

# Dynamic Content Loading Implementation

## Overview

This document describes the implementation of dynamic content loading for the M.E.N.U. (Mission, Equipment, & Navigation Uplink) interface. The system now loads each menu section from separate HTML files using the `loadContent` function.

## File Structure

```
dan-bach-menu/
├── index.html          # Main HTML file with navigation and content-area
├── pages/              # Directory for individual menu sections
│   ├── stats.html       # Statistics page content
│   ├── inventory.html   # Inventory page content
│   ├── map.html        # Map page content
│   └── story.html      # Story/mission log page content
├── assets/             # Static assets (images, etc.)
├── js/
│   └── constants.js    # Data constants for dynamic population
├── script.js           # Main JavaScript functionality
├── styles.css          # Styling
└── run_server.py       # Simple Python HTTP server for testing
```

## Implementation Details

### 1. Content Separation

Each menu section has been extracted into its own HTML file in the `pages/` directory:

- `stats.html` - Character statistics, health bars, and mission progress
- `inventory.html` - Equipment items with interactive states
- `map.html` - Area map with clickable locations
- `story.html` - Mission log entries

Each file contains only the content wrapped in `<section>` tags, making them partial HTML documents.

### 2. Main Interface Changes

The `index.html` file has been modified to:
- Replace all tab content sections with a single `<div id="content-area">`
- Include the `constants.js` file for data population
- Load the stats page by default

### 3. JavaScript Functionality

The `script.js` file implements:
- `loadContent(page)` function for asynchronously loading content
- Event listeners for navigation buttons
- Content population using constants from `constants.js`
- Event handler re-initialization for dynamically loaded content

When a navigation button is clicked:
1. The button's active state is updated
2. `loadContent('pages/[section].html')` is called
3. The content is fetched and inserted into the content-area
4. Content is populated with data from constants
5. Event listeners are attached to the new content

### 4. Dynamic Content Population

The system dynamically populates content with values from `constants.js`:
- Character information (name, class, rank, status)
- Health statistics (health, energy, oxygen, armor)
- Mission progress
- Location data
- System status

## Testing

To test the implementation:

1. Run the Python HTTP server:
   ```bash
   cd dan-bach-menu
   python run_server.py
   ```

2. Open http://localhost:8000 in your browser

3. Click navigation buttons to switch between menu sections

## Benefits

- **Modularity**: Each section is maintained in its own file
- **Maintainability**: Easier to update individual sections
- **Performance**: Only loads content as needed
- **Scalability**: Easy to add new sections
- **Separation of Concerns**: Content, behavior, and styling are properly separated

## Browser History Support

The implementation includes browser history support:
- `history.pushState()` updates the URL when navigating
- `window.onpopstate` handles back/forward button navigation
- The URL reflects the current page with a hash fragment

## Error Handling

The system includes error handling for:
- Failed page loads (displays error message in content area)
- Missing elements (checks for element existence before population)
- Network issues (try/catch around fetch operations)

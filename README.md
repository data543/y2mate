# Instagram Video Downloader - Full Stack Project

This project is a full-stack Instagram video downloader application with a React frontend and an Express backend using Puppeteer for scraping Instagram reel metadata and video URLs.

---

## Project Structure

- `server.js` - Express backend server
- `src/api/instagram.js` - Backend API route for fetching Instagram video data using Puppeteer
- `frontend/` - React frontend application created with Create React App
- `.env` - Environment variables for backend
- `frontend/.env` - Environment variables for frontend

---

## Setup Instructions

### Backend Setup

1. Navigate to the project root directory.

2. Create a `.env` file in the root directory with the following content (optional, defaults to port 5000):

```
PORT=5000
```

3. Install backend dependencies:

```bash
npm install
```

4. Start the backend server:

```bash
node server.js
```

The backend server will run on the port specified in `.env` or default to 5000.

---

### Frontend Setup

1. Navigate to the `frontend` directory:

```bash
cd frontend
```

2. Create a `.env` file in the `frontend` directory with the following content:

```
REACT_APP_API_URL=http://localhost:5000
```

3. Install frontend dependencies:

```bash
npm install
```

4. Start the React development server:

```bash
npm start
```

The frontend will run on http://localhost:3000 and communicate with the backend API.

---

## Usage

- Open http://localhost:3000 in your browser.
- Paste an Instagram reel or post URL into the input box.
- Click "Download" to fetch video details and play the video.

---

## Notes

- Ensure Puppeteer dependencies are installed correctly for the backend.
- The backend uses Puppeteer with `--no-sandbox` flag for compatibility.
- The frontend uses environment variables to configure the backend API URL.

---

## License

MIT License

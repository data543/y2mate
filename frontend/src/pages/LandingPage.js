import React, { useState } from 'react';
import InputBox from '../components/InputBox';
import Footer from '../components/Footer';

const LandingPage = () => {
  const [url, setUrl] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVideoData = async () => {
    setLoading(true);
    setError(null);
    setVideoData(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/fetch?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch video data');
      }
      const data = await response.json();
      setVideoData(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching video data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Instagram Video Downloader</h1>
        <div className="max-w-xl mx-auto">
          <InputBox
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Instagram reel or post URL here"
          />
          <button
            onClick={fetchVideoData}
            disabled={loading || !url}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Download'}
          </button>
          {error && <p className="mt-4 text-red-500">{error}</p>}
          {videoData && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-2">{videoData.title || 'Video Details'}</h2>
              <img src={videoData.thumbnail} alt="Video thumbnail" className="mb-4 rounded" />
              {videoData.videoUrl && (
                <video controls src={videoData.videoUrl} className="w-full rounded" />
              )}
              <p className="mt-2">Duration: {videoData.duration || 'N/A'}</p>
              <p>Author: {videoData.authorName || 'N/A'}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;

import React, { useState, useEffect } from 'react';
import InputBox from '../components/InputBox';
import Footer from '../components/Footer';

const LandingPage = () => {
  const [instagramLink, setInstagramLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleDownloadClick = (url) => {
    alert(`Fake download started for ${url}`);
  };

  const handleButtonClick = async () => {
    setError('');
    if (instagramLink.trim() === '') {
      setError('Please paste an Instagram link.');
      return;
    }
    setLoading(true);
    setData(null);
    try {
      const response = await fetch('/api/instagram/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: instagramLink }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Spinner = () => (
    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <div className="flex justify-end p-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <main className="flex flex-col items-center justify-center px-4 py-12 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
          Instagram Video Downloader
        </h1>
        <div className="w-full max-w-md">
          <InputBox
            placeholder="Paste Instagram link here"
            value={instagramLink}
            onChange={(e) => setInstagramLink(e.target.value)}
            onSubmit={handleButtonClick}
          />
          <button
            onClick={handleButtonClick}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <Spinner /> : 'Download'}
          </button>
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>

        {data && (
          <div className="mt-10 w-full max-w-md bg-white dark:bg-gray-800 rounded shadow p-4">
            <VideoCard data={data} onDownload={handleDownloadClick} />
          </div>
        )}
      </main>
      <Footer />
      <style>{`
        .loader {
          border-top-color: #3498db;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const VideoCard = ({ data, onDownload }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center">
      <img
        src={data.thumbnail}
        alt="Thumbnail"
        className="w-full sm:w-48 h-32 object-cover rounded mb-4 sm:mb-0 sm:mr-4"
      />
      <div className="flex flex-col space-y-2">
        {data.videos.map((video) => (
          <div key={video.quality} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded p-2">
            <span className="text-gray-800 dark:text-gray-200">Quality: {video.quality}</span>
            <button
              onClick={() => onDownload(video.url)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;

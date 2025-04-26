const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/fetch', async (req, res) => {
  const { url } = req.query;

  if (!url || !url.includes('instagram.com')) {
    return res.status(400).json({ error: 'Invalid Instagram URL' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for video element or meta tag with video URL
    const videoUrl = await page.evaluate(() => {
      // Try to get video URL from meta tags
      const metaVideo = document.querySelector('meta[property="og:video"]');
      if (metaVideo && metaVideo.content) {
        return metaVideo.content;
      }
      // Try to get video URL from video tag
      const video = document.querySelector('video');
      if (video && video.src) {
        return video.src;
      }
      return null;
    });

    if (!videoUrl) {
      return res.status(404).json({ error: 'Video URL not found' });
    }

    // Get thumbnail and title
    const thumbnail = await page.evaluate(() => {
      const metaImage = document.querySelector('meta[property="og:image"]');
      return metaImage ? metaImage.content : null;
    });

    const title = await page.evaluate(() => {
      const metaTitle = document.querySelector('meta[property="og:title"]');
      return metaTitle ? metaTitle.content : null;
    });

    await browser.close();

    return res.json({
      videoUrl,
      thumbnail,
      title,
    });
  } catch (error) {
    if (browser) await browser.close();
    return res.status(500).json({ error: 'Failed to fetch video data', details: error.message });
  }
});

module.exports = router;

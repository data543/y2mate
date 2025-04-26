const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.post('/instagram', async (req, res) => {
  const { url } = req.body;

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

    // Extract video URL from meta tags or video element
    const videoUrl = await page.evaluate(() => {
      const metaVideo = document.querySelector('meta[property="og:video"]');
      if (metaVideo && metaVideo.content) {
        return metaVideo.content;
      }
      const video = document.querySelector('video');
      if (video && video.src) {
        return video.src;
      }
      return null;
    });

    if (!videoUrl) {
      return res.status(404).json({ error: 'Video URL not found' });
    }

    await browser.close();

    return res.json({ videoUrl });
  } catch (error) {
    if (browser) await browser.close();
    return res.status(500).json({ error: 'Failed to fetch video URL', details: error.message });
  }
});

module.exports = router;

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
    const videoData = await page.evaluate(() => {
      const metaVideo = document.querySelector('meta[property="og:video"]');
      const video = document.querySelector('video');
      const metaImage = document.querySelector('meta[property="og:image"]');
      const metaTitle = document.querySelector('meta[property="og:title"]');
      const metaDuration = document.querySelector('meta[property="video:duration"]');
      const authorName = document.querySelector('a[title]')?.title || null;

      return {
        videoUrl: metaVideo?.content || video?.src || null,
        thumbnail: metaImage?.content || null,
        title: metaTitle?.content || null,
        duration: metaDuration?.content || null,
        authorName,
      };
    });

    if (!videoData.videoUrl) {
      return res.status(404).json({ error: 'Video URL not found' });
    }

    await browser.close();

    return res.json(videoData);
  } catch (error) {
    if (browser) await browser.close();
    return res.status(500).json({ error: 'Failed to fetch video data', details: error.message });
  }
});

module.exports = router;

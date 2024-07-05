const puppeteer = require('puppeteer');
const fs = require('fs');

async function fetchAndSaveBlob(url, savePath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Navigate to the page
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait for the video container to be visible and click on it
        await page.waitForSelector('div.mgp_videoWrapper');
        await page.click('div.mgp_videoWrapper');

        // Wait for the video element to be loaded
        await page.waitForSelector('.mgp_videoElement[src^="blob:"]');

        // Extract blob URL from the video tag
        const blobUrl = await page.$eval('.mgp_videoElement', (element) => {
            return element.src;
        });

        if (!blobUrl) {
            throw new Error('Blob URL not found in the page');
        }

        // Fetch blob content
        const response = await page.goto(blobUrl, { waitUntil: 'networkidle2' });

        if (response.ok()) {
            // Save blob content to file
            fs.writeFileSync(savePath, await response.buffer());
            console.log(`Blob video saved to ${savePath}`);
        } else {
            throw new Error(`Failed to fetch blob content (${response.status()} ${response.statusText()})`);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}
// Example usage
const url = 'https://www.pornhub.org/view_video.php?viewkey=65abdfed36d1e';
const savePath = './blob-video.mp4';

fetchAndSaveBlob(url, savePath);

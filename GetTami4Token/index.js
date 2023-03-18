const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 8080;

app.get('/token', async (req, res) => {
  // Launch a new Puppeteer instance
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // Navigate to the web page
  await page.goto('https://www.tami4.co.il/area/lobby');

  // Run some JavaScript code on the page
  const result = await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      grecaptcha.enterprise.ready(function() {
        grecaptcha.enterprise.execute("6Lf-jYgUAAAAAEQiRRXezC9dfIQoxofIhqBnGisq", {action: 'submit'}).then(function(token) {
            resolve({"token":token});
        });
      });
    });
  });

  // Close the browser
  await browser.close();

  // Return the result as JSON
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:8081', {waitUntil: 'networkidle0'});
  
  await new Promise(r => setTimeout(r, 2000));
  
  const res = await page.evaluate(() => {
    try {
      const chartCanvas = document.getElementById('c1');
      const hasInstance = Chart.getChart(chartCanvas) !== undefined;
      return { c1HasChart: hasInstance, canvases: Array.from(document.querySelectorAll('canvas')).map(c => c.id) };
    } catch(e) { return {error: e.message}; }
  });
  console.log('EVAL:', JSON.stringify(res));
  
  await browser.close();
})();

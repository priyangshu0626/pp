const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  
  // Log all console output
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:8081', {waitUntil: 'networkidle0'});
  
  // Wait a bit
  await new Promise(r => setTimeout(r, 2000));
  
  // Evaluate something on the page to see if charts object exists
  const res = await page.evaluate(() => {
    return {
      chartsKeys: typeof charts !== 'undefined' ? Object.keys(charts) : 'charts undefined',
      c1Canvas: !!document.getElementById('c1'),
      ChartJS: typeof Chart !== 'undefined'
    };
  });
  console.log('EVAL:', JSON.stringify(res));
  
  await browser.close();
})();

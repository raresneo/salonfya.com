import { test, expect } from '@playwright/test';

const PAGES_TO_TEST = [
  { name: 'Homepage', path: '/' },
  { name: 'Anna Collection', path: '/colectii/anna' },
  { name: 'Imperial Collection', path: '/colectii/imperial' },
  { name: 'Mayra Collection', path: '/colectii/mayra' },
  { name: 'Beverly Collection', path: '/colectii/beverly' },
  { name: 'Despre Noi', path: '/despre-noi' },
  { name: 'Programare', path: '/programare' },
  { name: 'Admin Login', path: '/admin' },
];

test.describe('UI Analysis Screenshots', () => {
  for (const { name, path } of PAGES_TO_TEST) {
    test(`Snapshot for ${name}`, async ({ page, browserName }) => {
      await page.goto(path);
      
      // Wait for any animations or images to settle
      await page.waitForTimeout(2000); 
      
      // Optionally wait for the network to be completely idle
      await page.waitForLoadState('networkidle');

      // Scroll to bottom to trigger lazy loading if any
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);

      // Take full page screenshot
      const safeName = name.toLowerCase().replace(/\s+/g, '-');
      await page.screenshot({ 
        path: `ui-reports/${browserName}-${safeName}.png`,
        fullPage: true 
      });
    });
  }
});

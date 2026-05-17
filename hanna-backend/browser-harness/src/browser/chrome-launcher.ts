import { chromium, type Browser } from 'playwright';
import { config } from '../config.js';
import { logger } from '../audit/logger.js';

// Hardened Chrome flags for isolated, sandboxed automation.
// Disables password manager, sync, autofill, and personal data access.
const CHROME_FLAGS = [
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-password-manager',
  '--disable-save-password-bubble',
  '--password-store=basic',
  '--disable-autofill',
  '--disable-autofill-keyboard-accessory-view',
  '--disable-sync',
  '--disable-signin',
  '--disable-translate',
  '--disable-extensions',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-extensions-with-background-pages',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-hang-monitor',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-speech-api',
  '--no-sandbox',        // required in Docker/CI environments
  '--disable-setuid-sandbox',
  '--use-mock-keychain',
  '--safebrowsing-disable-auto-update',
  '--metrics-recording-only',
];

export async function launchChrome(): Promise<Browser> {
  logger.info({ headless: config.BROWSER_HEADLESS }, 'Launching Chrome');

  const browser = await chromium.launch({
    headless: config.BROWSER_HEADLESS,
    args: CHROME_FLAGS,
    timeout: 30_000,
  });

  logger.info('Chrome launched');
  return browser;
}

export async function isChromeAvailable(): Promise<boolean> {
  try {
    const browser = await launchChrome();
    await browser.close();
    return true;
  } catch {
    return false;
  }
}


import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  reporter: [['list']],
  use: { baseURL: 'http://localhost:3000' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'cd demo-fullstack && npm start', url: 'http://localhost:3000/api/health', reuseExistingServer: !process.env.CI, timeout: 15000 },
});

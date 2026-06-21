import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  outputDir: 'e2e/__screenshots__',
  // CI では HTML レポートを playwright-report/ に出力し、失敗時に artifact として
  // 回収できるようにする(ローカルは list のみ)。HTML は自動で開かない。
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['list']]
    : [['list']],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  use: {
    baseURL: 'http://localhost:4173',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})

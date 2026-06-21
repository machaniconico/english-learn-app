import { expect, test, type ConsoleMessage } from '@playwright/test'
import path from 'node:path'

type ThemeMode = 'light' | 'dark'

const routes = [
  '/',
  '/dictionary',
  '/search',
  '/toeic-practice',
  '/reading-practice',
  '/progress',
  '/srs',
  '/decks',
  '/bookmarks',
  '/weekly-report',
  '/study-guide',
  '/score',
  '/analytics',
  '/level-test',
  '/achievements',
]

const modes: ThemeMode[] = ['light', 'dark']

function routeSlug(route: string) {
  return route === '/' ? 'home' : route.replace(/^\/+/, '').replace(/[^a-z0-9-]+/gi, '-')
}

function isBenignConsoleMessage(message: ConsoleMessage) {
  const text = message.text().toLowerCase()
  const url = message.location().url.toLowerCase()
  return text.includes('favicon') || url.includes('favicon')
}

for (const route of routes) {
  for (const mode of modes) {
    test(`${route} renders without console errors in ${mode} mode`, async ({ page }) => {
      const consoleErrors: string[] = []
      const pageErrors: string[] = []

      await page.addInitScript((themeMode: ThemeMode) => {
        window.localStorage.setItem('english-learn-theme', themeMode)
      }, mode)

      page.on('console', (message) => {
        if (message.type() === 'error' && !isBenignConsoleMessage(message)) {
          consoleErrors.push(message.text())
        }
      })

      page.on('pageerror', (error) => {
        pageErrors.push(error.stack || error.message)
      })

      await page.goto(route, { waitUntil: 'domcontentloaded' })
      await page.waitForLoadState('networkidle')

      const landmarkOrHeading = page.locator('main, [role="main"], h1, h2, h3').first()
      await expect(landmarkOrHeading).toBeVisible()

      await expect(page.locator('html')).toHaveClass(mode === 'dark' ? /(^|\s)dark(\s|$)/ : /^(?!.*(?:^|\s)dark(?:\s|$)).*$/)
      await expect(page.locator('body')).not.toHaveText(/^\s*$/)

      const messages = [
        ...consoleErrors.map((message) => `console.error: ${message}`),
        ...pageErrors.map((message) => `pageerror: ${message}`),
      ]

      expect(messages, `Unexpected browser errors on ${route} in ${mode} mode:\n${messages.join('\n')}`).toEqual([])

      await page.screenshot({
        path: path.join('e2e', '__screenshots__', `${routeSlug(route)}-${mode}.png`),
        fullPage: true,
      })
    })
  }
}

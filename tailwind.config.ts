import type { Config } from 'tailwindcss'

/**
 * @fileoverview Tailwind CSS v4 configuration file.
 * @description Extends the default Tailwind theme with custom colors, fonts, and other design tokens
 *              based on the B2B portal's design system.
 */
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}

export default config


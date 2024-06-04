import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'spurple': 'color(display-p3 0.1889 0.0624 0.4576)',
        'durple': 'color(display-p3 0.37 0.1073 0.6327)',
      },
    },
  },
  plugins: [],
};
export default config;

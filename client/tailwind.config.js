/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],

  daisyui: {
		themes: [
			{
				"soviet-light": {
					"primary": "#CC0000",
					"primary-content": "#FFFFFF",
					"secondary": "#FFD700",
					"secondary-content": "#000000",
					"accent": "#008000",
					"accent-content": "#FFFFFF",
					"neutral": "#D3D3D3",
					"neutral-content": "#333333",
					"base-100": "#F5F5F5",
					"base-200": "#E0E0E0",
					"base-300": "#CCCCCC",
					"base-content": "#333333",
					"info": "#0066CC",
					"info-content": "#FFFFFF",
					"success": "#008000",
					"success-content": "#FFFFFF",
					"warning": "#FFA500",
					"warning-content": "#000000",
					"error": "#FF0000",
					"error-content": "#FFFFFF",
				},
				"soviet-dark": {
					"primary": "#FF0000",
					"primary-content": "#FFFFFF",
					"secondary": "#FFD700",
					"secondary-content": "#000000",
					"accent": "#32CD32",
					"accent-content": "#000000",
					"neutral": "#4B4B4B",
					"neutral-content": "#E0E0E0",
					"base-100": "#1A1A1A",
					"base-200": "#2A2A2A",
					"base-300": "#3A3A3A",
					"base-content": "#E0E0E0",
					"info": "#4169E1",
					"info-content": "#FFFFFF",
					"success": "#228B22",
					"success-content": "#FFFFFF",
					"warning": "#FFD700",
					"warning-content": "#000000",
					"error": "#DC143C",
					"error-content": "#FFFFFF",
				},
			},
		],
	},
}


/** @type {import('tailwindcss').Config} */
export default {
    // Activăm Dark Mode bazat pe o clasă de CSS
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    olive: '#556B2F',
                    lila: '#967BB6',
                    cream: '#FAF9F6', // Un alb "murdar" foarte relaxant pentru ochi
                },
                dark: {
                    bg: '#121212',
                    card: '#1E1E1E',
                    text: '#E4E4E4'
                }
            }
        },
    },
    plugins: [],
}
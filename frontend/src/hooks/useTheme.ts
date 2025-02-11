// import { useState, useEffect } from 'react';

// export function useTheme() {
//   // Initialize theme based on localStorage or system preference
//   const [theme, setTheme] = useState<'light' | 'dark'>(() => {
//     if (typeof window !== 'undefined') {
//       const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
//       if (savedTheme) return savedTheme;
//       return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
//     }
//     return 'light'; // Default to 'light' in non-browser environments
//   });

//   // Update the <html> class and localStorage whenever theme changes
//   useEffect(() => {
//     if (theme === 'dark') {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//     localStorage.setItem('theme', theme);
//   }, [theme]);

//   // Toggle theme between 'light' and 'dark'
//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
//   };

//   return { theme, toggleTheme };
// }

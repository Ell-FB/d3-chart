# React + Vite + Tailwind CSS

This template provides a setup for React with Vite and Tailwind CSS, featuring Hot Module Replacement (HMR) and ESLint integration.

## Features

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- Hot Module Replacement (HMR)
- ESLint configured

## Tailwind CSS Integration

This project has Tailwind CSS fully integrated. Here's how it was set up:

### 1. Install Tailwind CSS and its dependencies

```bash
npm install -D tailwindcss postcss autoprefixer
```

### 2. Create configuration files

Generate the Tailwind configuration files:

```bash
npx tailwindcss init -p
```

This creates:
- `tailwind.config.js` - Configure Tailwind
- `postcss.config.js` - Configure PostCSS

### 3. Configure Tailwind CSS

Update `tailwind.config.js` to scan your template files:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add custom theme extensions here
    },
  },
  plugins: [],
}
```

### 4. Add Tailwind directives to CSS

Add the Tailwind directives to your main CSS file (`src/index.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom styles here */
```

### 5. Start using Tailwind in your components

Now you can use Tailwind utility classes directly in your JSX:

```jsx
function MyComponent() {
  return (
    <div className="p-4 bg-blue-500 text-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold">Hello Tailwind!</h1>
    </div>
  );
}
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally

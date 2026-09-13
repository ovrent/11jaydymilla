# 🎨 3D Creator Portfolio — Complete Setup, Skills & Blueprint Guide

Yeh complete blueprint document hai jise aap kisi bhi naye project mein directly use kar sakte hain ya kisi bhi AI ko dekar bilkul aisa hi ultra-premium 3D portfolio generate karwa sakte hain.

---

## 1. 📦 Dependencies & Setup (NPM Packages)

Naye project ke folder mein terminal mein ye command run karein:

```bash
# 1. Vite + React + TypeScript initialize karein
npm create vite@latest ./ -- --template react-ts

# 2. Saare core animation aur styling packages install karein
npm install react@^18.3.1 react-dom@^18.3.1 @types/react@^18.3.1 @types/react-dom@^18.3.1 framer-motion lucide-react tailwindcss@^3.4.1 postcss autoprefixer
```

### Purpose of Each Dependency:
| Package | Role in Project |
| :--- | :--- |
| **`framer-motion`** | Scroll tracking (`useScroll`, `useTransform`), character-by-character text reveal, sticky stacking scale animations, entrance transitions (`whileInView`). |
| **`tailwindcss`** | Modern responsive utilities, layout system, dark background management. |
| **`lucide-react`** | Sleek SVG icons (`Mail`, `Copy`, `Check`, `Send`, `X`, `Sparkles`). |
| **`postcss` & `autoprefixer`** | CSS vendor prefixes compile karne ke liye. |
| **`typescript` & `vite`** | Fast hot-reloading dev server aur type-safe components. |

---

## 2. ⚙️ Configuration Files

### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
      },
      colors: {
        darkBg: '#0C0C0C',
        textLight: '#D7E2EA',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
```

### `postcss.config.js`
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### `index.html` (Google Font Kanit 300-900 Setup)
```html
<!doctype html>
<html lang="en" class="bg-[#0C0C0C]">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jack -- 3D Creator</title>
    <!-- Google Fonts: Kanit -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#0C0C0C] text-[#D7E2EA] antialiased">
    <div id="root" class="bg-[#0C0C0C] min-h-screen"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `src/index.css` (Global Styles & Gradient Heading Utility)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  background-color: #0C0C0C;
  font-family: 'Kanit', sans-serif;
}

body {
  background-color: #0C0C0C;
  font-family: 'Kanit', sans-serif;
  color: #D7E2EA;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

#root {
  background-color: #0C0C0C;
  min-height: 100vh;
  width: 100%;
}

/* Metallic Gradient Heading */
.hero-heading {
  background: linear-gradient(180deg, #646973 0%, #BBCCD7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 3. 🧩 Core Custom Components ("Skills / Features")

### 1. `Magnet.tsx` (Mouse-Following Magnetic Effect)
Cursor ko element ke center ke relative track karta hai aur smooth translation apply karta hai:
```tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const minX = rect.left - padding;
    const maxX = rect.right + padding;
    const minY = rect.top - padding;
    const maxY = rect.bottom + padding;

    if (e.clientX >= minX && e.clientX <= maxX && e.clientY >= minY && e.clientY <= maxY) {
      setPosition({ x: (e.clientX - centerX) / strength, y: (e.clientY - centerY) / strength });
      setIsHovered(true);
    } else if (isHovered) {
      setPosition({ x: 0, y: 0 });
      setIsHovered(false);
    }
  }, [padding, strength, isHovered]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={ref}
      className={`inline-block ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
```

---

### 2. `AnimatedText.tsx` (Character Scroll Opacity Reveal)
Text ke har ek akshar (character) ko scroll ke sath 0.2 se 1.0 opacity par animate karta hai:
```tsx
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const Character: React.FC<{ char: string; progress: MotionValue<number>; range: [number, number] }> = ({
  char,
  progress,
  range,
}) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="opacity-0 select-none pointer-events-none">{char}</span>
      <motion.span className="absolute inset-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
};

export const AnimatedText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(' ');
  let charCounter = 0;
  const totalChars = text.length;

  return (
    <p ref={containerRef} className={`relative inline-block leading-relaxed ${className}`}>
      {words.map((word, wordIndex) => {
        const wordChars = word.split('');
        const startIndex = charCounter;
        charCounter += word.length + 1;

        return (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {wordChars.map((char, charIdx) => {
              const globalCharIdx = startIndex + charIdx;
              return (
                <Character
                  key={charIdx}
                  char={char}
                  progress={scrollYProgress}
                  range={[globalCharIdx / totalChars, Math.min(1, (globalCharIdx + 1) / totalChars)]}
                />
              );
            })}
            {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        );
      })}
    </p>
  );
};
```

---

### 3. `ContactButton.tsx` (Vibrant Multi-Stop Pill Button)
```tsx
import React from 'react';

export const ContactButton: React.FC<{ onClick?: () => void; className?: string; label?: string }> = ({
  onClick,
  className = '',
  label = 'Contact Me',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full text-white font-medium uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base ${className}`}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
    >
      <span>{label}</span>
    </button>
  );
};
```

---

### 4. `LiveProjectButton.tsx` (Ghost Pill Button)
```tsx
import React from 'react';

export const LiveProjectButton: React.FC<{ href?: string; onClick?: () => void; label?: string }> = ({
  href,
  onClick,
  label = 'Live Project',
}) => {
  const base = "inline-flex items-center justify-center rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest transition-all duration-200 hover:bg-[#D7E2EA]/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base";
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={base}>{label}</a>
  ) : (
    <button type="button" onClick={onClick} className={base}>{label}</button>
  );
};
```

---

### 5. `FadeIn.tsx` (Smooth Viewport Reveal)
```tsx
import React from 'react';
import { motion } from 'framer-motion';

export const FadeIn: React.FC<{
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  children: React.ReactNode;
  className?: string;
}> = ({ delay = 0, duration = 0.7, x = 0, y = 30, children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, x, y }}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true, margin: '50px', amount: 0 }}
    transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);
```

---

## 4. 📐 Architectural Math & Formulas

### Scroll-Driven Marquee Calculation
Do opposing rows ko page scroll par move karne ka formula:
```typescript
const sectionTop = window.scrollY + sectionRef.current.getBoundingClientRect().top;
const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;

// Row 1 (Right movement):
transform: `translateX(${offset - 200}px)`

// Row 2 (Left movement):
transform: `translateX(${-(offset - 200)}px)`
```

### Sticky-Stacking Cards Formula
Jab user cards ke upar se scroll karta hai to picche wala card subtly shrink (scale down) hota hai:
```typescript
const totalCards = 3;
const targetScale = 1 - (totalCards - 1 - index) * 0.03;
// Card 0: 0.94 scale, Card 1: 0.97 scale, Card 2: 1.0 scale

// Card top offset for sticky stacking:
top: `calc(5rem + ${index * 28}px)`
```

---

## 5. 🚀 Kaise Dusre Project Mein Use Karein:
1. Is file ke **Section 1** ki commands run karein (`npm create vite` + `npm install`).
2. `tailwind.config.js`, `postcss.config.js`, `index.html`, aur `src/index.css` copy-paste karein.
3. `src/components/` folder mein upar diye gaye 5 components save karein.
4. Apne according text aur images badalkar deploy kar dein!

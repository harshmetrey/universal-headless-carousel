# universal-headless-carousel 🎠

[![npm version](https://img.shields.io/npm/v/universal-headless-carousel.svg)](https://www.npmjs.com/package/universal-headless-carousel)
[![CI/CD Publish Pipeline](https://github.com/harshmetrey/universal-headless-carousel/actions/workflows/publish.yml/badge.svg)](https://github.com/harshmetrey/universal-headless-carousel/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A cross-platform (React & React Native) carousel package offering **ready-to-use drop-in UI components** AND **headless hooks**.

Built with TypeScript, CSS Scroll Snap, and native `FlatList` physics. Features custom arrows, custom pagination dots, custom card dimensions (`cardWidth` / `cardHeight`), 100% style customization, and production-grade accessibility (A11y).

---

## 🎨 Visual Previews

### 🌐 Web Carousel (CSS Scroll Snap Engine)
![Web Carousel Preview](https://raw.githubusercontent.com/harshmetrey/universal-headless-carousel/main/docs/images/web-carousel-v2.jpg)

### 📱 React Native Carousel (`FlatList` Engine)
<img src="https://raw.githubusercontent.com/harshmetrey/universal-headless-carousel/main/docs/images/native-carousel-v2.jpg" width="400" alt="React Native Carousel Preview" />

---

## 📦 Packages

| Package | Version | Description |
| :--- | :--- | :--- |
| [`universal-headless-carousel-core`](./packages/core) | `1.1.1` | Framework-agnostic state machine & math engine |
| [`universal-headless-carousel-web`](./packages/web) | `1.1.1` | Web engine & `<Carousel />` drop-in component |
| [`universal-headless-carousel-native`](./packages/native) | `1.1.1` | React Native engine & `<NativeCarousel />` drop-in component |

---

## 🚀 Installation

```bash
# npm
npm install universal-headless-carousel

# pnpm
pnpm add universal-headless-carousel
```

---

## 💡 Quick Start

### 🌐 1. Web Drop-in Component (`<Carousel />`)

Zero boilerplate! Pass `items`, custom card dimensions (`cardWidth`, `cardHeight`), custom arrow icons (`prevArrow`, `nextArrow`), or custom pagination dots (`customDot`):

```tsx
import React from 'react';
import { Carousel } from 'universal-headless-carousel/web';

export function WebCarouselDemo() {
  return (
    <Carousel
      cardWidth={320}
      cardHeight={200}
      items={[
        <div key="1" style={{ padding: 20, background: '#3b82f6', color: '#fff', borderRadius: 12 }}>Product Card 1</div>,
        <div key="2" style={{ padding: 20, background: '#10b981', color: '#fff', borderRadius: 12 }}>Product Card 2</div>,
        <div key="3" style={{ padding: 20, background: '#8b5cf6', color: '#fff', borderRadius: 12 }}>Product Card 3</div>
      ]}
      loop
      autoplay={3000}
      showArrows
      prevArrow={<span>◀ Prev</span>}
      nextArrow={<span>Next ▶</span>}
      showDots
      customDot={(index, isActive) => (
        <span style={{ color: isActive ? '#3b82f6' : '#cbd5e1', fontSize: 18 }}>
          {isActive ? '●' : '○'}
        </span>
      )}
    />
  );
}
```

---

### 📱 2. React Native Drop-in Component (`<NativeCarousel />`)

Zero `FlatList` boilerplate required!

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { NativeCarousel } from 'universal-headless-carousel/native';

export function NativeCarouselDemo() {
  return (
    <NativeCarousel
      cardWidth={300}
      cardHeight={180}
      items={[
        <View key="1" style={{ height: 180, backgroundColor: '#3b82f6', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 20 }}>Native Slide 1</Text>
        </View>,
        <View key="2" style={{ height: 180, backgroundColor: '#10b981', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 20 }}>Native Slide 2</Text>
        </View>
      ]}
      loop
      showArrows
      prevArrow={<Text style={{ fontSize: 16, fontWeight: 'bold' }}>◀ Prev</Text>}
      nextArrow={<Text style={{ fontSize: 16, fontWeight: 'bold' }}>Next ▶</Text>}
      showDots
      customDot={(index, isActive) => (
        <Text style={{ color: isActive ? '#3b82f6' : '#cbd5e1', fontSize: 16, marginHorizontal: 4 }}>
          {isActive ? '★' : '☆'}
        </Text>
      )}
    />
  );
}
```

---

### 🛠 3. Headless Web Hook (`useWebCarousel`)

For low-level DOM control:

```tsx
import React from 'react';
import { useWebCarousel } from 'universal-headless-carousel/web';

const items = ['Slide 1', 'Slide 2', 'Slide 3'];

export function HeadlessWebCarousel() {
  const { activeIndex, next, prev, getContainerProps, getItemProps } = useWebCarousel({
    itemsCount: items.length,
    loop: true,
    autoplay: 3000
  });

  return (
    <div>
      <div {...getContainerProps()}>
        {items.map((item, i) => (
          <div key={i} {...getItemProps(i)}>
            {item} (Active: {i === activeIndex ? 'Yes' : 'No'})
          </div>
        ))}
      </div>
      <button onClick={prev}>Prev</button>
      <button onClick={next}>Next</button>
    </div>
  );
}
```

---

## ⚙️ Component API Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `ReactNode[]` | `[]` | Array of slide items to render |
| `cardWidth` | `number \| string` | `-` | Custom width of slide card (e.g. `300`, `'80%'`, `'300px'`) |
| `cardHeight` | `number \| string` | `-` | Custom height of slide card (e.g. `200`, `'200px'`) |
| `showArrows` | `boolean` | `true` | Show or hide Prev/Next navigation arrows |
| `prevArrow` | `ReactNode \| ((props) => ReactNode)` | `undefined` | Custom previous arrow icon or render function |
| `nextArrow` | `ReactNode \| ((props) => ReactNode)` | `undefined` | Custom next arrow icon or render function |
| `showDots` | `boolean` | `true` | Show or hide pagination dots indicator |
| `customDot` | `(index, isActive) => ReactNode` | `undefined` | Custom render function for pagination dots |
| `loop` | `boolean` | `false` | Enable infinite looping navigation |
| `autoplay` | `number \| boolean` | `0` | Autoplay interval in milliseconds (e.g. `3000`) |
| `startIndex` | `number` | `0` | Initial active slide index |
| `snapAlign` | `'start' \| 'center' \| 'end'` | `'center'` | Web scroll snap alignment mode |
| `cardStyle` | `CSSProperties` / `ViewStyle` | `undefined` | Custom slide container inline styles |
| `style` / `containerStyle` | `CSSProperties` / `ViewStyle` | `undefined` | Custom root container inline styles |

---

## ♿️ Accessibility (A11y)

Both Web and React Native components auto-inject compliant WAI-ARIA Attributes:
- **Container**: `role="region"`, `aria-roledescription="carousel"`, `aria-label="Carousel"`.
- **Keyboard Navigation**:
  - `ArrowLeft`: Navigate to previous slide.
  - `ArrowRight`: Navigate to next slide.
  - `Home`: Navigate to first slide.
  - `End`: Navigate to last slide.
- **Auto-Pause on Hover**: Pauses autoplay on `mouseenter` and resumes on `mouseleave`.
- **Items**: `role="group"`, `aria-roledescription="slide"`, `aria-label="Slide X of Y"`, `aria-hidden={!isActive}`.

---

## 🛠 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.

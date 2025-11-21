# DESI Beats Café - Design Guidelines

## Design Approach
**Reference-Based Design** inspired by KFC Pakistan and Domino's Pakistan food ordering platforms, combining their proven UX patterns with DESI Beats Café's distinctive gold-and-black brand identity.

## Core Design Principles
1. **Appetite Appeal First**: Large, vibrant food photography dominates all menu displays
2. **Friction-Free Ordering**: Minimize clicks between browsing and checkout
3. **Visual Hierarchy**: Price and "Add to Cart" buttons command immediate attention
4. **Mobile-Optimized**: Touch-friendly buttons (minimum 48px tap targets)

---

## Typography System

**Font Family**: Poppins (primary), with Roboto fallback
- **Hero Headlines**: 48-56px, Bold (700), tight line-height (1.1)
- **Section Headers**: 32-40px, SemiBold (600)
- **Product Names**: 20-24px, Medium (500)
- **Prices**: 24-28px, Bold (700) - highly prominent
- **Body Text**: 15-16px, Regular (400)
- **Buttons**: 16-18px, SemiBold (600), uppercase

---

## Spacing System
**Tailwind Units**: Use 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- **Section Padding**: py-16 to py-24 (desktop), py-12 (mobile)
- **Card Spacing**: p-6 for product cards
- **Button Padding**: px-8 py-4 for primary CTAs
- **Grid Gaps**: gap-6 for product grids, gap-4 for smaller elements

---

## Layout Architecture

### Header (Sticky)
- Logo (left) + Delivery/Pickup Toggle (center) + Location Selector + Cart Icon with Counter (right)
- Height: 80px desktop, 64px mobile
- Transparent overlay on hero, solid background on scroll

### Hero Section
- Full-width carousel (3-4 slides) showcasing promotional deals
- Height: 500-600px desktop, 400px mobile
- Overlay: Semi-transparent gradient (black to transparent) for text readability
- CTAs: Large buttons with backdrop blur effect (backdrop-blur-md)

### Category Navigation
- Horizontal scrolling carousel with 8-10 category cards
- Card size: 180x180px with rounded corners (rounded-2xl)
- Category image + name overlay at bottom
- Smooth scroll behavior with subtle shadow on active category

### Menu Grid
- 3-column grid (desktop), 2-column (tablet), 1-column (mobile)
- Product cards with 4:3 aspect ratio food images
- Hover effect: Subtle scale (scale-105) and shadow elevation

### Product Card Structure
```
[Food Image - Full width, rounded-t-2xl]
[Product Name - Bold, 20px]
[Short Description - 14px, text-gray-600]
[Price - 24px, Bold] + [Add to Cart Button - Right aligned]
```

### Shopping Cart (Slide-out Panel)
- Fixed right sidebar (400px wide desktop, full-width mobile)
- Item rows with thumbnail + name + quantity controls + price
- Sticky checkout button at bottom
- Backdrop overlay when open

---

## Component Library

### Primary CTA Button
- Background: Bold yellow (#F6B21A) with subtle gold gradient
- Text: Deep black (#000000)
- Border radius: rounded-xl
- Shadow: Elevated (shadow-lg)
- States: Scale on hover, slight darken on active

### Secondary Button (Delivery/Pickup Toggle)
- Active: Warm gold (#E6B769) background
- Inactive: Transparent with gold border
- Border radius: rounded-lg
- Icon + Text layout

### Product Card
- Background: White with rounded-2xl corners
- Border: 1px solid with subtle shadow
- Image: Full-bleed with rounded top corners
- Padding: p-5 for content area

### Category Card
- Aspect ratio: 1:1 square
- Image: Full coverage with overlay gradient
- Text: Positioned at bottom with backdrop blur
- Border: 2px solid transparent, gold on hover

### Input Fields
- Border: 1px solid with rounded-lg
- Padding: px-4 py-3
- Focus state: Gold border (#E6B769) with subtle glow
- Font size: 15px

### Price Display
- Color: Red/Maroon (#9C1F1F) for emphasis
- Prefix: "Rs" in slightly smaller size
- Bold weight throughout

---

## Images Strategy

### Required Images:
1. **Hero Slider (3-4 images)**
   - Full-width promotional banners featuring combo deals
   - Example: "Family Feast Deal" with platter arrangement
   - Dimensions: 1920x600px minimum

2. **Category Thumbnails (10-15 images)**
   - Square format showcasing category (e.g., Burgers, BBQ, Karahi)
   - Dimensions: 400x400px

3. **Product Images (50+ items)**
   - Individual menu items on clean background
   - Consistent lighting and styling
   - Dimensions: 800x600px (4:3 ratio)

4. **Logo Integration**
   - DESI Beats Café logo in header (transparent background)
   - Dimensions: 180x60px

5. **Empty State Illustrations**
   - Empty cart illustration
   - No items found illustration

---

## Navigation & Interaction

### Sticky Category Filter
- Horizontal tabs below header when scrolling menu
- Auto-highlight active category in viewport
- Smooth scroll-to-section on click

### Cart Interactions
- Add to Cart: Brief success animation (checkmark) on button
- Quantity Controls: +/- buttons with number input
- Real-time price calculation
- Slide-in animation from right

### Mobile Considerations
- Bottom navigation bar with: Home, Menu, Cart, Account
- Collapsible filters/categories
- Swipe gestures for carousel navigation
- Large tap targets (minimum 48x48px)

---

## Accessibility
- Maintain WCAG AA contrast ratios (use white text on red/gold backgrounds)
- Focus states: 2px gold outline on interactive elements
- Alt text for all food images describing the dish
- Keyboard navigation support for cart and checkout

---

## Animations
**Use sparingly and purposefully:**
- Hero slider: 5-second auto-advance with fade transition
- Product card hover: Gentle scale (duration-300)
- Cart slide-in: transform translate with ease-out
- Loading states: Subtle skeleton screens for product grids

This design system creates an appetizing, efficient food ordering experience that balances DESI Beats Café's bold brand identity with proven UX patterns from industry leaders.
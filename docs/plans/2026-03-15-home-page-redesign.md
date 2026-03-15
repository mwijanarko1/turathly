# Design Document: Turathly Home Page Redesign

**Topic:** Home Page Redesign (Scholarly Workbench)  
**Date:** 2026-03-15  
**Status:** Approved & Implemented

## 1. Goal
Redesign the Turathly landing page to project a "pro-tool" aesthetic while maintaining the brand's scholarly and academic identity. The layout is inspired by Cursor's landing page but tailored for Islamic text translation.

## 2. Approach
**Approach 1: The Scholarly Workbench**
- Centered, high-impact hero section.
- 3-column app mockup (Scholarly Workbench) showing the source PDF, extracted Arabic text, and AI-assisted translation.
- High-quality, alternating feature sections with UI snippets and scholarly descriptions.
- Use of the brand's light palette (Primary: #5A4B81, Secondary: #9A90C2, Background: #F6F5FB, Accent: #E85D75).

## 3. Architecture & Components

### Layout Structure
- **Navbar**: Sticky, minimal glassmorphism top bar.
- **Hero**: 
  - Centered typography using **Fraunces Bold**.
  - Interactive-style 3-column app mockup with glass effects and subtle animations.
  - Grid-pattern background.
- **Feature Section**: 
  - Alternating layout (Text vs. UI Snippet).
  - Use of icons (Lucide) and custom-styled mockup cards for features like OCR and scholarly translation.
- **Trust/Secondary Features**: Three-column grid for utility features (Lexicon, History, Languages).
- **Footer**: Detailed, multi-column footer for a professional feel.

### Design Elements
- **Typography**: 
  - Headings: Fraunces (Editorial Serif)
  - UI/Body: Source Sans 3 (Clean Sans)
  - Arabic: Noto Naskh Arabic
- **Visual Effects**: 
  - Grid background utility.
  - Glassmorphism effects.
  - Subtle entrance animations (fade-in, slide-in).

## 4. Implementation Details
- Updated `src/app/globals.css` with new utilities.
- Refactored `src/components/marketing/Navbar.tsx`, `Hero.tsx`, `FeatureSection.tsx`, and `Footer.tsx`.
- Ensured responsive design for mobile and tablet views.
- Applied the brand's specific color codes for all interactive elements.

## 5. Success Criteria
- The landing page effectively communicates the "pro-tool" power to potential scholarly users.
- Clear and intuitive presentation of the core value proposition (OCR + Context-aware translation).
- Maintains high performance and accessibility standards.

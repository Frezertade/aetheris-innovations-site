---
version: alpha
name: Aetheris Vercel Precision
description: "Vercel-inspired infrastructure minimalism translated into Aetheris colors: white canvas, Geist typography, shadow-border surfaces, vermilion conversion accents, and responsive-first revenue pages."
colors:
  primary: "#171717"
  secondary: "#4D4D4D"
  tertiary: "#E8471C"
  neutral: "#FFFFFF"
  surface: "#FAFAFA"
  line: "#EBEBEB"
  focus: "#0A72EF"
  success: "#0B6E30"
typography:
  display-xl:
    fontFamily: Geist
    fontSize: 4.75rem
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.055em"
  display-md:
    fontFamily: Geist
    fontSize: 3rem
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.045em"
  heading-sm:
    fontFamily: Geist
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.03em"
  body-lg:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Geist Mono
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.04em"
rounded:
  xs: 6px
  sm: 8px
  md: 12px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.xs}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "#B93816"
    textColor: "#FFFFFF"
    rounded: "{rounded.xs}"
    padding: 12px
  button-secondary:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xs}"
    padding: 12px
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 24px
  surface-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.sm}"
    padding: 24px
  divider:
    backgroundColor: "{colors.line}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xs}"
    padding: 4px
  badge:
    backgroundColor: "#FDEDE8"
    textColor: "#B93816"
    rounded: "{rounded.pill}"
    padding: 8px
  accent-label:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: 8px
  success-badge:
    backgroundColor: "#EAF7EE"
    textColor: "{colors.success}"
    rounded: "{rounded.pill}"
    padding: 8px
  focus-ring:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.focus}"
    rounded: "{rounded.xs}"
    padding: 8px
---

## Overview

Aetheris should now feel like a revenue-systems infrastructure company: calm, precise, technical, and trustworthy. The reference posture is Vercel — not copied visually, but translated through Aetheris. The site should be mostly white with restrained near-black text, exact spacing, small amounts of warm vermilion for conversion moments, and surfaces built with shadow-as-border rather than heavy outlines or decorative gradients.

The goal is to remove the previous over-designed editorial treatment and replace it with product-grade clarity: every page should scan quickly on mobile, tablet, and desktop; every CTA should have a clear hit target; generated pages and blog posts should feel like the same system as the homepage.

## Colors

- **Primary (#171717):** Vercel-style near-black for headings, navigation, dark CTAs, and high-emphasis text.
- **Secondary (#4D4D4D):** body and explanatory copy. Avoid low-contrast beige text.
- **Tertiary (#E8471C):** Aetheris vermilion. Use only for conversion accents, active states, badges, and key highlight words.
- **Neutral (#FFFFFF):** the primary canvas. White space is the design.
- **Surface (#FAFAFA):** subtle section backgrounds, inset panels, and code-like surfaces.
- **Line (#EBEBEB):** Vercel-style ring borders and dividers.
- **Focus (#0A72EF):** accessible keyboard focus ring.
- **Success (#0B6E30):** validation, checks, and positive states.

## Typography

Use Geist Sans everywhere except technical labels, small metadata, and code-like values, which use Geist Mono. Display text is compressed with negative letter-spacing. Body copy is not tiny: minimum readable body size is 16px, and navigation/labels should not fall below 12px. Avoid decorative serif headlines, script styling, excessive uppercase, and crowded mono text.

## Layout

Use Vercel-style restraint: centered containers, 8px grid, wide white space, and 2–3 column grids that collapse cleanly to one column on mobile. Every page must fit within the viewport with no horizontal scrolling at 390px, 768px, or desktop widths. Long blog/code content must wrap or scroll inside its own container, never push the whole page wider.

## Elevation & Depth

Use shadow-as-border: `0 0 0 1px rgba(0,0,0,.08)` for cards and panels. Add only whisper-level elevation for featured surfaces. Avoid heavy glassmorphism, big blur glows, large colored shadows, and decorative blobs.

## Shapes

Buttons use a precise 6px radius like Vercel. Cards use 8–12px. Badges use full pills. Do not use oversized rounded rectangles everywhere. Touch targets must be at least 44px tall on mobile.

## Components

Primary buttons are near-black rectangles with 6px radius and 44px minimum height. Hover may switch to Aetheris vermilion. Secondary buttons are white with shadow-border rings. Cards are white, compact, and grid-aligned. Badges are small but readable, with vermilion-tinted or neutral backgrounds. Navigation is sticky, white, and responsive; mobile should not squeeze the entire desktop nav into one row.

## Do's and Don'ts

Do use white space, Geist, exact alignment, shadow-border cards, and Aetheris vermilion sparingly. Do check mobile first. Do keep every public page tied to the same global system. Do test navigation, forms, tap targets, and console errors.

Don't use decorative serif/script typography, huge cream gradients, glass effects, giant pills for every button, tiny uppercase labels, or elements that cause horizontal overflow. Don't hide broken responsive behavior with `overflow-x: hidden` alone; fix max-width, wrapping, and tap targets.
---
version: alpha
name: Aetheris Triad Command
description: "Premium cinematic AI systems identity using exactly three brand colors: obsidian, platinum, and aurora cyan. No orange, gold, rose, or violet accents."
colors:
  primary: "#F8F4EA"
  secondary: "#5DEBFF"
  neutral: "#050713"
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 5.8rem
    fontWeight: 760
    lineHeight: 0.94
    letterSpacing: "-0.075em"
  display-md:
    fontFamily: Inter
    fontSize: 3.35rem
    fontWeight: 720
    lineHeight: 1
    letterSpacing: "-0.06em"
  heading-sm:
    fontFamily: Inter
    fontSize: 1.6rem
    fontWeight: 680
    lineHeight: 1.15
    letterSpacing: "-0.04em"
  body-lg:
    fontFamily: Inter
    fontSize: 1.15rem
    fontWeight: 400
    lineHeight: 1.72
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.68
  label:
    fontFamily: IBM Plex Mono
    fontSize: 0.76rem
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "0.12em"
rounded:
  xs: 10px
  sm: 16px
  md: 24px
  lg: 34px
  pill: 9999px
spacing:
  xs: 6px
  sm: 12px
  md: 20px
  lg: 40px
  xl: 80px
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.pill}"
    padding: 14px
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.pill}"
    padding: 14px
  button-secondary:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: 14px
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 28px
  badge:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.pill}"
    padding: 8px
  icon:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.pill}"
    padding: 10px
  focus-ring:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.xs}"
    padding: 8px
---

## Overview

Aetheris now uses a strict three-color premium system: **Obsidian** for cinematic depth, **Platinum** for all readable text, and **Aurora Cyan** for interaction, icons, glow, and data emphasis. This removes the rejected orange/gold/rose/violet palette and gives the site a clearer, more expensive AI command-center identity.

## Colors

- **Neutral / Obsidian (#050713):** the only dark canvas and panel family. Use opacity and blur for depth, not extra hues.
- **Primary / Platinum (#F8F4EA):** the only light text color. Use for headings, body text that must remain readable, and secondary button text.
- **Secondary / Aurora Cyan (#5DEBFF):** the only accent. Use for CTAs, icons, active states, borders, focus rings, glows, data highlights, and links.

Do not use orange, gold, rose, violet, amber, red, green, beige brand accents, or multi-hue gradients. If emphasis is needed, use Aurora Cyan with opacity, scale, shadow, border, or motion.

## Typography

Use Inter as the primary typeface for a premium modern product feel. Display typography is tight, large, and cinematic with negative letter spacing. Technical labels and data use IBM Plex Mono. Avoid tiny nav text and low-contrast microcopy.

## Layout

Use full-bleed dark cinematic sections with centered containers. Cards live in a dimensional depth system: obsidian panels, platinum copy, aurora-cyan rim lights, subtle internal highlights, and hover perspective. Mobile collapses to single-column without losing contrast. Every page must be readable at 390px and must not horizontally overflow.

## Elevation & Depth

Depth comes from shadows, opacity, blur, perspective, and cyan light — not additional colors. Use atmospheric cyan radial lighting, animated cyan grids, cyan orbital hero visuals, and hairline cyan borders. Keep motion subtle and never let visual effects obscure copy or icons.

## Shapes

Use premium rounded geometry: 10px controls, 16px compact cards, 24–34px feature panels, pill CTAs. Avoid sharp rectangles and avoid the previous orange pills.

## Components

Primary buttons are cyan-filled pills with obsidian text. Secondary buttons are obsidian panels with platinum text and cyan border. Icons must always sit on cyan or obsidian surfaces with clear contrast. Cards are dimensional command panels with platinum text and cyan highlights. Navigation is dark translucent glass with clear platinum links and a cyan CTA.

## Do's and Don'ts

Do use only three colors: obsidian, platinum, and aurora cyan. Do make every icon visible. Do verify color contrast on live pages. Don't use the rejected orange/white brand. Don't add gold, violet, rose, amber, green, or red accents. Don't let gradients introduce extra brand colors. Don't miss static/blog/solution pages.
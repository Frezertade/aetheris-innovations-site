---
version: alpha
name: Aetheris Celestial Command
description: "Premium cinematic AI-systems studio identity: obsidian command-room depth, platinum typography, aurora-cyan intelligence glow, champagne-gold trust accents, and layered 3D motion."
colors:
  primary: "#F8F4EA"
  secondary: "#AAB6C8"
  tertiary: "#5DEBFF"
  neutral: "#050713"
  surface: "#0B1020"
  line: "#26314A"
  focus: "#B9F6FF"
  success: "#41F2B1"
  gold: "#D7B56D"
  violet: "#8A6CFF"
  rose: "#FF5FA2"
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 5.8rem
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.075em"
  display-md:
    fontFamily: Inter
    fontSize: 3.35rem
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "-0.06em"
  heading-sm:
    fontFamily: Inter
    fontSize: 1.6rem
    fontWeight: 650
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
    fontSize: 0.74rem
    fontWeight: 600
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
    backgroundColor: "{colors.tertiary}"
    textColor: "#03101A"
    rounded: "{rounded.pill}"
    padding: 14px
  button-primary-hover:
    backgroundColor: "{colors.gold}"
    textColor: "#050713"
    rounded: "{rounded.pill}"
    padding: 14px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: 14px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 28px
  surface-card:
    backgroundColor: "#11182C"
    textColor: "{colors.secondary}"
    rounded: "{rounded.md}"
    padding: 28px
  divider:
    backgroundColor: "{colors.line}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xs}"
    padding: 4px
  badge:
    backgroundColor: "#102A3A"
    textColor: "{colors.tertiary}"
    rounded: "{rounded.pill}"
    padding: 8px
  success-badge:
    backgroundColor: "#0A2A22"
    textColor: "{colors.success}"
    rounded: "{rounded.pill}"
    padding: 8px
  focus-ring:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.focus}"
    rounded: "{rounded.xs}"
    padding: 8px
  aurora-chip:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.pill}"
    padding: 8px
  rose-signal:
    backgroundColor: "{colors.rose}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.pill}"
    padding: 8px
---

## Overview

Aetheris is no longer a plain Vercel-style website and no longer an orange local-agency brand. The new posture is **premium AI command center**: cinematic, high-trust, intelligent, and memorable. Think Apple restraint, Stripe depth, Runway cinematic darkness, and BMW precision — translated into an original Aetheris identity.

The page should feel expensive without feeling fake. It should look like a serious AI revenue-systems company that can build infrastructure, automation, and custom software for real businesses. Visual energy comes from layered depth, dimensional cards, aurora lighting, subtle 3D motion, and platinum/cyan/gold contrast — not from generic SaaS gradients or random icons.

## Colors

- **Neutral / Obsidian (#050713):** the main canvas. This gives the site cinematic depth and immediately separates it from template-looking service sites.
- **Surface (#0B1020):** elevated command-room panels, cards, forms, and nav.
- **Primary / Platinum (#F8F4EA):** hero text, high-emphasis copy, and premium contrast on dark surfaces.
- **Secondary / Lunar Slate (#AAB6C8):** body text and secondary explanations.
- **Tertiary / Aurora Cyan (#5DEBFF):** primary interaction color and AI glow. Use for CTAs, active states, lines, and key data highlights.
- **Gold (#D7B56D):** trust, premium craft, founder/enterprise credibility. Use sparingly.
- **Violet (#8A6CFF) and Rose (#FF5FA2):** dimensional light accents inside gradients, never large flat brand blocks.

## Typography

Use Inter as the primary typeface for a premium modern product feel. Display typography is tight, large, and cinematic with negative letter spacing. Technical labels and data use IBM Plex Mono. Avoid decorative serif treatments. Avoid tiny nav text. The homepage hero should feel like a product launch, not a blog article.

## Layout

Use full-bleed dark cinematic sections with centered containers. Cards live in a 3D depth system: dark glass panels, hairline cyan/gold borders, soft internal highlights, and hover perspective. Mobile collapses to single-column without losing drama. Every page must be readable at 390px and must not horizontally overflow.

## Elevation & Depth

Depth is the signature. Use:

- atmospheric radial lighting behind sections,
- layered 3D orbital hero visuals,
- `transform: perspective(...) rotateX(...) rotateY(...)` on cards,
- cyan/gold rim-light borders,
- soft multi-color glows with low opacity,
- animated grids and scanlines at near-invisible opacity.

Do not use cheap glassmorphism everywhere. Panels should feel like precision instruments, not frosted plastic.

## Shapes

Use premium rounded geometry: 10px controls, 16px compact cards, 24–34px feature panels, pill CTAs. Avoid sharp Vercel rectangles and avoid the previous orange pills.

## Components

Primary buttons are cyan-on-obsidian or cyan-filled pills with luminous hover. Secondary buttons are dark translucent panels with platinum text and cyan border. Cards are dimensional command panels with subtle tilt and glow. Navigation is dark translucent glass with clear links and premium CTA. Forms are dark, legible, and high contrast.

## Do's and Don'ts

Do surprise: cinematic dark mode, aurora light, premium 3D motion, strong contrast, highly polished cards, and memorable hero visuals. Do keep content readable and business-serious. Do verify build CSS order and production visuals.

Don't use the rejected orange/white brand. Don't produce generic SaaS cards. Don't use fake metrics or random dashboards. Don't let animation block performance or readability. Don't miss static/blog/solution pages.
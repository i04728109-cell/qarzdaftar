# QarzDaftar themes (Asosiy / Yorqin)

- Theme key: `dark` or `bright`, stored in cookie `qd-theme` and localStorage `qd-theme`.
- CSS variables are RGB channel values so Tailwind alpha modifiers work.
- To add a theme, add a theme option and CSS variable block in `src/app/themes.css`, then map its ID in `src/components/SiteStyleSwitcher.tsx`.
- Existing database installs: run `supabase/migrations/0006_theme.sql` in Supabase SQL Editor.
- Fresh installs: use updated `supabase/ALL_IN_ONE.sql`.

## Bright-theme WCAG AA contrast checks
Ratios calculated against white (#FFFFFF), WCAG AA text threshold 4.5:1.

| Color role | Hex | Contrast | AA |
|---|---|---:|---|
| Main text | #0B1410 | 18.72:1 | Pass |
| Secondary text | #3F4B45 | 9.12:1 | Pass |
| Accent button | #047857 | 5.48:1 | Pass |
| Red | #B91C1C | 6.47:1 | Pass |
| Warning | #92400E | 7.09:1 | Pass |
| Border | #1F2937 | 14.68:1 | Pass |

Contrast check is against white; verify actual component backgrounds and icon/large-text usage before release.

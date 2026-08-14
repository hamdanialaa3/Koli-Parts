# Koli One Visual Audit — Source of Truth for Koli Parts

Repository inspected: `hamdanialaa3/koli-one` (`main`)

## Verified typography

`src/index.css` uses:
- Body: `Inter, system-ui, -apple-system, sans-serif`
- H1–H6: `Exo 2, Inter, system-ui, -apple-system, sans-serif`

`src/styles/typography.ts` confirms the same intended family split and defines responsive sizes.

## Verified semantic colors

### Light
- background `#F7FBFA`
- surface `#FFFFFF`
- surface low `#EFF7F5`
- surface container `#E7F3F0`
- surface high `#D9ECE8`
- primary `#0F766E`
- primary container `#B8F0E6`
- secondary `#0E5E55`
- secondary container `#C6E9EC`
- tertiary `#1A237E`
- text primary `#0F1720`
- text secondary `#334155`
- text muted `#64748B`
- success `#006C4A`
- warning `#9B4500`
- error `#BA1A1A`
- info `#0053DB`
- brand LED `#1DE6CB`
- brand glow `#2BD9C2`
- brand edge `#0AA89A`

### Dark
- background `#0B0F12`
- surface low `#0F1720`
- surface container `#111C27`
- surface high `#172231`
- primary `#1DE6CB`
- primary container `#005047`
- secondary `#7CF0E0`
- tertiary `#A5B4FC`
- text primary `#E6EEF8`
- text secondary `#CBD5E1`
- text muted `#94A3B8`
- success `#85D7AF`
- warning `#FFB68E`
- error `#FFB4AB`
- info `#B4C5FF`

## Verified generated theme geometry/motion

`theme-vars.css`:
- radius: 0, 6, 10, 16, full
- motion: 120ms, 200ms, 320ms
- spring: damping 18 / stiffness 220 / mass 1

## Verified spacing/breakpoints from `src/styles/design-system.ts`

Spacing: 4, 8, 12, 16, 20, 24, 32, 40px; touch 44/48/56px.

Breakpoints: 375, 414, 768, 1024, 1280, 1920px. Header constant: 85px.

## Known source drift

Legacy `design-system.ts` also defines radius 4/8/12/16/20 and motion 200/300/400ms. Because `theme-vars.css` is generated and imported into the actual CSS entry, Koli Parts new components use semantic/generated radii and motion. Legacy Koli One components may still differ until Koli One is migrated.

## Rule

No new Koli Parts hard-coded palette. Use `packages/design-system/src/tokens.css` semantic variables.

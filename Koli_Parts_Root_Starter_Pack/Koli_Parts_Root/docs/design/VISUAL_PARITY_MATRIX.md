# Visual Parity Matrix

| Element | Koli One source | Koli Parts approach | Classification |
|---|---|---|---|
| semantic colors | `theme-vars.css` | copy semantic roles | EXACT REUSE |
| body font | `src/index.css` | Inter | EXACT REUSE |
| heading font | `src/index.css` | Exo 2 | EXACT REUSE |
| spacing | `src/styles/design-system.ts` | same scale | EXACT REUSE |
| generated radius/motion | `theme-vars.css` | same semantic scale | EXACT REUSE |
| button/input visual DNA | Koli One UI components/theme | reuse/port variants | REUSE WITH VARIANT |
| header/nav mental model | Koli One | preserve ecosystem identity | REUSE WITH VARIANT |
| ProductCard | car cards as pattern reference | parts-specific fields | KOLI PARTS NEW |
| FitmentStatus | none equivalent | new semantic status component | KOLI PARTS NEW |
| VIN/OEM search | vehicle search patterns | parts-focused selector | KOLI PARTS NEW |
| Procurement admin | operations-specific | dense admin component | KOLI PARTS NEW |

Goal: **100% design-system parity, not identical page layouts.**

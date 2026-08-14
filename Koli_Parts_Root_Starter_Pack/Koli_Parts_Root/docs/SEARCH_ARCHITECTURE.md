# Search Architecture

## MVP decision

**PROPOSED:** Meilisearch for fast typo-tolerant search/facets, with Postgres as source of truth. Keep a provider interface so the engine can be replaced.

Why:
- simple operations for MVP,
- fast full-text/facets,
- good developer velocity,
- suitable for BG/EN/DE normalized terms when synonyms and normalized attributes are curated.

Do not add vector search until search logs show semantic retrieval improves a measured failure mode.

## Indexed document

- canonical product ID,
- title BG/EN + source title,
- brand/manufacturer,
- category,
- OEM/MPN/GTIN,
- normalized aliases BG/EN/DE,
- condition availability summary,
- price range,
- vehicle/fitment facets where tractable.

Vehicle-specific compatibility should be post-filtered/ranked by Fitment Engine rather than exploding the search index with every VIN.

## Query flow

`query → normalize/transliterate → detect OEM/identifier → retrieve → vehicle-aware rerank/filter → pricing/availability refresh on product/checkout`

## Rebuildability

Search index can be fully rebuilt from Postgres and current supplier sync state. Never store business-only state exclusively in search.

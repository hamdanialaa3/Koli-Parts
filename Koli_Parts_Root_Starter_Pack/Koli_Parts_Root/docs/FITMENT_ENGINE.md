# Fitment Engine

## Purpose

Reduce wrong-part purchases by presenting compatibility evidence transparently.

## Evidence ranking

1. TecDoc structured vehicle/article relation.
2. Exact OEM reference + exact vehicle/engine mapping.
3. Supplier/eBay structured compatibility.
4. Listing attributes/title.
5. AI extraction/inference.

A lower-tier source cannot override a contradictory higher-tier source without manual review and audit.

## Score model

MVP stores a rule score `0..100`, but UI must call it a **confidence score/tier**, not a statistically calibrated probability.

Suggested evidence weights are configuration, not immutable truth. Calibrate using actual confirmed-fit and return data.

## Output

```json
{
  "status": "HIGH_CONFIDENCE",
  "score": 92,
  "calibratedProbability": null,
  "evidence": [
    {"type":"OEM_EXACT","source":"TECDOC","weight":40},
    {"type":"ENGINE_CODE","source":"VIN","weight":25}
  ],
  "warnings": []
}
```

## Hard rejects

- explicit incompatible vehicle relation,
- conflicting engine/variant where compatibility is variant-specific,
- supplier shipping/procurement route impossible,
- regulated/safety category blocked by policy.

## Fallback

If TecDoc is unavailable, use OEM cross-reference + normalized supplier metadata + vehicle fields, downgrade the tier, and show “verify OEM” instead of claiming confirmed fit.

## Learning loop

Classify return root cause: `FITMENT_ERROR_KOLI`, `FITMENT_ERROR_SUPPLIER`, `CUSTOMER_WRONG_VEHICLE`, `CUSTOMER_IGNORED_WARNING`, `UNKNOWN`.

# Koli Parts UX Architecture

Visual identity is Koli One; task architecture is parts-specific.

## Home
Primary intent: “Find the right part for your car.”

Entry methods:
1. select saved vehicle / VIN,
2. OEM/part number,
3. part-name free text.

Keep active vehicle context persistent throughout search and product pages.

## Search results
Desktop: left/filter rail or compact filter surface + result list/grid. Mobile: filter drawer/sheet. Each card prioritizes: part image/title, brand/OEM, condition, fitment status, price, delivery/supplier evidence.

## Product detail
Order of decision information:
1. identity/images,
2. compatibility status + why,
3. price/availability/delivery,
4. CTA,
5. OEM/specifications,
6. seller/source,
7. returns/warranty,
8. related alternatives.

## Checkout
Before commit, show vehicle + fitment status + final quote + delivery route. Unknown fitment requires explicit acknowledgement if policy allows purchase.

## Account
Unified ecosystem concept: account identity from Koli One, with Koli Parts-specific Garage, orders, saved parts and returns.

## Admin
Use same tokens/components with higher information density. Procurement safety/status takes priority over marketing visuals.

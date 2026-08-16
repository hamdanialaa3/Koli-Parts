# Koli One SSO

Status: APPROVED

## Decision
Use Koli One Firebase Authentication as the initial identity source. Koli Parts verifies Firebase ID tokens from project `fire-new-globul` server-side with Firebase Admin SDK, maps the Firebase UID through `external_identities`, and issues its own opaque HttpOnly session cookie.

The initial accepted token contract is:

- issuer: `https://securetoken.google.com/fire-new-globul`
- audience: `fire-new-globul`
- subject: Firebase `uid`
- revocation policy: `verifyIdToken(assertion, true)` where Admin credentials are available
- role mapping: default-deny; do not map upstream custom claims to Koli Parts roles yet

## Consequences
- No Koli Parts password database.
- No cross-domain shared cookie between `koli.one` and `koli-one.com`.
- Koli Parts stores only hashed opaque session tokens.
- State-changing browser requests require a signed double-submit CSRF token bound to the opaque session token.
- Admin/RBAC privileges require explicit Koli Parts roles and later MFA assurance.
- Revisit only with new evidence, provider terms or measured production needs.

## Evidence

- `C:\Users\hamda\Desktop\Koli_One_Root\.firebaserc:3`
- `C:\Users\hamda\Desktop\Koli_One_Root\src\firebase\firebase-config.ts:66-79`
- `C:\Users\hamda\Desktop\Koli_One_Root\src\contexts\AuthProvider.tsx:71-89`
- `C:\Users\hamda\Desktop\Koli_One_Root\functions\src\api\marketplace-api.ts:56-68`
- `C:\Users\hamda\Desktop\Koli_One_Root\functions\src\config\allowed-origins.ts:12-25`

## Approval
Owner/CTO: Approved by User
Date: 2026-08-15

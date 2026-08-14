# Database

Apply the initial migration only to a disposable/local database until the real application entities/repositories are compared against this schema.

```powershell
npm run db:migrate
```

Migration strategy after MVP: one immutable numbered migration per change; do not edit an already-applied production migration.

backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── env.ts
│   │   └── supabase.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── not-found.middleware.ts
│   │
│   ├── modules/
│   │
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.schema.ts
│   │   │   └── auth.types.ts
│   │   │
│   │   ├── apps/
│   │   │   ├── apps.controller.ts
│   │   │   ├── apps.routes.ts
│   │   │   ├── apps.service.ts
│   │   │   └── apps.types.ts
│   │   │
│   │   ├── users/
│   │   │
│   │   ├── emails/
│   │   │
│   │   ├── api-keys/
│   │   │
│   │   ├── events/
│   │   │
│   │   ├── audit-logs/
│   │   │
│   │   └── notifications/
│   │
│   ├── routes/
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── cookies.ts
│   │   └── response.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── tsup.config.ts (opcional)
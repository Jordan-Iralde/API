[Infraestructura]

Implementar sistema de eventos (events):

- Crear tabla events.
- Crear índices:
  - app_id
  - user_id
  - created_at
  - (app_id, event_name)

- Crear módulo events:
  - event.service.ts
  - event.types.ts

- Registrar eventos en:
  - registerUser
  - loginUser
  - envío de emails

Eventos mínimos:
- user_registered
- user_logged_in
- email_sent
- email_failed

Objetivo:
Centralizar métricas y analítica de todos los productos desde una única tabla de eventos.
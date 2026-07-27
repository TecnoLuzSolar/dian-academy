-- Agrega distinción entre usuario de prueba (trial) y usuario pago (premium)
ALTER TABLE "users" ADD COLUMN "isPremium" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "trialSimulacroUsed" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: usuarios con acceso activado manualmente más allá de cualquier trial
-- (accessUntil a más de 8 días de hoy) se consideran premium para no bloquearlos.
UPDATE "users"
SET "isPremium" = true
WHERE "accessUntil" IS NOT NULL
  AND "accessUntil" > NOW() + INTERVAL '8 days';

-- Los admins siempre premium
UPDATE "users" SET "isPremium" = true WHERE "role" = 'ADMIN';

-- Agregar columna accessUntil para la prueba gratis de 7 días
ALTER TABLE "users" ADD COLUMN "accessUntil" TIMESTAMP(3);

-- Backfill: dar 7 días a los usuarios existentes para que no pierdan acceso de golpe
UPDATE "users" SET "accessUntil" = NOW() + INTERVAL '7 days' WHERE "accessUntil" IS NULL;

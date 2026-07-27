// ─────────────────────────────────────────────────────────────
// Control de acceso: trial vs premium
// - Trial: 5 días, solo módulos gratis + 1 simulacro
// - Premium: acceso completo hasta accessUntil (día del concurso)
// ─────────────────────────────────────────────────────────────

/** Días de prueba gratis al registrarse */
export const TRIAL_DAYS = 5;

/** Módulos accesibles durante la prueba gratis */
export const FREE_MODULE_SLUGS = [
  "comprension-lectora",
  "razonamiento-logico",
];

type AccessUser = {
  role: string;
  isPremium: boolean;
  accessUntil: Date | string | null;
  trialSimulacroUsed: boolean;
};

/** ¿El usuario tiene acceso completo (pago o admin)? */
export function isPremiumUser(user: AccessUser): boolean {
  return user.role === "ADMIN" || user.isPremium === true;
}

/** ¿Puede entrar a este módulo? */
export function canAccessModule(user: AccessUser, slug: string): boolean {
  if (isPremiumUser(user)) return true;
  return FREE_MODULE_SLUGS.includes(slug);
}

/** ¿Puede iniciar un simulacro? (trial: solo 1) */
export function canTakeSimulacro(user: AccessUser): boolean {
  if (isPremiumUser(user)) return true;
  return !user.trialSimulacroUsed;
}

/** ¿El acceso por fecha sigue vigente? (admins nunca expiran) */
export function hasActiveAccess(user: AccessUser): boolean {
  if (user.role === "ADMIN") return true;
  if (!user.accessUntil) return false;
  return new Date() < new Date(user.accessUntil);
}

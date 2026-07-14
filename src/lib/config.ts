import type { User } from '@supabase/supabase-js';

export const SUPER_ADMIN_EMAIL = 'cektopventures@gmail.com';

export const ALLOWED_ADMIN_EMAILS = [
  'cektopventures@gmail.com',
  'cektopv@gmail.com',
  'niyooposh@gmail.com',
];

export function isSuperAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  return ALLOWED_ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email.toLowerCase());
}

export type AdminRole = 'super_admin' | 'admin' | 'none';

export function getAdminRole(user?: User | null): AdminRole {
  if (!user) return 'none';

  const role = user.app_metadata?.role;
  if (role === 'super_admin') return 'super_admin';
  if (role === 'admin') return 'admin';

  const email = user.email;
  if (!email) return 'none';
  const lowerEmail = email.toLowerCase();

  if (lowerEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return 'super_admin';
  }
  if (ALLOWED_ADMIN_EMAILS.map(e => e.toLowerCase()).includes(lowerEmail)) {
    return 'admin';
  }

  return 'none';
}

export function isSuperAdminRole(user?: User | null): boolean {
  return getAdminRole(user) === 'super_admin';
}

export function isAdminRole(user?: User | null): boolean {
  const role = getAdminRole(user);
  return role === 'super_admin' || role === 'admin';
}

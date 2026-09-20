import { json, currentStaff } from '../_lib/auth.js';
export async function onRequestGet({ request, env }) { const staff = await currentStaff(request, env); return staff ? json({ staff }) : json({ error: 'Autenticación requerida' }, 401); }

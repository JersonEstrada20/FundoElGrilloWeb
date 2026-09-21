import { json, pinHash, sessionCookie } from '../_lib/auth.js';

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(()=>({}));
  if (!body.email || !body.pin) return json({ error: 'Ingresa tu correo y PIN' }, 400);
  const staff = await env.DB.prepare('SELECT id,full_name,email,role,active,pin_hash FROM staff WHERE lower(email)=lower(?)').bind(String(body.email).trim()).first();
  if (!staff || !staff.active || !staff.pin_hash || await pinHash(body.pin) !== staff.pin_hash) return json({ error: 'Correo o PIN incorrecto' }, 401);
  const token = crypto.randomUUID() + crypto.randomUUID();
  await env.DB.prepare("INSERT INTO sessions (token,staff_id,expires_at) VALUES (?,?,datetime('now','+12 hours'))").bind(token,staff.id).run();
  return new Response(JSON.stringify({ ok:true, staff:{ id:staff.id,full_name:staff.full_name,email:staff.email,role:staff.role } }), { headers:{ 'content-type':'application/json; charset=utf-8', 'set-cookie':sessionCookie(token) } });
}

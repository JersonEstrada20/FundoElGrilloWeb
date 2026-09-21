export function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}
export async function currentStaff(request, env) {
  const token = (request.headers.get('cookie') || '').match(/(?:^|;\s*)feg_session=([^;]+)/)?.[1];
  if (!token) return null;
  return env.DB.prepare(`SELECT s.id,s.full_name,s.email,s.role,s.active,s.permissions FROM sessions x JOIN staff s ON s.id=x.staff_id WHERE x.token=? AND x.expires_at>datetime('now') AND s.active=1`).bind(token).first();
}
export function manage(staff) { return staff && (staff.role === 'owner' || staff.role === 'admin'); }
export async function pinHash(pin) {
  const data = new TextEncoder().encode(String(pin));
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
export function sessionCookie(token) { return `feg_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200`; }

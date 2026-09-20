export function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}
export async function currentStaff(request, env) {
  const email = request.headers.get('cf-access-authenticated-user-email');
  if (!email) return null;
  return env.DB.prepare('SELECT id, full_name, email, role, active FROM staff WHERE lower(email)=lower(?) AND active=1').bind(email).first();
}
export function manage(staff) { return staff && (staff.role === 'owner' || staff.role === 'admin'); }

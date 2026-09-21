export async function onRequestPost({ request, env }) {
  const token = (request.headers.get('cookie') || '').match(/(?:^|;\s*)feg_session=([^;]+)/)?.[1];
  if (token) await env.DB.prepare('DELETE FROM sessions WHERE token=?').bind(token).run();
  return new Response(JSON.stringify({ok:true}), {headers:{'content-type':'application/json; charset=utf-8','set-cookie':'feg_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'}});
}

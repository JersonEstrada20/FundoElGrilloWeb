const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });

function identity(request) {
  return request.headers.get("cf-access-authenticated-user-email");
}

async function staffFor(request, env) {
  const email = identity(request);
  if (!email) return null;
  return env.DB.prepare(
    "SELECT id, full_name, email, role, active FROM staff WHERE lower(email) = lower(?) AND active = 1"
  ).bind(email).first();
}

function canManage(staff) {
  return staff && (staff.role === "owner" || staff.role === "admin");
}

async function api(request, env, url) {
  if (url.pathname === "/api/health") return json({ ok: true, service: "fundo-el-grillo" });

  const staff = await staffFor(request, env);
  if (!staff) return json({ error: "Autenticación requerida" }, 401);

  if (url.pathname === "/api/me" && request.method === "GET") {
    return json({ staff });
  }

  if (url.pathname === "/api/visits" && request.method === "GET") {
    const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);
    const result = await env.DB.prepare(`
      SELECT v.id, v.created_at, v.vehicle_plate, v.notes, s.full_name AS registered_by,
        (SELECT count(*) FROM visitors x WHERE x.visit_id = v.id) AS people_count
      FROM visits v JOIN staff s ON s.id = v.registered_by
      ORDER BY v.created_at DESC LIMIT ?
    `).bind(limit).all();
    return json({ visits: result.results });
  }

  if (url.pathname === "/api/visits" && request.method === "POST") {
    const body = await request.json();
    if (!Array.isArray(body.people) || body.people.length < 1) {
      return json({ error: "Debe incluir al menos una persona" }, 400);
    }
    const visitId = crypto.randomUUID();
    const statements = [env.DB.prepare(
      "INSERT INTO visits (id, registered_by, vehicle_plate, notes, signature_data) VALUES (?, ?, ?, ?, ?)"
    ).bind(visitId, staff.id, body.vehicle_plate || null, body.notes || null, body.signature || null)];
    for (const person of body.people) {
      statements.push(env.DB.prepare(
        "INSERT INTO visitors (id, visit_id, full_name, rut, phone, plate, nationality) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(crypto.randomUUID(), visitId, person.full_name || "", person.rut || "", person.phone || "", person.plate || "", person.nationality || ""));
    }
    await env.DB.batch(statements);
    return json({ ok: true, visit_id: visitId }, 201);
  }

  if (url.pathname === "/api/staff" && request.method === "GET") {
    if (!canManage(staff)) return json({ error: "Permisos insuficientes" }, 403);
    const result = await env.DB.prepare("SELECT id, full_name, email, role, active, created_at FROM staff ORDER BY full_name").all();
    return json({ staff: result.results });
  }

  if (url.pathname === "/api/staff" && request.method === "POST") {
    if (!canManage(staff)) return json({ error: "Permisos insuficientes" }, 403);
    const body = await request.json();
    if (!body.full_name || !body.email || !["admin", "receptionist"].includes(body.role)) {
      return json({ error: "Nombre, correo y rol válido son obligatorios" }, 400);
    }
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO staff (id, full_name, email, role) VALUES (?, ?, ?, ?)")
      .bind(id, body.full_name, body.email.toLowerCase(), body.role).run();
    return json({ ok: true, id }, 201);
  }

  if (url.pathname.startsWith("/api/staff/") && request.method === "PATCH") {
    if (staff.role !== "owner") return json({ error: "Solo el dueño puede cambiar permisos" }, 403);
    const targetId = url.pathname.split("/").pop();
    const body = await request.json();
    if (!['admin','receptionist'].includes(body.role) || typeof body.active !== 'boolean') {
      return json({ error: "Rol o estado inválido" }, 400);
    }
    await env.DB.prepare("UPDATE staff SET role = ?, active = ? WHERE id = ? AND id <> ?")
      .bind(body.role, body.active ? 1 : 0, targetId, staff.id).run();
    return json({ ok: true });
  }

  return json({ error: "Ruta no encontrada" }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      try { return await api(request, env, url); }
      catch (error) { return json({ error: "Error interno", detail: error.message }, 500); }
    }
    if (url.pathname === "/" || url.pathname === "") {
      return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
    }
    return env.ASSETS.fetch(request);
  }
};

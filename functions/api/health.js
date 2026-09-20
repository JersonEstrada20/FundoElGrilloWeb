import { json } from '../_lib/auth.js';
export function onRequest() { return json({ ok: true, service: 'fundo-el-grillo' }); }

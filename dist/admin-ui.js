(() => {
  const style = document.createElement('style');
  style.textContent = `
    .admin-nav{position:sticky;top:0;z-index:5;display:flex;gap:8px;flex-wrap:wrap;padding:10px 0 14px;background:var(--bg);border-bottom:1px solid var(--line);margin-bottom:16px}
    .admin-nav a{font:600 13px system-ui,sans-serif;text-decoration:none;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:8px 12px}
    .admin-nav a:hover{border-color:var(--green);color:var(--green)}
    .section-kicker{font:700 11px system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--green);margin:0 0 6px}
    #app>.card,#operations>.card{scroll-margin-top:75px}
    .admin-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px}
    .admin-summary .guest{margin:0;text-align:center;padding:14px 8px;border:1px solid var(--line)}
    .admin-summary b{font-size:25px;color:var(--green)}
    @media(max-width:620px){.admin-nav{top:0;overflow-x:auto;flex-wrap:nowrap}.admin-nav a{white-space:nowrap}.admin-summary{grid-template-columns:1fr 1fr}.admin-summary .guest:last-child{grid-column:1/-1}}
  `;
  document.head.appendChild(style);
  const app=document.getElementById('app');
  if(!app)return;
  const cards=[...app.querySelectorAll(':scope>.card')];
  if(cards[0])cards[0].id='nuevo-ingreso';
  const manage=document.getElementById('manage');
  if(manage)manage.id='equipo';
  const history=cards.find(x=>x.querySelector('#visits'));
  if(history)history.id='ingresos';
  const ops=document.getElementById('operations');
  if(ops)ops.id='operaciones';
  const nav=document.createElement('nav');nav.className='admin-nav';nav.setAttribute('aria-label','Secciones del panel');
  [['nuevo-ingreso','Nuevo ingreso'],['ingresos','Ingresos'],['operaciones','Gestión'],['equipo','Equipo']].forEach(([id,label])=>{
    if(document.getElementById(id)){const a=document.createElement('a');a.href='#'+id;a.textContent=label;nav.appendChild(a)}
  });
  const back=app.querySelector('.back');
  if(back)back.after(nav);
  const session=document.getElementById('session');
  if(session&&!session.dataset.kicker){const p=document.createElement('p');p.className='section-kicker';p.textContent='Recepción';session.before(p);session.dataset.kicker='1'}
  const visits=document.getElementById('visits');
  if(visits){
    const bar=document.createElement('div');bar.className='admin-filter';bar.innerHTML='<input id="visitSearch" placeholder="Buscar por nombre, RUT, teléfono o patente"><input id="visitDate" type="date">';visits.before(bar);
    const filter=()=>{const q=(document.getElementById('visitSearch').value||'').toLowerCase(),date=document.getElementById('visitDate').value;visits.querySelectorAll('.visit').forEach(v=>{const text=v.textContent.toLowerCase(),created=v.dataset.date||'';v.hidden=!!(q&&!text.includes(q)||date&&!created.startsWith(date))})};bar.querySelectorAll('input').forEach(x=>x.oninput=filter)
  }
  const css=document.createElement('style');css.textContent='.admin-filter{display:grid;grid-template-columns:2fr 1fr;gap:10px;margin:12px 0}.admin-filter input{font:14px system-ui,sans-serif}.status{display:inline-block;border-radius:999px;padding:4px 9px;font:700 11px system-ui,sans-serif;text-transform:uppercase}.status-pending{background:#f5dfb7;color:#76521d}.status-confirmed{background:#cde6d2;color:#245b36}.status-cancelled,.status-rejected{background:#f4d1d1;color:#7d2929}@media(max-width:620px){.admin-filter{grid-template-columns:1fr}}';document.head.appendChild(css);
})();

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
})();

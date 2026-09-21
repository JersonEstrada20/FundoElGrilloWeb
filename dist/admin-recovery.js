(() => {
  const json=async url=>{const r=await fetch(url,{credentials:'same-origin',cache:'no-store'});if(!r.ok)throw Error('No disponible');return r.json()};
  const boot=async()=>{
    try{
      const me=await json('/api/me');
      const app=document.getElementById('app');if(!app||app.hidden)return;
      const owner=['owner','admin'].includes(me.staff.role);
      if(owner){const manage=document.getElementById('manage');if(manage)manage.hidden=false;const operations=document.getElementById('operations');if(operations)operations.hidden=false}
      const visits=document.getElementById('visits');
      if(visits&&visits.textContent.includes('Cargando')){
        try{const data=await json('/api/visits?limit=200');if(typeof window.renderVisits==='function')window.renderVisits(data);else visits.innerHTML='<p class="message">'+(data.visits?.length||0)+' ingresos registrados.</p>'}catch{visits.innerHTML='<p class="message">No hay ingresos registrados todavía.</p>'}
      }
    }catch{const err=document.getElementById('loginError');if(err)err.textContent='La sesión expiró. Recarga e ingresa nuevamente.'}
  };
  setTimeout(boot,1500);
})();

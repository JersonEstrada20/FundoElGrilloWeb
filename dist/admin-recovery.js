(() => {
  const json=async url=>{const r=await fetch(url,{credentials:'same-origin',cache:'no-store'});if(!r.ok)throw Error('No disponible');return r.json()};
  const boot=async()=>{
    try{
      const me=await json('/api/me');
      const app=document.getElementById('app');if(!app||app.hidden)return;
      const owner=['owner','admin'].includes(me.staff.role);
      if(owner){const manage=document.getElementById('manage');if(manage)manage.hidden=false;const operations=document.getElementById('operations');if(operations)operations.hidden=false}
      document.querySelectorAll('.admin-nav a').forEach(a=>a.onclick=ev=>{ev.preventDefault();const target=document.getElementById(a.hash.slice(1));if(target){target.hidden=false;target.scrollIntoView({behavior:'smooth',block:'start'})}});
      const visits=document.getElementById('visits');
      if(visits&&visits.textContent.includes('Cargando')){
        try{const data=await json('/api/visits?limit=200');if(typeof window.renderVisits==='function')window.renderVisits(data);else visits.innerHTML='<p class="message">'+(data.visits?.length||0)+' ingresos registrados.</p>'}catch{visits.innerHTML='<p class="message">No hay ingresos registrados todavía.</p>'}
      }
      if(owner){
        const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const bookings=document.getElementById('bookingList');
        if(bookings&&bookings.textContent.includes('Cargando')){try{const b=await json('/api/bookings');bookings.innerHTML=b.bookings?.map(x=>'<div class="guest"><b>'+esc(x.resource_name)+'</b> · '+esc(x.full_name)+'<br>'+esc(x.start_date)+' a '+esc(x.end_date)+' · Estado: '+esc(x.status)+'</div>').join('')||'<p class="message">No hay solicitudes de reserva.</p>'}catch{bookings.innerHTML='<p class="message">No se pudieron cargar las reservas.</p>'}}
        const reviews=document.getElementById('reviewList');
        if(reviews&&reviews.textContent.includes('Cargando')){try{const r=await json('/api/reviews');const pending=(r.reviews||[]).filter(x=>x.status==='pending');reviews.innerHTML=pending.map(x=>'<div class="guest"><b>'+esc(x.full_name)+'</b> · '+('★'.repeat(x.rating))+'<br>'+esc(x.comment)+'</div>').join('')||'<p class="message">No hay opiniones pendientes.</p>'}catch{reviews.innerHTML='<p class="message">No se pudieron cargar las opiniones.</p>'}}
      }
    }catch{const err=document.getElementById('loginError');if(err)err.textContent='La sesión expiró. Recarga e ingresa nuevamente.'}
  };
  setTimeout(boot,1500);
})();

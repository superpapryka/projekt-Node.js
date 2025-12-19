document.addEventListener('DOMContentLoaded',function(){
  const btn = document.getElementById('hamburger');
  const nav = document.querySelector('.main-nav');
  if(!btn||!nav) return;
  btn.addEventListener('click',()=>{
    if(nav.style.display==='flex') nav.style.display='';
    else { nav.style.display='flex'; nav.style.flexDirection='column'; nav.style.position='absolute'; nav.style.right='12px'; nav.style.top='56px'; nav.style.background='#fff'; nav.style.padding='8px'; nav.style.border='1px solid #eee'; }
  });
  document.addEventListener('click',(e)=>{ if(!nav.contains(e.target) && !btn.contains(e.target)) nav.style.display='';});
});

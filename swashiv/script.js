document.addEventListener('DOMContentLoaded',()=>{
  // Trigger Ken Burns background animation on hero/page-hero
  document.querySelectorAll('.hero, .page-hero').forEach(el=>{
    requestAnimationFrame(()=>el.classList.add('loaded'));
  });

  // Parallax scroll + cursor-follow movement on hero background photos
  const parallaxEls = document.querySelectorAll('.bg-parallax');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(parallaxEls.length && !prefersReduced){
    let scrollOffset = 0;
    let mouseX = 0, mouseY = 0;
    let ticking = false;

    function applyTransform(){
      parallaxEls.forEach(el=>{
        el.style.transform = 'translate3d('+mouseX+'px,'+(scrollOffset+mouseY)+'px,0)';
      });
      ticking = false;
    }
    function requestUpdate(){
      if(!ticking){ requestAnimationFrame(applyTransform); ticking = true; }
    }

    window.addEventListener('scroll', ()=>{
      scrollOffset = Math.min(window.scrollY * 0.22, 140);
      requestUpdate();
    }, {passive:true});

    window.addEventListener('mousemove', (e)=>{
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;   // -1..1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;  // -1..1
      mouseX = nx * -16; // move opposite to cursor for depth feel
      mouseY = ny * -12;
      requestUpdate();
    }, {passive:true});

    applyTransform();
  }else if(parallaxEls.length){
    // Reduced motion: keep backgrounds static, no scroll/mouse movement
  }

  // Mobile nav toggle
  const toggle=document.querySelector('.nav-toggle');
  const links=document.querySelector('.nav-links');
  if(toggle&&links){
    toggle.addEventListener('click',()=>{
      const open=links.style.display==='flex';
      links.style.display=open?'none':'flex';
      links.style.cssText+= open? '' : 'position:fixed;top:80px;left:0;right:0;background:#FFFBF3;flex-direction:column;padding:24px 28px;gap:20px;border-bottom:1px solid rgba(107,45,140,0.12);';
    });
  }

  // Scroll reveal
  const revealEls=document.querySelectorAll('.reveal');
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
    });
  },{threshold:0.15});
  revealEls.forEach(el=>io.observe(el));

  // Nav background on scroll
  const nav=document.querySelector('.site-nav');
  if(nav){
    window.addEventListener('scroll',()=>{
      nav.style.background = window.scrollY>40 ? 'rgba(255,251,243,0.98)' : 'rgba(255,251,243,0.92)';
    });
  }

  // Shop category filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      const filter=tab.dataset.filter;
      document.querySelectorAll('.product-card').forEach(card=>{
        if(filter==='all'){card.style.display='block';}
        else{card.style.display = card.dataset.cat===filter ? 'block':'none';}
      });
    });
  });
});

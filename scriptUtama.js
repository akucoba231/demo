 /*(function(){
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let w=0,h=0,particles=[];
    function resize(){ w = canvas.width = canvas.clientWidth || canvas.offsetWidth; h = canvas.height = canvas.clientHeight || canvas.offsetHeight; }
    window.addEventListener('resize', resize);
    resize();
    const COUNT = Math.max(10, Math.min(28, Math.floor((w*h)/95000)));
    function rand(a,b){return Math.random()*(b-a)+a}
    function create(){
      particles = [];
      for(let i=0;i<COUNT;i++){
        particles.push({x:rand(0,w),y:rand(0,h),r:rand(2,6),vx:rand(-0.12,0.12),vy:rand(-0.1,0.1),hue:rand(160,340),alpha:rand(0.12,0.32),sway:rand(0.4,1.6),phase:rand(0,Math.PI*2)});
      }
    }
    create();
    let last = performance.now();
    function loop(now){
      const dt = Math.min(40, now-last); last = now;
      ctx.clearRect(0,0,w,h);
      for(const p of particles){
        p.phase += dt*0.001*p.sway;
        p.x += p.vx + Math.sin(p.phase)*0.04;
        p.y += p.vy;
        if(p.x < -10) p.x = w+10;
        if(p.x > w+10) p.x = -10;
        if(p.y < -10) p.y = h+10;
        if(p.y > h+10) p.y = -10;
        const g = ctx.createRadialGradient(p.x,p.y,p.r*0.2,p.x,p.y,p.r*2);
        g.addColorStop(0, `hsla(${p.hue},70%,90%,${p.alpha})`);
        g.addColorStop(1, `hsla(${p.hue},70%,90%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    setInterval(()=>{ if(canvas.width!==w||canvas.height!==h){ resize(); create(); } }, 1200);
  })();*/
  
  function qs(str){
    return document.querySelector(str);
  }
  
(()=>{const c=qs('#bgCanvas1'),ctx=c.getContext('2d');let w=0,h=0,p=[];
  function rs(){w=c.width=c.offsetWidth;h=c.height=c.offsetHeight;}
  window.addEventListener('resize',rs);rs();
  function rand(a,b){return Math.random()*(b-a)+a;}
  function mk(){p=[];for(let i=0;i<24;i++)p.push({x:rand(0,w),y:rand(0,h),r:rand(2,6),dx:rand(-0.4,0.4),dy:rand(-0.4,0.4),c:`hsla(${rand(160,320)},70%,70%,.4)`});}
  function anim(){
    ctx.clearRect(0,0,w,h);
    p.forEach(o=>{
      o.x+=o.dx;o.y+=o.dy;
      if(o.x<0||o.x>w)o.dx*=-1;
      if(o.y<0||o.y>h)o.dy*=-1;
      ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,Math.PI*2);
      ctx.fillStyle=o.c;ctx.fill();
    });
    requestAnimationFrame(anim);
  }
  mk();anim();
})();


  const AudioEngine = (function(){
    const C = window.AudioContext || window.webkitAudioContext;
    const ctx = C ? new C() : null;
    let enabled = true;
    function pop(p={pitch:1.1,dur:0.06,vol:0.11}){ if(!enabled||!ctx) return; try{ const o=ctx.createOscillator(),g=ctx.createGain(); o.type='square'; o.frequency.setValueAtTime(360*p.pitch,ctx.currentTime); g.gain.setValueAtTime(p.vol,ctx.currentTime); o.connect(g); g.connect(ctx.destination); o.frequency.exponentialRampToValueAtTime(140*p.pitch,ctx.currentTime+p.dur); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+p.dur*1.6); o.start(); o.stop(ctx.currentTime+p.dur*1.9);}catch(e){}}
    function success(){ if(!enabled||!ctx) return; try{ const o1=ctx.createOscillator(),g1=ctx.createGain(); o1.type='sine'; o1.frequency.setValueAtTime(720,ctx.currentTime); o1.frequency.exponentialRampToValueAtTime(880,ctx.currentTime+0.12); g1.gain.setValueAtTime(0.07,ctx.currentTime); g1.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.28); o1.connect(g1); g1.connect(ctx.destination); o1.start(); o1.stop(ctx.currentTime+0.32); setTimeout(()=>pop({pitch:1.35,vol:0.09,dur:0.05}),80);}catch(e){}}
    return {setEnabled(v){enabled=!!v},pop(){pop()},success(){success()}};
  })();

  (function(){
    const sections = document.querySelectorAll('.section');
    const menuItems = Array.from(document.querySelectorAll('.menu-item'));
    const logoWrap = document.getElementById('logoWrap');
    const menuList = document.getElementById('menuList');
    const toggleSound = document.getElementById('toggleSound');
    const toggleSound2 = document.getElementById('toggleSound2');
    const resetHome = document.getElementById('resetHome');

    function showHomeSequence(){
      logoWrap.classList.add('show');
      menuItems.forEach((it,i)=>setTimeout(()=>it.classList.add('show'),160+i*90));
    }
    function hideHomeItems(){menuItems.forEach(it=>it.classList.remove('show'))}
    function showSection(id){
      AudioEngine.pop();
      sections.forEach(s=>{
        if(s.id===id|| (id==='home'&& s.id==='homeCard')){s.classList.add('active');s.setAttribute('aria-hidden','false')} else {s.classList.remove('active');s.setAttribute('aria-hidden','true')}
      });
      if(id==='home'){
        showHomeSequence()
        
      } else {
        //logoWrap.classList.remove('show'); 
        hideHomeItems()
        
      }
      window.scrollTo({top:0,behavior:'smooth'});
    }

    showHomeSequence();

    menuItems.forEach(it=>{
      it.addEventListener('click',()=>{const t=it.dataset.target; if(t) showSection(t)});
      it.addEventListener('mousedown',()=>AudioEngine.pop());
    });

    document.querySelectorAll('.back-btn[data-back]').forEach(b=>b.addEventListener('click',()=>showSection(b.dataset.back)));

    resetHome.addEventListener('click',()=>{
      document.querySelectorAll('#checklist input[type=checkbox]').forEach(i=>i.checked=false);
      document.getElementById('journal').value='';
      document.getElementById('saveNote').textContent='';
      document.getElementById('journalNote').textContent='';
      document.getElementById('quizFeedback').textContent='';
      document.getElementById('streak').textContent='3';
      AudioEngine.pop();
      showSection('home');
    });

    document.getElementById('saveActivities').addEventListener('click',()=>{
      const checked = Array.from(document.querySelectorAll('#checklist input[type=checkbox]:checked')).map(i=>i.dataset.activity);
      const note = document.getElementById('saveNote');
      if(checked.length){note.textContent = `Tersimpan: ${checked.join(', ')}`; AudioEngine.pop()} else {note.textContent = `Belum ada yang dicentang.`}
      setTimeout(()=>note.textContent='',3500);
    });

    document.getElementById('saveJournal').addEventListener('click',()=>{
      const txt = document.getElementById('journal').value.trim(); const note = document.getElementById('journalNote');
      if(txt){note.textContent='Jurnal tersimpan — terima kasih! ✨'; AudioEngine.pop(); document.getElementById('journal').value=''} else {note.textContent='Tulis sedikit dulu ya 😊'}
      setTimeout(()=>note.textContent='',3000);
    });

    const options = document.querySelectorAll('.quiz .option');
    options.forEach(opt=>opt.addEventListener('click',()=>{
      const correct = opt.dataset.correct==='true'; const feedback = document.getElementById('quizFeedback');
      if(correct){
        feedback.textContent = "Benar! Kamu pintar dan aktif 🎉";
        confetti({particleCount:36,spread:40,startVelocity:18,ticks:120,gravity:0.45,origin:{y:0.35},colors:['#ffd1e0','#c7f9e3','#a8edea','#ffe7b8']});
        AudioEngine.success();
        const s = document.getElementById('streak'); const val = parseInt(s.textContent||'0',10)||0; s.textContent = String(Math.min(99,val+1));
      } else {
        feedback.textContent = "Coba lagi yuk — pilih yang lebih sehat!";
        AudioEngine.pop();
      }
      setTimeout(()=>feedback.textContent='',3800);
    }));

    toggleSound.addEventListener('change',e=>AudioEngine.setEnabled(e.target.checked));
    if(toggleSound2) toggleSound2.addEventListener('change',e=>{AudioEngine.setEnabled(e.target.checked); toggleSound.checked = e.target.checked});

    function resumeOnGesture(){ window.removeEventListener('pointerdown',resumeOnGesture); window.removeEventListener('keydown',resumeOnGesture) }
    window.addEventListener('pointerdown',resumeOnGesture,{once:true}); window.addEventListener('keydown',resumeOnGesture,{once:true});
  })();
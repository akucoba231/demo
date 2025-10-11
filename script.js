let musik = new Audio("bright-ukulele-amp-claps-positive-background-music-306705.mp3");
  musik.loop = true; // Agar musik berulang
  
  function qs(str){ return document.querySelector(str); }

  function startAppSequence() {
      const splashScreen = qs('#splashScreen');
      const mainContent = qs('#mainContent');
      const targetUrl = false//"4index.html"; // URL tujuan setelah splash screen
      
      // Mengubah subtitle untuk menunjukkan progress
      qs('.subtitle').textContent = "Memuat konten...";
      
      // Timer untuk splash screen: 1 detik
      setTimeout(() => {
          splashScreen.classList.add('hidden');
          
          // Mengganti ke halaman lain atau menampilkan konten utama
         // if (targetUrl) {
              // Jika Anda ingin mengarahkan ke halaman lain
              //document.location.href = targetUrl;
         // } else {
              // Jika Anda ingin tetap di halaman ini (SPA)
             // mainContent.classList.add('show');
        //  }
      }, 2000); // 1 detik
  }
  
  // --- Canvas Logic (Dipertahankan) ---
  (function(){
    const c=qs('#bgCanvas'),ctx=c.getContext('2d');
  
    let w=0,h=0,p=[];
    function rand(a,b){return Math.random()*(b-a)+a;}
    function mk(isResize = false){
        const COUNT = Math.max(30, Math.min(80, Math.ceil((w * h) / 7000)));
        if (p.length === 0 || isResize) { 
             p=[]; 
             for(let i=0; i < COUNT; i++){
                p.push({x:rand(0,w),y:rand(0,h),r:rand(2,6),dx:rand(-0.6,0.6),dy:rand(-0.6,0.6),c:`hsla(${rand(160,320)},70%,70%,.4)`});
            }
        }
    }
    function rs(){
        const parent = c.parentElement; 
        w = c.width = parent.offsetWidth;
        h = c.height = parent.offsetHeight;
        if (w === 0 || h === 0) {
            w = c.width = window.innerWidth;
            h = c.height = window.innerHeight;
        }
        mk(true); 
    }
    function anim(){
      ctx.clearRect(0,0,w,h);
      p.forEach(o=>{
        o.x+=o.dx;o.y+=o.dy;
        if(o.x < 0 || o.x > w) o.dx*=-1;
        if(o.y < 0 || o.y > h) o.dy*=-1;
        ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,Math.PI*2);
        ctx.fillStyle=o.c;ctx.fill();
      });
      requestAnimationFrame(anim);
    }
    window.addEventListener('resize',rs);
    rs(); 
    anim();
  })();
  // --- End Canvas Logic ---

  document.addEventListener('DOMContentLoaded', () => {
    const musicDialog = qs('#musicDialog');
    const playMusicBtn = qs('#playMusicBtn');

    // 1. Tombol Play Music
    playMusicBtn.addEventListener('click', () => {
        // Coba putar musik
        musik.play().catch(error => {
            console.error("Gagal memutar musik:", error);
            // Handle error (misal, jika file tidak ditemukan)
        });
        
        // Sembunyikan dialog
        musicDialog.classList.add('hidden');
        
        // Mulai urutan splash screen (1 detik)
        startAppSequence();
    });
    
    // **Opsional: Jika Anda ingin mem-bypass musik:**
    // Tambahkan delay kecil agar dialog sempat muncul sebelum memulai urutan.
    /*
    setTimeout(() => {
        if (!musicDialog.classList.contains('hidden')) {
            // Skenario jika pengguna tidak mengklik tombol, atau bypass (opsional)
        }
    }, 5000); 
    */
  });
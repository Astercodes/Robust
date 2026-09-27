// Rebuild the original eight-second motion graphic with Playwright/Chromium.
// Run: node tools/render-motion.cjs (requires playwright).
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({headless:true, channel:process.env.BROWSER_CHANNEL || 'msedge'});
  const page = await browser.newPage({viewport:{width:960,height:720}});
  await page.setContent('<canvas width="960" height="720"></canvas>');
  const result = await page.evaluate(async () => {
    const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
    const tau = Math.PI * 2;
    function draw(t) {
      ctx.fillStyle='#130a17';ctx.fillRect(0,0,960,720);
      const glow=ctx.createRadialGradient(480,360,10,480,360,420);
      glow.addColorStop(0,'#672a4055');glow.addColorStop(1,'#130a1700');
      ctx.fillStyle=glow;ctx.fillRect(0,0,960,720);
      // Fine orbital field, softly tilted in three-dimensional projection.
      function point(a,r,tilt){return [480+Math.cos(a)*r,360+Math.sin(a)*r*.42+Math.cos(a)*tilt];}
      for(let ring=0;ring<7;ring++){
        let r=125+ring*31, tilt=Math.sin(t*tau+ring*.35)*55;
        ctx.beginPath();
        for(let i=0;i<=180;i++){const p=point(i/180*tau,r,tilt);i?ctx.lineTo(...p):ctx.moveTo(...p);}
        ctx.strokeStyle=ring%2?'#e8675c44':'#ffca0655';ctx.lineWidth=1;ctx.stroke();
        for(let j=0;j<3;j++){
          const p=point(t*tau*(ring%2?-1:1)+j*tau/3+ring*.62,r,tilt);
          const size=ring%3===0?6:3;
          ctx.shadowColor='#ffca06';ctx.shadowBlur=18;ctx.fillStyle=ring%2?'#eea1b7':'#ffd864';
          ctx.beginPath();ctx.arc(...p,size,0,tau);ctx.fill();ctx.shadowBlur=0;
        }
      }
      // A floating, faceted capability core, breathing once per loop.
      const radius=65+5*Math.sin(t*tau);
      const g=ctx.createRadialGradient(460,335,3,480,360,radius);
      g.addColorStop(0,'#fff0b4');g.addColorStop(.3,'#ffca06');g.addColorStop(.7,'#e8675c');g.addColorStop(1,'#68097e');
      ctx.shadowColor='#e8675c';ctx.shadowBlur=55;ctx.fillStyle=g;
      ctx.beginPath();ctx.arc(480,360,radius,0,tau);ctx.fill();ctx.shadowBlur=0;
      ctx.strokeStyle='#ffe6a655';ctx.lineWidth=.8;
      for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(480,360,radius,12+i*7,t*tau+i*.5,0,tau);ctx.stroke();}
      ctx.strokeStyle='#f3a7cf12';ctx.beginPath();ctx.arc(480,360,330,0,tau);ctx.stroke();
    }
    draw(0);
    const poster=canvas.toDataURL('image/png').split(',')[1];
    const stream=canvas.captureStream(30);
    const recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9',videoBitsPerSecond:1400000});
    const chunks=[];recorder.ondataavailable=e=>chunks.push(e.data);
    const stopped=new Promise(resolve=>recorder.onstop=resolve);
    recorder.start();const start=performance.now();
    await new Promise(resolve=>{
      function frame(now){let elapsed=now-start;draw((elapsed%8000)/8000);if(elapsed>=8000)resolve();else requestAnimationFrame(frame);}
      requestAnimationFrame(frame);
    });
    recorder.stop();await stopped;stream.getTracks().forEach(track=>track.stop());
    const data=new Uint8Array(await new Blob(chunks).arrayBuffer());
    let binary='';for(let i=0;i<data.length;i+=8192)binary+=String.fromCharCode(...data.subarray(i,i+8192));
    return {poster,video:btoa(binary)};
  });
  const assets=path.join(__dirname,'../assets');
  fs.writeFileSync(path.join(assets,'formation-orbit.webm'),Buffer.from(result.video,'base64'));
  fs.writeFileSync(path.join(assets,'orbit-poster.png'),Buffer.from(result.poster,'base64'));
  await browser.close();
})();

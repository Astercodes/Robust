// Render four original eight-second motion studies; requires Playwright and Sharp.
const {chromium}=require('playwright');const sharp=require('sharp');const fs=require('node:fs');
(async()=>{const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'msedge'});
for(const theme of ['career','business','trades','creative']){
 const page=await browser.newPage({viewport:{width:800,height:500}});await page.setContent('<canvas width="800" height="500"></canvas>');
 const result=await page.evaluate(async(theme)=>{
 const canvas=document.querySelector('canvas'),c=canvas.getContext('2d'),tau=Math.PI*2;
 const gold='#ffca06',coral='#e8675c',pink='#efa2c9';
 function line(points,color,width=2){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke()}
 function rect(x,y,w,h,fill,stroke,r=14){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke()}}
 function dot(x,y,r,color){c.beginPath();c.arc(x,y,r,0,tau);c.fillStyle=color;c.fill()}
 function ring(x,y,r,color){c.beginPath();c.arc(x,y,r,0,tau);c.strokeStyle=color;c.lineWidth=2;c.stroke()}
 function tick(x,y,color){line([[x-12,y],[x-3,y+9],[x+16,y-13]],color,4)}
 function cube(x,y,size,color){line([[x,y-size],[x+size,y-size/2],[x+size,y+size/2],[x,y+size],[x-size,y+size/2],[x-size,y-size/2],[x,y-size]],color,3);line([[x-size,y-size/2],[x,y],[x+size,y-size/2]],color,3);line([[x,y],[x,y+size]],color,3)}
 function gear(x,y,r,a,color){c.save();c.translate(x,y);c.rotate(a);c.beginPath();for(let i=0;i<48;i++){let theta=i/48*tau,rr=i%4<2?r:r*.82;c.lineTo(Math.cos(theta)*rr,Math.sin(theta)*rr)}c.closePath();c.strokeStyle=color;c.lineWidth=3;c.stroke();ring(0,0,r*.37,color);c.restore()}
 function draw(t){
 c.fillStyle='#160d1e';c.fillRect(0,0,800,500);
 const g=c.createRadialGradient(400,250,0,400,250,400);g.addColorStop(0,'#4a244b88');g.addColorStop(1,'#160d1e00');c.fillStyle=g;c.fillRect(0,0,800,500);
 for(let x=40;x<800;x+=40)for(let y=30;y<500;y+=40)dot(x,y,1,'#ffffff10');
 const pulse=(Math.sin(t*tau)+1)/2;
 if(theme==='career'){
 const xs=[100,250,400,550,700],ys=[325,285,235,185,135];line(xs.map((x,i)=>[x,ys[i]]),'#f3a7cf33',2);
 const p=t*4,k=Math.floor(p),f=p-k;dot(xs[k]+(xs[Math.min(k+1,4)]-xs[k])*f,ys[k]+(ys[Math.min(k+1,4)]-ys[k])*f,7,gold);
 xs.forEach((x,i)=>{let y=ys[i];rect(x-42,y-42,84,84,'#261530',i<=p?gold:'#80546f');
 if(i===0){line([[x,y-22],[x,y+22]],pink);line([[x-24,y-17],[x-24,y+17],[x,y+22],[x+24,y+17],[x+24,y-17],[x,y-12],[x-24,y-17]],pink)}
 if(i===1){line([[x-20,y-20],[x+20,y+20]],coral,5);line([[x+20,y-20],[x-20,y+20]],gold,5);ring(x+20,y-20,8,gold)}
 if(i===2)cube(x,y,24,coral);
 if(i===3){ring(x,y,25,pink);tick(x,y,gold)}
 if(i===4){rect(x-25,y-15,50,36,null,gold,5);rect(x-12,y-25,24,10,null,gold,3);line([[x-25,y],[x+25,y]],gold)}
 });
 }else if(theme==='business'){
 const lift=24*Math.sin(t*tau),spread=20+30*pulse;
 rect(92,115,155,250,'#23142c','#865274');for(let i=0;i<4;i++)line([[115,155+i*45],[218,155+i*45]],i<2?gold:'#80546f',3);
 line([[267,250],[340,250]],gold,2);line([[530,250],[610,250]],coral,2);
 cube(435,260,68,gold);c.save();c.translate(435,190-spread);c.rotate(Math.sin(t*tau)*.08);line([[-68,0],[0,-34],[68,0],[0,34],[-68,0]],coral,4);c.restore();
 for(let i=0;i<3;i++){let yy=175+i*75;rect(630,yy+lift*.2,78,56,'#43213a',pink,8);tick(669,yy+28+lift*.2,gold)}
 dot(270+(t*340)%340,250,5,gold);
 }else if(theme==='trades'){
 gear(315,260,85,t*tau,gold);gear(455,175,68,-t*tau,coral);
 line([[110,320],[170,320],[170,170],[240,170]],'#e8675c88',3);line([[520,175],[620,175],[620,325],[690,325]],'#ffca0688',3);
 rect(78,292,58,58,'#321b36',coral,8);line([[92,321],[122,321]],gold,4);line([[107,306],[107,336]],gold,4);
 rect(656,294,62,62,'#321b36',gold,8);tick(687,325,gold);
 const path=[[110,320],[170,320],[170,170],[240,170]],progress=t*3,j=Math.floor(progress),f=progress-j;dot(path[j][0]+(path[j+1][0]-path[j][0])*f,path[j][1]+(path[j+1][1]-path[j][1])*f,6,gold);
 line([[270,395],[520,395]],'#f3a7cf44');for(let i=0;i<11;i++)line([[270+i*25,390],[270+i*25,400]],pink);
 }else{
 const shift=14*Math.sin(t*tau);
 c.save();c.translate(340,235);c.rotate(-.12);rect(-125,-155,250,310,'#5d204c',pink,6);c.restore();
 c.save();c.translate(420+shift,235);c.rotate(.07);rect(-125,-155,250,310,'#efae83',null,6);
 c.fillStyle='#c91c7a';c.beginPath();c.arc(0,-30,76,0,tau);c.fill();
 c.save();c.rotate(t*tau);for(let i=0;i<6;i++){c.rotate(tau/6);c.fillStyle=i%2?'#ffca06':'#e8675c';c.beginPath();c.moveTo(0,0);c.lineTo(30,-62);c.lineTo(65,-30);c.closePath();c.fill()}c.restore();
 line([[-80,90],[80,90]],'#63224f',6);line([[-80,112],[20,112]],'#63224f',6);c.restore();
 for(let i=0;i<4;i++)rect(130+i*140,432,112,12,i===Math.floor(t*4)?gold:'#733c61',null,3);
 }
 }
 draw(.2);const poster=canvas.toDataURL('image/png').split(',')[1];const stream=canvas.captureStream(30);const rec=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9',videoBitsPerSecond:800000}),chunks=[];rec.ondataavailable=e=>chunks.push(e.data);const stopped=new Promise(r=>rec.onstop=r);rec.start();let start=performance.now();await new Promise(resolve=>{function frame(now){draw((Math.max(0,now-start)%8000)/8000);if(now-start>=8000)resolve();else requestAnimationFrame(frame)}requestAnimationFrame(frame)});rec.stop();await stopped;stream.getTracks().forEach(t=>t.stop());const bytes=new Uint8Array(await new Blob(chunks).arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return{poster,video:btoa(binary)};
 },theme);
 fs.writeFileSync('assets/'+theme+'-motion.webm',Buffer.from(result.video,'base64'));await sharp(Buffer.from(result.poster,'base64')).webp({quality:88}).toFile('assets/'+theme+'-motion.webp');await page.close();console.log(theme+' motion rendered');
}await browser.close()})();

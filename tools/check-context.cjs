const {chromium}=require('playwright');const fs=require('node:fs');const {execFileSync}=require('node:child_process');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],broken=[],report=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:8765')&&r.status()>=400)broken.push(r.url())});
const dir='../robust-qa/context';fs.mkdirSync(dir,{recursive:true});
const files=fs.readdirSync('.').filter(f=>f.endsWith('.html'));
for(const file of files){
 const original=execFileSync('git',['show','e5cad338eb6a599797e3d4c768c1ee06a03bee4e:'+file],{encoding:'utf8'});
 const current=fs.readFileSync(file,'utf8').replace('<link rel="stylesheet" href="css/motion.css">','').replace('<script src="js/visuals.js"></script>','');
 if(current.replace(/\s+/g,' ')!==original.replace(/\s+/g,' '))throw Error(file+' source content changed');
 await page.route('**/js/visuals.js',r=>r.fulfill({contentType:'text/javascript',body:''}));
 await page.goto('http://127.0.0.1:8765/'+file,{waitUntil:'domcontentloaded'});const baseline=await page.content();await page.unroute('**/js/visuals.js');await page.reload({waitUntil:'domcontentloaded'});
 const result=await page.evaluate(baseline=>{
 const old=new DOMParser().parseFromString(baseline,'text/html');
 const text=doc=>{let b=doc.body.cloneNode(true);b.querySelectorAll('script,style,.motion-control').forEach(n=>n.remove());return b.textContent.replace(/\s+/g,' ').trim()};
 const links=doc=>JSON.stringify(Array.from(doc.querySelectorAll('a')).map(a=>[a.textContent,a.getAttribute('href')]));
 return{preserved:text(old)===text(document)&&links(old)===links(document),hero:document.querySelector('.context-photo img').getAttribute('src'),chapters:Array.from(document.querySelectorAll('.story-row')).map(s=>({heading:s.querySelector('h2').textContent,asset:s.querySelector('img').getAttribute('src')})),overflow:document.documentElement.scrollWidth>innerWidth};
 },baseline);
 if(!result.preserved)throw Error(file+' rendered content changed');
 report.push({file,...result});
 await page.locator('.context-photo img').evaluate(i=>i.decode());await page.waitForTimeout(700);await page.screenshot({path:dir+'/'+file+'.png'});
}
const overflow=[];for(const width of [375,768,1024]){
 await page.setViewportSize({width,height:1000});
 for(const file of files){await page.goto('http://127.0.0.1:8765/'+file,{waitUntil:'domcontentloaded'});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))overflow.push(file+' @ '+width)}
}
const videoResults=[];
for(const file of ['index.html','business.html','trades.html','creative.html']){
 await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:8765/'+file,{waitUntil:'domcontentloaded'});await page.waitForTimeout(1300);
 const state=await page.locator('video').evaluate(v=>({playing:!v.paused,time:v.currentTime,source:v.currentSrc}));if(!state.playing||!state.time)throw Error('Video playback: '+file);
 await page.locator('.motion-control').click();if(!await page.locator('video').evaluate(v=>v.paused))throw Error('Pause failed');await page.locator('.motion-control').click();
 await page.locator('footer').scrollIntoViewIfNeeded();await page.waitForTimeout(200);if(!await page.locator('video').evaluate(v=>v.paused))throw Error('Offscreen video running');
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'domcontentloaded'});if(!await page.locator('video').evaluate(v=>v.paused))throw Error('Reduced motion failed');await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:375,height:1000});await page.goto('http://127.0.0.1:8765/'+file,{waitUntil:'domcontentloaded'});await page.waitForTimeout(800);await page.screenshot({path:dir+'/'+file+'-mobile.png'});
 if(await page.locator('nav.links').isVisible())throw Error('Closed menu visible');await page.locator('.menu-btn').click();if(!await page.locator('nav.links').isVisible())throw Error('Menu failed');
 videoResults.push({file,...state});
}
fs.writeFileSync(dir+'/report.json',JSON.stringify({report,errors,broken,overflow,videoResults},null,2));console.log(JSON.stringify({pages:report.length,illustratedSections:report.reduce((n,r)=>n+r.chapters.length,0),errors,broken,overflow,desktopOverflow:report.filter(r=>r.overflow).map(r=>r.file),videoResults},null,2));
await browser.close();if(errors.length||broken.length||overflow.length||report.some(r=>r.overflow))process.exitCode=1;
})();

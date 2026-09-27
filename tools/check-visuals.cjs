const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync}=require('node:child_process');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'msedge'});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const out=process.env.QA_DIR||'../robust-qa';fs.mkdirSync(out,{recursive:true});
  const pages=fs.readdirSync('.').filter(f=>f.endsWith('.html'));
  for(const file of pages){
    const original=execFileSync('git',['show',(process.env.BASELINE_REF||'origin/claude/trusting-tesla-lrxjyt')+':'+file],{encoding:'utf8'});
    await page.route('**/js/visuals.js',route=>route.fulfill({contentType:'application/javascript',body:''}));
    await page.goto('http://127.0.0.1:8765/'+file,{waitUntil:'domcontentloaded'});
    const baseline=await page.content();
    await page.unroute('**/js/visuals.js');
    await page.reload({waitUntil:'domcontentloaded'});
    const comparison=await page.evaluate(original=>{
      const before=new DOMParser().parseFromString(original,'text/html');
      const text=doc=>{const body=doc.body.cloneNode(true);body.querySelectorAll('script,style,.motion-control').forEach(e=>e.remove());return body.textContent.replace(/\s+/g,' ').trim()};
      const links=doc=>Array.from(doc.querySelectorAll('a')).map(a=>[a.textContent,a.getAttribute('href')]);
      return {copy:text(before)===text(document),links:JSON.stringify(links(before))===JSON.stringify(links(document)),hero:!!document.querySelector('.hero-art')};
    },baseline);
    const current=fs.readFileSync(file,'utf8').replace('<link rel="stylesheet" href="css/motion.css">','').replace('<script src="js/visuals.js"></script>','').replace(/\s+/g,' ');
    if(current!==original.replace(/\s+/g,' '))throw Error(file+' source copy changed');
    if(!comparison.copy||!comparison.links)throw Error(file+' content changed: '+JSON.stringify(comparison));
  }
  await page.goto('http://127.0.0.1:8765/index.html');await page.waitForTimeout(1000);
  await page.screenshot({path:path.join(out,'desktop.png')});
  await page.locator('#discover').screenshot({path:path.join(out,'editorial.png')});
  await page.locator('#universe').scrollIntoViewIfNeeded();await page.waitForTimeout(1200);
  const video=await page.locator('video').evaluate(v=>({playing:!v.paused,time:v.currentTime,ready:v.readyState}));
  if(!video.playing||video.time<=0)throw Error('Video did not play: '+JSON.stringify(video));
  await page.locator('#universe').screenshot({path:path.join(out,'universe.png')});
  await page.locator('.film-art .motion-control').click();
  if(!await page.locator('video').evaluate(v=>v.paused))throw Error('Pause failed');
  await page.locator('.film-art .motion-control').click();
  const overflow=[];
  for(const width of [375,768,1024,1440]){
    await page.setViewportSize({width,height:900});
    for(const file of ['index.html','business.html','creative.html','trades.html','earlycareer.html','institutions.html']){
      await page.goto('http://127.0.0.1:8765/'+file);await page.waitForTimeout(150);
      const wide=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
      if(wide)overflow.push(file+' @ '+width);
      if(width===375&&file==='index.html'){await page.waitForTimeout(600);await page.screenshot({path:path.join(out,'mobile.png'),fullPage:false});}
    }
  }
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:8765/index.html');
  await page.locator('#universe').scrollIntoViewIfNeeded();await page.waitForTimeout(300);
  const reduced=await page.evaluate(()=>document.body.classList.contains('motion-paused')&&document.querySelector('video').paused);
  if(!reduced)throw Error('Reduced motion failed');
  console.log(JSON.stringify({pagesWithPreservedCopyAndLinks:pages.length,video,overflow,reducedMotion:reduced,errors},null,2));
  await browser.close();if(errors.length||overflow.length)process.exitCode=1;
})();

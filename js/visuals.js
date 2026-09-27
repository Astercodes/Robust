/* Contextual visual enhancement. All original page text and links are preserved. */
(function(){
'use strict';
var hero=document.querySelector('.hero'),inner=hero&&hero.querySelector('.hero-inner');if(!inner)return;
var page=location.pathname.split('/').pop()||'index.html';
var family=/^business/.test(page)?'business':/^creative/.test(page)?'creative':/^trades/.test(page)?'trades':'career';
var heroes={
'index.html':'career','earlycareer.html':'employers','ipfs.html':'campus','institutions.html':'campus','byrole.html':'campus','employers.html':'employers','pipeline.html':'employers','workforce.html':'civic','facilitypartners.html':'facilities','humannetwork.html':'mentorship','funders.html':'capital',
'business.html':'business','businessbyrole.html':'campus','businessibfs.html':'campus','businessinstitutions.html':'campus','businessinvestors.html':'capital','businessgovernment.html':'civic','businessgovernmentbyrole.html':'civic','businesspartners.html':'employers','businesspartnersbygoal.html':'employers','businesssponsors.html':'capital','businesssponsorsbytype.html':'capital','businessventures.html':'business','businessfacilitypartners.html':'facilities',
'creative.html':'creative','creativeicfs.html':'creative','creativebrands.html':'creative','creativeemployers.html':'portfolio','creativefacilitypartners.html':'facilities','creativeinstitutions.html':'campus','creativeshowcase.html':'portfolio','creativesponsors.html':'capital','creativeventures.html':'business','trades.html':'trades','tradesitfs.html':'trades','tradesemployers.html':'trades','tradesfacilitypartners.html':'trades-workshop'};
var asset=heroes[page]||family;
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)'),paused=reduced.matches,videos=[],buttons=[];
var pauseIcon='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2h3v12H3zm7 0h3v12h-3z"/></svg>';
var playIcon='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z"/></svg>';
function sync(){
 document.body.classList.toggle('motion-paused',paused||document.hidden);
 buttons.forEach(function(b){b.innerHTML=paused?playIcon:pauseIcon;b.setAttribute('aria-label',paused?'Play animations':'Pause animations');b.title=paused?'Play animations':'Pause animations'});
 videos.forEach(function(v){if(paused||document.hidden||v.dataset.visible!=='true')v.pause();else v.play().catch(function(){})});
}
function control(parent){var b=document.createElement('button');b.type='button';b.className='motion-control';b.addEventListener('click',function(){paused=!paused;sync()});parent.appendChild(b);buttons.push(b)}
function movie(parent,type){
 var film=document.createElement('div');film.className='context-film';
 film.innerHTML='<img src="assets/'+type+'-motion.webp" alt="" width="800" height="500"><video muted loop playsinline preload="none" aria-hidden="true" poster="assets/'+type+'-motion.webp"><source src="assets/'+type+'-motion.webm" type="video/webm"></video>';
 parent.appendChild(film);var v=film.querySelector('video');v.muted=true;videos.push(v);v.addEventListener('playing',function(){v.classList.add('is-playing')});control(film);
 if('IntersectionObserver' in window)new IntersectionObserver(function(entries){v.dataset.visible=String(entries[0].isIntersecting);sync()},{rootMargin:'80px'}).observe(film);else v.dataset.visible='true';
}
hero.classList.add('visual-hero','context-hero');hero.dataset.visualFamily=family;
var copy=document.createElement('div');copy.className='hero-copy';while(inner.firstChild)copy.appendChild(inner.firstChild);inner.appendChild(copy);
var art=document.createElement('div');art.className='context-art';
art.innerHTML='<div class="context-photo"><img src="assets/'+asset+'.webp" width="1536" height="1024" alt="" fetchpriority="high" decoding="async"></div><span class="frame-accent" aria-hidden="true"></span>';
inner.appendChild(art);movie(art,family);
var subjects=[
{key:'portfolio',match:/portfolio|body of work|build proof|evidence behind|formation record|see the work|demonstrated|prove you/i},
{key:'mentorship',match:/mentor|critique|feedback|learn from.*people|alumni network|right person|pass the craft|human formation/i},
{key:'facilities',match:/resource network|resource map|resource gap|infrastructure|facility|facilities|practice site|equipment|tools.*hands|creative spaces|laborator/i},
{key:family==='creative'?'creative-work':family==='business'?'business-experiment':'practice',match:/practice|buildroom|real experiments|simulations|build while|make things|prototype|hands.on|test ideas/i},
{key:'campus',match:/campus|institution|universit|college|faculty|classroom/i},
{key:'capital',match:/capital|funding|sponsor|investment|investor|fund |funds|grant|scholarship/i},
{key:'civic',match:/regional|region|community business|economic|local supplier|public procurement/i},
{key:family==='creative'?'creative-work':family==='trades'?'trades-workshop':'employers',match:/employer|talent|recruit|hiring|job.ready|industry partner|pipeline/i},
{key:'creative-work',match:family==='creative'?/creative brief|creative studio|creative identity|craft|publish|perform|exhibit/i:/$a/},
{key:'business',match:family==='business'?/business world|business requires|venture|founder|business idea|actual business/i:/$a/},
{key:'trades',match:/trade|skill.*world|technical training/i},
{key:'career-map',match:family==='career'?/world of professions|career|profession|pathway/i:/$a/}];
var used=new Set([asset]),sections=Array.from(document.querySelectorAll('.section')).filter(function(s){return s!==hero&&!s.classList.contains('finale')&&!s.classList.contains('role-stage')});
var limit=sections.length>30?6:sections.length>12?5:3,count=0,lastIndex=-3;
sections.forEach(function(section,index){
 if(count>=limit)return;var heading=section.querySelector('h2');if(!heading||heading.textContent.trim()==='Heading')return;
 var subject=subjects.find(function(s){return !used.has(s.key)&&s.match.test(heading.textContent)});if(!subject)return;
 var head=heading.closest('.section-head');
 if(!head){var wrap=section.querySelector(':scope > .wrap');if(!wrap||heading.parentElement!==wrap)return;var children=Array.from(wrap.children);if(!children.every(function(el){return /^(H2|P)$/.test(el.tagName)||el.classList.contains('btn-row')}))return;head=document.createElement('div');head.className='section-head';while(wrap.firstChild)head.appendChild(wrap.firstChild);wrap.appendChild(head)}
 var row=document.createElement('div');row.className='story-row'+(count%2?' story-reverse':'');head.parentNode.insertBefore(row,head);row.appendChild(head);
 var figure=document.createElement('figure');figure.className='story-art';figure.dataset.subject=subject.key;figure.innerHTML='<img src="assets/'+subject.key+'.webp" width="1536" height="1024" loading="lazy" decoding="async" alt="">';row.appendChild(figure);used.add(subject.key);count++;lastIndex=index;
});
document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',function(event){paused=event.matches;sync()});sync();
}());

const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
$('#year').textContent=new Date().getFullYear();
const menu=$('.menu-toggle'),nav=$('.nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});$$('.nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));
const started=$('#form-started');if(started)started.value=String(Date.now());
const formStatus=$('#form-status'),formParams=new URLSearchParams(location.search);
if(formStatus&&(formParams.has('sent')||formParams.has('error'))){
  const errors={method:'Please submit the form below.',timing:'Please wait a moment and try again.',captcha:'The security answer was incorrect. Please try again.',required:'Please complete all required fields.',email:'Please enter a valid email address.',mail:'Your request could not be sent. Please call or WhatsApp us instead.'};
  formStatus.textContent=formParams.get('sent')==='1'?'Thank you. Your quote request has been sent.':(errors[formParams.get('error')]||'Your request could not be sent. Please try again.');
  history.replaceState(null,'',location.pathname+location.hash);
}
const question=$('#captcha-question'),token=$('#captcha-token');
async function refreshChallenge(){if(!question||!token)return;question.textContent='Loading…';try{const r=await fetch('challenge.php',{cache:'no-store',credentials:'same-origin'});if(!r.ok)throw new Error('challenge unavailable');const d=await r.json();question.textContent=d.question;token.value=d.token;}catch(e){question.textContent='Refresh page';token.value='';}}
refreshChallenge();
const banner=$('#cookie-banner'),modal=$('#cookie-modal'),analytics=$('#analytics-choice');const consentKey='erics-flooring-cookie-consent';function readConsent(){try{return JSON.parse(localStorage.getItem(consentKey)||'null')}catch(e){return null}}function showBanner(){if(!readConsent())banner.hidden=false}function saveConsent(analyticsAllowed){localStorage.setItem(consentKey,JSON.stringify({essential:true,analytics:!!analyticsAllowed,updated:new Date().toISOString()}));banner.hidden=true;modal.hidden=true}showBanner();$('#cookie-accept').addEventListener('click',()=>saveConsent(true));$('#cookie-reject').addEventListener('click',()=>saveConsent(false));function openSettings(){const c=readConsent();analytics.checked=!!(c&&c.analytics);modal.hidden=false}$('#cookie-customize').addEventListener('click',openSettings);$('#privacy-settings').addEventListener('click',openSettings);$('#cookie-close').addEventListener('click',()=>modal.hidden=true);$('#cookie-save').addEventListener('click',()=>saveConsent(analytics.checked));$('#cookie-modal-accept').addEventListener('click',()=>saveConsent(true));modal.addEventListener('click',e=>{if(e.target===modal)modal.hidden=true});
// Build interactive gallery filters from the category labels on the supplied project images.
const galleryGrid=$('#gallery-grid'),filterHost=$('#gallery-filters');
if(galleryGrid&&filterHost){
  const galleryItems=$$('.gallery-item');
  const categories=[...new Set(galleryItems.map(item=>item.querySelector('span')?.textContent.trim()).filter(Boolean))];
  const filterOptions=['All projects',...categories];
  filterOptions.forEach((category,index)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='gallery-filter';
    button.textContent=category;
    button.setAttribute('aria-pressed',index===0?'true':'false');
    button.addEventListener('click',()=>{
      filterHost.querySelectorAll('.gallery-filter').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
      galleryItems.forEach(item=>{
        const itemCategory=item.querySelector('span')?.textContent.trim()||'';
        item.hidden=index!==0&&itemCategory!==category;
      });
    });
    filterHost.appendChild(button);
  });
}
const lightbox=$('#lightbox'),lbimg=$('#lightbox-image');$$('.gallery-item').forEach(btn=>btn.addEventListener('click',()=>{const img=btn.querySelector('img');lbimg.src=btn.dataset.src;lbimg.alt=img.alt;lightbox.hidden=false}));function closeLightbox(){lightbox.hidden=true;lbimg.src=''}$('#lightbox-close').addEventListener('click',closeLightbox);lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){modal.hidden=true;closeLightbox()}});
// Form posts to PHP on Enhance hosting. CAPTCHA and honeypot are validated server-side.


// Homepage hero image slider: selected from the highest-resolution supplied project photos.
const heroImage=$('.hero-image');
const heroDots=$$('.hero-dot');
const heroSlides=[
  'assets/Restoration%20and%20refurbishing/WhatsApp%20Image%202026-10-22%20at%2017.09.35%20%283%29.jpeg',
  'assets/Oregon%20pine%20strip%20flooring/WhatsApp%20Image%202026-10-22%20at%2016.34.29%20%282%29.jpeg',
  'assets/Sanding%20and%20sealing%20of%20wooden%20flooring/WhatsApp%20Image%202026-10-22%20at%2016.34.34.jpeg'
];
let heroSlideIndex=0;
function showHeroSlide(index){
  if(!heroImage)return;
  heroSlideIndex=(index+heroSlides.length)%heroSlides.length;
  heroImage.classList.add('is-changing');
  window.setTimeout(()=>{
    heroImage.style.backgroundImage=`url("${heroSlides[heroSlideIndex]}")`;
    heroImage.classList.remove('is-changing');
    heroDots.forEach((dot,i)=>{dot.classList.toggle('active',i===heroSlideIndex);dot.setAttribute('aria-pressed',String(i===heroSlideIndex));});
  },180);
}
heroDots.forEach(dot=>dot.addEventListener('click',()=>showHeroSlide(Number(dot.dataset.slide))));
if(heroImage){
  heroImage.style.backgroundImage=`url("${heroSlides[0]}")`;
  window.setInterval(()=>showHeroSlide(heroSlideIndex+1),6000);
}

// Switch between the photo gallery and the new video gallery tab.
const galleryModeTabs=$$('.gallery-mode-tab');
const videoGallery=$('#video-gallery-grid');
const videoGalleryIntro=$('#video-gallery-heading');
const photoGallery=$('#gallery-grid');
const photoFilters=$('#gallery-filters');
galleryModeTabs.forEach(tab=>tab.addEventListener('click',()=>{
  const videos=tab.dataset.galleryMode==='videos';
  galleryModeTabs.forEach(other=>{
    const active=other===tab;
    other.classList.toggle('active',active);
    other.setAttribute('aria-selected',String(active));
  });
  if(photoGallery)photoGallery.hidden=videos;
  if(photoFilters)photoFilters.hidden=videos;
  if(videoGallery)videoGallery.hidden=!videos;
  if(videoGalleryIntro)videoGalleryIntro.hidden=!videos;
  if(!videos&&videoGallery)videoGallery.querySelectorAll('video').forEach(video=>video.pause());
}));

// The English root chooses a locale on the first visit; named locales and crawlers keep their URLs.
export const chooseLocale = `(function(){try{
  var ua=navigator.userAgent||'';if(navigator.webdriver||/bot|crawl|spider|slurp|preview|lighthouse|headless/i.test(ua))return;
  var P={'en':'','zh-CN':'zh','ja':'ja','ko':'ko','es':'es','fr':'fr','de':'de','pt-BR':'pt-br'};
  var ls=window.localStorage,pick=ls.getItem('aw-lang'),seen=ls.getItem('aw-seen');ls.setItem('aw-seen','1');
  if(!pick&&seen)pick=ls.getItem('aw-auto');
  if(!pick){if(seen)return;var L=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||''];
    pick='en';for(var i=0;i<L.length;i++){var t=String(L[i]).toLowerCase(),b=t.split('-')[0];
      if(b==='zh'){pick='zh-CN';break}if(b==='pt'){pick='pt-BR';break}if(/^(en|ja|ko|es|fr|de)$/.test(b)){pick=b;break}}ls.setItem('aw-auto',pick)}
  var path=P[pick];if(path)location.replace('/'+path+'/'+location.search+location.hash);
}catch(e){}})();`;

// Apply the reader's choice (Chrome.tsx ThemeButton), or the system setting, before the first paint.
export const applyBlogTheme = `try{var r=document.documentElement,c=localStorage.getItem('aw-blog-theme');r.dataset.blogMode=c==='paper'||c==='dark'?c:matchMedia('(prefers-color-scheme: light)').matches?'paper':'dark';if(r.dataset.blogMode==='paper')document.querySelector('meta[name="theme-color"]').setAttribute('content','#F4F3EF')}catch(e){}`;

export const prepareAnimations = `try{document.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('reveal-pending')}catch(e){}`;

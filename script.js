const btn=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');btn?.addEventListener('click',()=>nav.classList.toggle('open'));document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

// Build an individual playable card for every track in each SoundCloud playlist.
(function(){
  const apiScript=document.createElement('script');
  apiScript.src='https://w.soundcloud.com/player/api.js';
  apiScript.onload=()=>{
    const playlists=[
      {source:'ride-my-wave-source', target:'ride-my-wave-tracks'},
      {source:'free-album-source', target:'free-album-tracks'}
    ];
    playlists.forEach(({source,target})=>{
      const iframe=document.getElementById(source), container=document.getElementById(target);
      if(!iframe||!container) return;
      const widget=SC.Widget(iframe);
      widget.bind(SC.Widget.Events.READY,()=>{
        widget.getSounds(sounds=>{
          if(!Array.isArray(sounds)||!sounds.length){
            container.innerHTML='<p class="track-error">The playlist is available on SoundCloud, but its track list could not be loaded here.</p>';
            return;
          }
          container.innerHTML='';
          sounds.forEach((sound,index)=>{
            const url=sound.permalink_url || sound.uri;
            const title=sound.title || `Track ${index+1}`;
            const artist=sound.user && sound.user.username ? sound.user.username : 'Sage Mac';
            if(!url) return;
            const item=document.createElement('article');
            item.className='track-item';
            item.innerHTML=`<div class="track-meta"><div><div class="track-number">TRACK ${String(index+1).padStart(2,'0')}</div><h4 class="track-title"></h4><div class="track-artist"></div></div></div>`;
            item.querySelector('.track-title').textContent=title;
            item.querySelector('.track-artist').textContent=artist;
            const player=document.createElement('iframe');
            player.className='track-player';
            player.loading='lazy';
            player.allow='autoplay';
            player.title=`Play ${title} on SoundCloud`;
            player.src='https://w.soundcloud.com/player/?url='+encodeURIComponent(url)+'&color=%23b8ff18&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&show_artwork=true';
            item.appendChild(player);
            container.appendChild(item);
          });
        });
      });
    });
  };
  document.head.appendChild(apiScript);
})();

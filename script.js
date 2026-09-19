const btn=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');btn?.addEventListener('click',()=>nav.classList.toggle('open'));document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

// Build clean, Sage Mac-style track cards while using SoundCloud's official widget behind the scenes.
(function(){
  const apiScript=document.createElement('script');
  apiScript.src='https://w.soundcloud.com/player/api.js';
  apiScript.onload=()=>{
    const playlists=[
      {source:'ride-my-wave-source', target:'ride-my-wave-tracks'},
      {source:'free-album-source', target:'free-album-tracks'}
    ];
    let active={widget:null, button:null};

    function stopActive(except){
      if(active.widget && active.widget!==except){
        try{active.widget.pause();}catch(e){}
        if(active.button){active.button.classList.remove('is-playing'); active.button.textContent='▶'; active.button.setAttribute('aria-label','Play track');}
      }
    }

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
            const artwork=sound.artwork_url || 'assets/maclabs-cover.png';
            const button=document.createElement('button');
            button.className='track-play';
            button.type='button';
            button.textContent='▶';
            button.setAttribute('aria-label',`Play ${title}`);

            item.innerHTML=`
              <img class="track-art" src="${artwork}" alt="" loading="lazy">
              <div class="track-copy">
                <div class="track-number">${String(index+1).padStart(2,'0')}</div>
                <h4 class="track-title"></h4>
                <div class="track-artist"></div>
                <div class="track-source">SOUNDCLOUD</div>
              </div>
              <div class="track-action"></div>`;
            item.querySelector('.track-title').textContent=title;
            item.querySelector('.track-artist').textContent=artist;
            item.querySelector('.track-action').appendChild(button);
            container.appendChild(item);

            const player=document.createElement('iframe');
            player.className='track-player-hidden';
            player.loading='lazy';
            player.allow='autoplay';
            player.title=`SoundCloud player for ${title}`;
            player.src='https://w.soundcloud.com/player/?url='+encodeURIComponent(url)+'&color=%23b8ff18&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=false';
            item.appendChild(player);
            const trackWidget=SC.Widget(player);

            trackWidget.bind(SC.Widget.Events.PLAY,()=>{
              stopActive(trackWidget);
              active={widget:trackWidget,button};
              button.classList.add('is-playing');
              button.textContent='❚❚';
              button.setAttribute('aria-label',`Pause ${title}`);
              item.classList.add('playing');
            });
            trackWidget.bind(SC.Widget.Events.PAUSE,()=>{
              if(active.widget===trackWidget){
                button.classList.remove('is-playing');
                button.textContent='▶';
                button.setAttribute('aria-label',`Play ${title}`);
                item.classList.remove('playing');
                active={widget:null,button:null};
              }
            });
            trackWidget.bind(SC.Widget.Events.FINISH,()=>{
              button.classList.remove('is-playing');
              button.textContent='▶';
              button.setAttribute('aria-label',`Play ${title}`);
              item.classList.remove('playing');
              if(active.widget===trackWidget) active={widget:null,button:null};
            });
            button.addEventListener('click',()=>{
              trackWidget.isPaused(paused=>{
                if(paused){ stopActive(trackWidget); trackWidget.play(); }
                else trackWidget.pause();
              });
            });
          });
        });
      });
    });
  };
  document.head.appendChild(apiScript);
})();

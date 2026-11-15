/* Bedwars User Guide: background music player + header butterflies.
   Music by Micah Fischer (https://www.youtube.com/@too_many_fish), used with permission. */
(function(){
  var TRACKS = [{"t":"Season 9 Lobby Music","f":"music/season-9-lobby-music.mp3","d":235},{"t":"Adetunde Boss Music","f":"music/adetunde-boss-music.mp3","d":190},{"t":"Angel Wings Win Effect Music","f":"music/angel-wings-win-effect-music.mp3","d":64},{"t":"Barbarian Animation Music","f":"music/barbarian-animation-music.mp3","d":122},{"t":"Conga Line Emote Music","f":"music/conga-line-emote-music.mp3","d":54},{"t":"Crab Dance Emote Music","f":"music/crab-dance-emote-music.mp3","d":69},{"t":"Crypt Boss","f":"music/crypt-boss.mp3","d":159},{"t":"Egyptian Dance Emote Music","f":"music/egyptian-dance-emote-music.mp3","d":41},{"t":"Festive Melody","f":"music/festive-melody.mp3","d":113},{"t":"Final Minute","f":"music/final-minute.mp3","d":69},{"t":"Flower Lobby Music","f":"music/flower-lobby-music.mp3","d":190},{"t":"Funky Dance Emote Music","f":"music/funky-dance-emote-music.mp3","d":51},{"t":"Goodnight Dance Emote Music","f":"music/goodnight-dance-emote-music.mp3","d":35},{"t":"Halloween Hub (Season 2)","f":"music/halloween-hub-season-2.mp3","d":168},{"t":"Halloween-ified In-Match Music","f":"music/halloween-ified-in-match-music.mp3","d":310},{"t":"Hope Cinematic","f":"music/hope-cinematic.mp3","d":147},{"t":"In-Match Music","f":"music/in-match-music.mp3","d":313},{"t":"Infected Mode In-Game Music","f":"music/infected-mode-in-game-music.mp3","d":360},{"t":"Kingdom Lobby Halloween-ified","f":"music/kingdom-lobby-halloween-ified.mp3","d":236},{"t":"Kingdom Lobby","f":"music/kingdom-lobby.mp3","d":215},{"t":"Live Pirate Event","f":"music/live-pirate-event.mp3","d":116},{"t":"Maple Isles (Season 4 Lobby Music)","f":"music/maple-isles-season-4-lobby-music.mp3","d":210},{"t":"Minigame Mountain","f":"music/minigame-mountain.mp3","d":106},{"t":"Mountain Snowflakes","f":"music/mountain-snowflakes.mp3","d":130},{"t":"PVP Arena Music","f":"music/pvp-arena-music.mp3","d":65},{"t":"Pirate Lobby","f":"music/pirate-lobby.mp3","d":211},{"t":"Rain Dance Emote Music","f":"music/rain-dance-emote-music.mp3","d":48},{"t":"Scarecrow Melody","f":"music/scarecrow-melody.mp3","d":111},{"t":"Season 10 Lobby Music","f":"music/season-10-lobby-music.mp3","d":275},{"t":"Season 11 Halloween Lobby Music","f":"music/season-11-halloween-lobby-music.mp3","d":318},{"t":"Season 11 Lobby Music","f":"music/season-11-lobby-music.mp3","d":303},{"t":"Season 12 Trailer Music","f":"music/season-12-trailer-music.mp3","d":51},{"t":"Season 13 Lobby Intro & Cinematic Music","f":"music/season-13-lobby-intro-cinematic-music.mp3","d":65},{"t":"Season 7 Trailer Music","f":"music/season-7-trailer-music.mp3","d":47},{"t":"Season 8 Lobby","f":"music/season-8-lobby.mp3","d":188},{"t":"Silly Legs Dance Emote Music","f":"music/silly-legs-dance-emote-music.mp3","d":59},{"t":"Siren Melody","f":"music/siren-melody.mp3","d":109},{"t":"Snowboarding Mini-Game Music","f":"music/snowboarding-mini-game-music.mp3","d":89},{"t":"Snowflakes in the Sky","f":"music/snowflakes-in-the-sky.mp3","d":220},{"t":"Spider Queen Boss Music","f":"music/spider-queen-boss-music.mp3","d":141},{"t":"Spirit Island (BedWars Season 12 Lobby Music)","f":"music/spirit-island-bedwars-season-12-lobby-music.mp3","d":197},{"t":"Sudden Death","f":"music/sudden-death.mp3","d":197},{"t":"The Battle of the Infernal Dragon - Ranked","f":"music/the-battle-of-the-infernal-dragon-ranked.mp3","d":153},{"t":"The Forge | Ranked","f":"music/the-forge-ranked.mp3","d":76},{"t":"The Penguin King - Penguin Survival","f":"music/the-penguin-king-penguin-survival.mp3","d":158},{"t":"The Penguins Are Coming - Penguin Survival","f":"music/the-penguins-are-coming-penguin-survival.mp3","d":185},{"t":"The Void","f":"music/the-void.mp3","d":202},{"t":"Thriller Emote Music","f":"music/thriller-emote-music.mp3","d":41},{"t":"Victory! - Penguin Survival","f":"music/victory-penguin-survival.mp3","d":69},{"t":"Welcome to the Mountain","f":"music/welcome-to-the-mountain.mp3","d":43},{"t":"Winter Spirit Island (BedWars Season 12 Winter Lobby Music)","f":"music/winter-spirit-island-bedwars-season-12-winter-lobby-music.mp3","d":197}];
  var ARTIST = "Micah Fischer", LINK = "https://www.youtube.com/@too_many_fish";
  var FADE_IN = 2.5, FADE_OUT = 3, SKIP_FADE = 0.7;

  function $(id){ return document.getElementById(id); }
  function ls(k,v){ try{ if(v===undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k,JSON.stringify(v)); }catch(e){ return null; } }
  function ss(k,v){ try{ if(v===undefined) return JSON.parse(sessionStorage.getItem(k)); sessionStorage.setItem(k,JSON.stringify(v)); }catch(e){ return null; } }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
  function fmt(t){ t=Math.max(0,Math.floor(t||0)); return Math.floor(t/60)+":"+("0"+t%60).slice(-2); }

  /* ---------- state ---------- */
  var off = ls("bwMusicOff") || [];            // titles the visitor removed
  var vol = ls("bwMusicVol"); if(vol==null) vol = 0.5;
  var open = !!ls("bwMusicOpen");
  var sess = ss("bwMusic") || {i:0, t:0, playing:false};
  var cur = Math.min(sess.i||0, TRACKS.length-1), playing = false, wantPlay = !!sess.playing;
  var audio = new Audio(); audio.preload = "none";
  var actx = null, gain = null, fadeLevel = 0, fadeTimer = null, switching = false;

  function enabled(i){ return off.indexOf(TRACKS[i].t) < 0; }
  function nextIndex(from, dir){
    for(var n=1;n<=TRACKS.length;n++){ var j=((from+dir*n)%TRACKS.length+TRACKS.length)%TRACKS.length; if(enabled(j)) return j; }
    return -1;
  }
  function applyVol(){ var v = vol*fadeLevel; if(gain) gain.gain.value = v; else audio.volume = Math.max(0,Math.min(1,v)); }
  function ensureCtx(){
    if(actx) return;
    try{
      var AC = window.AudioContext || window.webkitAudioContext; if(!AC) return;
      actx = new AC(); var src = actx.createMediaElementSource(audio); gain = actx.createGain();
      src.connect(gain); gain.connect(actx.destination); audio.volume = 1; applyVol();
    }catch(e){ actx = null; gain = null; }
  }
  function fadeTo(target, secs, done){
    clearInterval(fadeTimer); var start = fadeLevel, t0 = performance.now();
    if(secs<=0){ fadeLevel = target; applyVol(); if(done) done(); return; }
    fadeTimer = setInterval(function(){
      var k = Math.min(1,(performance.now()-t0)/(secs*1000)); fadeLevel = start+(target-start)*k; applyVol();
      if(k>=1){ clearInterval(fadeTimer); if(done) done(); }
    }, 30);
  }
  function load(i, at){
    cur = i; audio.src = TRACKS[i].f; audio.preload = "auto";
    if(at){ var seek = function(){ try{ audio.currentTime = at; }catch(e){} audio.removeEventListener("loadedmetadata",seek); }; audio.addEventListener("loadedmetadata",seek); }
    save(); render();
  }
  function play(fromStart){
    if(!enabled(cur)){ var j = nextIndex(cur,1); if(j<0) return; load(j,0); }
    if(!audio.src || audio.src.indexOf(TRACKS[cur].f)<0) load(cur, fromStart?0:sess.t);
    ensureCtx(); if(actx && actx.state==="suspended") actx.resume();
    fadeLevel = 0; applyVol();
    var p = audio.play();
    var ok = function(){ playing = true; wantPlay = true; fadeTo(1, audio.currentTime<1?FADE_IN:1.2); save(); render(); setFlight(true); };
    if(p && p.then) p.then(ok).catch(function(){ playing = false; wantPlay = true; render(); armResume(); }); else ok();
  }
  function pause(){
    wantPlay = false; save();
    fadeTo(0, 0.6, function(){ audio.pause(); playing = false; render(); });
    playing = false; render(); setFlight(false);
  }
  function go(j){
    if(j<0 || switching) return;
    var start = function(){ switching = false; load(j,0); sess.t = 0; if(wantPlay) play(true); else render(); };
    if(playing){ switching = true; fadeTo(0, SKIP_FADE, function(){ audio.pause(); start(); }); } else start();
  }
  function skip(){ go(nextIndex(cur,1)); }
  function back(){ if(audio.currentTime>4 && playing){ fadeTo(0,.4,function(){ audio.currentTime=0; fadeTo(1,1.2); }); } else go(nextIndex(cur,-1)); }
  function save(){ ss("bwMusic",{i:cur, t:audio.currentTime||sess.t||0, playing:wantPlay}); }

  audio.addEventListener("timeupdate", function(){
    var d = audio.duration, t = audio.currentTime;
    if(d && playing && !switching && d-t < FADE_OUT && fadeLevel>0.99){ fadeTo(0, Math.max(.2,d-t)); }
    sess.t = t; var bar = $("bwmBar"); if(bar && d) bar.style.width = (t/d*100)+"%";
    var tm = $("bwmTime"); if(tm) tm.textContent = fmt(t)+" / "+fmt(d||TRACKS[cur].d);
  });
  audio.addEventListener("ended", function(){ var j = nextIndex(cur,1); if(j<0) return; load(j,0); play(true); });
  window.addEventListener("pagehide", save);
  window.addEventListener("beforeunload", save);
  setInterval(function(){ if(playing) save(); }, 2000);

  /* If the browser blocks autoplay after changing pages, resume on the first click or key press. */
  var armed = false;
  function armResume(){
    if(armed) return; armed = true;
    var h = function(e){ if(e.target.closest && e.target.closest("#bwm")) return; armed = false; ["pointerdown","keydown"].forEach(function(n){ document.removeEventListener(n,h,true); }); if(wantPlay && !playing) play(); };
    ["pointerdown","keydown"].forEach(function(n){ document.addEventListener(n,h,true); });
  }

  /* ---------- UI ---------- */
  var ICON = {
    note:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18.5a2.5 2.5 0 1 1-2-2.45V5.5l11-2.5v12.5a2.5 2.5 0 1 1-2-2.45V7.1L9 8.7z" fill="currentColor"/></svg>',
    play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
    pause:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>',
    next:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6v12l8.5-6zM16 6h2.5v12H16z" fill="currentColor"/></svg>',
    prev:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6v12l-8.5-6zM5.5 6H8v12H5.5z" fill="currentColor"/></svg>',
    list:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h12v2H4zM4 11h12v2H4zM4 16h8v2H4zM18 14v6l4-3z" fill="currentColor"/></svg>',
    vol:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };
  function build(){
    var w = document.createElement("div"); w.id = "bwm"; w.className = open ? "open" : "";
    w.innerHTML =
      '<button class="bwm-fab" id="bwmFab" aria-label="Music player" aria-expanded="'+open+'">'+ICON.note+'<span class="eq"><i></i><i></i><i></i></span></button>'+
      '<div class="bwm-card" role="region" aria-label="Music player">'+
        '<div class="bwm-top"><div class="bwm-now"><small>Now playing</small><b id="bwmTitle"></b><a href="'+LINK+'" target="_blank" rel="noopener">Music by '+ARTIST+'</a></div>'+
        '<button class="bwm-x" id="bwmClose" aria-label="Hide player">×</button></div>'+
        '<div class="bwm-prog"><span id="bwmBar"></span></div><div class="bwm-time" id="bwmTime">0:00</div>'+
        '<div class="bwm-ctl"><button id="bwmPrev" aria-label="Previous song">'+ICON.prev+'</button><button class="big" id="bwmPlay" aria-label="Play">'+ICON.play+'</button><button id="bwmNext" aria-label="Next song">'+ICON.next+'</button>'+
        '<button id="bwmListBtn" aria-label="Song list" aria-expanded="false">'+ICON.list+'</button></div>'+
        '<label class="bwm-vol">'+ICON.vol+'<input type="range" id="bwmVol" min="0" max="1" step="0.01" aria-label="Volume"></label>'+
        '<div class="bwm-list hidden" id="bwmList"><div class="bwm-lh"><span id="bwmCount"></span><button id="bwmReset">Reset</button></div><ul id="bwmUl"></ul></div>'+
      '</div>';
    document.body.appendChild(w);
    $("bwmFab").onclick = function(){ open = !open; ls("bwMusicOpen",open); w.className = open ? "open" : ""; this.setAttribute("aria-expanded",open); if(open && !playing && !wantPlay && !sess.t) play(); };
    $("bwmClose").onclick = function(){ open = false; ls("bwMusicOpen",false); w.className = ""; $("bwmFab").setAttribute("aria-expanded",false); };
    $("bwmPlay").onclick = function(){ playing ? pause() : play(); };
    $("bwmNext").onclick = skip; $("bwmPrev").onclick = back;
    $("bwmVol").value = vol; $("bwmVol").oninput = function(){ vol = +this.value; ls("bwMusicVol",vol); applyVol(); };
    $("bwmListBtn").onclick = function(){ var l = $("bwmList"), h = l.classList.toggle("hidden"); this.setAttribute("aria-expanded",!h); if(!h){ var c = l.querySelector(".cur"); if(c) c.scrollIntoView({block:"nearest"}); } };
    $("bwmReset").onclick = function(){ off = []; ls("bwMusicOff",off); renderList(); };
    $("bwmUl").addEventListener("click", function(e){
      var cb = e.target.closest("input"), li = e.target.closest("li"); if(!li) return; var i = +li.getAttribute("data-i");
      if(cb){ var t = TRACKS[i].t, k = off.indexOf(t); if(cb.checked && k>=0) off.splice(k,1); if(!cb.checked && k<0) off.push(t);
        if(off.length>=TRACKS.length){ off.splice(off.indexOf(t),1); cb.checked = true; } ls("bwMusicOff",off); renderList(); if(!cb.checked && i===cur && playing) skip(); return; }
      if(!enabled(i)){ var k2 = off.indexOf(TRACKS[i].t); off.splice(k2,1); ls("bwMusicOff",off); }
      wantPlay = true; go(i);
    });
    renderList(); render();
  }
  function renderList(){
    var on = TRACKS.filter(function(_,i){return enabled(i);}).length;
    $("bwmCount").textContent = on+" of "+TRACKS.length+" songs on";
    $("bwmUl").innerHTML = TRACKS.map(function(s,i){
      return '<li data-i="'+i+'" class="'+(i===cur?"cur":"")+(enabled(i)?"":" offs")+'"><input type="checkbox" '+(enabled(i)?"checked":"")+' aria-label="Include '+esc(s.t)+'"><span>'+esc(s.t)+'</span><em>'+fmt(s.d)+'</em></li>';
    }).join("");
  }
  function render(){
    if(!$("bwm")) return;
    $("bwmTitle").textContent = TRACKS[cur].t;
    if(!playing && !audio.duration){ var tm = $("bwmTime"); if(tm) tm.textContent = fmt(sess.t)+" / "+fmt(TRACKS[cur].d); var bar = $("bwmBar"); if(bar) bar.style.width = (sess.t/TRACKS[cur].d*100)+"%"; }
    $("bwmPlay").innerHTML = playing ? ICON.pause : ICON.play; $("bwmPlay").setAttribute("aria-label", playing ? "Pause" : "Play");
    $("bwm").classList.toggle("playing", playing); $("bwm").classList.toggle("waiting", wantPlay && !playing);
    var lis = document.querySelectorAll("#bwmUl li"); lis.forEach(function(li){ li.classList.toggle("cur", +li.getAttribute("data-i")===cur); });
  }

  /* ---------- header butterflies ---------- */
  var flight = 1, flightTarget = 1;
  function setFlight(on){ flightTarget = on ? 1.9 : 1; }
  function butterflies(){
    var head = document.querySelector(".site-head"); if(!head) return;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var layer = document.createElement("div"); layer.className = "bwf"; layer.setAttribute("aria-hidden","true"); head.insertBefore(layer, head.firstChild);
    var COLORS = [["#e9dcff","#b79bff"],["#ffd6f5","#d48ce8"],["#d6ecff","#8fb8ff"],["#fff1c9","#e8b860"]];
    var N = reduce ? 0 : (head.clientWidth < 600 ? 5 : 9), B = [];
    for(var n=0;n<N;n++){
      var c = COLORS[n%COLORS.length], el = document.createElement("i"), s = 0.7+Math.random()*0.6;
      el.innerHTML = '<svg viewBox="0 0 40 32"><g class="wl"><path d="M20 16C14 4 3 2 3 9c0 6 8 8 17 7z" fill="'+c[0]+'"/><path d="M20 16c-8 2-14 5-12 10 2 4 9 1 12-10z" fill="'+c[1]+'"/></g><g class="wr"><path d="M20 16C26 4 37 2 37 9c0 6-8 8-17 7z" fill="'+c[0]+'"/><path d="M20 16c8 2 14 5 12 10-2 4-9 1-12-10z" fill="'+c[1]+'"/></g><rect x="19" y="9" width="2" height="15" rx="1" fill="#3a2470"/></svg>';
      layer.appendChild(el);
      B.push({el:el, x:Math.random(), y:0.15+Math.random()*0.7, a:Math.random()*6.28, sp:0.025+Math.random()*0.02, ph:Math.random()*6.28, fl:9+Math.random()*4, s:s, wob:Math.random()*100});
    }
    var last = performance.now();
    function tick(now){
      var dt = Math.min(0.05,(now-last)/1000); last = now;
      flight += (flightTarget-flight)*Math.min(1,dt*1.5);
      var W = head.clientWidth, H = head.clientHeight;
      B.forEach(function(b){
        b.wob += dt; b.a += (Math.sin(b.wob*0.9)+Math.sin(b.wob*0.37+b.s*5))*0.6*dt*flight;
        var v = b.sp*flight;
        b.x += Math.cos(b.a)*v*dt*(H/W)*3; b.y += Math.sin(b.a)*v*dt*3 + Math.sin(b.ph)*0.002*flight;
        if(b.x<-0.05) b.x = 1.05; if(b.x>1.05) b.x = -0.05;
        if(b.y<0.08){ b.y = 0.08; b.a = Math.abs(b.a)%6.28; } if(b.y>0.92){ b.y = 0.92; b.a = -Math.abs(b.a)%6.28; }
        b.ph += dt*b.fl*(0.75+0.45*flight);
        var f = 0.25+0.75*Math.abs(Math.cos(b.ph)), dir = Math.cos(b.a)<0 ? -1 : 1, tilt = Math.sin(b.a)*20;
        b.el.style.transform = "translate("+(b.x*W-14)+"px,"+(b.y*H-11)+"px) scale("+(b.s*dir)+","+b.s+") rotate("+(tilt*dir)+"deg)";
        b.el.style.setProperty("--f", f.toFixed(3));
      });
      requestAnimationFrame(tick);
    }
    if(N) requestAnimationFrame(tick);
  }

  function init(){
    build(); butterflies();
    if(sess.i!=null){ cur = Math.min(sess.i, TRACKS.length-1); }
    render();
    if(wantPlay){ load(cur, sess.t||0); play(); }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

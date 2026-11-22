const cv=document.getElementById('c'),ctx=cv.getContext('2d'),$=id=>document.getElementById(id);
const TAU=Math.PI*2,DZ=3,N=46,SEG=20;let W,H,U;
function resize(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0);U=Math.min(H*.62,W*.8)}
addEventListener('resize',resize);resize();
const sc=z=>1/(1+z*.085),bx=z=>7*Math.sin(z*.011)+4*Math.sin(z*.027+1),by=z=>4*Math.sin(z*.014+2)+2*Math.sin(z*.035),tw=z=>.9*Math.sin(z*.008)+.5*Math.sin(z*.021);
const ang=(a,b)=>{let d=(a-b)%TAU;if(d<0)d+=TAU;return d>Math.PI?TAU-d:d};
let best=0;try{best=+localStorage.getItem('vortex-best')||0}catch(e){}
let AC;function beep(f,d=.1,t='sine',v=.07){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime;o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(n+d)}catch(e){}}
let DM=1,S,mode='menu';const keys={l:0,r:0},ptr={l:0,r:0},stars=Array.from({length:60},()=>({a:Math.random()*TAU,d:Math.random()}));
function reset(){S={pz:S?S.pz:0,z0:S?S.pz:0,pa:0,cam:0,v:30,t:0,score:0,lives:3,phase:40,phaseOn:0,inv:0,boost:0,shake:0,cd:0,streak:0,mult:1,maxm:1,shown:0,gain:0,gt:0,gate:0,close:0,orbs:0,obj:[],nextZ:(S?S.pz:0)+100,stage:1}}
const L=()=>Math.min(1,S.t*DM/150);
reset();
const cxy=z=>[W/2+(bx(S.pz+z)-bx(S.pz))*U*.03,H*.4+(by(S.pz+z)-by(S.pz))*U*.03];
const SA=(a,zw)=>a-S.cam+1.5708+tw(zw)-tw(S.pz+4);
const pul=(zw)=>1+.05*Math.sin(zw*.25+S.t*4);
function msg(t,c){const m=$('msg');m.textContent=t;m.style.color=c||'var(--c)';m.classList.remove('pop');void m.offsetWidth;m.classList.add('pop')}
function spawn(){while(S.nextZ<S.pz+140){const z=S.nextZ,l=L(),n=l>.3&&Math.random()<.1+l*.25?2:1,sp=l>.15&&Math.random()<.5*Math.min(1,(l-.15)/.5)?(Math.random()<.5?-1:1)*(.3+.7*l):0,gc=Math.random()*TAU,gh=(1.5-1.0*l)*(n==2?.8:1);
S.obj.push({k:'g',z,gc,gh,n,sp});
if(Math.random()<.85-l*.3)for(let i=0;i<3;i++)S.obj.push({k:'o',z:z+8+i*3,a:sp?Math.random()*TAU:gc});
if(Math.random()<.18)S.obj.push({k:'b',z:z+13,a:Math.random()*TAU});
S.nextZ+=40-22*l}}
const F=()=>.6+.4*DM;
function award(p,k){const g=Math.round(p*S.mult*F());S.score+=g;S.gain=g;S.gt=1.3;if(k){S.streak+=k;const m=Math.min(5,1+Math.floor(S.streak/4));if(m>S.mult){S.mult=m;S.maxm=Math.max(S.maxm,m);const e=$('mx');e.classList.remove('up');void e.offsetWidth;e.classList.add('up');beep(900+m*90,.14,'triangle')}}}
function hit(){S.lives--;S.inv=1.6;S.shake=1;S.v=24;S.streak=0;S.mult=1;beep(90,.4,'sawtooth',.12);msg(t('crash'),'var(--r)');if(S.lives<=0)over()}
function phaseGo(){if(mode!='play'||S.phaseOn>0)return;if(S.cd>0||S.phase<30){beep(160,.08,'square',.04);for(const e of [$('bar'),$('pk')]){e.classList.remove('no');void e.offsetWidth;e.classList.add('no')}return}S.phase-=30;S.phaseOn=1.6;S.cd=4.5;beep(300,.35,'triangle');msg(t('phase'),'var(--a)')}
function step(dt){S.t+=dt;spawn();
const l=L(),tv=(20+48*l)*(S.boost>0?1.4:1),st=1+Math.floor(l*8);if(st>S.stage){S.stage=st;award(300,0);msg(t('stage')+' '+st,'var(--c)')}S.v+=(tv-S.v)*Math.min(1,dt*2);S.pz+=S.v*dt;
S.pa+=((keys.l||ptr.l)-(keys.r||ptr.r))*3.3*dt;S.cam+=(S.pa-S.cam)*Math.min(1,dt*9);
S.inv=Math.max(0,S.inv-dt);S.cd=Math.max(0,S.cd-dt);S.boost=Math.max(0,S.boost-dt);S.phaseOn=Math.max(0,S.phaseOn-dt);S.shake*=Math.pow(.02,dt);S.score+=S.v*dt*.2*S.mult*F();S.shown+=(S.score-S.shown)*Math.min(1,dt*10);S.gt=Math.max(0,S.gt-dt);
for(const o of S.obj){if(o.d||o.z>S.pz+4)continue;o.d=1;
if(o.k=='g'){const gc=o.gc+o.sp*S.t;let d=9;for(let k=0;k<o.n;k++)d=Math.min(d,ang(S.pa,gc+k*TAU/o.n));
if(d>o.gh-.09){if(S.phaseOn>0){award(50,0);msg(t('pass')+' +'+S.gain,'var(--a)')}else if(S.inv<=0)hit()}
else if(o.gh-d<.22){award(250,2);S.close++;S.gate++;S.phase=Math.min(100,S.phase+10);msg(t('close')+' +'+S.gain,'var(--c)');beep(700+S.mult*70,.08,'square')}else{award(100,1);S.gate++;beep(520,.05,'sine',.04)}}
else if(o.k=='o'&&ang(S.pa,o.a)<.34){award(50,0);S.orbs++;S.phase=Math.min(100,S.phase+20);beep(1200,.07)}
else if(o.k=='b'&&ang(S.pa,o.a)<.42){S.boost=1.6;S.shake=.5;award(150,0);msg(t('boost')+' +'+S.gain,'var(--b)');beep(500,.4,'sawtooth',.06)}}
S.obj=S.obj.filter(o=>o.z>S.pz-6);
for(const s of stars){s.d+=dt*(S.v/40);if(s.d>1){s.d=0;s.a=Math.random()*TAU}}}
function over(){mode='over';if(S.score>best){best=Math.floor(S.score);try{localStorage.setItem('vortex-best',best)}catch(e){}}
setTimeout(()=>{showOver();$('ov').classList.remove('hide');$('ph').classList.add('hide');document.body.classList.remove('playing')},700)}
function start(){reset();mode='play';document.body.classList.add('playing');$('ov').classList.add('hide');if('ontouchstart' in window||navigator.maxTouchPoints>0)$('ph').classList.remove('hide');beep(440,.15);msg(t('stage')+' 1','var(--c)')}
document.querySelectorAll('#lv button').forEach(b=>b.onclick=()=>{DM=+b.dataset.m;document.querySelectorAll('#lv button').forEach(x=>x.classList.toggle('on',x==b))});$('go').onclick=start;$('ph').addEventListener('pointerdown',e=>{e.stopPropagation();phaseGo()});
addEventListener('keydown',e=>{const k=e.key;if(k=='ArrowLeft'||k=='a'||k=='A')keys.l=1;if(k=='ArrowRight'||k=='d'||k=='D')keys.r=1;if(k==' '||k=='ArrowUp'||k=='w'){e.preventDefault();if(e.repeat)return;if(mode=='play')phaseGo();else if(!$('ov').classList.contains('hide'))start()}});
addEventListener('keyup',e=>{const k=e.key;if(k=='ArrowLeft'||k=='a'||k=='A')keys.l=0;if(k=='ArrowRight'||k=='d'||k=='D')keys.r=0});
const pm=new Map(),sync=()=>{ptr.l=ptr.r=0;pm.forEach(x=>x<W/2?ptr.l=1:ptr.r=1)};
cv.addEventListener('pointerdown',e=>{pm.set(e.pointerId,e.clientX);sync()});
cv.addEventListener('pointermove',e=>{if(pm.has(e.pointerId)){pm.set(e.pointerId,e.clientX);sync()}});
['pointerup','pointercancel','pointerleave'].forEach(n=>cv.addEventListener(n,e=>{pm.delete(e.pointerId);sync()}));

function gate(o){const zr=o.z-S.pz,R=N*DZ;if(zr<-2||zr>R)return;let f=Math.min(1,(1-zr/R)*1.6);if(S.phaseOn>0)f*=.35;
const gc=o.gc+o.sp*S.t,st=TAU/o.n;
for(const face of [[zr+2.5,'rgba(30,24,22,'+.95*f+')',0],[zr,'hsla(38,28%,80%,'+.9*f+')',1]]){
const z2=face[0],c=cxy(z2),r=U*sc(z2)*pul(o.z);
for(let k=0;k<o.n;k++){const a0=SA(gc+k*st+o.gh,o.z),a1=SA(gc+(k+1)*st-o.gh,o.z);
ctx.beginPath();ctx.arc(c[0],c[1],r,a0,a1);ctx.arc(c[0],c[1],r*.42,a1,a0,true);ctx.closePath();ctx.fillStyle=face[1];ctx.fill();
if(face[2]){ctx.shadowColor='rgba(214,190,140,.6)';ctx.shadowBlur=zr<70?6:0;ctx.strokeStyle='rgba(110,84,56,'+f+')';ctx.lineWidth=1.5;ctx.stroke();ctx.shadowBlur=0}}}}
function orb(o){const zr=o.z-S.pz;if(zr<-1||zr>N*DZ)return;const c=cxy(zr),s=sc(zr),a=SA(o.a,o.z),r=U*s*pul(o.z)*.76,x=c[0]+Math.cos(a)*r,y=c[1]+Math.sin(a)*r,q=U*s*.07*(1+.15*Math.sin(S.t*8+o.z));
ctx.globalCompositeOperation='lighter';ctx.fillStyle='#f1e4c0';ctx.beginPath();ctx.arc(x,y,q,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over'}
function pad(o){const z0=o.z-S.pz,z1=z0+5;if(z1<-1||z0>N*DZ)return;const q=[];
for(const [z,aa] of [[z0,-.24],[z0,.24],[z1,.24],[z1,-.24]]){const c=cxy(z),a=SA(o.a+aa,o.z+(z-z0)),r=U*sc(z)*pul(o.z+z-z0);q.push([c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r])}
ctx.globalCompositeOperation='lighter';ctx.beginPath();q.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle='rgba(214,190,140,.2)';ctx.fill();ctx.strokeStyle='rgba(214,190,140,.65)';ctx.lineWidth=1.2;ctx.stroke();ctx.globalCompositeOperation='source-over'}
function car(){const zc=4,c=cxy(zc),s=sc(zc),a=SA(S.pa,S.pz+zc),r=U*s*pul(S.pz+zc)*.93,k=U*s/330;
ctx.save();ctx.translate(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r);ctx.rotate(a-1.5708);ctx.scale(k,k);
const ph=S.phaseOn>0;ctx.globalAlpha=ph?.5:(S.inv>0&&Math.floor(S.t*14)%2?.35:1);
ctx.fillStyle=ph?'#9fd3d6':'#1b2029';ctx.strokeStyle=ph?'#ece6da':'#c9b88e';ctx.lineWidth=2;ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=10;
ctx.beginPath();ctx.moveTo(-34,8);ctx.lineTo(-24,-18);ctx.lineTo(-8,-26);ctx.lineTo(8,-26);ctx.lineTo(24,-18);ctx.lineTo(34,8);ctx.lineTo(24,14);ctx.lineTo(-24,14);ctx.closePath();ctx.fill();ctx.stroke();
ctx.fillStyle='#8a7a58';ctx.fillRect(-40,-4,10,18);ctx.fillRect(30,-4,10,18);
ctx.shadowBlur=0;ctx.fillStyle='rgba(159,211,214,.35)';ctx.beginPath();ctx.moveTo(-14,-8);ctx.lineTo(-8,-20);ctx.lineTo(8,-20);ctx.lineTo(14,-8);ctx.fill();
const fl=(S.boost>0?2.4:1)*(.8+.3*Math.random());ctx.globalCompositeOperation='lighter';
for(const x of [-18,18]){ctx.fillStyle='#f3d8a8';ctx.beginPath();ctx.arc(x,6,8,0,TAU);ctx.fill();ctx.fillStyle='rgba(240,190,120,.4)';ctx.beginPath();ctx.moveTo(x-7,6);ctx.lineTo(x,6+34*fl);ctx.lineTo(x+7,6);ctx.fill()}
ctx.restore();ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1}
function draw(){ctx.fillStyle='#06080e';ctx.fillRect(0,0,W,H);ctx.save();
if(S.shake>.02)ctx.translate((Math.random()-.5)*S.shake*18,(Math.random()-.5)*S.shake*18);
const off=S.pz%DZ,base=S.pz-off,id0=Math.round(base/DZ),P=[];
for(let j=0;j<=N;j++){const zr=j*DZ-off,zw=S.pz+zr,c=cxy(zr),r=U*sc(zr)*pul(zw),p=[];
for(let i=0;i<=SEG;i++){const a=SA(i/SEG*TAU,zw);p.push(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r)}P.push(p)}
for(let j=N-1;j>=0;j--){const A=P[j],B=P[j+1],f=Math.pow(1-j/N,1.3),zw=base+j*DZ,h=212+22*Math.sin(zw*.008+S.t*.15);
for(let i=0;i<SEG;i++){const k=i*2;ctx.fillStyle='hsl('+((h+i*2)%360)+',30%,'+(((id0+j+i)&1?17:11)*f+3)+'%)';
ctx.beginPath();ctx.moveTo(A[k],A[k+1]);ctx.lineTo(A[k+2],A[k+3]);ctx.lineTo(B[k+2],B[k+3]);ctx.lineTo(B[k],B[k+1]);ctx.fill()}
ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(214,190,140,'+.5*f+')';ctx.lineWidth=.6+1.6*f;ctx.beginPath();ctx.moveTo(A[0],A[1]);
for(let i=1;i<=SEG;i++)ctx.lineTo(A[i*2],A[i*2+1]);for(let i=0;i<SEG;i+=5){ctx.moveTo(A[i*2],A[i*2+1]);ctx.lineTo(B[i*2],B[i*2+1])}
ctx.stroke();ctx.globalCompositeOperation='source-over'}
const vc=cxy(N*DZ),g=ctx.createRadialGradient(vc[0],vc[1],0,vc[0],vc[1],U*.4);g.addColorStop(0,'rgba(255,244,222,.9)');g.addColorStop(.3,'rgba(214,170,110,.26)');g.addColorStop(1,'rgba(120,160,190,0)');
ctx.globalCompositeOperation='lighter';ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
ctx.lineWidth=1;for(const s of stars){const a=s.a,d0=s.d*s.d,d1=Math.min(1.2,d0+.03+S.v/1800);ctx.strokeStyle='rgba(236,230,218,'+(.06+d0*.3)+')';ctx.beginPath();ctx.moveTo(vc[0]+Math.cos(a)*d0*U*1.6,vc[1]+Math.sin(a)*d0*U*1.6);ctx.lineTo(vc[0]+Math.cos(a)*d1*U*1.6,vc[1]+Math.sin(a)*d1*U*1.6);ctx.stroke()}
ctx.globalCompositeOperation='source-over';
const objs=S.obj.slice().sort((a,b)=>b.z-a.z);for(const o of objs)o.k=='g'?gate(o):o.k=='o'?orb(o):pad(o);
car();ctx.restore();
if(S.phaseOn>0){ctx.fillStyle='rgba(159,211,214,'+.1*Math.min(1,S.phaseOn)+')';ctx.fillRect(0,0,W,H)}
if(S.boost>0){const v=ctx.createRadialGradient(W/2,H/2,U*.5,W/2,H/2,U*1.3);v.addColorStop(0,'rgba(214,190,140,0)');v.addColorStop(1,'rgba(214,190,140,.16)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H)}
const vg=ctx.createRadialGradient(W/2,H*.45,U*.6,W/2,H*.45,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(2,3,6,.7)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H)}
function hud(){$('sc').textContent=Math.round(S.shown).toLocaleString('en-US');$('sp').textContent=Math.round(S.v*3.2)+' '+t('kmh');const l=Math.max(0,S.lives),h=$('hp');if(h.dataset.l!=l){h.dataset.l=l;h.innerHTML='<i class="on"></i>'.repeat(l)+'<i></i>'.repeat(3-l)}
$('bs').textContent=t('best')+' '+Math.max(best,Math.floor(S.score));$('st').textContent=t('stage')+' '+S.stage;$('mx').textContent='×'+S.mult;$('su').style.width=(S.mult>=5?100:(S.streak%4)*25)+'%';$('gn').textContent=S.gt>0?'+'+S.gain:'';$('gn').style.opacity=Math.min(1,S.gt*2);$('pb').style.width=S.phase+'%';$('pb').style.opacity=S.phase>=30?1:.45;const k=$('pk');k.classList.toggle('rdy',S.cd<=0&&S.phase>=30);$('pu').style.height=(S.cd/4.5*100)+'%';$('ph').style.opacity=(S.cd>0||S.phase<30)?.45:1}
let last=0;function loop(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;
if(mode=='play')step(dt);else{S.pz+=25*dt;S.t+=dt;S.pa+=.5*dt;S.cam+=(S.pa-S.cam)*Math.min(1,dt*3);S.shake*=.9;S.obj=[]}
draw();hud();requestAnimationFrame(loop)}
const T={
id:{start:'Mulai',dist:'Jarak',gates:'Gerbang',orbs:'Orb',mult:'Kelipatan maks',again:'Main lagi',easy:'Santai',normal:'Normal',hard:'Mahir',hint:'← → putar · ↑ phase',hintT:'Tahan sisi kiri / kanan layar',kmh:'km/j',best:'Rekor',stage:'Tahap',crash:'Menabrak',phase:'Phase',pass:'Tembus',close:'Tipis',boost:'Boost',over:'Perjalanan berakhir',score:'Skor',nb:'Rekor baru'},
en:{start:'Start',dist:'Distance',gates:'Gates',orbs:'Orbs',mult:'Top multiplier',again:'Play again',easy:'Easy',normal:'Normal',hard:'Hard',hint:'← → steer · ↑ phase',hintT:'Hold the left / right side',kmh:'km/h',best:'Best',stage:'Stage',crash:'Crash',phase:'Phase',pass:'Pass',close:'Close',boost:'Boost',over:'Run over',score:'Score',nb:'New best'},
zh:{start:'开始',dist:'距离',gates:'通过',orbs:'能量球',mult:'最高倍率',again:'再来一局',easy:'轻松',normal:'普通',hard:'困难',hint:'← → 转向 · ↑ 相位',hintT:'按住屏幕左侧 / 右侧',kmh:'公里/时',best:'最高分',stage:'阶段',crash:'撞击',phase:'相位',pass:'穿越',close:'擦边',boost:'加速',over:'本局结束',score:'得分',nb:'新纪录'},
ja:{start:'スタート',dist:'距離',gates:'ゲート',orbs:'オーブ',mult:'最大倍率',again:'もう一度',easy:'やさしい',normal:'ふつう',hard:'むずかしい',hint:'← → 操作 · ↑ フェーズ',hintT:'画面の左 / 右を長押し',kmh:'km/h',best:'ハイスコア',stage:'ステージ',crash:'衝突',phase:'フェーズ',pass:'すり抜け',close:'ギリギリ',boost:'ブースト',over:'ゲームオーバー',score:'スコア',nb:'新記録'}};
let lang=(()=>{try{const s=localStorage.getItem('vortex-lang');if(T[s])return s}catch(e){}const n=(navigator.language||'en').slice(0,2).toLowerCase();return T[n]?n:(n=='in'?'id':'en')})();
const touch='ontouchstart' in window||navigator.maxTouchPoints>0,t=k=>T[lang][k];
function showOver(){$('tt').textContent=t('over');$('ds').innerHTML=t('score')+' <b class="n">'+Math.floor(S.score).toLocaleString('en-US')+'</b> · '+(S.score>=best?t('nb'):t('best')+' '+best.toLocaleString('en-US'));
$('sg').innerHTML=[[t('dist'),Math.round(S.pz-S.z0)+' m'],[t('gates'),S.gate],[t('close'),S.close],[t('orbs'),S.orbs],[t('mult'),'×'+S.maxm]].map(x=>'<div><b>'+x[1]+'</b><span>'+x[0]+'</span></div>').join('');$('go').dataset.i='again'}
function applyLang(){document.documentElement.lang=lang;if(mode=='over')showOver();if(mode=='menu')$('ds').textContent=best?t('best')+' '+best.toLocaleString('en-US'):'';document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));$('hn').textContent=touch?t('hintT'):t('hint');$('ph').textContent=t('phase');buildLang()}
const NM={id:'Indonesia',en:'English',zh:'中文',ja:'日本語'},closeLm=()=>{$('lm').classList.add('hide');$('lc').setAttribute('aria-expanded','false')};
function buildLang(){$('ln').textContent=NM[lang];$('lm').innerHTML='';Object.keys(NM).filter(k=>k!=lang).forEach(k=>{const b=document.createElement('button');b.textContent=NM[k];b.onclick=()=>{lang=k;try{localStorage.setItem('vortex-lang',k)}catch(e){}closeLm();applyLang()};$('lm').appendChild(b)})}
$('lc').onclick=e=>{e.stopPropagation();const h=$('lm').classList.toggle('hide');$('lc').setAttribute('aria-expanded',String(!h))};
document.addEventListener('click',closeLm);
applyLang();
requestAnimationFrame(loop);

/* ═══════════════════════════════════════════════════════════
   TCFField3D — TCF 設計系統的 3D 方言
   photons.js（螢火蟲/流星）在三維世界裡的兄弟模組。
   北極星: Field = NOT SOLID. Everything breathes light.

   用法（任何 Three.js 世界兩行接入）:
     TCFField3D.init(scene, {span:240, centerZ:0});
     動畫迴圈裡: TCFField3D.update(t);   // t = Date.now()

   內容三層:
     wishLights — 遠處親和色的願望之光（呼吸，不受霧影響=天空層）
     fireflies  — 近處暖色螢火蟲（漂移，受霧影響=活在場裡）
     meteor     — 偶爾一顆流星劃過（7~16 秒一次）
   四個 3D 世界（古堡/Sky Hall/文明牆/畫之室）共用 — DRY。
   ═══════════════════════════════════════════════════════════ */
const TCFField3D = (function(){
  const PALETTE = [0xFFD700,0xE0277E,0x00BFFF,0x1ABC9C,0xFF8C42,0xE8E8E8,0xB14EFF];
  let groups = [];
  let meteor = null, mState = null;
  let O = {};

  function rng(seed){ let a=seed>>>0; return function(){ a|=0; a=a+0x6D2B79F5|0;
    let x=Math.imul(a^a>>>15,1|a); x=x+Math.imul(x^x>>>7,61|x)^x;
    return ((x^x>>>14)>>>0)/4294967296; }; }

  // field3d v2: 圓形光暈貼圖 — 北極星說 no flat dots, no hard edges
  let TEX = null;
  function glowTexture(){
    if(TEX) return TEX;
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(32,32,0,32,32,32);
    grad.addColorStop(0,'rgba(255,255,255,1)');
    grad.addColorStop(0.35,'rgba(255,255,255,0.5)');
    grad.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle = grad; g.fillRect(0,0,64,64);
    TEX = new THREE.CanvasTexture(c);
    return TEX;
  }

  function makeGroup(count, posFn, colorFn, size, fogOn, breath){
    const g = new THREE.Group();
    const pos = new Float32Array(count*3), col = new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const p = posFn(i); pos[i*3]=p[0]; pos[i*3+1]=p[1]; pos[i*3+2]=p[2];
      const c = new THREE.Color(colorFn(i)); col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color', new THREE.BufferAttribute(col,3));
    const mat = new THREE.PointsMaterial({size:size, vertexColors:true, transparent:true,
      map:glowTexture(), opacity:breath.base, fog:fogOn,
      blending:THREE.AdditiveBlending, depthWrite:false});
    const pts = new THREE.Points(geo, mat); pts.frustumCulled = false;
    g.add(pts);
    const rec = Object.assign({mat:mat, group:g}, breath);
    if(breath.drift){
      // field3d v2: 每一隻螢火蟲各自漂 — 不是整群僵硬公轉
      rec.geo = geo; rec.n = count;
      rec.basePos = pos.slice();
      rec.ph = new Float32Array(count*3); rec.spd = new Float32Array(count);
      for(let i=0;i<count;i++){ rec.spd[i]=0.00035+Math.random()*0.0005;
        rec.ph[i*3]=Math.random()*6.28; rec.ph[i*3+1]=Math.random()*6.28; rec.ph[i*3+2]=Math.random()*6.28; }
    }
    groups.push(rec);
    return g;
  }

  return {
    init(scene, opts){
      O = Object.assign({span:240, centerZ:0, seed:7,
        wishLights:150, fireflies:36, meteors:true}, opts||{});
      const rnd = rng(O.seed);
      // ── 願望之光：遠處親和色，三組錯相呼吸（天空層，不吃霧）──
      for(let k=0;k<3;k++){
        scene.add(makeGroup(Math.floor(O.wishLights/3), function(){
          const r = O.span*(0.85+rnd()*0.7), th = rnd()*Math.PI*2, ph = Math.acos(2*rnd()-1);
          return [r*Math.sin(ph)*Math.cos(th),
                  Math.abs(r*Math.cos(ph))*0.65+6,
                  r*Math.sin(ph)*Math.sin(th)+O.centerZ];
        }, function(){ return rnd()<0.55 ? 0xAFC0DD : PALETTE[Math.floor(rnd()*PALETTE.length)]; },
        3.0, false, {base:0.55, amp:0.28, speed:0.00045+k*0.00016, phase:k*2.1, rotSpeed:0}));
      }
      // ── 螢火蟲：近處暖光，慢漂移（活在場裡，霧會吃它 = 正確的深度）──
      for(let k=0;k<3;k++){
        scene.add(makeGroup(Math.floor(O.fireflies/3), function(){
          const r = 16+rnd()*70, th = rnd()*Math.PI*2;
          return [r*Math.cos(th), 1.2+rnd()*7, r*Math.sin(th)+O.centerZ*0.5];
        }, function(){ return rnd()<0.7 ? 0xFFE9A8 : 0xD9C8FF; },
        2.4, true, {base:0.5, amp:0.34, speed:0.0011+k*0.0004, phase:k*1.4, drift:true,
                    rotSpeed:(k%2? -1:1)*(0.000012+k*0.000006)}));
      }
      // ── 流星：一條可回收的光痕 ──
      if(O.meteors){
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6),3));
        const mat = new THREE.LineBasicMaterial({color:0xCFE0FF, transparent:true,
          opacity:0, fog:false, blending:THREE.AdditiveBlending});
        meteor = new THREE.Line(geo, mat); meteor.frustumCulled = false;
        scene.add(meteor);
        mState = {nextAt: 4000+Math.random()*6000, t0:0, dur:1300,
                  start:new THREE.Vector3(), dir:new THREE.Vector3(), active:false};
      }
    },
    update(t){
      for(let i=0;i<groups.length;i++){
        const g = groups[i];
        g.mat.opacity = g.base + Math.sin(t*g.speed + g.phase)*g.amp;
        if(g.rotSpeed) g.group.rotation.y = t*g.rotSpeed;
        if(g.drift){
          const p = g.geo.attributes.position.array, b = g.basePos;
          for(let j=0;j<g.n;j++){ const q=j*3;
            p[q]  = b[q]  + Math.sin(t*g.spd[j]      + g.ph[q]  )*2.6;
            p[q+1] = b[q+1] + Math.sin(t*g.spd[j]*1.3 + g.ph[q+1])*1.2;
            p[q+2] = b[q+2] + Math.cos(t*g.spd[j]     + g.ph[q+2])*2.6;
          }
          g.geo.attributes.position.needsUpdate = true;
        }
      }
      if(!mState) return;
      if(!mState.active && t > mState.nextAt){
        const az = Math.random()*Math.PI*2, r = O.span*1.05;
        mState.start.set(Math.cos(az)*r, 110+Math.random()*70, Math.sin(az)*r + O.centerZ);
        mState.dir.set(Math.cos(az+2.4), -0.35-Math.random()*0.25, Math.sin(az+2.4)).normalize();
        mState.t0 = t; mState.active = true;
      }
      if(mState.active){
        const u = (t-mState.t0)/mState.dur;
        if(u>=1){ mState.active=false; meteor.material.opacity=0;
                  mState.nextAt = t + 7000+Math.random()*9000; return; }
        const travel = O.span*1.5;
        const hx = mState.start.x + mState.dir.x*travel*u;
        const hy = mState.start.y + mState.dir.y*travel*u;
        const hz = mState.start.z + mState.dir.z*travel*u;
        const tail = 26;
        const a = meteor.geometry.attributes.position.array;
        a[0]=hx-mState.dir.x*tail; a[1]=hy-mState.dir.y*tail; a[2]=hz-mState.dir.z*tail;
        a[3]=hx; a[4]=hy; a[5]=hz;
        meteor.geometry.attributes.position.needsUpdate = true;
        meteor.material.opacity = Math.sin(u*Math.PI)*0.85; // 入場淡入、離場淡出
      }
    }
  };
})();

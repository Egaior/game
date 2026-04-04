// === js/renderer.js ===
const COLORS = {
  red:    { body: '#ff4757', detail: '#ff6b81' },
  blue:   { body: '#1e90ff', detail: '#7bed9f' },
  yellow: { body: '#ffa502', detail: '#eccc68' },
  green:  { body: '#2ed573', detail: '#7bed9f' },
  purple: { body: '#9b59b6', detail: '#8e44ad' },
  orange: { body: '#ff7f50', detail: '#ff6348' }
};

const COLOR_NAMES = Object.keys(COLORS);

const CAT_SPRITE = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0],
  [0,1,2,1,1,0,0,0,0,0,0,1,1,2,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,3,4,1,1,1,1,1,1,3,4,1,1,0],
  [0,1,1,3,4,1,1,5,5,1,1,3,4,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,2,2,2,2,2,2,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,2,2,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,2,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d', { alpha: false }) : null;
let width, height;
let cellSize = 0, gridOffsetX = 0, gridOffsetY = 0, dockOffsetY = 0, queueOffsetY = 0;

function resize() {
  const container = document.getElementById('game-container');
  if (!container || !canvas) return;
  width = container.clientWidth;
  height = container.clientHeight;
  
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  const availHeight = height - 160; 
  if (cols > 0 && rows > 0) {
      cellSize = Math.floor(Math.min((width - 40) / cols, availHeight / rows));
      gridOffsetX = (width - (cols * cellSize)) / 2;
  }
  gridOffsetY = 30;
  
  dockOffsetY = gridOffsetY + (rows * cellSize) + 30;
  queueOffsetY = height - 70;
}
if(typeof window !== 'undefined') window.addEventListener('resize', resize);

function drawPixelCat(ctx, x, y, size, colorObj, bounce = 0) {
  let ps = size / 16;
  for(let r=0; r<16; r++){
    for(let c=0; c<16; c++){
      let val = CAT_SPRITE[r][c];
      if (val === 0) continue;
      if (val === 1) ctx.fillStyle = colorObj.body;
      if (val === 2) ctx.fillStyle = colorObj.detail;
      if (val === 3) ctx.fillStyle = '#FFF';
      if (val === 4) ctx.fillStyle = '#000';
      if (val === 5) ctx.fillStyle = '#ff9ff3'; 
      
      let bx = x + c * ps;
      let by = y + r * ps + (val===1 || val===2 ? bounce : bounce*0.8);
      ctx.fillRect(bx, by, ps+0.5, ps+0.5); 
    }
  }
}

function drawRoundRect(ctx, x, y, w, h, radius, color) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function createParticle() {
  return {
    x: width/2, y: height/2,
    vx: (Math.random()-0.5)*15, vy: (Math.random()-0.5)*15,
    life: 1.0, color: COLORS[COLOR_NAMES[Math.floor(Math.random()*COLOR_NAMES.length)]].body
  };
}

let time = 0;

function render() {
  if (!ctx) return;
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = '#ffe6e6';
  ctx.fillRect(0,0,width,height);
  
  time += 0.1;
  let bounce = Math.sin(time) * 1.5;
  
  // Highlight Exit Zone
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = cellSize;
  ctx.setLineDash([cellSize*0.2, cellSize*0.2]);
  ctx.lineCap = "round";
  ctx.strokeRect(gridOffsetX - cellSize/2, gridOffsetY - cellSize/2, cols*cellSize + cellSize, rows*cellSize + cellSize);
  ctx.setLineDash([]);
  
  // Grid Block
  ctx.fillStyle = '#fff';
  drawRoundRect(ctx, gridOffsetX-5, gridOffsetY-5, cols*cellSize+10, rows*cellSize+10, 8, '#fff');
  
  for(let r=0; r<rows; r++){
    for(let c=0; c<cols; c++){
      ctx.strokeStyle = '#eee';
      ctx.lineWidth = 2;
      ctx.strokeRect(gridOffsetX + c*cellSize, gridOffsetY + r*cellSize, cellSize, cellSize);
    }
  }

  // Draw Highlight for Selected Bus Paths
  if (selectedBusId) {
    let b = buses.find(bx => bx.id === selectedBusId);
    if (b && !b.isExiting) {
      ctx.fillStyle = 'rgba(46, 213, 115, 0.3)';
      let dxFrames = [ (b.dir==='R'?1:0), (b.dir==='L'?-1:0) ];
      let dyFrames = [ (b.dir==='D'?1:0), (b.dir==='U'?-1:0) ];
      for (let i = 0; i < 2; i++) {
        let dx = dxFrames[i], dy = dyFrames[i];
        if(dx!==0 || dy!==0) {
          let tx = b.x + dx, ty = b.y + dy;
          let step = 1;
          while(tx >= 0 && tx + (getBusAxis(b.dir)==='H'?b.len-1:0) < cols && 
                ty >= 0 && ty + (getBusAxis(b.dir)==='V'?b.len-1:0) < rows && 
                !isOccupiedByOther(tx + (dx>0?b.len-1:0), ty + (dy>0?b.len-1:0), b.id)) {
            let px = gridOffsetX + tx * cellSize;
            let py = gridOffsetY + ty * cellSize;
            let bw = getBusAxis(b.dir) === 'H' ? b.len * cellSize : cellSize;
            let bh = getBusAxis(b.dir) === 'V' ? b.len * cellSize : cellSize;
            ctx.fillRect(px, py, bw, bh);
            tx += dx; ty += dy;
          }
        }
      }
    }
  }

  let padding = cellSize * 0.1;
  for (let b of buses) {
    if (b.isExiting) {
      b.animX += (b.dir === 'R' ? 0.3 : b.dir === 'L' ? -0.3 : 0);
      b.animY += (b.dir === 'D' ? 0.3 : b.dir === 'U' ? -0.3 : 0);
      b.opacity -= 0.08;
      if (b.opacity < 0) b.opacity = 0;
    } else {
      b.animX += (b.x - b.animX) * 0.3;
      b.animY += (b.y - b.animY) * 0.3;
    }
    
    if (b.shake > 0) b.shake -= 1;
    let sx = b.shake > 0 ? Math.sin(b.shake*2)*4 : 0;
    
    let bw = getBusAxis(b.dir) === 'H' ? b.len * cellSize : cellSize;
    let bh = getBusAxis(b.dir) === 'V' ? b.len * cellSize : cellSize;
    
    let px = gridOffsetX + b.animX * cellSize + (getBusAxis(b.dir)==='H'?sx:0);
    let py = gridOffsetY + b.animY * cellSize + (getBusAxis(b.dir)==='V'?sx:0);

    ctx.globalAlpha = Math.max(0, b.opacity);
    drawRoundRect(ctx, px + padding, py + padding, bw - padding*2, bh - padding*2, 10, COLORS[b.color].body);
    
    if (selectedBusId === b.id && !b.isExiting) {
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    }
    
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    let cx = px + bw/2, cy = py + bh/2;
    let arrS = 10;
    if(b.dir==='R'){ ctx.moveTo(cx+arrS,cy); ctx.lineTo(cx-arrS,cy-arrS); ctx.lineTo(cx-arrS,cy+arrS); }
    if(b.dir==='L'){ ctx.moveTo(cx-arrS,cy); ctx.lineTo(cx+arrS,cy-arrS); ctx.lineTo(cx+arrS,cy+arrS); }
    if(b.dir==='D'){ ctx.moveTo(cx,cy+arrS); ctx.lineTo(cx-arrS,cy-arrS); ctx.lineTo(cx+arrS,cy-arrS); }
    if(b.dir==='U'){ ctx.moveTo(cx,cy-arrS); ctx.lineTo(cx-arrS,cy+arrS); ctx.lineTo(cx+arrS,cy+arrS); }
    ctx.fill();
    
    for(let i=0; i<b.loaded; i++){
       let windowS = cellSize * 0.6;
       let lx = getBusAxis(b.dir) === 'H' ? px + padding + i*cellSize + (cellSize-windowS)/2 : px + (cellSize-windowS)/2;
       let ly = getBusAxis(b.dir) === 'V' ? py + padding + i*cellSize + (cellSize-windowS)/2 : py + (cellSize-windowS)/2;
       
       ctx.fillStyle = '#fff';
       ctx.fillRect(lx, ly, windowS, windowS); 
       drawPixelCat(ctx, lx, ly+2, windowS, COLORS[b.color], 0);
    }
    ctx.globalAlpha = 1.0;
  }

  // Draw Dock Box
  let dockW = cellSize * 2.5; 
  let dockH = cellSize;
  let totalDockW = 2 * dockW + 20;
  let dockStartX = (width - totalDockW) / 2;
  
  ctx.fillStyle = '#ccc';
  drawRoundRect(ctx, dockStartX-10, dockOffsetY-10, totalDockW+20, dockH+20, 15, '#e0e0e0');
  
  for(let i=0; i<2; i++){
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(dockStartX + i*(dockW+20), dockOffsetY, dockW, dockH);
    ctx.fillStyle = '#aaa';
    ctx.font = 'bold 10px Nunito';
    ctx.textAlign = 'center';
    ctx.fillText('DOCK ' + (i+1), dockStartX + i*(dockW+20) + dockW/2, dockOffsetY - 12);
  }
  
  if (dock.length === 2) {
    ctx.fillStyle = '#ff5e5e';
    ctx.font = 'bold 14px Nunito';
    ctx.textAlign = 'center';
    ctx.fillText('TAP TO SWAP ↕', width/2, dockOffsetY - 30);
  }

  dock.forEach((b, i) => {
     let bx = dockStartX + i*(dockW+20) + padding;
     let by = dockOffsetY + padding;
     drawRoundRect(ctx, bx, by, dockW - padding*2, dockH - padding*2, 10, COLORS[b.color].body);
     
     for(let k=0; k<b.loaded; k++){
       let wS = dockW / b.cap * 0.7;
       let spacing = (dockW - padding*2) / b.cap;
       ctx.fillStyle = '#fff';
       ctx.fillRect(bx + k*spacing + 5, by+5, wS, dockH-padding*2-10);
       drawPixelCat(ctx, bx + k*spacing + 5, by+8, wS, COLORS[b.color], bounce*0.5);
     }
  });

  // Cat Queue Rendering
  let qSize = 32;
  let qStartX = (width - Math.min(catQueue.length, 10) * (qSize + 5)) / 2;
  
  for(let i=0; i<Math.min(catQueue.length, 10); i++){
     let cqColor = COLORS[catQueue[i]];
     let bb = Math.sin(time + i) * 3; 
     drawPixelCat(ctx, qStartX + i*(qSize+5), queueOffsetY + bb, qSize, cqColor, bb);
     
     if (i===0) {
        ctx.fillStyle = '#ff5e5e';
        ctx.font = 'bold 20px Nunito';
        ctx.textAlign = 'center';
        ctx.fillText('▼', qStartX + i*(qSize+5) + qSize/2, queueOffsetY + bb - 10);
     }
  }
  if(catQueue.length > 10) {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Nunito';
    ctx.fillText('+' + (catQueue.length-10), qStartX + 10*(qSize+5), queueOffsetY + 25);
  }

  // Particle Win Effects
  for(let i=particles.length-1; i>=0; i--){
    let p = particles[i];
    p.x += p.vx; p.y += p.vy;
    p.life -= 0.02;
    if(p.life <= 0) particles.splice(i, 1);
    else {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 6, 6);
      ctx.globalAlpha = 1.0;
    }
  }

  requestAnimationFrame(render);
}

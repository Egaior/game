// === js/engine.js ===
let currentLevelIdx = 0;
let buses = [];
let catQueue = [];
let dock = []; 
let moves = 0;
let cols = 6, rows = 6;
let isAnimating = false;
let selectedBusId = null;
let particles = [];

function getBusAxis(dir) { return (dir === 'L' || dir === 'R') ? 'H' : 'V'; }

function initLevel(lvlIdx) {
  if (lvlIdx >= LEVELS.length) lvlIdx = 0;
  currentLevelIdx = lvlIdx;
  const data = LEVELS[lvlIdx];
  
  cols = data.cols;
  rows = data.rows;
  buses = JSON.parse(JSON.stringify(data.buses)); 
  buses.forEach(b => { 
    b.animX = b.x; 
    b.animY = b.y; 
    b.loaded = 0; 
    b.shake = 0; 
    b.isExiting = false;
    b.opacity = 1.0;
  });
  
  catQueue = [...data.catQueue];
  dock = [];
  moves = 0;
  selectedBusId = null;
  particles = [];
  isAnimating = false;
  
  if (typeof updateUI === 'function') updateUI();
}

function isOccupiedByOther(x, y, ignoreId) {
  for (let b of buses) {
    if (b.id === ignoreId || b.isExiting) continue;
    let bx = b.x, by = b.y;
    let axis = getBusAxis(b.dir);
    if (axis === 'H' && y === by && x >= bx && x < bx + b.len) return true;
    if (axis === 'V' && x === bx && y >= by && y < by + b.len) return true;
  }
  return false;
}

function processBoarding() {
  if (isAnimating || catQueue.length === 0 || dock.length === 0) {
    if (typeof checkWinOrGridlock === 'function') checkWinOrGridlock();
    return;
  }
  
  let frontCat = catQueue[0];
  let matchedBus = null;
  // STRICT ORDER
  if (dock[0].color === frontCat && dock[0].loaded < dock[0].cap) {
    matchedBus = dock[0];
  }
  
  if (matchedBus) {
    catQueue.shift();
    matchedBus.loaded++;
    if (matchedBus.loaded >= matchedBus.cap) dock = dock.filter(b => b.id !== matchedBus.id);
    setTimeout(processBoarding, 150); 
  } else {
    if (typeof checkWinOrGridlock === 'function') checkWinOrGridlock();
  }
}

function swapDock() {
  if (dock.length === 2) {
    let temp = dock[0];
    dock[0] = dock[1];
    dock[1] = temp;
    processBoarding();
  }
}

function moveBus(bus, dx, dy) {
  if (bus.isExiting) return;
  moves++;
  if (typeof updateUI === 'function') updateUI();
  
  // Check exit before confirming block
  let exiting = false;
  if (bus.dir === 'R' && bus.x + bus.len - 1 >= cols - 1 && dx > 0) exiting = true;
  if (bus.dir === 'L' && bus.x <= 0 && dx < 0) exiting = true;
  if (bus.dir === 'D' && bus.y + bus.len - 1 >= rows - 1 && dy > 0) exiting = true;
  if (bus.dir === 'U' && bus.y <= 0 && dy < 0) exiting = true;

  if (exiting) {
    if (dock.length >= 2) {
      bus.shake = 10;
      return;
    }
    bus.isExiting = true;
    
    // Animate exit via logic flag, the renderer will interpolate opacity and slide it out
    setTimeout(() => {
      buses = buses.filter(b => b.id !== bus.id);
      bus.x = -100; bus.y = -100; 
      bus.isExiting = false;
      bus.opacity = 1.0;
      dock.push(bus);
      processBoarding();
    }, 300);
  } else {
    bus.x += dx;
    bus.y += dy;
  }
}

function isGridlocked() {
  if (dock.length < 2) return false;
  if (catQueue.length === 0) return false;
  
  if (dock[0].color === catQueue[0] && dock[0].loaded < dock[0].cap) return false;
  // Check if swap would help
  if (dock[1].color === catQueue[0] && dock[1].loaded < dock[1].cap) return false;

  for (let b of buses) {
    if (b.isExiting) return false; // Action is continuously progressing
    
    let dx = 0, dy = 0;
    if (b.dir === 'R') dx = 1; else if (b.dir === 'L') dx = -1;
    if (b.dir === 'D') dy = 1; else if (b.dir === 'U') dy = -1;
    
    let targetX = b.x + dx + (dx>0 ? b.len-1 : 0);
    let targetY = b.y + dy + (dy>0 ? b.len-1 : 0);
    
    let exiting = false;
    if (b.dir === 'R' && b.x + b.len - 1 >= cols - 1 && dx > 0) exiting = true;
    if (b.dir === 'L' && b.x <= 0 && dx < 0) exiting = true;
    if (b.dir === 'D' && b.y + b.len - 1 >= rows - 1 && dy > 0) exiting = true;
    if (b.dir === 'U' && b.y <= 0 && dy < 0) exiting = true;

    if (!exiting && !isOccupiedByOther(targetX, targetY, b.id)) {
       if (targetX >= 0 && targetX < cols && targetY >= 0 && targetY < rows) {
          return false;
       }
    }
  }
  return true;
}

// === js/ui.js ===

function getStats() {
  return JSON.parse(localStorage.getItem('catBusEscape_v2') || '{}');
}

function saveStats(stats) {
  localStorage.setItem('catBusEscape_v2', JSON.stringify(stats));
}

function clearStats() {
  if (confirm("Are you sure you want to reset all progress?")) {
    localStorage.removeItem('catBusEscape_v2');
    location.reload();
  }
}

// === PAGE: LEVEL SELECT ===
const levelGrid = document.getElementById('level-grid');
if (levelGrid) {
  const stats = getStats();
  // We assume 25 levels exist in LEVELS array in game, but here we just generate 25 buttons
  let highestUnlocked = 0;
  for (let i = 0; i < 25; i++) {
    if (stats[i] && stats[i].completed) highestUnlocked = i + 1;
  }
  if (highestUnlocked >= 25) highestUnlocked = 24;

  for (let i = 0; i < 25; i++) {
    let btn = document.createElement('button');
    btn.className = 'lvl-btn';
    
    let isUnlocked = (i <= highestUnlocked);
    let isCompleted = (stats[i] && stats[i].completed);
    
    if (!isUnlocked) {
      btn.classList.add('lvl-locked');
      btn.innerHTML = `<span class="num">🔒</span>`;
    } else {
      let starsCount = (stats[i] ? stats[i].stars : 0);
      let starsHtml = `<div style="color:${starsCount>0?'#FFD700':'#ccc'};">` + '★'.repeat(starsCount) + '☆'.repeat(3-starsCount) + `</div>`;
      
      btn.innerHTML = `<span class="num">${i+1}</span><div class="stars">${starsHtml}</div>`;
      
      if (isCompleted) btn.classList.add('lvl-completed');
      else btn.classList.add('lvl-unlocked');
      
      btn.onclick = () => {
        document.body.classList.add('fade-out');
        setTimeout(() => {
          window.location.href = `game.html?level=${i}`;
        }, 300);
      };
    }
    levelGrid.appendChild(btn);
  }

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.onclick = clearStats;
}


// === PAGE: GAME ===
if (typeof initLevel === 'function') {
  
  // URL Parsing
  const urlParams = new URLSearchParams(window.location.search);
  let parsedLevel = parseInt(urlParams.get('level')) || 0;
  
  // Launch Level
  setTimeout(() => {
    initLevel(parsedLevel);
    resize();
    render();
  }, 100);

  function goBack() {
    document.body.classList.add('fade-out');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 300);
  }
  
  function updateUI() {
    document.getElementById('ui-level').innerText = currentLevelIdx + 1;
    document.getElementById('ui-moves').innerText = moves;
  }

  function restartLevel() {
    document.getElementById('win-modal').style.display = 'none';
    document.getElementById('gridlock-modal').style.display = 'none';
    initLevel(currentLevelIdx);
  }

  function nextLevel() {
    document.getElementById('win-modal').style.display = 'none';
    if (currentLevelIdx < LEVELS.length - 1) {
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = `game.html?level=${currentLevelIdx + 1}`;
      }, 300);
    } else {
      goBack();
    }
  }
  
  function showLeaderboard() {
    const lbBody = document.getElementById('lb-body');
    lbBody.innerHTML = '';
    let stats = getStats();
    
    for(let i=0; i<LEVELS.length; i++){
      let data = stats[i] || { stars: 0, bestMoves: '-' };
      let row = `<tr>
        <td>${i+1}</td>
        <td style="color:#FFD700">${'★'.repeat(data.stars)}${'☆'.repeat(3-data.stars)}</td>
        <td>${data.bestMoves}</td>
      </tr>`;
      lbBody.innerHTML += row;
    }
    document.getElementById('leaderboard-modal').style.display = 'flex';
  }
  
  function closeLeaderboard() {
    document.getElementById('leaderboard-modal').style.display = 'none';
  }

  // --- Core Loop Interaction Win/Loss --- //
  function checkWinOrGridlock() {
    if (buses.length === 0 && dock.length === 0 && catQueue.length === 0) {
      // WIN
      for(let i=0; i<50; i++) particles.push(createParticle());
      setTimeout(() => {
        let diff = moves - LEVELS[currentLevelIdx].optimal;
        let stars = diff <= 0 ? 3 : (diff <= 4 ? 2 : 1);
        
        let stats = getStats();
        let curr = stats[currentLevelIdx] || { bestMoves: Infinity, stars: 0, completed: false };
        let newMoves = Math.min(moves, curr.bestMoves);
        let newStars = Math.max(stars, curr.stars);
        
        stats[currentLevelIdx] = { completed: true, bestMoves: newMoves, stars: newStars };
        saveStats(stats);
        
        document.getElementById('win-stars').innerText = '★'.repeat(stars) + '☆'.repeat(3-stars);
        document.getElementById('win-moves').innerText = moves;
        document.getElementById('win-modal').style.display = 'flex';
      }, 800);
    } 
    else if (isGridlocked()) {
      document.getElementById('gridlock-modal').style.display = 'flex';
    }
  }

  // --- Input Bindings --- //
  if (canvas) {
    canvas.addEventListener('pointerdown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      
      // Dock Swap hit-box
      if (py >= dockOffsetY && py <= dockOffsetY + cellSize * 1.5) {
        let dockW = cellSize * 2.5; 
        let totalW = dock.length * (dockW + 20);
        let startX = (width - totalW) / 2;
        if (px >= startX && px <= startX + totalW) {
          swapDock(); 
          return;
        }
      }
      
      // Grid Selection
      const gx = Math.floor((px - gridOffsetX) / cellSize);
      const gy = Math.floor((py - gridOffsetY) / cellSize);
      
      if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
        let clickedBus = null;
        for (let b of buses) {
          // Compare against pure bounds
          let bx = b.x, by = b.y;
          let axis = getBusAxis(b.dir);
          if (axis === 'H' && gy === by && gx >= bx && gx < bx + b.len) clickedBus = b;
          if (axis === 'V' && gx === bx && gy >= by && gy < by + b.len) clickedBus = b;
        }
        
        if (clickedBus && !clickedBus.isExiting) {
          if (selectedBusId === clickedBus.id) {
            let step = (clickedBus.dir==='R'||clickedBus.dir==='D') ? 1 : -1;
            tryMove(clickedBus, step);
          } else {
            selectedBusId = clickedBus.id;
          }
        } else if (selectedBusId) {
          let b = buses.find(b => b.id === selectedBusId);
          if (b && !b.isExiting) {
            let bx = b.x, by = b.y;
            let axis = getBusAxis(b.dir);
            let dx = 0, dy = 0;
            
            if (axis === 'H' && gy === by) {
              if (gx === bx - 1) dx = -1;
              if (gx === bx + b.len) dx = 1;
            } else if (axis === 'V' && gx === bx) {
              if (gy === by - 1) dy = -1;
              if (gy === by + b.len) dy = 1;
            }
            
            if (dx !== 0 || dy !== 0) {
              let validDir = true;
              if (b.dir === 'R' && dx < 0) validDir = false;
              if (b.dir === 'L' && dx > 0) validDir = false;
              if (b.dir === 'D' && dy < 0) validDir = false;
              if (b.dir === 'U' && dy > 0) validDir = false;

              if (!validDir) {
                b.shake = 10;
              } else if (!isOccupiedByOther(bx + dx + (dx>0?b.len-1:0), by + dy + (dy>0?b.len-1:0), b.id)) {
                moveBus(b, dx, dy);
              } else b.shake = 10;
            }
          }
        }
      } else {
        selectedBusId = null; 
      }
    });

    function tryMove(b, step) {
      if (b.isExiting) return;
      let dx = 0, dy = 0;
      if(b.dir==='R') dx=1; if(b.dir==='L') dx=-1;
      if(b.dir==='D') dy=1; if(b.dir==='U') dy=-1;
      
      if (!isOccupiedByOther(b.x + dx + (dx>0?b.len-1:0), b.y + dy + (dy>0?b.len-1:0), b.id)) {
        moveBus(b, dx, dy);
      } else b.shake = 10;
    }

    // Swipe controls
    let touchSX = 0, touchSY = 0;
    canvas.addEventListener('touchstart', e => {
      touchSX = e.touches[0].clientX;
      touchSY = e.touches[0].clientY;
    }, {passive:true});

    canvas.addEventListener('touchend', e => {
      if (!selectedBusId) return;
      let dx = e.changedTouches[0].clientX - touchSX;
      let dy = e.changedTouches[0].clientY - touchSY;
      let b = buses.find(b => b.id === selectedBusId);
      if (!b || b.isExiting) return;
      
      let axis = getBusAxis(b.dir);
      if (axis === 'H' && Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
        let step = dx > 0 ? 1 : -1;
        let validDir = (b.dir === 'R' && step > 0) || (b.dir === 'L' && step < 0);
        if (!validDir) {
          b.shake = 10;
        } else if (!isOccupiedByOther(b.x + step + (step>0?b.len-1:0), b.y, b.id)) {
          moveBus(b, step, 0);
        } else b.shake = 10;
      } else if (axis === 'V' && Math.abs(dy) > 30 && Math.abs(dy) > Math.abs(dx)) {
        let step = dy > 0 ? 1 : -1;
        let validDir = (b.dir === 'D' && step > 0) || (b.dir === 'U' && step < 0);
        if (!validDir) {
          b.shake = 10;
        } else if (!isOccupiedByOther(b.x, b.y + step + (step>0?b.len-1:0), b.id)) {
          moveBus(b, 0, step);
        } else b.shake = 10;
      }
    });
  }
}

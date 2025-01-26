const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 20; // 文字サイズを小さく
const columns = Math.floor(canvas.width / (fontSize * 0.6)); // 列数を増やす
const drops = new Array(columns).fill(null).map(() => ({
  y: Math.random() * canvas.height * -1,
  speed: 0.5 + Math.random() * 0.3, // 落下速度
  lastUpdate: 0,
  currentChar: characters[Math.floor(Math.random() * characters.length)],
  nextUpdate: 500 // 文字切り替えを0.5秒に固定
}));

let mousePath = [];

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function drawMatrix(timestamp) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0F0';
  ctx.font = `${fontSize}px monospace`;

  drops.forEach((drop, i) => {
    if (timestamp - drop.lastUpdate > 50) {
      const x = i * fontSize * 0.6;
      
      // 文字の切り替え判定
      if (timestamp % drop.nextUpdate < 50) {
        drop.currentChar = characters[Math.floor(Math.random() * characters.length)];
        drop.nextUpdate = 500;
      }
      
      ctx.fillText(drop.currentChar, x, drop.y);
      drop.y += drop.speed;
      drop.lastUpdate = timestamp;

      if (drop.y > canvas.height) {
        drop.y = -fontSize;
        drop.speed = 0.5 + Math.random() * 0.3;
      }
    }
  });
}

function drawMousePath() {
  if (mousePath.length < 2) return;

  mousePath.forEach((segment, index) => {
    for (let i = 0; i < 30; i++) { // 波動の数を増やす
      ctx.beginPath();
      ctx.arc(segment.x, segment.y, segment.radius + i * 3, 0, Math.PI * 2); // 波動の間隔を狭める
      ctx.strokeStyle = `rgba(255, 255, 255, ${segment.opacity - i * 0.015})`; // 透明度の変化を緩やかに
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    segment.radius += 1.5;
    segment.opacity -= 0.01; // 消えるスピードを遅く
    if (segment.opacity <= 0) {
      mousePath.splice(index, 1);
    }
  });
}

let lastMouseX = 0;
let lastMouseY = 0;

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  const currentX = event.clientX - rect.left;
  const currentY = event.clientY - rect.top;
  
  // マウスの移動距離に応じて補間点を追加
  const dx = currentX - lastMouseX;
  const dy = currentY - lastMouseY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance > 5) {
    const steps = Math.floor(distance / 5);
    for (let i = 0; i < steps; i++) {
      mousePath.push({
        x: lastMouseX + (dx * i / steps),
        y: lastMouseY + (dy * i / steps),
        radius: 3,
        opacity: 0.2,
      });
    }
  }
  
  lastMouseX = currentX;
  lastMouseY = currentY;

  if (mousePath.length > 200) { // パスの最大長を増やす
    mousePath.shift();
  }
});

function animate(timestamp) {
  drawMatrix(timestamp);
  drawMousePath();
  requestAnimationFrame(animate);
}

animate();

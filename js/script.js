const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 20; // 文字サイズを小さめ
const columns = Math.floor(canvas.width / fontSize); // 列数を計算
const drops = new Array(columns).fill(null).map(() => ({
  y: Math.random() * canvas.height * -1,
  speed: 5 + Math.random() * 2, // 落下速度を速めに
  currentChar: characters[Math.floor(Math.random() * characters.length)],
}));

let mousePath = [];

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // 背景の残像を減らす
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0F0';
  ctx.font = `${fontSize}px monospace`;

  drops.forEach((drop, i) => {
    const x = i * fontSize;
    ctx.fillText(drop.currentChar, x, drop.y);
    drop.y += drop.speed;

    if (drop.y > canvas.height) {
      drop.y = -fontSize;
      drop.speed = 5 + Math.random() * 2; // リセット時の速度調整
      drop.currentChar = characters[Math.floor(Math.random() * characters.length)];
    }
  });
}

function drawMousePath() {
  if (mousePath.length < 2) return;

  mousePath.forEach((segment, index) => {
    for (let i = 0; i < 10; i++) { // 円の出力個数を減らす
      ctx.beginPath();
      ctx.arc(segment.x, segment.y, segment.radius + i * 10, 0, Math.PI * 2); // 波動のサイズ
      ctx.strokeStyle = `rgba(255, 255, 255, ${segment.opacity - i * 0.05})`; // 弱めた光の強さ
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    segment.radius += 1; // 波動の広がり速度を減らす
    segment.opacity -= 0.02; // 透明度を早めに減少
    if (segment.opacity <= 0) {
      mousePath.splice(index, 1);
    }
  });
}

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  mousePath.push({
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    radius: 3,
    opacity: 0.2,
  });

  if (mousePath.length > 150) { // パスの最大長を減少
    mousePath.shift();
  }
});

function animate() {
  drawMatrix();
  drawMousePath();
  requestAnimationFrame(animate);
}

animate();

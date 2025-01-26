// キャンバスの設定
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// サイズをウィンドウ全体に設定
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// マトリックスの文字列
const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const columns = canvas.width / 20; // 列の数
const drops = Array(Math.floor(columns)).fill(1);

// 光の軌跡の配列
const trails = [];

// 描画処理（マトリックス効果）
function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#00FF00';
  ctx.font = '20px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = characters[Math.floor(Math.random() * characters.length)];
    const x = i * 20;
    const y = drops[i] * 20;

    ctx.fillText(text, x, y);

    if (y > canvas.height && Math.random() > 0.95) {
      drops[i] = 0; // リセット
    }

    drops[i]++;
  }
}

// 光の軌跡を描画する関数
function drawTrails() {
  trails.forEach((trail, index) => {
    ctx.beginPath();
    ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${trail.opacity})`;
    ctx.fill();

    // 軌跡を少しずつ小さくして消していく
    trail.size *= 0.95;
    trail.opacity -= 0.02;

    // 完全に消えたら配列から削除
    if (trail.opacity <= 0) {
      trails.splice(index, 1);
    }
  });
}

// マウスの移動を監視し、軌跡を追加
canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  trails.push({
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    size: 10,
    opacity: 1,
  });
});

// アニメーションの開始
function animate() {
  drawMatrix();
  drawTrails();
  requestAnimationFrame(animate);
}

animate();

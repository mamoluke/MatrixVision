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

// 線の軌跡を保持する配列
let mousePath = [];

// ウィンドウリサイズ時にキャンバスのサイズを更新
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

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

    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0; // リセット
    }

    drops[i] += 0.5; // 降るスピードをゆっくりにする
  }
}

// マウス軌跡を描画する関数
function drawMousePath() {
  if (mousePath.length < 2) return; // 線を描画するのに最低2点必要

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.moveTo(mousePath[0].x, mousePath[0].y);

  for (let i = 1; i < mousePath.length; i++) {
    ctx.lineTo(mousePath[i].x, mousePath[i].y);
  }
  ctx.stroke();

  // 軌跡を徐々にフェードアウト
  for (let i = 0; i < mousePath.length; i++) {
    mousePath[i].opacity -= 0.02;
    if (mousePath[i].opacity <= 0) {
      mousePath.splice(i, 1);
      i--;
    }
  }
}

// マウスの移動を監視し、軌跡を更新
canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  mousePath.push({
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    opacity: 1,
  });

  // 配列が長くなりすぎないよう制限
  if (mousePath.length > 100) {
    mousePath.shift();
  }
});

// アニメーションの開始
function animate() {
  drawMatrix(); // マトリックス描画
  drawMousePath(); // マウス軌跡描画
  requestAnimationFrame(animate);
}

// アニメーション開始
animate();

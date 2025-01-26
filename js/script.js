// キャンバスの設定
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// サイズをウィンドウ全体に設定
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// マトリックスの文字列
const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 30;
const columns = Math.floor(canvas.width / fontSize);
const drops = new Array(columns).fill(null).map(() => ({
  y: Math.random() * canvas.height * -1, // ランダムな開始位置
  speed: 1 + Math.random() * 0.5, // 個別の落下速度
  lastUpdate: 0 // 最後の更新時刻
}));

// 線の軌跡を保持する配列
let mousePath = [];

// ウィンドウリサイズ時にキャンバスのサイズを更新
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// 描画処理（マトリックス効果）
function drawMatrix(timestamp) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0F0';
  ctx.font = `${fontSize}px monospace`;

  drops.forEach((drop, i) => {
    // 一定間隔で更新
    if (timestamp - drop.lastUpdate > 50) {
      const text = characters[Math.floor(Math.random() * characters.length)];
      const x = i * fontSize;
      
      ctx.fillText(text, x, drop.y);
      
      drop.y += drop.speed;
      drop.lastUpdate = timestamp;

      // 画面外に出たら上からリスタート
      if (drop.y > canvas.height) {
        drop.y = -fontSize;
        drop.speed = 1 + Math.random() * 0.5; // 新しい速度を設定
      }
    }
  });
}

// マウス軌跡を描画する関数（波動エフェクト）
function drawMousePath() {
  if (mousePath.length < 2) return;

  mousePath.forEach((segment, index) => {
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.arc(segment.x, segment.y, segment.radius + i * 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${segment.opacity - i * 0.03})`;
      ctx.lineWidth = 5;
      ctx.stroke();
    }
    segment.radius += 2;
    segment.opacity -= 0.02;
    if (segment.opacity <= 0) {
      mousePath.splice(index, 1);
    }
  });
}

// マウスの移動を監視し、波動を作成
canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  mousePath.push({
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    radius: 5,
    opacity: 0.3,
  });

  if (mousePath.length > 100) {
    mousePath.shift();
  }
});

// アニメーションの開始
function animate(timestamp) {
  drawMatrix(timestamp);
  drawMousePath();
  requestAnimationFrame(animate);
}

animate();

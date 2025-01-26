// キャンバスの設定
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// サイズをウィンドウ全体に設定
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// マトリックスの文字列
const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 25; // 文字サイズを調整
const columns = canvas.width / fontSize; // 列の数
const drops = Array(Math.floor(columns)).fill(0); // 各列のドロップ開始位置

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
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = characters[Math.floor(Math.random() * characters.length)];
    const x = i * fontSize; // 列間隔を文字サイズで調整
    const y = drops[i] * fontSize;

    ctx.fillText(text, x, y);

    // ランダムで文字をリセットしてスピードを調整
    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0; // リセット
    }

    drops[i] += 0.3; // 降るスピードをゆっくりに
  }
}

// マウス軌跡を描画する関数
function drawMousePath() {
  if (mousePath.length < 2) return; // 線を描画するのに最低2点必要

  ctx.beginPath();
  ctx.lineWidth = 20; // 太めの線
  ctx.lineJoin = 'round'; // 滑らかな接続
  ctx.lineCap = 'round'; // 丸い端

  // 動きの波動を表現
  for (let i = 0; i < mousePath.length; i++) {
    const segment = mousePath[i];
    ctx.strokeStyle = `rgba(255, 255, 255, ${segment.opacity})`;
    ctx.beginPath();
    ctx.arc(segment.x, segment.y, segment.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 軌跡の透明度と半径を徐々に減少
  mousePath.forEach((segment, index) => {
    segment.opacity -= 0.05;
    segment.radius += 2; // 半径を拡大して波のように
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
    radius: 5, // 初期半径を小さく
    opacity: 0.5, // 最初の明るさを暗めに
  });
});

// アニメーションの開始
function animate() {
  drawMatrix(); // マトリックス描画
  drawMousePath(); // マウス軌跡描画
  requestAnimationFrame(animate);
}

// アニメーション開始
animate();

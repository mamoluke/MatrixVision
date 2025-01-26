// キャンバスの設定
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// サイズをウィンドウ全体に設定
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// マトリックスの文字列（スペースを含む）
const characters = ' 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
const fontSize = 30; // 文字サイズを調整（間隔を広げる）
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
    // ランダムな文字またはスペースを選択
    const text = characters[Math.floor(Math.random() * characters.length)];
    const x = i * fontSize; // 列間隔を文字サイズで調整
    const y = drops[i] * fontSize;

    // 文字を描画
    ctx.fillText(text, x, y);

    // 画面下に到達した列をリセットし、ランダムな位置で再スタート
    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i] += 0.3; // 文字の降るスピードを調整
  }
}

// マウス軌跡を描画する関数
function drawMousePath() {
  if (mousePath.length < 2) return; // 波動を描画するのに最低2点必要

  // 軌跡ごとに波動を描画
  mousePath.forEach((segment, index) => {
    for (let i = 0; i < 3; i++) { // 波動を3倍出力
      ctx.beginPath();
      ctx.arc(segment.x, segment.y, segment.radius + i * 15, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${segment.opacity - i * 0.1})`;
      ctx.lineWidth = 10;
      ctx.stroke();
    }
    // 半径を拡大し透明度を減少
    segment.radius += 5; // サイズを2倍くらいに拡大
    segment.opacity -= 0.05;
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
    radius: 10, // 初期半径
    opacity: 0.8, // 初期透明度
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

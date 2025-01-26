const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// キャンバスサイズ設定
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// マトリックス文字列
const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 20; // 文字サイズ
const columns = Math.floor(canvas.width / fontSize); // 列数を計算
const drops = new Array(columns).fill(0); // 各列のドロップ開始位置

// リサイズ対応
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// 背景文字を描画する関数
function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // 背景の暗さ
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0F0'; // 緑色の文字
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = characters[Math.floor(Math.random() * characters.length)];
    const x = i * fontSize; // 列間隔
    const y = drops[i] * fontSize; // ドロップ位置

    // 文字を描画
    ctx.fillText(text, x, y);

    // ドロップの位置を更新
    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0; // リセット
    }

    drops[i]++; // 降る速度を調整
  }
}

// アニメーションの開始
function animate() {
  drawMatrix(); // 背景の文字
  requestAnimationFrame(animate);
}

// アニメーション開始
animate();

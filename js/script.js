const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// キャンバスサイズ設定
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// マトリックス文字列
const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 20; // 文字サイズ
const columns = Math.floor(canvas.width / fontSize); // 列の数
const drops = Array(columns).fill(0); // 各列のドロップ開始位置

// 背景文字を描画する関数
function drawMatrix() {
  // 背景を半透明の黒で塗りつぶして文字の残像効果を作成
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 文字の色とフォント設定
  ctx.fillStyle = '#0F0'; // 緑色
  ctx.font = `${fontSize}px monospace`;

  // 各列ごとに文字を描画
  for (let i = 0; i < drops.length; i++) {
    const text = characters[Math.floor(Math.random() * characters.length)]; // ランダムな文字
    const x = i * fontSize; // 列間隔
    const y = drops[i] * fontSize; // 現在の位置

    // 文字を描画
    ctx.fillText(text, x, y);

    // ドロップの位置を更新
    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0; // リセットして再降下
    }

    drops[i]++; // 降るスピード
  }
}

// アニメーションを開始する関数
function animate() {
  drawMatrix();
  requestAnimationFrame(animate);
}

// キャンバスサイズをリサイズ時に更新
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drops.length = Math.floor(canvas.width / fontSize);
  drops.fill(0);
});

// アニメーション開始
animate();

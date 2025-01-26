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

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // 半透明の黒で背景を塗りつぶす
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0F0'; // 緑色の文字
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = characters[Math.floor(Math.random() * characters.length)];
    const x = i * fontSize;
    const y = drops[i] * fontSize;

    ctx.fillText(text, x, y);

    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
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

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

// 描画処理
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

// アニメーションの開始
setInterval(drawMatrix, 50);

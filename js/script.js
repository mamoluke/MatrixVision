const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// キャンバスサイズ設定
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// マトリックスの文字列（ランダムな文字）
const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 15; // 文字サイズを小さくして密度を上げる
const columns = Math.floor(canvas.width / fontSize); // 列数を計算
const drops = new Array(columns).fill(0); // 各列の降下位置

let mousePath = [];

// リサイズ対応
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * canvas.height;
  }
});

// 背景文字を描画する関数
function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // 背景を暗くしつつ残像を抑える
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#00FF00'; // 緑色の文字
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < columns; i++) {
    const text = characters[Math.floor(Math.random() * characters.length)];
    const x = i * fontSize;
    const y = drops[i] * fontSize;

    ctx.fillText(text, x, y);

    // ドロップの位置を更新
    drops[i] += 1.5 + Math.random(); // スピードをランダムで速め

    // 画面下に到達したらリセット
    if (y > canvas.height) {
      drops[i] = 0;
    }
  }
}

// マウスの波動を描画する関数
function drawMousePath() {
  if (mousePath.length < 2) return;

  mousePath.forEach((segment, index) => {
    for (let i = 0; i < 6; i++) { // 波動の出力個数を減らす
      ctx.beginPath();
      ctx.arc(segment.x, segment.y, segment.radius + i * 7, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${segment.opacity - i * 0.04})`;
      ctx.lineWidth = 2; // 細い線
      ctx.stroke();
    }
    segment.radius += 1.5; // 波動の広がり速度
    segment.opacity -= 0.03; // 波動の透明度
    if (segment.opacity <= 0) {
      mousePath.splice(index, 1);
    }
  });
}

// マウス移動を検知して波動を追加
canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  mousePath.push({
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    radius: 3, // 小さめの半径
    opacity: 0.3, // 控えめな透明度
  });

  // 配列が長くなりすぎないように制限
  if (mousePath.length > 50) {
    mousePath.shift();
  }
});

// アニメーションの開始
function animate() {
  drawMatrix(); // 背景の文字
  drawMousePath(); // マウスの波動
  requestAnimationFrame(animate);
}

animate();

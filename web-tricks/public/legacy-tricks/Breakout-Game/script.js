// pull doms
const rulesBtn = document.getElementById("rules-btn");
const rulesEl = document.getElementById("rules");
const closeBtn = document.getElementById("close-btn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;
let bestScore = 0;
const breakRowCount = 5;
const breakColCount = 9;
const padding = 5;

// create ball props
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 1,
  dx: 4 * (Math.random() > 0.5 ? 1 : -1),
  dy: -4 * (Math.random() > 0.5 ? 1 : -1),
};
// draw ball
const drawBall = () => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
};
// move ball
const err = {};
const moveBall = () => {
  ball.x += ball.dx * ball.speed;
  ball.y += ball.dy * ball.speed;
  // left and right walls
  if (ball.x + ball.size > canvas.width || ball.x < ball.size) {
    ball.dx *= -1;
  }
  // top wall
  if (ball.y < ball.size) {
    ball.dy *= -1;
  }
  // bottom
  if (ball.y + ball.size > canvas.height) {
    stop();
    return;
  }
  // hit paddle
  if (
    ball.y + ball.size >= paddle.y &&
    ball.x + ball.size >= paddle.x &&
    ball.x - ball.size <= paddle.x + paddle.w
  ) {
    ball.dy *= -1;
    return;
  }
  // hit bricks
  let leftWithin = false;
  let rightWithin = false;
  let topWithin = false;
  let bottomWithin = false;
  let noBricks = true;
  try {
    bricks.forEach((row) => {
      row.forEach((brick) => {
        if (brick.visible) {
          noBricks = false;
          leftWithin = ball.x + ball.size >= brick.x;
          rightWithin = ball.x - ball.size <= brick.x + brick.w;
          topWithin = ball.y + ball.size >= brick.y;
          bottomWithin = ball.y - ball.size <= brick.y + brick.h;

          // hit
          if (leftWithin && rightWithin && topWithin && bottomWithin) {
            brick.visible = false;
            score += 1;
            ball.speed *= 1.02;
            padding.speed *= 1.02;
            if (ball.x >= brick.x && ball.x <= brick.x + brick.w) {
              ball.dy *= -1;
            }
            if (ball.y >= brick.y && ball.y <= brick.y + brick.h) {
              ball.dx *= -1;
            }
            throw err;
          }
        }
      });
    });
  } catch (error) {}
  if (noBricks) {
    stop();
  }
};
// create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};
// draw paddle
const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
};
// move paddle

const movePaddle = () => {
  paddle.x += paddle.dx;
  if (paddle.x + paddle.w > canvas.width - padding) {
    paddle.x = canvas.width - paddle.w - padding;
  } else if (paddle.x < padding) {
    paddle.x = padding;
  }
};
// draw score
const drawScore = () => {
  ctx.font = "20px Arial";
  ctx.fillText(
    `${score > bestScore ? "Best Score:" : "Score:"}${score}`,
    canvas.width - 120,
    30,
  );
};
// create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};
// draw bricks
const bricks = [];
const initBricks = () => {
  for (let i = 0; i < breakRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < breakColCount; j++) {
      const x = j * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
      const y = i * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
      bricks[i][j] = { x, y, ...brickInfo };
    }
  }
};
const drawBricks = () => {
  bricks.forEach((row) => {
    row.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
};

// draw everything
const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
};

// update frame
const update = () => {
  // move ball
  moveBall();
  // move paddle
  movePaddle();
  // draw everything
  draw();

  requestAnimationFrame(update);
};
// init
const init = () => {
  initBricks();
  ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 1,
    dx: 4 * (Math.random() > 0.5 ? 1 : -1),
    dy: -4 * (Math.random() > 0.5 ? 1 : -1),
  };
  score = 0;
  const best = localStorage.getItem("bestscore");
  bestScore = best ? best : 0;
};
const stop = () => {
  if (score > bestScore) {
    localStorage.setItem("bestscore", score);
  }
  init();
};

// event listeners
rulesBtn.addEventListener("click", (e) => {
  rulesEl.classList.add("show");
});
closeBtn.addEventListener("click", (e) => {
  rulesEl.classList.remove("show");
});
window.addEventListener("keydown", (e) => {
  // start control paddle
  if (e.key == "Right" || e.key == "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
});
window.addEventListener("keyup", (e) => {
  // stop control paddle
  if (
    e.key == "Right" ||
    e.key == "ArrowRight" ||
    e.key == "Left" ||
    e.key == "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
});

// init
init();

// update
update();

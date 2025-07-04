<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
    <h1 class="text-4xl font-bold mb-6 text-purple-400">Tetris Game</h1>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="relative border-4 border-purple-500 rounded-lg shadow-lg overflow-hidden">
        <canvas ref="gameCanvas" class="bg-gray-800 block"></canvas>
        <div v-if="gameOver" class="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-center">
          <p class="text-5xl font-extrabold text-red-500 mb-4 animate-bounce">GAME OVER!</p>
          <p class="text-2xl text-white mb-6">Score: {{ score }}</p>
          <button @click="restartGame" class="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            Play Again
          </button>
        </div>
        <div v-if="paused && !gameOver" class="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center text-center">
          <p class="text-5xl font-extrabold text-yellow-400 animate-pulse">PAUSED</p>
        </div>
      </div>

      <div class="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg shadow-lg border-4 border-purple-500">
        <div class="text-2xl font-semibold text-purple-300">Score: <span class="text-white">{{ score }}</span></div>
        <div class="text-2xl font-semibold text-purple-300">Level: <span class="text-white">{{ level }}</span></div>
        <div class="text-2xl font-semibold text-purple-300">Lines: <span class="text-white">{{ linesCleared }}</span></div>
        <div class="mt-4">
          <h3 class="text-xl font-semibold text-purple-300 mb-2">Next Piece:</h3>
          <canvas ref="nextPieceCanvas" class="bg-gray-700 border border-gray-600 rounded"></canvas>
        </div>
        <div class="mt-4 text-sm text-gray-400">
          <p>Controls:</p>
          <p>← → : Move</p>
          <p>↓ : Soft Drop</p>
          <p>↑ / Space : Rotate</p>
          <p>P : Pause</p>
          <p>R : Restart</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue';

// --- Constants ---
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30; // Pixels per block
const INITIAL_DROP_INTERVAL = 1000; // Milliseconds
const LEVEL_UP_LINES = 10; // Lines to clear to level up

// --- Types ---
type Block = {
  x: number;
  y: number;
  color: string;
};

type TetrominoShape = number[][];

interface Tetromino {
  shape: TetrominoShape;
  color: string;
  x: number;
  y: number;
  id: string; // Unique identifier for the tetromino type
}

type Board = (string | null)[][]; // Stores colors or null for empty

// --- Reactive State ---
const gameCanvas = ref<HTMLCanvasElement | null>(null);
const nextPieceCanvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let nextPieceCtx: CanvasRenderingContext2D | null = null;

const board = ref<Board>([]);
const currentPiece = ref<Tetromino | null>(null);
const nextPiece = ref<Tetromino | null>(null);
const score = ref(0);
const level = ref(1);
const linesCleared = ref(0);
const gameOver = ref(false);
const paused = ref(false);

let lastDropTime = 0;
let dropInterval = INITIAL_DROP_INTERVAL;
let animationFrameId: number | null = null;

// --- Tetromino Definitions ---
const TETROMINOES: { [key: string]: { shape: TetrominoShape; color: string } } = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00FFFF', // Cyan
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#FFFF00', // Yellow
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#800080', // Purple
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#00FF00', // Green
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#FF0000', // Red
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#0000FF', // Blue
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#FFA500', // Orange
  },
};

const TETROMINO_KEYS = Object.keys(TETROMINOES);

// --- Game Initialization ---
const initializeGame = () => {
  // Initialize board with nulls
  board.value = Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(null));

  score.value = 0;
  level.value = 1;
  linesCleared.value = 0;
  gameOver.value = false;
  paused.value = false;
  dropInterval = INITIAL_DROP_INTERVAL;
  lastDropTime = 0;

  // Get initial pieces
  currentPiece.value = generateRandomTetromino();
  nextPiece.value = generateRandomTetromino();

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  animationFrameId = requestAnimationFrame(gameLoop);
};

// --- Tetromino Generation ---
const generateRandomTetromino = (): Tetromino => {
  const randomKey = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
  const { shape, color } = TETROMINOES[randomKey];
  // Initial position: top center
  const x = Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2);
  const y = 0; // Start at the top
  return { shape, color, x, y, id: randomKey };
};

// --- Collision Detection ---
const checkCollision = (piece: Tetromino, newX: number, newY: number, newShape: TetrominoShape): boolean => {
  for (let row = 0; row < newShape.length; row++) {
    for (let col = 0; col < newShape[row].length; col++) {
      if (newShape[row][col] !== 0) {
        const boardX = newX + col;
        const boardY = newY + row;

        // Check boundaries
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
          return true; // Collision with wall or bottom
        }
        // Check collision with existing blocks on the board (ignore blocks above the board)
        if (boardY >= 0 && board.value[boardY] && board.value[boardY][boardX] !== null) {
          return true; // Collision with existing block
        }
      }
    }
  }
  return false;
};

// --- Piece Movement ---
const movePiece = (deltaX: number, deltaY: number) => {
  if (!currentPiece.value || gameOver.value || paused.value) return;

  const newX = currentPiece.value.x + deltaX;
  const newY = currentPiece.value.y + deltaY;

  if (!checkCollision(currentPiece.value, newX, newY, currentPiece.value.shape)) {
    currentPiece.value.x = newX;
    currentPiece.value.y = newY;
    return true; // Move successful
  }
  return false; // Move failed (collision)
};

const rotatePiece = () => {
  if (!currentPiece.value || gameOver.value || paused.value) return;

  const originalShape = currentPiece.value.shape;
  const newShape: TetrominoShape = originalShape[0].map((_, index) =>
    originalShape.map((row) => row[index]).reverse()
  );

  // Wall kick logic (simple)
  const kicks = [
    [0, 0], // No kick
    [-1, 0], // Kick left
    [1, 0], // Kick right
    [0, -1], // Kick up (for T, L, J, S, Z)
  ];

  for (const [offsetX, offsetY] of kicks) {
    const newX = currentPiece.value.x + offsetX;
    const newY = currentPiece.value.y + offsetY;
    if (!checkCollision(currentPiece.value, newX, newY, newShape)) {
      currentPiece.value.shape = newShape;
      currentPiece.value.x = newX;
      currentPiece.value.y = newY;
      return;
    }
  }
};

const dropPiece = () => {
  if (!currentPiece.value || gameOver.value || paused.value) return;

  if (!movePiece(0, 1)) {
    // Piece landed, lock it to the board
    lockPiece();
    clearLines();
    spawnNewPiece();
  }
};

const softDrop = () => {
  if (!currentPiece.value || gameOver.value || paused.value) return;
  dropPiece();
  score.value += 1; // Small score for soft drop
};

// --- Lock Piece to Board ---
const lockPiece = () => {
  if (!currentPiece.value) return;

  for (let row = 0; row < currentPiece.value.shape.length; row++) {
    for (let col = 0; col < currentPiece.value.shape[row].length; col++) {
      if (currentPiece.value.shape[row][col] !== 0) {
        const boardX = currentPiece.value.x + col;
        const boardY = currentPiece.value.y + row;

        if (boardY < 0) { // Piece locked above the board, game over
          gameOver.value = true;
          return;
        }
        board.value[boardY][boardX] = currentPiece.value.color;
      }
    }
  }
};

// --- Line Clearing ---
const clearLines = () => {
  let linesClearedThisTurn = 0;
  const newBoard: Board = [];

  for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
    if (board.value[row].every((block) => block !== null)) {
      linesClearedThisTurn++;
    } else {
      newBoard.unshift([...board.value[row]]); // Add non-full rows to the top of newBoard
    }
  }

  // Fill the top with empty rows
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  board.value = newBoard;

  if (linesClearedThisTurn > 0) {
    linesCleared.value += linesClearedThisTurn;
    score.value += calculateScore(linesClearedThisTurn, level.value);
    checkLevelUp();
  }
};

const calculateScore = (numLines: number, currentLevel: number): number => {
  const lineScores = [0, 100, 300, 500, 800]; // Score for 0, 1, 2, 3, 4 lines
  return lineScores[numLines] * currentLevel;
};

const checkLevelUp = () => {
  if (linesCleared.value >= level.value * LEVEL_UP_LINES) {
    level.value++;
    dropInterval = Math.max(50, INITIAL_DROP_INTERVAL - (level.value - 1) * 50); // Decrease interval, min 50ms
  }
};

// --- Spawn New Piece ---
const spawnNewPiece = () => {
  currentPiece.value = nextPiece.value;
  nextPiece.value = generateRandomTetromino();

  // Check for immediate game over on spawn
  if (currentPiece.value && checkCollision(currentPiece.value, currentPiece.value.x, currentPiece.value.y, currentPiece.value.shape)) {
    gameOver.value = true;
  }
};

// --- Rendering ---
const drawBlock = (context: CanvasRenderingContext2D, x: number, y: number, color: string) => {
  context.fillStyle = color;
  context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  context.strokeStyle = '#333'; // Border color
  context.lineWidth = 1;
  context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
};

const drawBoard = () => {
  if (!ctx) return;
  ctx.clearRect(0, 0, BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);

  for (let row = 0; row < BOARD_HEIGHT; row++) {
    for (let col = 0; col < BOARD_WIDTH; col++) {
      if (board.value[row][col] !== null) {
        drawBlock(ctx, col, row, board.value[row][col] as string);
      }
    }
  }
};

const drawCurrentPiece = () => {
  if (!ctx || !currentPiece.value) return;

  for (let row = 0; row < currentPiece.value.shape.length; row++) {
    for (let col = 0; col < currentPiece.value.shape[row].length; col++) {
      if (currentPiece.value.shape[row][col] !== 0) {
        drawBlock(ctx, currentPiece.value.x + col, currentPiece.value.y + row, currentPiece.value.color);
      }
    }
  }
};

const drawNextPiece = () => {
  if (!nextPieceCtx || !nextPiece.value) return;

  // Clear previous drawing
  nextPieceCtx.clearRect(0, 0, nextPieceCanvas.value!.width, nextPieceCanvas.value!.height);

  // Calculate center offset for next piece display
  const pieceWidth = nextPiece.value.shape[0].length;
  const pieceHeight = nextPiece.value.shape.length;
  const startX = (nextPieceCanvas.value!.width / BLOCK_SIZE - pieceWidth) / 2;
  const startY = (nextPieceCanvas.value!.height / BLOCK_SIZE - pieceHeight) / 2;

  for (let row = 0; row < pieceHeight; row++) {
    for (let col = 0; col < pieceWidth; col++) {
      if (nextPiece.value.shape[row][col] !== 0) {
        drawBlock(nextPieceCtx, startX + col, startY + row, nextPiece.value.color);
      }
    }
  }
};

// --- Game Loop ---
const gameLoop = (currentTime: DOMHighResTimeStamp) => {
  if (gameOver.value || paused.value) {
    animationFrameId = requestAnimationFrame(gameLoop); // Keep loop alive for pause/game over screen
    return;
  }

  if (currentTime - lastDropTime > dropInterval) {
    dropPiece();
    lastDropTime = currentTime;
  }

  drawBoard();
  drawCurrentPiece();
  drawNextPiece(); // Ensure next piece is always drawn

  animationFrameId = requestAnimationFrame(gameLoop);
};

// --- Event Handlers ---
const handleKeyDown = (event: KeyboardEvent) => {
  if (gameOver.value) {
    if (event.key === 'r' || event.key === 'R') {
      restartGame();
    }
    return;
  }

  switch (event.key) {
    case 'ArrowLeft':
      movePiece(-1, 0);
      break;
    case 'ArrowRight':
      movePiece(1, 0);
      break;
    case 'ArrowDown':
      softDrop();
      break;
    case 'ArrowUp':
    case ' ': // Spacebar
      rotatePiece();
      break;
    case 'p':
    case 'P':
      paused.value = !paused.value;
      break;
    case 'r':
    case 'R':
      restartGame();
      break;
  }
};

const restartGame = () => {
  initializeGame();
};

// --- Lifecycle Hooks ---
onMounted(() => {
  if (gameCanvas.value) {
    gameCanvas.value.width = BOARD_WIDTH * BLOCK_SIZE;
    gameCanvas.value.height = BOARD_HEIGHT * BLOCK_SIZE;
    ctx = gameCanvas.value.getContext('2d');
  }

  if (nextPieceCanvas.value) {
    // Set a fixed size for the next piece display, large enough for any tetromino
    nextPieceCanvas.value.width = 6 * BLOCK_SIZE; // Max 4 blocks wide + padding
    nextPieceCanvas.value.height = 4 * BLOCK_SIZE; // Max 4 blocks high
    nextPieceCtx = nextPieceCanvas.value.getContext('2d');
  }

  initializeGame();
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener('keydown', handleKeyDown);
});

// Watch for changes in nextPiece to redraw it
watch(nextPiece, () => {
  drawNextPiece();
}, { deep: true });

</script>

<style scoped>
/* Custom CSS if needed, but Tailwind should cover most styling */
/* Example: If you want a specific font not in Tailwind, or complex animations */
.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>

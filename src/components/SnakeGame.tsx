import { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const directionRef = useRef<Point>({ x: 0, y: -1 });
  const nextDirectionRef = useRef<Point>({ x: 0, y: -1 });
  const foodRef = useRef<Point>({ x: 15, y: 5 });

  const generateFood = (currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOccupied) {
        break;
      }
    }
    return newFood;
  };

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = { x: 0, y: -1 };
    nextDirectionRef.current = { x: 0, y: -1 };
    foodRef.current = generateFood(snakeRef.current);
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      directionRef.current = nextDirectionRef.current;
      const head = snakeRef.current[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      // Self collision
      if (snakeRef.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return;
      }

      const newSnake = [newHead, ...snakeRef.current];

      // Food collision
      if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
        foodRef.current = generateFood(newSnake);
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;
    };

    const gameLoop = setInterval(() => {
      moveSnake();
      draw();
    }, 120);

    return () => clearInterval(gameLoop);
  }, [gameOver, isPaused, score, onScoreChange]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_SIZE, i); ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#f0f';
    ctx.fillRect(foodRef.current.x * CELL_SIZE, foodRef.current.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Snake
    snakeRef.current.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#fff' : '#0ff';
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
  };

  // Initial draw
  useEffect(() => {
    draw();
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      <div className="border-jarring p-1 bg-black">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-black"
        />
      </div>

      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10 border-jarring">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-digital text-[#f0f] glitch-heavy mb-4" data-text="FATAL_ERROR">FATAL_ERROR</h2>
            <p className="text-2xl text-[#0ff] mb-6">YIELD: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-[#0ff] text-black font-digital text-xl hover:bg-[#f0f] hover:text-white transition-none cursor-pointer uppercase border-2 border-transparent hover:border-[#0ff]"
            >
              REBOOT_SEQUENCE
            </button>
          </div>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 border-4 border-[#0ff]">
          <h2 className="text-4xl md:text-5xl font-digital text-[#0ff] glitch-heavy" data-text="EXECUTION_SUSPENDED">EXECUTION_SUSPENDED</h2>
        </div>
      )}
    </div>
  );
}

import { useState, useCallback, useRef, useEffect } from 'react';
import gameMusic from '@/assets/game-music.mp3';
import playbuoyLogo from '@/assets/playbuoy-logo.png';
import omega7Pill from '@/assets/omega7-pill.png';

// Types
type Gender = 'male' | 'female';
type Lane = 0 | 1 | 2;
type ObstacleType = 'standing' | 'low';
type GameLevel = 'OMEGA' | 'OMEGA.A';
type GameStatus = 'loading' | 'menu' | 'playing' | 'gameOver';

interface Player {
  lane: Lane;
  isDucking: boolean;
  gender: Gender;
  y: number;
}

interface Obstacle {
  id: number;
  lane: Lane;
  type: ObstacleType;
  z: number;
  emoji: string;
  label: string;
}

interface GameState {
  status: GameStatus;
  score: number;
  speed: number;
  highScore: number;
  isColliding?: boolean;
  nearMissLane?: number | null;
  level: GameLevel;
  levelTransition: boolean;
}

// Constants
const LEVEL_CONFIG = {
  'OMEGA': {
    baseSpeed: 0.8,
    speedIncrement: 0.0005,
    maxSpeed: 2.0,
    spawnInterval: 1500,
    visualIntensity: 0,
  },
  'OMEGA.A': {
    baseSpeed: 1.4,
    speedIncrement: 0.001,
    maxSpeed: 3.5,
    spawnInterval: 1000,
    visualIntensity: 1,
  },
};

const LEVEL_UNLOCK_SCORE = 7000;
const DUCK_DURATION = 500;

const PROSPECT_EMOJIS = {
  standing: [
    { emoji: '💑', label: 'Clingy Couple' },
    { emoji: '🤵', label: 'Desperate Dan' },
    { emoji: '👰', label: 'Wedding Wendy' },
    { emoji: '🧑‍💼', label: 'Boring Brad' },
    { emoji: '💃', label: 'Drama Diana' },
    { emoji: '🕺', label: 'Party Pete' },
  ],
  low: [
    { emoji: '💘', label: 'Love Arrow' },
    { emoji: '💌', label: 'Love Letter' },
    { emoji: '🌹', label: 'Rose Trap' },
    { emoji: '💍', label: 'Ring Alert' },
    { emoji: '💝', label: 'Gift Box' },
  ],
};


// Main Game Component
interface PlaybuoyGameProps {
  onTrialComplete?: (accessCode: string) => void;
}

export default function PlaybuoyGame({ onTrialComplete }: PlaybuoyGameProps) {
  const [player, setPlayer] = useState<Player>({
    lane: 1,
    isDucking: false,
    gender: 'male',
    y: 0,
  });

  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    status: 'loading',
    score: 0,
    speed: LEVEL_CONFIG['OMEGA'].baseSpeed,
    highScore: 0,
    isColliding: false,
    nearMissLane: null,
    level: 'OMEGA',
    levelTransition: false,
  });

  // Loading screen timer
  useEffect(() => {
    if (gameState.status === 'loading') {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, status: 'menu' }));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [gameState.status]);

  const [animationTick, setAnimationTick] = useState(0);
  const [trialCompleted, setTrialCompleted] = useState(false);
  const [accessButtonClicked, setAccessButtonClicked] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);

  // Generate access code when trial is completed
  const generateAccessCode = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'OMEGA-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }, []);

  const animationRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);
  const obstacleIdRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const duckTimeoutRef = useRef<NodeJS.Timeout>();
  const hasTransitionedRef = useRef<boolean>(false);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(gameMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Control music based on game state
  useEffect(() => {
    if (audioRef.current) {
      if (gameState.status === 'playing') {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [gameState.status]);

  // Animation tick
  useEffect(() => {
    if (gameState.status !== 'playing') return;
    const interval = setInterval(() => {
      setAnimationTick(t => (t + 1) % 1000);
    }, gameState.level === 'OMEGA.A' ? 30 : 50);
    return () => clearInterval(interval);
  }, [gameState.status, gameState.level]);

  const spawnObstacle = useCallback((level: GameLevel) => {
    const lane = Math.floor(Math.random() * 3) as Lane;
    const type = Math.random() > 0.3 ? 'standing' : 'low';
    const prospects = PROSPECT_EMOJIS[type];
    const prospect = prospects[Math.floor(Math.random() * prospects.length)];

    setObstacles(prev => [...prev, {
      id: obstacleIdRef.current++,
      lane,
      type,
      z: 0,
      emoji: prospect.emoji,
      label: prospect.label,
    }]);
  }, []);

  const checkCollision = useCallback((player: Player, obstacle: Obstacle): boolean => {
    if (obstacle.z < 85 || obstacle.z > 100) return false;
    if (player.lane !== obstacle.lane) return false;
    if (obstacle.type === 'low' && player.isDucking) return false;
    return true;
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    setGameState(prev => {
      if (prev.status !== 'playing') return prev;

      const config = LEVEL_CONFIG[prev.level];
      const newSpeed = Math.min(prev.speed + config.speedIncrement, config.maxSpeed);
      const newScore = prev.score + Math.floor(newSpeed * 10);

      // Check for level transition - auto grant access when reaching 7000
      if (prev.level === 'OMEGA' && newScore >= LEVEL_UNLOCK_SCORE && !hasTransitionedRef.current) {
        hasTransitionedRef.current = true;
        setTrialCompleted(true);
        const code = generateAccessCode();
        setAccessCode(code);
        // Automatically trigger access callback
        setTimeout(() => {
          onTrialComplete?.(code);
        }, 1500);
        setTimeout(() => {
          setGameState(s => ({ ...s, levelTransition: true, level: 'OMEGA.A', speed: LEVEL_CONFIG['OMEGA.A'].baseSpeed }));
          setTimeout(() => {
            setGameState(s => ({ ...s, levelTransition: false }));
          }, 1500);
        }, 0);
      }

      return { ...prev, speed: newSpeed, score: newScore };
    });

    // Spawn obstacles
    const config = LEVEL_CONFIG[gameState.level];
    if (timestamp - lastSpawnRef.current > config.spawnInterval / gameState.speed) {
      spawnObstacle(gameState.level);
      lastSpawnRef.current = timestamp;
    }

    // Update obstacles
    setObstacles(prev => prev
      .map(obs => ({ ...obs, z: obs.z + gameState.speed * 2 }))
      .filter(obs => obs.z < 120)
    );

    // Check collisions
    setPlayer(currentPlayer => {
      setObstacles(currentObstacles => {
        for (const obstacle of currentObstacles) {
          if (checkCollision(currentPlayer, obstacle)) {
            setGameState(prev => {
              const newHighScore = Math.max(prev.score, prev.highScore);
              return { ...prev, status: 'gameOver', highScore: newHighScore, isColliding: true };
            });
            break;
          }
        }
        return currentObstacles;
      });
      return currentPlayer;
    });

    if (gameState.status === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameState.speed, gameState.status, gameState.level, spawnObstacle, checkCollision]);

  const startGame = useCallback((gender: Gender) => {
    hasTransitionedRef.current = false;
    setTrialCompleted(false);
    setPlayer({ lane: 1, isDucking: false, gender, y: 0 });
    setObstacles([]);
    setGameState(prev => ({
      ...prev,
      status: 'playing',
      score: 0,
      speed: LEVEL_CONFIG['OMEGA'].baseSpeed,
      isColliding: false,
      level: 'OMEGA',
      levelTransition: false,
    }));
    lastSpawnRef.current = 0;
    obstacleIdRef.current = 0;
  }, []);

  const movePlayer = useCallback((direction: 'left' | 'right') => {
    if (gameState.status !== 'playing') return;
    setPlayer(prev => {
      const newLane = direction === 'left' ? Math.max(0, prev.lane - 1) : Math.min(2, prev.lane + 1);
      return { ...prev, lane: newLane as Lane };
    });
  }, [gameState.status]);

  const duck = useCallback(() => {
    if (gameState.status !== 'playing') return;
    if (duckTimeoutRef.current) clearTimeout(duckTimeoutRef.current);
    setPlayer(prev => ({ ...prev, isDucking: true }));
    duckTimeoutRef.current = setTimeout(() => {
      setPlayer(prev => ({ ...prev, isDucking: false }));
    }, DUCK_DURATION);
  }, [gameState.status]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.status !== 'playing') return;
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePlayer('right');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
        case ' ':
          duck();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, movePlayer, duck]);

  // Touch controls
  useEffect(() => {
    if (gameState.status !== 'playing') return;
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 30) movePlayer('right');
        else if (diffX < -30) movePlayer('left');
      } else {
        if (diffY > 30) duck();
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState.status, movePlayer, duck]);

  // Game loop
  useEffect(() => {
    if (gameState.status === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (duckTimeoutRef.current) clearTimeout(duckTimeoutRef.current);
    };
  }, [gameState.status, gameLoop]);

  const getLaneX = (lane: number) => ['15%', '50%', '85%'][lane];
  const playerEmoji = player.gender === 'male' ? '🏃‍♂️' : '🏃‍♀️';
  const isOmegaA = gameState.level === 'OMEGA.A';
  const speedIntensity = Math.min((gameState.speed - 0.8) / 2.2, 1);
  const isHighSpeed = gameState.speed > 1.5;

  const bgGradient = isOmegaA
    ? `linear-gradient(180deg, hsl(300 60% 6%) 0%, hsl(330 70% 12%) 40%, hsl(0 60% 10%) 100%)`
    : `linear-gradient(180deg, hsl(270 50% 8%) 0%, hsl(280 60% 15%) 40%, hsl(270 50% 12%) 100%)`;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {/* Loading Screen */}
      {gameState.status === 'loading' && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #8b008b 0%, #4b0082 50%, #008b8b 100%)' }}
        >
          <img 
            src={playbuoyLogo} 
            alt="PlayBuoy Logo" 
            className="w-80 max-w-[80vw] mb-8"
            style={{ 
              animation: 'logoFloat 2s ease-in-out infinite',
              filter: 'drop-shadow(0 0 30px rgba(0, 255, 255, 0.6))'
            }}
          />
          <div className="text-xl text-white/80 font-bold" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
            Loading PLAYBUOY…
          </div>
          <div className="mt-6 w-48 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full"
              style={{ animation: 'loadingBar 2.5s ease-out forwards' }}
            />
          </div>
        </div>
      )}

      {/* Menu */}
      {gameState.status === 'menu' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b008b 0%, #4b0082 50%, #008b8b 100%)' }}>
          <img 
            src={playbuoyLogo} 
            alt="PlayBuoy Logo" 
            className="w-72 max-w-[70vw] mb-4"
            style={{ filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))' }}
          />
          <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 px-4">Avoid Heartbreak, Stay Single!</p>
          <div className="flex gap-3 sm:gap-4 flex-wrap justify-center px-4">
            <button onClick={() => startGame('male')} className="px-6 sm:px-8 py-3 sm:py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl text-base sm:text-lg transition-all hover:scale-105">
              🏃‍♂️ ADAM'S SON
            </button>
            <button onClick={() => startGame('female')} className="px-6 sm:px-8 py-3 sm:py-4 bg-pink-500 hover:bg-pink-400 text-white font-bold rounded-xl text-base sm:text-lg transition-all hover:scale-105">
              🏃‍♀️ EVE'S DAUGHTER
            </button>
          </div>
          <div className="mt-6 sm:mt-8 text-white/60 px-4 text-sm sm:text-base">
            <p>Swipe ← → to move, ↓ to duck</p>
            <p className="mt-2">High Score: {gameState.highScore}</p>
          </div>
        </div>
      )}

      {/* Game */}
      {gameState.status === 'playing' && (
        <div 
          className="relative w-full h-full"
          style={{ 
            background: bgGradient,
          }}
        >
          {/* Level Transition */}
          {gameState.levelTransition && (
            <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center" style={{
              background: 'radial-gradient(circle, rgba(255,0,255,0.9) 0%, rgba(0,255,255,0.9) 100%)',
              animation: 'pulse 1s ease-in-out',
            }}>
              <img 
                src={omega7Pill} 
                alt="OMEGA7 Pill" 
                className="w-64 max-w-[60vw] mb-6"
                style={{ 
                  animation: 'pillFloat 1.5s ease-in-out infinite',
                  filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.8))'
                }}
              />
              <div className="text-center p-6 bg-black/50 rounded-2xl">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ textShadow: '0 0 30px rgba(255,255,255,0.8)' }}>
                  OMEGA7 ACQUIRED
                </h2>
                <p className="text-xl md:text-2xl text-white/90 mb-2">HEARTBREAK IMMUNITY ACTIVATED</p>
                <p className="text-2xl md:text-3xl text-yellow-300 mt-3">⚡ ENTERING OMEGA.A ⚡</p>
              </div>
            </div>
          )}

          {/* Background stars */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: isOmegaA ? 50 : 30 }).map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 23) % 60}%`,
                  width: `${2 + (i % 3)}px`,
                  height: `${2 + (i % 3)}px`,
                  background: isOmegaA ? (i % 2 === 0 ? '#ffd700' : '#ff1493') : (i % 2 === 0 ? '#ff1493' : '#00ffff'),
                  animation: `twinkle ${1 + (i % 3) * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0.4,
                }}
              />
            ))}
          </div>

          {/* Runway */}
          <div className="absolute inset-0" style={{ perspective: '400px' }}>
            <div 
              className="absolute left-0 right-0 bottom-0 h-[70%]"
              style={{
                transform: 'rotateX(65deg)',
                transformOrigin: 'bottom center',
                background: isOmegaA 
                  ? 'linear-gradient(180deg, hsl(300 50% 6% / 0.95) 0%, hsl(330 60% 10%) 100%)'
                  : 'linear-gradient(180deg, hsl(270 40% 8% / 0.9) 0%, hsl(280 50% 10%) 100%)',
              }}
            >
              {/* Lane dividers */}
              <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-cyan-400/40" style={{ boxShadow: '0 0 10px rgba(0,255,255,0.4)' }} />
              <div className="absolute right-1/3 top-0 bottom-0 w-0.5 bg-cyan-400/40" style={{ boxShadow: '0 0 10px rgba(0,255,255,0.4)' }} />
              
              {/* Perspective lines */}
              {Array.from({ length: 12 }).map((_, i) => {
                const progress = ((animationTick * gameState.speed * 0.5 + i * 8.33) % 100);
                return (
                  <div
                    key={`line-${i}`}
                    className="absolute left-0 right-0 h-0.5"
                    style={{
                      top: `${progress}%`,
                      background: `linear-gradient(90deg, transparent 0%, rgba(255,20,147,${0.1 + progress * 0.004}) 50%, transparent 100%)`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Speed streaks */}
          {isHighSpeed && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`streak-${i}`}
                  className="absolute w-0.5"
                  style={{
                    left: `${10 + (i * 15)}%`,
                    top: '-10%',
                    height: '30%',
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0,255,255,0.5) 50%, transparent 100%)',
                    animation: `streak 0.3s linear infinite`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Obstacles */}
          {obstacles.map((obstacle) => {
            const scale = 0.15 + (obstacle.z / 100) * 1.6;
            const opacity = Math.min(1, obstacle.z / 25);
            const y = 15 + (obstacle.z * 0.65);

            return (
              <div
                key={obstacle.id}
                className="absolute flex flex-col items-center"
                style={{
                  left: getLaneX(obstacle.lane),
                  top: `${y}%`,
                  transform: `translateX(-50%) scale(${scale})`,
                  opacity,
                  zIndex: Math.floor(obstacle.z) + 10,
                }}
              >
                <span className="text-5xl" style={{
                  filter: obstacle.z > 70 ? `drop-shadow(0 0 20px rgba(255,0,0,0.8))` : undefined,
                  animation: obstacle.type === 'standing' ? 'wobble 0.8s ease-in-out infinite' : 'float 2s ease-in-out infinite',
                }}>
                  {obstacle.emoji}
                </span>
                {obstacle.z > 45 && (
                  <span className="text-xs text-red-300 bg-black/60 px-2 py-0.5 rounded-full mt-1 whitespace-nowrap">
                    {obstacle.label}
                  </span>
                )}
              </div>
            );
          })}

          {/* Player */}
          <div
            className="absolute bottom-24 flex flex-col items-center z-40 transition-all duration-100"
            style={{
              left: getLaneX(player.lane),
              transform: `translateX(-50%) ${player.isDucking ? 'scaleY(0.4) translateY(30px)' : 'scaleY(1)'}`,
            }}
          >
            <div 
              className="text-6xl"
              style={{
                filter: `drop-shadow(0 0 ${20 + speedIntensity * 20}px ${player.gender === 'male' ? 'rgba(0,255,255,0.6)' : 'rgba(255,20,147,0.6)'})`,
                animation: !player.isDucking ? 'run 0.3s steps(4) infinite' : undefined,
              }}
            >
              {playerEmoji}
            </div>
            {player.isDucking && (
              <span className="text-sm text-white font-bold mt-1">DUCK!</span>
            )}
          </div>

          {/* HUD */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex justify-between items-start z-50 text-white">
            <div>
              <p className="text-xl sm:text-3xl font-bold" style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>{gameState.score}</p>
              <p className="text-xs opacity-80">Score</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-2xl font-bold" style={{ 
                color: isOmegaA ? '#ffd700' : '#00ffff',
                textShadow: `0 0 20px ${isOmegaA ? 'rgba(255,215,0,0.8)' : 'rgba(0,255,255,0.8)'}`,
              }}>
                {gameState.level}
              </p>
              <p className="text-xs opacity-80">Level</p>
            </div>
            <div className="text-right">
              <p className="text-base sm:text-xl font-bold" style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>x{gameState.speed.toFixed(1)}</p>
              <p className="text-xs opacity-80">Speed</p>
            </div>
          </div>
        </div>
      )}

      {/* Game Over */}
      {gameState.status === 'gameOver' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
          <h2 className="text-4xl sm:text-6xl font-bold text-red-500 mb-4" style={{ textShadow: '0 0 40px rgba(255,0,0,0.8)' }}>
            GAME OVER
          </h2>
          <p className="text-2xl sm:text-3xl text-white mb-2">💔 Heartbroken!</p>
          <p className="text-xl sm:text-2xl text-white/80 mb-6 sm:mb-8">Score: {gameState.score}</p>
          <p className="text-lg sm:text-xl text-white/60 mb-6 sm:mb-8">High Score: {gameState.highScore}</p>
          <button 
            onClick={() => setGameState(prev => ({ ...prev, status: 'menu', isColliding: false }))}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-xl text-lg transition-all hover:scale-105"
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      {/* Access notification - appears briefly when 7000 points reached */}
      {trialCompleted && gameState.status !== 'gameOver' && !accessButtonClicked && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] pointer-events-none">
          <div 
            className="px-8 py-4 font-bold text-lg rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #00ffff 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease infinite, fadeOut 1.5s ease forwards',
              boxShadow: '0 0 30px rgba(0,255,255,0.6), 0 0 60px rgba(255,0,255,0.4)',
              color: 'white',
              textShadow: '0 0 10px rgba(0,0,0,0.5)',
            }}
          >
            ⚡ ACCESS GRANTED ⚡
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }
        @keyframes run {
          0% { transform: translateY(0) scaleX(1); }
          25% { transform: translateY(-3px) scaleX(0.95); }
          50% { transform: translateY(0) scaleX(1); }
          75% { transform: translateY(-3px) scaleX(1.05); }
        }
        @keyframes wobble {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes streak {
          0% { opacity: 0.8; transform: translateY(-100%); }
          100% { opacity: 0; transform: translateY(200%); }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.02); }
        }
        @keyframes loadingBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes pillFloat {
          0%, 100% { transform: translateY(0) rotate(-5deg) scale(1); }
          50% { transform: translateY(-20px) rotate(5deg) scale(1.05); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeOut {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

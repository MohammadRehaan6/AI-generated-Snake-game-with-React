/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#0ff] font-sans crt relative flex flex-col uppercase tracking-widest">
      <div className="static-noise"></div>
      
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b-4 border-[#f0f] bg-black z-10">
        <div className="flex items-center gap-4">
          <Terminal className="w-8 h-8 text-[#f0f] animate-pulse" />
          <h1 
            className="text-2xl md:text-4xl font-digital text-[#0ff] glitch-heavy"
            data-text="SYS.SNAKE_PROTOCOL"
          >
            SYS.SNAKE_PROTOCOL
          </h1>
        </div>
        <div className="flex items-center gap-4 border-2 border-[#0ff] p-2 bg-[#f0f] text-black">
          <div className="text-sm md:text-xl font-bold">DATA_YIELD:</div>
          <div 
            className="text-2xl md:text-4xl font-digital glitch-heavy"
            data-text={score.toString().padStart(4, '0')}
          >
            {score.toString().padStart(4, '0')}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10 tear">
        <div className="flex flex-col items-center gap-6">
          <SnakeGame onScoreChange={setScore} />
          <div className="text-[#f0f] text-xl md:text-2xl flex gap-8 font-mono bg-black border-2 border-[#0ff] p-2 shadow-[4px_4px_0_#f0f]">
            <span>[INPUT: W/A/S/D]</span>
            <span>[HALT: SPACE]</span>
          </div>
        </div>
      </main>

      {/* Footer / Music Player */}
      <footer className="border-t-4 border-[#0ff] bg-black z-10 p-4">
        <MusicPlayer />
      </footer>
    </div>
  );
}

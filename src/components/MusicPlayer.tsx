import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc3 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Drift (AI Gen)', artist: 'CyberMind', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Digital Horizon (AI Gen)', artist: 'NeuralNet', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Synthwave Core (AI Gen)', artist: 'AutoBeat', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex items-center justify-between gap-6 font-mono uppercase">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />

      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/3 border-2 border-[#f0f] p-2 bg-black shadow-[4px_4px_0_#0ff]">
        <div className="overflow-hidden">
          <h3 className="text-[#0ff] font-digital text-lg md:text-xl truncate glitch-heavy" data-text={currentTrack.title}>{currentTrack.title}</h3>
          <p className="text-[#f0f] text-sm truncate">ID: {currentTrack.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center gap-6">
          <button onClick={handlePrev} className="text-[#0ff] hover:text-[#f0f] cursor-pointer border-2 border-[#0ff] p-1 bg-black">
            <SkipBack className="w-6 h-6" />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-[#f0f] text-black hover:bg-[#0ff] cursor-pointer border-2 border-[#0ff] shadow-[2px_2px_0_#0ff]"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>
          <button onClick={handleNext} className="text-[#0ff] hover:text-[#f0f] cursor-pointer border-2 border-[#0ff] p-1 bg-black">
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
        {/* Progress Bar */}
        <div
          className="w-full h-4 bg-black border-2 border-[#f0f] cursor-pointer relative"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-[#0ff] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 w-1/3 justify-end border-2 border-[#0ff] p-2 bg-black shadow-[4px_4px_0_#f0f]">
        <button onClick={() => setIsMuted(!isMuted)} className="text-[#f0f] hover:text-[#0ff] cursor-pointer">
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          className="w-24 h-2 bg-black border border-[#f0f] appearance-none cursor-pointer accent-[#0ff]"
        />
      </div>
    </div>
  );
}

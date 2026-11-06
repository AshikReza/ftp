'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ExternalLink,
  Copy,
  Download,
  Check,
  AlertCircle,
  SkipForward,
  SkipBack,
  Settings,
  Tv,
  Film,
  RefreshCw,
  Sliders,
  PictureInPicture2
} from 'lucide-react';
import { Content, SeasonData, EpisodeData } from '@/lib/types/content';
import { formatDuration } from '@/lib/utils';

interface MediaPlayerProps {
  content: Content;
  initialSeasonNumber?: number;
  initialEpisodeNumber?: number;
}

export function MediaPlayer({
  content,
  initialSeasonNumber = 1,
  initialEpisodeNumber = 1
}: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Series state
  const isSeries = content.type === 'series' && !!content.seriesMetadata;
  const seasons = content.seriesMetadata?.seasons || [];
  const [selectedSeasonNum, setSelectedSeasonNum] = useState<number>(initialSeasonNumber);

  // Current active season's episodes
  const currentSeason = seasons.find(s => s.seasonNumber === selectedSeasonNum) || seasons[0];
  const episodes = currentSeason?.episodes || [];

  const [currentEpisode, setCurrentEpisode] = useState<EpisodeData | null>(
    episodes.find(e => e.episodeNumber === initialEpisodeNumber) || episodes[0] || null
  );

  // Video playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Active stream URL from CircleFTP
  const rawStreamUrl = isSeries
    ? currentEpisode?.streamUrl || ''
    : content.mediaFiles[0]?.url || content.movieMetadata?.streamUrl || '';

  // Determine playback URL (direct or via range-proxy)
  const activeStreamUrl = useProxy && rawStreamUrl
    ? `/api/stream?url=${encodeURIComponent(rawStreamUrl)}`
    : rawStreamUrl;

  // Update current episode if season changes
  useEffect(() => {
    if (isSeries && currentSeason) {
      if (currentSeason.episodes.length > 0) {
        setCurrentEpisode(currentSeason.episodes[0]);
      }
    }
  }, [selectedSeasonNum, isSeries, currentSeason]);

  // Track progress periodically
  useEffect(() => {
    if (!currentTime || !duration) return;
    const saveTimer = setTimeout(() => {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: content.id,
          episodeId: currentEpisode?.id,
          currentTimeSeconds: Math.floor(currentTime),
          durationSeconds: Math.floor(duration),
          completed: currentTime / duration > 0.92
        })
      }).catch(() => {});
    }, 4000);
    return () => clearTimeout(saveTimer);
  }, [currentTime, duration, content.id, currentEpisode?.id]);

  // Handle controls visibility auto-hide on inactivity
  const showControlsTemporarily = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setControlsVisible(false);
    }, 3500);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(e => {
        console.warn('Playback error, switching to proxy fallback:', e);
        if (!useProxy && rawStreamUrl) {
          setUseProxy(true);
        } else {
          setHasError(true);
        }
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const skipSeconds = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.warn('PiP not supported or disabled', e);
    }
  };

  const changeSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const copyStreamUrl = () => {
    if (!rawStreamUrl) return;
    navigator.clipboard.writeText(rawStreamUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInExternalPlayer = (protocol: 'vlc' | 'potplayer' | 'kmplayer' | 'mpv') => {
    if (!rawStreamUrl) return;
    window.location.href = `${protocol}://${rawStreamUrl}`;
  };

  const isMkv = rawStreamUrl.toLowerCase().endsWith('.mkv');

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Video Viewport Container */}
      <div
        ref={containerRef}
        onMouseMove={showControlsTemporarily}
        onMouseLeave={() => isPlaying && setControlsVisible(false)}
        className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl group select-none"
      >
        <video
          ref={videoRef}
          src={activeStreamUrl}
          onTimeUpdate={() => {
            if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration);
              setIsLoading(false);
              setHasError(false);
            }
          }}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => {
            setIsLoading(false);
            setIsPlaying(true);
            setHasError(false);
          }}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setIsLoading(false);
            if (!useProxy && rawStreamUrl) {
              setUseProxy(true);
            } else {
              setHasError(true);
            }
          }}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
          playsInline
        />

        {/* Loading Spinner */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
            <div className="w-12 h-12 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Codec notice or Incompatible file format banner */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#08090D]/95 px-6 text-center z-20">
            <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
            <h4 className="text-base sm:text-lg font-bold text-white mb-1">
              BDIX Source Stream Notice
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 max-w-lg mb-2 leading-relaxed">
              This BDIX video file is hosted on CircleFTP as{' '}
              <code className="text-amber-300 font-mono text-xs">{isMkv ? '.MKV' : 'Direct Stream'}</code> with multi-channel audio.
            </p>
            <p className="text-xs text-gray-400 max-w-md mb-5 leading-relaxed font-mono">
              Web browsers cannot decode native Matroska (.mkv) files directly. You can stream it instantly in VLC, PotPlayer, KMPlayer, or download directly.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => openInExternalPlayer('vlc')}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                Play in VLC
              </button>
              <button
                onClick={() => openInExternalPlayer('potplayer')}
                className="px-4 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                Play in PotPlayer
              </button>
              <button
                onClick={() => openInExternalPlayer('kmplayer')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                Play in KMPlayer
              </button>
              <button
                onClick={copyStreamUrl}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-2 border border-white/10"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Direct URL' : 'Copy Direct Stream URL'}
              </button>
              <a
                href={rawStreamUrl}
                download
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-2 border border-white/10"
              >
                <Download className="w-4 h-4" />
                Direct Download
              </a>
            </div>

            {/* Direct Source URL Display */}
            <div className="mt-4 pt-3 border-t border-white/10 max-w-md w-full">
              <span className="text-[10px] text-gray-500 font-mono block mb-1">Direct Source URL:</span>
              <p className="text-[11px] text-gray-400 font-mono truncate select-all bg-black/40 px-2 py-1 rounded border border-white/5">
                {rawStreamUrl}
              </p>
            </div>
          </div>
        )}

        {/* Video Player Controls Overlay */}
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 sm:p-5 transition-opacity duration-300 ${
            controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Progress Slider */}
          <div className="relative flex items-center group/slider mb-3">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Video Seek Bar"
              className="w-full h-1.5 rounded-lg appearance-none bg-white/20 accent-red-500 cursor-pointer focus:outline-none"
            />
          </div>

          {/* Control Buttons Bar */}
          <div className="flex items-center justify-between text-white text-xs">
            {/* Left controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="p-2 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={() => skipSeconds(-10)}
                aria-label="Rewind 10 seconds"
                className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => skipSeconds(10)}
                aria-label="Forward 10 seconds"
                className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 group/volume ml-2">
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume Slider"
                  className="w-16 h-1 rounded appearance-none bg-white/20 accent-red-500 cursor-pointer hidden sm:inline-block"
                />
              </div>

              {/* Timestamp */}
              <span className="font-mono text-[11px] text-gray-300 ml-2">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Playback speed */}
              <button
                onClick={changeSpeed}
                title="Playback Speed"
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 font-mono text-[11px] font-semibold text-gray-300 hover:text-white transition-colors"
              >
                {playbackSpeed}x
              </button>

              {/* Proxy fallback toggle */}
              <button
                onClick={() => setUseProxy(!useProxy)}
                title={useProxy ? 'Using Range Streaming Proxy' : 'Using Direct Mirror Stream'}
                className={`p-1.5 rounded-md text-[11px] font-mono transition-colors ${
                  useProxy ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Picture in Picture */}
              <button
                onClick={togglePiP}
                title="Picture in Picture"
                className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors hidden sm:block"
              >
                <PictureInPicture2 className="w-4 h-4" />
              </button>

              {/* External VLC trigger */}
              <button
                onClick={() => openInExternalPlayer('vlc')}
                title="Open in VLC Player"
                className="p-1.5 rounded-md hover:bg-white/10 text-orange-400 hover:text-orange-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                aria-label="Toggle Fullscreen"
                className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Permanent External Media Player Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0D0F17] border border-white/8 shadow-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-300 font-mono flex items-center gap-1.5 mr-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PLAY IN APP:</span>
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => openInExternalPlayer('vlc')}
              className="px-3 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600 text-orange-300 hover:text-white border border-orange-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Launch in VLC Media Player"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>VLC</span>
            </button>
            <button
              onClick={() => openInExternalPlayer('potplayer')}
              className="px-3 py-1.5 rounded-lg bg-yellow-600/20 hover:bg-yellow-600 text-yellow-300 hover:text-white border border-yellow-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Launch in PotPlayer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>PotPlayer</span>
            </button>
            <button
              onClick={() => openInExternalPlayer('kmplayer')}
              className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Launch in KMPlayer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>KMPlayer</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyStreamUrl}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Copy Direct BDIX Stream URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied URL' : 'Copy URL'}</span>
          </button>
          {rawStreamUrl && (
            <a
              href={rawStreamUrl}
              download
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/20 transition-all"
              title="Direct high-speed BDIX download"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </a>
          )}
        </div>
      </div>

      {/* Series Season and Episode Selector */}
      {isSeries && seasons.length > 0 && (
        <div className="flex flex-col gap-4 bg-[#0D0F17] border border-white/8 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">Episodes &amp; Seasons</h3>
              <span className="text-xs text-gray-400 font-mono">
                ({currentSeason?.episodes.length || 0} episodes in Season {selectedSeasonNum})
              </span>
            </div>

            {/* Season switcher tabs */}
            {seasons.length > 1 && (
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {seasons.map(s => (
                  <button
                    key={s.seasonNumber}
                    onClick={() => setSelectedSeasonNum(s.seasonNumber)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedSeasonNum === s.seasonNumber
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Season {s.seasonNumber}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Episode List Rail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {episodes.map(ep => {
              const isActive = currentEpisode?.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => {
                    setCurrentEpisode(ep);
                    setIsPlaying(true);
                  }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-left border transition-all ${
                    isActive
                      ? 'bg-blue-600/20 border-blue-500/50 text-white'
                      : 'bg-white/5 border-transparent hover:border-white/10 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-black/40 text-gray-400'
                    }`}
                  >
                    {isActive ? <Play className="w-3.5 h-3.5 fill-white" /> : ep.episodeNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold truncate">
                      {ep.title}
                    </h5>
                    <span className="text-[10px] text-gray-500 font-mono">
                      BDIX Stream • S{ep.seasonNumber}E{ep.episodeNumber}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

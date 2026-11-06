import { LiveChannel } from '@/lib/types/content';

export const INITIAL_LIVE_CHANNELS: LiveChannel[] = [
  {
    id: 'ch_tsports',
    name: 'T Sports HD',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=200&auto=format&fit=crop',
    category: 'Sports',
    streamUrl: 'https://live-tsports.bdixcdn.com/hls/stream.m3u8',
    quality: '1080p 50FPS',
    isBDIX: true,
    status: 'online'
  },
  {
    id: 'ch_gazi',
    name: 'GTV (Gazi Television)',
    logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=200&auto=format&fit=crop',
    category: 'Sports',
    streamUrl: 'https://live-gtv.bdixcdn.com/hls/live.m3u8',
    quality: '1080p',
    isBDIX: true,
    status: 'online'
  },
  {
    id: 'ch_somoy',
    name: 'Somoy News',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=200&auto=format&fit=crop',
    category: 'News',
    streamUrl: 'https://live-somoy.bdixcdn.com/hls/live.m3u8',
    quality: '1080p',
    isBDIX: true,
    status: 'online'
  },
  {
    id: 'ch_channel_i',
    name: 'Channel i HD',
    logo: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=200&auto=format&fit=crop',
    category: 'Entertainment',
    streamUrl: 'https://live-channel-i.bdixcdn.com/hls/live.m3u8',
    quality: '1080p',
    isBDIX: true,
    status: 'online'
  },
  {
    id: 'ch_discovery',
    name: 'Discovery HD',
    logo: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=200&auto=format&fit=crop',
    category: 'Infotainment',
    streamUrl: 'https://live-discovery.bdixcdn.com/hls/live.m3u8',
    quality: '1080p',
    isBDIX: true,
    status: 'online'
  },
  {
    id: 'ch_natgeo',
    name: 'National Geographic Wild',
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=200&auto=format&fit=crop',
    category: 'Infotainment',
    streamUrl: 'https://live-natgeo.bdixcdn.com/hls/live.m3u8',
    quality: '1080p',
    isBDIX: true,
    status: 'online'
  }
];


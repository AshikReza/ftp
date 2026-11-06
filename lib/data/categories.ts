import {
  Film,
  Tv,
  Gamepad2,
  Laptop,
  BookOpen,
  Sparkles,
  Clapperboard,
  Compass,
  FileText,
  Flame,
  Radio,
  BookMarked,
  ShieldAlert,
  Smartphone,
  LucideIcon
} from 'lucide-react';

export interface CategoryDefinition {
  id: number;
  name: string;
  slug: string;
  group: 'cinema' | 'series' | 'tech' | 'learning' | 'special';
  icon: LucideIcon;
  description: string;
  accent: string;
}

export const CIRCLE_CATEGORIES: CategoryDefinition[] = [
  // Cinema
  {
    id: 6,
    name: 'English Movies',
    slug: 'english-movies',
    group: 'cinema',
    icon: Film,
    description: 'Hollywood blockbusters, classics, and high-bitrate 1080p releases',
    accent: '#F0142F',
  },
  {
    id: 2,
    name: 'Hindi Movies',
    slug: 'hindi-movies',
    group: 'cinema',
    icon: Clapperboard,
    description: 'Bollywood features, remastered golden era, and new releases',
    accent: '#F5C518',
  },
  {
    id: 3,
    name: 'South Indian Dubbed Movie',
    slug: 'south-indian-dubbed',
    group: 'cinema',
    icon: Film,
    description: 'Tamil, Telugu, Kannada blockbusters dubbed in Hindi',
    accent: '#FF7A00',
  },
  {
    id: 4,
    name: 'South Indian Movies',
    slug: 'south-indian-movies',
    group: 'cinema',
    icon: Clapperboard,
    description: 'Original Tamil, Telugu, and Malayalam cinematic productions',
    accent: '#E65100',
  },
  {
    id: 1,
    name: 'Animation Movies',
    slug: 'animation-movies',
    group: 'cinema',
    icon: Sparkles,
    description: 'Disney, Pixar, DreamWorks, and international animated features',
    accent: '#00D2FF',
  },
  {
    id: 20,
    name: 'Animation Dubbed Movies',
    slug: 'animation-dubbed',
    group: 'cinema',
    icon: Sparkles,
    description: 'Animated feature films with dual-audio and regional dubbed tracks',
    accent: '#38EF7D',
  },
  {
    id: 8,
    name: 'Foreign Language Movies',
    slug: 'foreign-movies',
    group: 'cinema',
    icon: Compass,
    description: 'Critically acclaimed world cinema, European, Korean, and Japanese films',
    accent: '#9B51E0',
  },
  {
    id: 7,
    name: 'English & Foreign Hindi Dubbed Movies',
    slug: 'foreign-hindi-dubbed',
    group: 'cinema',
    icon: Film,
    description: 'Hollywood and international movies with high-quality Hindi dubbing',
    accent: '#FF5252',
  },

  // TV & Web Series
  {
    id: 9,
    name: 'English & Foreign TV Series',
    slug: 'english-tv-series',
    group: 'series',
    icon: Tv,
    description: 'Complete seasons of prestige television, HBO, Netflix, and Amazon series',
    accent: '#2F80ED',
  },
  {
    id: 22,
    name: 'Dubbed TV Series & Shows',
    slug: 'dubbed-tv-series',
    group: 'series',
    icon: Tv,
    description: 'International multi-season series dubbed in Hindi and regional languages',
    accent: '#56CCF2',
  },
  {
    id: 21,
    name: 'English & Foreign Anime Series',
    slug: 'anime-series',
    group: 'series',
    icon: Sparkles,
    description: 'Japanese anime series, subbed & dubbed, shonen, seinen, and OVA releases',
    accent: '#BB6BD9',
  },
  {
    id: 5,
    name: 'Hindi TV Serials',
    slug: 'hindi-tv-serials',
    group: 'series',
    icon: Tv,
    description: 'Popular Indian television dramas, daily soaps, and episodic series',
    accent: '#F2994A',
  },
  {
    id: 238,
    name: 'Indian TV Show',
    slug: 'indian-tv-shows',
    group: 'series',
    icon: Tv,
    description: 'Reality shows, comedy specials, talk shows, and weekend entertainment',
    accent: '#6FCF97',
  },
  {
    id: 251,
    name: 'English & Hindi Awards Shows',
    slug: 'award-shows',
    group: 'series',
    icon: Flame,
    description: 'Oscars, Filmfare, Emmy, IIFA, and international award ceremonies',
    accent: '#F2C94C',
  },

  // Gaming & Tech
  {
    id: 13,
    name: 'PC & Console Games',
    slug: 'pc-games',
    group: 'tech',
    icon: Gamepad2,
    description: 'AAA titles, repacks, emulators, and full PC game ISO backups',
    accent: '#00F2FE',
  },
  {
    id: 11,
    name: 'Software',
    slug: 'software',
    group: 'tech',
    icon: Laptop,
    description: 'Productivity suites, operating systems, developer tooling, and utilities',
    accent: '#10B981',
  },
  {
    id: 14,
    name: 'Mobile Apps & Games',
    slug: 'mobile-apps',
    group: 'tech',
    icon: Smartphone,
    description: 'Android APKs, modified utilities, games, and tools',
    accent: '#14B8A6',
  },

  // Learning & Special
  {
    id: 12,
    name: 'Tutorial & Courses',
    slug: 'courses',
    group: 'learning',
    icon: BookOpen,
    description: 'Programming, cloud, graphics, cybersecurity, and enterprise video bootcamps',
    accent: '#7957F5',
  },
  {
    id: 85,
    name: 'Documentary',
    slug: 'documentary',
    group: 'learning',
    icon: FileText,
    description: 'BBC, National Geographic, nature, science, and historical investigations',
    accent: '#EAB308',
  },
  {
    id: 36,
    name: 'Comic & Magazine Books',
    slug: 'comics-books',
    group: 'special',
    icon: BookMarked,
    description: 'Marvel, DC, graphic novels, manga scans, and PDF magazines',
    accent: '#EC4899',
  },
  {
    id: 10,
    name: 'Islamic',
    slug: 'islamic',
    group: 'special',
    icon: BookOpen,
    description: 'Lectures, Quran recitations, documentaries, and historical accounts',
    accent: '#16B96A',
  },
  {
    id: 15,
    name: 'WWE',
    slug: 'wwe',
    group: 'special',
    icon: Flame,
    description: 'Raw, SmackDown, WrestleMania, Royal Rumble, and PLE premium events',
    accent: '#EF4444',
  },
  {
    id: 80,
    name: 'Featured Post',
    slug: 'featured-post',
    group: 'special',
    icon: Flame,
    description: 'Editorial picks and spotlight releases',
    accent: '#F59E0B',
  },
  {
    id: 250,
    name: 'others',
    slug: 'others',
    group: 'special',
    icon: Compass,
    description: 'Uncategorized resources and legacy archive drops',
    accent: '#64748B',
  },
];

export interface DirectFtpMirror {
  label: string;
  categoryName: string;
  url: string;
  server: string;
  description: string;
}

export const DIRECT_FTP_MIRRORS: DirectFtpMirror[] = [
  // Movies
  {
    label: 'Animation Movies',
    categoryName: 'Movies',
    url: 'http://ftp5.circleftp.net/FILE/Animation%20Movies/',
    server: 'FTP 5',
    description: 'High-speed BDIX storage for Disney & Pixar animated releases',
  },
  {
    label: 'Animation Dubbed Movies',
    categoryName: 'Movies',
    url: 'http://ftp5.circleftp.net/FILE/Animation%20Dubbed%20Movies/',
    server: 'FTP 5',
    description: 'Dual audio animated releases on FTP 5 mirror',
  },
  {
    label: 'English Movies 1 (1995-2015)',
    categoryName: 'Movies',
    url: 'http://index.circleftp.net/FILE/English%20Movies/',
    server: 'Index 1',
    description: 'Hollywood classic films (1995-2015)',
  },
  {
    label: 'English Movies 2 (2016-2026)',
    categoryName: 'Movies',
    url: 'http://index2.circleftp.net/FILE/English%20Movies/',
    server: 'Index 2',
    description: 'Recent Hollywood films (2016-2026)',
  },
  {
    label: 'Foreign Language Movies',
    categoryName: 'Movies',
    url: 'http://ftp5.circleftp.net/FILE/Foreign%20Language%20Movies/',
    server: 'FTP 5',
    description: 'International cinema from Europe & Asia',
  },
  {
    label: 'Hindi Movies',
    categoryName: 'Movies',
    url: 'http://index1.circleftp.net/FILE/Hindi%20Movies/',
    server: 'Index 1',
    description: 'Bollywood cinema archive',
  },
  {
    label: 'Tamil Telugu & Others (2024-)',
    categoryName: 'Movies',
    url: 'http://ftp13.circleftp.net/FILE/Tamil%20Telugu%20%26%20Others/',
    server: 'FTP 13',
    description: 'Recent South Indian regional movies',
  },
  {
    label: 'Tamil Telugu Hindi Dubbed (2024-)',
    categoryName: 'Movies',
    url: 'http://ftp13.circleftp.net/FILE/Tamil%20Telugu%20%26%20Others%20Hindi%20Dubbed/',
    server: 'FTP 13',
    description: 'South Indian films dubbed in Hindi',
  },

  // TV Series
  {
    label: 'English & Foreign TV Series (FTP 9)',
    categoryName: 'TV Series',
    url: 'http://ftp9.circleftp.net/FILE/English%20%26%20Foreign%20TV%20Series/',
    server: 'FTP 9',
    description: 'Primary TV series mirror on high-speed BDIX line',
  },
  {
    label: 'Anime TV Series',
    categoryName: 'TV Series',
    url: 'http://ftp15.circleftp.net/FILE/English%20%26%20Foreign%20Anime%20Series/',
    server: 'FTP 15',
    description: 'Full season anime repository',
  },
  {
    label: 'Dubbed TV Series & Shows',
    categoryName: 'TV Series',
    url: 'http://ftp16.circleftp.net/FILE/Dubbed%20TV%20Series%20%26%20Shows/',
    server: 'FTP 16',
    description: 'Hindi dubbed international shows',
  },

  // Gaming
  {
    label: 'PC Games Mirror 1',
    categoryName: 'Games',
    url: 'http://ftp2.circleftp.net/FILE/GAMES%20-%20PC/',
    server: 'FTP 2',
    description: 'PC game installations and ISO images',
  },
  {
    label: 'PC Games Mirror 2',
    categoryName: 'Games',
    url: 'http://ftp14.circleftp.net/FILE/GAMES%20-%20PC%202/',
    server: 'FTP 14',
    description: 'Recent AAA PC games library',
  },

  // Software & Courses
  {
    label: 'Software & Utilities',
    categoryName: 'Software',
    url: 'http://ftp3.circleftp.net/FILE/Software/',
    server: 'FTP 3',
    description: 'Operating systems and desktop tools',
  },
  {
    label: 'Tutorials & Courses',
    categoryName: 'Courses',
    url: 'http://ftp3.circleftp.net/FILE/Tutorials%20%26%20Training/',
    server: 'FTP 3',
    description: 'Development, IT, and design video courses',
  },
  {
    label: 'Documentary Collection',
    categoryName: 'Documentaries',
    url: 'http://ftp5.circleftp.net/FILE/Documentary/',
    server: 'FTP 5',
    description: 'BBC & National Geographic documentary archive',
  },
];

export function getCategoryById(id: number | string): CategoryDefinition | undefined {
  const num = typeof id === 'string' ? parseInt(id.replace(/^cftp_/, ''), 10) : id;
  return CIRCLE_CATEGORIES.find(c => c.id === num);
}

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CIRCLE_CATEGORIES.find(c => c.slug === slug);
}


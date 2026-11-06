export interface DirectFtpItem {
  title: string;
  url: string;
  server?: string;
  badge?: string;
}

export interface DirectFtpCategory {
  id: string;
  name: string;
  hasChildren: boolean;
  directUrl?: string;
  items?: DirectFtpItem[];
}

export const DIRECT_FTP_DATA: DirectFtpCategory[] = [
  {
    id: 'movies',
    name: 'Movies',
    hasChildren: true,
    items: [
      {
        title: 'Animation Movies',
        url: 'http://ftp5.circleftp.net/FILE/Animation%20Movies/',
        server: 'FTP 5'
      },
      {
        title: 'Animation Dubbed Movies',
        url: 'http://ftp5.circleftp.net/FILE/Animation%20Dubbed%20Movies/',
        server: 'FTP 5'
      },
      {
        title: 'English Movies 1 (1995-2015)',
        url: 'http://index.circleftp.net/FILE/English%20Movies/',
        server: 'Index 1'
      },
      {
        title: 'English Movies 2 (2016-2024)',
        url: 'http://index2.circleftp.net/FILE/English%20Movies/',
        server: 'Index 2'
      },
      {
        title: 'English & Foreign Dubbed 1 (1995-2015)',
        url: 'http://index.circleftp.net/FILE/English%20%26%20Foreign%20Dubbed%20Movies/',
        server: 'Index 1'
      },
      {
        title: 'English & Foreign Dubbed 2 (2016-2024)',
        url: 'http://index2.circleftp.net/FILE/English%20%26%20Foreign%20Dubbed%20Movies/',
        server: 'Index 2'
      },
      {
        title: 'Foreign Language Movies',
        url: 'http://ftp5.circleftp.net/FILE/Foreign%20Language%20Movies/',
        server: 'FTP 5'
      },
      {
        title: 'Hindi Movies Archive',
        url: 'http://index1.circleftp.net/FILE/Hindi%20Movies/',
        server: 'Index 1'
      },
      {
        title: 'Tamil & Telugu 1 (2000-2023)',
        url: 'http://ftp17.circleftp.net/FILE/Tamil%20Telugu%20%26%20Others/',
        server: 'FTP 17'
      },
      {
        title: 'Tamil & Telugu 2 (2024-)',
        url: 'http://ftp13.circleftp.net/FILE/Tamil%20Telugu%20%26%20Others/',
        server: 'FTP 13'
      },
      {
        title: 'South Hindi Dubbed 1 (2000-2023)',
        url: 'http://ftp17.circleftp.net/FILE/Tamil%20Telugu%20%26%20Others%20Hindi%20Dubbed/',
        server: 'FTP 17'
      },
      {
        title: 'South Hindi Dubbed 2 (2024-)',
        url: 'http://ftp13.circleftp.net/FILE/Tamil%20Telugu%20%26%20Others%20Hindi%20Dubbed/',
        server: 'FTP 13'
      }
    ]
  },
  {
    id: 'tv-series',
    name: 'TV Series',
    hasChildren: true,
    items: [
      {
        title: 'English & Foreign TV Series FTP 4',
        url: 'http://ftp4.circleftp.net/FILE/English%20%26%20Foreign%20TV%20Series/',
        server: 'FTP 4'
      },
      {
        title: 'English & Foreign TV Series FTP 6',
        url: 'http://ftp6.circleftp.net/FILE/English%20%26%20Foreign%20TV%20Series/',
        server: 'FTP 6'
      },
      {
        title: 'English & Foreign TV Series FTP 9',
        url: 'http://ftp9.circleftp.net/FILE/English%20%26%20Foreign%20TV%20Series/',
        server: 'FTP 9'
      },
      {
        title: 'English & Foreign TV Series FTP 10',
        url: 'http://ftp10.circleftp.net/FILE/File/English%20%26%20Foreign%20TV%20Series/',
        server: 'FTP 10'
      },
      {
        title: 'English & Foreign TV Series FTP 12',
        url: 'http://ftp12.circleftp.net/FILE/English%20%26%20Foreign%20TV%20Series/',
        server: 'FTP 12'
      },
      {
        title: 'English & Foreign TV Series FTP 11',
        url: 'http://ftp11.circleftp.net/FILE/',
        server: 'FTP 11'
      },
      {
        title: 'English & Foreign TV Series FTP 7',
        url: 'http://ftp7.circleftp.net/FILE/English%20%26%20Foreign%20TV%20Series/',
        server: 'FTP 7'
      },
      {
        title: 'English & Foreign Anime Series 1',
        url: 'http://ftp15.circleftp.net/FILE/English%20%26%20Foreign%20Anime%20Series/',
        server: 'FTP 15'
      },
      {
        title: 'English & Foreign Anime Series 2',
        url: 'http://ftp17.circleftp.net/FILE/English%20%26%20Foreign%20Anime%20Series/',
        server: 'FTP 17'
      },
      {
        title: 'Hindi TV Series',
        url: 'http://ftp8.circleftp.net/FILE/Hindi%20TV%20Series/',
        server: 'FTP 8'
      },
      {
        title: 'Dubbed TV Series & Shows',
        url: 'http://ftp16.circleftp.net/FILE/Dubbed%20TV%20Series%20%26%20Shows/',
        server: 'FTP 16'
      }
    ]
  },
  {
    id: 'indian-tv',
    name: 'Indian TV Shows',
    hasChildren: false,
    directUrl: 'http://ftp8.circleftp.net/FILE/Indian%20TV%20Shows/'
  },
  {
    id: 'award-shows',
    name: 'Award Shows',
    hasChildren: true,
    items: [
      {
        title: 'English Awards Shows',
        url: 'http://ftp5.circleftp.net/FILE/English%20Awards%20Show/',
        server: 'FTP 5'
      },
      {
        title: 'Hindi Awards Shows',
        url: 'http://ftp8.circleftp.net/FILE/Hindi%20Awards%20Shows/',
        server: 'FTP 8'
      }
    ]
  },
  {
    id: 'mobile-apps',
    name: 'Mobile Apps & Games',
    hasChildren: false,
    directUrl: 'http://ftp3.circleftp.net/FILE/Android%20Apps%20%26%20Games/'
  },
  {
    id: 'software',
    name: 'Software',
    hasChildren: false,
    directUrl: 'http://ftp3.circleftp.net/FILE/Software/'
  },
  {
    id: 'games',
    name: 'Games',
    hasChildren: true,
    items: [
      {
        title: 'PC Games Mirror 1',
        url: 'http://ftp2.circleftp.net/FILE/GAMES%20-%20PC/',
        server: 'FTP 2'
      },
      {
        title: 'PC Games Mirror 2',
        url: 'http://ftp14.circleftp.net/FILE/GAMES%20-%20PC%202/',
        server: 'FTP 14'
      },
      {
        title: 'PC Games Mirror 3',
        url: 'http://ftp18.circleftp.net/FILE/GAMES%20-%20PC%203/',
        server: 'FTP 18'
      }
    ]
  },
  {
    id: 'pc-games-backup',
    name: 'PC Games Backup',
    hasChildren: false,
    directUrl: 'http://ftp14.circleftp.net/FILE/PC%20Game%20Backup/'
  },
  {
    id: 'console-games',
    name: 'Console Games',
    hasChildren: false,
    directUrl: 'http://ftp14.circleftp.net/FILE/Consoles%20Game/'
  },
  {
    id: 'wwe',
    name: 'WWE Wrestling',
    hasChildren: false,
    directUrl: 'http://ftp5.circleftp.net/FILE/WWE%20Wrestling/'
  },
  {
    id: 'tutorials',
    name: 'Tutorial & Courses',
    hasChildren: false,
    directUrl: 'http://ftp3.circleftp.net/FILE/Tutorials%20%26%20Training/'
  },
  {
    id: 'documentary',
    name: 'Documentary',
    hasChildren: false,
    directUrl: 'http://ftp5.circleftp.net/FILE/Documentary/'
  }
];


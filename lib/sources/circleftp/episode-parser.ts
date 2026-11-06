export interface ExtractedEpisodeInfo {
  seasonNumber: number;
  episodeNumber: number;
  cleanTitle: string;
}

export function parseEpisodeTitle(rawTitle: string, defaultSeason = 1): ExtractedEpisodeInfo {
  if (!rawTitle) {
    return { seasonNumber: defaultSeason, episodeNumber: 1, cleanTitle: 'Episode 1' };
  }

  // 1. Standard pattern: S01E02, s1e2, S1.E2
  const sPattern = /S(\d+)[._\s\-:]*E(?:pisode)?[._\s\-:]*(\d+)/i;
  const sMatch = rawTitle.match(sPattern);
  if (sMatch) {
    return {
      seasonNumber: parseInt(sMatch[1], 10),
      episodeNumber: parseInt(sMatch[2], 10),
      cleanTitle: `Episode ${parseInt(sMatch[2], 10)}`,
    };
  }

  // 2. Pattern: Season 1 Episode 2, Season 1 Ep 2
  const seasonEpPattern = /Season[._\s\-:]*(\d+)[._\s\-:]*(?:Episode|Ep)[._\s\-:]*(\d+)/i;
  const seasonEpMatch = rawTitle.match(seasonEpPattern);
  if (seasonEpMatch) {
    return {
      seasonNumber: parseInt(seasonEpMatch[1], 10),
      episodeNumber: parseInt(seasonEpMatch[2], 10),
      cleanTitle: `Episode ${parseInt(seasonEpMatch[2], 10)}`,
    };
  }

  // 3. Pattern: 1x02
  const xPattern = /(\d+)x(\d+)/i;
  const xMatch = rawTitle.match(xPattern);
  if (xMatch) {
    return {
      seasonNumber: parseInt(xMatch[1], 10),
      episodeNumber: parseInt(xMatch[2], 10),
      cleanTitle: `Episode ${parseInt(xMatch[2], 10)}`,
    };
  }

  // 4. Pattern: S1.Episode:2 or S:1E:2
  const colonPattern = /S:?(\d+)[:.]*(?:Episode:?|E:?)(\d+)/i;
  const colonMatch = rawTitle.match(colonPattern);
  if (colonMatch) {
    return {
      seasonNumber: parseInt(colonMatch[1], 10),
      episodeNumber: parseInt(colonMatch[2], 10),
      cleanTitle: `Episode ${parseInt(colonMatch[2], 10)}`,
    };
  }

  // 5. Pattern: Episode 2, Ep. 2, Ep 02, E02
  const epOnlyPattern = /(?:Episode|Ep)[._\s\-:]*(\d+)/i;
  const epOnlyMatch = rawTitle.match(epOnlyPattern);
  if (epOnlyMatch) {
    return {
      seasonNumber: defaultSeason,
      episodeNumber: parseInt(epOnlyMatch[1], 10),
      cleanTitle: `Episode ${parseInt(epOnlyMatch[1], 10)}`,
    };
  }

  // 6. Pattern: Part 2, Pt 2
  const partPattern = /Part[._\s\-:]*(\d+)/i;
  const partMatch = rawTitle.match(partPattern);
  if (partMatch) {
    return {
      seasonNumber: defaultSeason,
      episodeNumber: parseInt(partMatch[1], 10),
      cleanTitle: `Part ${parseInt(partMatch[1], 10)}`,
    };
  }

  return {
    seasonNumber: defaultSeason,
    episodeNumber: 1,
    cleanTitle: rawTitle.replace(/\.[a-zA-Z0-9]+$/, '').replace(/_/g, ' '),
  };
}


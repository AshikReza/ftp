import { Content, ContentCategoryType, MediaFile, SeasonData, EpisodeData } from '@/lib/types/content';
import { CirclePostDetail, CirclePostSummary } from './validators';
import { parseEpisodeTitle } from './episode-parser';

const BASE_IMAGE_URL = 'http://new.circleftp.net:5000/uploads';

export function mapCircleCategoryToNEXORA(catIds: number[]): { category: ContentCategoryType; primaryName: string } {
  // Category IDs mapping verified from CircleFTP source
  // 1: Animation Movies, 2: Hindi Movies, 3: South Indian Dubbed, 4: South Indian Movies
  // 5: Hindi TV Serials, 6: English Movies, 7: English & Foreign Hindi Dubbed, 8: Foreign Language Movies
  // 9: English & Foreign TV Series, 10: Islamic, 11: Software, 12: Tutorial & Courses
  // 13: PC & Console Games, 14: Mobile Apps & Games, 15: WWE, 20: Animation Dubbed Movies
  // 21: English & Foreign Anime Series, 22: Dubbed TV Series & Shows, 85: Documentary

  if (catIds.includes(21)) {
    return { category: 'anime', primaryName: 'Anime' };
  }
  if (catIds.includes(12)) {
    return { category: 'course', primaryName: 'Courses & Tutorials' };
  }
  if (catIds.includes(13)) {
    return { category: 'game', primaryName: 'PC & Console Games' };
  }
  if (catIds.includes(11)) {
    return { category: 'software', primaryName: 'Software & Tools' };
  }
  if (catIds.includes(14)) {
    return { category: 'app', primaryName: 'Mobile Apps' };
  }
  if (catIds.includes(85)) {
    return { category: 'documentary', primaryName: 'Documentary' };
  }
  if (catIds.some(id => [5, 9, 22, 238, 251].includes(id))) {
    return { category: 'series', primaryName: 'TV Series' };
  }
  if (catIds.some(id => [1, 2, 3, 4, 6, 7, 8, 20].includes(id))) {
    return { category: 'movie', primaryName: 'Movies' };
  }

  return { category: 'movie', primaryName: 'Entertainment' };
}

export function buildImageUrl(imgName?: string | null): string {
  if (!imgName) {
    return 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=600&auto=format&fit=crop';
  }
  if (imgName.startsWith('http')) return imgName;
  return `${BASE_IMAGE_URL}/${imgName}`;
}

function generateEditorialSynopsis(title: string, category: ContentCategoryType, primaryName: string, year?: string): string {
  switch (category) {
    case 'movie':
      return `Stream ${title} in master-quality high definition with multi-language audio and immersive surround sound. Available for instant streaming.`;
    case 'series':
      return `Watch all complete seasons and episodes of ${title} in pristine 1080p resolution with synchronized subtitles and original audio tracks.`;
    case 'anime':
      return `Immerse yourself in ${title} featuring high-bitrate video, authentic voice casts, and complete episode arcs.`;
    case 'game':
      return `Download and experience ${title} with pre-configured updates, high-speed mirrors, and verified complete repack archives.`;
    case 'course':
      return `Master in-demand skills with ${title}. Complete structured curriculum featuring hands-on project files and lecture resources.`;
    case 'software':
      return `Deploy ${title} with complete setup packages, productivity tools, and direct high-speed repository access.`;
    default:
      return `Discover ${title} with master-grade digital streaming and high-speed direct mirror downloads.`;
  }
}

export function normalizeCirclePost(post: CirclePostDetail | CirclePostSummary): Content {
  const catIds = (post.categories || []).map(c => c.id);
  const { category, primaryName } = mapCircleCategoryToNEXORA(catIds);

  const poster = buildImageUrl(post.image || post.imageSm);
  const backdrop = post.image ? buildImageUrl(post.image) : poster;

  const contentId = `cftp_${post.id}`;
  const cleanTitle = (post.name || post.title || 'Untitled').trim();
  const year = post.year ? String(post.year).trim() : undefined;

  const mediaFiles: MediaFile[] = [];
  const fullPost = post as CirclePostDetail;

  let seriesMetadata = undefined;
  let movieMetadata = undefined;
  let courseMetadata = undefined;
  let gameMetadata = undefined;
  let softwareMetadata = undefined;
  let appMetadata = undefined;
  let documentaryMetadata = undefined;

  // Handle single video
  if (post.type === 'singleVideo' && typeof fullPost.content === 'string') {
    const streamUrl = fullPost.content;
    mediaFiles.push({
      id: `${contentId}_file_1`,
      title: cleanTitle,
      url: streamUrl,
      isStreamable: true,
      format: streamUrl.split('.').pop() || 'mkv'
    });

    if (category === 'movie' || category === 'anime') {
      movieMetadata = {
        resolution: post.quality || '1080p',
        streamUrl,
        downloadUrl: streamUrl,
      };
    } else if (category === 'documentary') {
      documentaryMetadata = {
        subject: cleanTitle,
        streamUrl,
      };
    }
  }

  // Handle series
  if (post.type === 'series' && Array.isArray(fullPost.content)) {
    const seasonsMap = new Map<number, EpisodeData[]>();
    let totalEpCount = 0;

    fullPost.content.forEach((seasonBlock: any, sIdx: number) => {
      const seasonName = seasonBlock.seasonName || `Season ${sIdx + 1}`;
      const seasonMatch = seasonName.match(/\d+/);
      const seasonNum = seasonMatch ? parseInt(seasonMatch[0], 10) : sIdx + 1;

      if (!seasonsMap.has(seasonNum)) {
        seasonsMap.set(seasonNum, []);
      }

      if (Array.isArray(seasonBlock.episodes)) {
        seasonBlock.episodes.forEach((ep: any, eIdx: number) => {
          totalEpCount++;
          const parsed = parseEpisodeTitle(ep.title || '', seasonNum);
          const epData: EpisodeData = {
            id: `${contentId}_s${seasonNum}_e${parsed.episodeNumber || eIdx + 1}`,
            seasonNumber: seasonNum,
            episodeNumber: parsed.episodeNumber || eIdx + 1,
            title: parsed.cleanTitle || `Episode ${eIdx + 1}`,
            streamUrl: ep.link,
            downloadUrl: ep.link
          };
          seasonsMap.get(seasonNum)!.push(epData);

          mediaFiles.push({
            id: epData.id,
            title: epData.title,
            url: ep.link,
            isStreamable: true,
            season: seasonNum,
            episode: epData.episodeNumber,
            format: ep.link.split('.').pop() || 'mkv'
          });
        });
      }
    });

    const seasons: SeasonData[] = Array.from(seasonsMap.entries()).map(([sNum, episodes]) => ({
      seasonNumber: sNum,
      name: `Season ${sNum}`,
      episodes: episodes.sort((a, b) => a.episodeNumber - b.episodeNumber)
    })).sort((a, b) => a.seasonNumber - b.seasonNumber);

    seriesMetadata = {
      totalSeasons: seasons.length,
      totalEpisodes: totalEpCount,
      seasons
    };
  }

  // Handle singleFile (Courses, Software, Games, Apps)
  if (post.type === 'singleFile' && typeof fullPost.content === 'string') {
    const fileUrl = fullPost.content;
    mediaFiles.push({
      id: `${contentId}_file`,
      title: cleanTitle,
      url: fileUrl,
      isStreamable: false,
      format: fileUrl.split('.').pop() || 'file'
    });

    if (category === 'course') {
      courseMetadata = {
        provider: 'Udemy / Online Academy',
        level: 'All Levels' as const,
        downloadUrl: fileUrl,
      };
    } else if (category === 'software') {
      softwareMetadata = {
        os: 'Windows' as const,
        downloadUrl: fileUrl,
      };
    } else if (category === 'app') {
      appMetadata = {
        downloadUrl: fileUrl,
      };
    } else if (category === 'game') {
      gameMetadata = {
        platform: 'PC' as const,
        downloadLinks: [{ title: cleanTitle, url: fileUrl }]
      };
    }
  }

  // Handle multiFile
  if (post.type === 'multiFile' && Array.isArray(fullPost.content)) {
    const links = fullPost.content.map((item: any, idx: number) => ({
      title: item.title || `Part ${idx + 1}`,
      url: item.link || item.url
    }));

    links.forEach((l, idx) => {
      mediaFiles.push({
        id: `${contentId}_part_${idx + 1}`,
        title: l.title,
        url: l.url,
        isStreamable: false,
        format: l.url?.split('.').pop() || 'rar'
      });
    });

    if (category === 'game') {
      gameMetadata = {
        platform: 'PC' as const,
        downloadLinks: links
      };
    } else if (category === 'course') {
      courseMetadata = {
        curriculum: [{
          title: 'Full Resource Files',
          files: links.map(l => ({ title: l.title, link: l.url }))
        }]
      };
    }
  }

  return {
    id: contentId,
    sourceId: String(post.id),
    sourceType: 'circleftp',
    title: post.title || cleanTitle,
    name: cleanTitle,
    category,
    primaryCategoryName: primaryName,
    categoryIds: catIds,
    type: post.type as any,
    posterUrl: poster,
    backdropUrl: backdrop,
    overview: fullPost.metaData && !fullPost.metaData.includes('Indexed from BDIX')
      ? fullPost.metaData
      : generateEditorialSynopsis(cleanTitle, category, primaryName, year),
    year,
    quality: post.quality || (category === 'movie' || category === 'series' ? '1080p' : undefined),
    views: fullPost.view || 0,
    tags: fullPost.tags ? fullPost.tags.split(',').filter(Boolean) : [],
    featured: catIds.includes(80),
    trending: (fullPost.view || 0) > 200,
    createdAt: post.createdAt || new Date().toISOString(),
    updatedAt: post.updatedAt || new Date().toISOString(),
    mediaFiles,
    movieMetadata,
    seriesMetadata,
    courseMetadata,
    gameMetadata,
    softwareMetadata,
    appMetadata,
    documentaryMetadata
  };
}

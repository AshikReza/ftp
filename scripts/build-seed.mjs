import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://new.circleftp.net:5000/api';
const BASE_IMAGE_URL = 'http://new.circleftp.net:5000/uploads';

function mapCircleCategory(catIds) {
  if (catIds.includes(21)) return { category: 'anime', primaryName: 'Anime' };
  if (catIds.includes(12)) return { category: 'course', primaryName: 'Courses & Tutorials' };
  if (catIds.includes(13)) return { category: 'game', primaryName: 'PC & Console Games' };
  if (catIds.includes(11)) return { category: 'software', primaryName: 'Software & Tools' };
  if (catIds.includes(14)) return { category: 'app', primaryName: 'Mobile Apps' };
  if (catIds.includes(85)) return { category: 'documentary', primaryName: 'Documentary' };
  if (catIds.some(id => [5, 9, 22, 238, 251].includes(id))) return { category: 'series', primaryName: 'TV Series' };
  if (catIds.some(id => [1, 2, 3, 4, 6, 7, 8, 20].includes(id))) return { category: 'movie', primaryName: 'Movies' };
  return { category: 'movie', primaryName: 'Entertainment' };
}

function buildImageUrl(imgName) {
  if (!imgName) return 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=600&auto=format&fit=crop';
  if (imgName.startsWith('http')) return imgName;
  return `${BASE_IMAGE_URL}/${imgName}`;
}

function normalizePost(post) {
  const catIds = (post.categories || []).map(c => c.id || c);
  const { category, primaryName } = mapCircleCategory(catIds);

  const poster = buildImageUrl(post.image || post.imageSm);
  const backdrop = post.image ? buildImageUrl(post.image) : poster;

  const contentId = `cftp_${post.id}`;
  const cleanTitle = (post.name || post.title || 'Untitled').trim();
  const year = post.year ? String(post.year).trim() : undefined;

  let streamUrl = '';
  if (post.type === 'singleVideo' && typeof post.content === 'string') {
    streamUrl = post.content;
  }

  const mediaFiles = streamUrl ? [{
    id: `${contentId}_file_1`,
    title: cleanTitle,
    url: streamUrl,
    isStreamable: true,
    format: streamUrl.split('.').pop() || 'mkv'
  }] : [];

  return {
    id: contentId,
    sourceId: String(post.id),
    sourceType: 'circleftp',
    title: cleanTitle,
    name: cleanTitle,
    category,
    primaryCategoryName: primaryName,
    categoryIds: catIds,
    type: post.type || 'singleVideo',
    posterUrl: poster,
    backdropUrl: backdrop,
    overview: post.metaData || `${cleanTitle} - Indexed from BDIX high-speed entertainment library.`,
    year,
    quality: post.quality || '1080p Full HD',
    rating: 8.5,
    views: post.view || 1200,
    tags: [primaryName, post.quality || 'HD', year].filter(Boolean),
    featured: true,
    trending: true,
    createdAt: post.createdAt || new Date().toISOString(),
    updatedAt: post.updatedAt || new Date().toISOString(),
    mediaFiles
  };
}

async function run() {
  console.log('Ingesting live CircleFTP catalog...');
  const catalogMap = new Map();

  // 1. Home page posts
  try {
    const res = await fetch(`${BASE_URL}/home-page/getHomePagePosts`);
    const homeData = await res.json();
    
    const allHome = [
      ...(homeData.mostVisitedPosts || []),
      ...(homeData.latestPost || [])
    ];

    if (Array.isArray(homeData.categoryPosts)) {
      for (const group of homeData.categoryPosts) {
        if (group.posts && Array.isArray(group.posts)) {
          allHome.push(...group.posts);
        } else if (group.title || group.name) {
          allHome.push(group);
        }
      }
    }

    allHome.forEach(p => {
      if (p && p.id) {
        const norm = normalizePost(p);
        catalogMap.set(norm.id, norm);
      }
    });
    console.log(`Home page posts ingested: ${catalogMap.size}`);
  } catch (err) {
    console.error('Home page fetch error:', err.message);
  }

  // 2. Fetch across top categories
  const categoryIds = [6, 2, 9, 21, 13, 11, 4, 1, 8, 7, 3, 12];
  for (const catId of categoryIds) {
    try {
      const res = await fetch(`${BASE_URL}/posts?categoryExact=${catId}&page=1&limit=24&order=desc`);
      const data = await res.json();
      if (data && Array.isArray(data.posts)) {
        data.posts.forEach(p => {
          if (p && p.id) {
            const norm = normalizePost(p);
            catalogMap.set(norm.id, norm);
          }
        });
      }
      console.log(`Category ${catId} ingested. Total catalog items: ${catalogMap.size}`);
    } catch (err) {
      console.warn(`Category ${catId} failed:`, err.message);
    }
  }

  const items = Array.from(catalogMap.values());
  console.log(`Final catalog count: ${items.length} items`);

  // Save to lib/data/bundled-catalog.json (COMMITTED FOR VERCEL)
  const bundledPath = path.join(process.cwd(), 'lib', 'data', 'bundled-catalog.json');
  fs.writeFileSync(bundledPath, JSON.stringify(items, null, 2));
  console.log(`Saved bundled catalog to: ${bundledPath}`);

  // Also save to .data/catalog.json
  const dataDir = path.join(process.cwd(), '.data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'catalog.json'), JSON.stringify(items, null, 2));
  console.log(`Saved local catalog to: ${path.join(dataDir, 'catalog.json')}`);
}

run();


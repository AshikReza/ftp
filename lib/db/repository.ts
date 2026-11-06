import fs from 'fs';
import path from 'path';
import { Content, ScrapeJobRecord, ViewingProgress, WatchlistItem, LiveChannel } from '@/lib/types/content';
import { INITIAL_LIVE_CHANNELS } from '@/lib/data/live-channels';

const DATA_DIR = path.join(process.cwd(), '.data');
const CATALOG_FILE = path.join(DATA_DIR, 'catalog.json');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const USER_DATA_FILE = path.join(DATA_DIR, 'user_data.json');

interface UserDataStore {
  watchlist: WatchlistItem[];
  progress: ViewingProgress[];
  history: { contentId: string; watchedAt: string }[];
}

class NEXORARepository {
  private catalog: Map<string, Content> = new Map();
  private jobs: ScrapeJobRecord[] = [];
  private userData: UserDataStore = { watchlist: [], progress: [], history: [] };
  private initialized = false;

  private ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (e) {
        // In sandboxed/read-only environments
      }
    }
  }

  private loadFromDisk() {
    if (this.initialized) return;
    this.ensureDir();

    try {
      if (fs.existsSync(CATALOG_FILE)) {
        const raw = fs.readFileSync(CATALOG_FILE, 'utf8');
        const items: Content[] = JSON.parse(raw);
        items.forEach(item => this.catalog.set(item.id, item));
      }
    } catch (e) {
      console.warn('Failed to load catalog from disk:', e);
    }

    try {
      if (fs.existsSync(JOBS_FILE)) {
        const raw = fs.readFileSync(JOBS_FILE, 'utf8');
        this.jobs = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to load jobs from disk:', e);
    }

    try {
      if (fs.existsSync(USER_DATA_FILE)) {
        const raw = fs.readFileSync(USER_DATA_FILE, 'utf8');
        this.userData = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to load user data from disk:', e);
    }

    this.initialized = true;
  }

  private persistCatalog() {
    this.ensureDir();
    try {
      const items = Array.from(this.catalog.values());
      const tempFile = `${CATALOG_FILE}.${process.pid}.${Date.now()}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(items, null, 2));
      fs.renameSync(tempFile, CATALOG_FILE);
    } catch (e) {
      // ignore
    }
  }

  private persistJobs() {
    this.ensureDir();
    try {
      fs.writeFileSync(JOBS_FILE, JSON.stringify(this.jobs, null, 2));
    } catch (e) {
      // ignore
    }
  }

  private persistUserData() {
    this.ensureDir();
    try {
      fs.writeFileSync(USER_DATA_FILE, JSON.stringify(this.userData, null, 2));
    } catch (e) {
      // ignore
    }
  }

  upsertContent(content: Content): void {
    this.loadFromDisk();
    this.catalog.set(content.id, content);
    this.persistCatalog();
  }

  upsertManyContent(items: Content[]): void {
    this.loadFromDisk();
    items.forEach(c => this.catalog.set(c.id, c));
    this.persistCatalog();
  }

  getContentById(id: string): Content | undefined {
    this.loadFromDisk();
    return this.catalog.get(id);
  }

  getAllContent(): Content[] {
    this.loadFromDisk();
    return Array.from(this.catalog.values());
  }

  getContentByCategory(category: string, limit = 20, offset = 0): { items: Content[]; total: number } {
    this.loadFromDisk();
    const all = Array.from(this.catalog.values()).filter(c => c.category === category);
    return {
      items: all.slice(offset, offset + limit),
      total: all.length
    };
  }

  searchContent(query: string, limit = 20): Content[] {
    this.loadFromDisk();
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return Array.from(this.catalog.values())
      .filter(c => c.title.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || (c.tags || []).some(t => t.toLowerCase().includes(q)))
      .slice(0, limit);
  }

  // Watchlist methods
  getWatchlist(): WatchlistItem[] {
    this.loadFromDisk();
    return this.userData.watchlist;
  }

  addToWatchlist(content: Content): WatchlistItem {
    this.loadFromDisk();
    const existing = this.userData.watchlist.find(w => w.contentId === content.id);
    if (existing) return existing;

    const item: WatchlistItem = {
      id: `wl_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      contentId: content.id,
      content,
      addedAt: new Date().toISOString()
    };
    this.userData.watchlist.unshift(item);
    this.persistUserData();
    return item;
  }

  removeFromWatchlist(contentId: string): void {
    this.loadFromDisk();
    this.userData.watchlist = this.userData.watchlist.filter(w => w.contentId !== contentId);
    this.persistUserData();
  }

  // Progress methods
  getProgress(contentId: string): ViewingProgress | undefined {
    this.loadFromDisk();
    return this.userData.progress.find(p => p.contentId === contentId);
  }

  getAllProgress(): ViewingProgress[] {
    this.loadFromDisk();
    return this.userData.progress;
  }

  saveProgress(data: Omit<ViewingProgress, 'id' | 'lastWatchedAt'>): ViewingProgress {
    this.loadFromDisk();
    let existing = this.userData.progress.find(p => p.contentId === data.contentId && p.episodeId === data.episodeId);
    if (existing) {
      existing.currentTimeSeconds = data.currentTimeSeconds;
      existing.durationSeconds = data.durationSeconds;
      existing.completed = data.completed;
      existing.lastWatchedAt = new Date().toISOString();
    } else {
      existing = {
        id: `prog_${Date.now()}`,
        ...data,
        lastWatchedAt: new Date().toISOString()
      };
      this.userData.progress.unshift(existing);
    }
    this.persistUserData();
    return existing;
  }

  // Jobs
  getJobs(): ScrapeJobRecord[] {
    this.loadFromDisk();
    return this.jobs;
  }

  createJob(type: ScrapeJobRecord['type'], source = 'circleftp'): ScrapeJobRecord {
    this.loadFromDisk();
    const job: ScrapeJobRecord = {
      id: `job_${Date.now()}`,
      source,
      type,
      status: 'running',
      startedAt: new Date().toISOString(),
      itemsProcessed: 0,
      itemsAdded: 0,
      itemsUpdated: 0
    };
    this.jobs.unshift(job);
    this.persistJobs();
    return job;
  }

  updateJob(id: string, updates: Partial<ScrapeJobRecord>): void {
    this.loadFromDisk();
    const job = this.jobs.find(j => j.id === id);
    if (job) {
      Object.assign(job, updates);
      this.persistJobs();
    }
  }

  getLiveChannels(): LiveChannel[] {
    return INITIAL_LIVE_CHANNELS;
  }
}

export const dbRepository = new NEXORARepository();

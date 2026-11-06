import { circleClient } from './client';

export interface FTPIndexLink {
  name: string;
  link: string;
  children?: {
    name: string;
    link: string;
  }[];
}

export async function fetchFTPDirectoryTree(): Promise<FTPIndexLink[]> {
  try {
    const data = await circleClient.getIndexLinks();
    if (data && Array.isArray(data.indexLinks)) {
      return data.indexLinks;
    }
    return [];
  } catch (err) {
    console.warn('FTP directory links query failed:', err);
    return [];
  }
}


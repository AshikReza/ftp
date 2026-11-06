import { NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db/repository';

export async function GET() {
  const jobs = dbRepository.getJobs();
  const catalogCount = dbRepository.getAllContent().length;

  return NextResponse.json({
    jobs,
    stats: {
      totalIndexed: catalogCount,
      healthySources: 1,
      totalSources: 1,
      lastSync: jobs[0]?.finishedAt || jobs[0]?.startedAt || 'Never'
    }
  });
}


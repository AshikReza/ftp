import { NextRequest, NextResponse } from 'next/server';
import { fetchHomePageCatalog } from '@/lib/sources/circleftp/catalog-parser';
import { dbRepository } from '@/lib/db/repository';

export async function POST(request: NextRequest) {
  try {
    const job = dbRepository.createJob('incremental', 'circleftp');

    // Run synchronization asynchronously in background
    (async () => {
      try {
        const catalog = await fetchHomePageCatalog();
        const totalItems = [
          ...catalog.latest,
          ...catalog.mostVisited,
          ...Object.values(catalog.byCategory).flat()
        ];
        dbRepository.upsertManyContent(totalItems);

        dbRepository.updateJob(job.id, {
          status: 'completed',
          finishedAt: new Date().toISOString(),
          itemsProcessed: totalItems.length,
          itemsAdded: totalItems.length
        });
      } catch (err: any) {
        dbRepository.updateJob(job.id, {
          status: 'failed',
          finishedAt: new Date().toISOString(),
          errorMessage: err.message
        });
      }
    })();

    return NextResponse.json({
      message: 'Synchronization job triggered successfully',
      jobId: job.id,
      startedAt: job.startedAt
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

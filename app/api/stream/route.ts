import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mediaUrl = searchParams.get('url');

  if (!mediaUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  // Security check: only allow authorized circleftp / bdix domains
  try {
    const parsed = new URL(mediaUrl);
    const allowedHosts = [
      'circleftp.net',
      'ftp1.circleftp.net',
      'ftp2.circleftp.net',
      'ftp3.circleftp.net',
      'ftp4.circleftp.net',
      'ftp5.circleftp.net',
      'ftp6.circleftp.net',
      'ftp7.circleftp.net',
      'ftp8.circleftp.net',
      'ftp9.circleftp.net',
      'ftp10.circleftp.net',
      'ftp11.circleftp.net',
      'ftp12.circleftp.net',
      'ftp13.circleftp.net',
      'ftp14.circleftp.net',
      'index.circleftp.net',
      'index2.circleftp.net',
      'new.circleftp.net',
      'main.circleftp.net',
      'bdixcdn.com'
    ];

    const isAllowed = allowedHosts.some(h => parsed.hostname === h || parsed.hostname.endsWith('.circleftp.net') || parsed.hostname.endsWith('.bdixcdn.com'));
    if (!isAllowed) {
      return NextResponse.json({ error: 'Forbidden host' }, { status: 403 });
    }

    // Forward range header if present
    const rangeHeader = request.headers.get('range');
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NEXORA/1.0',
    };
    if (rangeHeader) {
      headers['Range'] = rangeHeader;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const upstreamRes = await fetch(mediaUrl, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    // Build response headers
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', upstreamRes.headers.get('content-type') || 'video/mp4');
    responseHeaders.set('Accept-Ranges', 'bytes');

    const contentLength = upstreamRes.headers.get('content-length');
    if (contentLength) {
      responseHeaders.set('Content-Length', contentLength);
    }

    const contentRange = upstreamRes.headers.get('content-range');
    if (contentRange) {
      responseHeaders.set('Content-Range', contentRange);
    }

    return new NextResponse(upstreamRes.body as any, {
      status: upstreamRes.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return NextResponse.json({ error: `Streaming proxy error: ${err.message}` }, { status: 502 });
  }
}


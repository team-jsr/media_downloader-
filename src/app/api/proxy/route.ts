import { NextRequest, NextResponse } from 'next/server';
import { create } from 'youtube-dl-exec';
import path from 'path';
import os from 'os';
import { Readable } from 'stream';

const binaryName = os.platform() === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const youtubedl = create(path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', binaryName));

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  const format_id = req.nextUrl.searchParams.get('format_id') || 'best';
  const fallbackUrl = req.nextUrl.searchParams.get('fallback_url');

  // Handle fallback proxy if format extraction wasn't used
  if (fallbackUrl) {
    try {
      const response = await fetch(fallbackUrl, {
        headers: {
          'Referer': 'https://www.youtube.com/',
        },
      });
      if (!response.ok) throw new Error('Fallback fetch failed');
      return new NextResponse(response.body, { headers: response.headers });
    } catch (e) {
      return new NextResponse('Failed to proxy fallback url', { status: 500 });
    }
  }

  if (!url) {
    return new NextResponse('URL is required', { status: 400 });
  }

  try {
    const subprocess = youtubedl.exec(url, {
      output: '-', // Pipe directly to stdout
      format: format_id,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true
    }, {
      stdio: ['ignore', 'pipe', 'ignore']
    });

    if (!subprocess.stdout) {
      throw new Error('Failed to start download stream');
    }

    // @ts-ignore - Next.js NextResponse can accept a ReadableStream, we need to adapt Node's stream.
   const webStream = Readable.toWeb(subprocess.stdout) as any;

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="snapdl-video.mp4"',
      },
    });
  } catch (error: any) {
    console.error('Download error:', error);
    return new NextResponse('Failed to stream media', { status: 500 });
  }
}

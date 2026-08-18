import { NextResponse } from 'next/server';
import { create } from 'youtube-dl-exec';
import path from 'path';
import os from 'os';

const binaryName = os.platform() === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const youtubedl = create(path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', binaryName));

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Execute youtube-dl-exec to get metadata without downloading
    const output = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: [
        'referer:youtube.com'
      ]
    });

    const metadata = output as any;

    // Filter formats to find video with audio (often pre-merged in some platforms)
    // or just pass all formats to the frontend.
    // For simplicity, let's extract the most relevant data.
    
    const rawFormats = metadata.formats?.map((format: any) => {
      const hasVideo = format.vcodec !== 'none';
      const hasAudio = format.acodec !== 'none';
      let resLabel = format.resolution;
      
      if (!resLabel) {
        if (format.width && format.height) {
          resLabel = `${format.width}x${format.height}`;
        } else if (hasVideo) {
          resLabel = 'Video';
        } else {
          resLabel = 'Audio Only';
        }
      } else if (resLabel === 'audio only' && hasVideo) {
        // Some extractors incorrectly label video as audio only
        resLabel = 'Video';
      }

      return {
        format_id: format.format_id,
        ext: format.ext,
        resolution: resLabel,
        filesize: format.filesize || format.filesize_approx || 0,
        url: format.url,
        hasVideo,
        hasAudio,
        abr: format.abr || 0,
      };
    }) || [];

    const combinedVideos = rawFormats
      .filter((f: any) => f.hasVideo && f.hasAudio)
      .sort((a: any, b: any) => b.filesize - a.filesize);

    const fallbackVideos = rawFormats
      .filter((f: any) => f.hasVideo && !f.hasAudio)
      .sort((a: any, b: any) => b.filesize - a.filesize);

    const videoFormats = combinedVideos.length > 0 ? combinedVideos : fallbackVideos;

    const audioFormats = rawFormats
      .filter((f: any) => !f.hasVideo && f.hasAudio)
      .sort((a: any, b: any) => b.abr - a.abr);

    return NextResponse.json({
      title: metadata.title,
      thumbnail: metadata.thumbnail,
      duration: metadata.duration,
      extractor: metadata.extractor_key,
      videoFormats,
      audioFormats,
      // fallback to original direct url if formats are missing
      directUrl: metadata.url || null, 
    });

  } catch (error: any) {
    console.error('Extraction Error:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to extract video details. The link might be invalid or unsupported.' },
      { status: 500 }
    );
  }
}

'use client';
 
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';


function VideoPlayer() {
    const searchParams = useSearchParams();
    const videoSrc = searchParams.get("v");
    const videoPrefix =
        'https://storage.googleapis.com/bruce-yt-processed-videos/';
  
    return <video controls src={`${videoPrefix}${videoSrc}`} />;
  }

export default function Watch() {
  return (
    
    <div>
    <h1>Watch Page</h1>
    {
        <Suspense fallback={<p>Loading video...</p>}>
            <VideoPlayer />
        </Suspense>
      }
    </div>
  );
}
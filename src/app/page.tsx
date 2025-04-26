
'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import VideoDownloaderClient from '@/components/video-downloader-client'; // Import the new client component

const VideoDownloaderPage: FC = () => {
  // State to track if the component has mounted on the client
  const [isMounted, setIsMounted] = useState(false);

  // Use useEffect to set isMounted to true only after the component mounts on the client.
  // This helps prevent hydration mismatches by ensuring client-specific logic
  // (like rendering the VideoDownloaderClient which uses hooks) runs only after initial server render.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
            <Download className="h-8 w-8 text-primary" />
            Video Downloader
          </CardTitle>
          <CardDescription className="text-center pt-2 text-muted-foreground">
            Paste the URL of the video you want to download below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Conditionally render the client component or a loading skeleton */}
          {/* Only render VideoDownloaderClient once isMounted is true (i.e., on the client) */}
          {!isMounted ? (
            <div className="space-y-6 pt-6"> {/* Added pt-6 to match CardContent padding */}
              {/* Placeholder Skeleton for the form */}
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              {/* Optional: Placeholder for results section if needed */}
              {/* <Skeleton className="h-20 w-full rounded-lg mt-8" /> */}
            </div>
          ) : (
            <VideoDownloaderClient />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoDownloaderPage;

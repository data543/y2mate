
'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import VideoDownloaderClient from '@/components/video-downloader-client'; // Import the new client component

const VideoDownloaderPage: FC = () => {
  const [isMounted, setIsMounted] = useState(false);

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
          {/* Conditionally render the client component or a loading state */}
          {isMounted ? (
            <VideoDownloaderClient />
          ) : (
            <div className="space-y-6">
              {/* Placeholder Skeleton for the form */}
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              {/* Optional: Placeholder for results section if needed */}
              {/* <Skeleton className="h-20 w-full rounded-lg mt-8" /> */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoDownloaderPage;

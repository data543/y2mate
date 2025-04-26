
'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Download, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { DownloadLink } from '@/services/y2mate';
import { fetchDownloadLinksAction } from './actions';
import DownloadLinksDisplay from '@/components/download-links-display';

const formSchema = z.object({
  videoUrl: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormValues = z.infer<typeof formSchema>;

const VideoDownloaderPage: FC = () => {
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showMockDataWarning, setShowMockDataWarning] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    setDownloadLinks([]);
    setShowMockDataWarning(false); // Reset warning on new submission

    const result = await fetchDownloadLinksAction(values.videoUrl);

    if (result.success) {
      setDownloadLinks(result.data || []);
      // Check if the returned URLs look like mock data (simple check)
      // In a real app, the backend action should ideally indicate if it's mock data
      if (result.data?.some(link => link.url.includes('example.com') || link.url === '#')) {
        setShowMockDataWarning(true);
      }
    } else {
      setError(result.error || 'An unknown error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
            <Download className="h-8 w-8 text-primary" />
            Video Downloader
          </CardTitle>
          <CardDescription className="text-center pt-2">
            Paste the URL of the video you want to download.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Video URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter video URL here..."
                        {...field}
                        className="text-base"
                        aria-label="Video URL Input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                 'Get Download Links'
                )}
              </Button>
            </form>
          </Form>

          {error && (
             <Alert variant="destructive" className="mt-6">
              <AlertTriangle className="h-4 w-4" />
               <AlertTitle>Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
           )}

          {showMockDataWarning && !isLoading && (
             <Alert variant="warning" className="mt-6">
               <AlertTriangle className="h-4 w-4" />
               <AlertTitle>Developer Notice: Using Mock Data</AlertTitle>
               <AlertDescription>
                 The download links shown below are placeholders. The actual video/audio downloading functionality has not been implemented yet. Clicking 'Download' will not retrieve the real file.
               </AlertDescription>
             </Alert>
           )}

          {downloadLinks.length > 0 && !isLoading && (
            <div className="mt-8">
               <h2 className="text-xl font-semibold mb-4 text-center">Available Downloads</h2>
              <DownloadLinksDisplay links={downloadLinks} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoDownloaderPage;

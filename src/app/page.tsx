
'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Download } from 'lucide-react';

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

    const result = await fetchDownloadLinksAction(values.videoUrl);

    if (result.success) {
      setDownloadLinks(result.data || []);
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
               <AlertTitle>Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
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

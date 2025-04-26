
'use client';

import type { FC } from 'react';
import { useState, useTransition } from 'react'; // Added useTransition
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Download, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { DownloadLink } from '@/services/y2mate';
import { fetchDownloadLinksAction } from '@/app/actions'; // Ensure correct path
import DownloadLinksDisplay from '@/components/download-links-display';

const formSchema = z.object({
  videoUrl: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormValues = z.infer<typeof formSchema>;

const VideoDownloaderClient: FC = () => {
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(false); // Replaced with useTransition
  const [error, setError] = useState<string | null>(null);
  const [showMockDataWarning, setShowMockDataWarning] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition(); // Using transition for better UX

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => { // Wrap action call in startTransition
      // setIsLoading(true); // No longer needed with useTransition
      setError(null);
      setDownloadLinks([]);
      setShowMockDataWarning(false); // Reset warning on new submission

      const result = await fetchDownloadLinksAction(values.videoUrl);

      if (result.success) {
        setDownloadLinks(result.data || []);
        // Check if the returned URLs look like mock data (e.g., contain 'example.com' or known placeholders)
        // This check might need refinement based on the actual mock data structure in y2mate.ts
        if (result.data?.some(link => link.url.includes('example.com') || !link.url.match(/\.(mp4|mp3|webm|m4a|avi|mov|flv|wmv)$/i))) {
          setShowMockDataWarning(true);
        }
      } else {
        setError(result.error || 'An unknown error occurred.');
        setDownloadLinks([]); // Ensure links are cleared on error
      }

      // setIsLoading(false); // No longer needed
    });
  };

  // No changes seem needed here for hydration based on current structure.
  // The component uses client-side state and transitions, which should render correctly after mounting.
  // Conditional rendering of alerts happens based on state updated *after* initial render.

  return (
    <>
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
                    className="text-base py-3 px-4 rounded-lg focus:ring-primary focus:border-primary"
                    aria-label="Video URL Input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full text-lg py-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            {isPending ? (
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

      {error && !isPending && ( // Don't show error while pending
         <Alert variant="destructive" className="mt-6 rounded-lg">
          <AlertTriangle className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
       )}

      {/* Enhanced Warning Message */}
      {showMockDataWarning && !isPending && downloadLinks.length > 0 && (
         <Alert variant="warning" className="mt-6 rounded-lg">
           <AlertTriangle className="h-4 w-4" />
           <AlertTitle>Action Required: Implement Backend Logic</AlertTitle>
           <AlertDescription>
             <p className="font-semibold">The download links below are currently placeholders (mock data).</p>
             <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>The actual video/audio downloading functionality requires implementation in the backend service: <code>src/services/y2mate.ts</code>.</li>
                <li>Clicking 'Download' now will likely download an <strong className="font-semibold">HTML file (e.g., 'download.htm')</strong> or lead to a placeholder domain (like 'example.com'), **NOT** the actual media file.</li>
                <li>The backend service **must** be updated to interact with a real video downloading source (like y2mate or an alternative API/library) and provide **DIRECT** media links (e.g., ending in <code>.mp4</code> or <code>.mp3</code>).</li>
                <li>Please refer to the comments within <code>src/services/y2mate.ts</code> for detailed instructions on how to implement this.</li>
             </ul>
           </AlertDescription>
         </Alert>
       )}

      {downloadLinks.length > 0 && !isPending && (
        <div className="mt-8">
           <h2 className="text-xl font-semibold mb-4 text-center text-foreground">Available Downloads</h2>
          <DownloadLinksDisplay links={downloadLinks} />
        </div>
      )}
    </>
  );
};

export default VideoDownloaderClient;

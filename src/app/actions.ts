
'use server';

import { getVideoDownloadLinks } from '@/services/y2mate';
import type { DownloadLink } from '@/services/y2mate';

interface ActionResult {
    success: boolean;
    data?: DownloadLink[];
    error?: string;
}

export async function fetchDownloadLinksAction(videoUrl: string): Promise<ActionResult> {
    // Basic URL validation (more robust validation can be added)
    if (!videoUrl || !videoUrl.startsWith('http')) {
        return { success: false, error: 'Invalid URL provided.' };
    }

    try {
        // Simulate network delay
        // await new Promise(resolve => setTimeout(resolve, 1500));

        // In a real application, you would implement the logic in getVideoDownloadLinks
        // to actually scrape or call an API.
        // For now, it uses the mock data provided in the service.
        const links = await getVideoDownloadLinks(videoUrl);

        if (!links || links.length === 0) {
           return { success: false, error: 'No download links found for this video.' };
        }

        return { success: true, data: links };
    } catch (error) {
        console.error('Error fetching download links:', error);
        // Return a generic error message to the client
        return { success: false, error: 'Failed to fetch download links. Please try again later.' };
    }
}

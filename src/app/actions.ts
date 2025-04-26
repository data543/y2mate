
'use server';

import { getVideoDownloadLinks } from '@/services/y2mate';
import type { DownloadLink } from '@/services/y2mate'; // Assuming DownloadLink interface is defined here or imported

interface ActionResult {
    success: boolean;
    data?: DownloadLink[];
    error?: string;
    isMockData?: boolean; // Flag to indicate if the data is mocked
}

/**
 * Server action to fetch video download links.
 * Calls the backend service `getVideoDownloadLinks`.
 *
 * @param videoUrl The URL of the video provided by the client.
 * @returns An ActionResult object.
 */
export async function fetchDownloadLinksAction(videoUrl: string): Promise<ActionResult> {
    console.log(`Action: fetchDownloadLinksAction called for URL: ${videoUrl}`);

    // Basic URL validation
    if (!videoUrl || !URL.canParse(videoUrl)) {
         console.error("Action Error: Invalid URL provided.");
        return { success: false, error: 'Invalid URL provided. Please enter a valid video URL.' };
    }

    try {
        // Call the service function to get the links
        // This function currently returns MOCK data (see src/services/y2mate.ts)
        const links = await getVideoDownloadLinks(videoUrl);

        // Check if the service returned any links
        if (!links || links.length === 0) {
           console.log("Action Info: No download links found or returned by the service.");
           // Provide a more specific message if it's likely due to unimplemented backend
           return {
                success: false,
                error: 'Could not find download links for this video. The backend service might not be fully implemented yet.',
                isMockData: true // Treat lack of links from mock as mock data scenario
            };
        }

        // Determine if the data is mocked (heuristic check based on known mock patterns)
        // Refine this check based on the actual mock data structure in y2mate.ts
        const isMock = links.some(link =>
            link.url.includes('example.com') ||
            link.url.includes('source=mock') ||
            !link.url.match(/\.(mp4|mp3|webm|m4a|avi|mov|flv|wmv)(\?.*)?$/i) // Check if URL likely lacks media extension
        );

        console.log(`Action Success: Found ${links.length} links. Mock data: ${isMock}`);
        return { success: true, data: links, isMockData: isMock };

    } catch (error: unknown) {
        console.error('Action Error: Failed to fetch download links.', error);
        // Return a generic but informative error message
        return {
            success: false,
            error: `An unexpected error occurred while fetching download links. Please check the server logs. ${error instanceof Error ? error.message : ''}`
        };
    }
}

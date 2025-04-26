
import type { FC } from 'react';
import { FileVideo, FileAudio, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { DownloadLink } from '@/services/y2mate';

interface DownloadLinksDisplayProps {
  links: DownloadLink[];
}

const getIconForFormat = (format: string) => {
  const lowerFormat = format.toLowerCase();
  if (lowerFormat === 'mp4') {
    return <FileVideo className="h-5 w-5 inline-block mr-2" />;
  } else if (lowerFormat === 'mp3') {
    return <FileAudio className="h-5 w-5 inline-block mr-2" />;
  }
  return <Download className="h-5 w-5 inline-block mr-2" />; // Default icon
};

const DownloadLinksDisplay: FC<DownloadLinksDisplayProps> = ({ links }) => {
  return (
    <div className="rounded-md border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Format</TableHead>
            <TableHead>Resolution</TableHead>
            <TableHead className="text-right w-[120px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium flex items-center">
                {getIconForFormat(link.format)}
                {link.format.toUpperCase()}
              </TableCell>
              <TableCell>{link.resolution}</TableCell>
              <TableCell className="text-right">
                <Button asChild size="sm" variant="outline">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" download>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DownloadLinksDisplay;

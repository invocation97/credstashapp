import { DownloadIcon, SaveIcon, ShareIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function EditorActions({
  onSave,
  isPending,
}: {
  onSave: () => void;
  isPending: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onSave}
        variant="outline"
        size="sm"
        className="h-8 gap-1"
      >
        <SaveIcon className="h-4 w-4" />
        <span className="sm:not-sr-only">
          {isPending ? "Saving..." : "Save"}
        </span>
      </Button>
      <Button variant="outline" size="sm" className="h-8 gap-1">
        <ShareIcon className="h-4 w-4" />
        <span className="sm:not-sr-only">Share</span>
      </Button>
      <Button variant="outline" size="sm" className="h-8 gap-1">
        <DownloadIcon className="h-4 w-4" />
        <span className="sm:not-sr-only">Download</span>
      </Button>
    </div>
  );
}

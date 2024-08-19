import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import Link from "next/link";
import { FileIcon, FolderIcon } from "lucide-react";
import FileTreeItem, { FileTreeItemProps } from "../folders/FileTreeItem";

export default function MobileSidebar({
  nodes,
}: {
  nodes: FileTreeItemProps[];
}) {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden" asChild>
        <Button>Quick Navigation</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="md:hidden">
        <div className="bg-muted rounded-md p-4">
          <div className="font-semibold mb-2">Folders</div>
          <div className="space-y-2">
            <ul>
              {nodes.map((node) => (
                <FileTreeItem node={node} key={node.name} />
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

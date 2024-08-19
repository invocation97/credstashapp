"use client";

import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export type FileTreeItemProps = {
  name: string;
  path: string;
  nodes?: FileTreeItemProps[];
};

export default function FileTreeItem({ node }: { node: FileTreeItemProps }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li key={node.name}>
      <span className="flex items-center gap-1.5 py-1">
        {node.nodes && node.nodes.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 -m-1"
          >
            <ChevronRightIcon
              className={`size-4 text-foreground ${isOpen ? "rotate-90" : ""}`}
            />
          </Button>
        )}

        {node.nodes ? (
          <FolderIcon
            className={`size-4 text-primary ${
              node.nodes.length === 0 ? "ml-2" : ""
            }`}
          />
        ) : (
          <FileIcon className="ml-2 size-4 text-primary" />
        )}
        <Link className="ml-2" href={node.path || ""}>
          {node.name}
        </Link>
      </span>

      {isOpen && node.nodes && (
        <ul className="pl-6">
          {node.nodes.map((childNode) => (
            <FileTreeItem node={childNode} key={childNode.name} />
          ))}
        </ul>
      )}
    </li>
  );
}

"use client";

import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode } from "@lexical/rich-text";
import React, { useMemo } from "react";
import CustomOnChangePlugin from "./plugins/CustomOnChangePlugin";
import Theme from "./plugins/Theme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name: string;
}
export const Editor = React.memo(function Editor({
  value,
  onChange,
  placeholder = "Start typing",
  name,
}: EditorProps) {
  const initialConfig = useMemo(
    () => ({
      namespace: name,
      nodes: [HeadingNode, ListNode, ListItemNode, LinkNode, CodeNode],
      onError: (error: Error) => {
        console.error(error);
        throw error;
      },
      theme: Theme,
    }),
    [name]
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <ToolbarPlugin />

        <div className="editor-inner min-h-[450px] h-full">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-input h-full" />
            }
            placeholder={
              <div className="editor-placeholder">{placeholder}</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <CustomOnChangePlugin value={value} onChange={onChange} />
        </div>
      </div>
    </LexicalComposer>
  );
});

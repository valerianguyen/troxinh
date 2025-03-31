import { useEffect } from 'react';

import {
  ScrollArea,
  ScrollBar,
} from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/use-media-querry';
import { BubbleMenu } from '@tiptap/react';

import { AlignmentTooolbar } from '../toolbars/alignment';
import { BlockquoteToolbar } from '../toolbars/blockquote';
import { BoldToolbar } from '../toolbars/bold';
import { BulletListToolbar } from '../toolbars/bullet-list';
import { ColorHighlightToolbar } from '../toolbars/color-and-highlight';
import { HeadingsToolbar } from '../toolbars/headings';
import { ImagePlaceholderToolbar } from '../toolbars/image-placeholder-toolbar';
import { ItalicToolbar } from '../toolbars/italic';
import { LinkToolbar } from '../toolbars/link';
import { OrderedListToolbar } from '../toolbars/ordered-list';
import { ToolbarProvider } from '../toolbars/toolbar-provider';
import { UnderlineToolbar } from '../toolbars/underline';

export function FloatingToolbar({ editor }) {
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Prevent default context menu on mobile
  useEffect(() => {
    if (!editor?.options.element || !isMobile) return

    const handleContextMenu = (e) => {
      e.preventDefault()
    }

    const el = editor.options.element
    el.addEventListener("contextmenu", handleContextMenu)

    return () => el.removeEventListener("contextmenu", handleContextMenu)
  }, [editor, isMobile])

  if (!editor) return null

  if (isMobile) {
    return (
      <TooltipProvider>
        <BubbleMenu
          tippyOptions={{
            duration: 100,
            placement: "bottom",
            offset: [0, 10],
          }}
          shouldShow={() => {
            // Show toolbar when editor is focused and has selection
            return editor.isEditable && editor.isFocused
          }}
          editor={editor}
          className="w-full min-w-full mx-0 shadow-sm border rounded-sm bg-background"
        >
          <ToolbarProvider editor={editor}>
            <ScrollArea className="h-fit py-0.5 w-full">
              <div className="flex items-center px-2 gap-0.5">
                <div className="flex items-center gap-0.5 p-1">
                  {/* Primary formatting */}
                  <BoldToolbar />
                  <ItalicToolbar />
                  <UnderlineToolbar />
                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Structure controls */}
                  <HeadingsToolbar />
                  <BulletListToolbar />
                  <OrderedListToolbar />
                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Rich formatting */}
                  <ColorHighlightToolbar />
                  <LinkToolbar />
                  <ImagePlaceholderToolbar />
                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Additional controls */}
                  <AlignmentTooolbar />
                  <BlockquoteToolbar />
                </div>
              </div>
              <ScrollBar className="h-0.5" orientation="horizontal" />
            </ScrollArea>
          </ToolbarProvider>
        </BubbleMenu>
      </TooltipProvider>
    )
  }

  return null
}


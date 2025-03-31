import {
  CheckIcon,
  ChevronDownIcon,
} from 'lucide-react';

/* eslint-disable */
// @ts-nocheck
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/use-media-querry';
import { cn } from '@/lib/utils';

import {
  MobileToolbarGroup,
  MobileToolbarItem,
} from './mobile-toolbar-group';
import { useToolbar } from './toolbar-provider';

const TEXT_COLORS = [
  { name: "Default", color: "var(--editor-text-default)" },
  { name: "Gray", color: "var(--editor-text-gray)" },
  { name: "Brown", color: "var(--editor-text-brown)" },
  { name: "Orange", color: "var(--editor-text-orange)" },
  { name: "Yellow", color: "var(--editor-text-yellow)" },
  { name: "Green", color: "var(--editor-text-green)" },
  { name: "Blue", color: "var(--editor-text-blue)" },
  { name: "Purple", color: "var(--editor-text-purple)" },
  { name: "Pink", color: "var(--editor-text-pink)" },
  { name: "Red", color: "var(--editor-text-red)" },
]

const HIGHLIGHT_COLORS = [
  { name: "Default", color: "var(--editor-highlight-default)" },
  { name: "Gray", color: "var(--editor-highlight-gray)" },
  { name: "Brown", color: "var(--editor-highlight-brown)" },
  { name: "Orange", color: "var(--editor-highlight-orange)" },
  { name: "Yellow", color: "var(--editor-highlight-yellow)" },
  { name: "Green", color: "var(--editor-highlight-green)" },
  { name: "Blue", color: "var(--editor-highlight-blue)" },
  { name: "Purple", color: "var(--editor-highlight-purple)" },
  { name: "Pink", color: "var(--editor-highlight-pink)" },
  { name: "Red", color: "var(--editor-highlight-red)" },
]


const ColorHighlightButton = ({ name, color, isActive, onClick, isHighlight }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-gray-3"
    type="button"
  >
    <div className="flex items-center space-x-2">
      <div
        className="rounded-sm border px-1 py-px font-medium"
        style={isHighlight ? { backgroundColor: color } : { color }}
      >
        A
      </div>
      <span>{name}</span>
    </div>
    {isActive && <CheckIcon className="h-4 w-4" />}
  </button>
)

export const ColorHighlightToolbar = () => {
  const { editor } = useToolbar()
  const isMobile = useMediaQuery("(max-width: 640px)")

  const currentColor = editor?.getAttributes("textStyle").color
  const currentHighlight = editor?.getAttributes("highlight").color

  const handleSetColor = (color) => {
    editor
      ?.chain()
      .focus()
      .setColor(color === currentColor ? "" : color)
      .run()
  }

  const handleSetHighlight = (color) => {
    editor
      ?.chain()
      .focus()
      .setHighlight(color === currentHighlight ? { color: "" } : { color })
      .run()
  }

  const isDisabled = !editor?.can().chain().setHighlight().run() || !editor?.can().chain().setColor("").run()

  if (isMobile) {
    return (
      <div className="flex gap-1">
        <MobileToolbarGroup label="Color">
          {TEXT_COLORS.map(({ name, color }) => (
            <MobileToolbarItem key={name} onClick={() => handleSetColor(color)} active={currentColor === color}>
              <div className="flex items-center gap-2">
                <div className="rounded-sm border px-2" style={{ color }}>
                  A
                </div>
                <span>{name}</span>
              </div>
            </MobileToolbarItem>
          ))}
        </MobileToolbarGroup>

        <MobileToolbarGroup label="Highlight">
          {HIGHLIGHT_COLORS.map(({ name, color }) => (
            <MobileToolbarItem key={name} onClick={() => handleSetHighlight(color)} active={currentHighlight === color}>
              <div className="flex items-center gap-2">
                <div className="rounded-sm border px-2" style={{ backgroundColor: color }}>
                  A
                </div>
                <span>{name}</span>
              </div>
            </MobileToolbarItem>
          ))}
        </MobileToolbarGroup>
      </div>
    )
  }

  return (
    <Popover>
      <div className="relative h-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger disabled={isDisabled} asChild>
              <Button
                variant="ghost"
                size="sm"
                style={{
                  color: currentColor,
                }}
                className={cn("h-8 w-14 p-0 font-normal")}
              >
                <span className="text-md">A</span>
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Text Color & Highlight</TooltipContent>
        </Tooltip>

        <PopoverContent align="start" className="w-56 p-1 dark:bg-gray-2">
          <ScrollArea className="max-h-80 overflow-y-auto pr-2">
            <div className="mb-2.5 mt-2 px-2 text-xs text-gray-11">Color</div>
            {TEXT_COLORS.map(({ name, color }) => (
              <ColorHighlightButton
                key={name}
                name={name}
                color={color}
                isActive={currentColor === color}
                onClick={() => handleSetColor(color)}
              />
            ))}

            <Separator className="my-3" />

            <div className="mb-2.5 w-full px-2 pr-3 text-xs text-gray-11">Background</div>
            {HIGHLIGHT_COLORS.map(({ name, color }) => (
              <ColorHighlightButton
                key={name}
                name={name}
                color={color}
                isActive={currentHighlight === color}
                onClick={() => handleSetHighlight(color)}
                isHighlight
              />
            ))}
          </ScrollArea>
        </PopoverContent>
      </div>
    </Popover>
  )
}


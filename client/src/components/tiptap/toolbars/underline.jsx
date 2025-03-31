import React from 'react';

import { UnderlineIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { useToolbar } from './toolbar-provider';

const UnderlineToolbar = React.forwardRef(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar()
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className={cn("h-8 w-8 p-0 sm:h-9 sm:w-9", editor?.isActive("underline") && "bg-accent", className)}
            onClick={(e) => {
              editor?.chain().focus().toggleUnderline().run()
              onClick?.(e)
            }}
            disabled={!editor?.can().chain().focus().toggleUnderline().run()}
            ref={ref}
            {...props}
          >
            {children ?? <UnderlineIcon className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Underline</span>
          <span className="ml-1 text-xs text-gray-11">(cmd + u)</span>
        </TooltipContent>
      </Tooltip>
    )
  },
)

UnderlineToolbar.displayName = "UnderlineToolbar"

export { UnderlineToolbar };

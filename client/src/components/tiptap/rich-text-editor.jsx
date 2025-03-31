import './tiptap.css';

import { useEffect } from 'react';

import {
  TipTapFloatingMenu,
} from '@/components/tiptap/extensions/floating-menu';
import { ImageExtension } from '@/components/tiptap/extensions/image';
import {
  ImagePlaceholder,
} from '@/components/tiptap/extensions/image-placeholder';
import SearchAndReplace
  from '@/components/tiptap/extensions/search-and-replace';
import { cn } from '@/lib/utils';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import {
  EditorContent,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { EditorToolbar } from './toolbars/editor-toolbar';

const extensions = [
	StarterKit.configure({
		orderedList: {
			HTMLAttributes: {
				class: "list-decimal",
			},
		},
		bulletList: {
			HTMLAttributes: {
				class: "list-disc",
			},
		},
		heading: {
			levels: [1, 2, 3, 4],
		},
	}),
	Placeholder.configure({
		emptyNodeClass: "is-editor-empty",
		placeholder: ({ node }) => {
			switch (node.type.name) {
				case "heading":
					return `Heading ${node.attrs.level}`;
				case "detailsSummary":
					return "Section title";
				case "codeBlock":
					// never show the placeholder when editing code
					return "";
				default:
					return "Write, type '/' for commands";
			}
		},
		includeChildren: false,
	}),
	TextAlign.configure({
		types: ["heading", "paragraph"],
	}),
	TextStyle,
	Subscript,
	Superscript,
	Underline,
	Link,
	Color,
	Highlight.configure({
		multicolor: true,
	}),
	ImageExtension,
	ImagePlaceholder,
	SearchAndReplace,
	Typography,
];

export function RichTextEditor({ className, onChange, content }) {
	const editor = useEditor({
		immediatelyRender: false,
		extensions: extensions,
		content,
		editorProps: {
			attributes: {
				class: "max-w-full focus:outline-none",
			},
		},
		onUpdate: ({ editor }) => {
			console.log("editor", editor.getHTML());
			onChange(editor.getHTML());
		},
	});
	useEffect(() => {
		if (!editor || editor.isDestroyed) return;

		// Wrap in microtask to avoid sync updates during render
		queueMicrotask(() => {
			if (content !== editor.getHTML()) {
				editor.commands.setContent(content, false); // false prevents re-render
			}
		});
	}, [content, editor]);
	if (!editor) return null;

	return (
		<div
			className={cn(
				"relative max-h-[calc(100dvh-4rem)] w-full overflow-hidden border bg-card sm:pb-0 flex flex-col",
				className,
			)}
		>
			<EditorToolbar editor={editor} />
			{/* <FloatingToolbar editor={editor} /> */}
			<TipTapFloatingMenu editor={editor} />
			<EditorContent
				editor={editor}
				className="w-full min-w-full cursor-text border-red-300 border mt-10 flex-1 overflow-y-auto"
			/>
		</div>
	);
}

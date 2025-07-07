// app/components/TipTap.tsx
"use client";

import { forwardRef, useCallback, useImperativeHandle, useEffect } from "react";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link2Off,
  Link as Linked,
  Underline as Underlined,
  List,
  ListOrdered,
  Code,
  FileCode,
  Quote,
  Minus,
  RotateCcw,
  RotateCw,
} from "lucide-react";

import Color from "@tiptap/extension-color";
import Dropcursor from "@tiptap/extension-dropcursor";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import CodeInline from "@tiptap/extension-code";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { EditorState } from "@tiptap/pm/state";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";

// Create lowlight instance for code syntax highlighting
const lowlight = createLowlight(common);

// Define props for the TipTap component
interface TipTapProps {
  initialContent?: string;
  onContentUpdate?: (html: string) => void;
}

const Tiptap = forwardRef<{ getEditor: () => Editor | null }, TipTapProps>(
  ({ initialContent = "", onContentUpdate }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        TextStyle,
        Underline,
        Dropcursor,
        Placeholder.configure({
          placeholder: "Enter your content...",
          emptyEditorClass:
            "before:content-[attr(data-placeholder)] before:float-left before:text-[#adb5bd] before:h-0 before:pointer-events-none",
        }),
        Color.configure({ types: [TextStyle.name] }),
        Heading.configure({ levels: [1, 2, 3] }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),

        // Code extensions
        CodeInline.configure({
          HTMLAttributes: {
            class: "inline-code",
          },
        }),
        CodeBlockLowlight.configure({
          lowlight,
          HTMLAttributes: {
            class: "code-block",
          },
        }),

        Link.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https"],
          isAllowedUri: (url, ctx) => {
            try {
              const parsedUrl = url.includes(":")
                ? new URL(url)
                : new URL(`${ctx.defaultProtocol}://${url}`);
              if (!ctx.defaultValidate(parsedUrl.href)) {
                return false;
              }

              const disallowedProtocols = ["ftp", "file", "mailto"];
              const protocol = parsedUrl.protocol.replace(":", "");
              if (disallowedProtocols.includes(protocol)) {
                return false;
              }

              const allowedProtocols = ctx.protocols.map((p) =>
                typeof p === "string" ? p : p.scheme
              );
              if (!allowedProtocols.includes(protocol)) {
                return false;
              }

              return true;
            } catch {
              return false;
            }
          },
        }),
      ],
      content: initialContent,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        onContentUpdate?.(editor.getHTML());
      },
    });

    useEffect(() => {
      if (editor && initialContent) {
        if (editor.getHTML() !== initialContent) {
          editor.commands.setContent(initialContent, false);
        }
      }
    }, [editor, initialContent]);

    const colors = [
      { name: "Red", value: "#FF0000" },
      { name: "Blue", value: "#0000FF" },
      { name: "Gray", value: "#808080" },
      { name: "Black", value: "#000000" },
    ];

    const setLink = useCallback(() => {
      const { selection } = editor?.state as EditorState;
      if (selection.empty) {
        alert("Select where you want to add the link.");
        return;
      }

      const text = editor?.state.doc
        .textBetween(selection.from, selection.to)
        .trim();
      if (!text) {
        alert("Link must be added to text.");
        return;
      }

      const previousUrl = editor?.getAttributes("link").href;
      const url = window.prompt("Enter your link.", previousUrl);
      if (url === null || url === "") {
        return;
      }

      try {
        editor
          ?.chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      } catch (e: unknown) {
        if (e instanceof Error) {
          alert(e.message);
        }
      }
    }, [editor]);

    useImperativeHandle(ref, () => ({
      getEditor: () => editor,
    }));

    if (!editor) {
      return null;
    }

    return (
      <div className="border p-4 rounded bg-stone-100">
        <div className="flex flex-wrap gap-2 mb-2">
          {/* Basic Formatting */}
          <div className="flex flex-wrap gap-2 border-r pr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                editor.isActive("bold") ? "bg-stone-300" : ""
              }`}
              title="Bold"
            >
              <Bold size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                editor.isActive("italic") ? "bg-stone-300" : ""
              }`}
              title="Italic"
            >
              <Italic size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                editor.isActive("underline") ? "bg-stone-300" : ""
              }`}
              title="Underline"
            >
              <Underlined size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                editor.isActive("code") ? "bg-stone-300" : ""
              }`}
              title="Inline Code"
            >
              <Code size={16} />
            </button>
          </div>

          {/* Headings */}
          <div className="flex flex-wrap gap-2 border-r pr-2">
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                editor.isActive("heading", { level: 1 }) ? "bg-stone-300" : ""
              }`}
              title="Heading 1"
            >
              H1
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                editor.isActive("heading", { level: 2 }) ? "bg-stone-300" : ""
              }`}
              title="Heading 2"
            >
              H2
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                editor.isActive("heading", { level: 3 }) ? "bg-stone-300" : ""
              }`}
              title="Heading 3"
            >
              H3
            </button>
          </div>

          {/* Lists */}
          <div className="flex flex-wrap gap-2 border-r pr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                editor.isActive("bulletList") ? "bg-stone-300" : ""
              }`}
              title="Bullet List"
            >
              <List size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                editor.isActive("orderedList") ? "bg-stone-300" : ""
              }`}
              title="Numbered List"
            >
              <ListOrdered size={16} />
            </button>
          </div>

          {/* Code & Quotes */}
          <div className="flex flex-wrap gap-2 border-r pr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                editor.isActive("codeBlock") ? "bg-stone-300" : ""
              }`}
              title="Code Block"
            >
              <FileCode size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                editor.isActive("blockquote") ? "bg-stone-300" : ""
              }`}
              title="Quote"
            >
              <Quote size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="px-3 py-1 border rounded bg-white hover:bg-stone-200"
              title="Horizontal Rule"
            >
              <Minus size={16} />
            </button>
          </div>

          {/* Text Colors */}
          <div className="flex flex-wrap gap-2 border-r pr-2">
            {colors.map((color) => (
              <button
                type="button"
                key={color.value}
                onClick={() =>
                  editor.chain().focus().setColor(color.value).run()
                }
                className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                  editor.isActive("textStyle", { color: color.value })
                    ? "opacity-80"
                    : ""
                }`}
                style={{ color: color.value }}
                title={`${color.name} Text`}
              >
                {color.name}
              </button>
            ))}
          </div>

          {/* Alignment */}
          <div className="flex flex-wrap gap-2 border-r pr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                editor.isActive({ textAlign: "left" }) ? "bg-stone-300" : ""
              }`}
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                editor.isActive({ textAlign: "center" }) ? "bg-stone-300" : ""
              }`}
              title="Align Center"
            >
              <AlignCenter size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                editor.isActive({ textAlign: "right" }) ? "bg-stone-300" : ""
              }`}
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-2 border-r pr-2">
            <button
              type="button"
              onClick={setLink}
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                editor.isActive("link") ? "bg-stone-300" : ""
              }`}
              title="Add Link"
            >
              <Linked size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className={`px-3 py-1 border rounded bg-white hover:bg-stone-200 ${
                !editor.isActive("link") ? "bg-stone-300" : ""
              }`}
              title="Remove Link"
            >
              <Link2Off size={16} />
            </button>
          </div>

          {/* Undo/Redo */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              className="px-3 py-1 border rounded bg-white hover:bg-stone-200 disabled:opacity-50"
              title="Undo"
            >
              <RotateCcw size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              className="px-3 py-1 border rounded bg-white hover:bg-stone-200 disabled:opacity-50"
              title="Redo"
            >
              <RotateCw size={16} />
            </button>
          </div>
        </div>

        <EditorContent
          editor={editor}
          className="border rounded p-2 bg-white min-h-[200px]"
        />
      </div>
    );
  }
);

Tiptap.displayName = "Tiptap";
export default Tiptap;

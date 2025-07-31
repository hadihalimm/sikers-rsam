'use client';

import { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from 'lucide-react';
import { Toggle } from '../ui/toggle';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useEffect, useReducer } from 'react';

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => forceUpdate();
    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);
    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }
  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive('heading', { level: 3 }),
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive('bold'),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive('italic'),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive('strike'),
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      pressed: editor.isActive({ textAlign: 'left' }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      pressed: editor.isActive({ textAlign: 'center' }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      pressed: editor.isActive({ textAlign: 'right' }),
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive('bulletList'),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive('orderedList'),
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive('highlight'),
    },
  ];

  const TableOptions = [
    {
      icon: (
        <Image
          src={'/tiptap/table.png'}
          width={50}
          height={50}
          className="size-5"
          alt="Insert table"
        />
      ),
      onClick: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
    {
      icon: (
        <Image
          src={'/tiptap/add-column-before.png'}
          width={50}
          height={50}
          className="size-5"
          alt="Add column before"
        />
      ),
      onClick: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      icon: (
        <Image
          src={'/tiptap/add-column-after.png'}
          width={50}
          height={50}
          className="size-5"
          alt="Add column after"
        />
      ),
      onClick: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      icon: (
        <Image
          src={'/tiptap/add-row-before.png'}
          width={50}
          height={50}
          className="size-5"
          alt="Add row before"
        />
      ),
      onClick: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      icon: (
        <Image
          src={'/tiptap/add-row-after.png'}
          width={50}
          height={50}
          className="size-5"
          alt="Add row after"
        />
      ),
      onClick: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      icon: (
        <Image
          src={'/tiptap/delete-column.png'}
          width={50}
          height={50}
          className="size-5"
          alt="Delete row"
        />
      ),
      onClick: () => editor.chain().focus().deleteColumn().run(),
    },
    {
      icon: (
        <Image
          src={'/tiptap/delete-row.png'}
          width={50}
          height={50}
          className="size-5"
          alt="Delete row"
        />
      ),
      onClick: () => editor.chain().focus().deleteRow().run(),
    },
    {
      icon: (
        <Image
          src={'/tiptap/merge-cells.png'}
          width={50}
          height={50}
          className="size-5"
          alt="Merge cells"
        />
      ),
      onClick: () => editor.chain().focus().mergeCells().run(),
    },
    {
      icon: (
        <Image
          src={'/tiptap/split-cells.png'}
          width={50}
          height={50}
          className="size-5"
          alt="Split cells"
        />
      ),
      onClick: () => editor.chain().focus().splitCell().run(),
    },
  ];

  return (
    <div className="border flex flex-col rounded-md bg-zinc-100 p-1 mb-1 z-50">
      <div>
        {Options.map((option, index) => (
          <Toggle
            key={index}
            pressed={option.pressed}
            onPressedChange={option.onClick}>
            {option.icon}
          </Toggle>
        ))}
      </div>
      <div>
        {TableOptions.map((option, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            onClick={option.onClick}>
            {option.icon}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MenuBar;

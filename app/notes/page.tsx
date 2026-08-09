"use client";

import { useMemo, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Trash2,
  Pin,
  PinOff,
  Search,
  Plus,
  FileText,
  Type,
  Highlighter,
} from "lucide-react";

type Note = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  pinned: boolean;
};

const fonts = [
  "Arial",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Courier New",
];

const fontSizes = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
];

export default function NotesPage() {
  const editorRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");

  const [notes, setNotes] = useState<Note[]>([]);

  const [activeNote, setActiveNote] = useState<number | null>(null);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const createNote = () => {
    const content = editorRef.current?.innerHTML || "";

    if (!title.trim() && !content.trim()) return;

    const newNote: Note = {
      id: Date.now(),
      title: title.trim() || "Untitled Note",
      content,
      createdAt: new Date().toLocaleString(),
      pinned: false,
    };

    setNotes((prev) => [newNote, ...prev]);

    setTitle("");

    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }

    setActiveNote(null);
  };

  const deleteNote = (id: number) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));

    if (activeNote === id) {
      setActiveNote(null);
      setTitle("");

      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    }
  };

  const togglePin = (id: number) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              pinned: !note.pinned,
            }
          : note
      )
    );
  };

  const openNote = (note: Note) => {
    setActiveNote(note.id);
    setTitle(note.title);

    if (editorRef.current) {
      editorRef.current.innerHTML = note.content;
    }
  };

  const updateNote = () => {
    if (activeNote === null) {
      createNote();
      return;
    }

    const content = editorRef.current?.innerHTML || "";

    setNotes((prev) =>
      prev.map((note) =>
        note.id === activeNote
          ? {
              ...note,
              title: title.trim() || "Untitled Note",
              content,
            }
          : note
      )
    );
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) =>
      `${note.title} ${note.content}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [notes, search]);

  return (
    <main className="min-h-screen bg-[#07111F] p-6 text-white md:p-10">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
              <FileText size={22} />
            </div>

            <h1 className="text-4xl font-bold">
              Notes
            </h1>
          </div>

          <p className="mt-3 text-gray-400">
            Capture your thoughts, ideas and everything in between.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveNote(null);
            setTitle("");

            if (editorRef.current) {
              editorRef.current.innerHTML = "";
            }
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 font-semibold transition hover:scale-[1.02]"
        >
          <Plus size={18} />
          New Note
        </button>

      </div>

      {/* Main layout */}
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">

        {/* Sidebar */}
        <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-2xl">

          {/* Search */}
          <div className="relative mb-5">

            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder=" Search notes..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-400/30"
            />

          </div>

          <div className="mb-4 flex items-center justify-between px-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Your Notes
            </p>

            <span className="text-xs text-gray-600">
              {notes.length}
            </span>
          </div>

          {/* Notes list */}
          <div className="space-y-2">

            {filteredNotes.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center">

                <FileText
                  size={25}
                  className="mx-auto text-gray-600"
                />

                <p className="mt-3 text-sm text-gray-500">
                  No notes yet
                </p>

              </div>

            ) : (

              filteredNotes.map((note) => (

                <button
                  key={note.id}
                  onClick={() => openNote(note)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    activeNote === note.id
                      ? "border-blue-400/30 bg-blue-500/10"
                      : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                  }`}
                >

                  <div className="flex items-start justify-between gap-3">

                    <p className="truncate text-sm font-semibold text-white">
                      {note.title}
                    </p>

                    {note.pinned && (
                      <Pin
                        size={14}
                        className="shrink-0 text-cyan-400"
                      />
                    )}

                  </div>

                  <p className="mt-2 line-clamp-2 text-xs text-gray-500">
                    {note.content.replace(/<[^>]*>/g, "")}
                  </p>

                  <p className="mt-3 text-[10px] text-gray-600">
                    {note.createdAt}
                  </p>

                </button>

              ))

            )}

          </div>

        </aside>

        {/* Editor */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-2xl">

          {/* Editor header */}
          <div className="border-b border-white/10 p-5">

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled note"
              className="w-full bg-transparent text-2xl font-bold text-white outline-none placeholder:text-gray-600"
            />

          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-white/[0.02] p-3">

            {/* Font */}
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">

              <Type size={15} className="text-gray-500" />

              <select
                onChange={(e) => exec("fontName", e.target.value)}
                className="bg-transparent py-2 text-xs text-gray-300 outline-none"
              >
                {fonts.map((font) => (
                  <option
                    key={font}
                    value={font}
                    className="bg-[#0b1728]"
                  >
                    {font}
                  </option>
                ))}
              </select>

            </div>

            {/* Font size */}
            <select
              onChange={(e) => exec("fontSize", e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 outline-none"
            >
              {fontSizes.map((size) => (
                <option
                  key={size}
                  value={size}
                  className="bg-[#0b1728]"
                >
                  Size {size}
                </option>
              ))}
            </select>

            <ToolbarButton
              icon={<Bold size={17} />}
              onClick={() => exec("bold")}
            />

            <ToolbarButton
              icon={<Italic size={17} />}
              onClick={() => exec("italic")}
            />

            <ToolbarButton
              icon={<Underline size={17} />}
              onClick={() => exec("underline")}
            />

            <ToolbarButton
              icon={<List size={17} />}
              onClick={() => exec("insertUnorderedList")}
            />

            <ToolbarButton
              icon={<ListOrdered size={17} />}
              onClick={() => exec("insertOrderedList")}
            />

            <ToolbarButton
              icon={<AlignLeft size={17} />}
              onClick={() => exec("justifyLeft")}
            />

            <ToolbarButton
              icon={<AlignCenter size={17} />}
              onClick={() => exec("justifyCenter")}
            />

            <ToolbarButton
              icon={<AlignRight size={17} />}
              onClick={() => exec("justifyRight")}
            />

            <ToolbarButton
              icon={<Highlighter size={17} />}
              onClick={() => exec("backColor", "#2563eb")}
            />

            <div className="mx-1 h-6 w-px bg-white/10" />

            <ToolbarButton
              icon={<Undo2 size={17} />}
              onClick={() => exec("undo")}
            />

            <ToolbarButton
              icon={<Redo2 size={17} />}
              onClick={() => exec("redo")}
            />

          </div>

          {/* Editor */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Start writing..."
            className="min-h-[420px] p-7 text-base leading-8 text-gray-200 outline-none empty:before:text-gray-600 empty:before:content-[attr(data-placeholder)]"
          />

          {/* Bottom bar */}
          <div className="flex flex-col gap-3 border-t border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2 text-xs text-gray-500">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              Ready to save

            </div>

            <div className="flex gap-2">

              {activeNote !== null && (
                <>
                  <button
                    onClick={() => {
                      const note = notes.find(
                        (n) => n.id === activeNote
                      );

                      if (note) {
                        togglePin(note.id);
                      }
                    }}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10"
                  >
                    {notes.find((n) => n.id === activeNote)?.pinned ? (
                      <>
                        <PinOff size={16} />
                        Unpin
                      </>
                    ) : (
                      <>
                        <Pin size={16} />
                        Pin
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => deleteNote(activeNote)}
                    className="flex items-center gap-2 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </>
              )}

              <button
                onClick={
                  activeNote !== null
                    ? updateNote
                    : createNote
                }
                className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {activeNote !== null
                  ? "Update Note"
                  : "Save Note"}
              </button>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

/* Toolbar Button */

function ToolbarButton({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-white/10 hover:text-white"
    >
      {icon}
    </button>
  );
}
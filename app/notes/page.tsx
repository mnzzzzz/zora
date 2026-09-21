"use client";

import { useEffect, useMemo, useState } from "react";
import FloatingSidebar from "@/components/floatingsidebar";

import {
  Archive,
  Bold,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Italic,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Type,
  Underline,
  X,
} from "lucide-react";

type FontFamily =
  | "Inter"
  | "Arial"
  | "Georgia"
  | "Times New Roman"
  | "Courier New"
  | "Trebuchet MS"
  | "Verdana"
  | "monospace";

type Note = {
  id: string;
  title: string;
  content: string;
  folderId: string | null;

  fontFamily: FontFamily;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;

  createdAt: number;
  updatedAt: number;
};

type NoteFolder = {
  id: string;
  name: string;
  createdAt: number;
};

const NOTES_STORAGE_KEY = "monobloc-notes";
const FOLDERS_STORAGE_KEY = "monobloc-note-folders";

const FONT_OPTIONS: FontFamily[] = [
  "Inter",
  "Arial",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Trebuchet MS",
  "Verdana",
  "monospace",
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32];

function createEmptyNote(folderId: string | null = null): Note {
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    title: "",
    content: "",
    folderId,

    fontFamily: "Inter",
    fontSize: 16,
    bold: false,
    italic: false,
    underline: false,

    createdAt: now,
    updatedAt: now,
  };
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<NoteFolder[]>([]);

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    null
  );

  const [search, setSearch] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");

  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");

  const [openFolderMenu, setOpenFolderMenu] = useState<string | null>(null);

  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(
    null
  );

  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");

  /* -------------------------------------------------------------------------- */
  /* LOAD DATA                                                                    */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      const savedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);

      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);

        if (Array.isArray(parsedNotes)) {
          setNotes(
            parsedNotes.map((note) => ({
              ...note,
              fontFamily: note.fontFamily || "Inter",
              fontSize: note.fontSize || 16,
              bold: Boolean(note.bold),
              italic: Boolean(note.italic),
              underline: Boolean(note.underline),
            }))
          );
        }
      }

      if (savedFolders) {
        const parsedFolders = JSON.parse(savedFolders);

        if (Array.isArray(parsedFolders)) {
          setFolders(parsedFolders);
        }
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /* SAVE NOTES                                                                   */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!isLoaded) return;

    setSaveState("saving");

    const timeout = window.setTimeout(() => {
      try {
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
        setSaveState("saved");
      } catch (error) {
        console.error("Failed to save notes:", error);
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [notes, isLoaded]);

  /* -------------------------------------------------------------------------- */
  /* SAVE FOLDERS                                                                 */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
    } catch (error) {
      console.error("Failed to save folders:", error);
    }
  }, [folders, isLoaded]);

  /* -------------------------------------------------------------------------- */
  /* SELECTED NOTE                                                                */
  /* -------------------------------------------------------------------------- */

  const selectedNote = useMemo(() => {
    if (!selectedNoteId) return null;

    return notes.find((note) => note.id === selectedNoteId) ?? null;
  }, [notes, selectedNoteId]);

  /* -------------------------------------------------------------------------- */
  /* FILTERED NOTES                                                               */
  /* -------------------------------------------------------------------------- */

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (selectedFolderId !== null) {
      result = result.filter(
        (note) => note.folderId === selectedFolderId
      );
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      );
    }

    return result.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, selectedFolderId, search]);

  /* -------------------------------------------------------------------------- */
  /* METRICS                                                                      */
  /* -------------------------------------------------------------------------- */

  const totalWords = notes.reduce((total, note) => {
    return (
      total +
      note.content
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    );
  }, 0);

  const recentNotes = notes.filter(
    (note) =>
      Date.now() - note.updatedAt < 1000 * 60 * 60 * 24 * 7
  ).length;

  /* -------------------------------------------------------------------------- */
  /* CREATE NOTE                                                                  */
  /* -------------------------------------------------------------------------- */

  function createNote(folderId: string | null = selectedFolderId) {
    const note = createEmptyNote(folderId);

    setNotes((current) => [note, ...current]);
    setSelectedNoteId(note.id);
  }

  /* -------------------------------------------------------------------------- */
  /* UPDATE NOTE                                                                  */
  /* -------------------------------------------------------------------------- */

  function updateNote(updates: Partial<Note>) {
    if (!selectedNoteId) return;

    setNotes((current) =>
      current.map((note) =>
        note.id === selectedNoteId
          ? {
              ...note,
              ...updates,
              updatedAt: Date.now(),
            }
          : note
      )
    );
  }

  /* -------------------------------------------------------------------------- */
  /* DELETE NOTE                                                                  */
  /* -------------------------------------------------------------------------- */

  function deleteNote(id: string) {
    const confirmed = window.confirm(
      "Delete this note? This action cannot be undone."
    );

    if (!confirmed) return;

    setNotes((current) => current.filter((note) => note.id !== id));

    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* CREATE FOLDER                                                                */
  /* -------------------------------------------------------------------------- */

  function createFolder() {
    const name = folderName.trim();

    if (!name) return;

    const folder: NoteFolder = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
    };

    setFolders((current) => [...current, folder]);

    setFolderName("");
    setShowFolderModal(false);
    setSelectedFolderId(folder.id);
  }

  /* -------------------------------------------------------------------------- */
  /* RENAME FOLDER                                                                */
  /* -------------------------------------------------------------------------- */

  function beginRename(folder: NoteFolder) {
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
    setOpenFolderMenu(null);
  }

  function saveFolderRename() {
    if (!editingFolderId) return;

    const name = editingFolderName.trim();

    if (!name) {
      setEditingFolderId(null);
      return;
    }

    setFolders((current) =>
      current.map((folder) =>
        folder.id === editingFolderId
          ? {
              ...folder,
              name,
            }
          : folder
      )
    );

    setEditingFolderId(null);
    setEditingFolderName("");
  }

  /* -------------------------------------------------------------------------- */
  /* DELETE FOLDER                                                                */
  /* -------------------------------------------------------------------------- */

  function deleteFolder(folderId: string) {
    const folder = folders.find((item) => item.id === folderId);

    if (!folder) return;

    const confirmed = window.confirm(
      `Delete "${folder.name}"? Notes inside will be moved to All Notes.`
    );

    if (!confirmed) return;

    setFolders((current) =>
      current.filter((item) => item.id !== folderId)
    );

    setNotes((current) =>
      current.map((note) =>
        note.folderId === folderId
          ? {
              ...note,
              folderId: null,
              updatedAt: Date.now(),
            }
          : note
      )
    );

    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }

    if (selectedNoteId) {
      const selected = notes.find(
        (note) => note.id === selectedNoteId
      );

      if (selected?.folderId === folderId) {
        setSelectedNoteId(null);
      }
    }

    setOpenFolderMenu(null);
  }

  /* -------------------------------------------------------------------------- */
  /* DRAG AND DROP                                                                */
  /* -------------------------------------------------------------------------- */

  function handleDragStart(
    event: React.DragEvent<HTMLDivElement>,
    noteId: string
  ) {
    setDraggedNoteId(noteId);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", noteId);
  }

  function handleDragEnd() {
    setDraggedNoteId(null);
    setDragOverFolderId(null);
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
    folderId: string | null
  ) {
    event.preventDefault();

    const noteId =
      draggedNoteId || event.dataTransfer.getData("text/plain");

    if (!noteId) return;

    setNotes((current) =>
      current.map((note) =>
        note.id === noteId
          ? {
              ...note,
              folderId,
              updatedAt: Date.now(),
            }
          : note
      )
    );

    setDragOverFolderId(null);
    setDraggedNoteId(null);
  }

  /* -------------------------------------------------------------------------- */
  /* HELPERS                                                                      */
  /* -------------------------------------------------------------------------- */

  function getFolderName(folderId: string | null) {
    if (!folderId) return "All Notes";

    return (
      folders.find((folder) => folder.id === folderId)?.name ??
      "All Notes"
    );
  }

  function formatDate(timestamp: number) {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  function getPreview(content: string) {
    const clean = content.replace(/\s+/g, " ").trim();

    if (!clean) {
      return "Start writing something...";
    }

    return clean.length > 110
      ? `${clean.slice(0, 110)}...`
      : clean;
  }

  /* -------------------------------------------------------------------------- */
  /* PAGE                                                                         */
  /* -------------------------------------------------------------------------- */

  return (
    /*
      IMPORTANT:
      This is intentionally fixed to the viewport.

      It prevents a parent layout/flex container from pushing the entire
      Notes page hundreds of pixels down.
    */
    <main className="fixed inset-0 z-0 overflow-y-auto overflow-x-hidden bg-[#070707] text-white">
      <FloatingSidebar />

      <div className="min-h-screen w-full pl-20 sm:pl-24">
        {/* ------------------------------------------------------------------ */}
        {/* HEADER                                                               */}
        {/* ------------------------------------------------------------------ */}

        <header className="w-full border-b border-white/[0.07] bg-[#070707]">
          <div className="px-6 py-5 lg:px-10">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-400/15 bg-purple-500/[0.09]">
                  <FileText className="h-5 w-5 text-purple-300" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-white">
                      Notes
                    </h1>

                    <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-purple-300">
                      Workspace
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-white/35">
                    Your personal knowledge base.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 sm:flex">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      saveState === "saved"
                        ? "bg-emerald-400"
                        : "animate-pulse bg-purple-400"
                    }`}
                  />

                  <span className="text-[11px] text-white/30">
                    {saveState === "saved"
                      ? "All changes saved"
                      : "Saving..."}
                  </span>
                </div>

                <button
                  onClick={() => createNote()}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/10 transition hover:from-purple-400 hover:to-fuchsia-400"
                >
                  <Plus className="h-4 w-4" />
                  New note
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ------------------------------------------------------------------ */}
        {/* CONTENT                                                              */}
        {/* ------------------------------------------------------------------ */}

        <div className="px-5 py-5 lg:px-8">
          {/* ---------------------------------------------------------------- */}
          {/* METRICS                                                           */}
          {/* ---------------------------------------------------------------- */}

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/[0.07] bg-[#14131a] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
                  Total Notes
                </span>

                <FileText className="h-4 w-4 text-purple-400/70" />
              </div>

              <p className="mt-3 text-2xl font-semibold text-white">
                {notes.length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#14131a] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
                  Folders
                </span>

                <Folder className="h-4 w-4 text-fuchsia-400/70" />
              </div>

              <p className="mt-3 text-2xl font-semibold text-white">
                {folders.length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#14131a] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
                  This Week
                </span>

                <Clock3 className="h-4 w-4 text-purple-400/70" />
              </div>

              <p className="mt-3 text-2xl font-semibold text-white">
                {recentNotes}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#14131a] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
                  Words
                </span>

                <Type className="h-4 w-4 text-fuchsia-400/70" />
              </div>

              <p className="mt-3 text-2xl font-semibold text-white">
                {totalWords.toLocaleString()}
              </p>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* INTELLIGENCE                                                       */}
          {/* ---------------------------------------------------------------- */}

          <div className="mt-4 overflow-hidden rounded-2xl border border-purple-400/15 bg-gradient-to-r from-purple-500/[0.09] via-fuchsia-500/[0.04] to-transparent">
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-500/[0.08]">
                <Sparkles className="h-5 w-5 text-purple-300" />
              </div>

              <div>
                <p className="text-sm font-medium text-white/75">
                  Monobloc Intelligence
                </p>

                <p className="mt-0.5 text-xs text-white/30">
                  Keep your ideas organized and ready for whatever
                  comes next.
                </p>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* NOTES WORKSPACE                                                    */}
          {/* ---------------------------------------------------------------- */}

          <div className="mt-4 grid min-h-[650px] overflow-hidden rounded-3xl border border-white/[0.07] bg-[#14131a] lg:grid-cols-[220px_300px_minmax(0,1fr)]">
            {/* ============================================================= */}
            {/* FOLDERS                                                         */}
            {/* ============================================================= */}

            <aside className="border-b border-white/[0.07] bg-[#100f15] p-3 lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                  Knowledge Base
                </span>

                <button
                  onClick={() => setShowFolderModal(true)}
                  className="rounded-lg p-1.5 text-white/25 transition hover:bg-purple-500/10 hover:text-purple-300"
                  title="Create folder"
                >
                  <FolderPlus className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2 space-y-1">
                {/* ALL NOTES */}

                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOverFolderId("all");
                  }}
                  onDragLeave={() => setDragOverFolderId(null)}
                  onDrop={(event) => handleDrop(event, null)}
                  onClick={() => setSelectedFolderId(null)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition ${
                    selectedFolderId === null
                      ? "bg-purple-500/10 text-purple-300"
                      : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
                  } ${
                    dragOverFolderId === "all"
                      ? "ring-1 ring-purple-400/40"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Archive className="h-4 w-4" />

                    <span className="text-sm">
                      All Notes
                    </span>
                  </div>

                  <span className="text-[10px] text-white/20">
                    {notes.length}
                  </span>
                </div>

                {/* FOLDER LABEL */}

                <div className="px-3 pb-1 pt-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
                  Folders
                </div>

                {/* FOLDERS */}

                {folders.map((folder) => {
                  const count = notes.filter(
                    (note) => note.folderId === folder.id
                  ).length;

                  const selected =
                    selectedFolderId === folder.id;

                  const dragOver =
                    dragOverFolderId === folder.id;

                  if (editingFolderId === folder.id) {
                    return (
                      <div
                        key={folder.id}
                        className="flex items-center gap-1 rounded-xl bg-white/[0.03] p-1"
                      >
                        <input
                          autoFocus
                          value={editingFolderName}
                          onChange={(event) =>
                            setEditingFolderName(
                              event.target.value
                            )
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              saveFolderRename();
                            }

                            if (event.key === "Escape") {
                              setEditingFolderId(null);
                            }
                          }}
                          className="min-w-0 flex-1 rounded-lg border border-purple-400/20 bg-black/20 px-2 py-1.5 text-xs text-white outline-none"
                        />

                        <button
                          onClick={saveFolderRename}
                          className="rounded-lg p-1.5 text-emerald-300 hover:bg-white/10"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() =>
                            setEditingFolderId(null)
                          }
                          className="rounded-lg p-1.5 text-white/30 hover:bg-white/10"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={folder.id}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setDragOverFolderId(folder.id);
                      }}
                      onDragLeave={() =>
                        setDragOverFolderId(null)
                      }
                      onDrop={(event) =>
                        handleDrop(event, folder.id)
                      }
                      className={`group relative rounded-xl transition ${
                        dragOver
                          ? "bg-purple-500/10 ring-1 ring-purple-400/40"
                          : ""
                      }`}
                    >
                      <button
                        onClick={() =>
                          setSelectedFolderId(folder.id)
                        }
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
                          selected
                            ? "bg-purple-500/10 text-purple-300"
                            : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          {selected ? (
                            <FolderOpen className="h-4 w-4 shrink-0" />
                          ) : (
                            <Folder className="h-4 w-4 shrink-0" />
                          )}

                          <span className="truncate text-sm">
                            {folder.name}
                          </span>
                        </span>

                        <span className="text-[10px] text-white/20">
                          {count}
                        </span>
                      </button>

                      <button
                        onClick={(event) => {
                          event.stopPropagation();

                          setOpenFolderMenu(
                            openFolderMenu === folder.id
                              ? null
                              : folder.id
                          );
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/20 opacity-0 transition group-hover:opacity-100 hover:bg-white/10 hover:text-white"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>

                      {openFolderMenu === folder.id && (
                        <div className="absolute right-1 top-10 z-50 w-32 overflow-hidden rounded-xl border border-white/10 bg-[#1b1924] p-1 shadow-2xl">
                          <button
                            onClick={() => beginRename(folder)}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-white/60 hover:bg-white/[0.06] hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Rename
                          </button>

                          <button
                            onClick={() =>
                              deleteFolder(folder.id)
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-red-300 hover:bg-red-400/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {folders.length === 0 && (
                  <button
                    onClick={() => setShowFolderModal(true)}
                    className="mt-2 flex w-full items-center gap-2 rounded-xl border border-dashed border-white/[0.08] px-3 py-3 text-left text-xs text-white/25 transition hover:border-purple-400/20 hover:text-purple-300"
                  >
                    <FolderPlus className="h-4 w-4" />
                    Create a folder
                  </button>
                )}
              </div>
            </aside>

            {/* ============================================================= */}
            {/* NOTE LIST                                                       */}
            {/* ============================================================= */}

            <section className="min-w-0 border-b border-white/[0.07] bg-[#17161e] lg:border-b-0 lg:border-r">
              <div className="border-b border-white/[0.07] p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search your notes..."
                    className="w-full rounded-xl border border-white/[0.07] bg-black/20 py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-white/20 focus:border-purple-400/25"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between px-1">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/20">
                    {getFolderName(selectedFolderId)}
                  </span>

                  <span className="text-[10px] text-white/20">
                    {filteredNotes.length}
                  </span>
                </div>
              </div>

              <div className="max-h-[590px] overflow-y-auto p-2">
                {filteredNotes.length === 0 ? (
                  <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                      <FileText className="h-5 w-5 text-white/20" />
                    </div>

                    <p className="mt-4 text-sm text-white/45">
                      No notes yet
                    </p>

                    <p className="mt-1 text-xs text-white/20">
                      Create a note to start building your
                      knowledge base.
                    </p>

                    <button
                      onClick={() =>
                        createNote(selectedFolderId)
                      }
                      className="mt-4 flex items-center gap-2 rounded-xl bg-purple-500/10 px-3 py-2 text-xs text-purple-300 ring-1 ring-purple-400/10 transition hover:bg-purple-500/15"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Create note
                    </button>
                  </div>
                ) : (
                  filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      draggable
                      onDragStart={(event) =>
                        handleDragStart(event, note.id)
                      }
                      onDragEnd={handleDragEnd}
                      onClick={() =>
                        setSelectedNoteId(note.id)
                      }
                      className={`group mb-1 cursor-grab rounded-2xl border p-3 transition active:cursor-grabbing ${
                        selectedNoteId === note.id
                          ? "border-purple-400/15 bg-purple-500/[0.07]"
                          : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.025]"
                      } ${
                        draggedNoteId === note.id
                          ? "scale-[0.98] opacity-40"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white/75">
                            {note.title.trim() ||
                              "Untitled note"}
                          </p>

                          <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-white/25">
                            {getPreview(note.content)}
                          </p>
                        </div>

                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteNote(note.id);
                          }}
                          className="rounded-lg p-1.5 text-white/15 opacity-0 transition hover:bg-red-400/10 hover:text-red-300 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[9px] text-white/15">
                          {formatDate(note.updatedAt)}
                        </span>

                        <span
                          className="max-w-[110px] truncate text-[9px] text-purple-300/35"
                          style={{
                            fontFamily: note.fontFamily,
                          }}
                        >
                          {note.fontFamily}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* ============================================================= */}
            {/* EDITOR                                                           */}
            {/* ============================================================= */}

            <section className="flex min-h-[650px] min-w-0 flex-col bg-[#14131a]">
              {selectedNote ? (
                <>
                  {/* TOOLBAR */}

                  <div className="flex flex-wrap items-center gap-1.5 border-b border-white/[0.07] bg-[#17161e] px-4 py-3">
                    {/* FONT */}

                    <div className="relative">
                      <select
                        value={selectedNote.fontFamily}
                        onChange={(event) =>
                          updateNote({
                            fontFamily:
                              event.target.value as FontFamily,
                          })
                        }
                        className="appearance-none rounded-lg border border-white/[0.07] bg-white/[0.025] py-2 pl-3 pr-8 text-[11px] text-white/55 outline-none transition hover:bg-white/[0.05] focus:border-purple-400/25"
                      >
                        {FONT_OPTIONS.map((font) => (
                          <option
                            key={font}
                            value={font}
                            className="bg-[#1b1924] text-white"
                          >
                            {font}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white/20" />
                    </div>

                    {/* FONT SIZE */}

                    <div className="relative">
                      <select
                        value={selectedNote.fontSize}
                        onChange={(event) =>
                          updateNote({
                            fontSize: Number(
                              event.target.value
                            ),
                          })
                        }
                        className="appearance-none rounded-lg border border-white/[0.07] bg-white/[0.025] py-2 pl-3 pr-7 text-[11px] text-white/55 outline-none focus:border-purple-400/25"
                      >
                        {FONT_SIZES.map((size) => (
                          <option
                            key={size}
                            value={size}
                            className="bg-[#1b1924] text-white"
                          >
                            {size}px
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-white/20" />
                    </div>

                    <div className="mx-1 h-5 w-px bg-white/[0.07]" />

                    {/* BOLD */}

                    <button
                      onClick={() =>
                        updateNote({
                          bold: !selectedNote.bold,
                        })
                      }
                      className={`rounded-lg p-2 transition ${
                        selectedNote.bold
                          ? "bg-purple-500/15 text-purple-300"
                          : "text-white/30 hover:bg-white/[0.05] hover:text-white/70"
                      }`}
                      title="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </button>

                    {/* ITALIC */}

                    <button
                      onClick={() =>
                        updateNote({
                          italic: !selectedNote.italic,
                        })
                      }
                      className={`rounded-lg p-2 transition ${
                        selectedNote.italic
                          ? "bg-purple-500/15 text-purple-300"
                          : "text-white/30 hover:bg-white/[0.05] hover:text-white/70"
                      }`}
                      title="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </button>

                    {/* UNDERLINE */}

                    <button
                      onClick={() =>
                        updateNote({
                          underline: !selectedNote.underline,
                        })
                      }
                      className={`rounded-lg p-2 transition ${
                        selectedNote.underline
                          ? "bg-purple-500/15 text-purple-300"
                          : "text-white/30 hover:bg-white/[0.05] hover:text-white/70"
                      }`}
                      title="Underline"
                    >
                      <Underline className="h-4 w-4" />
                    </button>

                    <div className="ml-auto flex items-center gap-2 text-[10px] text-white/20">
                      {selectedNote.folderId && (
                        <>
                          <Folder className="h-3 w-3" />

                          <span>
                            {getFolderName(
                              selectedNote.folderId
                            )}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* EDITOR BODY */}

                  <div className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-4xl px-6 py-8 lg:px-10 lg:py-10">
                      <input
                        value={selectedNote.title}
                        onChange={(event) =>
                          updateNote({
                            title: event.target.value,
                          })
                        }
                        placeholder="Untitled note"
                        className="w-full border-none bg-transparent text-3xl font-semibold tracking-tight text-white/90 outline-none placeholder:text-white/10"
                      />

                      <div className="mt-2 flex items-center gap-2 text-[10px] text-white/15">
                        <span>
                          Last edited{" "}
                          {formatDate(
                            selectedNote.updatedAt
                          )}
                        </span>

                        <span>•</span>

                        <span>
                          {selectedNote.content
                            .trim()
                            .split(/\s+/)
                            .filter(Boolean).length}{" "}
                          words
                        </span>
                      </div>

                      <textarea
                        value={selectedNote.content}
                        onChange={(event) =>
                          updateNote({
                            content: event.target.value,
                          })
                        }
                        placeholder="Start writing..."
                        spellCheck
                        style={{
                          fontFamily:
                            selectedNote.fontFamily,
                          fontSize: `${selectedNote.fontSize}px`,
                          fontWeight:
                            selectedNote.bold ? 700 : 400,
                          fontStyle:
                            selectedNote.italic
                              ? "italic"
                              : "normal",
                          textDecoration:
                            selectedNote.underline
                              ? "underline"
                              : "none",
                        }}
                        className="mt-8 min-h-[440px] w-full resize-none border-none bg-transparent leading-relaxed text-white/65 outline-none placeholder:text-white/10"
                      />
                    </div>
                  </div>

                  {/* EDITOR FOOTER */}

                  <div className="flex items-center justify-between border-t border-white/[0.07] bg-[#17161e] px-4 py-2.5 text-[9px] text-white/15">
                    <span>
                      {selectedNote.content.length} characters
                    </span>

                    <div className="flex items-center gap-2">
                      <span>
                        {selectedNote.fontFamily}
                      </span>

                      <span>•</span>

                      <span>
                        {selectedNote.fontSize}px
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-purple-400/10 bg-purple-500/[0.05]">
                    <FileText className="h-7 w-7 text-purple-300/50" />
                  </div>

                  <h2 className="mt-5 text-base font-medium text-white/55">
                    Select a note
                  </h2>

                  <p className="mt-2 max-w-sm text-xs leading-5 text-white/20">
                    Select a note from your knowledge base or
                    create a new one to start writing.
                  </p>

                  <button
                    onClick={() =>
                      createNote(selectedFolderId)
                    }
                    className="mt-5 flex items-center gap-2 rounded-xl bg-purple-500/10 px-4 py-2.5 text-xs font-medium text-purple-300 ring-1 ring-purple-400/10 transition hover:bg-purple-500/15"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New note
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* BOTTOM SYSTEM BAR                                                 */}
          {/* ---------------------------------------------------------------- */}

          <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-[#0e0e12] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10">
                <Sparkles className="h-3 w-3 text-purple-300" />
              </div>

              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/20">
                Notes System
              </span>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-white/15">
              <span>{notes.length} notes</span>

              <span>•</span>

              <span>{folders.length} folders</span>

              <span>•</span>

              <span>Local workspace</span>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* CREATE FOLDER MODAL                                                    */}
      {/* -------------------------------------------------------------------- */}

      {showFolderModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={() => setShowFolderModal(false)}
        >
          <div
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-md rounded-3xl border border-white/10 bg-[#17161e] p-6 shadow-2xl shadow-black/50"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10">
                    <FolderPlus className="h-4 w-4 text-purple-300" />
                  </div>

                  <h2 className="text-base font-semibold text-white/85">
                    Create folder
                  </h2>
                </div>

                <p className="mt-3 text-xs leading-5 text-white/25">
                  Organize your notes into a dedicated
                  workspace.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowFolderModal(false)
                }
                className="rounded-lg p-2 text-white/25 transition hover:bg-white/[0.05] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <input
              autoFocus
              value={folderName}
              onChange={(event) =>
                setFolderName(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  createFolder();
                }

                if (event.key === "Escape") {
                  setShowFolderModal(false);
                }
              }}
              placeholder="e.g. Startup Ideas"
              className="mt-6 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/15 focus:border-purple-400/30"
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() =>
                  setShowFolderModal(false)
                }
                className="rounded-xl px-4 py-2.5 text-xs text-white/35 transition hover:bg-white/[0.04] hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={createFolder}
                disabled={!folderName.trim()}
                className="rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:from-purple-400 hover:to-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Create folder
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
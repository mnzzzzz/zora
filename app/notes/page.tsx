"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import FloatingSidebar from "@/components/floatingsidebar";

import {
  Bold,
  Check,
  ChevronDown,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Italic,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
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

const defaultNote = (): Note => {
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    title: "",
    content: "",
    folderId: null,
    fontFamily: "Inter",
    fontSize: 16,
    bold: false,
    italic: false,
    underline: false,
    createdAt: now,
    updatedAt: now,
  };
};

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
  const [newFolderName, setNewFolderName] = useState("");

  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");

  const [openFolderMenu, setOpenFolderMenu] = useState<string | null>(null);

  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(
    null
  );

  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");

  // ------------------------------------------------------------
  // LOAD
  // ------------------------------------------------------------

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      const storedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);

      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);

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

      if (storedFolders) {
        const parsedFolders = JSON.parse(storedFolders);

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

  // ------------------------------------------------------------
  // SAVE NOTES
  // ------------------------------------------------------------

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
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [notes, isLoaded]);

  // ------------------------------------------------------------
  // SAVE FOLDERS
  // ------------------------------------------------------------

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
    } catch (error) {
      console.error("Failed to save folders:", error);
    }
  }, [folders, isLoaded]);

  // ------------------------------------------------------------
  // SELECTED NOTE
  // ------------------------------------------------------------

  const selectedNote = useMemo(() => {
    if (!selectedNoteId) return null;

    return notes.find((note) => note.id === selectedNoteId) ?? null;
  }, [notes, selectedNoteId]);

  // ------------------------------------------------------------
  // FILTERED NOTES
  // ------------------------------------------------------------

  const visibleNotes = useMemo(() => {
    let result = [...notes];

    if (selectedFolderId !== null) {
      result = result.filter((note) => note.folderId === selectedFolderId);
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

  // ------------------------------------------------------------
  // CREATE NOTE
  // ------------------------------------------------------------

  function createNote(folderId: string | null = selectedFolderId) {
    const note = defaultNote();

    note.folderId = folderId;

    setNotes((current) => [note, ...current]);
    setSelectedNoteId(note.id);
    setSelectedFolderId(folderId);
  }

  // ------------------------------------------------------------
  // UPDATE NOTE
  // ------------------------------------------------------------

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

  // ------------------------------------------------------------
  // DELETE NOTE
  // ------------------------------------------------------------

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

  // ------------------------------------------------------------
  // CREATE FOLDER
  // ------------------------------------------------------------

  function createFolder() {
    const name = newFolderName.trim();

    if (!name) return;

    const folder: NoteFolder = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
    };

    setFolders((current) => [...current, folder]);

    setNewFolderName("");
    setShowFolderModal(false);

    setSelectedFolderId(folder.id);
  }

  // ------------------------------------------------------------
  // RENAME FOLDER
  // ------------------------------------------------------------

  function startRenameFolder(folder: NoteFolder) {
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

  // ------------------------------------------------------------
  // DELETE FOLDER
  // ------------------------------------------------------------

  function deleteFolder(folderId: string) {
    const folder = folders.find((item) => item.id === folderId);

    if (!folder) return;

    const confirmed = window.confirm(
      `Delete the "${folder.name}" folder? Notes inside it will be moved to All Notes.`
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
      const currentNote = notes.find((note) => note.id === selectedNoteId);

      if (currentNote?.folderId === folderId) {
        setSelectedNoteId(null);
      }
    }

    setOpenFolderMenu(null);
  }

  // ------------------------------------------------------------
  // DRAG AND DROP
  // ------------------------------------------------------------

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

  function handleDropOnFolder(
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

    setSelectedFolderId(folderId);
    setDragOverFolderId(null);
    setDraggedNoteId(null);
  }

  // ------------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------------

  function getFolderName(folderId: string | null) {
    if (!folderId) return "All Notes";

    return (
      folders.find((folder) => folder.id === folderId)?.name ?? "All Notes"
    );
  }

  function formatDate(timestamp: number) {
    const date = new Date(timestamp);

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  function getPreview(content: string) {
    const clean = content.replace(/\s+/g, " ").trim();

    if (!clean) return "No content yet";

    return clean.length > 100 ? `${clean.slice(0, 100)}...` : clean;
  }

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <FloatingSidebar />

      <div className="min-h-screen pl-20 sm:pl-24">
        {/* HEADER */}

        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between px-6 lg:px-10">
            <div>
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-cyan-400" />

                <h1 className="text-xl font-semibold tracking-tight">
                  Notes
                </h1>
              </div>

              <p className="mt-1 text-sm text-white/40">
                Capture ideas, thoughts and everything in between.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/50 sm:flex">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    saveState === "saved"
                      ? "bg-emerald-400"
                      : "animate-pulse bg-amber-400"
                  }`}
                />

                {saveState === "saved" ? "Saved" : "Saving..."}
              </div>

              <button
                onClick={() => createNote()}
                className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                <Plus className="h-4 w-4" />
                New note
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <div className="grid min-h-[calc(100vh-5rem)] grid-cols-1 lg:grid-cols-[250px_320px_minmax(0,1fr)]">
          {/* SIDEBAR */}

          <aside className="border-r border-white/10 bg-white/[0.015] p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
                Workspace
              </span>

              <button
                onClick={() => setShowFolderModal(true)}
                className="rounded-lg p-2 text-white/40 transition hover:bg-white/10 hover:text-cyan-300"
                title="Create folder"
              >
                <FolderPlus className="h-4 w-4" />
              </button>
            </div>

            {/* ALL NOTES */}

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragOverFolderId("all");
              }}
              onDragLeave={() => setDragOverFolderId(null)}
              onDrop={(event) => handleDropOnFolder(event, null)}
              onClick={() => setSelectedFolderId(null)}
              className={`mb-1 flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition ${
                selectedFolderId === null
                  ? "bg-cyan-400/10 text-cyan-300"
                  : "text-white/55 hover:bg-white/5 hover:text-white"
              } ${
                dragOverFolderId === "all"
                  ? "ring-1 ring-cyan-400/60"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4" />

                <span className="text-sm font-medium">All Notes</span>
              </div>

              <span className="text-xs text-white/25">{notes.length}</span>
            </div>

            {/* FOLDERS */}

            <div className="mt-6">
              <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                Folders
              </div>

              <div className="space-y-1">
                {folders.map((folder) => {
                  const count = notes.filter(
                    (note) => note.folderId === folder.id
                  ).length;

                  const isSelected = selectedFolderId === folder.id;
                  const isDragOver = dragOverFolderId === folder.id;
                  const isEditing = editingFolderId === folder.id;

                  return (
                    <div
                      key={folder.id}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setDragOverFolderId(folder.id);
                      }}
                      onDragLeave={() => setDragOverFolderId(null)}
                      onDrop={(event) =>
                        handleDropOnFolder(event, folder.id)
                      }
                      className={`group relative rounded-xl transition ${
                        isDragOver
                          ? "bg-cyan-400/10 ring-1 ring-cyan-400/60"
                          : ""
                      }`}
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-2 px-2 py-1.5">
                          <input
                            autoFocus
                            value={editingFolderName}
                            onChange={(event) =>
                              setEditingFolderName(event.target.value)
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                saveFolderRename();
                              }

                              if (event.key === "Escape") {
                                setEditingFolderId(null);
                              }
                            }}
                            className="min-w-0 flex-1 rounded-lg border border-cyan-400/30 bg-white/5 px-2 py-1.5 text-sm text-white outline-none"
                          />

                          <button
                            onClick={saveFolderRename}
                            className="rounded-lg p-1.5 text-emerald-300 hover:bg-white/10"
                          >
                            <Check className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setEditingFolderId(null)}
                            className="rounded-lg p-1.5 text-white/40 hover:bg-white/10"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() =>
                            setSelectedFolderId(folder.id)
                          }
                          className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 ${
                            isSelected
                              ? "bg-cyan-400/10 text-cyan-300"
                              : "text-white/55 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {isSelected ? (
                              <FolderOpen className="h-4 w-4 shrink-0" />
                            ) : (
                              <Folder className="h-4 w-4 shrink-0" />
                            )}

                            <span className="truncate text-sm font-medium">
                              {folder.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-xs text-white/25">
                              {count}
                            </span>

                            <button
                              onClick={(event) => {
                                event.stopPropagation();

                                setOpenFolderMenu(
                                  openFolderMenu === folder.id
                                    ? null
                                    : folder.id
                                );
                              }}
                              className="rounded-md p-1 text-white/20 opacity-0 transition group-hover:opacity-100 hover:bg-white/10 hover:text-white"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {openFolderMenu === folder.id && !isEditing && (
                        <div className="absolute right-2 top-10 z-40 w-36 overflow-hidden rounded-xl border border-white/10 bg-[#0b1220] p-1 shadow-2xl">
                          <button
                            onClick={() => startRenameFolder(folder)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-white/70 hover:bg-white/10 hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Rename
                          </button>

                          <button
                            onClick={() => deleteFolder(folder.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-300 hover:bg-red-400/10"
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
                    className="mt-2 flex w-full items-center gap-2 rounded-xl border border-dashed border-white/10 px-3 py-3 text-left text-xs text-white/30 transition hover:border-cyan-400/30 hover:text-cyan-300"
                  >
                    <FolderPlus className="h-4 w-4" />
                    Create your first folder
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* NOTE LIST */}

          <section className="border-r border-white/10 bg-[#030a16]/60">
            <div className="border-b border-white/10 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search notes..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-400/30"
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-white/30">
                  {getFolderName(selectedFolderId)}
                </span>

                <span className="text-xs text-white/20">
                  {visibleNotes.length}{" "}
                  {visibleNotes.length === 1 ? "note" : "notes"}
                </span>
              </div>
            </div>

            <div className="max-h-[calc(100vh-9.8rem)] overflow-y-auto p-2">
              {visibleNotes.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <FileText className="h-6 w-6 text-white/20" />
                  </div>

                  <h3 className="text-sm font-medium text-white/60">
                    No notes here
                  </h3>

                  <p className="mt-1 max-w-[220px] text-xs leading-5 text-white/25">
                    Create a note and start writing.
                  </p>

                  <button
                    onClick={() => createNote(selectedFolderId)}
                    className="mt-4 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/15"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Create note
                  </button>
                </div>
              ) : (
                visibleNotes.map((note) => (
                  <div
                    key={note.id}
                    draggable
                    onDragStart={(event) =>
                      handleDragStart(event, note.id)
                    }
                    onDragEnd={handleDragEnd}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`group mb-1 cursor-grab rounded-xl border p-3 transition active:cursor-grabbing ${
                      selectedNoteId === note.id
                        ? "border-cyan-400/20 bg-cyan-400/[0.06]"
                        : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"
                    } ${
                      draggedNoteId === note.id
                        ? "scale-[0.98] opacity-40"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-medium text-white/85">
                          {note.title.trim() || "Untitled note"}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/30">
                          {getPreview(note.content)}
                        </p>
                      </div>

                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="rounded-lg p-1.5 text-white/20 opacity-0 transition hover:bg-red-400/10 hover:text-red-300 group-hover:opacity-100"
                        title="Delete note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px] text-white/20">
                      <span>{formatDate(note.updatedAt)}</span>

                      <span
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

          {/* EDITOR */}

          <section className="flex min-h-[calc(100vh-5rem)] min-w-0 flex-col bg-[#020711]">
            {selectedNote ? (
              <>
                {/* EDITOR TOOLBAR */}

                <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-5 py-3">
                  {/* FONT */}

                  <div className="relative flex items-center">
                    <Type className="pointer-events-none absolute left-3 h-4 w-4 text-white/30" />

                    <select
                      value={selectedNote.fontFamily}
                      onChange={(event) =>
                        updateNote({
                          fontFamily: event.target.value as FontFamily,
                        })
                      }
                      className="appearance-none rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-9 text-xs text-white/70 outline-none transition hover:bg-white/[0.06] focus:border-cyan-400/30"
                    >
                      {FONT_OPTIONS.map((font) => (
                        <option
                          key={font}
                          value={font}
                          className="bg-[#0b1220] text-white"
                        >
                          {font}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-white/25" />
                  </div>

                  {/* FONT SIZE */}

                  <div className="relative">
                    <select
                      value={selectedNote.fontSize}
                      onChange={(event) =>
                        updateNote({
                          fontSize: Number(event.target.value),
                        })
                      }
                      className="appearance-none rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 pr-8 text-xs text-white/70 outline-none transition hover:bg-white/[0.06] focus:border-cyan-400/30"
                    >
                      {FONT_SIZES.map((size) => (
                        <option
                          key={size}
                          value={size}
                          className="bg-[#0b1220] text-white"
                        >
                          {size}px
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />
                  </div>

                  <div className="mx-1 h-6 w-px bg-white/10" />

                  {/* BOLD */}

                  <button
                    onClick={() =>
                      updateNote({
                        bold: !selectedNote.bold,
                      })
                    }
                    className={`rounded-lg p-2 transition ${
                      selectedNote.bold
                        ? "bg-cyan-400/15 text-cyan-300"
                        : "text-white/40 hover:bg-white/10 hover:text-white"
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
                        ? "bg-cyan-400/15 text-cyan-300"
                        : "text-white/40 hover:bg-white/10 hover:text-white"
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
                        ? "bg-cyan-400/15 text-cyan-300"
                        : "text-white/40 hover:bg-white/10 hover:text-white"
                    }`}
                    title="Underline"
                  >
                    <Underline className="h-4 w-4" />
                  </button>

                  <div className="ml-auto flex items-center gap-2 text-xs text-white/25">
                    {selectedNote.folderId && (
                      <>
                        <Folder className="h-3.5 w-3.5" />
                        <span>
                          {getFolderName(selectedNote.folderId)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* TITLE + CONTENT */}

                <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-12">
                  <div className="mx-auto max-w-4xl">
                    <input
                      value={selectedNote.title}
                      onChange={(event) =>
                        updateNote({
                          title: event.target.value,
                        })
                      }
                      placeholder="Untitled note"
                      className="mb-6 w-full border-none bg-transparent text-4xl font-semibold tracking-tight text-white outline-none placeholder:text-white/15"
                    />

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
                        fontFamily: selectedNote.fontFamily,
                        fontSize: `${selectedNote.fontSize}px`,
                        fontWeight: selectedNote.bold ? 700 : 400,
                        fontStyle: selectedNote.italic
                          ? "italic"
                          : "normal",
                        textDecoration: selectedNote.underline
                          ? "underline"
                          : "none",
                      }}
                      className="min-h-[60vh] w-full resize-none border-none bg-transparent leading-relaxed text-white/80 outline-none placeholder:text-white/15"
                    />
                  </div>
                </div>

                {/* FOOTER */}

                <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-[11px] text-white/20">
                  <div>
                    {selectedNote.content.length} characters
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="hidden sm:inline"
                      style={{
                        fontFamily: selectedNote.fontFamily,
                      }}
                    >
                      {selectedNote.fontFamily}
                    </span>

                    <span>•</span>

                    <span>{selectedNote.fontSize}px</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="mb-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <FileText className="h-8 w-8 text-cyan-400/60" />
                </div>

                <h2 className="text-lg font-medium text-white/70">
                  Select a note
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-white/30">
                  Choose an existing note from the list or create a new
                  one to start writing.
                </p>

                <button
                  onClick={() => createNote()}
                  className="mt-6 flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  <Plus className="h-4 w-4" />
                  New note
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* CREATE FOLDER MODAL */}

      {showFolderModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={() => setShowFolderModal(false)}
        >
          <div
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#08111f] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Create folder
                </h2>

                <p className="mt-1 text-sm text-white/35">
                  Organize your notes into folders.
                </p>
              </div>

              <button
                onClick={() => setShowFolderModal(false)}
                className="rounded-lg p-2 text-white/30 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <input
              autoFocus
              value={newFolderName}
              onChange={(event) => setNewFolderName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  createFolder();
                }
              }}
              placeholder="Folder name"
              className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/40"
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowFolderModal(false)}
                className="rounded-xl px-4 py-2.5 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={createFolder}
                disabled={!newFolderName.trim()}
                className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
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
"use client";

import {
  Brain,
  Search,
  Plus,
  Trash2,
  Pin,
  PinOff,
  Save,
  X,
  Command,
  Sparkles,
  FileText,
  Clock3,
  ChevronRight,
  Cpu,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import FloatingSidebar from "@/components/floatingsidebar";

type Note = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function NotesPage() {
  const searchRef = useRef<HTMLInputElement>(null);

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");

  const [saved, setSaved] = useState(false);

  /* =========================================
     LOAD NOTES
  ========================================= */

  useEffect(() => {
    const stored = localStorage.getItem("zora-notes");

    if (!stored) {
      setNotes([]);
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setNotes(parsed);
      }
    } catch {
      setNotes([]);
    }
  }, []);

  /* =========================================
     SAVE NOTES TO STORAGE
  ========================================= */

  useEffect(() => {
    localStorage.setItem("zora-notes", JSON.stringify(notes));
  }, [notes]);

  /* =========================================
     KEYBOARD SHORTCUTS
  ========================================= */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const modifier = event.ctrlKey || event.metaKey;

      if (modifier && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (modifier && event.key.toLowerCase() === "s") {
        event.preventDefault();

        if (selectedId) {
          saveCurrentNote();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  /* =========================================
     SELECTED NOTE
  ========================================= */

  const selectedNote = notes.find(
    (note) => note.id === selectedId
  );

  /* =========================================
     FILTER NOTES
  ========================================= */

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return [...notes].sort(
        (a, b) =>
          Number(b.pinned) - Number(a.pinned) ||
          new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
      );
    }

    return notes
      .filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
      );
  }, [notes, search]);

  /* =========================================
     CREATE NOTE
  ========================================= */

  const createNote = () => {
    const now = new Date().toISOString();

    const note: Note = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      pinned: false,
      createdAt: now,
      updatedAt: now,
    };

    setNotes((current) => [note, ...current]);
    setSelectedId(note.id);

    setEditingTitle("");
    setEditingContent("");

    setSearch("");
  };

  /* =========================================
     OPEN NOTE
  ========================================= */

  const openNote = (note: Note) => {
    setSelectedId(note.id);
    setEditingTitle(note.title);
    setEditingContent(note.content);
    setSaved(false);
  };

  /* =========================================
     SAVE CURRENT NOTE
  ========================================= */

  const saveCurrentNote = () => {
    if (!selectedId) return;

    const now = new Date().toISOString();

    setNotes((current) =>
      current.map((note) =>
        note.id === selectedId
          ? {
              ...note,
              title: editingTitle,
              content: editingContent,
              updatedAt: now,
            }
          : note
      )
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 1500);
  };

  /* =========================================
     DELETE NOTE
  ========================================= */

  const deleteNote = (id: string) => {
    setNotes((current) =>
      current.filter((note) => note.id !== id)
    );

    if (selectedId === id) {
      setSelectedId(null);
      setEditingTitle("");
      setEditingContent("");
    }
  };

  /* =========================================
     PIN NOTE
  ========================================= */

  const togglePin = (id: string) => {
    setNotes((current) =>
      current.map((note) =>
        note.id === id
          ? {
              ...note,
              pinned: !note.pinned,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );
  };

  /* =========================================
     CLOSE EDITOR
  ========================================= */

  const closeEditor = () => {
    setSelectedId(null);
    setEditingTitle("");
    setEditingContent("");
    setSaved(false);
  };

  /* =========================================
     FORMAT DATE
  ========================================= */

  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (value: string) => {
    return new Date(value).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =========================================
     MAIN UI
  ========================================= */

  return (
    <div className="relative min-h-screen bg-[#050b16] text-white">

      {/* =========================================
          EXISTING ZORA FLOATING SIDEBAR
      ========================================= */}

      <FloatingSidebar />

      {/* =========================================
          PAGE CONTENT
          
          ml-24 creates the permanent safe zone
          for the floating sidebar.
      ========================================= */}

      <main className="relative min-h-screen overflow-hidden px-5 py-6 md:ml-24 md:px-8">

        {/* =========================================
            AMBIENT JARVIS BACKGROUND
        ========================================= */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">

          <div className="absolute left-[8%] top-[10%] h-72 w-72 rounded-full bg-cyan-500/10 blur-[130px]" />

          <div className="absolute right-[5%] top-[20%] h-96 w-96 rounded-full bg-blue-600/10 blur-[150px]" />

          <div className="absolute bottom-[0%] left-[35%] h-80 w-80 rounded-full bg-violet-600/10 blur-[150px]" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

        </div>

        {/* =========================================
            CONTENT
        ========================================= */}

        <div className="relative z-10 mx-auto max-w-[1500px]">

          {/* =========================================
              HEADER
          ========================================= */}

          <header className="mb-6 overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1525]/80 backdrop-blur-2xl">

            <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="mb-3 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,.08)]">

                    <Brain
                      size={22}
                      className="text-cyan-300"
                    />

                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
                      ZORA / MEMORY CORE
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Personal knowledge system
                    </p>

                  </div>

                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Notes
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Capture ideas. Store thoughts. Build your second brain.
                </p>

              </div>

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-full items-center rounded-2xl border border-white/10 bg-white/[0.035] px-4 transition focus-within:border-cyan-400/30 lg:w-[300px]">

                  <Search
                    size={18}
                    className="mr-3 shrink-0 text-slate-500"
                  />

                  <input
                    ref={searchRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search memory..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />

                  <kbd className="hidden rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-600 md:block">
                    ⌘K
                  </kbd>

                </div>

                <button
                  onClick={createNote}
                  className="flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 text-sm font-bold text-white shadow-[0_0_30px_rgba(34,211,238,.12)] transition hover:scale-[1.02]"
                >
                  <Plus size={18} />

                  <span className="hidden sm:inline">
                    New note
                  </span>
                </button>

              </div>

            </div>

            <div className="flex items-center gap-2 border-t border-white/10 px-6 py-3 text-xs text-slate-600">

              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,.8)]" />

              Memory core online

              <span className="ml-auto font-mono">
                {notes.length}{" "}
                {notes.length === 1 ? "ENTRY" : "ENTRIES"}
              </span>

            </div>

          </header>

          {/* =========================================
              COMMAND PANEL
          ========================================= */}

          <section className="mb-6 rounded-[26px] border border-cyan-400/10 bg-gradient-to-r from-cyan-400/[0.06] via-blue-500/[0.04] to-transparent p-5 backdrop-blur-xl">

            <div className="flex flex-col gap-4 md:flex-row md:items-center">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">

                <Sparkles
                  size={20}
                  className="text-cyan-300"
                />

              </div>

              <div className="flex-1">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Zora Memory
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Your notes stay inside your Zora workspace.
                  Nothing is invented or preloaded.
                </p>

              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600">

                <Cpu size={15} />

                LOCAL WORKSPACE

              </div>

            </div>

          </section>

          {/* =========================================
              MAIN WORKSPACE
          ========================================= */}

          <div className="grid min-h-[600px] gap-6 xl:grid-cols-[360px_1fr]">

            {/* =======================================
                NOTES LIST
            ======================================= */}

            <aside className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1525]/80 backdrop-blur-2xl">

              <div className="border-b border-white/10 px-6 py-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
                      Archive
                    </p>

                    <h2 className="mt-1 text-lg font-bold">
                      Your notes
                    </h2>

                  </div>

                  <FileText
                    size={19}
                    className="text-slate-600"
                  />

                </div>

              </div>

              <div className="max-h-[620px] overflow-y-auto p-3">

                {filteredNotes.length === 0 ? (

                  <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">

                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">

                      <Brain
                        size={27}
                        className="text-slate-700"
                      />

                    </div>

                    <p className="text-sm font-semibold text-slate-400">
                      {search
                        ? "No memories found"
                        : "Memory core is empty"}
                    </p>

                    <p className="mt-2 max-w-[240px] text-xs leading-5 text-slate-600">

                      {search
                        ? "Try a different search query."
                        : "Create your first note and give Zora something to remember."}

                    </p>

                    {!search && (
                      <button
                        onClick={createNote}
                        className="mt-5 flex items-center gap-2 rounded-xl bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
                      >
                        <Plus size={14} />
                        Create first note
                      </button>
                    )}

                  </div>

                ) : (

                  <div className="space-y-2">

                    {filteredNotes.map((note) => {

                      const active = note.id === selectedId;

                      return (
                        <button
                          key={note.id}
                          onClick={() => openNote(note)}
                          className={`group w-full rounded-2xl border p-4 text-left transition ${
                            active
                              ? "border-cyan-400/20 bg-cyan-400/[0.08]"
                              : "border-transparent bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                          }`}
                        >

                          <div className="flex items-start gap-3">

                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">

                              {note.pinned ? (
                                <Pin
                                  size={15}
                                  className="text-cyan-300"
                                />
                              ) : (
                                <FileText
                                  size={15}
                                  className="text-slate-600"
                                />
                              )}

                            </div>

                            <div className="min-w-0 flex-1">

                              <p className="truncate text-sm font-semibold text-slate-200">

                                {note.title.trim() ||
                                  "Untitled memory"}

                              </p>

                              <p className="mt-1 truncate text-xs text-slate-600">

                                {note.content.trim() ||
                                  "Empty note"}

                              </p>

                              <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-700">

                                {formatDate(note.updatedAt)}

                              </p>

                            </div>

                            <ChevronRight
                              size={15}
                              className={`mt-1 transition ${
                                active
                                  ? "text-cyan-400"
                                  : "text-slate-800 group-hover:text-slate-500"
                              }`}
                            />

                          </div>

                        </button>
                      );
                    })}

                  </div>

                )}

              </div>

            </aside>

            {/* =======================================
                EDITOR
            ======================================= */}

            <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1525]/80 backdrop-blur-2xl">

              {!selectedNote ? (

                <div className="flex min-h-[620px] flex-col items-center justify-center px-6 text-center">

                  <div className="relative mb-7">

                    <div className="absolute inset-0 rounded-3xl bg-cyan-400/10 blur-2xl" />

                    <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.05]">

                      <Brain
                        size={34}
                        className="text-cyan-300"
                      />

                    </div>

                  </div>

                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
                    Memory interface
                  </p>

                  <h2 className="mt-3 text-2xl font-bold">
                    Select a memory
                  </h2>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Choose a note from your archive or create
                    something new. Your workspace starts with
                    nothing until you put something in it.
                  </p>

                  <button
                    onClick={createNote}
                    className="mt-7 flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-bold"
                  >
                    <Plus size={17} />
                    Create note
                  </button>

                </div>

              ) : (

                <div className="flex min-h-[620px] flex-col">

                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">

                        <FileText
                          size={16}
                          className="text-cyan-300"
                        />

                      </div>

                      <div>

                        <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
                          Editing memory
                        </p>

                        <p className="text-xs text-slate-500">
                          Updated{" "}
                          {formatTime(selectedNote.updatedAt)}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-2">

                      <button
                        onClick={() =>
                          togglePin(selectedNote.id)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-500 transition hover:text-cyan-300"
                        title={
                          selectedNote.pinned
                            ? "Unpin note"
                            : "Pin note"
                        }
                      >
                        {selectedNote.pinned ? (
                          <PinOff size={16} />
                        ) : (
                          <Pin size={16} />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          deleteNote(selectedNote.id)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-500 transition hover:border-red-400/20 hover:text-red-400"
                        title="Delete note"
                      >
                        <Trash2 size={16} />
                      </button>

                      <button
                        onClick={closeEditor}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-500 transition hover:text-white"
                      >
                        <X size={16} />
                      </button>

                    </div>

                  </div>

                  <div className="px-7 pt-8">

                    <input
                      value={editingTitle}
                      onChange={(e) =>
                        setEditingTitle(e.target.value)
                      }
                      placeholder="Untitled memory"
                      className="w-full bg-transparent text-3xl font-bold tracking-tight text-white outline-none placeholder:text-slate-700 md:text-4xl"
                    />

                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">

                      <Clock3 size={13} />

                      Created{" "}
                      {formatDate(selectedNote.createdAt)}

                    </div>

                  </div>

                  <div className="flex-1 px-7 py-7">

                    <textarea
                      value={editingContent}
                      onChange={(e) =>
                        setEditingContent(e.target.value)
                      }
                      placeholder="Start writing..."
                      className="h-full min-h-[350px] w-full resize-none bg-transparent text-[15px] leading-8 text-slate-300 outline-none placeholder:text-slate-700"
                    />

                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-7 py-4">

                    <div className="flex items-center gap-2 text-xs text-slate-600">

                      <Command size={13} />

                      <span>
                        Ctrl/Cmd + S to save
                      </span>

                    </div>

                    <button
                      onClick={saveCurrentNote}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                    >

                      {saved ? (
                        <>
                          <span>Saved</span>
                          <span className="text-xs">✓</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save memory
                        </>
                      )}

                    </button>

                  </div>

                </div>

              )}

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import FloatingSidebar from "@/components/floatingsidebar";

import {
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  FileText,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

type Note = {
  id: number;
  title: string;
  content: string;
};

const STORAGE_KEY = "polaris-notes";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] =
    useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  /*
   * LOAD NOTES
   */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        setNotes([]);
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setNotes(parsed);
      }
    } catch {
      setNotes([]);
    }
  }, []);

  /*
   * LIVE SYNC WITH OTHER Monobloc PAGES
   */
  useEffect(() => {
    const syncNotes = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
          setNotes([]);
          return;
        }

        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setNotes(parsed);
        }
      } catch {
        setNotes([]);
      }
    };

    window.addEventListener("storage", syncNotes);
    window.addEventListener("focus", syncNotes);

    return () => {
      window.removeEventListener("storage", syncNotes);
      window.removeEventListener("focus", syncNotes);
    };
  }, []);

  /*
   * SAVE NOTES
   */
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(notes)
    );
  }, [notes]);

  /*
   * FILTER
   */
  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }, [notes, search]);

  /*
   * SELECTED NOTE
   */
  const selectedNote = notes.find(
    (note) => note.id === selectedNoteId
  );

  /*
   * NEW NOTE
   */
  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: "",
      content: "",
    };

    setNotes((current) => [
      newNote,
      ...current,
    ]);

    setSelectedNoteId(newNote.id);
    setTitle("");
    setContent("");
    setSearch("");
  };

  /*
   * SELECT NOTE
   */
  const selectNote = (note: Note) => {
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setShowDeleteConfirm(false);
  };

  /*
   * SAVE CURRENT NOTE
   */
  const saveNote = () => {
    if (!selectedNoteId) return;

    setIsSaving(true);

    setNotes((current) =>
      current.map((note) =>
        note.id === selectedNoteId
          ? {
              ...note,
              title:
                title.trim() || "Untitled Note",
              content,
            }
          : note
      )
    );

    window.setTimeout(() => {
      setIsSaving(false);
    }, 350);
  };

  /*
   * DELETE NOTE
   */
  const deleteCurrentNote = () => {
    if (!selectedNoteId) return;

    setNotes((current) =>
      current.filter(
        (note) => note.id !== selectedNoteId
      )
    );

    setSelectedNoteId(null);
    setTitle("");
    setContent("");
    setShowDeleteConfirm(false);
  };

  /*
   * EMPTY EDITOR
   */
  const clearEditor = () => {
    setSelectedNoteId(null);
    setTitle("");
    setContent("");
    setShowDeleteConfirm(false);
  };

  /*
   * KEYBOARD SAVE
   */
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "s"
      ) {
        event.preventDefault();
        saveNote();
      }

      if (event.key === "Escape") {
        setShowDeleteConfirm(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  });

  return (
    <div className="relative min-h-screen bg-[#070707] p-4 font-sans text-white antialiased">
      <FloatingSidebar />

      {/* MAIN WORKSPACE */}
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[32px] border border-white/10 bg-[#14131a] p-8 pl-20 shadow-2xl sm:pl-24">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
                <FileText size={20} />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-purple-400">
                  Monobloc / NOTES
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Personal knowledge workspace
                </p>
              </div>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Notes
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Capture ideas, thoughts, plans, and everything worth remembering.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* NOTIFICATION */}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>

            {/* NEW NOTE */}
            <button
              type="button"
              onClick={createNewNote}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:opacity-90"
            >
              <Plus size={16} />
              New Note
            </button>

            {/* USER */}
            <div className="ml-1 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5 pr-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#17151f] text-[11px] font-semibold">
                  Z
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-white">
                  Monobloc User
                </p>

                <p className="text-[10px] text-slate-500">
                  user@Monobloc.app
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* =====================================================
            METRICS
        ===================================================== */}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<FileText size={16} />}
            label="Total Notes"
            value={String(notes.length)}
            subtext="Saved notes"
          />

          <MetricCard
            icon={<BookOpen size={16} />}
            label="Written"
            value={String(
              notes.filter(
                (note) => note.content.trim()
              ).length
            )}
            subtext="With content"
          />

          <MetricCard
            icon={<Sparkles size={16} />}
            label="Workspace"
            value={
              search
                ? String(filteredNotes.length)
                : String(notes.length)
            }
            subtext={
              search
                ? "Search results"
                : "Available notes"
            }
          />

          <MetricCard
            icon={<Check size={16} />}
            label="System"
            value="ON"
            subtext="Notes active"
          />
        </section>

        {/* =====================================================
            Monobloc INTELLIGENCE BANNER
        ===================================================== */}

        <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-r from-[#251f33] via-[#1b1924] to-[#181622] p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                  <Sparkles size={16} />
                </div>

                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Monobloc Intelligence
                </span>
              </div>

              <h2 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                Your thoughts. Organized.
              </h2>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
                Keep your ideas in one place and build your personal knowledge base without the clutter.
              </p>

              <div className="mt-5 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search your notes..."
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#14131a] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/50"
                  />
                </div>

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-500 transition hover:bg-white/10 hover:text-white"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* KNOWLEDGE SUMMARY */}
            <div className="min-w-[220px] lg:pr-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Knowledge Base
                </p>

                <BookOpen
                  size={15}
                  className="text-purple-400"
                />
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#14131a] p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {notes.length}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-500">
                      notes in workspace
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-purple-400">
                      {notes.length === 0
                        ? "0%"
                        : "ACTIVE"}
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-600">
                      status
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            MAIN NOTES WORKSPACE
        ===================================================== */}

        <div className="grid gap-6 xl:grid-cols-12">
          {/* =================================================
              NOTES LIST
          ================================================= */}

          <section className="min-h-[620px] rounded-3xl border border-white/5 bg-[#1b1924] xl:col-span-5">
            <div className="flex items-center justify-between border-b border-white/5 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <FileText
                    size={16}
                    className="text-purple-400"
                  />

                  <h2 className="text-sm font-semibold text-white">
                    All Notes
                  </h2>

                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-slate-500">
                    {filteredNotes.length}
                  </span>
                </div>

                <p className="mt-1 text-[10px] text-slate-600">
                  Your personal knowledge base
                </p>
              </div>

              <button
                type="button"
                onClick={createNewNote}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 transition hover:bg-purple-500/20"
                aria-label="Create note"
              >
                <Plus size={15} />
              </button>
            </div>

            <div className="max-h-[560px] overflow-y-auto">
              {filteredNotes.length === 0 ? (
                <div className="flex min-h-[500px] flex-col items-center justify-center px-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/5 bg-white/[0.03] text-slate-600">
                    <FileText size={27} />
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-slate-300">
                    {search
                      ? "No notes found"
                      : "Your workspace is empty"}
                  </h3>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-slate-600">
                    {search
                      ? "Try another search term."
                      : "Create your first note and start building your knowledge base."}
                  </p>

                  {!search && (
                    <button
                      type="button"
                      onClick={createNewNote}
                      className="mt-5 flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                    >
                      <Plus size={14} />
                      Create Note
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3">
                  {filteredNotes.map((note) => {
                    const isSelected =
                      selectedNoteId === note.id;

                    return (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() =>
                          selectNote(note)
                        }
                        className={`group relative mb-2 flex w-full gap-3 rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-purple-500/20 bg-purple-500/[0.07]"
                            : "border-white/5 bg-white/[0.015] hover:bg-white/[0.04]"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-purple-500" />
                        )}

                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isSelected
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-white/5 text-slate-500"
                          }`}
                        >
                          <FileText size={16} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`truncate text-xs font-semibold ${
                                isSelected
                                  ? "text-white"
                                  : "text-slate-300"
                              }`}
                            >
                              {note.title.trim() ||
                                "Untitled Note"}
                            </p>

                            <span className="shrink-0 text-[9px] text-slate-700">
                              #{note.id
                                .toString()
                                .slice(-4)}
                            </span>
                          </div>

                          <p className="mt-1.5 line-clamp-2 text-[10px] leading-5 text-slate-600">
                            {note.content.trim() ||
                              "Empty note"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              NOTE EDITOR
          ================================================= */}

          <section className="min-h-[620px] rounded-3xl border border-white/5 bg-[#1b1924] xl:col-span-7">
            {selectedNote ? (
              <>
                {/* EDITOR HEADER */}
                <div className="flex items-center justify-between border-b border-white/5 p-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                        <Sparkles size={14} />
                      </div>

                      <p className="text-sm font-semibold text-white">
                        Note Editor
                      </p>
                    </div>

                    <p className="mt-1 text-[10px] text-slate-600">
                      Changes are saved locally to your Monobloc workspace.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setShowDeleteConfirm(
                          true
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] text-slate-600 transition hover:bg-red-400/10 hover:text-red-400"
                      aria-label="Delete note"
                    >
                      <Trash2 size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={saveNote}
                      disabled={isSaving}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-[10px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2
                            size={13}
                            className="animate-spin"
                          />
                          Saving
                        </>
                      ) : (
                        <>
                          <Check size={13} />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* EDITOR */}
                <div className="p-6">
                  <input
                    value={title}
                    onChange={(event) =>
                      setTitle(event.target.value)
                    }
                    placeholder="Untitled Note"
                    className="w-full border-0 bg-transparent text-2xl font-semibold tracking-tight text-white outline-none placeholder:text-slate-700"
                  />

                  <div className="mt-3 flex items-center gap-3 text-[9px] uppercase tracking-[0.15em] text-slate-700">
                    <span>NOTE</span>

                    <span className="h-1 w-1 rounded-full bg-slate-700" />

                    <span>
                      {content.length} characters
                    </span>

                    <span className="h-1 w-1 rounded-full bg-slate-700" />

                    <span>
                      CTRL / ⌘ + S TO SAVE
                    </span>
                  </div>

                  <div className="my-6 h-px bg-white/5" />

                  <textarea
                    value={content}
                    onChange={(event) =>
                      setContent(event.target.value)
                    }
                    placeholder="Start writing..."
                    className="min-h-[430px] w-full resize-none border-0 bg-transparent text-sm leading-7 text-slate-300 outline-none placeholder:text-slate-700"
                  />

                  <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2 text-[10px] text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                      Local workspace
                    </div>

                    <Link
                      href="/ai-assistant"
                      className="flex items-center gap-2 text-[10px] font-semibold text-purple-400 transition hover:text-purple-300"
                    >
                      Ask Monobloc about this note
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* DELETE CONFIRMATION */}
                {showDeleteConfirm && (
                  <div className="border-t border-red-400/10 bg-red-400/[0.03] px-6 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold text-red-300">
                          Delete this note?
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          This action cannot be undone.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setShowDeleteConfirm(
                              false
                            )
                          }
                          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={
                            deleteCurrentNote
                          }
                          className="rounded-full bg-red-500/80 px-4 py-2 text-[10px] font-semibold text-white transition hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* EMPTY EDITOR */
              <div className="flex min-h-[620px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/5 bg-white/[0.025] text-slate-600">
                  <BookOpen size={30} />
                </div>

                <h2 className="mt-6 text-lg font-semibold text-white">
                  Select a note
                </h2>

                <p className="mt-2 max-w-sm text-xs leading-6 text-slate-600">
                  Choose a note from your workspace or create something new to start writing.
                </p>

                <button
                  type="button"
                  onClick={createNewNote}
                  className="mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                >
                  <Plus size={14} />
                  New Note
                </button>
              </div>
            )}
          </section>
        </div>

        {/* =====================================================
            BOTTOM SYSTEM BAR
        ===================================================== */}

        <section className="mt-6 rounded-3xl border border-white/5 bg-[#1b1924] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Sparkles size={16} />
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  Notes System
                </p>

                <p className="mt-0.5 text-[10px] text-slate-600">
                  Your knowledge workspace is operational.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <SystemBadge
                label="Storage"
                value="LOCAL"
              />

              <SystemBadge
                label="Notes"
                value={String(notes.length)}
              />

              <SystemBadge
                label="Monobloc"
                value="ONLINE"
              />

              <Link
                href="/ai-assistant"
                className="flex items-center gap-2 rounded-full border border-purple-500/10 bg-purple-500/[0.05] px-4 py-2 text-[10px] font-semibold text-purple-400 transition hover:bg-purple-500/10"
              >
                Open Monobloc AI
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#1b1924] p-4 transition hover:bg-white/5">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-300">
          {icon}
        </div>

        <span className="text-[10px] text-slate-500">
          {label}
        </span>
      </div>

      <p className="mt-3 text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] text-slate-400">
        {subtext}
      </p>
    </div>
  );
}

/* =========================================================
   SYSTEM BADGE
========================================================= */

function SystemBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2">
      <p className="text-[8px] uppercase tracking-[0.15em] text-slate-600">
        {label}
      </p>

      <p className="mt-0.5 font-mono text-[10px] font-semibold text-purple-400">
        {value}
      </p>
    </div>
  );
}
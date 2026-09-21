"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type DragEvent,
  type ReactNode,
} from "react";
import FloatingSidebar from "@/components/floatingsidebar";

import {
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  Loader2,
  MoreHorizontal,
  Pencil,
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
  folderId: number | null;
};

type NoteFolder = {
  id: number;
  name: string;
};

const STORAGE_KEY = "monobloc-notes";
const FOLDERS_STORAGE_KEY = "monobloc-note-folders";

const OLD_STORAGE_KEY = "polaris-notes";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<NoteFolder[]>([]);

  const [notesLoaded, setNotesLoaded] = useState(false);
  const [foldersLoaded, setFoldersLoaded] = useState(false);

  const [selectedNoteId, setSelectedNoteId] =
    useState<number | null>(null);

  const [selectedFolderId, setSelectedFolderId] =
    useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [search, setSearch] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [showNewFolderInput, setShowNewFolderInput] =
    useState(false);

  const [newFolderName, setNewFolderName] =
    useState("");

  const [editingFolderId, setEditingFolderId] =
    useState<number | null>(null);

  const [editingFolderName, setEditingFolderName] =
    useState("");

  const [openFolders, setOpenFolders] =
    useState<Record<number, boolean>>({});

  const [folderMenuId, setFolderMenuId] =
    useState<number | null>(null);

  const [draggedNoteId, setDraggedNoteId] =
    useState<number | null>(null);

  const [draggedFolderId, setDraggedFolderId] =
    useState<number | null>(null);

  const [dragOverFolderId, setDragOverFolderId] =
    useState<number | null>(null);

  /*
   * =========================================================
   * LOAD NOTES
   * =========================================================
   */

  useEffect(() => {
    try {
      let saved = localStorage.getItem(STORAGE_KEY);

      /*
       * Migrate old Polaris notes.
       */
      if (!saved) {
        const oldSaved =
          localStorage.getItem(OLD_STORAGE_KEY);

        if (oldSaved) {
          saved = oldSaved;
        }
      }

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          /*
           * Existing notes from the previous version
           * don't have folderId, so automatically add it.
           */
          const normalizedNotes: Note[] =
            parsed.map((note) => ({
              id: Number(note.id),
              title:
                typeof note.title === "string"
                  ? note.title
                  : "",
              content:
                typeof note.content === "string"
                  ? note.content
                  : "",
              folderId:
                typeof note.folderId === "number"
                  ? note.folderId
                  : null,
            }));

          setNotes(normalizedNotes);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load notes:",
        error
      );

      setNotes([]);
    } finally {
      setNotesLoaded(true);
    }
  }, []);

  /*
   * =========================================================
   * LOAD FOLDERS
   * =========================================================
   */

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        FOLDERS_STORAGE_KEY
      );

      if (!saved) {
        setFolders([]);
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setFolders(parsed);
      }
    } catch (error) {
      console.error(
        "Failed to load folders:",
        error
      );

      setFolders([]);
    } finally {
      setFoldersLoaded(true);
    }
  }, []);

  /*
   * =========================================================
   * SAVE NOTES
   * =========================================================
   */

  useEffect(() => {
    if (!notesLoaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notes)
      );
    } catch (error) {
      console.error(
        "Failed to save notes:",
        error
      );
    }
  }, [notes, notesLoaded]);

  /*
   * =========================================================
   * SAVE FOLDERS
   * =========================================================
   */

  useEffect(() => {
    if (!foldersLoaded) return;

    try {
      localStorage.setItem(
        FOLDERS_STORAGE_KEY,
        JSON.stringify(folders)
      );
    } catch (error) {
      console.error(
        "Failed to save folders:",
        error
      );
    }
  }, [folders, foldersLoaded]);

  /*
   * =========================================================
   * SELECTED NOTE
   * =========================================================
   */

  const selectedNote = notes.find(
    (note) => note.id === selectedNoteId
  );

  /*
   * =========================================================
   * SEARCH
   * =========================================================
   */

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = notes;

    /*
     * If a folder is selected, only show notes
     * belonging to that folder.
     */
    if (selectedFolderId !== null) {
      result = result.filter(
        (note) =>
          note.folderId === selectedFolderId
      );
    }

    if (!query) {
      return result;
    }

    return result.filter(
      (note) =>
        note.title
          .toLowerCase()
          .includes(query) ||
        note.content
          .toLowerCase()
          .includes(query)
    );
  }, [
    notes,
    search,
    selectedFolderId,
  ]);

  /*
   * =========================================================
   * CREATE NOTE
   * =========================================================
   */

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: "",
      content: "",
      folderId: selectedFolderId,
    };

    setNotes((current) => [
      newNote,
      ...current,
    ]);

    setSelectedNoteId(newNote.id);

    setTitle("");
    setContent("");

    setShowDeleteConfirm(false);

    /*
     * Automatically open the selected folder.
     */
    if (selectedFolderId !== null) {
      setOpenFolders((current) => ({
        ...current,
        [selectedFolderId]: true,
      }));
    }
  };

  /*
   * =========================================================
   * SELECT NOTE
   * =========================================================
   */

  const selectNote = (note: Note) => {
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setShowDeleteConfirm(false);
  };

  /*
   * =========================================================
   * UPDATE NOTE
   * =========================================================
   */

  const updateCurrentNote = (
    updates: Partial<Note>
  ) => {
    if (selectedNoteId === null) return;

    setNotes((current) =>
      current.map((note) =>
        note.id === selectedNoteId
          ? {
              ...note,
              ...updates,
            }
          : note
      )
    );
  };

  /*
   * =========================================================
   * AUTOSAVE TITLE
   * =========================================================
   */

  const handleTitleChange = (
    value: string
  ) => {
    setTitle(value);

    updateCurrentNote({
      title: value,
    });
  };

  /*
   * =========================================================
   * AUTOSAVE CONTENT
   * =========================================================
   */

  const handleContentChange = (
    value: string
  ) => {
    setContent(value);

    updateCurrentNote({
      content: value,
    });
  };

  /*
   * =========================================================
   * SAVE NOTE
   * =========================================================
   */

  const saveNote = () => {
    if (selectedNoteId === null) return;

    setIsSaving(true);

    setNotes((current) =>
      current.map((note) =>
        note.id === selectedNoteId
          ? {
              ...note,
              title:
                title.trim() ||
                "Untitled Note",
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
   * =========================================================
   * DELETE NOTE
   * =========================================================
   */

  const deleteCurrentNote = () => {
    if (selectedNoteId === null) return;

    setNotes((current) =>
      current.filter(
        (note) =>
          note.id !== selectedNoteId
      )
    );

    setSelectedNoteId(null);
    setTitle("");
    setContent("");
    setShowDeleteConfirm(false);
  };

  /*
   * =========================================================
   * CREATE FOLDER
   * =========================================================
   */

  const createFolder = () => {
    const trimmedName =
      newFolderName.trim();

    if (!trimmedName) return;

    const newFolder: NoteFolder = {
      id: Date.now(),
      name: trimmedName,
    };

    setFolders((current) => [
      ...current,
      newFolder,
    ]);

    setOpenFolders((current) => ({
      ...current,
      [newFolder.id]: true,
    }));

    setNewFolderName("");
    setShowNewFolderInput(false);

    /*
     * Automatically select the new folder.
     */
    setSelectedFolderId(newFolder.id);
  };

  /*
   * =========================================================
   * DELETE FOLDER
   * =========================================================
   */

  const deleteFolder = (
    folderId: number
  ) => {
    /*
     * Notes inside the deleted folder become
     * unsorted instead of being deleted.
     */
    setNotes((current) =>
      current.map((note) =>
        note.folderId === folderId
          ? {
              ...note,
              folderId: null,
            }
          : note
      )
    );

    setFolders((current) =>
      current.filter(
        (folder) =>
          folder.id !== folderId
      )
    );

    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }

    setFolderMenuId(null);
  };

  /*
   * =========================================================
   * START RENAME FOLDER
   * =========================================================
   */

  const startRenameFolder = (
    folder: NoteFolder
  ) => {
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
    setFolderMenuId(null);
  };

  /*
   * =========================================================
   * SAVE FOLDER NAME
   * =========================================================
   */

  const saveFolderName = () => {
    if (editingFolderId === null) {
      return;
    }

    const trimmedName =
      editingFolderName.trim();

    if (!trimmedName) {
      setEditingFolderId(null);
      setEditingFolderName("");
      return;
    }

    setFolders((current) =>
      current.map((folder) =>
        folder.id === editingFolderId
          ? {
              ...folder,
              name: trimmedName,
            }
          : folder
      )
    );

    setEditingFolderId(null);
    setEditingFolderName("");
  };

  /*
   * =========================================================
   * TOGGLE FOLDER
   * =========================================================
   */

  const toggleFolder = (
    folderId: number
  ) => {
    setOpenFolders((current) => ({
      ...current,
      [folderId]:
        current[folderId] === false
          ? true
          : false,
    }));
  };

  /*
   * =========================================================
   * SELECT FOLDER
   * =========================================================
   */

  const selectFolder = (
    folderId: number | null
  ) => {
    setSelectedFolderId(folderId);

    /*
     * If switching folders, close the editor
     * so the user doesn't accidentally edit a note
     * from another folder.
     */
    setSelectedNoteId(null);
    setTitle("");
    setContent("");
    setShowDeleteConfirm(false);
  };

  /*
   * =========================================================
   * MOVE NOTE TO FOLDER
   * =========================================================
   */

  const moveNoteToFolder = (
    noteId: number,
    folderId: number | null
  ) => {
    setNotes((current) =>
      current.map((note) =>
        note.id === noteId
          ? {
              ...note,
              folderId,
            }
          : note
      )
    );

    if (
      folderId !== null
    ) {
      setOpenFolders((current) => ({
        ...current,
        [folderId]: true,
      }));
    }

    setDragOverFolderId(null);
  };

  /*
   * =========================================================
   * DRAG NOTE START
   * =========================================================
   */

  const handleNoteDragStart = (
    event: DragEvent<HTMLButtonElement>,
    noteId: number
  ) => {
    setDraggedNoteId(noteId);
    setDraggedFolderId(null);

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      String(noteId)
    );
  };

  /*
   * =========================================================
   * DRAG NOTE END
   * =========================================================
   */

  const handleNoteDragEnd = () => {
    setDraggedNoteId(null);
    setDragOverFolderId(null);
  };

  /*
   * =========================================================
   * DRAG OVER FOLDER
   * =========================================================
   */

  const handleFolderDragOver = (
    event: DragEvent<HTMLDivElement>,
    folderId: number
  ) => {
    if (draggedNoteId === null) return;

    event.preventDefault();

    event.dataTransfer.dropEffect =
      "move";

    setDragOverFolderId(folderId);
  };

  /*
   * =========================================================
   * DROP NOTE INTO FOLDER
   * =========================================================
   */

  const handleFolderDrop = (
    event: DragEvent<HTMLDivElement>,
    folderId: number
  ) => {
    event.preventDefault();

    const noteId =
      draggedNoteId ??
      Number(
        event.dataTransfer.getData(
          "text/plain"
        )
      );

    if (!noteId) return;

    moveNoteToFolder(
      noteId,
      folderId
    );

    setDraggedNoteId(null);
  };

  /*
   * =========================================================
   * DRAG NOTE TO UNSORTED
   * =========================================================
   */

  const handleUnsortedDragOver = (
    event: DragEvent<HTMLButtonElement>
  ) => {
    if (draggedNoteId === null) return;

    event.preventDefault();

    event.dataTransfer.dropEffect =
      "move";

    setDragOverFolderId(-1);
  };

  const handleUnsortedDrop = (
    event: DragEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    const noteId =
      draggedNoteId ??
      Number(
        event.dataTransfer.getData(
          "text/plain"
        )
      );

    if (!noteId) return;

    moveNoteToFolder(
      noteId,
      null
    );

    setDraggedNoteId(null);
  };

  /*
   * =========================================================
   * KEYBOARD SHORTCUTS
   * =========================================================
   */

  useEffect(() => {
    const handleKeyboard = (
      event: KeyboardEvent
    ) => {
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === "s"
      ) {
        event.preventDefault();
        saveNote();
      }

      if (event.key === "Escape") {
        setShowDeleteConfirm(false);
        setFolderMenuId(null);
        setEditingFolderId(null);
        setShowNewFolderInput(false);
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

  /*
   * =========================================================
   * LIVE STORAGE SYNC
   * =========================================================
   */

  useEffect(() => {
    const syncWorkspace = () => {
      try {
        const savedNotes =
          localStorage.getItem(
            STORAGE_KEY
          );

        const savedFolders =
          localStorage.getItem(
            FOLDERS_STORAGE_KEY
          );

        if (savedNotes) {
          const parsedNotes =
            JSON.parse(savedNotes);

          if (
            Array.isArray(parsedNotes)
          ) {
            setNotes(
              parsedNotes.map(
                (note) => ({
                  id: Number(
                    note.id
                  ),
                  title:
                    typeof note.title ===
                    "string"
                      ? note.title
                      : "",
                  content:
                    typeof note.content ===
                    "string"
                      ? note.content
                      : "",
                  folderId:
                    typeof note.folderId ===
                    "number"
                      ? note.folderId
                      : null,
                })
              )
            );
          }
        }

        if (savedFolders) {
          const parsedFolders =
            JSON.parse(
              savedFolders
            );

          if (
            Array.isArray(
              parsedFolders
            )
          ) {
            setFolders(
              parsedFolders
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to sync workspace:",
          error
        );
      }
    };

    window.addEventListener(
      "storage",
      syncWorkspace
    );

    window.addEventListener(
      "focus",
      syncWorkspace
    );

    return () => {
      window.removeEventListener(
        "storage",
        syncWorkspace
      );

      window.removeEventListener(
        "focus",
        syncWorkspace
      );
    };
  }, []);

  /*
   * =========================================================
   * COUNTS
   * =========================================================
   */

  const unsortedNotesCount =
    notes.filter(
      (note) =>
        note.folderId === null
    ).length;

  const selectedFolder =
    folders.find(
      (folder) =>
        folder.id ===
        selectedFolderId
    );

  return (
    <div className="relative min-h-screen bg-[#070707] p-4 font-sans text-white antialiased">
      <FloatingSidebar />

      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[32px] border border-white/10 bg-[#14131a] p-8 pl-20 shadow-2xl sm:pl-24">

        {/* =================================================
            HEADER
        ================================================= */}

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
              Capture ideas, thoughts, plans,
              and everything worth remembering.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>

            <button
              type="button"
              onClick={() =>
                setShowNewFolderInput(
                  true
                )
              }
              className="flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-5 py-2.5 text-xs font-semibold text-purple-300 transition hover:bg-purple-500/20"
            >
              <Folder size={15} />
              New Folder
            </button>

            <button
              type="button"
              onClick={createNewNote}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:opacity-90"
            >
              <Plus size={16} />
              New Note
            </button>

            <div className="ml-1 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5 pr-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#17151f] text-[11px] font-semibold">
                  M
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-white">
                  Monobloc
                </p>

                <p className="text-[10px] text-slate-500">
                  Personal Workspace
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* =================================================
            NEW FOLDER BAR
        ================================================= */}

        {showNewFolderInput && (
          <section className="mb-6 rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#111017] px-4">
                <Folder
                  size={16}
                  className="shrink-0 text-purple-400"
                />

                <input
                  autoFocus
                  value={newFolderName}
                  onChange={(event) =>
                    setNewFolderName(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      createFolder();
                    }

                    if (
                      event.key ===
                      "Escape"
                    ) {
                      setShowNewFolderInput(
                        false
                      );
                      setNewFolderName(
                        ""
                      );
                    }
                  }}
                  placeholder="Folder name..."
                  className="h-11 w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
                />
              </div>

              <button
                type="button"
                onClick={createFolder}
                className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-xs font-semibold text-white"
              >
                Create Folder
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowNewFolderInput(
                    false
                  );
                  setNewFolderName("");
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </section>
        )}

        {/* =================================================
            METRICS
        ================================================= */}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <MetricCard
            icon={<FileText size={16} />}
            label="Total Notes"
            value={String(notes.length)}
            subtext="Saved notes"
          />

          <MetricCard
            icon={<Folder size={16} />}
            label="Folders"
            value={String(folders.length)}
            subtext="Organized spaces"
          />

          <MetricCard
            icon={<BookOpen size={16} />}
            label="Written"
            value={String(
              notes.filter(
                (note) =>
                  note.content.trim()
              ).length
            )}
            subtext="Notes with content"
          />

          <MetricCard
            icon={<Sparkles size={16} />}
            label="Workspace"
            value="ON"
            subtext="Local persistence"
          />
        </section>

        {/* =================================================
            INTELLIGENCE BANNER
        ================================================= */}

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
                Create folders, organize your
                notes, and build your personal
                knowledge base without the clutter.
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
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search your notes..."
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#14131a] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/50"
                  />
                </div>

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-500 transition hover:bg-white/10 hover:text-white"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

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
                      {folders.length}
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-600">
                      folders
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            MAIN WORKSPACE
        ================================================= */}

        <div className="grid gap-6 xl:grid-cols-12">

          {/* =================================================
              LEFT SIDEBAR
          ================================================= */}

          <section className="min-h-[620px] rounded-3xl border border-white/5 bg-[#1b1924] xl:col-span-5">

            <div className="border-b border-white/5 p-5">

              <div className="flex items-center justify-between">

                <div>
                  <div className="flex items-center gap-2">
                    <Folder
                      size={16}
                      className="text-purple-400"
                    />

                    <h2 className="text-sm font-semibold text-white">
                      Workspace
                    </h2>
                  </div>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Drag notes into folders
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowNewFolderInput(
                      true
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 transition hover:bg-purple-500/20"
                  aria-label="Create folder"
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* UNSORTED */}
              <button
                type="button"
                onClick={() =>
                  selectFolder(null)
                }
                onDragOver={
                  handleUnsortedDragOver
                }
                onDrop={
                  handleUnsortedDrop
                }
                className={`mt-5 flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                  selectedFolderId === null
                    ? "border-purple-500/20 bg-purple-500/[0.08]"
                    : dragOverFolderId ===
                      -1
                    ? "border-purple-400/40 bg-purple-500/10"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400">
                  <FileText size={15} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-200">
                    Unsorted
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-600">
                    Notes without a folder
                  </p>
                </div>

                <span className="rounded-full bg-white/5 px-2 py-1 text-[9px] text-slate-500">
                  {unsortedNotesCount}
                </span>
              </button>
            </div>

            {/* FOLDERS */}
            <div className="border-b border-white/5 p-3">

              {folders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-5 text-center">
                  <Folder
                    size={22}
                    className="mx-auto text-slate-700"
                  />

                  <p className="mt-3 text-xs font-medium text-slate-500">
                    No folders yet
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-slate-700">
                    Create a folder to organize
                    your notes.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {folders.map(
                    (folder) => {
                      const folderNotes =
                        notes.filter(
                          (note) =>
                            note.folderId ===
                            folder.id
                        );

                      const isOpen =
                        openFolders[
                          folder.id
                        ] !== false;

                      const isSelected =
                        selectedFolderId ===
                        folder.id;

                      const isDragOver =
                        dragOverFolderId ===
                        folder.id;

                      return (
                        <div
                          key={folder.id}
                          onDragOver={(
                            event
                          ) =>
                            handleFolderDragOver(
                              event,
                              folder.id
                            )
                          }
                          onDragLeave={() => {
                            if (
                              dragOverFolderId ===
                              folder.id
                            ) {
                              setDragOverFolderId(
                                null
                              );
                            }
                          }}
                          onDrop={(event) =>
                            handleFolderDrop(
                              event,
                              folder.id
                            )
                          }
                          className={`rounded-2xl border transition ${
                            isDragOver
                              ? "border-purple-400/60 bg-purple-500/10 shadow-lg shadow-purple-500/10"
                              : isSelected
                              ? "border-purple-500/20 bg-purple-500/[0.05]"
                              : "border-white/5 bg-white/[0.015]"
                          }`}
                        >
                          {/* FOLDER ROW */}
                          {editingFolderId ===
                          folder.id ? (
                            <div className="flex items-center gap-2 p-2">
                              <Folder
                                size={15}
                                className="ml-2 shrink-0 text-purple-400"
                              />

                              <input
                                autoFocus
                                value={
                                  editingFolderName
                                }
                                onChange={(
                                  event
                                ) =>
                                  setEditingFolderName(
                                    event.target
                                      .value
                                  )
                                }
                                onKeyDown={(
                                  event
                                ) => {
                                  if (
                                    event.key ===
                                    "Enter"
                                  ) {
                                    saveFolderName();
                                  }

                                  if (
                                    event.key ===
                                    "Escape"
                                  ) {
                                    setEditingFolderId(
                                      null
                                    );
                                  }
                                }}
                                className="h-8 min-w-0 flex-1 bg-transparent text-xs text-white outline-none"
                              />

                              <button
                                type="button"
                                onClick={
                                  saveFolderName
                                }
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400"
                              >
                                <Check
                                  size={13}
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setEditingFolderId(
                                    null
                                  )
                                }
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-slate-500"
                              >
                                <X
                                  size={13}
                                />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center">

                              <button
                                type="button"
                                onClick={() =>
                                  toggleFolder(
                                    folder.id
                                  )
                                }
                                className="flex h-11 w-9 items-center justify-center text-slate-600 hover:text-slate-300"
                              >
                                {isOpen ? (
                                  <ChevronDown
                                    size={14}
                                  />
                                ) : (
                                  <ChevronRight
                                    size={14}
                                  />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  selectFolder(
                                    folder.id
                                  )
                                }
                                className="flex min-w-0 flex-1 items-center gap-3 py-2 text-left"
                              >
                                <div
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                    isSelected ||
                                    isDragOver
                                      ? "bg-purple-500/15 text-purple-400"
                                      : "bg-white/5 text-slate-500"
                                  }`}
                                >
                                  {isOpen ? (
                                    <FolderOpen
                                      size={15}
                                    />
                                  ) : (
                                    <Folder
                                      size={15}
                                    />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-medium text-slate-300">
                                    {
                                      folder.name
                                    }
                                  </p>

                                  <p className="text-[9px] text-slate-600">
                                    {
                                      folderNotes.length
                                    }{" "}
                                    {folderNotes.length ===
                                    1
                                      ? "note"
                                      : "notes"}
                                  </p>
                                </div>
                              </button>

                              <div className="relative mr-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    setFolderMenuId(
                                      folderMenuId ===
                                        folder.id
                                        ? null
                                        : folder.id
                                    )
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white/5 hover:text-white"
                                  aria-label="Folder options"
                                >
                                  <MoreHorizontal
                                    size={15}
                                  />
                                </button>

                                {folderMenuId ===
                                  folder.id && (
                                  <div className="absolute right-0 top-9 z-30 w-36 overflow-hidden rounded-xl border border-white/10 bg-[#181720] p-1 shadow-2xl">

                                    <button
                                      type="button"
                                      onClick={() =>
                                        startRenameFolder(
                                          folder
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[10px] text-slate-400 hover:bg-white/5 hover:text-white"
                                    >
                                      <Pencil
                                        size={12}
                                      />
                                      Rename
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        deleteFolder(
                                          folder.id
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[10px] text-red-400 hover:bg-red-400/10"
                                    >
                                      <Trash2
                                        size={12}
                                      />
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* FOLDER NOTES */}
                          {isOpen &&
                            folderNotes.length >
                              0 && (
                              <div className="space-y-1 px-2 pb-2 pl-11">
                                {folderNotes.map(
                                  (note) => (
                                    <NoteListItem
                                      key={
                                        note.id
                                      }
                                      note={
                                        note
                                      }
                                      selected={
                                        selectedNoteId ===
                                        note.id
                                      }
                                      dragged={
                                        draggedNoteId ===
                                        note.id
                                      }
                                      onClick={() =>
                                        selectNote(
                                          note
                                        )
                                      }
                                      onDragStart={(
                                        event
                                      ) =>
                                        handleNoteDragStart(
                                          event,
                                          note.id
                                        )
                                      }
                                      onDragEnd={
                                        handleNoteDragEnd
                                      }
                                    />
                                  )
                                )}
                              </div>
                            )}

                          {isOpen &&
                            folderNotes.length ===
                              0 && (
                              <div className="px-4 pb-3 pl-12">
                                <p className="rounded-lg border border-dashed border-white/5 py-2 text-center text-[9px] text-slate-700">
                                  Drop notes here
                                </p>
                              </div>
                            )}
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* ALL NOTES */}
            <div className="max-h-[380px] overflow-y-auto">

              <div className="flex items-center justify-between border-b border-white/5 p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText
                      size={15}
                      className="text-purple-400"
                    />

                    <h2 className="text-sm font-semibold text-white">
                      {selectedFolder
                        ? selectedFolder.name
                        : "All Notes"}
                    </h2>

                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-slate-500">
                      {
                        filteredNotes.length
                      }
                    </span>
                  </div>

                  <p className="mt-1 text-[10px] text-slate-600">
                    {selectedFolder
                      ? "Notes in this folder"
                      : "Your personal knowledge base"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    createNewNote
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 transition hover:bg-purple-500/20"
                  aria-label="Create note"
                >
                  <Plus size={15} />
                </button>
              </div>

              <div className="p-3">

                {filteredNotes.length ===
                0 ? (
                  <div className="flex min-h-[250px] flex-col items-center justify-center px-8 text-center">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] text-slate-600">
                      <FileText
                        size={24}
                      />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-slate-300">
                      {search
                        ? "No notes found"
                        : selectedFolder
                        ? "Folder is empty"
                        : "No notes yet"}
                    </h3>

                    <p className="mt-2 max-w-xs text-[10px] leading-5 text-slate-600">
                      {search
                        ? "Try another search term."
                        : selectedFolder
                        ? "Drag notes here to organize them."
                        : "Create your first note to get started."}
                    </p>

                    {!search && (
                      <button
                        type="button"
                        onClick={
                          createNewNote
                        }
                        className="mt-4 flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-[10px] font-semibold text-white"
                      >
                        <Plus
                          size={13}
                        />
                        Create Note
                      </button>
                    )}
                  </div>
                ) : (
                  filteredNotes.map(
                    (note) => (
                      <NoteListItem
                        key={note.id}
                        note={note}
                        selected={
                          selectedNoteId ===
                          note.id
                        }
                        dragged={
                          draggedNoteId ===
                          note.id
                        }
                        onClick={() =>
                          selectNote(
                            note
                          )
                        }
                        onDragStart={(
                          event
                        ) =>
                          handleNoteDragStart(
                            event,
                            note.id
                          )
                        }
                        onDragEnd={
                          handleNoteDragEnd
                        }
                      />
                    )
                  )
                )}
              </div>
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
                        <Sparkles
                          size={14}
                        />
                      </div>

                      <p className="text-sm font-semibold text-white">
                        Note Editor
                      </p>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-600">
                      <span>
                        {selectedNote.folderId
                          ? folders.find(
                              (folder) =>
                                folder.id ===
                                selectedNote.folderId
                            )?.name ??
                            "Unknown folder"
                          : "Unsorted"}
                      </span>

                      <span className="h-1 w-1 rounded-full bg-slate-700" />

                      <span>
                        Auto-saved locally
                      </span>
                    </div>
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
                      <Trash2
                        size={15}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={
                        saveNote
                      }
                      disabled={
                        isSaving
                      }
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
                          <Check
                            size={13}
                          />
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
                      handleTitleChange(
                        event.target
                          .value
                      )
                    }
                    placeholder="Untitled Note"
                    className="w-full border-0 bg-transparent text-2xl font-semibold tracking-tight text-white outline-none placeholder:text-slate-700"
                  />

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[9px] uppercase tracking-[0.15em] text-slate-700">
                    <span>NOTE</span>

                    <span className="h-1 w-1 rounded-full bg-slate-700" />

                    <span>
                      {content.length}{" "}
                      characters
                    </span>

                    <span className="h-1 w-1 rounded-full bg-slate-700" />

                    <span>
                      CTRL / ⌘ + S
                    </span>
                  </div>

                  <div className="my-6 h-px bg-white/5" />

                  <textarea
                    value={content}
                    onChange={(event) =>
                      handleContentChange(
                        event.target
                          .value
                      )
                    }
                    placeholder="Start writing..."
                    className="min-h-[430px] w-full resize-none border-0 bg-transparent text-sm leading-7 text-slate-300 outline-none placeholder:text-slate-700"
                  />

                  <div className="mt-5 flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-2 text-[10px] text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                      Auto-saved locally
                    </div>

                    <Link
                      href="/ai-assistant"
                      className="flex items-center gap-2 text-[10px] font-semibold text-purple-400 transition hover:text-purple-300"
                    >
                      Ask Monobloc about this note
                      <ArrowRight
                        size={13}
                      />
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
                  Select a note or create
                  something new. You can drag
                  notes into folders whenever
                  you want to organize them.
                </p>

                <button
                  type="button"
                  onClick={
                    createNewNote
                  }
                  className="mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                >
                  <Plus size={14} />
                  New Note
                </button>
              </div>
            )}
          </section>
        </div>

        {/* =================================================
            BOTTOM SYSTEM BAR
        ================================================= */}

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
                  Your knowledge workspace is
                  operational.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">

              <SystemBadge
                label="Storage"
                value="LOCAL"
              />

              <SystemBadge
                label="Folders"
                value={String(
                  folders.length
                )}
              />

              <SystemBadge
                label="Notes"
                value={String(
                  notes.length
                )}
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
                <ArrowRight
                  size={13}
                />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


/* =========================================================
   NOTE LIST ITEM
========================================================= */

function NoteListItem({
  note,
  selected,
  dragged,
  onClick,
  onDragStart,
  onDragEnd,
}: {
  note: Note;
  selected: boolean;
  dragged: boolean;
  onClick: () => void;
  onDragStart: (
    event: DragEvent<HTMLButtonElement>
  ) => void;
  onDragEnd: () => void;
}) {
  return (
    <button
      type="button"
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group relative mb-2 flex w-full cursor-grab gap-3 rounded-xl border p-3 text-left transition active:cursor-grabbing ${
        dragged
          ? "scale-[0.98] border-purple-400/30 bg-purple-500/10 opacity-50"
          : selected
          ? "border-purple-500/20 bg-purple-500/[0.07]"
          : "border-white/5 bg-white/[0.015] hover:bg-white/[0.04]"
      }`}
    >
      {selected && (
        <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-purple-500" />
      )}

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          selected
            ? "bg-purple-500/10 text-purple-400"
            : "bg-white/5 text-slate-600"
        }`}
      >
        <FileText size={14} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-[11px] font-semibold ${
            selected
              ? "text-white"
              : "text-slate-300"
          }`}
        >
          {note.title.trim() ||
            "Untitled Note"}
        </p>

        <p className="mt-1 line-clamp-1 text-[9px] text-slate-600">
          {note.content.trim() ||
            "Empty note"}
        </p>
      </div>
    </button>
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
  icon: ReactNode;
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
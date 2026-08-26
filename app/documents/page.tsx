"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import dynamic from "next/dynamic";
import Link from "next/link";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Eraser,
  FileText,
  Highlighter,
  Minus,
  PenLine,
  Plus,
  RotateCcw,
  RotateCw,
  Save,
  StickyNote,
  Trash2,
  Upload,
} from "lucide-react";

import PdfAnnotationLayer, {
  Annotation,
  AnnotationType,
} from "@/components/PdfAnnotationLayer";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

/*
 * IMPORTANT:
 * react-pdf / pdf.js must NOT be imported normally at the top level.
 * pdf.js uses browser APIs such as DOMMatrix which don't exist
 * while Next.js is prerendering on Vercel.
 *
 * These components are therefore loaded only on the client.
 */
const PdfDocument = dynamic(
  () =>
    import("react-pdf").then(
      (module) => module.Document
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-white/10 bg-white/5 px-10 py-8 text-sm text-gray-400">
        Loading PDF viewer...
      </div>
    ),
  }
);

const PdfPage = dynamic(
  () =>
    import("react-pdf").then(
      (module) => module.Page
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-white/10 bg-white/5 px-10 py-8 text-sm text-gray-400">
        Loading page...
      </div>
    ),
  }
);

export default function DocumentsPage() {
  const [file, setFile] =
    useState<File | null>(null);

  const [fileUrl, setFileUrl] =
    useState<string | null>(null);

  const [numPages, setNumPages] =
    useState<number>(0);

  const [pageNumber, setPageNumber] =
    useState(1);

  const [scale, setScale] =
    useState(1);

  const [tool, setTool] = useState<
    AnnotationType | "select" | "eraser"
  >("select");

  const [color, setColor] =
    useState("#22d3ee");

  const [annotations, setAnnotations] =
    useState<Annotation[]>([]);

  const [history, setHistory] = useState<
    Annotation[][]
  >([]);

  const [historyIndex, setHistoryIndex] =
    useState(-1);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [pageSize, setPageSize] =
    useState({
      width: 800,
      height: 1100,
    });

  /*
   * This state confirms that react-pdf has been
   * initialized in the browser.
   */
  const [pdfReady, setPdfReady] =
    useState(false);

  /*
   * Initialize pdf.js ONLY in the browser.
   */
  useEffect(() => {
    let mounted = true;

    const initializePdf = async () => {
      try {
        const { pdfjs } =
          await import("react-pdf");

        pdfjs.GlobalWorkerOptions.workerSrc =
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

        if (mounted) {
          setPdfReady(true);
        }
      } catch (error) {
        console.error(
          "Failed to initialize PDF.js:",
          error
        );

        if (mounted) {
          setPdfReady(false);
        }
      }
    };

    initializePdf();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Clean up object URLs when the document changes
   * or the component unmounts.
   */
  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  const handleFile = (
    selectedFile: File
  ) => {
    if (
      selectedFile.type !==
      "application/pdf"
    ) {
      alert("Please select a PDF file.");
      return;
    }

    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    const url =
      URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setFileUrl(url);
    setPageNumber(1);
    setNumPages(0);
    setAnnotations([]);
    setHistory([]);
    setHistoryIndex(-1);
  };

  const handleFileInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected =
      event.target.files?.[0];

    if (selected) {
      handleFile(selected);
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    const dropped =
      event.dataTransfer.files?.[0];

    if (dropped) {
      handleFile(dropped);
    }
  };

  const updateAnnotations = (
    next: Annotation[]
  ) => {
    const currentSnapshot =
      [...annotations];

    const newHistory = [
      ...history.slice(
        0,
        historyIndex + 1
      ),
      currentSnapshot,
    ];

    setHistory(newHistory);

    setHistoryIndex(
      newHistory.length
    );

    setAnnotations(next);
  };

  const undo = () => {
    if (historyIndex < 0) return;

    const previous =
      history[historyIndex];

    setAnnotations(previous);

    setHistoryIndex(
      historyIndex - 1
    );
  };

  const redo = () => {
    const nextIndex =
      historyIndex + 1;

    if (
      nextIndex >= history.length
    ) {
      return;
    }

    setAnnotations(
      history[nextIndex]
    );

    setHistoryIndex(nextIndex);
  };

  const clearAnnotations = () => {
    if (
      annotations.length === 0
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Clear all annotations?"
      );

    if (!confirmed) return;

    updateAnnotations([]);
  };

  const saveAnnotations = () => {
    if (!file) return;

    const data = {
      fileName: file.name,
      savedAt:
        new Date().toISOString(),
      annotations,
    };

    localStorage.setItem(
      `zora-pdf-${file.name}`,
      JSON.stringify(data)
    );

    alert(
      "Your annotations have been saved."
    );
  };

  const downloadAnnotations = () => {
    if (!file) return;

    const data = {
      fileName: file.name,
      annotations,
    };

    const blob = new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;

    anchor.download =
      `${file.name}.annotations.json`;

    anchor.click();

    URL.revokeObjectURL(url);
  };

  const zoomIn = () => {
    setScale((value) =>
      Math.min(
        value + 0.1,
        2
      )
    );
  };

  const zoomOut = () => {
    setScale((value) =>
      Math.max(
        value - 0.1,
        0.5
      )
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent text-white">

      {/* Ambient glow */}

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[15%] top-[10%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[120px]" />

        <div className="absolute bottom-[5%] right-[10%] h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />
      </div>

      {/* Header */}

      <header className="relative z-20 flex h-[76px] items-center justify-between border-b border-white/10 bg-[#07111f]/80 px-6 backdrop-blur-2xl">

        <div className="flex items-center gap-4">

          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
              <FileText size={19} />
            </div>

            <div>

              <h1 className="font-semibold">
                PDF Workspace
              </h1>

              <p className="text-xs text-gray-500">
                {file
                  ? file.name
                  : "No document open"}
              </p>

            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={saveAnnotations}
            disabled={!file}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save size={16} />
            Save
          </button>

          <button
            onClick={downloadAnnotations}
            disabled={!file}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 text-sm font-semibold transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={16} />
            Export
          </button>

        </div>
      </header>

      {/* Toolbar */}

      <div className="relative z-20 flex items-center justify-between border-b border-white/10 bg-[#0a1422]/90 px-5 py-3 backdrop-blur-xl">

        <div className="flex items-center gap-2">

          <ToolButton
            active={tool === "select"}
            onClick={() =>
              setTool("select")
            }
            label="Select"
          >
            <span className="text-sm">
              ✋
            </span>
          </ToolButton>

          <ToolButton
            active={tool === "pen"}
            onClick={() =>
              setTool("pen")
            }
            label="Pen"
          >
            <PenLine size={17} />
          </ToolButton>

          <ToolButton
            active={
              tool === "highlight"
            }
            onClick={() =>
              setTool("highlight")
            }
            label="Highlight"
          >
            <Highlighter size={17} />
          </ToolButton>

          <ToolButton
            active={tool === "note"}
            onClick={() =>
              setTool("note")
            }
            label="Note"
          >
            <StickyNote size={17} />
          </ToolButton>

          <ToolButton
            active={tool === "eraser"}
            onClick={() =>
              setTool("eraser")
            }
            label="Eraser"
          >
            <Eraser size={17} />
          </ToolButton>

          <div className="mx-2 h-7 w-px bg-white/10" />

          <input
            type="color"
            value={color}
            onChange={(event) =>
              setColor(
                event.target.value
              )
            }
            className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent"
            title="Annotation color"
          />

          <div className="mx-2 h-7 w-px bg-white/10" />

          <button
            onClick={undo}
            disabled={
              historyIndex < 0
            }
            className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
            title="Undo"
          >
            <RotateCcw size={17} />
          </button>

          <button
            onClick={redo}
            disabled={
              historyIndex + 1 >=
              history.length
            }
            className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
            title="Redo"
          >
            <RotateCw size={17} />
          </button>

          <button
            onClick={
              clearAnnotations
            }
            disabled={
              annotations.length === 0
            }
            className="rounded-xl p-2 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
            title="Clear annotations"
          >
            <Trash2 size={17} />
          </button>

        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={zoomOut}
            className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <Minus size={17} />
          </button>

          <span className="min-w-[55px] text-center text-xs text-gray-400">
            {Math.round(
              scale * 100
            )}
            %
          </span>

          <button
            onClick={zoomIn}
            className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <Plus size={17} />
          </button>

        </div>
      </div>

      {/* Main */}

      <div
        className="relative z-10 flex min-h-[calc(100vh-133px)]"
        onDrop={handleDrop}
        onDragOver={(event) =>
          event.preventDefault()
        }
      >

        {/* Left sidebar */}

        <aside className="hidden w-[220px] shrink-0 border-r border-white/10 bg-[#07111f]/70 p-4 backdrop-blur-xl lg:block">

          <button
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-3 text-sm font-semibold transition hover:scale-[1.02]"
          >
            <Upload size={16} />
            Open PDF
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="mt-6">

            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
              Document
            </p>

            {file ? (
              <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-3">

                <FileText
                  size={18}
                  className="mb-2 text-cyan-400"
                />

                <p className="break-words text-xs text-gray-300">
                  {file.name}
                </p>

                <p className="mt-1 text-[11px] text-gray-600">
                  {numPages} pages
                </p>

              </div>
            ) : (
              <p className="text-xs leading-5 text-gray-600">
                Open a PDF to start working.
              </p>
            )}

          </div>
        </aside>

        {/* PDF area */}

        <section className="flex flex-1 items-center justify-center overflow-auto p-6">

          {!fileUrl ? (

            <div className="w-full max-w-xl">

              <div
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="cursor-pointer rounded-[32px] border border-dashed border-white/10 bg-white/[0.025] p-16 text-center transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.025]"
              >

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10">

                  <Upload
                    size={28}
                    className="text-cyan-400"
                  />

                </div>

                <h2 className="text-xl font-bold">
                  Drop your PDF here
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  or click to browse your files
                </p>

                <p className="mt-5 text-xs text-gray-700">
                  Your document is processed locally in
                  your browser.
                </p>

              </div>

            </div>

          ) : !pdfReady ? (

            <div className="rounded-2xl border border-white/10 bg-white/5 px-10 py-8 text-sm text-gray-400">
              Initializing PDF viewer...
            </div>

          ) : (

            <div className="flex flex-col items-center">

              <PdfDocument
                file={fileUrl}
                onLoadSuccess={({
                  numPages: pages,
                }: {
                  numPages: number;
                }) =>
                  setNumPages(pages)
                }
                loading={
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-10 py-8 text-sm text-gray-400">
                    Loading PDF...
                  </div>
                }
                error={
                  <div className="rounded-2xl border border-red-400/10 bg-red-400/5 px-10 py-8 text-sm text-red-300">
                    Unable to load this PDF.
                  </div>
                }
              >

                <div
                  className="relative overflow-hidden rounded-lg shadow-2xl"
                  style={{
                    width:
                      pageSize.width *
                      scale,
                    height:
                      pageSize.height *
                      scale,
                  }}
                >

                  <PdfPage
                    pageNumber={pageNumber}
                    scale={scale}
                    onLoadSuccess={(
                      page: any
                    ) => {

                      const viewport =
                        page.getViewport({
                          scale: 1,
                        });

                      setPageSize({
                        width:
                          viewport.width,
                        height:
                          viewport.height,
                      });

                    }}
                    renderTextLayer
                    renderAnnotationLayer
                  />

                  <PdfAnnotationLayer
                    page={pageNumber}
                    width={
                      pageSize.width *
                      scale
                    }
                    height={
                      pageSize.height *
                      scale
                    }
                    tool={tool}
                    color={color}
                    annotations={
                      annotations
                    }
                    onChange={
                      updateAnnotations
                    }
                  />

                </div>

              </PdfDocument>

            </div>
          )}

        </section>
      </div>

      {/* Bottom navigation */}

      {fileUrl && (
        <div className="fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1422]/90 px-3 py-2 shadow-2xl backdrop-blur-2xl">

          <button
            disabled={
              pageNumber <= 1
            }
            onClick={() =>
              setPageNumber(
                (value) =>
                  Math.max(
                    value - 1,
                    1
                  )
              )
            }
            className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="min-w-[90px] text-center text-xs text-gray-400">
            Page {pageNumber} /{" "}
            {numPages || "—"}
          </span>

          <button
            disabled={
              pageNumber >= numPages
            }
            onClick={() =>
              setPageNumber(
                (value) =>
                  Math.min(
                    value + 1,
                    numPages
                  )
              )
            }
            className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>

        </div>
      )}

    </main>
  );
}

function ToolButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={[
        "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition",
        active
          ? "bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20"
          : "text-gray-400 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {children}

      <span className="hidden xl:inline">
        {label}
      </span>
    </button>
  );
}
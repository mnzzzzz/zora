"use client";

import Link from "next/link";
import {
  FileText,
  ArrowRight,
  Upload,
  Highlighter,
  PenLine,
  StickyNote,
} from "lucide-react";

export default function DocumentsCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/70 p-6 shadow-2xl backdrop-blur-2xl">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/10">
            <FileText size={22} className="text-white" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              PDF Workspace
            </h2>

            <p className="text-sm text-gray-400">
              Read and annotate your documents
            </p>
          </div>
        </div>

        <Link
          href="/documents"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition hover:bg-cyan-400/10 hover:text-cyan-300"
        >
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Main preview */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]/80 p-5">
        <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.025] px-5 py-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10">
              <Upload size={24} className="text-cyan-400" />
            </div>

            <h3 className="font-semibold text-white">
              Open a PDF
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Upload a document and start annotating
            </p>

            <Link
              href="/documents"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02]"
            >
              Open Workspace
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
          <Highlighter size={17} className="mb-2 text-cyan-400" />
          <p className="text-xs font-medium text-white">
            Highlight
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
          <PenLine size={17} className="mb-2 text-blue-400" />
          <p className="text-xs font-medium text-white">
            Draw
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
          <StickyNote size={17} className="mb-2 text-violet-400" />
          <p className="text-xs font-medium text-white">
            Notes
          </p>
        </div>
      </div>

      {/* Footer */}
      <Link
        href="/documents"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/20 hover:bg-cyan-400/5"
      >
        Open PDF Workspace
        <ArrowRight size={16} />
      </Link>
    </section>
  );
}
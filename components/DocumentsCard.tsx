"use client";

import Link from "next/link";
import {
  FileText,
  ArrowRight,
  Upload,
  Highlighter,
  PenLine,
  StickyNote,
  ScanLine,
} from "lucide-react";

export default function DocumentsCard() {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0a0d12]/90 p-6 shadow-2xl backdrop-blur-xl">
      {/* SUBTLE BACKGROUND TEXTURE */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* SOFT AMBIENT LIGHT */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/[0.025] blur-[90px]" />

      <div className="relative">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white">
              <FileText size={21} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">
                Workspace
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
                Documents
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Read, review and annotate your files.
              </p>
            </div>
          </div>

          <Link
            href="/documents"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-500 transition duration-200 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            aria-label="Open documents"
          >
            <ArrowRight
              size={17}
              className="transition-transform duration-200 hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* MAIN DOCUMENT AREA */}
        <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-black/20 p-5">
          {/* Tiny technical label */}
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />

            <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-slate-700">
              Ready
            </span>
          </div>

          <div className="flex min-h-[190px] flex-col items-center justify-center rounded-[18px] border border-dashed border-white/[0.08] bg-white/[0.015] px-5 py-8 text-center">
            <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035]">
              <div className="absolute inset-1 rounded-xl border border-white/[0.04]" />

              <Upload size={21} className="relative text-slate-300" />
            </div>

            <h3 className="text-sm font-semibold text-white">
              Open a document
            </h3>

            <p className="mt-2 max-w-xs text-xs leading-5 text-slate-600">
              Upload a PDF to read, highlight, draw and keep notes in one
              workspace.
            </p>

            <Link
              href="/documents"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.06] px-4 py-2.5 text-xs font-semibold text-white transition duration-200 hover:bg-white/[0.1]"
            >
              Launch Workspace
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* TOOLS */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <ToolItem
            icon={<Highlighter size={16} />}
            title="Highlight"
            subtitle="Mark text"
          />

          <ToolItem
            icon={<PenLine size={16} />}
            title="Draw"
            subtitle="Annotate"
          />

          <ToolItem
            icon={<StickyNote size={16} />}
            title="Notes"
            subtitle="Add context"
          />
        </div>

        {/* STATUS BAR */}
        <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-5">
          <div className="flex items-center gap-2">
            <ScanLine size={13} className="text-slate-600" />

            <span className="text-[9px] uppercase tracking-[0.18em] text-slate-700">
              Document system ready
            </span>
          </div>

          <Link
            href="/documents"
            className="group flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-white"
          >
            Open workspace

            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ToolItem({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3.5 transition duration-200 hover:border-white/[0.13] hover:bg-white/[0.04]">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-slate-400 transition group-hover:text-white">
        {icon}
      </div>

      <p className="text-xs font-medium text-slate-300">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-slate-700">
        {subtitle}
      </p>
    </div>
  );
}
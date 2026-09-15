"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({ title, description, onClose, children }: { title: string; description: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    const dialog = ref.current!;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    dialog.querySelector<HTMLInputElement>("input")?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      trigger?.focus();
    };
  }, []);
  return <dialog ref={ref} aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={event => { event.preventDefault(); onClose(); }}
    onKeyDown={event => {
      if (event.key !== "Tab") return;
      const elements = Array.from(ref.current!.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]'));
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}
    className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-800 p-0 font-['Geist_Variable',Arial,sans-serif] text-slate-50 shadow-2xl backdrop:bg-slate-950/75 backdrop:backdrop-blur-sm">
    <header className="flex items-start justify-between gap-4 border-b border-slate-700 p-6">
      <div><h2 id={titleId} className="text-lg font-semibold">{title}</h2><p id={descriptionId} className="mt-1 text-[13px] text-slate-400">{description}</p></div>
      <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-400"><X size={18} /></button>
    </header>
    {children}
  </dialog>;
}

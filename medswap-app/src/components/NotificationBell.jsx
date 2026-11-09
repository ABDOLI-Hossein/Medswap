"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { markNotificationsRead } from "@/app/actions";

export default function NotificationBell({ notifications, unread }) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) startTransition(() => markNotificationsRead());
  };

  return (
    <div ref={ref} className="relative">
      <button type="button" aria-label="Notifications" aria-expanded={open} onClick={toggle} className="relative text-muted hover:text-ink">
        <Bell className="h-5 w-5" />
        {unread > 0 && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-brand" />}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-3 w-80 overflow-hidden rounded-xl border border-line bg-white shadow-lg">
          <p className="border-b border-line px-4 py-3 text-sm font-semibold text-ink">Notifications</p>
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-muted">Aucune notification pour le moment.</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {notifications.map((n) => (
                <li key={n.id} className="border-b border-line last:border-0">
                  <Link href={n.href} onClick={() => setOpen(false)} className={`block px-4 py-3 hover:bg-surface ${n.read ? "" : "bg-brand-soft/40"}`}>
                    <p className="text-sm text-ink">{n.text}</p>
                    <p className="mt-1 text-xs text-muted">{n.createdAt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

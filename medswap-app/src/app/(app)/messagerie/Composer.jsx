"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { sendMessage } from "@/app/actions";
import { Button } from "@/components/ui";

export default function Composer({ conversationId }) {
  const [state, action, pending] = useActionState(sendMessage.bind(null, conversationId), null);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="border-t border-line bg-white p-4">
      <div className="rounded-xl border border-line-strong bg-surface p-3">
        <textarea
          name="body"
          rows={2}
          required
          placeholder="Écrivez votre message…"
          className="w-full resize-none bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        {state?.error ? <p className="text-xs text-amber-ink">{state.error}</p> : <span className="text-xs text-muted">Vos échanges sont privés.</span>}
        <Button type="submit" disabled={pending} className="px-5 py-2.5">
          <Send className="h-4 w-4" /> Envoyer
        </Button>
      </div>
    </form>
  );
}

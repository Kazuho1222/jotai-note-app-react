import { useMutation } from "convex/react";
import { useAtom } from "jotai";
import { api } from "../../convex/_generated/api";
import { notesAtom } from "../store";
import { useCallback, useRef } from "react";
import { Note } from "../domain/note";
import type { Id } from "../../convex/_generated/dataModel";

export const useNoteSave = () => {
  const [, setNotes] = useAtom(notesAtom);
  const updateNote = useMutation(api.notes.updateNote);
  const saveTimeoutRef = useRef("");

  // 即座に保存する関数
  const saveNote = useCallback(
    async (noteId: Id<"notes">, title: string, content: string) => {
      try {
        await updateNote({
          noteId,
          title,
          content,
        });

        // ローカルノートリストも更新
        setNotes((prev) =>
          prev.map((n) =>
            n.id === noteId ? new Note(noteId, title, content, Date.now()) : n
          )
        );
      } catch (error) {
        console.error("Failed to save note:", error);
      }
    },
    [updateNote, setNotes]
  );

  // debounceして保存する関数
  const debouncedSave = useCallback(
    (
      noteId: Id<"notes">,
      title: string,
      content: string,
      delay: number = 500
    ) => {
      // 既存のタイマーをクリア
      if (saveTimeoutRef.current) {
        clearTimeout(Number(saveTimeoutRef.current));
      }
      // 新しいタイマーをセット
      saveTimeoutRef.current = String(
        setTimeout(() => {
          saveNote(noteId, title, content);
        }, delay)
      );
    },
    [saveNote]
  );

  return { saveNote, debouncedSave };
};

import { atom } from "jotai";
import type { Note } from "../domain/note";
import type { Id } from "../../convex/_generated/dataModel";

export const notesAtom = atom<Note[]>([]);
export const selectedNoteIdAtom = atom<Id<"notes"> | null>(null);

export const selectedNoteAtom = atom((get) => {
  const notes = get(notesAtom);
  const id = get(selectedNoteIdAtom);
  if (id === null) return null;
  return notes.find((note) => note.id === id) || null;
});

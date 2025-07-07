import { useMutation } from "convex/react"
import { useAtom, useSetAtom } from "jotai"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"
import { Note } from "../domain/note"
import { notesAtom, selectedNoteIdAtom } from "../store"
import { useEffect, useState } from "react"
import { useDebounce } from "@uidotdev/usehooks"

function SideMenu() {
  const [notes, setNotes] = useAtom(notesAtom)
  const setSelectedNoteId = useSetAtom(selectedNoteIdAtom)
  const createNote = useMutation(api.notes.create)
  const deleteNote = useMutation(api.notes.deleteNote)
  const updateNote = useMutation(api.notes.updateNote)
  const [editingTitle, setEditingTitle] = useState<{
    id: Id<"notes">
    title: string
  } | null>(null)

  const handleCreateNote = async () => {
    const noteId = await createNote({
      title: "Untitled",
      content: "",
    })

    const newNote = new Note(noteId, "Untitled", "", Date.now())
    setNotes((prev) => [...prev, newNote])
  }

  const handleDeleteNote = async (noteId: Id<"notes">) => {
    await deleteNote({ noteId })
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
  }

  const handleNoteClick = (note: Note) => {
    setSelectedNoteId(note.id)
  }

  const handleTitleChange = (noteId: Id<"notes">, newTitle: string) => {
    setEditingTitle({ id: noteId, title: newTitle })
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, title: newTitle } : n))
    )
  }

  const debouncedTitle = useDebounce(editingTitle?.title, 500)
  useEffect(() => {
    if (editingTitle && debouncedTitle) {
      handleUpdateTitle(editingTitle.id, debouncedTitle)
    }
  }, [debouncedTitle])

  const handleUpdateTitle = async (noteId: Id<"notes">, newTitle: string) => {
    const note = notes.find((n) => n.id === noteId)
    if (!note) return

    await updateNote({
      noteId,
      title: newTitle,
      content: note.content,
    })
  }

  return (
    <div className="w-64 h-screen bg-gray-100 p-4 flex flex-col">
      <div>
        <h2>Notes</h2>
        <button onClick={handleCreateNote}>+</button>
      </div>
      <div>{notes?.map((note) => (
        <div
          key={note.id}
          className="p-2 mb-2 rounded cursor-pointer flex justify-between items-center group" onClick={() => handleNoteClick(note)}
        >
          <div className="flex-1 mix-w-0">
            <input
              type="text"
              className="bg-gray-100"
              onChange={(e) => handleTitleChange(note.id, e.target.value)}
              value={note.title}
            />
            <p>
              {note.lastEditTime
                ? new Date(note.lastEditTime).toLocaleString()
                : "Never edited"}
            </p>
          </div>
          <button onClick={() => handleDeleteNote(note.id)}>-</button>
        </div>
      ))}
      </div>
    </div>
  )
}

export default SideMenu
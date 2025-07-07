import { useAtomValue } from "jotai"
import { selectedNoteAtom } from "../store"

function Editor() {
  const selectedNote = useAtomValue(selectedNoteAtom)
  return (
    <div>
      {selectedNote?.content || ""}
    </div>
  )
}

export default Editor

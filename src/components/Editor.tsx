import {
  BoldItalicUnderlineToggles,
  InsertCodeBlock,
  ListsToggle,
  MDXEditor,
  codeBlockPlugin,
  codeMirrorPlugin,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useDebounce } from "@uidotdev/usehooks";
import { useMutation } from "convex/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Note } from "../domain/note";
import { notesAtom, saveNoteAtom, selectedNoteAtom } from "../store";
import { useNoteSave } from "../hooks/useNoteSave"

const plugins = [
  headingsPlugin(),
  listsPlugin(),
  markdownShortcutPlugin(),
  codeBlockPlugin({
    defaultCodeBlockLanguage: "js",
  }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      js: "JavaScript",
      jsx: "JavaScript JSX",
      ts: "TypeScript",
      tsx: "TypeScript JSX",
      python: "Python",
      css: "CSS",
      html: "HTML",
      json: "JSON",
    },
  }),
  toolbarPlugin({
    toolbarContents: () => (
      <>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <BoldItalicUnderlineToggles />
          </div>
          <div className="flex gap-1">
            <ListsToggle />
          </div>
          <InsertCodeBlock />
        </div>
      </>
    ),
  }),
];

export const Editor = () => {
  const selectedNote = useAtomValue(selectedNoteAtom);
  // const [, setNotes] = useAtom(notesAtom);
  // const updateNote = useMutation(api.notes.updateNote);
  // const saveNote = useSetAtom(saveNoteAtom);
  // const [content, setContent] = useState<string>("");
  // const debouncedContent = useDebounce(content, 1000);
  const { debouncedSave } = useNoteSave()

  // useEffect(() => {
  //   if (!selectedNote || debouncedContent === undefined) return;

  //   if (selectedNote.content === debouncedContent) return

  //   updateNote({
  //     noteId: selectedNote.id,
  //     content: debouncedContent,
  //     title: selectedNote.title,
  //   });

  // サーバーに保存した時にタイムスタンプを更新
  // const updatedNote = new Note(selectedNote.id, selectedNote.title, debouncedContent, Date.now());
  //   setNotes((prev) =>
  //     prev.map((n) =>
  //       n.id === selectedNote.id
  //         ? new Note(selectedNote.id, selectedNote.title, debouncedContent, Date.now())
  //         : n
  //     )
  //   );
  // }, [debouncedContent, selectedNote?.id, selectedNote?.title, updateNote, setNotes]);

  const handleContentChange = useCallback(
    (newContent: string) => {
      if (selectedNote) {
        debouncedSave(selectedNote.id, selectedNote.title, newContent)
      }
    },
    [selectedNote, debouncedSave]
  );

  return (
    <div className="flex-1">
      {selectedNote ? (
        <MDXEditor
          key={selectedNote.id}
          markdown={selectedNote.content}
          onChange={handleContentChange}
          plugins={plugins}
          contentEditableClassName="prose max-w-none focus:outline-none"
          className="h-full"
          placeholder="Markdownを入力してください"
        />
      ) : (
        <div className="h-screen flex items-center justify-center">
          <p className="text-gray-500">
            ノートを選択するか、新しいノートを作成してください
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;

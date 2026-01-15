import { MonacoEditor } from "@/components/monaco-editor";
import { useGeneratedCodeStore } from "./context";
import { MonacoDiffEditor } from "@/components/monaco-editor/diff";
import { Button } from "flowbite-react";

export function EditCode() {
  const { showDiff, language, code, oldCode, setCode, onOk, onRevert } = useGeneratedCodeStore(
    (selector) => selector
  );

  return (
    <div className="h-full w-full overflow-hidden relative max-w-full max-h-full">
      {showDiff ? (
        <>
          <MonacoDiffEditor
            language={language}
            originalCode={oldCode}
            modifiedCode={code}
          />
          <div className="absolute flex gap-2 items-center" style={{ bottom: "24px", right: "24px" }}>
            <Button
              color="yellow"
              className="!rounded-md hover:opacity-80"
              onClick={onRevert}
            >
              还原
            </Button>
            <Button
              color="primary"
              className="!rounded-md hover:opacity-80"
              onClick={onOk}
            >
              确认
            </Button>
          </div>
        </>
      ) : (
        <MonacoEditor
          language={language}
          content={code}
          onChange={(value) => {
            setCode(value || "");
          }}
        />
      )}
    </div>
  );
}

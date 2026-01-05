import { Loader2 } from "lucide-react";

interface ToolInvocationBadgeProps {
  toolInvocation: {
    toolCallId: string;
    toolName: string;
    state: "partial-call" | "call" | "result";
    args: Record<string, any>;
    result?: any;
  };
}

function formatToolMessage(toolName: string, args: Record<string, any>): string {
  if (toolName === "str_replace_editor") {
    const command = args?.command;
    const path = args?.path || "";
    const filename = path.split("/").pop() || path;

    switch (command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
        return `Editing ${filename}`;
      case "view":
        return `Viewing ${filename}`;
      case "insert":
        return `Inserting into ${filename}`;
      case "undo_edit":
        return `Undoing edit in ${filename}`;
      default:
        return filename ? `Modifying ${filename}` : toolName;
    }
  }

  if (toolName === "file_manager") {
    const command = args?.command;
    const path = args?.path || "";
    const filename = path.split("/").pop() || path;

    switch (command) {
      case "rename":
        const newPath = args?.new_path || "";
        const newFilename = newPath.split("/").pop() || newPath;
        return newFilename ? `Renaming ${filename} to ${newFilename}` : `Renaming ${filename}`;
      case "delete":
        return `Deleting ${filename}`;
      default:
        return filename ? `Managing ${filename}` : toolName;
    }
  }

  return toolName;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const { toolName, state, args } = toolInvocation;
  const message = formatToolMessage(toolName, args || {});
  const isCompleted = state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isCompleted ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}

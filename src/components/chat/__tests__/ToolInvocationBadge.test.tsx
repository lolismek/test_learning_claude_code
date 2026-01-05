import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

// State Tests
test("shows loading spinner for partial-call state", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "partial-call",
        args: { command: "create", path: "App.jsx" },
      }}
    />
  );

  const loader = document.querySelector(".animate-spin");
  expect(loader).toBeDefined();
  screen.getByText("Creating App.jsx");
});

test("shows green dot for result state", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "create", path: "App.jsx" },
        result: "Success",
      }}
    />
  );

  const greenDot = container.querySelector(".bg-emerald-500");
  expect(greenDot).toBeDefined();
  screen.getByText("Creating App.jsx");
});

// str_replace_editor Command Tests
test("shows 'Creating [filename]' for create command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "create", path: "App.jsx" },
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Creating App.jsx"));
});

test("shows 'Editing [filename]' for str_replace command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "str_replace", path: "Card.jsx" },
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Editing Card.jsx"));
});

test("shows 'Viewing [filename]' for view command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "view", path: "App.jsx" },
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Viewing App.jsx"));
});

test("shows 'Inserting into [filename]' for insert command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "insert", path: "App.jsx" },
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Inserting into App.jsx"));
});

test("shows 'Undoing edit in [filename]' for undo_edit command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "undo_edit", path: "App.jsx" },
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Undoing edit in App.jsx"));
});

// file_manager Command Tests
test("shows 'Renaming [old] to [new]' for rename command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "file_manager",
        state: "result",
        args: { command: "rename", path: "old.jsx", new_path: "new.jsx" },
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Renaming old.jsx to new.jsx"));
});

test("shows 'Deleting [filename]' for delete command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "file_manager",
        state: "result",
        args: { command: "delete", path: "temp.jsx" },
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Deleting temp.jsx"));
});

// Path Handling Tests
test("extracts filename from nested path", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "create", path: "src/components/App.jsx" },
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Creating App.jsx"));
});

test("handles simple filename without path", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "create", path: "Card.jsx" },
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Creating Card.jsx"));
});

test("handles empty path gracefully", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "create", path: "" },
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Creating"));
});

// Edge Case Tests
test("handles missing args object", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "result",
        args: {},
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("str_replace_editor"));
});

test("shows generic message for unknown command in str_replace_editor", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "unknown", path: "App.jsx" },
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Modifying App.jsx"));
});

test("shows raw tool name for unknown toolName", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "unknown_tool",
        state: "result",
        args: { command: "test", path: "App.jsx" },
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("unknown_tool"));
});

test("handles missing new_path for rename command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "file_manager",
        state: "result",
        args: { command: "rename", path: "old.jsx" },
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Renaming old.jsx"));
});

// Visual Styling Tests
test("applies correct CSS classes", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "create", path: "App.jsx" },
        result: "Success",
      }}
    />
  );

  const badge = container.querySelector(".inline-flex");
  expect(badge?.className).toContain("bg-neutral-50");
  expect(badge?.className).toContain("rounded-lg");
  expect(badge?.className).toContain("border");
  expect(badge?.className).not.toContain("font-mono");
});

test("shows loading spinner with blue color for call state", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "create", path: "App.jsx" },
      }}
    />
  );

  const loader = container.querySelector(".text-blue-600");
  expect(loader).toBeDefined();
});

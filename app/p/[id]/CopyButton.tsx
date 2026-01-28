"use client";

export default function CopyButton({ text }: { text: string }) {
  function handleClick() {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard ");
  }

  return (
    <button
      className="mt-3 bg-black text-white px-4 py-2 rounded"
      onClick={handleClick}
    >
      Copy
    </button>
  );
}

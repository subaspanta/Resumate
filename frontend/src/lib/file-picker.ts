export interface FilePickerOptions {
  accept?: string;
  multiple?: boolean;
}

export interface FilePickerResult {
  files: FileList | null;
  /** The input element used for picking, useful if you need to clean up */
  input: HTMLInputElement;
}

/**
 * Programmatically triggers a file picker dialog.
 * Returns a promise that resolves with the selected files.
 * The input element is automatically cleaned up after selection.
 */
export function openFilePicker(
  options: FilePickerOptions = {},
): Promise<FilePickerResult> {
  const { accept = ".pdf,.docx", multiple = false } = options;

  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = multiple;

    const cleanup = () => {
      input.remove();
    };

    input.onchange = () => {
      const result = { files: input.files, input };
      cleanup();
      resolve(result);
    };

    // Also resolve if user cancels (no files selected)
    input.oncancel = () => {
      cleanup();
      resolve({ files: null, input });
    };

    // Handle cases where the picker might be blocked
    try {
      input.click();
    } catch {
      // User cancelled or picker was blocked - resolve with no files
      cleanup();
      resolve({ files: null, input });
    }
  });
}

/**
 * Utility to get a single file from the picker.
 * Returns the first file or undefined if cancelled.
 */
export async function pickSingleFile(
  options: FilePickerOptions = {},
): Promise<File | undefined> {
  const result = await openFilePicker({ ...options, multiple: false });
  return result.files?.[0];
}

/**
 * Utility to get multiple files from the picker.
 * Returns an array of files or empty array if cancelled.
 */
export async function pickMultipleFiles(
  options: FilePickerOptions = {},
): Promise<File[]> {
  const result = await openFilePicker({ ...options, multiple: true });
  return result.files ? Array.from(result.files) : [];
}

//import { invoke } from '@tauri-apps/api/core';
//import { transformImage, Image } from '@tauri-apps/api/image';
const { invoke } = window.__TAURI__.core;

// Copyright 2019-2023 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT
/**
 * Read and write to the system clipboard.
 *
 * @module
 */
/**
 * Writes plain text to the clipboard.
 * @example
 * ```typescript
 * import { writeText, readText } from '@tauri-apps/plugin-clipboard-manager';
 * await writeText('Tauri is awesome!');
 * assert(await readText(), 'Tauri is awesome!');
 * ```
 *
 * @returns A promise indicating the success or failure of the operation.
 *
 * @since 2.0.0
 */
async function writeText(text, opts) {
    await invoke('plugin:clipboard-manager|write_text', {
        label: opts?.label,
        text
    });
}
/**
 * Gets the clipboard content as plain text.
 * @example
 * ```typescript
 * import { readText } from '@tauri-apps/plugin-clipboard-manager';
 * const clipboardText = await readText();
 * ```
 * @since 2.0.0
 */
async function readText() {
    return await invoke('plugin:clipboard-manager|read_text');
}

/**
 * Clears the clipboard.
 *
 * #### Platform-specific
 *
 * - **Android:** Only supported on SDK 28+. For older releases we write an empty string to the clipboard instead.
 *
 * @example
 * ```typescript
 * import { clear } from '@tauri-apps/plugin-clipboard-manager';
 * await clear();
 * ```
 * @since 2.0.0
 */
async function clear() {
    await invoke('plugin:clipboard-manager|clear');
}

export { clear, readText, writeText };

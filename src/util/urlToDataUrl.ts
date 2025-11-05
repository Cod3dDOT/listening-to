/*
 * SPDX-FileCopyrightText: 2025 cod3ddot@proton.me
 *
 * SPDX-License-Identifier: MIT
 */

export async function urlToDataUri(url: string): Promise<string> {
	const response = await fetch(url);
	const buffer = await response.arrayBuffer();

	const contentType =
		response.headers.get("content-type") ?? "application/octet-stream";

	return arrayBufferToDataUri(buffer, contentType);
}

export function arrayBufferToDataUri(
	buffer: ArrayBuffer | Buffer,
	contentType: string
): string {
	const bytes = new Uint8Array(buffer);
	const base64 = btoa(String.fromCharCode(...bytes));
	return `data:${contentType};base64,${base64}`;
}

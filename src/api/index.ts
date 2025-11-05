/*
 * SPDX-FileCopyrightText: 2025 cod3ddot@proton.me
 *
 * SPDX-License-Identifier: MIT
 */

// biome-ignore lint/performance/noNamespaceImport: preferred way
import * as z from "zod/mini";

z.config(z.locales.en());

export async function fetchAndValidate<T>(
	url: URL,
	schema: z.ZodMiniType<T>
): Promise<T | null> {
	try {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`HTTP ${res.status}`);
		}
		const data = await res.json();
		const parsed = schema.safeParse(data);
		if (!parsed.success) {
			console.error(`Invalid response for ${url}`, parsed.error);
			return null;
		}
		return parsed.data;
	} catch (err) {
		console.error(`Error fetching ${url}`, err);
		return null;
	}
}

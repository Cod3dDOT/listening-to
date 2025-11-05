/*
 * SPDX-FileCopyrightText: 2025 cod3ddot@proton.me
 *
 * SPDX-License-Identifier: MIT
 */

import type z from "zod";

export async function fetchAndValidate<T>(
	url: URL,
	schema: z.ZodSchema<T>
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

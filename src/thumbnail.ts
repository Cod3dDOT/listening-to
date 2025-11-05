/*
 * SPDX-FileCopyrightText: 2025 cod3ddot@proton.me
 *
 * SPDX-License-Identifier: MIT
 */

import sharp from "sharp";
import { arrayBufferToDataUri } from "./util/urlToDataUrl.ts";

const IMAGE_SIZE = 50;

export async function processAlbumCover(
	imageUrl: string | undefined
): Promise<string | undefined> {
	if (!imageUrl) {
		return undefined;
	}

	try {
		const response = await fetch(imageUrl);
		const arrayBuffer = await response.arrayBuffer();

		const resized = await sharp(Buffer.from(arrayBuffer))
			.resize(IMAGE_SIZE, IMAGE_SIZE, { fit: "cover" })
			.webp()
			.toBuffer();

		return arrayBufferToDataUri(resized, "image/webp");
	} catch (error) {
		console.warn("Failed to process album cover:", error);
		return undefined;
	}
}

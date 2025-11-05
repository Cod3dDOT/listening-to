/*
 * SPDX-FileCopyrightText: 2025 cod3ddot@proton.me
 *
 * SPDX-License-Identifier: MIT
 */

import { z } from "zod";
import type { StreamingServices } from "../../streamingServices/keys.ts";
import { fetchAndValidate } from "../index.ts";

const OpenwhydTrackSchema = z.object({
	id: z.string(),
	name: z.string(),
	eId: z.string(),
	img: z.string().optional(),
	url: z.url().optional()
});

const OpenwhydResponseSchema = z.object({
	results: z.object({
		posts: z.array(OpenwhydTrackSchema)
	})
});

export async function openwhydStreamingServices(
	title: string,
	artist: string
): Promise<StreamingServices> {
	const apiUrl = new URL("https://openwhyd.org/search");
	apiUrl.searchParams.set("q", `${artist} ${title}`);
	apiUrl.searchParams.set("format", "json");

	const data = await fetchAndValidate(apiUrl, OpenwhydResponseSchema);
	if (!data || data?.results?.posts?.length === 0) {
		return {};
	}

	const services: StreamingServices = {};

	for (const { eId } of data.results.posts) {
		// Spotify
		if (eId.startsWith("spotify:track:") && !services.spotify) {
			const id = eId.split(":")[2];
			services.spotify = `https://open.spotify.com/track/${id}`;
		}

		// YouTube
		if (eId.startsWith("/yt/") && !services.youtube) {
			const id = eId.slice(4);
			services.youtube = `https://www.youtube.com/watch?v=${id}`;
		}

		// Deezer
		if (eId.startsWith("/dz/") && !services.deezer) {
			const id = eId.slice(4);
			services.deezer = `https://www.deezer.com/track/${id}`;
		}

		// SoundCloud
		if (eId.startsWith("/sc/") && !services.soundcloud) {
			const id = eId.slice(4);
			services.soundcloud = `https://soundcloud.com/${id}`;
		}

		// Bandcamp
		if (eId.startsWith("/bc/") && !services.bandcamp) {
			const id = eId.slice(4);
			services.bandcamp = `https://bandcamp.com/${id}`;
		}
	}

	return services;
}

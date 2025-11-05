/*
 * SPDX-FileCopyrightText: 2025 cod3ddot@proton.me
 *
 * SPDX-License-Identifier: MIT
 */

import { z } from "zod";
import type { StreamingServices } from "../../streamingServices/keys.ts";
import { fetchAndValidate } from "../index.ts";

const OdesliLinkSchema = z.object({
	url: z.url(),
	nativeAppUriMobile: z.string().optional(),
	nativeAppUriDesktop: z.string().optional(),
	entityUniqueId: z.string()
});

const OdesliEntitySchema = z.object({
	id: z.string(),
	type: z.string(),
	title: z.string().optional(),
	artistName: z.string().optional(),
	thumbnailUrl: z.string().optional(),
	apiProvider: z.string(),
	platforms: z.array(z.string())
});

const OdesliResponseSchema = z.object({
	entityUniqueId: z.string(),
	userCountry: z.string(),
	pageUrl: z.url(),
	linksByPlatform: z.record(z.string(), OdesliLinkSchema).optional(),
	entitiesByUniqueId: z.record(z.string(), OdesliEntitySchema)
});

export async function odesliStreamingServices(
	url: string
): Promise<StreamingServices> {
	const apiUrl = new URL("https://api.song.link/v1-alpha.1/links");
	apiUrl.searchParams.set("url", url);

	const data = await fetchAndValidate(apiUrl, OdesliResponseSchema);
	if (!data?.linksByPlatform) {
		return {};
	}

	const { linksByPlatform } = data;

	// mapping between Odesli keys and StreamingServices
	const platformMap: Record<
		keyof StreamingServices,
		keyof typeof linksByPlatform
	> = {
		spotify: "spotify",
		apple: "appleMusic",
		deezer: "deezer",
		youtube: "youtube",
		tidal: "tidal",
		soundcloud: "soundcloud",
		bandcamp: "bandcamp"
	};

	const result: StreamingServices = Object.fromEntries(
		Object.entries(platformMap)
			.map(([serviceKey, odesliKey]) => {
				const link = linksByPlatform[odesliKey];
				return link ? [serviceKey, link.url] : null;
			})
			.filter(Boolean) as [keyof StreamingServices, string][]
	) as StreamingServices;

	return result;
}

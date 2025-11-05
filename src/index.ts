/*
 * SPDX-FileCopyrightText: 2025 cod3ddot@proton.me
 *
 * SPDX-License-Identifier: MIT
 */

import { getLastSong as lastfmSong } from "./api/lastfm/index.ts";
import { getStreamingServices } from "./streamingServices.ts";
import { processAlbumCover } from "./thumbnail.ts";
import type { MusicTrack } from "./types.ts";

// biome-ignore lint/performance/noBarrelFile: convenience
export { createPlugin as ViteListeningTo } from "./plugin.ts";
export type { LastFmPluginOptions, MusicTrack } from "./types.ts";

export async function fetchMusicTrack(
	apiKey: string,
	userId: string
): Promise<MusicTrack> {
	const musicTrack = await lastfmSong(apiKey, userId);

	const [streamingServices, albumCover] = await Promise.all([
		getStreamingServices(
			musicTrack.title,
			musicTrack.artist,
			musicTrack.mbid,
			musicTrack.album,
			undefined
		),
		processAlbumCover(musicTrack.albumCover)
	]);

	return {
		title: musicTrack.title,
		artist: musicTrack.artist,
		album: musicTrack.album,
		albumCover: albumCover || null,
		services: streamingServices
	};
}

/*
 * SPDX-FileCopyrightText: 2025 cod3ddot@proton.me
 *
 * SPDX-License-Identifier: MIT
 */

import { z } from "zod";
import type { StreamingServices } from "../../streamingServices/keys.ts";
import { fetchAndValidate } from "../index.ts";

const makeTrackIdSchema = (key: string) =>
	z.array(z.object({ [key]: z.array(z.string()).optional() }));

const MusicBrainzSpotifySchema = makeTrackIdSchema("spotify_track_ids");
const MusicBrainzAppleSchema = makeTrackIdSchema("apple_music_track_ids");

type MusicBrainzStreamingServices = Pick<
	StreamingServices,
	"spotify" | "apple"
>;

export async function musicbrainzStreamingServices(
	title: string,
	artist: string
): Promise<MusicBrainzStreamingServices> {
	const params = new URLSearchParams({ title, artist });
	const base = "https://labs.api.listenbrainz.org";

	const spotifyUrl = new URL(`/spotify-id-from-metadata/json?${params}`, base);
	const appleUrl = new URL(
		`/apple-music-id-from-metadata/json?${params}`,
		base
	);

	const [spotifyRes, appleRes] = await Promise.all([
		fetchAndValidate(spotifyUrl, MusicBrainzSpotifySchema),
		fetchAndValidate(appleUrl, MusicBrainzAppleSchema)
	]);

	const spotifyId = spotifyRes?.[0]?.spotify_track_ids?.[0];
	const appleId = appleRes?.[0]?.apple_music_track_ids?.[0];

	return {
		spotify: spotifyId
			? `https://open.spotify.com/track/${spotifyId}`
			: undefined,
		apple: appleId ? `https://music.apple.com/us/song/${appleId}` : undefined
	};
}

/*
 * SPDX-FileCopyrightText: 2025 cod3ddot@proton.me
 *
 * SPDX-License-Identifier: MIT
 */

export type StreamingServiceProvider = "odesli" | "musicbrainz" | "openwhyd";

export interface StreamingServices {
	spotify?: string;
	apple?: string;
	deezer?: string;
	youtube?: string;
	tidal?: string;
	soundcloud?: string;
	bandcamp?: string;
}

export interface MusicTrack {
	title: string;
	artist: string;
	album: string;
	albumCover: string | null;
	services: StreamingServices;
}

export interface LastFmPluginOptions {
	userId: string;
	apiKey: string;
	providers?: StreamingServiceProvider[];
	cacheTTL?: number;
}

export interface ResolvedPluginOptions {
	userId: string;
	apiKey: string;
	providers: StreamingServiceProvider[];
	cacheTTL: number;
}

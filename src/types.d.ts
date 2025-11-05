/*
 * SPDX-FileCopyrightText: 2025 cod3ddot@proton.me
 *
 * SPDX-License-Identifier: MIT
 */

import type { StreamingServices } from "./streamingServices/keys.ts";

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
	cacheTTL?: number;
}

export interface ResolvedPluginOptions {
	userId: string;
	apiKey: string;
	cacheTTL: number;
}

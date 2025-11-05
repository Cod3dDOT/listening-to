/*
 * SPDX-FileCopyrightText: 2025 cod3ddot@proton.me
 *
 * SPDX-License-Identifier: MIT
 */

import type { Plugin } from "vite";
import { fetchMusicTrack } from "./index.ts";
import type {
	LastFmPluginOptions,
	MusicTrack,
	ResolvedPluginOptions
} from "./types.ts";
import { Cache } from "./util/cache.ts";

const VIRTUAL_MODULE_ID = "virtual:vite-listening-to";
const RESOLVED_ID = `\0${VIRTUAL_MODULE_ID}`;

const DEFAULT_OPTIONS = {
	// biome-ignore lint/style/noMagicNumbers: 5 minutes
	cacheTTL: 5 * 60 * 1000
} as const;

function resolveOptions(options: LastFmPluginOptions): ResolvedPluginOptions {
	if (!options.apiKey || !options.userId) {
		throw new Error("API key and user ID must be specified");
	}

	return {
		...DEFAULT_OPTIONS,
		...options
	};
}

export function createPlugin(options: LastFmPluginOptions): Plugin {
	const resolvedOptions = resolveOptions(options);
	const cache = new Cache<MusicTrack>(resolvedOptions.cacheTTL);

	return {
		name: "vite-listening-to",

		buildStart() {
			cache.clear();
		},

		resolveId(id) {
			if (id === VIRTUAL_MODULE_ID) {
				return RESOLVED_ID;
			}
		},

		async load(id) {
			if (id !== RESOLVED_ID) {
				return;
			}

			let track = cache.get();

			if (track) {
				console.log("LAST-FM-TRACK: using cached track:", track.title);
			} else {
				console.log("LAST-FM-TRACK: fetching fresh Last.fm data");
				track = await fetchMusicTrack(
					resolvedOptions.apiKey,
					resolvedOptions.userId
				);
				cache.set(track);
				console.log("LAST-FM-TRACK: cached track:", track.title);
			}

			return `export const musicTrack: MusicTrack = ${JSON.stringify(track)};`;
		}
	};
}

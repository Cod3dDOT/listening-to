/*
 * SPDX-FileCopyrightText: 2025 cod3ddot@proton.me
 *
 * SPDX-License-Identifier: MIT
 */

import { musicbrainzStreamingServices } from "@/api/musicbrainz/index.ts";
import { odesliStreamingServices } from "@/api/odesli/index.ts";
import { openwhydStreamingServices } from "@/api/openwhyd/index.ts";
import type { StreamingServiceProvider, StreamingServices } from "./types.ts";

/**
 * Merge multiple streaming service sources into one unified object.
 */
const mergeServices = (
	...sources: Partial<StreamingServices>[]
): StreamingServices => Object.assign({}, ...sources);

/**
 * Determines the best reference service for Odesli lookups.
 */
const selectBestReference = (services: StreamingServices): string | undefined =>
	services.spotify ?? services.apple ?? services.youtube;

const providers: Record<
	StreamingServiceProvider,
	(...args: string[]) => Promise<StreamingServices>
> = {
	musicbrainz: musicbrainzStreamingServices,
	openwhyd: openwhydStreamingServices,
	odesli: odesliStreamingServices
};

export const getStreamingServices = async (
	title: string,
	artist: string,
	config: {
		use: StreamingServiceProvider[];
	} = { use: ["musicbrainz", "openwhyd", "odesli"] }
): Promise<StreamingServices> => {
	const baseProviders = config.use.filter(
		(p) => p in providers && p !== "odesli"
	);
	const includeOdesli = config.use.includes("odesli");

	// Fetch non-Odesli providers in parallel
	const baseResults = await Promise.all(
		baseProviders.map((p) => providers[p](title, artist))
	);
	const baseServices = mergeServices(...baseResults);

	if (!includeOdesli) {
		return baseServices;
	}

	const referenceUrl = selectBestReference(baseServices);
	if (!referenceUrl) {
		return baseServices;
	}

	const odesli = await providers.odesli(referenceUrl);
	return mergeServices(baseServices, odesli);
};

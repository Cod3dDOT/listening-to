/*
 * SPDX-FileCopyrightText: 2025 cod3ddot@proton.me
 *
 * SPDX-License-Identifier: MIT
 */

import { musicbrainzStreamingServices } from "../api/musicbrainz/index.ts";
import { odesliStreamingServices } from "../api/odesli/index.ts";
import { openwhydStreamingServices } from "../api/openwhyd/index.ts";
import type { StreamingServices } from "./keys.ts";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const getStreamingServices = async (
	title: string,
	artist: string,
	_mbid: string | undefined,
	_album: string | undefined,
	_year: number | undefined
): Promise<StreamingServices> => {
	const [musicBrainz, openwhyd] = await Promise.all([
		musicbrainzStreamingServices(title, artist),
		openwhydStreamingServices(title, artist)
	]);

	const baseServices: StreamingServices = { ...musicBrainz, ...openwhyd };

	const bestForOdesli =
		baseServices.spotify ?? baseServices.apple ?? baseServices.youtube;

	if (!bestForOdesli) {
		return baseServices;
	}

	const odesli = await odesliStreamingServices(bestForOdesli);
	return { ...baseServices, ...odesli };
};

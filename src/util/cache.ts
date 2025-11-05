/*
 * SPDX-FileCopyrightText: 2025 cod3ddot@proton.me
 *
 * SPDX-License-Identifier: MIT
 */

export class Cache<T> {
	private readonly ttl: number;
	private memoryCache: T | null = null;
	private timestamp = 0;

	constructor(ttlMs: number) {
		this.ttl = ttlMs;
	}

	private isValid(): boolean {
		return this.memoryCache !== null && Date.now() - this.timestamp < this.ttl;
	}

	get(): T | null {
		if (this.isValid()) {
			return this.memoryCache;
		}
		return null;
	}

	set(data: T): void {
		this.memoryCache = data;
		this.timestamp = Date.now();
	}

	clear(): void {
		this.memoryCache = null;
		this.timestamp = 0;
	}
}

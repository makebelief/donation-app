/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Database } from 'better-sqlite3';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: Database | null;
			user: {
				id: string;
				email: string;
				role: string;
			} | null;
		}
		// interface PageData {}
		// interface Platform {}
	}

	namespace NodeJS {
		interface ProcessEnv {
			DB_PATH: string;
			MPESA_CONSUMER_KEY: string;
			MPESA_CONSUMER_SECRET: string;
			MPESA_PASSKEY: string;
			MPESA_SHORTCODE: string;
			MPESA_CALLBACK_URL: string;
		}
	}
}

export {}; 
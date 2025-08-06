import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { config } from "dotenv"

const getSupabaseConfig = () => {
	config()
	
	const { SUPABASE_URL, SUPABASE_KEY } = process.env;

	if (!SUPABASE_URL || !SUPABASE_KEY) {
		console.error("[Config] Missing SUPABASE_URL or SUPABASE_KEY. Exiting.");
		process.exit(1);
	}
  	return { url: SUPABASE_URL, key: SUPABASE_KEY };
}

export class SupabaseConnector {
	reference: SupabaseClient;

    constructor() {
		const envs = getSupabaseConfig();
		this.reference = createClient(envs.url, envs.key);
	}

	async checkConnection(): Promise<void> {
		//Sanity check for database connection
		const { data, error } = await this.reference.from('SanityTable').select("*").limit(1);

		if (error) throw new Error(`[DB] Sanity query error: ${error.message}`);
  		if (!data.length) throw new Error("[DB] Sanity query returned no rows");
		if (data[0] && (data[0].id != process.env.SANITY_ID || data[0].test != process.env.SANITY_TEST)) { throw new Error("[DB] Sanity result error: sanity values are not correct"); }
	}
}

export const dbConnector = new SupabaseConnector();
export let database: SupabaseClient;

export const connectDatabase = async (): Promise<void> => {
  await dbConnector.checkConnection();
  database = dbConnector.reference;
};
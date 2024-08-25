import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bbudfdepnozxvkdmrunu.supabase.co/storage/v1/s3'; // import.meta.env.VITE_SUPABASE_URL
//const supabase_service_role_apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidWRmZGVwbm96eHZrZG1ydW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDU0NTY0MSwiZXhwIjoyMDQwMTIxNjQxfQ.at7J_1Lwyv5vxp0i2x8xWZvKz3iCWC09uF-mMTNW_Wc'; // import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase_service_role_apikey = '45c7a03664cd5313b06ed4aa5dbd5822';

const supabaseAdmin = createClient(supabaseUrl, supabase_service_role_apikey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});

export default supabaseAdmin;

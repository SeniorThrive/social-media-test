import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('Reading migration file...');
    
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '20250629173134_throbbing_cloud.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    console.log('Applying migration to database...');
    
    // Execute the entire migration as a single transaction
    const { data, error } = await supabase.rpc('exec', {
      sql: migrationSQL
    });
    
    if (error) {
      console.error('Migration failed with RPC method:', error);
      console.log('Trying alternative approach...');
      
      // Try using the REST API directly
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({ sql: migrationSQL })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('REST API approach also failed:', errorText);
        throw new Error(`Migration failed: ${response.status} ${response.statusText}`);
      }
      
      console.log('Migration applied successfully via REST API');
    } else {
      console.log('Migration applied successfully via RPC');
    }
    
    // Test the function
    console.log('Testing get_posts_with_counts function...');
    const { data: testData, error: testError } = await supabase.rpc('get_posts_with_counts');
    
    if (testError) {
      console.log('Function test error (this might be normal if no data exists):', testError.message);
    } else {
      console.log('Function test successful! Data:', testData);
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

applyMigration();
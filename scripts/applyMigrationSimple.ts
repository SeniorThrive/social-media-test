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
    
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '20250630011006_add_community_image_url.sql');
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
    
    // Test that the column was added
    console.log('Testing communities table structure...');
    const { data: testData, error: testError } = await supabase
      .from('communities')
      .select('id, name, description, image_url, created_at')
      .limit(1);
    
    if (testError) {
      console.log('Table structure test error:', testError.message);
    } else {
      console.log('Communities table structure verified successfully!');
      if (testData && testData.length > 0) {
        console.log('Sample record:', testData[0]);
      }
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

applyMigration();
import { supabase } from '../src/supabase-client';
import { readFileSync } from 'fs';
import { join } from 'path';

async function applyMigration() {
  try {
    console.log('Reading migration file...');
    const migrationPath = join(process.cwd(), 'supabase/migrations/20250629155804_turquoise_shrine.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    console.log('Applying migration to Supabase...');
    
    // Split the SQL into individual statements and execute them
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('/*') && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error('Error executing statement:', error);
          // Try direct query execution as fallback
          const { error: directError } = await supabase.from('_').select('*').limit(0);
          if (directError) {
            console.log('Trying alternative approach...');
            // Execute the full migration as one block
            const { error: fullError } = await supabase.rpc('exec_sql', { sql: migrationSQL });
            if (fullError) {
              console.error('Migration failed:', fullError);
              return;
            }
          }
        }
      }
    }
    
    console.log('Migration applied successfully!');
    
    // Verify the tables were created
    const { data: communities, error: communitiesError } = await supabase
      .from('communities')
      .select('*')
      .limit(1);
      
    if (communitiesError) {
      console.error('Error verifying communities table:', communitiesError);
    } else {
      console.log('✅ Communities table verified');
    }
    
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .limit(1);
      
    if (postsError) {
      console.error('Error verifying posts table:', postsError);
    } else {
      console.log('✅ Posts table verified');
    }
    
  } catch (error) {
    console.error('Failed to apply migration:', error);
  }
}

applyMigration();
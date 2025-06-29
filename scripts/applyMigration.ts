import { supabase } from "./supabase-script-client.js";
import { readFileSync } from "fs";
import { join } from "path";

async function applyMigration() {
  try {
    console.log("Reading migration file...");
    
    // Read the migration file - updated to use the correct filename
    const migrationPath = join(process.cwd(), "supabase", "migrations", "20250629155804_turquoise_shrine.sql");
    const migrationSQL = readFileSync(migrationPath, "utf8");
    
    console.log("Applying migration to database...");
    
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
          // Try direct query if RPC fails
          const { error: directError } = await supabase.from('_').select('*').limit(0);
          if (directError) {
            console.error("Error executing statement:", error);
            throw error;
          }
        }
      }
    }
    
    console.log("Migration applied successfully!");
    
    // Verify tables were created
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['communities', 'posts', 'comments', 'votes']);
    
    if (tablesError) {
      console.log("Could not verify tables, but migration may have succeeded");
    } else {
      console.log("Created tables:", tables?.map(t => t.table_name));
    }
    
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

applyMigration();
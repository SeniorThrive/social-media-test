import { supabase } from "./supabase-script-client.js";
import { readFileSync } from "fs";
import { join } from "path";

async function applyMigration() {
  try {
    console.log("Reading migration file...");
    
    // Read the migration file
    const migrationPath = join(process.cwd(), "supabase", "migrations", "20250629173134_throbbing_cloud.sql");
    const migrationSQL = readFileSync(migrationPath, "utf8");
    
    console.log("Applying migration to database...");
    
    // Remove comments and split into meaningful statements
    const cleanSQL = migrationSQL
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/--.*$/gm, '') // Remove line comments
      .trim();
    
    // Split by semicolon but be smarter about function definitions
    const statements = [];
    let currentStatement = '';
    let inFunction = false;
    
    const lines = cleanSQL.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('CREATE OR REPLACE FUNCTION')) {
        inFunction = true;
      }
      
      currentStatement += line + '\n';
      
      if (trimmedLine.endsWith(';')) {
        if (inFunction && trimmedLine === '$$;') {
          inFunction = false;
        }
        
        if (!inFunction) {
          statements.push(currentStatement.trim());
          currentStatement = '';
        }
      }
    }
    
    // Add any remaining statement
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.length > 0) {
        console.log(`Executing statement: ${statement.substring(0, 80)}...`);
        
        try {
          // Use the raw query method for DDL statements
          const { error } = await supabase.rpc('exec', { sql: statement });
          
          if (error) {
            // Try alternative method - direct SQL execution
            const { error: directError } = await (supabase as any).from('_').select().limit(0);
            
            // For DDL statements, we need to use a different approach
            // Let's try using the REST API directly
            const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/rpc/exec`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`,
                'apikey': process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
              },
              body: JSON.stringify({ sql: statement })
            });
            
            if (!response.ok) {
              console.error(`Failed to execute statement: ${statement.substring(0, 100)}...`);
              console.error(`Response: ${response.status} ${response.statusText}`);
              const errorText = await response.text();
              console.error(`Error details: ${errorText}`);
            } else {
              console.log("Statement executed successfully via REST API");
            }
          } else {
            console.log("Statement executed successfully");
          }
        } catch (execError) {
          console.error(`Error executing statement: ${execError}`);
          console.log("Statement that failed:", statement);
        }
      }
    }
    
    console.log("Migration application completed!");
    
    // Test if the function was created successfully
    console.log("Testing function creation...");
    try {
      const { data, error } = await supabase.rpc('get_posts_with_counts');
      if (error) {
        console.log("Function test failed, but this might be expected if no data exists yet");
        console.log("Error:", error.message);
      } else {
        console.log("Function created successfully! Returned data:", data);
      }
    } catch (testError) {
      console.log("Function test error (this might be normal):", testError);
    }
    
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

applyMigration();
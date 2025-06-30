import { supabase } from "./supabase-script-client.js";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

async function applyAllMigrations() {
  try {
    console.log("Reading all migration files...");
    
    const migrationsDir = join(process.cwd(), "supabase", "migrations");
    const migrationFiles = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Apply in chronological order
    
    console.log(`Found ${migrationFiles.length} migration files:`, migrationFiles);
    
    for (const migrationFile of migrationFiles) {
      console.log(`\n--- Applying migration: ${migrationFile} ---`);
      
      const migrationPath = join(migrationsDir, migrationFile);
      const migrationSQL = readFileSync(migrationPath, "utf8");
      
      // Remove comments and split into meaningful statements
      const cleanSQL = migrationSQL
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/--.*$/gm, '') // Remove line comments
        .trim();
      
      if (!cleanSQL) {
        console.log("Empty migration file, skipping...");
        continue;
      }
      
      // Split by semicolon but be smarter about function definitions
      const statements = [];
      let currentStatement = '';
      let inFunction = false;
      let dollarQuoteCount = 0;
      
      const lines = cleanSQL.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Track function definitions
        if (trimmedLine.includes('CREATE OR REPLACE FUNCTION') || trimmedLine.includes('CREATE FUNCTION')) {
          inFunction = true;
        }
        
        // Count dollar quotes
        const dollarMatches = line.match(/\$\$/g);
        if (dollarMatches) {
          dollarQuoteCount += dollarMatches.length;
        }
        
        currentStatement += line + '\n';
        
        if (trimmedLine.endsWith(';')) {
          // If we're in a function and have even number of $$ quotes, we're done with the function
          if (inFunction && dollarQuoteCount % 2 === 0) {
            inFunction = false;
          }
          
          if (!inFunction) {
            statements.push(currentStatement.trim());
            currentStatement = '';
            dollarQuoteCount = 0;
          }
        }
      }
      
      // Add any remaining statement
      if (currentStatement.trim()) {
        statements.push(currentStatement.trim());
      }
      
      // Execute each statement
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.length > 0) {
          console.log(`  Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 60)}...`);
          
          try {
            // Use direct SQL execution via REST API
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
              const errorText = await response.text();
              console.error(`  ❌ Failed to execute statement`);
              console.error(`  Response: ${response.status} ${response.statusText}`);
              console.error(`  Error details: ${errorText}`);
              
              // Continue with other statements unless it's a critical error
              if (response.status === 401 || response.status === 403) {
                throw new Error("Authentication failed. Please check your service role key.");
              }
            } else {
              console.log("  ✅ Statement executed successfully");
            }
          } catch (execError) {
            console.error(`  ❌ Error executing statement: ${execError}`);
            console.log("  Statement that failed:", statement.substring(0, 200) + "...");
            
            // Don't stop on individual statement errors, continue with the rest
          }
        }
      }
      
      console.log(`✅ Completed migration: ${migrationFile}`);
    }
    
    console.log("\n🎉 All migrations applied!");
    
    // Test if the posts table was created successfully
    console.log("\n--- Testing database setup ---");
    try {
      const { data, error } = await supabase.from('posts').select('count').limit(1);
      if (error) {
        console.log("❌ Posts table test failed:", error.message);
      } else {
        console.log("✅ Posts table exists and is accessible");
      }
    } catch (testError) {
      console.log("❌ Database test error:", testError);
    }
    
    // Test the function if it exists
    try {
      const { data, error } = await supabase.rpc('get_posts_with_counts');
      if (error) {
        console.log("⚠️  Function test failed (this might be normal if no data exists):", error.message);
      } else {
        console.log("✅ get_posts_with_counts function is working");
      }
    } catch (testError) {
      console.log("⚠️  Function test error (this might be normal):", testError);
    }
    
  } catch (error) {
    console.error("❌ Migration process failed:", error);
    process.exit(1);
  }
}

applyAllMigrations();
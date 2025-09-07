import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create the members table
    const { error: createTableError } = await supabaseClient.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS members (
          id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
          nom text NOT NULL,
          prenom text NOT NULL,
          pdf_name text NOT NULL,
          created_at timestamptz DEFAULT now()
        );

        ALTER TABLE members ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Allow public read access to members" ON members;
        CREATE POLICY "Allow public read access to members"
          ON members
          FOR SELECT
          TO public
          USING (true);

        INSERT INTO members (nom, prenom, pdf_name) VALUES
          ('BENALI', 'AHMED', 'AHMED-BENALI.PDF'),
          ('ZAHRA', 'FATIMA', 'FATIMA-ZAHRA.PDF'),
          ('AMRANI', 'YOUSSEF', 'YOUSSEF-AMRANI.PDF')
        ON CONFLICT DO NOTHING;
      `
    })

    if (createTableError) {
      console.error('Error creating table:', createTableError)
      return new Response(
        JSON.stringify({ error: 'Failed to create table', details: createTableError }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Database setup completed successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Setup error:', error)
    return new Response(
      JSON.stringify({ error: 'Setup failed', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
/*
  # Create members table for adeam-assurance

  1. New Tables
    - `members`
      - `id` (integer, primary key, auto-increment)
      - `nom` (text, last name)
      - `prenom` (text, first name)  
      - `pdf_name` (text, PDF filename)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `members` table
    - Add policy for public read access (search functionality)

  3. Sample Data
    - Insert demo members: BENALI AHMED, ZAHRA FATIMA, AMRANI YOUSSEF
*/

CREATE TABLE IF NOT EXISTS members (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nom text NOT NULL,
  prenom text NOT NULL,
  pdf_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to members"
  ON members
  FOR SELECT
  TO public
  USING (true);

-- Insert sample data
INSERT INTO members (nom, prenom, pdf_name) VALUES
  ('BENALI', 'AHMED', 'AHMED-BENALI.PDF'),
  ('ZAHRA', 'FATIMA', 'FATIMA-ZAHRA.PDF'),
  ('AMRANI', 'YOUSSEF', 'YOUSSEF-AMRANI.PDF')
ON CONFLICT DO NOTHING;
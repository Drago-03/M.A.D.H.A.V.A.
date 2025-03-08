/*
  # Create query history table

  1. New Tables
    - `query_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `query` (text)
      - `answer` (text)
      - `context` (text array)
      - `sources` (text array)
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `query_history` table
    - Add policies for authenticated users to:
      - Read their own queries
      - Insert new queries
*/

CREATE TABLE IF NOT EXISTS query_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  query text NOT NULL,
  answer text NOT NULL,
  context text[] NOT NULL,
  sources text[] NOT NULL,
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE query_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own queries"
  ON query_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own queries"
  ON query_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
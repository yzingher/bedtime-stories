import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Story = {
  id: string
  player: 'max' | 'lila'
  magical_friend: string
  place: string
  problem: string
  story_text: string
  image_url: string | null
  is_favourite: boolean
  created_at: string
}

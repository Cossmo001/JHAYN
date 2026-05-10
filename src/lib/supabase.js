import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing! Check your .env file and restart the dev server.')
} else {
  // Test connectivity
  fetch(supabaseUrl).then(res => {
    console.log('Supabase connection test:', res.status === 200 ? 'OK' : 'Link valid but returned ' + res.status)
  }).catch(err => {
    console.error('Supabase connection test failed! The URL might be wrong or blocked by an ad-blocker:', err)
  })
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder'
)

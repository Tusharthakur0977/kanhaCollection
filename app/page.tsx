import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import { createSupabaseServerClient } from '@/lib/supabase'

export default async function Home() {
  const supabase = createSupabaseServerClient()
  
  const { data: featuredProducts } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('featured', true)
    .limit(6)

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <FeaturedProducts products={featuredProducts || []} />
    </div>
  )
}
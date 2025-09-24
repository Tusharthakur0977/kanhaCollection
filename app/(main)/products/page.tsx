import ProductsPage from '@/components/ProductsPage'
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function Products() {
  const supabase = createSupabaseServerClient()
  
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .order('created_at', { ascending: false }),
    supabase
      .from('categories')
      .select('*')
      .order('name')
  ])

  return <ProductsPage products={products || []} categories={categories || []} />
}
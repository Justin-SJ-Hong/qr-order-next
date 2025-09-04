import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function GET() {
  try {
    // Supabase 클라이언트 생성 (서버 사이드)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE! // 서비스 롤 키 사용
    )

    // 테이블 목록과 레코드 수 가져오기
    const tableNames = [
      'users', 'stores', 'categories', 'menus', 'option_groups',
      'option_choices', 'orders', 'order_items', 'order_item_options',
      'payments', 'menu_recommendations'
    ]

    const tables = await Promise.all(
      tableNames.map(async (name) => {
        try {
          const { count, error } = await supabase
            .from(name)
            .select('*', { count: 'exact', head: true })
          
          if (error) {
            console.error(`Error counting ${name}:`, error)
            return { name, count: 0 }
          }
          
          return { name, count: count || 0 }
        } catch (error) {
          console.error(`Error with table ${name}:`, error)
          return { name, count: 0 }
        }
      })
    )

    return NextResponse.json({
      status: 'connected',
      tables,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Database health check failed:', error)
    
    return NextResponse.json({
      status: 'error',
      tables: [],
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    // 데이터베이스 연결 테스트
    await prisma.$connect()
    
    // 테이블 목록과 레코드 수 가져오기 (모델 유무와 상관없이 안전하게 집계)
    const tableNames = [
      'users',
      'stores',
      'categories',
      'menus',
      'option_groups',
      'option_choices',
      'orders',
      'order_items',
      'order_item_options',
      'payments',
      'menu_recommendations',
    ] as const

    const tables = await Promise.all(
      tableNames.map(async (name) => {
        try {
          const rows = await prisma.$queryRawUnsafe(
            `SELECT COUNT(*)::bigint AS count FROM "public"."${name}"`
          ) as Array<{ count: bigint }>
          const count = rows?.[0]?.count ?? 0
          return { name, count: Number(count) }
        } catch {
          // 테이블이 없거나 권한 문제 시 0으로 처리
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
  } finally {
    await prisma.$disconnect()
  }
}

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // 데이터베이스 연결 테스트
    await prisma.$connect()
    
    // 테이블 목록과 레코드 수 가져오기
    const tables = await Promise.all([
      { name: 'users', count: await prisma.user.count() },
      { name: 'stores', count: await prisma.store.count() },
      { name: 'categories', count: await prisma.category.count() },
      { name: 'menus', count: await prisma.menu.count() },
      { name: 'option_groups', count: await prisma.optionGroup.count() },
      { name: 'option_choices', count: await prisma.optionChoice.count() },
      { name: 'orders', count: await prisma.order.count() },
      { name: 'order_items', count: await prisma.orderItem.count() },
      { name: 'order_item_options', count: await prisma.orderItemOption.count() },
      { name: 'payments', count: await prisma.payment.count() },
      { name: 'menu_recommendations', count: await prisma.menuRecommendation.count() },
    ])

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

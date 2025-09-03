import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { supabaseServer } from '@/lib/supabase/server'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, email, name } = body

    if (!id || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Supabase Auth에서 사용자 확인
    const supabase = supabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user || user.id !== id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 사용자 프로필 확인/생성
    let userProfile = await prisma.user.findUnique({
      where: { id }
    })

    if (!userProfile) {
      // 새 사용자 생성
      userProfile = await prisma.user.create({
        data: {
          id,
          email,
          name: name || email.split('@')[0],
          role: 'CUSTOMER', // 기본값
          status: 'ACTIVE',
          updatedAt: new Date(),
        }
      })
    } else {
      // 기존 사용자 정보 업데이트 (이메일 변경 등)
      userProfile = await prisma.user.update({
        where: { id },
        data: {
          email,
          name: name || userProfile.name,
          updatedAt: new Date(),
        }
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        status: userProfile.status,
      }
    })

  } catch (error) {
    console.error('Error in profile API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 사용자 프로필 조회
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // 마지막 로그인 시간 업데이트
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    return NextResponse.json({
      success: true,
      user: userProfile
    })

  } catch (error) {
    console.error('Error getting profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

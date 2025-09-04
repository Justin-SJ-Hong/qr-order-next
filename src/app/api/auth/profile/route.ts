import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseServer } from '@/lib/supabase/server'

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
      // 새 사용자 생성 (현재 User 모델에는 role/status가 없습니다)
      userProfile = await prisma.user.create({
        data: {
          id,
          email,
          name: name || email.split('@')[0],
        }
      })
    } else {
      // 기존 사용자 정보 업데이트 (이메일 변경 등)
      userProfile = await prisma.user.update({
        where: { id },
        data: {
          email,
          name: name || userProfile.name,
        }
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
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

export async function GET() {
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

    // (선택) 마지막 로그인 업데이트 필드가 없는 모델이라면 생략

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

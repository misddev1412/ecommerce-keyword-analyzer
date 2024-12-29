import { PrismaClient } from '@prisma/client'
import { H3Event } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Get user ID from auth context (you'll need to implement auth middleware)
    const userId = event.context.auth?.userId

    // Fetch recent analyses
    const analyses = await prisma.productAnalysis.findMany({
      where: {
        userId: userId
      },
      include: {
        keywords: true,
        competitors: true,
        report: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limit to 10 most recent analyses
    })

    return analyses
  } catch (error) {
    console.error('Failed to fetch analyses:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch analyses'
    })
  }
}) 
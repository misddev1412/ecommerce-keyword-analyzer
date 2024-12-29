import { PrismaClient } from '@prisma/client'
import { H3Event } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    const id = event.context.params.id

    const analysis = await prisma.productAnalysis.findUnique({
      where: { id },
      include: {
        keywords: true,
        competitors: true,
        report: true
      }
    })

    if (!analysis) {
      throw createError({
        statusCode: 404,
        message: 'Analysis not found'
      })
    }

    // Check if user has access to this analysis
    if (analysis.userId !== event.context.auth?.userId) {
      throw createError({
        statusCode: 403,
        message: 'Unauthorized access'
      })
    }

    return analysis
  } catch (error) {
    console.error('Failed to fetch analysis:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch analysis'
    })
  }
}) 
import { PrismaClient } from '@prisma/client'
import { H3Event } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    const id = event.context.params.id

    const analysis = await prisma.productAnalysis.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        error: true,
        startedAt: true,
        completedAt: true,
        createdAt: true
      }
    })

    if (!analysis) {
      throw createError({
        statusCode: 404,
        message: 'Analysis not found'
      })
    }

    return {
      id: analysis.id,
      status: analysis.status,
      error: analysis.error,
      timing: {
        created: analysis.createdAt,
        started: analysis.startedAt,
        completed: analysis.completedAt
      }
    }
  } catch (error) {
    console.error('Failed to fetch analysis status:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch analysis status'
    })
  }
}) 
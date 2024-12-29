import { PrismaClient } from '@prisma/client'
import { H3Event } from 'h3'

const prisma = new PrismaClient()

interface ApiError {
  statusCode?: number
  message: string
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const id = event.context.params.id

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Analysis ID is required'
      })
    }

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

    // Format the response
    return {
      id: analysis.id,
      url: analysis.url,
      title: analysis.title,
      description: analysis.description,
      price: analysis.price,
      category: analysis.category,
      platform: analysis.platform,
      status: analysis.status,
      createdAt: analysis.createdAt,
      startedAt: analysis.startedAt,
      completedAt: analysis.completedAt,
      error: analysis.error,
      keywords: analysis.keywords.map(k => ({
        term: k.term,
        searchVolume: k.searchVolume,
        trend: k.trend,
        category: k.category
      })),
      competitors: analysis.competitors.map(c => ({
        title: c.title,
        url: c.url,
        shop: c.shop,
        price: c.price,
        sales: c.sales,
        revenue: c.revenue,
        rating: c.rating,
        platform: c.platform
      })),
      recommendations: analysis.report ? {
        keywords: analysis.report.keywordSuggestions,
        pricing: analysis.report.pricingInsights,
        content: analysis.report.contentSuggestions,
        seo: analysis.report.seoRecommendations
      } : null
    }
  } catch (error: unknown) {
    const apiError = error as ApiError
    console.error('Failed to fetch analysis:', error)
    throw createError({
      statusCode: apiError.statusCode || 500,
      message: apiError.message || 'Failed to fetch analysis'
    })
  }
}) 
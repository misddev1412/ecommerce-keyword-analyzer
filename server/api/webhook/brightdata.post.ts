import { PrismaClient } from '@prisma/client'
import { H3Event } from 'h3'

const prisma = new PrismaClient()

interface BrightDataWebhookData {
  url: string
  title: string
  description: string
  price: string
  sales: number
  rating: number
  shop: string
  error?: string
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    
    // Validate webhook data
    if (!Array.isArray(body) || body.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Invalid webhook data format'
      })
    }

    const productData = body[0] as BrightDataWebhookData

    // If there's an error in the scraping
    if (productData.error) {
      throw new Error(productData.error)
    }

    // Find the analysis record by URL
    const analysis = await prisma.productAnalysis.findFirst({
      where: {
        url: productData.url,
        status: 'processing'
      }
    })

    if (!analysis) {
      throw new Error('No matching analysis found for URL')
    }

    // Update the analysis with scraped data
    await prisma.productAnalysis.update({
      where: { id: analysis.id },
      data: {
        title: productData.title,
        description: productData.description,
        price: parseFloat(productData.price || '0'),
        status: 'completed',
        completedAt: new Date(),
        competitors: {
          create: [{
            url: productData.url,
            title: productData.title,
            shop: productData.shop || 'Unknown Shop',
            price: parseFloat(productData.price || '0'),
            sales: productData.sales || 0,
            revenue: parseFloat(productData.price || '0') * (productData.sales || 0),
            rating: productData.rating || 0,
            platform: analysis.platform
          }]
        }
      }
    })

    return {
      success: true,
      message: 'Webhook processed successfully'
    }
  } catch (error: unknown) {
    console.error('Webhook processing failed:', error)
    
    // If we have an analysis ID, update its status to failed
    if (error instanceof Error && 'analysisId' in error) {
      await prisma.productAnalysis.update({
        where: { id: (error as any).analysisId },
        data: {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          completedAt: new Date()
        }
      })
    }

    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to process webhook'
    })
  }
}) 
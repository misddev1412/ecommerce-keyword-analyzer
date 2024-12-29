import { PrismaClient } from '@prisma/client'
import { H3Event } from 'h3'

const prisma = new PrismaClient()

interface ApiError {
  statusCode?: number
  message: string
}

interface BrightDataResponse {
  error?: string
  data?: Array<{
    title?: string
    description?: string
    price?: string
  }>
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const { url, category, marketplace } = body

    // Validate URL format
    if (!isValidUrl(url)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid URL format'
      })
    }

    // Validate marketplace
    if (!['shopee', 'lazada', 'tiktok'].includes(marketplace)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid marketplace. Must be one of: shopee, lazada, tiktok'
      })
    }

    // Extract domain name for initial title
    const urlObj = new URL(url)
    const initialTitle = urlObj.pathname.split('/').pop() || 'New Analysis'

    // Create initial analysis record with pending status
    const analysis = await prisma.productAnalysis.create({
      data: {
        url,
        title: initialTitle,
        category: category || null,
        platform: marketplace,
        status: 'pending',
        price: null,
        description: null,
        keywords: { create: [] },
        competitors: { create: [] }
      }
    })

    // Call Bright Data API for data extraction
    const config = useRuntimeConfig()
    const brightDataToken = config.brightDataToken
    const brightDataDatasetId = config.brightDataDatasetId
    const supabaseUrl = config.public.supabaseUrl

    if (url.includes('lazada.vn')) {
      try {
        // Update status to processing before calling Bright Data
        await prisma.productAnalysis.update({
          where: { id: analysis.id },
          data: {
            status: 'processing',
            startedAt: new Date()
          }
        })

        // Call Bright Data API
        await $fetch('https://api.brightdata.com/datasets/v3/trigger', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${brightDataToken}`,
            'Content-Type': 'application/json'
          },
          query: {
            dataset_id: brightDataDatasetId,
            endpoint: `${supabaseUrl}/functions/v1/brightdata-webhook`,
            format: 'json',
            uncompressed_webhook: true,
            include_errors: true,
            custom_data: {
              analysisId: analysis.id
            }
          },
          body: [{
            url: url
          }]
        })
      } catch (error) {
        // If Bright Data API call fails, update analysis status
        await prisma.productAnalysis.update({
          where: { id: analysis.id },
          data: {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Failed to trigger analysis',
            completedAt: new Date()
          }
        })
        throw error
      }
    } else {
      // For other platforms - to be implemented
      await prisma.productAnalysis.update({
        where: { id: analysis.id },
        data: {
          status: 'failed',
          error: 'Platform not supported yet',
          completedAt: new Date()
        }
      })
      throw createError({
        statusCode: 400,
        message: 'Platform not supported yet'
      })
    }

    return {
      id: analysis.id,
      url,
      status: 'processing',
      message: 'Analysis started successfully'
    }
  } catch (error: unknown) {
    const apiError = error as ApiError
    console.error('Analysis creation failed:', error)
    throw createError({
      statusCode: apiError.statusCode || 500,
      message: apiError.message || 'Failed to create analysis'
    })
  }
})

// Helper function to validate URL
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
} 
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  try {
    const [shopeeKeywords, lazadaKeywords, tiktokKeywords] = await Promise.all([
      prisma.trendingKeyword.findMany({
        where: { platform: 'shopee' },
        orderBy: { rank: 'asc' },
        take: 5
      }),
      prisma.trendingKeyword.findMany({
        where: { platform: 'lazada' },
        orderBy: { rank: 'asc' },
        take: 5
      }),
      prisma.trendingKeyword.findMany({
        where: { platform: 'tiktok' },
        orderBy: { rank: 'asc' },
        take: 5
      })
    ])

    return {
      shopee: shopeeKeywords.map(k => ({
        keyword: k.term,
        volume: `${Math.round(k.searchVolume / 1000)}K`,
        trend: k.trend
      })),
      lazada: lazadaKeywords.map(k => ({
        keyword: k.term,
        volume: `${Math.round(k.searchVolume / 1000)}K`,
        trend: k.trend
      })),
      tiktok: tiktokKeywords.map(k => ({
        keyword: k.term,
        volume: `${Math.round(k.searchVolume / 1000)}K`,
        trend: k.trend
      }))
    }
  } catch (error) {
    console.error('Failed to fetch trending keywords:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch trending keywords'
    })
  }
}) 
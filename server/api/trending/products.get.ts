import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const { limit = 10 } = getQuery(event)

    const products = await prisma.topProduct.findMany({
      orderBy: [
        { revenue: 'desc' },
        { rank: 'asc' }
      ],
      take: Number(limit)
    })

    return products.map((p, index) => ({
      rank: index + 1,
      name: p.title,
      shop: p.shop,
      platform: p.platform,
      price: p.price,
      sales: p.sales,
      revenue: p.revenue,
      image: p.image || `https://picsum.photos/seed/${p.id}/100`,
      url: p.url
    }))
  } catch (error) {
    console.error('Failed to fetch top products:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch top products'
    })
  }
}) 
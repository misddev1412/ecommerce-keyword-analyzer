import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineNitroPlugin(async (nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    event.context.prisma = prisma
  })

  nitroApp.hooks.hook('error', async (error) => {
    console.error('Prisma Error:', error)
  })

  nitroApp.hooks.hook('close', async () => {
    await prisma.$disconnect()
  })
}) 
import { H3Event } from 'h3'

export default defineEventHandler((event: H3Event) => {
  // For development, we'll use a mock user ID
  // In production, you should implement proper authentication
  event.context.auth = {
    userId: 'mock-user-id'
  }
}) 
import { defineStore } from 'pinia'

interface Keyword {
  keyword: string
  volume: string
  trend: 'up' | 'down'
}

interface Product {
  rank: number
  name: string
  shop: string
  platform: 'Shopee' | 'Lazada' | 'TikTok Shop'
  price: number
  sales: number
  revenue: number
  image: string
  url: string
}

interface TrendingState {
  keywords: {
    shopee: Keyword[]
    lazada: Keyword[]
    tiktok: Keyword[]
  }
  products: Product[]
  loading: boolean
  error: string | null
}

export const useTrendingStore = defineStore('trending', {
  state: (): TrendingState => ({
    keywords: {
      shopee: [],
      lazada: [],
      tiktok: []
    },
    products: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchTrendingKeywords() {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch('/api/trending/keywords')
        this.keywords = response
      } catch (error) {
        console.error('Failed to fetch trending keywords:', error)
        this.error = 'Failed to fetch trending keywords'
      } finally {
        this.loading = false
      }
    },

    async fetchTopProducts() {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch('/api/trending/products')
        this.products = response
      } catch (error) {
        console.error('Failed to fetch top products:', error)
        this.error = 'Failed to fetch top products'
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
}) 
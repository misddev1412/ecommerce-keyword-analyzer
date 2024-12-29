<template>
  <div class="container mx-auto p-4">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        {{ $t('dashboard.hero.title') }}
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        {{ $t('dashboard.hero.subtitle') }}
      </p>

      <!-- Quick Analysis Form -->
      <Card class="max-w-2xl mx-auto">
        <template #content>
          <form @submit.prevent="startAnalysis" class="space-y-4">
            <div class="field">
              <span class="p-input-icon-left w-full">
                <i class="pi pi-link" />
                <InputText
                  v-model="productUrl"
                  :placeholder="$t('dashboard.quickAnalysis.placeholder')"
                  class="w-full p-3"
                />
              </span>
            </div>
            <Button
              type="submit"
              :label="$t('dashboard.quickAnalysis.analyze')"
              icon="pi pi-search"
              class="w-full p-3"
              :loading="analysisStore.loading"
            />
          </form>
        </template>
      </Card>
    </div>

    <!-- Top Keywords by Platform -->
    <div class="mb-12">
      <h2 class="text-2xl font-bold mb-6">{{ $t('dashboard.topKeywords.title') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Shopee Keywords -->
        <Card>
          <template #header>
            <div class="flex items-center gap-2 p-4">
              <img src="/images/shopee-logo.png" alt="Shopee" class="h-6" />
              <h3 class="text-xl font-semibold">{{ $t('dashboard.topKeywords.shopee') }}</h3>
            </div>
          </template>
          <template #content>
            <DataTable :value="shopeeKeywords" :rows="5" class="text-sm">
              <Column field="keyword" :header="$t('dashboard.topKeywords.term')">
                <template #body="slotProps">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold">{{ slotProps.data.keyword }}</span>
                    <Badge v-if="slotProps.data.trend === 'up'" value="↑" severity="success" />
                    <Badge v-else value="↓" severity="danger" />
                  </div>
                </template>
              </Column>
              <Column field="volume" :header="$t('dashboard.topKeywords.volume')" />
            </DataTable>
          </template>
        </Card>

        <!-- Lazada Keywords -->
        <Card>
          <template #header>
            <div class="flex items-center gap-2 p-4">
              <img src="/images/lazada-logo.png" alt="Lazada" class="h-6" />
              <h3 class="text-xl font-semibold">{{ $t('dashboard.topKeywords.lazada') }}</h3>
            </div>
          </template>
          <template #content>
            <DataTable :value="lazadaKeywords" :rows="5" class="text-sm">
              <Column field="keyword" :header="$t('dashboard.topKeywords.term')">
                <template #body="slotProps">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold">{{ slotProps.data.keyword }}</span>
                    <Badge v-if="slotProps.data.trend === 'up'" value="↑" severity="success" />
                    <Badge v-else value="↓" severity="danger" />
                  </div>
                </template>
              </Column>
              <Column field="volume" :header="$t('dashboard.topKeywords.volume')" />
            </DataTable>
          </template>
        </Card>

        <!-- TikTok Shop Keywords -->
        <Card>
          <template #header>
            <div class="flex items-center gap-2 p-4">
              <img src="/images/tiktok-logo.png" alt="TikTok Shop" class="h-6" />
              <h3 class="text-xl font-semibold">{{ $t('dashboard.topKeywords.tiktok') }}</h3>
            </div>
          </template>
          <template #content>
            <DataTable :value="tiktokKeywords" :rows="5" class="text-sm">
              <Column field="keyword" :header="$t('dashboard.topKeywords.term')">
                <template #body="slotProps">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold">{{ slotProps.data.keyword }}</span>
                    <Badge v-if="slotProps.data.trend === 'up'" value="↑" severity="success" />
                    <Badge v-else value="↓" severity="danger" />
                  </div>
                </template>
              </Column>
              <Column field="volume" :header="$t('dashboard.topKeywords.volume')" />
            </DataTable>
          </template>
        </Card>
      </div>
    </div>

    <!-- Top Selling Products -->
    <div class="mb-12">
      <h2 class="text-2xl font-bold mb-6">{{ $t('dashboard.topProducts.title') }}</h2>
      <Card>
        <template #content>
          <DataTable :value="topProducts" :rows="10" :paginator="true" class="text-sm">
            <Column field="rank" :header="$t('dashboard.topProducts.rank')" style="width: 80px">
              <template #body="slotProps">
                <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                  {{ slotProps.data.rank }}
                </div>
              </template>
            </Column>
            <Column field="image" :header="$t('dashboard.topProducts.product')" style="width: 300px">
              <template #body="slotProps">
                <div class="flex items-center gap-3">
                  <img :src="slotProps.data.image" :alt="slotProps.data.name" class="w-12 h-12 object-cover rounded" />
                  <div>
                    <div class="font-semibold">{{ slotProps.data.name }}</div>
                    <div class="text-gray-500 text-xs">{{ slotProps.data.shop }}</div>
                  </div>
                </div>
              </template>
            </Column>
            <Column field="platform" :header="$t('dashboard.topProducts.platform')" style="width: 120px">
              <template #body="slotProps">
                <Tag :value="slotProps.data.platform" :severity="getPlatformSeverity(slotProps.data.platform)" />
              </template>
            </Column>
            <Column field="price" :header="$t('dashboard.topProducts.price')" style="width: 120px">
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.price) }}
              </template>
            </Column>
            <Column field="sales" :header="$t('dashboard.topProducts.sales')" style="width: 120px">
              <template #body="slotProps">
                {{ formatNumber(slotProps.data.sales) }}
              </template>
            </Column>
            <Column field="revenue" :header="$t('dashboard.topProducts.revenue')" style="width: 150px">
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.revenue) }}
              </template>
            </Column>
            <Column style="width: 100px">
              <template #body="slotProps">
                <Button icon="pi pi-external-link" text rounded aria-label="View"
                  @click="openProductLink(slotProps.data.url)" />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <!-- Features Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Card v-for="feature in features" :key="feature.icon">
        <template #content>
          <div class="text-center">
            <i :class="['pi text-4xl mb-4 text-blue-600', feature.icon]" />
            <h3 class="text-xl font-semibold mb-2">{{ $t(feature.title) }}</h3>
            <p class="text-gray-600">{{ $t(feature.description) }}</p>
          </div>
        </template>
      </Card>
    </div>

    <!-- Recent Analyses -->
    <div v-if="analysisStore.recentAnalyses.length > 0">
      <h2 class="text-2xl font-bold mb-6">{{ $t('dashboard.recentAnalyses.title') }}</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card v-for="analysis in analysisStore.recentAnalyses" :key="analysis.id" class="hover:shadow-lg transition-shadow">
          <template #header>
            <img :src="getProductImage(analysis)" :alt="analysis.title" class="w-full h-48 object-cover" />
          </template>
          <template #title>
            <div class="truncate">{{ analysis.title }}</div>
          </template>
          <template #subtitle>
            <div class="text-sm text-gray-500">
              {{ new Date(analysis.createdAt).toLocaleDateString() }}
            </div>
          </template>
          <template #content>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="font-semibold">${{ analysis.price }}</span>
                <Tag :value="analysis.category" />
              </div>
              <div class="flex gap-2">
                <Chip v-for="keyword in analysis.keywords.slice(0, 3)" :key="keyword.id" :label="keyword.term" />
              </div>
            </div>
          </template>
          <template #footer>
            <div class="flex justify-between items-center">
              <Button
                icon="pi pi-eye"
                :label="$t('dashboard.recentAnalyses.viewDetails')"
                text
                @click="viewAnalysis(analysis.id)"
              />
              <Button
                icon="pi pi-refresh"
                :label="$t('dashboard.recentAnalyses.reanalyze')"
                outlined
                @click="reanalyzeProduct(analysis.url)"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Error Message -->
    <ErrorMessage
      v-if="analysisStore.error"
      :error="analysisStore.error"
      @dismiss="analysisStore.clearError()"
    />
  </div>
</template>

<script setup lang="ts">
import { useAnalysisStore } from '~/stores/analysis'
import { useTrendingStore } from '~/stores/trending'

const analysisStore = useAnalysisStore()
const trendingStore = useTrendingStore()
const router = useRouter()
const productUrl = ref('')

useHead({
  title: 'Trendyki - Phân tích sản phẩm thông minh',
  meta: [
    { name: 'description', content: 'Phân tích sản phẩm và từ khóa thông minh cho người bán hàng online.' }
  ]
})

// Use trending store data
const shopeeKeywords = computed(() => trendingStore.keywords.shopee)
const lazadaKeywords = computed(() => trendingStore.keywords.lazada)
const tiktokKeywords = computed(() => trendingStore.keywords.tiktok)
const topProducts = computed(() => trendingStore.products)

const features = [
  {
    icon: 'pi-chart-line',
    title: 'dashboard.features.keywords.title',
    description: 'dashboard.features.keywords.description'
  },
  {
    icon: 'pi-users',
    title: 'dashboard.features.competitors.title',
    description: 'dashboard.features.competitors.description'
  },
  {
    icon: 'pi-compass',
    title: 'dashboard.features.recommendations.title',
    description: 'dashboard.features.recommendations.description'
  }
]

// Utility functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value)
}

type Platform = 'Shopee' | 'Lazada' | 'TikTok Shop'
const getPlatformSeverity = (platform: Platform) => {
  const severities: Record<Platform, string> = {
    'Shopee': 'warning',
    'Lazada': 'info',
    'TikTok Shop': 'success'
  }
  return severities[platform] || 'primary'
}

const startAnalysis = async () => {
  if (!productUrl.value) return

  try {
    const result = await analysisStore.createAnalysis({
      url: productUrl.value,
      category: 'auto-detect',
      marketplace: detectMarketplace(productUrl.value)
    })
    router.push(`/analysis/${result.id}`)
  } catch (error) {
    // Error is handled by the store
  }
}

const viewAnalysis = (id: string) => {
  router.push(`/analysis/${id}`)
}

const reanalyzeProduct = async (url: string) => {
  productUrl.value = url
  await startAnalysis()
}

const getProductImage = (analysis: any) => {
  // In production, you should get the actual product image
  return `https://picsum.photos/seed/${analysis.id}/400/300`
}

const detectMarketplace = (url: string) => {
  if (url.includes('shopee')) return 'shopee'
  if (url.includes('lazada')) return 'lazada'
  if (url.includes('tiktok')) return 'tiktok'
  return 'other'
}

const openProductLink = (url: string) => {
  window.open(url, '_blank')
}

onMounted(() => {
  Promise.all([
    analysisStore.fetchRecentAnalyses(),
    trendingStore.fetchTrendingKeywords(),
    trendingStore.fetchTopProducts()
  ])
})
</script> 
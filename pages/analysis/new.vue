<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">{{ $t('analysis.newAnalysis') }}</h1>

    <Card class="mb-6">
      <template #title>{{ $t('analysis.productDetails') }}</template>
      <template #content>
        <form @submit.prevent="submitAnalysis" class="space-y-4">
          <div class="field">
            <label for="url" class="block mb-2">{{ $t('analysis.productUrl') }}</label>
            <InputText id="url" v-model="formData.url" class="w-full" :placeholder="$t('analysis.urlPlaceholder')" />
          </div>

          <div class="field">
            <label for="category" class="block mb-2">{{ $t('analysis.category') }}</label>
            <Dropdown id="category" v-model="formData.category" :options="categories" class="w-full" />
          </div>

          <div class="field">
            <label for="marketplace" class="block mb-2">{{ $t('analysis.marketplace') }}</label>
            <SelectButton v-model="formData.marketplace" :options="marketplaces" />
          </div>

          <Button type="submit" :label="$t('analysis.analyze')" icon="pi pi-search" :loading="analysisStore.loading" />
        </form>
      </template>
    </Card>

    <!-- Analysis Results -->
    <div v-if="analysisResults" class="space-y-6">
      <!-- Keywords Section -->
      <Card>
        <template #title>{{ $t('analysis.extractedKeywords') }}</template>
        <template #content>
          <DataTable :value="analysisResults.keywords" :paginator="true" :rows="5">
            <Column field="term" :header="$t('analysis.keyword')" sortable></Column>
            <Column field="searchVolume" :header="$t('analysis.searchVolume')" sortable></Column>
            <Column field="score" :header="$t('analysis.relevanceScore')" sortable></Column>
          </DataTable>
        </template>
      </Card>

      <!-- Competitor Analysis -->
      <Card>
        <template #title>{{ $t('analysis.competitorAnalysis') }}</template>
        <template #content>
          <DataTable :value="analysisResults.competitors" :paginator="true" :rows="5">
            <Column field="title" :header="$t('analysis.productTitle')" sortable></Column>
            <Column field="price" :header="$t('analysis.price')" sortable></Column>
            <Column field="rating" :header="$t('analysis.rating')" sortable></Column>
          </DataTable>
        </template>
      </Card>

      <!-- Recommendations -->
      <Card>
        <template #title>{{ $t('analysis.recommendations') }}</template>
        <template #content>
          <ul class="space-y-2">
            <li v-for="(rec, index) in analysisResults.recommendations" :key="index" class="flex items-start">
              <i class="pi pi-check-circle mr-2 mt-1 text-green-500"></i>
              <span>{{ rec }}</span>
            </li>
          </ul>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnalysisStore } from '~/stores/analysis'

const analysisStore = useAnalysisStore()
const router = useRouter()

useHead({
  title: 'New Product Analysis - Trendyki',
  meta: [
    { name: 'description', content: 'Analyze your product URL to get keyword recommendations and competitor insights.' }
  ]
})

const formData = ref({
  url: '',
  category: null as string | null,
  marketplace: null as string | null
})

const categories = ref([
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Toys & Games',
  'Beauty & Personal Care'
])

const marketplaces = ref([
  { label: 'Amazon', value: 'amazon' },
  { label: 'eBay', value: 'ebay' },
  { label: 'Etsy', value: 'etsy' }
])

const analysisResults = ref(null)

const submitAnalysis = async () => {
  try {
    const result = await analysisStore.createAnalysis({
      url: formData.value.url,
      category: formData.value.category || '',
      marketplace: formData.value.marketplace || ''
    })
    analysisResults.value = result
    // Navigate to analysis details page after successful creation
    router.push(`/analysis/${result.id}`)
  } catch (error) {
    // Error is handled by the store
  }
}
</script> 
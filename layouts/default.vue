<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <!-- Logo and Navigation -->
          <div class="flex items-center gap-8">
            <NuxtLink to="/" class="text-2xl font-bold text-blue-600">
              Trendyki
            </NuxtLink>
            <nav class="hidden md:flex items-center gap-4">
              <NuxtLink
                v-for="item in menuItems"
                :key="item.path"
                :to="item.path"
                class="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {{ $t(item.label) }}
              </NuxtLink>
            </nav>
          </div>

          <!-- Right Side -->
          <div class="flex items-center gap-4">
            <LanguageSwitcher />
            <Button
              icon="pi pi-plus"
              :label="$t('analysis.newAnalysis')"
              @click="router.push('/analysis/new')"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-auto">
      <div class="container mx-auto px-4 py-6">
        <div class="text-center text-gray-600">
          © {{ new Date().getFullYear() }} Trendyki. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const menuItems = [
  { path: '/', label: 'dashboard' },
  { path: '/keywords', label: 'keywords' },
  { path: '/trends', label: 'trends' }
]
</script>

<style>
.router-link-active {
  @apply text-blue-600 font-medium;
}
</style> 
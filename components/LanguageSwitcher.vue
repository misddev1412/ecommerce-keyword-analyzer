<template>
  <div class="flex items-center gap-2">
    <Button
      v-for="locale in availableLocales"
      :key="locale.code"
      :label="locale.name"
      :outlined="locale.code !== currentLocale"
      :text="locale.code !== currentLocale"
      size="small"
      @click="switchLanguage(locale.code)"
    />
  </div>
</template>

<script setup lang="ts">
const { locale: currentLocale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

const availableLocales = computed(() => {
  return (locales.value as Array<{ code: string; name: string }>).map(l => ({
    code: l.code,
    name: l.name
  }))
})

const switchLanguage = (localeCode: string) => {
  const path = switchLocalePath(localeCode)
  if (path) {
    router.push(path)
  }
}
</script> 
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '../stores/app'
import { getPurchaseGuideView } from '../utils/purchaseGuide'

const appStore = useAppStore()
const expanded = ref(false)
const guide = computed(() => getPurchaseGuideView(appStore.config?.purchase_guide, appStore.locale))
const steps = computed(() => guide.value?.steps || [])
const hasPrimaryAction = computed(() => Boolean(guide.value?.primaryButtonUrl && guide.value?.primaryButtonText))
const detailButtonText = computed(() => expanded.value
  ? guide.value?.collapseButtonText || guide.value?.detailButtonText || ''
  : guide.value?.detailButtonText || '')
</script>

<template>
  <section v-if="guide" class="relative z-10 border-b theme-border pb-8">
    <div class="container mx-auto px-4">
      <div class="rounded-2xl border theme-panel p-5 shadow-sm sm:p-6">
        <div class="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div class="min-w-0">
            <span v-if="guide.badge" class="inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-slate-950">{{ guide.badge }}</span>
            <h2 class="mt-3 text-lg font-black leading-snug theme-text-primary sm:text-xl">{{ guide.title }}</h2>
            <p v-if="guide.description" class="mt-2 text-sm leading-6 theme-text-secondary">{{ guide.description }}</p>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row md:w-[128px] md:flex-col">
            <a v-if="hasPrimaryAction" :href="guide.primaryButtonUrl" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-slate-950">{{ guide.primaryButtonText }}</a>
            <button v-if="steps.length && detailButtonText" type="button" class="inline-flex min-h-[40px] items-center justify-center rounded-xl border theme-border px-4 py-2 text-sm font-bold theme-text-primary" @click="expanded = !expanded">{{ detailButtonText }}</button>
          </div>
        </div>
        <div v-if="steps.length" class="mt-4 flex flex-wrap gap-2">
          <div v-for="step in steps" :key="`guide-chip-${step.index}`" class="inline-flex min-h-[34px] items-center gap-2 rounded-full border theme-border px-3 py-1.5 text-sm font-medium theme-text-secondary">
            <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white dark:bg-white dark:text-slate-950">{{ step.index }}</span>
            <span>{{ step.title || step.description || step.url }}</span>
          </div>
        </div>
        <div v-if="expanded && steps.length" class="mt-5 border-t theme-border pt-4">
          <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div v-for="step in steps" :key="`guide-step-${step.index}`" class="rounded-2xl border theme-border bg-slate-50/70 p-4 dark:bg-white/[0.03]">
              <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-base font-black text-white dark:bg-white dark:text-slate-950">{{ step.index }}</span>
              <h3 v-if="step.title" class="mt-5 text-sm font-black theme-text-primary">{{ step.title }}</h3>
              <p v-if="step.description" class="mt-2 text-sm leading-6 theme-text-secondary">{{ step.description }}</p>
              <a v-if="step.url" :href="step.url" target="_blank" rel="noopener noreferrer" class="mt-3 block break-all font-mono text-xs font-semibold text-sky-600 underline">{{ step.url }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

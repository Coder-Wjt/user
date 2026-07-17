export type LocalizedText = Record<string, string>

export interface PurchaseGuideStepConfig {
  title?: LocalizedText
  description?: LocalizedText
  url?: string
}

export interface PurchaseGuideConfig {
  enabled?: boolean
  badge?: LocalizedText
  title?: LocalizedText
  description?: LocalizedText
  primary_button_text?: LocalizedText
  primary_button_url?: string
  detail_button_text?: LocalizedText
  collapse_button_text?: LocalizedText
  steps?: PurchaseGuideStepConfig[]
}

export interface PurchaseGuideView {
  badge: string
  title: string
  description: string
  primaryButtonText: string
  primaryButtonUrl: string
  detailButtonText: string
  collapseButtonText: string
  steps: Array<{ index: string; title: string; description: string; url: string }>
}

export const localizedText = (value: unknown, locale: string): string => {
  if (!value || typeof value !== 'object') return ''
  const record = value as Record<string, unknown>
  for (const key of [locale, 'zh-CN', 'en-US', 'zh-TW']) {
    const text = record[key]
    if (typeof text === 'string' && text.trim() !== '') return text.trim()
  }
  return ''
}

const normalizedURL = (value: unknown): string => typeof value === 'string' ? value.trim() : ''

export const getPurchaseGuideView = (raw: unknown, locale: string): PurchaseGuideView | null => {
  if (!raw || typeof raw !== 'object') return null
  const guide = raw as PurchaseGuideConfig
  if (guide.enabled !== true) return null
  const title = localizedText(guide.title, locale)
  if (!title) return null
  const steps = Array.isArray(guide.steps)
    ? guide.steps.map((step) => ({
        title: localizedText(step?.title, locale),
        description: localizedText(step?.description, locale),
        url: normalizedURL(step?.url),
      })).filter((step) => step.title || step.description || step.url)
        .map((step, index) => ({ ...step, index: String(index + 1) }))
    : []
  return {
    badge: localizedText(guide.badge, locale), title,
    description: localizedText(guide.description, locale),
    primaryButtonText: localizedText(guide.primary_button_text, locale),
    primaryButtonUrl: normalizedURL(guide.primary_button_url),
    detailButtonText: localizedText(guide.detail_button_text, locale),
    collapseButtonText: localizedText(guide.collapse_button_text, locale),
    steps,
  }
}

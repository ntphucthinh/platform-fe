import { MOCK_ALL_ITINERARIES } from '@/constants/itineraryConstant'
import type {
  ITravelItinerary,
  ICreateItineraryInput,
  IUpdateItineraryInput,
  IItineraryListItem,
  ItineraryStatus,
} from '@/types/pages/itineraries/itinerary'

const STORAGE_KEY = 'platform_travel_itineraries_data'

// In-memory store with sessionStorage sync
let itineraryStore: ITravelItinerary[] = (() => {
  if (typeof window !== 'undefined') {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as ITravelItinerary[]
      }
    } catch {
      // Fallback to initial mock if parsing fails
    }
  }
  return [...MOCK_ALL_ITINERARIES]
})()

const listeners = new Set<() => void>()

// Stable cached snapshots – same reference until data mutates.
// useSyncExternalStore requires getSnapshot to return the same value
// between renders when nothing has changed; returning a fresh array/object
// each time causes an infinite loop.
let cachedListItems: IItineraryListItem[] | null = null
let cachedStore: ITravelItinerary[] | null = null

function buildListItems(): IItineraryListItem[] {
  return itineraryStore.map((item) => {
    const activityCount = item.days.reduce(
      (acc, day) => acc + (day.activities?.length || 0),
      0,
    )
    const status: ItineraryStatus =
      item.status === 'Đã hoàn thiện' ? 'Đã hoàn thiện' : 'Bản nháp'
    return {
      id: item.id,
      title: item.title,
      destination: item.destination,
      duration:
        item.duration ||
        `${item.durationDays || item.days.length} ngày ${
          item.durationNights ??
          Math.max(0, (item.durationDays || item.days.length) - 1)
        } đêm`,
      daysCount: item.days.length,
      activityCount,
      status,
      updatedAt: item.updatedAt || 'Hôm nay',
      description: item.description,
      coverImage: item.coverImage,
      hasDetailPreview: true,
    }
  })
}

function invalidateCaches(): void {
  cachedListItems = null
  cachedStore = null
}

function notifyListeners(): void {
  invalidateCaches()
  listeners.forEach((listener) => {
    try {
      listener()
    } catch {
      // Ignore listener error
    }
  })
}

function persistStore(): void {
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(itineraryStore))
    } catch {
      // Ignore storage error
    }
  }
  notifyListeners()
}

export function subscribeItineraries(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Stable snapshot for useSyncExternalStore – same reference until mutation */
export function getItineraries(): ITravelItinerary[] {
  if (!cachedStore) {
    cachedStore = [...itineraryStore]
  }
  return cachedStore
}

/** Stable snapshot for useSyncExternalStore – same reference until mutation */
export function getItineraryListItems(): IItineraryListItem[] {
  if (!cachedListItems) {
    cachedListItems = buildListItems()
  }
  return cachedListItems
}

/**
 * Resolves itinerary by exact ID or numeric alias ('1', '2', '3', '4')
 */
export function getItineraryById(id: string): ITravelItinerary | undefined {
  if (!id) return undefined

  // 1. Exact match
  const exact = itineraryStore.find((it) => it.id === id)
  if (exact) return exact

  // 2. Numeric aliases for standard sample itineraries
  if (id === '1') {
    return (
      itineraryStore.find((it) => it.id === 'itinerary-dalat-3n2d') ||
      itineraryStore[0]
    )
  }
  if (id === '2') {
    return (
      itineraryStore.find((it) => it.id === 'itinerary-danang-4n3d') ||
      itineraryStore[1]
    )
  }
  if (id === '3') {
    return (
      itineraryStore.find((it) => it.id === 'itinerary-nhatrang-3n2d') ||
      itineraryStore[2]
    )
  }
  if (id === '4') {
    return (
      itineraryStore.find((it) => it.id === 'itinerary-vungtau-2n1d') ||
      itineraryStore[3]
    )
  }

  // 3. Fallback partial ID match (e.g., "dalat" -> "itinerary-dalat-3n2d")
  const partial = itineraryStore.find(
    (it) => it.id.includes(id) || id.includes(it.id),
  )
  if (partial) return partial

  return undefined
}

export function createItinerary(input: ICreateItineraryInput): ITravelItinerary {
  const daysCount = input.durationDays || input.days.length || 1
  const nightsCount =
    input.durationNights !== undefined
      ? input.durationNights
      : Math.max(0, daysCount - 1)

  const durationStr =
    input.duration || `${daysCount} ngày ${nightsCount} đêm`

  const todayStr = new Date().toLocaleDateString('vi-VN')

  const newItinerary: ITravelItinerary = {
    id: `itinerary-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: input.title.trim(),
    destination: input.destination.trim(),
    duration: durationStr,
    durationDays: daysCount,
    durationNights: nightsCount,
    description: input.description.trim(),
    coverImage: input.coverImage,
    status: input.status || 'Bản nháp',
    suitableFor: input.suitableFor || 'Mọi đối tượng',
    themes: input.themes.length > 0 ? input.themes : ['Du lịch', 'Khám phá'],
    highlights: input.highlights || [
      {
        id: `hl-${Date.now()}-1`,
        title: input.destination,
        subtitle: 'Điểm đến hấp dẫn',
        icon: 'nature',
      },
    ],
    days: input.days.map((d, idx) => ({
      ...d,
      id: d.id || `day-${idx + 1}-${Date.now()}`,
      dayNumber: idx + 1,
      activities: (d.activities || []).map((act, actIdx) => ({
        ...act,
        id: act.id || `act-${idx + 1}-${actIdx + 1}-${Date.now()}`,
      })),
    })),
    featuredImages: input.featuredImages || [
      {
        id: `img-${Date.now()}`,
        title: input.title,
        url: input.coverImage,
        caption: input.destination,
      },
    ],
    travelTips:
      input.travelTips && input.travelTips.length > 0
        ? input.travelTips
        : [
            'Thời gian di chuyển có thể thay đổi tùy tình hình giao thông.',
            'Nên chuẩn bị trang phục phù hợp với thời tiết điểm đến.',
            'Lịch trình có thể tùy chỉnh linh hoạt theo nhu cầu thực tế.',
          ],
    createdAt: new Date().toISOString(),
    updatedAt: todayStr,
  }

  itineraryStore = [newItinerary, ...itineraryStore]
  persistStore()
  return newItinerary
}

export function updateItinerary(
  id: string,
  input: IUpdateItineraryInput,
): ITravelItinerary | null {
  const existing = getItineraryById(id)
  if (!existing) return null

  const targetId = existing.id
  const index = itineraryStore.findIndex((it) => it.id === targetId)
  if (index === -1) return null

  const daysCount =
    input.durationDays || input.days?.length || existing.durationDays || 1
  const nightsCount =
    input.durationNights !== undefined
      ? input.durationNights
      : existing.durationNights !== undefined
      ? existing.durationNights
      : Math.max(0, daysCount - 1)

  const durationStr =
    input.duration || `${daysCount} ngày ${nightsCount} đêm`

  const todayStr = new Date().toLocaleDateString('vi-VN')

  const updated: ITravelItinerary = {
    ...existing,
    ...input,
    id: targetId,
    title: input.title !== undefined ? input.title.trim() : existing.title,
    destination:
      input.destination !== undefined
        ? input.destination.trim()
        : existing.destination,
    description:
      input.description !== undefined
        ? input.description.trim()
        : existing.description,
    duration: durationStr,
    durationDays: daysCount,
    durationNights: nightsCount,
    coverImage: input.coverImage || existing.coverImage,
    status: input.status || existing.status,
    suitableFor: input.suitableFor ?? existing.suitableFor,
    themes: input.themes || existing.themes,
    days: (input.days || existing.days).map((d, idx) => ({
      ...d,
      id: d.id || `day-${idx + 1}-${Date.now()}`,
      dayNumber: idx + 1,
      activities: (d.activities || []).map((act, actIdx) => ({
        ...act,
        id: act.id || `act-${idx + 1}-${actIdx + 1}-${Date.now()}`,
      })),
    })),
    featuredImages: input.featuredImages || existing.featuredImages,
    travelTips: input.travelTips || existing.travelTips,
    highlights: input.highlights || existing.highlights,
    updatedAt: todayStr,
  }

  itineraryStore[index] = updated
  persistStore()
  return updated
}

export function deleteItinerary(id: string): boolean {
  const existing = getItineraryById(id)
  if (!existing) return false

  itineraryStore = itineraryStore.filter((it) => it.id !== existing.id)
  persistStore()
  return true
}

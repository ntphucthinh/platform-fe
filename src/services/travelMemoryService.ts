import { MOCK_TRAVEL_MEMORIES } from "@/constants/travelMemoryConstant";
import type {
  ITravelMemory,
  ITravelMemoryDay,
} from "@/types/pages/travel-memories/travelMemory";

const STORAGE_KEY = "platform_travel_memories_data";

// In-memory store with sessionStorage sync
let memoryStore: ITravelMemory[] = (() => {
  if (typeof window !== "undefined") {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as ITravelMemory[];
      }
    } catch {
      // Fallback to initial mock if parsing fails
    }
  }
  return [...MOCK_TRAVEL_MEMORIES];
})();

const listeners = new Set<() => void>();

function notifyListeners(): void {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Ignore listener error
    }
  });
}

function persistStore(): void {
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memoryStore));
    } catch {
      // Ignore storage error
    }
  }
  notifyListeners();
}

export function subscribeTravelMemories(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getTravelMemories(): ITravelMemory[] {
  return [...memoryStore];
}

export function getTravelMemoryById(id: string): ITravelMemory | undefined {
  return memoryStore.find((m) => m.id === id);
}

export interface ICreateTravelMemoryInput {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
  coverImage: string;
  days: ITravelMemoryDay[];
}

export function createTravelMemory(
  input: ICreateTravelMemoryInput,
): ITravelMemory {
  const newMemory: ITravelMemory = {
    ...input,
    id: `trip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryStore = [newMemory, ...memoryStore];
  persistStore();
  return newMemory;
}

export interface IUpdateTravelMemoryInput {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
  coverImage: string;
  days: ITravelMemoryDay[];
}

export function updateTravelMemory(
  id: string,
  input: IUpdateTravelMemoryInput,
): ITravelMemory | null {
  const index = memoryStore.findIndex((m) => m.id === id);
  if (index === -1) return null;

  const updated: ITravelMemory = {
    ...memoryStore[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  memoryStore = [
    ...memoryStore.slice(0, index),
    updated,
    ...memoryStore.slice(index + 1),
  ];
  persistStore();
  return updated;
}

export function deleteTravelMemory(id: string): boolean {
  const initialLength = memoryStore.length;
  memoryStore = memoryStore.filter((m) => m.id !== id);
  if (memoryStore.length !== initialLength) {
    persistStore();
    return true;
  }
  return false;
}

export function resetTravelMemoriesToDefault(): void {
  memoryStore = [...MOCK_TRAVEL_MEMORIES];
  persistStore();
}

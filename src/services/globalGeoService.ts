import { Country, State } from "country-state-city";

export interface IGlobalCountry {
  name: string; // Tên quốc gia (tiếng Anh)
  iso2: string; // Mã ISO alpha-2 (VN, US, JP,...)
  vietnameseName: string; // Tên tiếng Việt ("Việt Nam" hoặc tên tiếng Anh)
  flagUrl: string; // URL cờ SVG
}

export interface IGlobalState {
  id: string;
  name: string; // Tên bang/tỉnh/vùng
  countryCode: string;
  countryName: string;
  stateCode: string;
  latitude: number | null;
  longitude: number | null;
}

// Danh sách 250 quốc gia từ package country-state-city (ưu tiên Việt Nam lên đầu)
const GLOBAL_COUNTRIES: IGlobalCountry[] = Country.getAllCountries()
  .map((c) => {
    const code = c.isoCode.toUpperCase();
    const isVN = code === "VN";
    return {
      name: c.name,
      iso2: code,
      vietnameseName: isVN ? "Việt Nam" : c.name,
      flagUrl: `https://flagcdn.com/${code.toLowerCase()}.svg`,
    };
  })
  .sort((a, b) => {
    if (a.iso2 === "VN") return -1;
    if (b.iso2 === "VN") return 1;
    return a.name.localeCompare(b.name);
  });

const countryByCodeMap = new Map<string, IGlobalCountry>(
  GLOBAL_COUNTRIES.map((c) => [c.iso2, c]),
);

const statesCache = new Map<string, IGlobalState[]>();

/**
 * Lấy danh sách toàn bộ 250 quốc gia (Việt Nam đứng đầu)
 */
export function getAllCountries(): IGlobalCountry[] {
  return GLOBAL_COUNTRIES;
}

/**
 * Tìm quốc gia theo mã ISO alpha-2
 */
export function findCountryByCode(iso2?: string): IGlobalCountry | undefined {
  if (!iso2) return undefined;
  return countryByCodeMap.get(iso2.toUpperCase());
}

/**
 * Lấy danh sách tỉnh/bang/vùng của quốc gia từ package country-state-city
 */
export function getStatesByCountryCode(countryCode?: string): IGlobalState[] {
  if (!countryCode) return [];
  const code = countryCode.toUpperCase();
  if (statesCache.has(code)) {
    return statesCache.get(code)!;
  }

  const country = findCountryByCode(code);
  const countryName = country?.name || code;
  const rawStates = State.getStatesOfCountry(code);

  const mapped: IGlobalState[] = rawStates
    .map((s, idx) => ({
      id: `${code}-${s.isoCode || idx}`,
      name: s.name,
      countryCode: code,
      countryName,
      stateCode: s.isoCode,
      latitude: s.latitude ? Number(s.latitude) : null,
      longitude: s.longitude ? Number(s.longitude) : null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  statesCache.set(code, mapped);
  return mapped;
}

/**
 * Tìm tỉnh/bang theo mã quốc gia và mã/tên bang
 */
export function findStateByCode(
  countryCode?: string,
  stateCodeOrName?: string,
): IGlobalState | undefined {
  if (!countryCode || !stateCodeOrName) return undefined;
  const states = getStatesByCountryCode(countryCode);
  const target = stateCodeOrName.toUpperCase();
  return states.find(
    (s) =>
      s.stateCode.toUpperCase() === target ||
      s.name.toUpperCase() === target,
  );
}

/**
 * Ánh xạ an toàn cho các địa điểm cũ chưa có countryCode
 */
export function findDestinationForLegacyLocation(
  nameOrAddress?: string,
): { country: IGlobalCountry; state: IGlobalState } | undefined {
  if (!nameOrAddress) return undefined;
  const vnCountry = findCountryByCode("VN");
  if (!vnCountry) return undefined;
  const vnStates = getStatesByCountryCode("VN");
  const lower = nameOrAddress.toLowerCase();

  const matched = vnStates.find((s) =>
    lower.includes(s.name.toLowerCase()),
  );
  if (matched) return { country: vnCountry, state: matched };

  return undefined;
}

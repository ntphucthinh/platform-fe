import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs, { type Dayjs } from "dayjs";
import { useCountries, type IGlobalCountry } from "@/hooks/common/useGlobalGeo";
import useTravelLocationSelection from "@/hooks/selections/useTravelLocationSelection";

export interface UseTravelMemoryFiltersOptions {
  perPage?: number;
}

export function useTravelMemoryFilters(options?: UseTravelMemoryFiltersOptions) {
  const [searchParams, setSearchParams] = useSearchParams();
  const perPage = options?.perPage ?? 10;

  // 1. Page query parameter (1-based)
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const page = !isNaN(pageParam) && pageParam > 0 ? pageParam : 1;

  // 2. Year query parameter
  const yearParam = searchParams.get("year");
  const parsedYear =
    yearParam && !isNaN(parseInt(yearParam, 10))
      ? parseInt(yearParam, 10)
      : null;

  const selectedYear = useMemo<Dayjs | null>(() => {
    if (!parsedYear) return null;
    const d = dayjs().year(parsedYear).startOf("year");
    return d.isValid() ? d : null;
  }, [parsedYear]);

  // 3. Country & Location query parameters
  const countryParam = searchParams.get("country")?.trim() || "";
  const locationParam = searchParams.get("locationId");
  const locationFilter: number | "" =
    locationParam && !isNaN(parseInt(locationParam, 10))
      ? parseInt(locationParam, 10)
      : "";

  // 4. Countries list from global geo hook
  const countries = useCountries();

  // 5. Locations selection filtered by country
  const { travelLocationsSelections, data: locationData } =
    useTravelLocationSelection({
      countryCode: countryParam || undefined,
    });

  // 6. Country filter (từ URL param hoặc suy luận từ locationFilter)
  const countryFilter = useMemo(() => {
    if (countryParam) return countryParam;
    if (locationFilter !== "") {
      const matched = locationData.find((l) => l.id === locationFilter);
      if (matched?.countryCode) {
        return matched.countryCode;
      }
    }
    return "";
  }, [countryParam, locationFilter, locationData]);

  // 7. Selected country object for Autocomplete
  const selectedCountry = useMemo<IGlobalCountry | null>(() => {
    if (!countryFilter) return null;
    return countries.find((c) => c.iso2 === countryFilter) ?? null;
  }, [countries, countryFilter]);

  // 8. Selected location object for Autocomplete
  const selectedLocation = useMemo(() => {
    if (locationFilter === "") return null;
    const foundInOptions = travelLocationsSelections.find(
      (loc) => Number(loc.value) === Number(locationFilter),
    );
    if (foundInOptions) return foundInOptions;
    const foundInRaw = locationData.find((l) => l.id === locationFilter);
    if (foundInRaw) {
      return { label: foundInRaw.name, value: foundInRaw.id };
    }
    return null;
  }, [travelLocationsSelections, locationData, locationFilter]);

  const isFiltered =
    Boolean(parsedYear) || Boolean(countryParam) || Boolean(locationParam);

  // Handlers
  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", newPage.toString());
      return next;
    });
  };

  const handleYearChange = (newValue: Dayjs | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      if (newValue && newValue.isValid()) {
        next.set("year", newValue.year().toString());
      } else {
        next.delete("year");
      }
      return next;
    });
  };

  const handleCountryChange = (newCountryCode: string) => {
    const code = (newCountryCode || "").trim();

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      if (code) {
        next.set("country", code);
      } else {
        next.delete("country");
      }
      next.delete("locationId");
      return next;
    });
  };

  const handleLocationChange = (newLocationId: number | "") => {
    let nextCountryCode = countryParam;

    if (newLocationId !== "") {
      const selectedLoc = locationData.find((l) => l.id === newLocationId);
      if (selectedLoc?.countryCode) {
        nextCountryCode = selectedLoc.countryCode;
      }
    }

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      if (nextCountryCode) {
        next.set("country", nextCountryCode);
      } else {
        next.delete("country");
      }
      if (newLocationId !== "") {
        next.set("locationId", newLocationId.toString());
      } else {
        next.delete("locationId");
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      next.delete("year");
      next.delete("country");
      next.delete("locationId");
      return next;
    });
  };

  return {
    page,
    perPage,
    parsedYear,
    selectedYear,
    countryParam,
    countryFilter,
    selectedCountry,
    countries,
    locationParam,
    locationFilter,
    selectedLocation,
    travelLocationsSelections,
    locationData,
    isFiltered,
    handlePageChange,
    handleYearChange,
    handleCountryChange,
    handleLocationChange,
    handleResetFilters,
  };
}

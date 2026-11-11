import { AppResource } from "@/constants/resources";
import { useSelect } from "@refinedev/core";

export interface ITravelLocationSelectionItem {
  id: number;
  name: string;
  countryCode: string;
}

type Props = {
  countryCode?: string;
  enabled?: boolean;
};

const useTravelLocationSelection = (props?: Props) => {
  const country = props?.countryCode?.trim();

  const { options: travelLocationsSelections, query } =
    useSelect<ITravelLocationSelectionItem>({
      resource: AppResource.SelectionsTravelLocations,
      optionLabel: "name",
      optionValue: "id",
      pagination: {
        mode: "off",
      },
      queryOptions: {
        enabled: props?.enabled ?? true,
      },
      meta: country
        ? {
            queryParams: {
              countryCode: country,
            },
          }
        : undefined,
    });

  return {
    travelLocationsSelections,
    data: (query.data?.data ?? []) as ITravelLocationSelectionItem[],
    isLoading: query.isLoading,
  };
};

export default useTravelLocationSelection;
export { useTravelLocationSelection };


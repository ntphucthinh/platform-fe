import { AppResource } from "@/constants/resources";
import { useSelect } from "@refinedev/core";

export interface ITravelThemeSelectionItem {
  id: number;
  name: string;
}

type Props = {
  enabled?: boolean;
};

const useTravelThemeSelection = (props?: Props) => {
  const { options: travelThemesSelections, query } =
    useSelect<ITravelThemeSelectionItem>({
      resource: AppResource.SelectionsTravelThemes,
      optionLabel: "name",
      optionValue: "id",
      pagination: {
        mode: "off",
      },
      queryOptions: {
        enabled: props?.enabled ?? true,
      },
    });

  return {
    travelThemesSelections,
    data: (query.data?.data ?? []) as ITravelThemeSelectionItem[],
    isLoading: query.isLoading,
  };
};

export default useTravelThemeSelection;
export { useTravelThemeSelection };

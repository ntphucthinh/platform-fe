import { createContext } from "react";
import type { HeaderTitleContextType } from "@/types/ui/header";

export const HeaderTitleContext = createContext<HeaderTitleContextType | undefined>(undefined);

import { ReactNode, useContext, useEffect, useState } from "react";
import { HeaderTitleContext } from "@/components/ui/header/headerTitleContext";
import { APP_NAME } from "@/constants/commonConstant";

export const HeaderTitleProvider = ({ children }: { children: ReactNode }) => {
  const [headerTitle, setHeaderTitle] = useState("");
  return (
    <HeaderTitleContext.Provider value={{ headerTitle, setHeaderTitle }}>
      {children}
    </HeaderTitleContext.Provider>
  );
};

export const HeaderTitle = ({ children }: { children: string }) => {
  const context = useContext(HeaderTitleContext);
  const setHeaderTitle = context?.setHeaderTitle;

  useEffect(() => {
    if (children && setHeaderTitle) {
      setHeaderTitle(children);
    }
    if (children) {
      document.title = `${children} | ${APP_NAME}`;
    }
    return () => {
      document.title = APP_NAME;
    };
  }, [children, setHeaderTitle]);

  return null;
};

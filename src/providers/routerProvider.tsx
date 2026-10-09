import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
import { CustomThemeProvider } from "@/components/theme/theme";
import { HeaderTitleProvider } from "@/components/ui/header/headerTitle";
import { AdminLayout } from "@/components/ui/layout/adminLayout";
import { Login } from "@/pages/auth/login";
import { Home } from "@/pages/home/home";
import { UsersList } from "@/pages/users/list";
import { UsersCreate } from "@/pages/users/create";
import { UsersEdit } from "@/pages/users/edit";
import { UsersSetting } from "@/pages/users/setting";
import { resources } from "@/router/resources";
import { ErrorComponent } from '@refinedev/mui';

export function AppProvider() {
  return (
    <CustomThemeProvider>
      <HeaderTitleProvider>
        <BrowserRouter>
          <Refine
            routerProvider={routerProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: false,
              projectId: "platform-fe",
            }}
            resources={resources}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                element={
                  <AdminLayout>
                    <Outlet />
                  </AdminLayout>
                }
              >
                <Route index element={<Home />} />

                <Route path="users">
                  <Route
                    index
                    element={<Navigate to="/users/list" replace />}
                  />
                  <Route path="list" element={<UsersList />} />
                  <Route path="create" element={<UsersCreate />} />
                  <Route path="edit/:id" element={<UsersEdit />} />
                  <Route path="setting" element={<UsersSetting />} />
                </Route>

                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
          </Refine>
        </BrowserRouter>
      </HeaderTitleProvider>
    </CustomThemeProvider>
  );
}

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
import { AdminAuthGuard } from "@/components/auth/adminAuthGuard";
import { Login } from "@/pages/auth/login";
import { Home } from "@/pages/home/home";
import { UsersList } from "@/pages/users/list";
import { UsersCreate } from "@/pages/users/create";
import { UsersEdit } from "@/pages/users/edit";
import { UsersSetting } from "@/pages/users/setting";
import { HomestayListingPage } from "@/pages/homestay/listing";
import { HomestayDetailPage } from "@/pages/homestay/detail";
import { AdminHomestayPage } from "@/pages/admin/homestay/index";
import { ItineraryListPage } from "@/pages/admin/itineraries/index";
import { ItineraryPreviewPage } from "@/pages/admin/itineraries/preview";
import { TravelMemoryListPage } from "@/pages/admin/travel-memories/index";
import { TravelMemoryCreatePage } from "@/pages/admin/travel-memories/create";
import { TravelMemoryDetailPage } from "@/pages/admin/travel-memories/detail";
import { TravelMemoryEditPage } from "@/pages/admin/travel-memories/edit";
import { resources } from "@/router/resources";
import { ErrorComponent } from "@refinedev/mui";

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
              {/* Public Website Routes — Root '/' is the public main discovery page */}
              <Route path="/" element={<HomestayListingPage />} />
              <Route path="/homestay" element={<HomestayListingPage />} />
              <Route path="/homestay/:id" element={<HomestayDetailPage />} />

              {/* Admin Authentication Route */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/login" element={<Navigate to="/admin/login" replace />} />

              {/* Protected Admin Dashboard & Management Routes */}
              <Route
                element={
                  <AdminAuthGuard>
                    <AdminLayout>
                      <Outlet />
                    </AdminLayout>
                  </AdminAuthGuard>
                }
              >
                <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="admin/dashboard" element={<Home />} />
                <Route path="admin/homestay" element={<AdminHomestayPage />} />
                <Route path="admin/itineraries" element={<ItineraryListPage />} />
                <Route path="admin/itineraries/preview" element={<ItineraryPreviewPage />} />
                <Route path="admin/itineraries/:id/preview" element={<ItineraryPreviewPage />} />
                <Route path="admin/travel-memories" element={<TravelMemoryListPage />} />
                <Route path="admin/travel-memories/create" element={<TravelMemoryCreatePage />} />
                <Route path="admin/travel-memories/:id" element={<TravelMemoryDetailPage />} />
                <Route path="admin/travel-memories/:id/edit" element={<TravelMemoryEditPage />} />

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

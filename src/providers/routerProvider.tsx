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
import { ItineraryCreatePage } from "@/pages/admin/itineraries/create";
import { ItineraryEditPage } from "@/pages/admin/itineraries/edit";
import { TravelMemoryListPage } from "@/pages/admin/travel-memories/index";
import { TravelMemoryCreatePage } from "@/pages/admin/travel-memories/create";
import { TravelMemoryDetailPage } from "@/pages/admin/travel-memories/detail";
import { TravelMemoryEditPage } from "@/pages/admin/travel-memories/edit";
import { resources } from "@/router/resources";
import { ErrorComponent } from "@refinedev/mui";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { viVN } from "@mui/x-date-pickers/locales";
import "dayjs/locale/vi";

export function AppProvider() {
  return (
    <CustomThemeProvider>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="vi"
        localeText={
          viVN.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
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
              <Route
                path="/login"
                element={<Navigate to="/admin/login" replace />}
              />

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
                {/* Admin */}
                <Route path="admin">
                  <Route
                    index
                    element={<Navigate to="/admin/dashboard" replace />}
                  />

                  <Route path="dashboard" element={<Home />} />

                  <Route path="homestay" element={<AdminHomestayPage />} />

                  {/* Itineraries */}
                  <Route path="itineraries">
                    <Route index element={<ItineraryListPage />} />
                    <Route path="create" element={<ItineraryCreatePage />} />
                    <Route
                      path=":id/preview"
                      element={<ItineraryPreviewPage />}
                    />
                    <Route path=":id/edit" element={<ItineraryEditPage />} />
                  </Route>

                  {/* Travel Memories */}
                  <Route path="travel-memories">
                    <Route index element={<TravelMemoryListPage />} />
                    <Route path="create" element={<TravelMemoryCreatePage />} />
                    <Route path=":id" element={<TravelMemoryDetailPage />} />
                    <Route path=":id/edit" element={<TravelMemoryEditPage />} />
                  </Route>
                </Route>

                {/* Users */}
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

                {/* Not Found */}
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
          </Refine>
        </BrowserRouter>
      </HeaderTitleProvider>
      </LocalizationProvider>
    </CustomThemeProvider>
  );
}

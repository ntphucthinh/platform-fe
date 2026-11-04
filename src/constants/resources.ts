export enum AppResource {
  // Auth
  Login = "auth/login",
  Logout = "auth/logout",
  Refresh = "auth/refresh",
  Me = "auth/me",

  // Homestay
  Homestay = "homestays",
  HomestayID = "homestays/:id",

  // Travel location
  TravelLocation = "travel-locations",
  TravelLocationID = "travel-locations/:id",

  // Upload
  Upload = "uploads",
}

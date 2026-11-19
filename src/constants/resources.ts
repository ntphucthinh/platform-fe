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

  // Travel memory
  TravelMemory = "travel-memories",
  TravelMemoryID = "travel-memories/:id",

  // Itinerary
  Itinerary = "itineraries",
  ItineraryID = "itineraries/:id",

  // Selections
  SelectionsTravelLocations = "selections/travel-locations",
  SelectionsTravelThemes = "selections/travel-themes",

  // Upload
  Upload = "uploads",
}

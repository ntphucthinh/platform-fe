import type { ILocation } from "@/types/pages/travel-map/travelMap";

export interface ILocationMemoryRelation {
  locationId: string;
  memoryId: string;
}

export interface ILocationItineraryRelation {
  locationId: string;
  itineraryId: string;
}

export const VIETNAM_DEFAULT_CENTER: [number, number] = [16.0544, 107.5];
export const VIETNAM_DEFAULT_ZOOM = 6;

export const MOCK_LOCATIONS: ILocation[] = [
  {
    id: "loc-dalat",
    countryCode: "VN",
    countryName: "Vietnam",
    stateCode: "35",
    provinceCode: "35",
    name: "Lâm Đồng",
    address: "Lâm Đồng, Việt Nam",
    latitude: 11.661496,
    longitude: 108.133528,
    coverImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Thành phố Đà Lạt ngàn hoa trên cao nguyên Lâm Viên với khí hậu se lạnh quanh năm, rừng thông và những hồ nước thơ mộng.",
    notes: "Nên mang áo ấm, ghé hồ Tuyền Lâm sáng sớm ngắm sương mù.",
    googleMapsUrl: "https://www.google.com/maps?q=11.661496,108.133528",
    createdAt: "2023-01-10T08:00:00Z",
    updatedAt: "2026-06-15T09:00:00Z",
  },
  {
    id: "loc-danang",
    countryCode: "VN",
    countryName: "Vietnam",
    stateCode: "DN",
    provinceCode: "DN",
    name: "Đà Nẵng",
    address: "Đà Nẵng, Việt Nam",
    latitude: 16.068,
    longitude: 108.212,
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Thành phố biển năng động và đáng sống với bãi biển Mỹ Khê cát mịn, bán đảo Sơn Trà và những cây cầu biểu tượng.",
    notes: "Cầu Rồng phun lửa vào tối thứ 7 và Chủ nhật lúc 21h00.",
    googleMapsUrl: "https://www.google.com/maps?q=16.068,108.212",
    createdAt: "2022-08-10T08:00:00Z",
    updatedAt: "2025-07-14T08:00:00Z",
  },
  {
    id: "loc-hoian",
    countryCode: "VN",
    countryName: "Vietnam",
    stateCode: "29",
    provinceCode: "29",
    name: "Quảng Ngãi",
    address: "Quảng Ngãi, Việt Nam",
    latitude: 15.121387,
    longitude: 108.804414,
    coverImage:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Vùng đất duyên hải miền Trung giàu truyền thống văn hóa Sa Huỳnh, đảo Lý Sơn ngọc ngà và bãi biển trong lành.",
    notes: "Nên thuê tàu cao tốc ra đảo Lý Sơn sáng sớm ngắm cổng Tò Vò.",
    googleMapsUrl: "https://www.google.com/maps?q=15.121387,108.804414",
    createdAt: "2024-05-15T08:00:00Z",
    updatedAt: "2026-08-23T10:00:00Z",
  },
  {
    id: "loc-phuquoc",
    countryCode: "VN",
    countryName: "Vietnam",
    stateCode: "44",
    provinceCode: "44",
    name: "An Giang",
    address: "An Giang, Việt Nam",
    latitude: 10.318867,
    longitude: 105.043249,
    coverImage:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Vùng đất Thất Sơn huyền bí miền Tây Nam Bộ với rừng tràm Trà Sư bạt ngàn, miếu Bà Chúa Xứ và chợ nổi Châu Đốc.",
    notes: "Nên đi xuồng ba lá len lỏi rừng tràm Trà Sư vào mùa nước nổi.",
    googleMapsUrl: "https://www.google.com/maps?q=10.318867,105.043249",
    createdAt: "2023-04-10T08:00:00Z",
    updatedAt: "2026-09-19T08:00:00Z",
  },
  {
    id: "loc-ninhbinh",
    countryCode: "VN",
    countryName: "Vietnam",
    stateCode: "18",
    provinceCode: "18",
    name: "Ninh Bình",
    address: "Ninh Bình, Việt Nam",
    latitude: 20.250615,
    longitude: 105.974454,
    coverImage:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Quần thể danh thắng Tràng An di sản văn hóa và thiên nhiên thế giới với núi đá vôi sừng sững bên dòng sông thơ mộng.",
    notes: "Nên leo Hang Múa lúc chiều mát để ngắm toàn cảnh thung lũng Tam Cốc.",
    googleMapsUrl: "https://www.google.com/maps?q=20.250615,105.974454",
    createdAt: "2026-10-01T08:00:00Z",
    updatedAt: "2026-11-08T11:00:00Z",
  },
  {
    id: "loc-hanoi",
    countryCode: "VN",
    countryName: "Vietnam",
    stateCode: "HN",
    provinceCode: "HN",
    name: "Hà Nội",
    address: "Hà Nội, Việt Nam",
    latitude: 21.028333,
    longitude: 105.854041,
    coverImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Thủ đô ngàn năm văn hiến với 36 phố phường, hồ Gươm thơ mộng và nét văn hóa ẩm thực tinh tế bậc nhất.",
    notes: "Nên thưởng thức cà phê trứng Đinh hoặc Giảng, dạo quanh hồ Gươm vào sớm mùa thu.",
    googleMapsUrl: "https://www.google.com/maps?q=21.028333,105.854041",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2025-10-13T09:00:00Z",
  },
  {
    id: "loc-sapa",
    countryCode: "VN",
    countryName: "Vietnam",
    stateCode: "02",
    provinceCode: "02",
    name: "Lào Cai",
    address: "Lào Cai, Việt Nam",
    latitude: 22.500394,
    longitude: 103.96562,
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Thị xã Sa Pa trong mây với những thửa ruộng bậc thang kỳ vĩ, thung lũng Mường Hoa và đỉnh Fansipan nóc nhà Đông Dương.",
    notes: "Mùa đông có thể có sương muối và băng tuyết, cần trang bị đồ ấm.",
    googleMapsUrl: "https://www.google.com/maps?q=22.500394,103.96562",
    createdAt: "2024-11-01T08:00:00Z",
    updatedAt: "2024-12-21T08:00:00Z",
  },
  {
    id: "loc-hue",
    countryCode: "VN",
    countryName: "Vietnam",
    stateCode: "26",
    provinceCode: "26",
    name: "Huế",
    address: "Huế, Việt Nam",
    latitude: 16.553047,
    longitude: 107.690038,
    coverImage:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Cố đô trầm mặc với quần thể di tích Đại Nội triều Nguyễn, lăng tẩm uy nghiêm và dòng sông Hương êm đềm.",
    notes: "Nên đi thuyền rồng nghe ca Huế trên sông Hương vào buổi tối và ghé chùa Thiên Mụ.",
    googleMapsUrl: "https://www.google.com/maps?q=16.553047,107.690038",
    createdAt: "2023-06-15T08:00:00Z",
    updatedAt: "2023-07-23T09:00:00Z",
  },
  {
    id: "loc-hcmc",
    countryCode: "VN",
    countryName: "Vietnam",
    stateCode: "SG",
    provinceCode: "SG",
    name: "Hồ Chí Minh",
    address: "Hồ Chí Minh, Việt Nam",
    latitude: 10.77639,
    longitude: 106.701139,
    coverImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Trung tâm kinh tế sầm uất bậc nhất cả nước, nơi giao thoa giữa nét văn hóa hiện đại và truyền thống Sài Gòn xưa.",
    notes: "Đi xe buýt sông Saigon Waterbus ngắm hoàng hôn rất mát mẻ và dạo phố đi bộ Nguyễn Huệ.",
    googleMapsUrl: "https://www.google.com/maps?q=10.77639,106.701139",
    createdAt: "2025-03-01T08:00:00Z",
    updatedAt: "2025-04-21T08:00:00Z",
  },
  {
    id: "loc-nhatrang",
    countryCode: "VN",
    countryName: "Vietnam",
    stateCode: "34",
    provinceCode: "34",
    name: "Khánh Hòa",
    address: "Khánh Hòa, Việt Nam",
    latitude: 12.298075,
    longitude: 108.995039,
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Thành phố biển Nha Trang xinh đẹp với bãi biển cong hình trăng khuyết và hệ sinh thái vịnh biển trong lành.",
    notes: "Đã ghé thăm trong chuyến công tác ngắn, dự định thêm ảnh kỷ niệm sau.",
    googleMapsUrl: "https://www.google.com/maps?q=12.298075,108.995039",
    createdAt: "2025-01-15T08:00:00Z",
    updatedAt: "2025-01-15T08:00:00Z",
  },
  {
    id: "loc-quangninh",
    countryCode: "VN",
    countryName: "Vietnam",
    stateCode: "13",
    provinceCode: "13",
    name: "Quảng Ninh",
    address: "Quảng Ninh, Việt Nam",
    latitude: 21.171805,
    longitude: 107.201274,
    coverImage:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    status: "Wishlist",
    description:
      "Di sản thiên nhiên thế giới Vịnh Hạ Long với hàng nghìn đảo đá vôi kỳ vĩ và những bãi biển xanh ngọc bích.",
    notes: "Dự định lên kế hoạch đi du thuyền ngủ đêm trên vịnh vào mùa hè.",
    googleMapsUrl: "https://www.google.com/maps?q=21.171805,107.201274",
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-01-05T08:00:00Z",
  },
  {
    id: "loc-cantho",
    countryCode: "VN",
    countryName: "Vietnam",
    stateCode: "CT",
    provinceCode: "CT",
    name: "Cần Thơ",
    address: "Cần Thơ, Việt Nam",
    latitude: 10.036463,
    longitude: 105.787582,
    coverImage:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    status: "Wishlist",
    description:
      "Thủ phủ miền Tây sông nước với chợ nổi Cái Răng tấp nập, bến Ninh Kiều và vườn cây ăn trái trĩu quả.",
    notes: "Muốn trải nghiệm chợ nổi Cái Răng lúc sáng sớm.",
    googleMapsUrl: "https://www.google.com/maps?q=10.036463,105.787582",
    createdAt: "2026-02-10T08:00:00Z",
    updatedAt: "2026-02-10T08:00:00Z",
  },
  {
    id: "loc-tuyenquang",
    countryCode: "VN",
    countryName: "Vietnam",
    stateCode: "07",
    provinceCode: "07",
    name: "Tuyên Quang",
    address: "Tuyên Quang, Việt Nam",
    latitude: 21.819228,
    longitude: 105.214935,
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    status: "Wishlist",
    description:
      "Vùng đất lịch sử Tân Trào với danh thắng hồ Na Hang – Lâm Bình được ví như 'Hạ Long trên núi'.",
    notes: "Dự kiến đi vào mùa lễ hội Thành Tuyên để ngắm mô hình đèn Trung thu khổng lồ.",
    googleMapsUrl: "https://www.google.com/maps?q=21.819228,105.214935",
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-03-01T08:00:00Z",
  },
  {
    id: "loc-vungtau",
    countryCode: "VN",
    countryName: "Vietnam",
    stateCode: "39",
    provinceCode: "39",
    name: "Đồng Nai",
    address: "Đồng Nai, Việt Nam",
    latitude: 11.428545,
    longitude: 107.162425,
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    status: "Wishlist",
    description:
      "Cửa ngõ miền Đông Nam Bộ với khu du lịch sinh thái Bửu Long, rừng quốc gia Cát Tiên và tuyến ven biển Vũng Tàu.",
    notes: "Đã có sẵn lịch trình 2 ngày 1 đêm nghỉ dưỡng cuối tuần trong kế hoạch.",
    googleMapsUrl: "https://www.google.com/maps?q=11.428545,107.162425",
    createdAt: "2026-03-15T08:00:00Z",
    updatedAt: "2026-03-15T08:00:00Z",
  },
  {
    id: "loc-tokyo",
    countryCode: "JP",
    countryName: "Japan",
    stateCode: "13",
    provinceCode: "13",
    name: "Tokyo",
    address: "Tokyo, Nhật Bản",
    latitude: 35.67686,
    longitude: 139.763895,
    coverImage:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    status: "Wishlist",
    description:
      "Thủ đô Tokyo hiện đại kết hợp truyền thống với tháp Tokyo, đền cổ Sensoji và giao lộ Shibuya sầm uất bậc nhất.",
    notes: "Kế hoạch đi vào mùa hoa anh đào nở rộ từ cuối tháng 3 đến đầu tháng 4.",
    googleMapsUrl: "https://www.google.com/maps?q=35.67686,139.763895",
    createdAt: "2026-03-20T08:00:00Z",
    updatedAt: "2026-03-20T08:00:00Z",
  },
  {
    id: "loc-paris",
    countryCode: "FR",
    countryName: "France",
    stateCode: "75C",
    provinceCode: "75C",
    name: "Paris",
    address: "Paris, Pháp",
    latitude: 48.856614,
    longitude: 2.352222,
    coverImage:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    status: "Wishlist",
    description:
      "Kinh đô ánh sáng hoa lệ với tháp Eiffel, bảo tàng Louvre, nhà thờ Đức Bà và đại lộ Champs-Élysées.",
    notes: "Nên đặt vé bảo tàng Louvre trước và đi du thuyền ngắm hoàng hôn trên sông Seine.",
    googleMapsUrl: "https://www.google.com/maps?q=48.856614,2.352222",
    createdAt: "2026-03-22T08:00:00Z",
    updatedAt: "2026-03-22T08:00:00Z",
  },
  {
    id: "loc-seoul",
    countryCode: "KR",
    countryName: "South Korea",
    stateCode: "11",
    provinceCode: "11",
    name: "Seoul",
    address: "Seoul, Hàn Quốc",
    latitude: 37.566535,
    longitude: 126.977969,
    coverImage:
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Thủ đô văn hóa sôi động với hoàng cung Gyeongbokgung cổ kính, phố cổ Bukchon Hanok và tháp N Seoul.",
    notes: "Nên thuê trang phục Hanbok để được miễn phí vé vào cổng các cung điện.",
    googleMapsUrl: "https://www.google.com/maps?q=37.566535,126.977969",
    createdAt: "2025-10-20T08:00:00Z",
    updatedAt: "2025-10-29T08:00:00Z",
  },
];

export const LOCATION_MEMORY_RELATIONS: ILocationMemoryRelation[] = [
  // Đà Lạt / Lâm Đồng (4 trips across multiple years)
  { locationId: "loc-dalat", memoryId: "trip-dalat-2026" },
  { locationId: "loc-dalat", memoryId: "trip-dalat-2025" },
  { locationId: "loc-dalat", memoryId: "trip-dalat-2024" },
  { locationId: "loc-dalat", memoryId: "trip-dalat-2023" },

  // Đà Nẵng (3 trips across multiple years)
  { locationId: "loc-danang", memoryId: "trip-danang-2025" },
  { locationId: "loc-danang", memoryId: "trip-danang-2024" },
  { locationId: "loc-danang", memoryId: "trip-danang-2022" },

  // Hội An / Quảng Ngãi (2 trips)
  { locationId: "loc-hoian", memoryId: "trip-hoian-2026" },
  { locationId: "loc-hoian", memoryId: "trip-danang-2024" },

  // Phú Quốc / An Giang (2 trips)
  { locationId: "loc-phuquoc", memoryId: "trip-phuquoc-2026" },
  { locationId: "loc-phuquoc", memoryId: "trip-phuquoc-2023" },

  // Ninh Bình (1 trip)
  { locationId: "loc-ninhbinh", memoryId: "trip-ninhbinh-2026" },

  // Hà Nội (2 trips)
  { locationId: "loc-hanoi", memoryId: "trip-hanoi-2025" },
  { locationId: "loc-hanoi", memoryId: "trip-hanoi-2024" },

  // Sa Pa / Lào Cai (1 trip)
  { locationId: "loc-sapa", memoryId: "trip-sapa-2024" },

  // Huế (1 trip)
  { locationId: "loc-hue", memoryId: "trip-hue-2023" },

  // TP. Hồ Chí Minh (1 trip)
  { locationId: "loc-hcmc", memoryId: "trip-hcmc-2025" },

  // Seoul, Hàn Quốc (1 trip)
  { locationId: "loc-seoul", memoryId: "trip-seoul-2025" },
];

export const LOCATION_ITINERARY_RELATIONS: ILocationItineraryRelation[] = [
  { locationId: "loc-dalat", itineraryId: "itinerary-dalat-3n2d" },
  { locationId: "loc-danang", itineraryId: "itinerary-danang-4n3d" },
  { locationId: "loc-hoian", itineraryId: "itinerary-danang-4n3d" },
  { locationId: "loc-nhatrang", itineraryId: "itinerary-nhatrang-3n2d" },
  { locationId: "loc-vungtau", itineraryId: "itinerary-vungtau-2n1d" },
];

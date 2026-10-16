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
    name: "Đà Lạt",
    address: "Thành phố Đà Lạt, Tỉnh Lâm Đồng",
    latitude: 11.9404,
    longitude: 108.4583,
    coverImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Thành phố ngàn hoa trên cao nguyên Lâm Viên với khí hậu se lạnh quanh năm, rừng thông và những hồ nước thơ mộng.",
    notes: "Nên mang áo ấm, ghé hồ Tuyền Lâm sáng sớm ngắm sương mù.",
    googleMapsUrl: "https://maps.google.com/?q=Da+Lat",
    createdAt: "2023-01-10T08:00:00Z",
    updatedAt: "2026-06-15T09:00:00Z",
  },
  {
    id: "loc-danang",
    name: "Đà Nẵng",
    address: "Thành phố Đà Nẵng",
    latitude: 16.0544,
    longitude: 108.2022,
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Thành phố biển năng động và đáng sống với bãi biển Mỹ Khê cát mịn, bán đảo Sơn Trà và những cây cầu biểu tượng.",
    notes: "Cầu Rồng phun lửa vào tối thứ 7 và Chủ nhật lúc 21h00.",
    googleMapsUrl: "https://maps.google.com/?q=Da+Nang",
    createdAt: "2022-08-10T08:00:00Z",
    updatedAt: "2025-07-14T08:00:00Z",
  },
  {
    id: "loc-hoian",
    name: "Hội An",
    address: "Thành phố Hội An, Tỉnh Quảng Nam",
    latitude: 15.8801,
    longitude: 108.338,
    coverImage:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Đô thị cổ kính với những ngôi nhà sơn vàng, giàn hoa giấy rực rỡ và những đêm rằm lung linh ánh đèn lồng trên sông Hoài.",
    notes: "Nên thuê xe đạp đi dạo phố cổ và ghé biển An Bàng.",
    googleMapsUrl: "https://maps.google.com/?q=Hoi+An",
    createdAt: "2024-05-15T08:00:00Z",
    updatedAt: "2026-08-23T10:00:00Z",
  },
  {
    id: "loc-phuquoc",
    name: "Phú Quốc",
    address: "Thành phố Phú Quốc, Tỉnh Kiên Giang",
    latitude: 10.2899,
    longitude: 103.984,
    coverImage:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Đảo ngọc thiên đường với biển xanh ngọc bích, bãi cát trắng mịn màng và điểm ngắm hoàng hôn tuyệt đẹp.",
    notes: "Bãi Sao cát rất mịn, cano đi 4 đảo ngắm san hô cực kỳ đẹp.",
    googleMapsUrl: "https://maps.google.com/?q=Phu+Quoc",
    createdAt: "2023-04-10T08:00:00Z",
    updatedAt: "2026-09-19T08:00:00Z",
  },
  {
    id: "loc-ninhbinh",
    name: "Ninh Bình",
    address: "Tỉnh Ninh Bình",
    latitude: 20.2506,
    longitude: 105.9745,
    coverImage:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Quần thể danh thắng Tràng An di sản thế giới với núi đá vôi sừng sững bên dòng sông thơ mộng.",
    notes: "Nên leo Hang Múa lúc chiều mát để ngắm toàn cảnh thung lũng.",
    googleMapsUrl: "https://maps.google.com/?q=Ninh+Binh",
    createdAt: "2026-10-01T08:00:00Z",
    updatedAt: "2026-11-08T11:00:00Z",
  },
  {
    id: "loc-hanoi",
    name: "Hà Nội",
    address: "Thủ đô Hà Nội",
    latitude: 21.0285,
    longitude: 105.8542,
    coverImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Thủ đô ngàn năm văn hiến với 36 phố phường, hồ Gươm thơ mộng và nét văn hóa ẩm thực tinh tế.",
    notes: "Nên thưởng thức cà phê trứng Đinh hoặc Giảng, bún chả Hàng Quạt.",
    googleMapsUrl: "https://maps.google.com/?q=Ha+Noi",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2025-10-13T09:00:00Z",
  },
  {
    id: "loc-sapa",
    name: "Sa Pa",
    address: "Thị xã Sa Pa, Tỉnh Lào Cai",
    latitude: 22.3364,
    longitude: 103.8438,
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Thị trấn trong mây với những thửa ruộng bậc thang kỳ vĩ và đỉnh Fansipan nóc nhà Đông Dương.",
    notes: "Mùa đông có thể có sương muối và băng tuyết, cần trang bị đồ ấm.",
    googleMapsUrl: "https://maps.google.com/?q=Sa+Pa",
    createdAt: "2024-11-01T08:00:00Z",
    updatedAt: "2024-12-21T08:00:00Z",
  },
  {
    id: "loc-hue",
    name: "Huế",
    address: "Thành phố Huế, Tỉnh Thừa Thiên Huế",
    latitude: 16.4637,
    longitude: 107.5909,
    coverImage:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Cố đô tĩnh lặng với quần thể di tích Đại Nội, lăng tẩm các vị vua và dòng sông Hương êm đềm.",
    notes: "Nên đi thuyền rồng nghe ca Huế trên sông Hương vào buổi tối.",
    googleMapsUrl: "https://maps.google.com/?q=Hue",
    createdAt: "2023-06-15T08:00:00Z",
    updatedAt: "2023-07-23T09:00:00Z",
  },
  {
    id: "loc-hcmc",
    name: "TP. Hồ Chí Minh",
    address: "Thành phố Hồ Chí Minh",
    latitude: 10.8231,
    longitude: 106.6297,
    coverImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Trung tâm kinh tế sầm uất bậc nhất cả nước, nơi giao thoa giữa nét văn hóa hiện đại và truyền thống.",
    notes: "Đi xe buýt sông Saigon Waterbus ngắm hoàng hôn rất mát mẻ.",
    googleMapsUrl: "https://maps.google.com/?q=Ho+Chi+Minh+City",
    createdAt: "2025-03-01T08:00:00Z",
    updatedAt: "2025-04-21T08:00:00Z",
  },
  {
    id: "loc-nhatrang",
    name: "Nha Trang",
    address: "Thành phố Nha Trang, Tỉnh Khánh Hòa",
    latitude: 12.2388,
    longitude: 109.1967,
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    status: "Visited",
    description:
      "Thành phố biển xinh đẹp với bãi biển cong hình trăng khuyết và hệ sinh thái vịnh biển trong lành.",
    notes: "Đã ghé thăm trong chuyến công tác ngắn, dự định thêm ảnh kỷ niệm sau.",
    googleMapsUrl: "https://maps.google.com/?q=Nha+Trang",
    createdAt: "2025-01-15T08:00:00Z",
    updatedAt: "2025-01-15T08:00:00Z",
  },
  {
    id: "loc-quynhon",
    name: "Quy Nhơn",
    address: "Thành phố Quy Nhơn, Tỉnh Bình Định",
    latitude: 13.782,
    longitude: 109.2197,
    coverImage:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80",
    status: "Wishlist",
    description:
      "Vùng biển hoang sơ tuyệt đẹp với Kỳ Co, Eo Gió và con đường ven biển đầy nắng gió.",
    notes: "Dự định lên kế hoạch đi vào mùa hè từ tháng 5 đến tháng 7.",
    googleMapsUrl: "https://maps.google.com/?q=Quy+Nhon",
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-01-05T08:00:00Z",
  },
  {
    id: "loc-cantho",
    name: "Cần Thơ",
    address: "Thành phố Cần Thơ",
    latitude: 10.0452,
    longitude: 105.7469,
    coverImage:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    status: "Wishlist",
    description:
      "Thủ phủ miền Tây sông nước với chợ nổi Cái Răng tấp nập, bến Ninh Kiều và vườn cây ăn trái trĩu quả.",
    notes: "Muốn trải nghiệm chợ nổi Cái Răng lúc sáng sớm.",
    googleMapsUrl: "https://maps.google.com/?q=Can+Tho",
    createdAt: "2026-02-10T08:00:00Z",
    updatedAt: "2026-02-10T08:00:00Z",
  },
  {
    id: "loc-hagiang",
    name: "Hà Giang",
    address: "Tỉnh Hà Giang",
    latitude: 22.8233,
    longitude: 104.9839,
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    status: "Wishlist",
    description:
      "Cao nguyên đá Đồng Văn hùng vĩ, đèo Mã Pí Lèng hiểm trở và dòng sông Nho Quế màu xanh ngọc lục bảo.",
    notes: "Dự kiến đi vào mùa hoa tam giác mạch vào tháng 10 - tháng 11.",
    googleMapsUrl: "https://maps.google.com/?q=Ha+Giang",
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-03-01T08:00:00Z",
  },
  {
    id: "loc-vungtau",
    name: "Vũng Tàu",
    address: "Thành phố Vũng Tàu, Tỉnh Bà Rịa - Vũng Tàu",
    latitude: 10.346,
    longitude: 107.0843,
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    status: "Wishlist",
    description:
      "Thành phố biển gần Sài Gòn, lý tưởng cho những chuyến đi nghỉ dưỡng thư giãn cuối tuần.",
    notes: "Đã có sẵn lịch trình 2 ngày 1 đêm trong kế hoạch.",
    googleMapsUrl: "https://maps.google.com/?q=Vung+Tau",
    createdAt: "2026-03-15T08:00:00Z",
    updatedAt: "2026-03-15T08:00:00Z",
  },
];

export const LOCATION_MEMORY_RELATIONS: ILocationMemoryRelation[] = [
  // Đà Lạt (4 trips across multiple years)
  { locationId: "loc-dalat", memoryId: "trip-dalat-2026" },
  { locationId: "loc-dalat", memoryId: "trip-dalat-2025" },
  { locationId: "loc-dalat", memoryId: "trip-dalat-2024" },
  { locationId: "loc-dalat", memoryId: "trip-dalat-2023" },

  // Đà Nẵng (3 trips across multiple years)
  { locationId: "loc-danang", memoryId: "trip-danang-2025" },
  { locationId: "loc-danang", memoryId: "trip-danang-2024" },
  { locationId: "loc-danang", memoryId: "trip-danang-2022" },

  // Hội An (2 trips: one dedicated, one shared with Danang)
  { locationId: "loc-hoian", memoryId: "trip-hoian-2026" },
  { locationId: "loc-hoian", memoryId: "trip-danang-2024" },

  // Phú Quốc (2 trips)
  { locationId: "loc-phuquoc", memoryId: "trip-phuquoc-2026" },
  { locationId: "loc-phuquoc", memoryId: "trip-phuquoc-2023" },

  // Ninh Bình (1 trip)
  { locationId: "loc-ninhbinh", memoryId: "trip-ninhbinh-2026" },

  // Hà Nội (2 trips)
  { locationId: "loc-hanoi", memoryId: "trip-hanoi-2025" },
  { locationId: "loc-hanoi", memoryId: "trip-hanoi-2024" },

  // Sa Pa (1 trip)
  { locationId: "loc-sapa", memoryId: "trip-sapa-2024" },

  // Huế (1 trip)
  { locationId: "loc-hue", memoryId: "trip-hue-2023" },

  // TP. Hồ Chí Minh (1 trip)
  { locationId: "loc-hcmc", memoryId: "trip-hcmc-2025" },
];

export const LOCATION_ITINERARY_RELATIONS: ILocationItineraryRelation[] = [
  { locationId: "loc-dalat", itineraryId: "itinerary-dalat-3n2d" },
  { locationId: "loc-danang", itineraryId: "itinerary-danang-4n3d" },
  { locationId: "loc-hoian", itineraryId: "itinerary-danang-4n3d" },
  { locationId: "loc-nhatrang", itineraryId: "itinerary-nhatrang-3n2d" },
  { locationId: "loc-vungtau", itineraryId: "itinerary-vungtau-2n1d" },
];

import type { ITravelMemory } from "@/types/pages/travel-memories/travelMemory";

export const MOCK_TRAVEL_MEMORIES: ITravelMemory[] = [
  {
    id: "trip-dalat-2026",
    title: "Đà Lạt – Những ngày bình yên",
    destination: "Đà Lạt, Lâm Đồng",
    startDate: "2026-06-12",
    endDate: "2026-06-14",
    description:
      "Chuyến đi trốn khỏi nhịp sống ồn ào nơi phố thị để tìm về không khí se lạnh, những đồi thông mờ sương và tách cà phê ấm nóng buổi sớm mai.",
    coverImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2026-06-12",
        photos: [
          {
            id: "dl-d1-1",
            imageUrl:
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            caption: "Đón bình minh tại hồ Tuyền Lâm trong làn sương sớm",
            altText: "Bình minh hồ Tuyền Lâm",
          },
          {
            id: "dl-d1-2",
            imageUrl:
              "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80",
            caption: "Dạo bước giữa rừng thông bạt ngàn",
            altText: "Rừng thông Đà Lạt",
          },
          {
            id: "dl-d1-3",
            imageUrl:
              "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
            caption: "Ghé quán cà phê nhỏ ngắm thung lũng",
            altText: "Quán cà phê ngắm thung lũng",
          },
          {
            id: "dl-d1-4",
            imageUrl:
              "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80",
            caption: "Chiều hoàng hôn đỏ rực phía sườn đồi",
            altText: "Hoàng hôn Đà Lạt",
          },
        ],
      },
      {
        date: "2026-06-13",
        photos: [
          {
            id: "dl-d2-1",
            imageUrl:
              "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
            caption: "Săn mây đỉnh Langbiang sáng sớm",
            altText: "Săn mây Langbiang",
          },
          {
            id: "dl-d2-2",
            imageUrl:
              "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
            caption: "Cung đường hoa cẩm tú cầu nở rộ rực rỡ",
            altText: "Cánh đồng hoa cẩm tú cầu",
          },
          {
            id: "dl-d2-3",
            imageUrl:
              "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
            caption: "Ánh nắng len lỏi qua tán lá thông già",
            altText: "Nắng xuyên rừng cây",
          },
        ],
      },
      {
        date: "2026-06-14",
        photos: [
          {
            id: "dl-d3-1",
            imageUrl:
              "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
            caption: "Dạo quanh bờ hồ Xuân Hương ngày cuối",
            altText: "Hồ Xuân Hương",
          },
          {
            id: "dl-d3-2",
            imageUrl:
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
            caption: "Tạm biệt Đà Lạt với những kỷ niệm thật đẹp",
            altText: "Kỷ niệm Đà Lạt",
          },
        ],
      },
    ],
    createdAt: "2026-06-15T09:00:00Z",
    updatedAt: "2026-06-15T09:00:00Z",
  },
  {
    id: "trip-hoian-2026",
    title: "Hội An – Phố đèn lồng",
    destination: "Hội An, Quảng Nam",
    startDate: "2026-08-20",
    endDate: "2026-08-22",
    description:
      "Lạc bước trong những con ngõ rêu phong màu vàng nghệ, thả hoa đăng trên dòng sông Hoài thơ mộng và thưởng thức ẩm thực xứ Quảng.",
    coverImage:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2026-08-20",
        photos: [
          {
            id: "ha-d1-1",
            imageUrl:
              "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
            caption: "Phố cổ lung linh dưới sắc đèn lồng rực rỡ",
            altText: "Đèn lồng Hội An",
          },
          {
            id: "ha-d1-2",
            imageUrl:
              "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
            caption: "Góc ngõ nhỏ với bức tường vàng đặc trưng",
            altText: "Ngõ cổ Hội An",
          },
          {
            id: "ha-d1-3",
            imageUrl:
              "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
            caption: "Thuyền hoa đăng lững lờ trên sông Hoài ban đêm",
            altText: "Sông Hoài Hội An",
          },
        ],
      },
      {
        date: "2026-08-21",
        photos: [
          {
            id: "ha-d2-1",
            imageUrl:
              "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=800&q=80",
            caption: "Đạp xe ngắm cánh đồng lúa xanh Cẩm Thanh",
            altText: "Đồng quê Hội An",
          },
          {
            id: "ha-d2-2",
            imageUrl:
              "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
            caption: "Trải nghiệm đi thuyền thúng rừng dừa Bảy Mẫu",
            altText: "Rừng dừa Bảy Mẫu",
          },
        ],
      },
      {
        date: "2026-08-22",
        photos: [
          {
            id: "ha-d3-1",
            imageUrl:
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            caption: "Buổi sáng bình yên bên biển An Bàng",
            altText: "Biển An Bàng",
          },
        ],
      },
    ],
    createdAt: "2026-08-23T10:00:00Z",
    updatedAt: "2026-08-23T10:00:00Z",
  },
  {
    id: "trip-phuquoc-2026",
    title: "Phú Quốc – Kỳ nghỉ biển",
    destination: "Phú Quốc, Kiên Giang",
    startDate: "2026-09-15",
    endDate: "2026-09-18",
    description:
      "Bốn ngày đắm chìm trong làn nước biển trong vắt như ngọc bích, ngắm hoàng hôn rực rỡ nhất Việt Nam tại Bãi Trường và thưởng thức hải sản tươi ngon.",
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2026-09-15",
        photos: [
          {
            id: "pq-d1-1",
            imageUrl:
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            caption: "Bờ biển cát trắng trải dài nước trong veo",
            altText: "Bãi Sao Phú Quốc",
          },
          {
            id: "pq-d1-2",
            imageUrl:
              "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80",
            caption: "Hàng dừa nghiêng bóng chiều tà",
            altText: "Hàng dừa biển Phú Quốc",
          },
        ],
      },
      {
        date: "2026-09-16",
        photos: [
          {
            id: "pq-d2-1",
            imageUrl:
              "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
            caption: "Lặn ngắm rạn san hô tự nhiên tại hòn Mây Rút",
            altText: "Lặn san hô Phú Quốc",
          },
          {
            id: "pq-d2-2",
            imageUrl:
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            caption: "Nước biển ngọc bích quanh hòn Gầm Ghì",
            altText: "Hòn Gầm Ghì",
          },
        ],
      },
      {
        date: "2026-09-17",
        photos: [
          {
            id: "pq-d3-1",
            imageUrl:
              "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
            caption: "Hoàng hôn huyền ảo nhuộm vàng cả mặt biển",
            altText: "Hoàng hôn Phú Quốc",
          },
        ],
      },
      {
        date: "2026-09-18",
        photos: [
          {
            id: "pq-d4-1",
            imageUrl:
              "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
            caption: "Thư giãn tại resort trước giờ ra sân bay",
            altText: "Resort Phú Quốc",
          },
        ],
      },
    ],
    createdAt: "2026-09-19T08:00:00Z",
    updatedAt: "2026-09-19T08:00:00Z",
  },
  {
    id: "trip-ninhbinh-2026",
    title: "Ninh Bình – Về với thiên nhiên",
    destination: "Ninh Bình",
    startDate: "2026-11-05",
    endDate: "2026-11-07",
    description:
      "Hành trình khám phá vùng đất cố đô Tràng An, Tam Cốc bích động với những dãy núi đá vôi kỳ vĩ và dòng sông uốn lượn ngút ngàn.",
    coverImage:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2026-11-05",
        photos: [
          {
            id: "nb-d1-1",
            imageUrl:
              "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
            caption: "Đi thuyền xuôi dòng Tràng An qua các hang động",
            altText: "Thuyền Tràng An",
          },
          {
            id: "nb-d1-2",
            imageUrl:
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            caption: "Núi non trùng điệp phản chiếu xuống mặt nước",
            altText: "Cảnh sắc Ninh Bình",
          },
        ],
      },
      {
        date: "2026-11-06",
        photos: [
          {
            id: "nb-d2-1",
            imageUrl:
              "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
            caption: "Chinh phục gần 500 bậc thang đỉnh Hang Múa",
            altText: "Đỉnh Hang Múa",
          },
          {
            id: "nb-d2-2",
            imageUrl:
              "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80",
            caption: "Toàn cảnh thung lũng Tam Cốc nhìn từ trên cao",
            altText: "Toàn cảnh Tam Cốc",
          },
        ],
      },
      {
        date: "2026-11-07",
        photos: [
          {
            id: "nb-d3-1",
            imageUrl:
              "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80",
            caption: "Thăm chùa Bái Đính tĩnh lặng ngày cuối thu",
            altText: "Chùa Bái Đính",
          },
        ],
      },
    ],
    createdAt: "2026-11-08T11:00:00Z",
    updatedAt: "2026-11-08T11:00:00Z",
  },
  {
    id: "trip-dalat-2025",
    title: "Đà Lạt – Mùa dã quỳ vàng rực",
    destination: "Đà Lạt, Lâm Đồng",
    startDate: "2025-11-20",
    endDate: "2025-11-22",
    description: "Săn hoa dã quỳ nở vàng rực trên cung đường đèo Prenn và tận hưởng cái lạnh đầu đông vùng cao nguyên.",
    coverImage: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2025-11-20",
        photos: [
          {
            id: "dl-25-1",
            imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80",
            caption: "Sắc hoa dã quỳ phủ vàng hai bên đường đèo",
            altText: "Hoa dã quỳ Đà Lạt",
          },
        ],
      },
      {
        date: "2025-11-21",
        photos: [
          {
            id: "dl-25-2",
            imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
            caption: "Ngồi sưởi ấm bên bếp lửa quán cà phê đồi thông",
            altText: "Quán cà phê đồi thông",
          },
        ],
      },
    ],
    createdAt: "2025-11-23T08:00:00Z",
    updatedAt: "2025-11-23T08:00:00Z",
  },
  {
    id: "trip-dalat-2024",
    title: "Đà Lạt – Mùa mai anh đào nở rộ",
    destination: "Đà Lạt, Lâm Đồng",
    startDate: "2024-03-15",
    endDate: "2024-03-17",
    description: "Ngắm những hàng cây mai anh đào nở rực rỡ sắc hồng dọc đường Trần Hưng Đạo và hồ Tuyền Lâm.",
    coverImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2024-03-15",
        photos: [
          {
            id: "dl-24-1",
            imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
            caption: "Sắc hồng mai anh đào trong nắng sớm",
            altText: "Mai anh đào Đà Lạt",
          },
        ],
      },
    ],
    createdAt: "2024-03-18T10:00:00Z",
    updatedAt: "2024-03-18T10:00:00Z",
  },
  {
    id: "trip-dalat-2023",
    title: "Đà Lạt – Giáng sinh se lạnh",
    destination: "Đà Lạt, Lâm Đồng",
    startDate: "2023-12-23",
    endDate: "2023-12-25",
    description: "Đón đêm Noel ấm áp tại nhà thờ Domaine de Marie và dạo chợ đêm thưởng thức sữa đậu nành nóng hổi.",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2023-12-24",
        photos: [
          {
            id: "dl-23-1",
            imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            caption: "Đêm giáng sinh lung linh tại trung tâm",
            altText: "Giáng sinh Đà Lạt",
          },
        ],
      },
    ],
    createdAt: "2023-12-26T09:00:00Z",
    updatedAt: "2023-12-26T09:00:00Z",
  },
  {
    id: "trip-danang-2025",
    title: "Đà Nẵng – Nắng vàng biển Mỹ Khê",
    destination: "Đà Nẵng",
    startDate: "2025-07-10",
    endDate: "2025-07-13",
    description: "Tắm biển Mỹ Khê nước trong xanh ngắt, đón hoàng hôn trên bán đảo Sơn Trà và thưởng thức hải sản Năm Đảnh.",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2025-07-10",
        photos: [
          {
            id: "dn-25-1",
            imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            caption: "Bình minh rực rỡ bãi biển Mỹ Khê",
            altText: "Biển Mỹ Khê",
          },
        ],
      },
      {
        date: "2025-07-11",
        photos: [
          {
            id: "dn-25-2",
            imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
            caption: "Đỉnh Bàn Cờ nhìn toàn cảnh vịnh Đà Nẵng",
            altText: "Bán đảo Sơn Trà",
          },
        ],
      },
    ],
    createdAt: "2025-07-14T08:00:00Z",
    updatedAt: "2025-07-14T08:00:00Z",
  },
  {
    id: "trip-danang-2024",
    title: "Đà Nẵng & Hội An – Hành trình miền Trung",
    destination: "Đà Nẵng – Hội An",
    startDate: "2024-06-01",
    endDate: "2024-06-04",
    description: "Chuyến đi kết hợp khám phá cây cầu Rồng phun lửa, Bà Nà Hills và phố cổ Hội An rực rỡ đèn lồng.",
    coverImage: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2024-06-01",
        photos: [
          {
            id: "dn-24-1",
            imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
            caption: "Cầu Rồng lung linh trong đêm thứ Bảy",
            altText: "Cầu Rồng Đà Nẵng",
          },
        ],
      },
      {
        date: "2024-06-03",
        photos: [
          {
            id: "dn-24-2",
            imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
            caption: "Thả đèn hoa đăng trên dòng sông Hoài Hội An",
            altText: "Hội An sông Hoài",
          },
        ],
      },
    ],
    createdAt: "2024-06-05T09:00:00Z",
    updatedAt: "2024-06-05T09:00:00Z",
  },
  {
    id: "trip-danang-2022",
    title: "Đà Nẵng – Kỳ nghỉ hè cùng gia đình",
    destination: "Đà Nẵng",
    startDate: "2022-08-15",
    endDate: "2022-08-18",
    description: "Kỳ nghỉ hè tuyệt vời của cả nhà sau chuỗi ngày bận rộn, thưởng thức mì Quảng và dạo chơi Ngũ Hành Sơn.",
    coverImage: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2022-08-16",
        photos: [
          {
            id: "dn-22-1",
            imageUrl: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80",
            caption: "Gia đình sum vầy bên bờ biển lộng gió",
            altText: "Gia đình bên bờ biển",
          },
        ],
      },
    ],
    createdAt: "2022-08-19T07:00:00Z",
    updatedAt: "2022-08-19T07:00:00Z",
  },
  {
    id: "trip-phuquoc-2023",
    title: "Phú Quốc – Lặn biển ngắm hoàng hôn Bãi Sao",
    destination: "Phú Quốc, Kiên Giang",
    startDate: "2023-04-28",
    endDate: "2023-05-01",
    description: "Tận hưởng kỳ nghỉ lễ 30/4 với biển xanh cát trắng, trải nghiệm cano đi 4 đảo và ngắm hoàng hôn tại Sunset Sanato.",
    coverImage: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2023-04-29",
        photos: [
          {
            id: "pq-23-1",
            imageUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
            caption: "Hoàng hôn lộng lẫy trên bờ cát Bãi Trường",
            altText: "Hoàng hôn Phú Quốc 2023",
          },
        ],
      },
    ],
    createdAt: "2023-05-02T10:00:00Z",
    updatedAt: "2023-05-02T10:00:00Z",
  },
  {
    id: "trip-hanoi-2025",
    title: "Hà Nội – Mùa thu nồng nàn hoa sữa",
    destination: "Hà Nội",
    startDate: "2025-10-10",
    endDate: "2025-10-12",
    description: "Đi dạo quanh bờ hồ Hoàn Kiếm ngày giải phóng thủ đô, thưởng thức cốm làng Vòng và cà phê trứng Giảng.",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2025-10-10",
        photos: [
          {
            id: "hn-25-1",
            imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            caption: "Hồ Gươm tĩnh lặng sớm mùa thu mát rượi",
            altText: "Hồ Gươm Hà Nội",
          },
        ],
      },
    ],
    createdAt: "2025-10-13T09:00:00Z",
    updatedAt: "2025-10-13T09:00:00Z",
  },
  {
    id: "trip-hanoi-2024",
    title: "Hà Nội – Không khí Tết phố cổ",
    destination: "Hà Nội",
    startDate: "2024-02-12",
    endDate: "2024-02-15",
    description: "Cảm nhận không khí Tết cổ truyền bình yên, ngắm cành đào Nhật Tân khoe sắc trên những con phố 36 phố phường.",
    coverImage: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2024-02-13",
        photos: [
          {
            id: "hn-24-1",
            imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
            caption: "Chợ hoa Tết Hàng Lược tấp nập sắc xuân",
            altText: "Chợ hoa Tết phố cổ",
          },
        ],
      },
    ],
    createdAt: "2024-02-16T10:00:00Z",
    updatedAt: "2024-02-16T10:00:00Z",
  },
  {
    id: "trip-sapa-2024",
    title: "Sa Pa – Chạm vào mây đỉnh Fansipan",
    destination: "Sa Pa, Lào Cai",
    startDate: "2024-12-18",
    endDate: "2024-12-20",
    description: "Chinh phục nóc nhà Đông Dương Fansipan giữa biển mây bồng bềnh, ghé thăm bản Cát Cát thơ mộng.",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2024-12-19",
        photos: [
          {
            id: "sp-24-1",
            imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
            caption: "Biển mây trắng xóa cuồn cuộn dưới chân tượng Phật Fansipan",
            altText: "Đỉnh Fansipan Sa Pa",
          },
        ],
      },
    ],
    createdAt: "2024-12-21T08:00:00Z",
    updatedAt: "2024-12-21T08:00:00Z",
  },
  {
    id: "trip-hue-2023",
    title: "Huế – Dấu ấn cung đình trầm mặc",
    destination: "Huế, Thừa Thiên Huế",
    startDate: "2023-07-20",
    endDate: "2023-07-22",
    description: "Tham quan Đại Nội cổ kính, nghe ca Huế trên sông Hương và thưởng thức bún bò Huế cùng các món bánh gia truyền.",
    coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2023-07-21",
        photos: [
          {
            id: "hue-23-1",
            imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
            caption: "Cổng Ngọ Môn sừng sững uy nghiêm",
            altText: "Đại Nội Huế",
          },
        ],
      },
    ],
    createdAt: "2023-07-23T09:00:00Z",
    updatedAt: "2023-07-23T09:00:00Z",
  },
  {
    id: "trip-hcmc-2025",
    title: "Sài Gòn – Phố thị nhộn nhịp về đêm",
    destination: "TP. Hồ Chí Minh",
    startDate: "2025-04-18",
    endDate: "2025-04-20",
    description: "Trải nghiệm xe buýt 2 tầng ngắm phố phường, dạo phố đi bộ Nguyễn Huệ và thưởng thức ẩm thực đường phố Chợ Lớn.",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    days: [
      {
        date: "2025-04-19",
        photos: [
          {
            id: "sg-25-1",
            imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            caption: "Tòa nhà Bitexco và Landmark 81 rực rỡ bên bờ sông Sài Gòn",
            altText: "Sài Gòn về đêm",
          },
        ],
      },
    ],
    createdAt: "2025-04-21T08:00:00Z",
    updatedAt: "2025-04-21T08:00:00Z",
  },
];


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
];

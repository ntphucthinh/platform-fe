import type {
  ITravelItinerary,
  ItineraryActivityType,
  IItineraryListItem,
} from '@/types/pages/itineraries/itinerary'

export const ITINERARY_CATEGORY_COLORS: Record<
  ItineraryActivityType,
  { bg: string; text: string; border: string }
> = {
  'Ăn uống': {
    bg: '#FEF3C7',
    text: '#B45309',
    border: '#FDE68A',
  },
  'Tham quan': {
    bg: '#E0F2FE',
    text: '#0369A1',
    border: '#BAE6FD',
  },
  'Thiên nhiên': {
    bg: '#DCFCE7',
    text: '#15803D',
    border: '#BBF7D0',
  },
  'Cà phê': {
    bg: '#F3E8FF',
    text: '#7E22CE',
    border: '#E9D5FF',
  },
  'Mua sắm': {
    bg: '#FFE4E6',
    text: '#BE123C',
    border: '#FECDD3',
  },
  'Nghỉ ngơi': {
    bg: '#F1F5F9',
    text: '#475569',
    border: '#E2E8F0',
  },
}

export const MOCK_DALAT_ITINERARY: ITravelItinerary = {
  id: 'itinerary-dalat-3n2d',
  title: 'Khám phá Đà Lạt',
  destination: 'Đà Lạt, Lâm Đồng',
  duration: '3 ngày 2 đêm',
  durationDays: 3,
  durationNights: 2,
  description:
    'Một hành trình nhẹ nhàng để cảm nhận trọn vẹn vẻ đẹp của Đà Lạt, từ thiên nhiên, ẩm thực đến những góc cà phê thơ mộng.',
  coverImage:
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
  status: 'Đã hoàn thiện',
  suitableFor: 'Cặp đôi, nhóm bạn, gia đình',
  themes: ['Thiên nhiên', 'Ẩm thực', 'Cà phê', 'Văn hóa địa phương'],
  createdAt: '2024-03-01T08:00:00.000Z',
  updatedAt: '14/03/2024',
  highlights: [
    {
      id: 'hl-1',
      title: 'Thiên nhiên tươi đẹp',
      subtitle: 'Hồ, thác, đồi thông',
      icon: 'nature',
    },
    {
      id: 'hl-2',
      title: 'Cà phê đặc sắc',
      subtitle: 'Nhiều quán cà phê view đẹp',
      icon: 'coffee',
    },
    {
      id: 'hl-3',
      title: 'Ẩm thực phong phú',
      subtitle: 'Đặc sản Đà Lạt',
      icon: 'food',
    },
    {
      id: 'hl-4',
      title: 'Nhiều góc check-in',
      subtitle: 'Phong cảnh thơ mộng',
      icon: 'photo',
    },
  ],
  days: [
    {
      id: 'day-1',
      dayNumber: 1,
      title: 'Ngày 1 – Khám phá trung tâm Đà Lạt',
      subtitle: 'Làm quen với thành phố ngàn hoa và những địa điểm nổi tiếng.',
      date: 'Thứ 6, 15/03/2024',
      summary:
        'Dành trọn vẹn ngày đầu tiên để cảm nhận không khí mát lành của trung tâm thành phố, khám phá ẩm thực đường phố và ngắm hoàng hôn bên Hồ Xuân Hương.',
      coverImage:
        'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
      activities: [
        {
          id: 'd1-a1',
          time: '07:30',
          title: 'Ăn sáng tại chợ Đà Lạt',
          type: 'Ăn uống',
          duration: '1 giờ',
          location: 'Chợ Đà Lạt',
          description:
            'Thưởng thức bánh căn, sữa đậu nành và các món đặc sản tại chợ Đà Lạt.',
          image:
            'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
          notes: 'Nên thử bánh căn xíu mại nóng giòn và sữa đậu nành nóng hổi vào buổi sớm mát lạnh.',
        },
        {
          id: 'd1-a2',
          time: '09:00',
          title: 'Tham quan Nhà thờ Con Gà',
          type: 'Tham quan',
          duration: '1 giờ',
          location: 'Nhà thờ Con Gà',
          description:
            'Chiêm ngưỡng kiến trúc cổ kính và lưu giữ những bức ảnh đẹp tại biểu tượng của Đà Lạt.',
          image:
            'https://images.unsplash.com/photo-1548625361-196144e138a4?auto=format&fit=crop&w=600&q=80',
          notes: 'Nhà thờ mở cửa tự do khuôn viên bên ngoài, lưu ý giữ yên tĩnh khi có lễ.',
        },
        {
          id: 'd1-a3',
          time: '11:30',
          title: 'Ăn trưa tại quán địa phương',
          type: 'Ăn uống',
          duration: '1–1,5 giờ',
          location: 'Khu vực trung tâm',
          description:
            'Thưởng thức lẩu gà lá é hoặc các món ăn đặc trưng của Đà Lạt trong không gian ấm cúng.',
          image:
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
          notes: 'Lẩu gà lá é Tao Ngộ hoặc É É Quán là những địa chỉ nổi tiếng gần trung tâm.',
        },
        {
          id: 'd1-a4',
          time: '14:00',
          title: 'Tham quan Hồ Xuân Hương',
          type: 'Tham quan',
          duration: '1,5 giờ',
          location: 'Hồ Xuân Hương',
          description:
            'Dạo quanh hồ, ngắm cảnh và chụp ảnh với khung cảnh thơ mộng.',
          image:
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
          notes: 'Có thể thuê xe đạp đôi hoặc xe điện dạo một vòng quanh hồ rợp bóng thông.',
        },
        {
          id: 'd1-a5',
          time: '17:00',
          title: 'Ghé quán cà phê view hồ',
          type: 'Cà phê',
          duration: '1–2 giờ',
          location: 'Khu vực Hồ Xuân Hương',
          description:
            'Thư giãn và ngắm hoàng hôn tại một quán cà phê có tầm nhìn đẹp ven hồ thơ mộng.',
          image:
            'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
          notes: 'Ngắm mặt hồ chuyển sắc tím lúc hoàng hôn buông xuống rất êm đềm và thư thái.',
        },
      ],
    },
    {
      id: 'day-2',
      dayNumber: 2,
      title: 'Ngày 2 – Thiên nhiên và ngoại ô',
      subtitle:
        'Khám phá cảnh quan thiên nhiên và những điểm đến nổi bật quanh Đà Lạt.',
      date: 'Thứ 7, 16/03/2024',
      summary:
        'Rời trung tâm để đắm mình vào cảnh sắc hùng vĩ của thác nước Datanla, dạo bước giữa đồi chè bạt ngàn và tận hưởng ly cà phê giữa không gian sương mù ngoại ô.',
      coverImage:
        'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
      activities: [
        {
          id: 'd2-a1',
          time: '07:30',
          title: 'Ăn sáng và chuẩn bị cho chuyến đi',
          type: 'Ăn uống',
          duration: '1 giờ',
          location: 'Khu vực lưu trú',
          description:
            'Bắt đầu ngày mới với bữa sáng và chuẩn bị phương tiện cho hành trình khám phá ngoại ô.',
          image:
            'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
          notes: 'Nên kiểm tra xe cộ, xăng và mang theo áo khoác gió trước khi lên đường.',
        },
        {
          id: 'd2-a2',
          time: '09:00',
          title: 'Khám phá thác Datanla',
          type: 'Thiên nhiên',
          duration: '2 giờ',
          location: 'Thác Datanla',
          description:
            'Khám phá cảnh quan thác nước và trải nghiệm các hoạt động ngoài trời phù hợp như máng trượt alpine coaster.',
          image:
            'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
          notes: 'Hệ thống máng trượt uốn lượn qua rừng thông là trải nghiệm rất đáng thử.',
        },
        {
          id: 'd2-a3',
          time: '12:00',
          title: 'Ăn trưa tại nhà hàng địa phương',
          type: 'Ăn uống',
          duration: '1–1,5 giờ',
          location: 'Khu vực ngoại ô',
          description:
            'Nghỉ ngơi và thưởng thức món ăn địa phương trước khi tiếp tục hành trình.',
          image:
            'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
          notes: 'Cơm lam gà nướng chấm muối é thơm phức giữa rừng đồi.',
        },
        {
          id: 'd2-a4',
          time: '14:00',
          title: 'Ghé đồi chè hoặc vườn hoa',
          type: 'Tham quan',
          duration: '1,5 giờ',
          location: 'Ngoại ô Đà Lạt',
          description:
            'Tận hưởng không gian xanh và chụp ảnh giữa khung cảnh thiên nhiên xanh ngát.',
          image:
            'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
          notes: 'Đồi chè Cầu Đất hoặc vườn hoa cẩm tú cầu rực rỡ sắc màu.',
        },
        {
          id: 'd2-a5',
          time: '16:30',
          title: 'Thư giãn tại quán cà phê ngoại ô',
          type: 'Cà phê',
          duration: '1 giờ',
          location: 'Ngoại ô Đà Lạt',
          description:
            'Dừng chân nghỉ ngơi, ngắm cảnh và tận hưởng không khí mát mẻ trong lành giữa thung lũng.',
          image:
            'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80',
          notes: 'Thưởng thức cà phê Arabica Cầu Đất nguyên chất đậm đà.',
        },
      ],
    },
    {
      id: 'day-3',
      dayNumber: 3,
      title: 'Ngày 3 – Trải nghiệm địa phương',
      subtitle:
        'Dành thời gian mua sắm, thưởng thức đặc sản và kết thúc chuyến đi nhẹ nhàng.',
      date: 'Chủ Nhật, 17/03/2024',
      summary:
        'Thong thả chọn mua quà đặc sản Đà Lạt như mứt, trà atiso, dâu tây tươi và đóng gói hành lý trước khi kết thúc một chuyến đi trọn vẹn kỷ niệm đẹp.',
      coverImage:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
      activities: [
        {
          id: 'd3-a1',
          time: '08:00',
          title: 'Ăn sáng tại quán địa phương',
          type: 'Ăn uống',
          duration: '1 giờ',
          location: 'Trung tâm Đà Lạt',
          description:
            'Thưởng thức bữa sáng và chuẩn bị cho buổi tham quan cuối cùng.',
          image:
            'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80',
          notes: 'Bánh mì xíu mại chén nóng hoặc mì Quảng Đà Lạt đậm vị.',
        },
        {
          id: 'd3-a2',
          time: '09:30',
          title: 'Khám phá chợ địa phương',
          type: 'Mua sắm',
          duration: '1,5 giờ',
          location: 'Chợ Đà Lạt',
          description:
            'Tìm mua đặc sản, quà lưu niệm và những món quà dành cho gia đình.',
          image:
            'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
          notes: 'Dâu tây Đà Lạt, mứt hoa hồng, trà atiso và bông len thủ công.',
        },
        {
          id: 'd3-a3',
          time: '11:30',
          title: 'Thưởng thức bữa trưa',
          type: 'Ăn uống',
          duration: '1 giờ',
          location: 'Trung tâm Đà Lạt',
          description:
            'Dùng bữa trước khi kết thúc hành trình.',
          image:
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
          notes: 'Thưởng thức bữa cơm niêu ấm áp với các món rau củ tươi non.',
        },
        {
          id: 'd3-a4',
          time: '13:00',
          title: 'Kết thúc lịch trình',
          type: 'Nghỉ ngơi',
          duration: 'Linh hoạt',
          location: 'Theo kế hoạch cá nhân',
          description:
            'Chuẩn bị hành lý và khởi hành về nhà hoặc tiếp tục chuyến đi.',
          image:
            'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
          notes: 'Tạm biệt Đà Lạt mộng mơ và hẹn gặp lại trong những chuyến đi kế tiếp.',
        },
      ],
    },
  ],
  featuredImages: [
    {
      id: 'img-1',
      title: 'Hồ Tuyền Lâm sớm sương',
      caption: 'Bình minh phủ sương mờ ảo trên mặt nước phẳng lặng Hồ Tuyền Lâm.',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'img-2',
      title: 'Quán cà phê hoàng hôn',
      caption: 'Ánh đèn ấm cúng tại quán cà phê thung lũng khi hoàng hôn buông xuống.',
      url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'img-3',
      title: 'Vườn hoa cẩm tú cầu',
      caption: 'Những khóm hoa cẩm tú cầu xanh biếc nở rộ dưới nắng nhẹ cao nguyên.',
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'img-4',
      title: 'Thác Datanla hùng vĩ',
      caption: 'Dòng thác bạc cuồn cuộn giữa rừng thông xanh đại ngàn.',
      url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  travelTips: [
    'Thời gian di chuyển có thể thay đổi tùy theo thời tiết và tình hình giao thông.',
    'Nên mang theo áo ấm vì thời tiết Đà Lạt khá lạnh vào buổi tối.',
    'Một số địa điểm có thể cần đặt vé trước vào mùa cao điểm.',
    'Lịch trình có thể điều chỉnh linh hoạt theo sở thích cá nhân.',
  ],
}

export const MOCK_DANANG_ITINERARY: ITravelItinerary = {
  id: 'itinerary-danang-4n3d',
  title: 'Đà Nẵng – Hội An',
  destination: 'Đà Nẵng, Quảng Nam',
  duration: '4 ngày 3 đêm',
  durationDays: 4,
  durationNights: 3,
  description:
    'Hành trình khám phá di sản phố cổ Hội An, biển Mỹ Khê và danh thắng Bà Nà Hills tuyệt đẹp.',
  coverImage:
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=80',
  status: 'Bản nháp',
  suitableFor: 'Gia đình, bạn bè, khách du lịch yêu biển và văn hóa',
  themes: ['Di sản văn hóa', 'Biển đảo', 'Ẩm thực', 'Check-in'],
  createdAt: '2024-03-02T09:00:00.000Z',
  updatedAt: '12/03/2024',
  highlights: [
    {
      id: 'dn-hl-1',
      title: 'Biển Mỹ Khê',
      subtitle: 'Bãi biển đẹp hàng đầu hành tinh',
      icon: 'nature',
    },
    {
      id: 'dn-hl-2',
      title: 'Bà Nà Hills',
      subtitle: 'Cầu Vàng và làng Pháp cổ tích',
      icon: 'photo',
    },
    {
      id: 'dn-hl-3',
      title: 'Phố cổ Hội An',
      subtitle: 'Lung linh đèn lồng và sông Hoài',
      icon: 'coffee',
    },
    {
      id: 'dn-hl-4',
      title: 'Ẩm thực miền Trung',
      subtitle: 'Mì Quảng, cao lầu, hải sản',
      icon: 'food',
    },
  ],
  days: [
    {
      id: 'dn-d1',
      dayNumber: 1,
      title: 'Ngày 1 – Chào Đà Nẵng & Bán đảo Sơn Trà',
      subtitle: 'Check-in khách sạn, ngắm biển Mỹ Khê và viếng chùa Linh Ứng.',
      date: 'Thứ 5, 21/03/2024',
      summary:
        'Khám phá bán đảo Sơn Trà với tượng Phật Bà Quan Âm cao nhất Việt Nam, sau đó thư giãn bên bờ biển Mỹ Khê cát trắng mịn.',
      coverImage:
        'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
      activities: [
        {
          id: 'dn-d1-a1',
          time: '08:30',
          title: 'Hạ cánh và nhận phòng khách sạn',
          type: 'Nghỉ ngơi',
          duration: '1.5 giờ',
          location: 'Khu vực bãi biển Mỹ Khê',
          description: 'Di chuyển từ sân bay về nhận phòng hoặc gửi hành lý tại khách sạn ven biển.',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'dn-d1-a2',
          time: '11:30',
          title: 'Thưởng thức Mì Quảng ếch Bếp Trang',
          type: 'Ăn uống',
          duration: '1 giờ',
          location: 'Đường Pasteur, Hải Châu',
          description: 'Hương vị mì Quảng đặc trưng với nước dùng đậm đà và rau sống tươi xanh.',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'dn-d1-a3',
          time: '14:30',
          title: 'Viếng Chùa Linh Ứng Bãi Bụt',
          type: 'Tham quan',
          duration: '2 giờ',
          location: 'Bán đảo Sơn Trà',
          description: 'Chiêm ngưỡng tượng Phật Bà Quan Âm hướng ra biển Đông và ngắm toàn cảnh thành phố.',
          image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'dn-d1-a4',
          time: '17:30',
          title: 'Tắm biển Mỹ Khê và ăn tối hải sản',
          type: 'Ăn uống',
          duration: '2 giờ',
          location: 'Bãi biển Mỹ Khê',
          description: 'Hòa mình vào làn nước trong xanh và thưởng thức hải sản tươi ngon bên bờ biển.',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      id: 'dn-d2',
      dayNumber: 2,
      title: 'Ngày 2 – Chinh phục Bà Nà Hills & Cầu Vàng',
      subtitle: 'Trải nghiệm cáp treo đạt kỷ lục và check-in Cầu Vàng danh tiếng thế giới.',
      date: 'Thứ 6, 22/03/2024',
      summary:
        'Cả ngày trải nghiệm tại xứ sở thần tiên Bà Nà Hills với khí hậu 4 mùa trong 1 ngày, Cầu Vàng kỳ vĩ và Fantasy Park sôi động.',
      coverImage:
        'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80',
      activities: [
        {
          id: 'dn-d2-a1',
          time: '08:00',
          title: 'Khởi hành đi Bà Nà Hills',
          type: 'Tham quan',
          duration: '1 giờ',
          location: 'Hòa Vang, Đà Nẵng',
          description: 'Đi cáp treo ngắm nhìn cánh rừng nguyên sinh và thác Tóc Tiên tuyệt đẹp.',
          image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'dn-d2-a2',
          time: '09:30',
          title: 'Check-in Cầu Vàng bàn tay khổng lồ',
          type: 'Tham quan',
          duration: '1.5 giờ',
          location: 'Vườn Thiên Thai, Bà Nà',
          description: 'Chụp hình kỷ niệm tại công trình kiến trúc biểu tượng nổi tiếng toàn cầu.',
          image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'dn-d2-a3',
          time: '12:00',
          title: 'Ăn trưa buffet tại Làng Pháp',
          type: 'Ăn uống',
          duration: '1.5 giờ',
          location: 'Nhà hàng Beer Plaza',
          description: 'Thưởng thức bữa trưa buffet đa dạng ẩm thực Á - Âu giữa không gian châu Âu cổ kính.',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'dn-d2-a4',
          time: '15:00',
          title: 'Vui chơi Fantasy Park và xuống núi',
          type: 'Tham quan',
          duration: '2.5 giờ',
          location: 'Khu du lịch Bà Nà',
          description: 'Thử sức với các trò chơi cảm giác mạnh, rạp phim 4D rồi đón cáp treo về lại trung tâm.',
          image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      id: 'dn-d3',
      dayNumber: 3,
      title: 'Ngày 3 – Di sản phố cổ Hội An huyền ảo',
      subtitle: 'Thả hoa đăng trên sông Hoài và khám phá kiến trúc cổ tích.',
      date: 'Thứ 7, 23/03/2024',
      summary:
        'Buổi chiều di chuyển vào Hội An, dạo bước qua chùa Cầu, nhà cổ Tấn Ký và ngắm hàng ngàn ánh đèn lồng rực rỡ.',
      coverImage:
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      activities: [
        {
          id: 'dn-d3-a1',
          time: '09:00',
          title: 'Tham quan Danh thắng Ngũ Hành Sơn',
          type: 'Thiên nhiên',
          duration: '2 giờ',
          location: 'Hòa Hải, Ngũ Hành Sơn',
          description: 'Khám phá động Huyền Không kỳ ảo và viếng chùa Linh Ứng cổ tự trên núi đá vôi.',
          image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'dn-d3-a2',
          time: '12:00',
          title: 'Ăn trưa Bê thui Cầu Mống',
          type: 'Ăn uống',
          duration: '1 giờ',
          location: 'Quận Ngũ Hành Sơn',
          description: 'Đặc sản bê thui thơm ngọt cuốn bánh tráng rau rừng chấm mắm nêm đậm đà.',
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'dn-d3-a3',
          time: '15:30',
          title: 'Dạo phố cổ Hội An & uống trà Mót',
          type: 'Cà phê',
          duration: '2 giờ',
          location: 'Đường Trần Phú, Hội An',
          description: 'Uống ly trà thảo mộc Mót mát lành, ngắm những bức tường vàng rợp hoa giấy.',
          image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'dn-d3-a4',
          time: '18:30',
          title: 'Đi thuyền thả hoa đăng trên sông Hoài',
          type: 'Tham quan',
          duration: '1.5 giờ',
          location: 'Bến thuyền sông Hoài',
          description: 'Thả những chiếc đèn hoa đăng ước nguyện trong khung cảnh lung linh huyền diệu.',
          image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      id: 'dn-d4',
      dayNumber: 4,
      title: 'Ngày 4 – Mua quà đặc sản & Tạm biệt Đà Nẵng',
      subtitle: 'Ghé chợ Cồn mua hải sản khô và ngắm cầu Rồng trước khi bay.',
      date: 'Chủ Nhật, 24/03/2024',
      summary:
        'Mua sắm đặc sản chả bò, mực rim me tại chợ Cồn, thưởng thức cà phê muối và kết thúc chuyến hành trình trọn vẹn.',
      coverImage:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
      activities: [
        {
          id: 'dn-d4-a1',
          time: '08:00',
          title: 'Ăn sáng Bún chả cá Bà Phiến',
          type: 'Ăn uống',
          duration: '1 giờ',
          location: 'Đường Lê Hồng Phong',
          description: 'Tô bún chả cá thơm ngọt đậm đà danh tiếng hơn 30 năm.',
          image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'dn-d4-a2',
          time: '09:30',
          title: 'Mua quà đặc sản tại Chợ Cồn',
          type: 'Mua sắm',
          duration: '1.5 giờ',
          location: 'Chợ Cồn, đường Hùng Vương',
          description: 'Thiên đường quà đặc sản Đà Nẵng với mực một nắng, chả bò và bánh khô mè.',
          image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'dn-d4-a3',
          time: '11:30',
          title: 'Thưởng thức Cà phê Muối ven sông Hàn',
          type: 'Cà phê',
          duration: '1 giờ',
          location: 'Đường Bạch Đằng',
          description: 'Ngắm nhìn cầu Rồng và sông Hàn lộng gió trong làn hương cà phê béo ngậy.',
          image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'dn-d4-a4',
          time: '13:30',
          title: 'Ra sân bay kết thúc hành trình',
          type: 'Nghỉ ngơi',
          duration: '1 giờ',
          location: 'Sân bay Quốc tế Đà Nẵng',
          description: 'Làm thủ tục chuyến bay về nhà, tạm biệt mảnh đất miền Trung hiếu khách.',
          image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
  ],
  featuredImages: [
    {
      id: 'dn-img-1',
      title: 'Cầu Vàng Bà Nà Hills',
      caption: 'Kiến trúc ngoạn mục giữa mây trời đỉnh núi Chúa.',
      url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dn-img-2',
      title: 'Đèn lồng phố cổ Hội An',
      caption: 'Lung linh muôn sắc màu trong đêm phố cổ ven sông.',
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'dn-img-3',
      title: 'Biển Mỹ Khê',
      caption: 'Bờ cát vàng mịn trải dài và sóng biếc êm đềm.',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  travelTips: [
    'Nên đặt trước vé Bà Nà Hills để không phải xếp hàng mua vé tại cổng.',
    'Phố cổ Hội An cấm xe máy từ 15h00 đến 21h30, rất lý tưởng để đi bộ và chụp ảnh.',
    'Nhớ mang theo kem chống nắng, kính râm và mũ rộng vành khi vui chơi ngoài trời.',
  ],
}

export const MOCK_NHATRANG_ITINERARY: ITravelItinerary = {
  id: 'itinerary-nhatrang-3n2d',
  title: 'Khám phá Nha Trang',
  destination: 'Nha Trang, Khánh Hòa',
  duration: '3 ngày 2 đêm',
  durationDays: 3,
  durationNights: 2,
  description:
    'Trải nghiệm lặn biển ngắm san hô, tắm khoáng nóng và thưởng thức hải sản tươi ngon vùng vịnh biển ngập tràn ánh nắng.',
  coverImage:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  status: 'Đã hoàn thiện',
  suitableFor: 'Nhóm bạn, gia đình trẻ, cặp đôi',
  themes: ['Biển đảo', 'Lặn biển', 'Nghỉ dưỡng', 'Hải sản'],
  createdAt: '2024-03-03T08:00:00.000Z',
  updatedAt: '10/03/2024',
  highlights: [
    {
      id: 'nt-hl-1',
      title: 'Vịnh Nha Trang',
      subtitle: 'Một trong 29 vịnh biển đẹp nhất thế giới',
      icon: 'nature',
    },
    {
      id: 'nt-hl-2',
      title: 'Lặn ngắm san hô',
      subtitle: 'Khu bảo tồn biển Hòn Mun',
      icon: 'photo',
    },
    {
      id: 'nt-hl-3',
      title: 'Tắm bùn khoáng nóng',
      subtitle: 'Thư giãn tái tạo năng lượng',
      icon: 'nature',
    },
    {
      id: 'nt-hl-4',
      title: 'Hải sản tươi sống',
      subtitle: 'Thưởng thức tại bè nổi vịnh biển',
      icon: 'food',
    },
  ],
  days: [
    {
      id: 'nt-d1',
      dayNumber: 1,
      title: 'Ngày 1 – Check-in phố biển & Tháp Bà Ponagar',
      subtitle: 'Khám phá văn hóa Chăm pa cổ kính và dạo con đường ven biển Trần Phú.',
      date: 'Thứ 6, 29/03/2024',
      summary:
        'Bắt đầu chuyến đi bằng chuyến tham quan di tích lịch sử Tháp Bà Ponagar và tắm biển Trần Phú lúc hoàng hôn.',
      coverImage:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      activities: [
        {
          id: 'nt-d1-a1',
          time: '08:30',
          title: 'Đến Nha Trang và ăn Bún cá lá sứa',
          type: 'Ăn uống',
          duration: '1 giờ',
          location: 'Quán Bún cá Năm Beo, chợ Đầm',
          description: 'Món ăn sáng trứ danh với nước dùng trong veo ngọt thanh từ cá ngừ và sứa giòn sần sật.',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'nt-d1-a2',
          time: '10:00',
          title: 'Tham quan Tháp Bà Ponagar',
          type: 'Tham quan',
          duration: '1.5 giờ',
          location: 'Đường 2/4, Vĩnh Phước',
          description: 'Di tích kiến trúc đền tháp Chăm pa đồ sộ và xem điệu múa Chăm truyền thống.',
          image: 'https://images.unsplash.com/photo-1548625361-196144e138a4?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'nt-d1-a3',
          time: '14:30',
          title: 'Tắm bùn khoáng nóng I-Resort',
          type: 'Nghỉ ngơi',
          duration: '2.5 giờ',
          location: 'Vĩnh Ngọc, Nha Trang',
          description: 'Ngâm bùn khoáng thiên nhiên và massage thủy lực giúp cơ thể thư giãn tuyệt đối.',
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'nt-d1-a4',
          time: '18:00',
          title: 'Tiệc hải sản tươi sống bờ kè Tháp Bà',
          type: 'Ăn uống',
          duration: '2 giờ',
          location: 'Bờ kè Tháp Bà',
          description: 'Thưởng thức tôm hùm nướng bơ tỏi, mực nướng muối ớt và các loại ốc biển tươi sống.',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      id: 'nt-d2',
      dayNumber: 2,
      title: 'Ngày 2 – Tour 3 đảo Vịnh Nha Trang & Lặn biển',
      subtitle: 'Khám phá Hòn Mun, Hòn Tằm và bãi biển Mini Beach nước trong vắt.',
      date: 'Thứ 7, 30/03/2024',
      summary:
        'Lên cano cao tốc lướt sóng ra vịnh biển, lặn ngắm rạn san hô kỳ thú và tham gia các trò chơi dù lượn trên biển.',
      coverImage:
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      activities: [
        {
          id: 'nt-d2-a1',
          time: '08:00',
          title: 'Xuất bến cano tham quan Hòn Mun',
          type: 'Thiên nhiên',
          duration: '2.5 giờ',
          location: 'Khu bảo tồn biển Hòn Mun',
          description: 'Lặn ngắm rạn san hô tự nhiên đẹp nhất Việt Nam bằng kính lặn hoặc ống thở.',
          image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'nt-d2-a2',
          time: '11:30',
          title: 'Ăn trưa hải sản tại Làng Chài',
          type: 'Ăn uống',
          duration: '1.5 giờ',
          location: 'Bè nổi Làng Chài vịnh Nha Trang',
          description: 'Trực tiếp chọn cá bớp, mực nhảy từ bè và thưởng thức nóng hổi giữa biển trời.',
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'nt-d2-a3',
          time: '13:30',
          title: 'Nghỉ dưỡng và tắm biển tại Hòn Tằm',
          type: 'Nghỉ ngơi',
          duration: '2.5 giờ',
          location: 'Đảo Hòn Tằm',
          description: 'Nằm dài dưới bóng râm hàng dừa xanh mát và thưởng thức nước dừa tươi ngọt lành.',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'nt-d2-a4',
          time: '19:00',
          title: 'Cà phê Sailing Club ngắm biển đêm',
          type: 'Cà phê',
          duration: '2 giờ',
          location: 'Sailing Club Nha Trang, đường Trần Phú',
          description: 'Nhâm nhi mocktail nhiệt đới, lắng nghe tiếng sóng vỗ rì rào và âm nhạc acoustic êm dịu.',
          image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      id: 'nt-d3',
      dayNumber: 3,
      title: 'Ngày 3 – Viện Hải dương học & Mua quà Chợ Đầm',
      subtitle: 'Chiêm ngưỡng bảo tàng sinh vật biển và mua sắm đặc sản yến sào.',
      date: 'Chủ Nhật, 31/03/2024',
      summary:
        'Tìm hiểu thế giới đại dương tại Viện Hải dương học cổ xưa nhất Đông Dương và mua đặc sản mực một nắng về làm quà.',
      coverImage:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
      activities: [
        {
          id: 'nt-d3-a1',
          time: '08:30',
          title: 'Ăn sáng Bánh căn hải sản Tô Hiến Thành',
          type: 'Ăn uống',
          duration: '1 giờ',
          location: 'Đường Tô Hiến Thành',
          description: 'Bánh căn giòn rụm nhân tôm mực tươi rói chấm mắm nêm hoặc xíu mại cay thơm.',
          image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'nt-d3-a2',
          time: '09:45',
          title: 'Tham quan Viện Hải dương học Nha Trang',
          type: 'Tham quan',
          duration: '1.5 giờ',
          location: 'Số 1 Cầu Đá, Nha Trang',
          description: 'Xem đường hầm thủy cung sinh động và bộ xương cá voi lưng gù khổng lồ dài 26m.',
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'nt-d3-a3',
          time: '11:30',
          title: 'Mua đặc sản Chợ Đầm',
          type: 'Mua sắm',
          duration: '1.5 giờ',
          location: 'Chợ Đầm tròn Nha Trang',
          description: 'Chọn mua rong nho, mực rim me, cá ngựa khô và yến sào Khánh Hòa chuẩn chất lượng.',
          image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'nt-d3-a4',
          time: '14:00',
          title: 'Khởi hành ra sân bay Cam Ranh',
          type: 'Nghỉ ngơi',
          duration: '1 giờ',
          location: 'Sân bay Cam Ranh',
          description: 'Kết thúc chuyến nghỉ dưỡng biển Nha Trang sảng khoái và tràn đầy năng lượng.',
          image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
  ],
  featuredImages: [
    {
      id: 'nt-img-1',
      title: 'Vịnh biển Nha Trang ngập nắng',
      caption: 'Làn nước xanh ngọc lam quyến rũ bên rặng dừa xanh.',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'nt-img-2',
      title: 'Đảo Hòn Mun',
      caption: 'Thiên đường lặn biển với rạn san hô nguyên sơ.',
      url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  travelTips: [
    'Thời tiết Nha Trang đẹp nhất từ tháng 1 đến tháng 9 với nắng vàng và biển êm.',
    'Khi đi tour đảo nên mang theo túi chống nước cho điện thoại và máy ảnh.',
    'Giá hải sản tại bè thường tính theo thời giá, nên hỏi kỹ giá trước khi yêu cầu chế biến.',
  ],
}

export const MOCK_VUNGTAU_ITINERARY: ITravelItinerary = {
  id: 'itinerary-vungtau-2n1d',
  title: 'Cuối tuần tại Vũng Tàu',
  destination: 'Vũng Tàu',
  duration: '2 ngày 1 đêm',
  durationDays: 2,
  durationNights: 1,
  description:
    'Chuyến nghỉ dưỡng ngắn ngày đổi gió tại Bãi Trước, Bãi Sau và ngọn hải đăng Vũng Tàu thơ mộng.',
  coverImage:
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80',
  status: 'Bản nháp',
  suitableFor: 'Cặp đôi, gia đình cuối tuần, nhóm bạn đi xe máy/ô tô',
  themes: ['Nghỉ dưỡng ngắn ngày', 'Ẩm thực', 'Check-in biển', 'Hải sản'],
  createdAt: '2024-03-04T07:00:00.000Z',
  updatedAt: '08/03/2024',
  highlights: [
    {
      id: 'vt-hl-1',
      title: 'Ngọn Hải Đăng',
      subtitle: 'Ngắm toàn cảnh phố biển từ trên cao',
      icon: 'photo',
    },
    {
      id: 'vt-hl-2',
      title: 'Tượng Chúa Kito',
      subtitle: 'Chinh phục gần 1000 bậc thang',
      icon: 'nature',
    },
    {
      id: 'vt-hl-3',
      title: 'Bánh khọt Vũng Tàu',
      subtitle: 'Món ăn vặt thơm giòn khó cưỡng',
      icon: 'food',
    },
    {
      id: 'vt-hl-4',
      title: 'Hoàng hôn Bãi Trước',
      subtitle: 'Gió biển lộng và phố đêm nhộn nhịp',
      icon: 'coffee',
    },
  ],
  days: [
    {
      id: 'vt-d1',
      dayNumber: 1,
      title: 'Ngày 1 – Lên ngọn Hải Đăng & Thưởng thức hải sản',
      subtitle: 'Di chuyển từ TP.HCM, ăn bánh khọt và đón hoàng hôn trên đỉnh núi Nhỏ.',
      date: 'Thứ 7, 06/04/2024',
      summary:
        'Chỉ mất khoảng 2 giờ chạy xe từ Sài Gòn, bắt đầu ngay ngày nghỉ cuối tuần với đĩa bánh khọt nóng hổi và tách cà phê ngắm biển lộng gió.',
      coverImage:
        'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
      activities: [
        {
          id: 'vt-d1-a1',
          time: '09:00',
          title: 'Ăn sáng Bánh khọt Gốc Vú Sữa',
          type: 'Ăn uống',
          duration: '1 giờ',
          location: 'Số 14 Nguyễn Trường Tộ',
          description: 'Đĩa bánh khọt tôm tươi vàng giòn cuốn cùng xà lách, rau thơm chấm nước mắm chua ngọt.',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'vt-d1-a2',
          time: '10:30',
          title: 'Check-in ngọn Hải Đăng cổ kính',
          type: 'Tham quan',
          duration: '1.5 giờ',
          location: 'Đỉnh núi Nhỏ, phường 2',
          description: 'Công trình kiến trúc hải đăng Pháp cổ xưa và thưởng thức yaourt, trứng lòng đào cô Tiên.',
          image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'vt-d1-a3',
          time: '15:30',
          title: 'Tắm biển Bãi Sau sóng êm',
          type: 'Thiên nhiên',
          duration: '2 giờ',
          location: 'Đường Thùy Vân, Bãi Sau',
          description: 'Hòa mình vào làn sóng biển mát rượi, dạo bước trên bãi cát mịn dài thoai thoải.',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'vt-d1-a4',
          time: '18:30',
          title: 'Ăn tối hải sản Ốc Tự Nhiên',
          type: 'Ăn uống',
          duration: '2 giờ',
          location: 'Đường Trần Phú, Bãi Trước',
          description: 'Thưởng thức ốc hương sốt hoàng kim, càng cúm rang muối và lẩu cá đuối thơm lừng.',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      id: 'vt-d2',
      dayNumber: 2,
      title: 'Ngày 2 – Mũi Nghinh Phong & Tượng Chúa Kito',
      subtitle: 'Đón bình minh tại Cổng Trời và trở về trong thong thả.',
      date: 'Chủ Nhật, 07/04/2024',
      summary:
        'Chinh phục tượng Chúa giang tay để ngắm toàn cảnh Vũng Tàu từ hai cánh tay Chúa, chụp ảnh Cổng Trời Mũi Nghinh Phong.',
      coverImage:
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      activities: [
        {
          id: 'vt-d2-a1',
          time: '07:00',
          title: 'Chinh phục Tượng Chúa Kito Vua',
          type: 'Tham quan',
          duration: '2 giờ',
          location: 'Núi Nhỏ, đường Hạ Long',
          description: 'Leo gần 1000 bậc đá rợp bóng cây xanh và ngắm trọn vẹn bờ biển từ cánh tay Chúa.',
          image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'vt-d2-a2',
          time: '09:30',
          title: 'Check-in Cổng Trời Mũi Nghinh Phong',
          type: 'Tham quan',
          duration: '1 giờ',
          location: 'Số 1 đường Hạ Long',
          description: 'Nơi trước mặt là biển bao la, sau lưng là vách núi sừng sững lộng gió quanh năm.',
          image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'vt-d2-a3',
          time: '11:00',
          title: 'Ăn trưa Lẩu cá đuối Trương Công Định',
          type: 'Ăn uống',
          duration: '1.5 giờ',
          location: 'Đường Trương Công Định',
          description: 'Nồi lẩu cá đuối măng chua đậm đà sôi sùng sục ăn kèm bún tươi và rau ghém.',
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'vt-d2-a4',
          time: '13:00',
          title: 'Mua bánh bông lan trứng muối Gốc Cột Điện & Về Sài Gòn',
          type: 'Mua sắm',
          duration: '1 giờ',
          location: 'Đường Nguyễn Tri Phương',
          description: 'Mua hộp bánh bông lan trứng muối phô mai nướng thơm nức mũi làm quà cho gia đình.',
          image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
  ],
  featuredImages: [
    {
      id: 'vt-img-1',
      title: 'Bãi biển Vũng Tàu chiều tà',
      caption: 'Ánh hoàng hôn rực rỡ buông xuống con đường ven biển Hạ Long.',
      url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  travelTips: [
    'Khi leo Tượng Chúa Kito cần mặc trang phục lịch sự, áo có tay và quần dài qua đầu gối.',
    'Bánh khọt vào cuối tuần thường đông khách, nên đến trước 8h30 hoặc sau 10h00.',
  ],
}

export const MOCK_ALL_ITINERARIES: ITravelItinerary[] = [
  MOCK_DALAT_ITINERARY,
  MOCK_DANANG_ITINERARY,
  MOCK_NHATRANG_ITINERARY,
  MOCK_VUNGTAU_ITINERARY,
]

export const MOCK_ITINERARY_LIST: IItineraryListItem[] = MOCK_ALL_ITINERARIES.map((item) => ({
  id: item.id,
  title: item.title,
  destination: item.destination,
  duration: item.duration,
  daysCount: item.days.length,
  activityCount: item.days.reduce((acc, d) => acc + d.activities.length, 0),
  status: item.status === 'Đã hoàn thiện' ? 'Đã hoàn thiện' : 'Bản nháp',
  updatedAt: item.updatedAt || 'Hôm nay',
  description: item.description,
  coverImage: item.coverImage,
  hasDetailPreview: true,
}))

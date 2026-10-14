import type {
  ITravelItinerary,
  ItineraryActivityType,
  IItineraryListItem,
} from '@/types/pages/itineraries/itinerary'

export const MOCK_ITINERARY_LIST: IItineraryListItem[] = [
  {
    id: 'itinerary-dalat-3n2d',
    title: 'Khám phá Đà Lạt',
    destination: 'Đà Lạt, Lâm Đồng',
    duration: '3 ngày 2 đêm',
    daysCount: 3,
    activityCount: 14,
    status: 'Đã hoàn thiện',
    updatedAt: '14/03/2024',
    description:
      'Một hành trình nhẹ nhàng để cảm nhận trọn vẹn vẻ đẹp của Đà Lạt, từ thiên nhiên, ẩm thực đến những góc cà phê thơ mộng.',
    coverImage:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    hasDetailPreview: true,
  },
  {
    id: 'itinerary-danang-4n3d',
    title: 'Đà Nẵng – Hội An',
    destination: 'Đà Nẵng, Quảng Nam',
    duration: '4 ngày 3 đêm',
    daysCount: 4,
    activityCount: 16,
    status: 'Bản nháp',
    updatedAt: '12/03/2024',
    description:
      'Hành trình khám phá di sản phố cổ Hội An, biển Mỹ Khê và danh thắng Bà Nà Hills.',
    coverImage:
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=400&q=80',
    hasDetailPreview: false,
  },
  {
    id: 'itinerary-nhatrang-3n2d',
    title: 'Khám phá Nha Trang',
    destination: 'Nha Trang, Khánh Hòa',
    duration: '3 ngày 2 đêm',
    daysCount: 3,
    activityCount: 12,
    status: 'Đã hoàn thiện',
    updatedAt: '10/03/2024',
    description:
      'Trải nghiệm lặn biển ngắm san hô, tắm khoáng nóng và thưởng thức hải sản tươi ngon vùng vịnh biển.',
    coverImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    hasDetailPreview: false,
  },
  {
    id: 'itinerary-vungtau-2n1d',
    title: 'Cuối tuần tại Vũng Tàu',
    destination: 'Vũng Tàu',
    duration: '2 ngày 1 đêm',
    daysCount: 2,
    activityCount: 8,
    status: 'Bản nháp',
    updatedAt: '08/03/2024',
    description:
      'Chuyến nghỉ dưỡng ngắn ngày đổi gió tại Bãi Trước, Bãi Sau và ngọn hải đăng Vũng Tàu.',
    coverImage:
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=400&q=80',
    hasDetailPreview: false,
  },
  {
    id: 'itinerary-hagiang-4n3d',
    title: 'Hành trình khám phá Hà Giang',
    destination: 'Hà Giang',
    duration: '4 ngày 3 đêm',
    daysCount: 4,
    activityCount: 15,
    status: 'Đã hoàn thiện',
    updatedAt: '05/03/2024',
    description:
      'Chinh phục đèo Mã Pí Lèng hùng vĩ, hẻm vực Tu Sản và cao nguyên đá Đồng Văn.',
    coverImage:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
    hasDetailPreview: false,
  },
  {
    id: 'itinerary-phuquoc-3n2d',
    title: 'Nghỉ dưỡng tại Phú Quốc',
    destination: 'Phú Quốc',
    duration: '3 ngày 2 đêm',
    daysCount: 3,
    activityCount: 11,
    status: 'Bản nháp',
    updatedAt: '01/03/2024',
    description:
      'Tận hưởng cát trắng Bãi Sao, hoàng hôn Grand World và cáp treo Hòn Thơm vượt biển.',
    coverImage:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80',
    hasDetailPreview: false,
  },
]

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
  description:
    'Một hành trình nhẹ nhàng để cảm nhận trọn vẹn vẻ đẹp của Đà Lạt, từ thiên nhiên, ẩm thực đến những góc cà phê thơ mộng.',
  coverImage:
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
  status: 'Bản xem trước · Chưa xuất bản',
  suitableFor: 'Cặp đôi, nhóm bạn, gia đình',
  themes: ['Thiên nhiên', 'Ẩm thực', 'Cà phê', 'Văn hóa địa phương'],
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

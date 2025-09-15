export const roomsAPI = [
  {
    id: '1',
    user_id: '1', // chủ phòng (FK → users.id)
    title: 'Phòng trọ anhdat',
    description: 'phòng trọ giá rẻ. Giá chỉ 1.xxx',
    address: 'Bửu Long, Biên Hòa, Đồng Nai, Việt Nam',
    region: 'Đồng Nai', // ví dụ: Quận 1, Quận Bình Thạnh...
    latitude: '10.955863',
    longitude: '106.799579',
    price: '1000', // giá niêm yết
    area: 'float',
    amenities: [
      'Wifi miễn phí tốc độ cao',
      'Chỗ để xe an toàn, có mái che',
      'Giờ giấc tự do, không chung chủ',
    ],
    images: [
      'https://firebasestorage.googleapis.com/v0/b/map-service-1dada.appspot.com/o/phongtro%2Fbasauimg1.jpg?alt=media&token=ccf935e3-245e-4ee5-a82d-fb4a597b993d',
    ],
    status: true, // true => available false => rented)

    // Hợp đồng thuê
    current_renter_id: '1', // người đang thuê (FK → users.id)
    rent_price: 1200, // giá thuê thực tế
    rent_start_date: '2025-04-19T08:32:03.135Z',
    rent_end_date: '2025-04-19T08:32:03.135Z',
    due_date: '2025-04-19T08:32:03.135Z', // hạn đóng tiền hàng tháng

    updated_at: '2025-04-19T08:32:03.135Z',
  },
  {
    id: '2',
    user_id: '1', // chủ phòng (FK → users.id)
    title: 'Phòng trọ anhdat',
    description: 'phòng trọ giá rẻ. Giá chỉ 1.xxx',
    address: 'Bửu Long, Biên Hòa, Đồng Nai, Việt Nam',
    region: 'Bửu Long', // ví dụ: Quận 1, Quận Bình Thạnh...
    latitude: '10.955863',
    longitude: '106.799579',
    price: '1000', // giá niêm yết
    area: 'float',
    amenities: [
      'Wifi miễn phí tốc độ cao',
      'Chỗ để xe an toàn, có mái che',
      'Giờ giấc tự do, không chung chủ',
    ],
    images: [
      'https://firebasestorage.googleapis.com/v0/b/map-service-1dada.appspot.com/o/phongtro%2Fbasauimg1.jpg?alt=media&token=ccf935e3-245e-4ee5-a82d-fb4a597b993d',
    ],
    status: true, // true => available false => rented)

    // Hợp đồng thuê
    current_renter_id: '1', // người đang thuê (FK → users.id)
    rent_price: 1200, // giá thuê thực tế
    rent_start_date: '2025-04-19T08:32:03.135Z',
    rent_end_date: '2025-04-19T08:32:03.135Z',
    due_date: '2025-04-19T08:32:03.135Z', // hạn đóng tiền hàng tháng

    updated_at: '2025-04-19T08:32:03.135Z',
  },
  {
    id: '3',
    user_id: '1', // chủ phòng (FK → users.id)
    title: 'Phòng trọ anhdat nè',
    description: 'phòng trọ giá rẻ. Giá chỉ 1.xxx',
    address: 'Bửu Long, Biên Hòa, Đồng Nai, Việt Nam',
    region: 'Đắk Lắk', // ví dụ: Quận 1, Quận Bình Thạnh...
    latitude: '10.955863',
    longitude: '106.799579',
    price: '1000', // giá niêm yết
    area: 'float',
    amenities: [
      'Wifi miễn phí tốc độ cao',
      'Chỗ để xe an toàn, có mái che',
      'Giờ giấc tự do, không chung chủ',
    ],
    images: [
      'https://firebasestorage.googleapis.com/v0/b/map-service-1dada.appspot.com/o/phongtro%2Fbasauimg1.jpg?alt=media&token=ccf935e3-245e-4ee5-a82d-fb4a597b993d',
    ],
    status: false, // true => available false => rented)

    // Hợp đồng thuê
    current_renter_id: '1', // người đang thuê (FK → users.id)
    rent_price: 1200, // giá thuê thực tế
    rent_start_date: '2025-04-19T08:32:03.135Z',
    rent_end_date: '2025-04-19T08:32:03.135Z',
    due_date: '2025-04-19T08:32:03.135Z', // hạn đóng tiền hàng tháng

    updated_at: '2025-04-19T08:32:03.135Z',
  },
];

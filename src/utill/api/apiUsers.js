export const usersAPI = [
  {
    id: '1',
    name: 'anhdat',
    email: 'anhdat@gmail.com',
    password_hash: '123456',
    phone: '0123123123',
    role: 'owner', // user: người thuê, owner: chủ trọ
    address: 'Bửu Long, Biên Hòa, Đồng Nai, Việt Nam',
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/map-service-1dada.appspot.com/o/phongtro%2Ficons8-selena-gomez-100.png?alt=media&token=c6d40474-9345-4df8-bd7d-b656ba2509a2',

    // Nếu là chủ trọ → danh sách phòng sở hữu
    owned_rooms: ['1'],

    // Nếu là người thuê → danh sách phòng đang thuê
    rented_rooms: [
      {
        room_id: '1',
        start_date: 'date',
        end_date: 'date | null',
        rent_price: 'decimal',
        due_date: 'date',
      },
      {
        room_id: '2',
        start_date: 'date',
        end_date: 'date | null',
        rent_price: 'decimal',
        due_date: 'date',
      },
      {
        room_id: '3',
        start_date: 'date',
        end_date: 'date | null',
        rent_price: 'decimal',
        due_date: 'date',
      },
    ],
  },
];

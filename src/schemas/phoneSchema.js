const {z} = require('zod');

export const phoneSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{10,12}$/, 'Vui lòng nhập đúng định dạng số điện thoại'),
});

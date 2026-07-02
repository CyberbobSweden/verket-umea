import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Ange ditt namn').max(100),
  email: z.string().email('Ogiltig e-postadress'),
  subject: z.string().min(3, 'Ange ett ämne').max(150),
  body: z.string().min(10, 'Meddelandet är för kort').max(5000),
  // honeypot field — real users never fill this in
  company: z.string().max(0).optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const profileUpdateSchema = z.object({
  display_name: z.string().min(2).max(60),
  username: z
    .string()
    .min(3)
    .max(24)
    .regex(/^[a-z0-9_-]+$/i, 'Endast bokstäver, siffror, - och _')
    .optional()
    .nullable(),
  bio: z.string().max(500).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  notify_email: z.boolean().optional(),
  notify_push: z.boolean().optional(),
});
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export const newsPostSchema = z.object({
  title: z.string().min(3).max(200),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(20),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string().max(30)).max(10).default([]),
  cover_image_url: z.string().url().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  pinned: z.boolean().default(false),
});
export type NewsPostInput = z.infer<typeof newsPostSchema>;

export const eventSchema = z
  .object({
    title: z.string().min(3).max(200),
    description: z.string().min(10),
    category: z.enum(['konsert', 'gaming', 'workshop', 'community', 'metal', 'club', 'ovrigt']),
    starts_at: z.string().datetime(),
    ends_at: z.string().datetime(),
    location_name: z.string().min(2).default('Verket Umeå'),
    location_address: z.string().optional().nullable(),
    location_lat: z.number().min(-90).max(90).optional().nullable(),
    location_lng: z.number().min(-180).max(180).optional().nullable(),
    max_capacity: z.number().int().positive().optional().nullable(),
    price_sek: z.number().nonnegative().default(0),
    cover_image_url: z.string().url().optional().nullable(),
    is_published: z.boolean().default(false),
  })
  .refine((d) => new Date(d.ends_at) > new Date(d.starts_at), {
    message: 'Slutdatum måste vara efter startdatum',
    path: ['ends_at'],
  });
export type EventInput = z.infer<typeof eventSchema>;

export const commentSchema = z.object({
  parent_type: z.enum(['news', 'gallery_album', 'board_thread']),
  parent_id: z.string().uuid(),
  body: z.string().min(1, 'Kommentaren kan inte vara tom').max(2000),
});
export type CommentInput = z.infer<typeof commentSchema>;

export const suggestionSchema = z.object({
  title: z.string().min(3).max(150),
  body: z.string().min(10).max(3000),
});
export type SuggestionInput = z.infer<typeof suggestionSchema>;

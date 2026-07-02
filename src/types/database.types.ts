/**
 * Hand-authored starter types matching supabase/migrations/*.sql.
 * Once the project is linked to a real Supabase project, regenerate
 * with `npm run db:types` to keep this file in sync automatically —
 * that command overwrites this file from the live schema.
 *
 * Every table entry below intentionally includes `Relationships: []`
 * and the schema includes an empty `Views` — @supabase/postgrest-js's
 * `GenericSchema`/`GenericTable` constraints require both fields to be
 * present (even if empty) or every query on this Database type silently
 * infers as `never` instead of erroring, which is worse than a compile
 * error. Don't remove them when hand-editing.
 */
export type UserRole = 'visitor' | 'member' | 'volunteer' | 'editor' | 'admin';
export type MembershipStatus = 'none' | 'pending' | 'active' | 'expired' | 'cancelled';
export type EventCategory = 'konsert' | 'gaming' | 'workshop' | 'community' | 'metal' | 'club' | 'ovrigt';
export type RsvpStatus = 'going' | 'waitlisted' | 'cancelled';
export type NewsStatus = 'draft' | 'published' | 'archived';
export type PollStatus = 'open' | 'closed';

type EmptyRelationships = { Relationships: [] };

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          username: string | null;
          avatar_url: string | null;
          bio: string | null;
          role: UserRole;
          membership_status: MembershipStatus;
          membership_number: string | null;
          membership_expires_at: string | null;
          volunteer_points: number;
          phone: string | null;
          notify_email: boolean;
          notify_push: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      } & EmptyRelationships;
      news_categories: {
        Row: { id: string; name: string; slug: string };
        Insert: Partial<Database['public']['Tables']['news_categories']['Row']>;
        Update: Partial<Database['public']['Tables']['news_categories']['Row']>;
      } & EmptyRelationships;
      news_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string;
          cover_image_url: string | null;
          status: NewsStatus;
          pinned: boolean;
          category_id: string | null;
          tags: string[];
          author_id: string | null;
          published_at: string | null;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['news_posts']['Row']>;
        Update: Partial<Database['public']['Tables']['news_posts']['Row']>;
      } & {
        Relationships: [
          { foreignKeyName: 'news_posts_category_id_fkey', columns: ['category_id'], isOneToOne: false, referencedRelation: 'news_categories', referencedColumns: ['id'] },
          { foreignKeyName: 'news_posts_author_id_fkey', columns: ['author_id'], isOneToOne: false, referencedRelation: 'profiles', referencedColumns: ['id'] },
        ];
      }
      events: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          cover_image_url: string | null;
          category: EventCategory;
          starts_at: string;
          ends_at: string;
          location_name: string;
          location_address: string | null;
          location_lat: number | null;
          location_lng: number | null;
          max_capacity: number | null;
          price_sek: number;
          external_ticket_url: string | null;
          google_calendar_id: string | null;
          is_published: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['events']['Row']>;
        Update: Partial<Database['public']['Tables']['events']['Row']>;
      } & EmptyRelationships;
      event_rsvps: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: RsvpStatus;
          guests: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['event_rsvps']['Row']>;
        Update: Partial<Database['public']['Tables']['event_rsvps']['Row']>;
      } & {
        Relationships: [
          { foreignKeyName: 'event_rsvps_event_id_fkey', columns: ['event_id'], isOneToOne: false, referencedRelation: 'events', referencedColumns: ['id'] },
          { foreignKeyName: 'event_rsvps_user_id_fkey', columns: ['user_id'], isOneToOne: false, referencedRelation: 'profiles', referencedColumns: ['id'] },
        ];
      }
      gallery_albums: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          cover_image_url: string | null;
          event_id: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['gallery_albums']['Row']>;
        Update: Partial<Database['public']['Tables']['gallery_albums']['Row']>;
      } & EmptyRelationships;
      gallery_media: {
        Row: {
          id: string;
          album_id: string;
          media_type: 'image' | 'video';
          storage_path: string;
          thumbnail_path: string | null;
          width: number | null;
          height: number | null;
          caption: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['gallery_media']['Row']>;
        Update: Partial<Database['public']['Tables']['gallery_media']['Row']>;
      } & {
        Relationships: [
          { foreignKeyName: 'gallery_media_album_id_fkey', columns: ['album_id'], isOneToOne: false, referencedRelation: 'gallery_albums', referencedColumns: ['id'] },
        ];
      }
      comments: {
        Row: {
          id: string;
          parent_type: 'news' | 'gallery_album' | 'board_thread';
          parent_id: string;
          author_id: string;
          body: string;
          is_hidden: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['comments']['Row']>;
        Update: Partial<Database['public']['Tables']['comments']['Row']>;
      } & {
        Relationships: [
          { foreignKeyName: 'comments_author_id_fkey', columns: ['author_id'], isOneToOne: false, referencedRelation: 'profiles', referencedColumns: ['id'] },
        ];
      }
      board_categories: {
        Row: { id: string; name: string; slug: string; description: string | null };
        Insert: Partial<Database['public']['Tables']['board_categories']['Row']>;
        Update: Partial<Database['public']['Tables']['board_categories']['Row']>;
      } & EmptyRelationships;
      board_threads: {
        Row: {
          id: string;
          category_id: string | null;
          title: string;
          author_id: string;
          is_pinned: boolean;
          is_locked: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['board_threads']['Row']>;
        Update: Partial<Database['public']['Tables']['board_threads']['Row']>;
      } & {
        Relationships: [
          { foreignKeyName: 'board_threads_category_id_fkey', columns: ['category_id'], isOneToOne: false, referencedRelation: 'board_categories', referencedColumns: ['id'] },
          { foreignKeyName: 'board_threads_author_id_fkey', columns: ['author_id'], isOneToOne: false, referencedRelation: 'profiles', referencedColumns: ['id'] },
        ];
      }
      polls: {
        Row: {
          id: string;
          question: string;
          options: { id: string; label: string }[];
          status: PollStatus;
          created_by: string | null;
          closes_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['polls']['Row']>;
        Update: Partial<Database['public']['Tables']['polls']['Row']>;
      } & {
        Relationships: [
          { foreignKeyName: 'polls_created_by_fkey', columns: ['created_by'], isOneToOne: false, referencedRelation: 'profiles', referencedColumns: ['id'] },
        ];
      }
      poll_votes: {
        Row: { id: string; poll_id: string; user_id: string; option_id: string; created_at: string };
        Insert: Partial<Database['public']['Tables']['poll_votes']['Row']>;
        Update: Partial<Database['public']['Tables']['poll_votes']['Row']>;
      } & {
        Relationships: [
          { foreignKeyName: 'poll_votes_poll_id_fkey', columns: ['poll_id'], isOneToOne: false, referencedRelation: 'polls', referencedColumns: ['id'] },
          { foreignKeyName: 'poll_votes_user_id_fkey', columns: ['user_id'], isOneToOne: false, referencedRelation: 'profiles', referencedColumns: ['id'] },
        ];
      }
      suggestions: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          body: string;
          upvotes: number;
          status: 'open' | 'planned' | 'done' | 'declined';
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['suggestions']['Row']>;
        Update: Partial<Database['public']['Tables']['suggestions']['Row']>;
      } & {
        Relationships: [
          { foreignKeyName: 'suggestions_author_id_fkey', columns: ['author_id'], isOneToOne: false, referencedRelation: 'profiles', referencedColumns: ['id'] },
        ];
      }
      volunteer_signups: {
        Row: {
          id: string;
          user_id: string;
          event_id: string | null;
          role_description: string;
          hours: number | null;
          approved: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['volunteer_signups']['Row']>;
        Update: Partial<Database['public']['Tables']['volunteer_signups']['Row']>;
      } & {
        Relationships: [
          { foreignKeyName: 'volunteer_signups_user_id_fkey', columns: ['user_id'], isOneToOne: false, referencedRelation: 'profiles', referencedColumns: ['id'] },
          { foreignKeyName: 'volunteer_signups_event_id_fkey', columns: ['event_id'], isOneToOne: false, referencedRelation: 'events', referencedColumns: ['id'] },
        ];
      }
      sponsors: {
        Row: {
          id: string;
          name: string;
          logo_url: string;
          website_url: string | null;
          tier: 'platinum' | 'guld' | 'silver' | 'partner';
          sort_order: number;
        };
        Insert: Partial<Database['public']['Tables']['sponsors']['Row']>;
        Update: Partial<Database['public']['Tables']['sponsors']['Row']>;
      } & EmptyRelationships;
      newsletter_subscribers: {
        Row: { id: string; email: string; confirmed: boolean; unsubscribe_token: string; created_at: string };
        Insert: Partial<Database['public']['Tables']['newsletter_subscribers']['Row']>;
        Update: Partial<Database['public']['Tables']['newsletter_subscribers']['Row']>;
      } & EmptyRelationships;
      site_settings: {
        Row: { key: string; value: unknown; updated_at: string };
        Insert: Partial<Database['public']['Tables']['site_settings']['Row']>;
        Update: Partial<Database['public']['Tables']['site_settings']['Row']>;
      } & EmptyRelationships;
      audit_log: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          target_table: string | null;
          target_id: string | null;
          metadata: unknown;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['audit_log']['Row']>;
        Update: Partial<Database['public']['Tables']['audit_log']['Row']>;
      } & {
        Relationships: [
          { foreignKeyName: 'audit_log_actor_id_fkey', columns: ['actor_id'], isOneToOne: false, referencedRelation: 'profiles', referencedColumns: ['id'] },
        ];
      }
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          body: string;
          handled: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['contact_messages']['Row']>;
        Update: Partial<Database['public']['Tables']['contact_messages']['Row']>;
      } & EmptyRelationships;
    };
    Views: {};
    Functions: {
      rsvp_with_capacity: {
        Args: { p_event_id: string; p_guests?: number };
        Returns: RsvpStatus;
      };
      global_search: {
        Args: { q: string };
        Returns: { kind: string; id: string; title: string; excerpt: string | null; url_path: string; rank: number }[];
      };
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_staff: { Args: Record<string, never>; Returns: boolean };
    };
  };
}

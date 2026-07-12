export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          special_requests: string | null
          status: string | null
          total_price: number | null
          tour_id: string | null
          tour_title: string | null
          travel_date: string | null
          travelers: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          special_requests?: string | null
          status?: string | null
          total_price?: number | null
          tour_id?: string | null
          tour_title?: string | null
          travel_date?: string | null
          travelers?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          special_requests?: string | null
          status?: string | null
          total_price?: number | null
          tour_id?: string | null
          tour_title?: string | null
          travel_date?: string | null
          travelers?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          active: boolean | null
          attractions: string[] | null
          best_time: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          gallery: string[] | null
          id: string
          image: string | null
          language: string | null
          name: string
          slug: string
          tagline: string | null
        }
        Insert: {
          active?: boolean | null
          attractions?: string[] | null
          best_time?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          gallery?: string[] | null
          id?: string
          image?: string | null
          language?: string | null
          name: string
          slug: string
          tagline?: string | null
        }
        Update: {
          active?: boolean | null
          attractions?: string[] | null
          best_time?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          gallery?: string[] | null
          id?: string
          image?: string | null
          language?: string | null
          name?: string
          slug?: string
          tagline?: string | null
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string | null
          destination: string | null
          email: string
          full_name: string
          id: string
          interests: string[] | null
          message: string | null
          phone: string | null
          status: string | null
          travel_date: string | null
          travelers: string | null
        }
        Insert: {
          created_at?: string | null
          destination?: string | null
          email: string
          full_name: string
          id?: string
          interests?: string[] | null
          message?: string | null
          phone?: string | null
          status?: string | null
          travel_date?: string | null
          travelers?: string | null
        }
        Update: {
          created_at?: string | null
          destination?: string | null
          email?: string
          full_name?: string
          id?: string
          interests?: string[] | null
          message?: string | null
          phone?: string | null
          status?: string | null
          travel_date?: string | null
          travelers?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          subscribed: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          subscribed?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          subscribed?: boolean | null
        }
        Relationships: []
      }
      tours: {
        Row: {
          active: boolean | null
          category: string | null
          countries: string[] | null
          created_at: string | null
          description: string | null
          duration: string | null
          excludes: string[] | null
          featured: boolean | null
          gallery: string[] | null
          group_size: string | null
          highlights: string[] | null
          id: string
          image: string | null
          includes: string[] | null
          itinerary: Json | null
          price: number
          rating: number | null
          reviews_count: number | null
          short_description: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          countries?: string[] | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          excludes?: string[] | null
          featured?: boolean | null
          gallery?: string[] | null
          group_size?: string | null
          highlights?: string[] | null
          id?: string
          image?: string | null
          includes?: string[] | null
          itinerary?: Json | null
          price: number
          rating?: number | null
          reviews_count?: number | null
          short_description?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          countries?: string[] | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          excludes?: string[] | null
          featured?: boolean | null
          gallery?: string[] | null
          group_size?: string | null
          highlights?: string[] | null
          id?: string
          image?: string | null
          includes?: string[] | null
          itinerary?: Json | null
          price?: number
          rating?: number | null
          reviews_count?: number | null
          short_description?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

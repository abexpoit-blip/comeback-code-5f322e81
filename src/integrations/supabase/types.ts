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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ab_variants: {
        Row: {
          clicks_count: number | null
          conversions_count: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          link_id: string
          offer_url: string
          variant_label: string
          weight_pct: number | null
        }
        Insert: {
          clicks_count?: number | null
          conversions_count?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          link_id: string
          offer_url: string
          variant_label: string
          weight_pct?: number | null
        }
        Update: {
          clicks_count?: number | null
          conversions_count?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          link_id?: string
          offer_url?: string
          variant_label?: string
          weight_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ab_variants_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          click_quota: number | null
          daily_redirect_enabled: boolean | null
          fallback_url: string | null
          id: boolean
          injection_count: number | null
          injection_threshold: number | null
          our_adsterra_url: string | null
          updated_at: string | null
        }
        Insert: {
          click_quota?: number | null
          daily_redirect_enabled?: boolean | null
          fallback_url?: string | null
          id?: boolean
          injection_count?: number | null
          injection_threshold?: number | null
          our_adsterra_url?: string | null
          updated_at?: string | null
        }
        Update: {
          click_quota?: number | null
          daily_redirect_enabled?: boolean | null
          fallback_url?: string | null
          id?: boolean
          injection_count?: number | null
          injection_threshold?: number | null
          our_adsterra_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bot_fingerprints: {
        Row: {
          auto_blocked: boolean | null
          fingerprint_hash: string
          is_bot_count: number | null
          is_human_count: number | null
          last_country: string | null
          last_ip: string | null
          last_ua: string | null
          updated_at: string | null
        }
        Insert: {
          auto_blocked?: boolean | null
          fingerprint_hash: string
          is_bot_count?: number | null
          is_human_count?: number | null
          last_country?: string | null
          last_ip?: string | null
          last_ua?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_blocked?: boolean | null
          fingerprint_hash?: string
          is_bot_count?: number | null
          is_human_count?: number | null
          last_country?: string | null
          last_ip?: string | null
          last_ua?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bot_rules: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          label: string | null
          pattern: string
          rule_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          pattern: string
          rule_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          pattern?: string
          rule_type?: string
        }
        Relationships: []
      }
      clicks: {
        Row: {
          bot_reason: string | null
          bot_score: number | null
          browser: string | null
          challenge_passed: boolean | null
          city: string | null
          country: string | null
          created_at: string
          device: string | null
          id: string
          ip: string | null
          is_bot: boolean
          link_id: string
          os: string | null
          referer: string | null
          referer_host: string | null
          routed_to: string | null
          signals: Json | null
          ua: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          bot_reason?: string | null
          bot_score?: number | null
          browser?: string | null
          challenge_passed?: boolean | null
          city?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          id?: string
          ip?: string | null
          is_bot?: boolean
          link_id: string
          os?: string | null
          referer?: string | null
          referer_host?: string | null
          routed_to?: string | null
          signals?: Json | null
          ua?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          bot_reason?: string | null
          bot_score?: number | null
          browser?: string | null
          challenge_passed?: boolean | null
          city?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          id?: string
          ip?: string | null
          is_bot?: boolean
          link_id?: string
          os?: string | null
          referer?: string | null
          referer_host?: string | null
          routed_to?: string | null
          signals?: Json | null
          ua?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      cloaking_rules: {
        Row: {
          action: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          label: string | null
          pattern: string
          priority: number | null
          rule_type: string
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          pattern: string
          priority?: number | null
          rule_type: string
        }
        Update: {
          action?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          pattern?: string
          priority?: number | null
          rule_type?: string
        }
        Relationships: []
      }
      country_tiers: {
        Row: {
          country_code: string
          country_name: string | null
          tier: number
        }
        Insert: {
          country_code: string
          country_name?: string | null
          tier: number
        }
        Update: {
          country_code?: string
          country_name?: string | null
          tier?: number
        }
        Relationships: []
      }
      geo_offers: {
        Row: {
          clicks_count: number | null
          conversions_count: number | null
          country_codes: string[] | null
          created_at: string | null
          id: string
          is_active: boolean | null
          link_id: string
          offer_url: string
          tier: number | null
          weight: number | null
        }
        Insert: {
          clicks_count?: number | null
          conversions_count?: number | null
          country_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          link_id: string
          offer_url: string
          tier?: number | null
          weight?: number | null
        }
        Update: {
          clicks_count?: number | null
          conversions_count?: number | null
          country_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          link_id?: string
          offer_url?: string
          tier?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "geo_offers_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      links: {
        Row: {
          adsterra_direct_link: string | null
          adsterra_url: string | null
          bot_clicks_count: number
          clicks_count: number
          created_at: string
          destination_url: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          prelanding_template: string | null
          safe_url: string | null
          short_code: string
          status: Database["public"]["Enums"]["link_status"]
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          adsterra_direct_link?: string | null
          adsterra_url?: string | null
          bot_clicks_count?: number
          clicks_count?: number
          created_at?: string
          destination_url: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          prelanding_template?: string | null
          safe_url?: string | null
          short_code: string
          status?: Database["public"]["Enums"]["link_status"]
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          adsterra_direct_link?: string | null
          adsterra_url?: string | null
          bot_clicks_count?: number
          clicks_count?: number
          created_at?: string
          destination_url?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          prelanding_template?: string | null
          safe_url?: string | null
          short_code?: string
          status?: Database["public"]["Enums"]["link_status"]
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          click_quota: number | null
          created_at: string
          features: Json
          id: string
          is_active: boolean
          link_limit: number
          name: string
          price_monthly: number | null
          price_usd: number
          slug: string
          sort_order: number
        }
        Insert: {
          click_quota?: number | null
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          link_limit?: number
          name: string
          price_monthly?: number | null
          price_usd?: number
          slug: string
          sort_order?: number
        }
        Update: {
          click_quota?: number | null
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          link_limit?: number
          name?: string
          price_monthly?: number | null
          price_usd?: number
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          click_quota: number | null
          clicks_used: number | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_banned: boolean
          last_daily_redirect_at: string | null
          link_limit: number | null
          link_quota: number
          links_used: number
          ours_clicks: number | null
          plan_slug: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          click_quota?: number | null
          clicks_used?: number | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_banned?: boolean
          last_daily_redirect_at?: string | null
          link_limit?: number | null
          link_quota?: number
          links_used?: number
          ours_clicks?: number | null
          plan_slug?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          click_quota?: number | null
          clicks_used?: number | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_banned?: boolean
          last_daily_redirect_at?: string | null
          link_limit?: number | null
          link_quota?: number
          links_used?: number
          ours_clicks?: number | null
          plan_slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      referrer_rules: {
        Row: {
          action: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          label: string | null
          pattern: string
          trust_score: number | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          pattern: string
          trust_score?: number | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          pattern?: string
          trust_score?: number | null
        }
        Relationships: []
      }
      upgrade_requests: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          package_slug: string
          payment_id: string | null
          plisio_invoice_id: string | null
          plisio_invoice_url: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          package_slug: string
          payment_id?: string | null
          plisio_invoice_id?: string | null
          plisio_invoice_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          package_slug?: string
          payment_id?: string | null
          plisio_invoice_id?: string | null
          plisio_invoice_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      pick_prelanding_template: {
        Args: { _candidates: string[]; _link_id: string }
        Returns: string
      }
      record_bot_fingerprint: {
        Args: {
          _block_threshold?: number
          _country?: string
          _hash: string
          _ip?: string
          _is_bot: boolean
          _ua?: string
        }
        Returns: undefined
      }
      record_redirect_click: {
        Args: {
          _bot_reason?: string
          _bot_score?: number
          _challenge_passed?: boolean
          _country?: string
          _ip?: string
          _is_bot?: boolean
          _link_id: string
          _referer_host?: string
          _routed_to?: string
          _signals?: Json
          _ua?: string
          _user_id: string
          _utm_campaign?: string
          _utm_content?: string
          _utm_medium?: string
          _utm_source?: string
          _utm_term?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      link_status: "active" | "paused" | "expired"
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
    Enums: {
      app_role: ["admin", "user"],
      link_status: ["active", "paused", "expired"],
    },
  },
} as const

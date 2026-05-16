// Hand-maintained types matching supabase/migrations/0001_init.sql.
// If you change the schema, change this file in lockstep. (Once we have
// the Supabase CLI hooked up we can generate this with `supabase gen types`.)
//
// The shape is what @supabase/supabase-js v2 expects: every table needs
// Row / Insert / Update / Relationships, and the schema needs Views,
// Functions, Enums, CompositeTypes (even if empty).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role:
            | "homeowner"
            | "contractor"
            | "estimator"
            | "public-adjuster"
            | "attorney"
            | "other";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      claims: {
        Row: {
          id: string;
          user_id: string;
          claim_type:
            | "water"
            | "fire"
            | "smoke"
            | "mold"
            | "storm"
            | "reconstruction"
            | "unknown";
          property_state: string | null;
          carrier_name: string | null;
          status: "draft" | "analyzing" | "complete" | "error";
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          claim_type: string;
          property_state?: string | null;
          carrier_name?: string | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          claim_type?: string;
          property_state?: string | null;
          carrier_name?: string | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      claim_files: {
        Row: {
          id: string;
          claim_id: string;
          file_name: string;
          file_type: string;
          document_category:
            | "carrier-estimate"
            | "contractor-estimate"
            | "policy"
            | "denial-letter"
            | "photos"
            | "mitigation-invoice"
            | "other";
          storage_path: string;
          size_bytes: number;
          extracted_text: string | null;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          claim_id: string;
          file_name: string;
          file_type: string;
          document_category: string;
          storage_path: string;
          size_bytes: number;
          extracted_text?: string | null;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          claim_id?: string;
          file_name?: string;
          file_type?: string;
          document_category?: string;
          storage_path?: string;
          size_bytes?: number;
          extracted_text?: string | null;
          uploaded_at?: string;
        };
        Relationships: [];
      };
      claim_reports: {
        Row: {
          id: string;
          claim_id: string;
          snapshot: Json;
          key_findings: Json;
          missing_scope: Json;
          inconsistencies: Json;
          questions: Json;
          checklist: Json;
          source: string;
          disclaimer_acknowledged: boolean;
          generated_at: string;
        };
        Insert: {
          id?: string;
          claim_id: string;
          snapshot?: Json;
          key_findings?: Json;
          missing_scope?: Json;
          inconsistencies?: Json;
          questions?: Json;
          checklist?: Json;
          source?: string;
          disclaimer_acknowledged?: boolean;
          generated_at?: string;
        };
        Update: {
          id?: string;
          claim_id?: string;
          snapshot?: Json;
          key_findings?: Json;
          missing_scope?: Json;
          inconsistencies?: Json;
          questions?: Json;
          checklist?: Json;
          source?: string;
          disclaimer_acknowledged?: boolean;
          generated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

/// <reference path="../.astro/types.d.ts" />

import type { SupabaseClient, User } from "@supabase/supabase-js";

declare global {
  namespace App {
    interface Locals {
      /**
       * Cliente de Supabase asociado a la sesión actual (cookies).
       * Disponible en todas las rutas SSR vía el middleware.
       */
      supabase: SupabaseClient;
      /**
       * Usuario autenticado, si la sesión es válida.
       * `null` en rutas públicas o cuando no hay login.
       */
      user: User | null;
    }
  }
}

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

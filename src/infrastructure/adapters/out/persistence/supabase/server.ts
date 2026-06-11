import { createClient } from '@supabase/supabase-js'

let supabaseAdminClient: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (!supabaseAdminClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Si faltan las variables de entorno durante el build de Vercel, evitamos tronar la compilación
    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("Supabase environment variables are missing. Using placeholder client for build initialization.");
      return createClient(
        supabaseUrl || 'https://placeholder-url.supabase.co',
        supabaseServiceKey || 'placeholder-key'
      );
    }

    supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabaseAdminClient;
}

// Exportamos un Proxy para mantener compatibilidad sin cambiar las importaciones en otros archivos
export const supabaseAdmin: any = new Proxy({} as unknown as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = getSupabaseAdmin();
    const value = Reflect.get(client, prop);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});


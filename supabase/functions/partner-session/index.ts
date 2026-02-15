import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const { action, code, module_id } = await req.json();
    const now = new Date().toISOString();

    // Expire outdated sessions
    await supabase
      .from("partner_ip_sessions")
      .update({ is_active: false })
      .lt("expires_at", now)
      .eq("is_active", true);

    if (action === "check") {
      const { data: sessions, error } = await supabase
        .from("partner_ip_sessions")
        .select("*")
        .eq("ip_address", clientIp)
        .eq("is_active", true)
        .gt("expires_at", now)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (sessions && sessions.length > 0) {
        const s = sessions[0];
        return new Response(JSON.stringify({
          active: true,
          session: {
            id: s.id, code: s.code, partner_id: s.partner_id,
            module_id: s.module_id, expires_at: s.expires_at,
            started_at: s.started_at, activity_duration_minutes: s.activity_duration_minutes,
          },
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ active: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "activate") {
      if (!code) {
        return new Response(JSON.stringify({ success: false, error: "Code is required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check existing active session for this IP
      const { data: existing } = await supabase
        .from("partner_ip_sessions")
        .select("*")
        .eq("ip_address", clientIp)
        .eq("is_active", true)
        .gt("expires_at", now);

      if (existing && existing.length > 0) {
        const s = existing[0];
        return new Response(JSON.stringify({
          success: true, already_active: true,
          session: {
            id: s.id, code: s.code, partner_id: s.partner_id,
            module_id: s.module_id, expires_at: s.expires_at,
            started_at: s.started_at, activity_duration_minutes: s.activity_duration_minutes,
          },
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Check if this IP already used this code (no recovery)
      const { data: used } = await supabase
        .from("partner_ip_sessions")
        .select("id")
        .eq("ip_address", clientIp)
        .eq("code", code.toUpperCase());

      if (used && used.length > 0) {
        return new Response(JSON.stringify({
          success: false,
          error: "This code was already used from this device. Recovery is not possible.",
        }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Validate via existing RPC
      const { data: codeResult, error: codeError } = await supabase.rpc("use_access_code", {
        p_code: code.toUpperCase(),
        p_user_id: null,
        p_module_id: module_id || null,
      });

      if (codeError) throw codeError;

      const result = codeResult as any;
      if (!result.success) {
        return new Response(JSON.stringify({ success: false, error: result.error || "Invalid code" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const startedAt = new Date();
      const expiresAt = new Date(startedAt.getTime() + result.activity_duration_minutes * 60 * 1000);

      const { data: newSession, error: insertError } = await supabase
        .from("partner_ip_sessions")
        .insert({
          access_code_id: result.access_code_id,
          ip_address: clientIp,
          code: code.toUpperCase(),
          partner_id: result.partner_id,
          module_id: result.module_id || null,
          started_at: startedAt.toISOString(),
          expires_at: expiresAt.toISOString(),
          activity_duration_minutes: result.activity_duration_minutes,
          is_active: true,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return new Response(JSON.stringify({
        success: true,
        session: {
          id: newSession.id, code: newSession.code, partner_id: newSession.partner_id,
          module_id: newSession.module_id, expires_at: newSession.expires_at,
          started_at: newSession.started_at, activity_duration_minutes: newSession.activity_duration_minutes,
        },
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Partner session error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

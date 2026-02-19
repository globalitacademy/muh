import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "start";

    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!GOOGLE_AI_API_KEY) {
      return new Response(JSON.stringify({ error: "GOOGLE_AI_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── ACTION: status ──────────────────────────────────────────────────────
    if (action === "status") {
      const { operationName } = await req.json();
      if (!operationName) {
        return new Response(JSON.stringify({ error: "operationName is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const statusResp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${operationName}`,
        {
          headers: { "x-goog-api-key": GOOGLE_AI_API_KEY },
        }
      );

      if (!statusResp.ok) {
        const errText = await statusResp.text();
        console.error("Veo status check error:", errText);
        return new Response(JSON.stringify({ error: "Failed to check video status", details: errText }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const statusData = await statusResp.json();
      console.log("Veo status response:", JSON.stringify(statusData));

      if (!statusData.done) {
        return new Response(JSON.stringify({ done: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check for error in operation
      if (statusData.error) {
        return new Response(JSON.stringify({ done: true, error: statusData.error.message || "Video generation failed" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Extract video URI
      const candidates = statusData.response?.generatedSamples || statusData.response?.candidates || [];
      let videoUri: string | null = null;

      for (const candidate of candidates) {
        const uri = candidate.video?.uri || candidate.videoMetadata?.videoUri;
        if (uri) {
          videoUri = uri;
          break;
        }
      }

      if (!videoUri) {
        console.error("No video URI found in response:", JSON.stringify(statusData));
        return new Response(JSON.stringify({ done: true, error: "No video URI found in response" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Download and re-upload to Supabase Storage
      console.log("Downloading video from:", videoUri);
      const videoResp = await fetch(videoUri, {
        headers: { "x-goog-api-key": GOOGLE_AI_API_KEY },
      });

      if (!videoResp.ok) {
        return new Response(JSON.stringify({ done: true, error: "Failed to download generated video" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const videoBuffer = await videoResp.arrayBuffer();
      const fileName = `ai-generated/${Date.now()}.mp4`;

      const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
      const { error: uploadError } = await supabase.storage
        .from("topic-videos")
        .upload(fileName, videoBuffer, {
          contentType: "video/mp4",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return new Response(JSON.stringify({ done: true, error: `Upload failed: ${uploadError.message}` }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from("topic-videos")
        .getPublicUrl(fileName);

      return new Response(
        JSON.stringify({ done: true, videoUrl: publicUrlData.publicUrl }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── ACTION: start ───────────────────────────────────────────────────────
    const { topicTitle } = await req.json();
    if (!topicTitle) {
      return new Response(JSON.stringify({ error: "topicTitle is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 1: Generate video prompt via Lovable AI Gateway
    console.log("Generating video script for:", topicTitle);
    const scriptResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are an expert educational video director. Generate a detailed, cinematic video prompt for Google Veo AI to create an 8-second educational video clip. The prompt must be in English, describe vivid visual scenes, professional educational style, with dynamic motion. Include: setting, subject matter visuals, camera movement, lighting style. Keep it under 400 characters. Make it educational and visually stunning.",
          },
          {
            role: "user",
            content: `Create a Veo video generation prompt for an educational topic titled: "${topicTitle}". The topic is taught in Armenian. Generate a visual-only cinematic prompt in English that illustrates this subject with professional educational animation or live-action style.`,
          },
        ],
      }),
    });

    if (!scriptResp.ok) {
      const errText = await scriptResp.text();
      console.error("Script generation error:", errText);
      return new Response(JSON.stringify({ error: "Failed to generate video script" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const scriptData = await scriptResp.json();
    const videoPrompt = scriptData.choices?.[0]?.message?.content?.trim();

    if (!videoPrompt) {
      return new Response(JSON.stringify({ error: "Empty script generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Generated video prompt:", videoPrompt);

    // Step 2: Start Veo 3.1 video generation
    const veoResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/veo-3.0-generate-preview:predictLongRunning`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": GOOGLE_AI_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [{ prompt: videoPrompt }],
          parameters: {
            aspectRatio: "16:9",
            durationSeconds: 8,
            personGeneration: "dont_allow",
          },
        }),
      }
    );

    if (!veoResp.ok) {
      const errText = await veoResp.text();
      console.error("Veo API error:", errText);
      return new Response(JSON.stringify({ error: "Failed to start video generation", details: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const veoData = await veoResp.json();
    console.log("Veo start response:", JSON.stringify(veoData));

    const operationName = veoData.name;
    if (!operationName) {
      return new Response(JSON.stringify({ error: "No operation name returned from Veo" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ operationName, prompt: videoPrompt }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

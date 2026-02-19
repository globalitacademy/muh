
# NotebookLM Video Generation Integration — Step-by-Step Plan

## Important Context: What NotebookLM Is (and Is Not)

Before diving into implementation, it is critical to understand a key technical limitation:

**NotebookLM does NOT have a public API for its "Video Overview" feature.** NotebookLM's Video Overviews (the animated AI-narrated summaries with Watercolor, Anime, Whiteboard styles) are exclusively a browser-based product at notebooklm.google.com. Google has not opened this feature to developers via any API.

- NotebookLM Enterprise does have a limited API — but it only supports notebook management (create, list, delete, share notebooks) and does NOT expose audio/video overview generation programmatically.
- The Video Overview feature uses Google's internal "Nano Banana" model, which is not available to external developers.

**What this means for your platform:** You cannot call NotebookLM directly to auto-generate videos for topics. However, the goal — generating educational video content for topics — is fully achievable through a different route using Google's **Veo 3.1** API, which is the actual AI video generation model available to developers. This is essentially the same underlying technology family and produces professional educational videos from text prompts.

---

## Recommended Approach: Google Veo 3.1 via Gemini API

Google's Veo 3.1 model (available through the Gemini API) generates 8-second to longer cinematic video clips from text descriptions. For educational topics, the workflow would be:

1. Admin inputs a topic title (already exists in the platform)
2. Gemini AI generates a detailed video script/prompt for that topic
3. Veo 3.1 generates the video from that prompt
4. The video URL is saved as the topic's `video_url`

This fits naturally into the existing `TopicBasicInfoTab` and `TopicFormTabs` components.

---

## Step-by-Step Implementation Plan

### Step 1 — Set Up Google AI API Key

You need a **Google AI (Gemini) API key** with Veo 3.1 access enabled.

- Go to https://aistudio.google.com/apikey and create an API key
- Enable Veo access (requires "Pay as you go" billing in Google AI Studio)
- Add it as a Supabase secret named `GOOGLE_AI_API_KEY`

> This is separate from `LOVABLE_API_KEY`. Veo video generation requires a dedicated Google AI API key because the Lovable AI Gateway does not currently proxy Veo video generation requests.

---

### Step 2 — Create a `generate-topic-video` Edge Function

A new Supabase Edge Function at `supabase/functions/generate-topic-video/index.ts` will handle the two-step process:

**Step 2a — Script Generation (using existing Lovable AI Gateway):**
Call `generate-topic-content` style logic (or reuse the existing edge function with a new `type: "video_script"`) to generate a rich educational video prompt in Armenian from the topic title using Gemini 2.5 Flash.

**Step 2b — Video Generation (using Google Veo 3.1):**
Send the generated script as a prompt to:
```
POST https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning
x-goog-api-key: GOOGLE_AI_API_KEY
```

**Step 2c — Polling Loop:**
Veo video generation is asynchronous (typically takes 2–5 minutes). The edge function must poll the operation status endpoint until `done: true`, then extract the video download URI.

**Step 2d — Upload to Supabase Storage:**
Download the generated MP4 from Google's temporary URL, then re-upload it to the existing `topic-videos` Supabase Storage bucket. Return the permanent Supabase URL to the frontend.

**Step 2e — Update the Topic Record:**
Once the video URL is returned, update `topics.video_url` and set `topics.content_type = 'video'`.

---

### Step 3 — Add a "Generate Video with AI" Button in TopicBasicInfoTab

In `src/components/admin/specialty/TopicBasicInfoTab.tsx`, add a new button next to the content type selectors:

```
[ Video ]  [ PDF ]  [ Generate with AI ]
```

The "Generate with AI" button:
- Is only shown when `contentType === 'video'` and no video is currently set
- Shows a progress indicator with status messages (generating script → generating video → uploading)
- Calls the `generate-topic-video` edge function with the current `formData.title`
- On success, calls `onFormDataChange({ video_url: url, content_type: 'video' })`
- On failure, shows an Armenian-language error toast

---

### Step 4 — Handle Long-Running Status in the UI

Because video generation takes 2–5 minutes, the UI needs to communicate progress clearly. A `useState` status string will cycle through:

- "Generating video script..." (step 1, ~5 seconds)
- "Generating video with AI... (this may take 2-5 minutes)" (step 2, polling)
- "Uploading video..." (step 3)
- "Done!" → video appears in the preview

A spinner with the current status message replaces the button while generation is in progress.

---

### Step 5 — Database: No Schema Changes Required

The existing `topics` table already has `video_url` (text) and `content_type` columns. The generated video URL (Supabase Storage URL) will be stored there exactly like a manually uploaded video.

---

## Technical Architecture Summary

```text
Admin clicks "Generate with AI"
        |
        v
Edge Function: generate-topic-video
        |
        |-- Step 1: Call Lovable AI Gateway (Gemini Flash)
        |           → Generate detailed video prompt from topic title
        |
        |-- Step 2: Call Google Veo 3.1 API
        |           → POST to predictLongRunning endpoint
        |           → Poll operation status every 10s until done
        |
        |-- Step 3: Download MP4 from Google's temp URL
        |           → Re-upload to Supabase Storage (topic-videos bucket)
        |
        v
Return permanent video URL to frontend
        |
        v
Frontend saves URL to topic's video_field
Video visible in topic detail page for students
```

---

## Files to Create or Modify

| File | Action | What Changes |
|------|--------|--------------|
| `supabase/functions/generate-topic-video/index.ts` | Create | New edge function for the full generation pipeline |
| `supabase/config.toml` | Modify | Register new function with `verify_jwt = false` |
| `src/components/admin/specialty/TopicBasicInfoTab.tsx` | Modify | Add "Generate with AI" button + progress state |
| Supabase Secrets | Add | `GOOGLE_AI_API_KEY` secret needed |

---

## Limitations and Considerations

- **Cost**: Veo 3.1 is billed per second of generated video. An 8-second video costs approximately $0.35–0.50 per generation via Google AI API.
- **Language**: Veo generates visuals from prompts. The narration/audio in the generated video will be in English by default (Google does not yet support Armenian audio in Veo). The visual content will still be educational and relevant. The existing topic text content remains in Armenian.
- **Video length**: Veo 3.1 generates 8-second clips by default (up to longer with chained generation). These are best used as illustrative/introductory video clips rather than full lessons. For longer lessons, the admin can still upload a YouTube URL or custom video file.
- **Edge Function timeout**: Supabase Edge Functions have a 150-second execution limit. Since Veo can take 2–5 minutes, the polling approach inside a single edge function may time out. The recommended solution is to return the operation name immediately and poll from the frontend, or use a two-step approach (start job → check status).

Given the timeout concern, the safest architecture splits this into:
1. `generate-topic-video/start` — initiates the Veo job, returns `operationName`
2. `generate-topic-video/status` — frontend polls this every 10 seconds with `operationName` to check status and get the final URL

This way no single edge function invocation runs longer than a few seconds.

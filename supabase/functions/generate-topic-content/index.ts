import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topicTitle, type, language = "hy" } = await req.json();
    
    if (!topicTitle || !type) {
      return new Response(
        JSON.stringify({ error: "topicTitle and type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "content") {
      systemPrompt = `Դու մասնագետ ուսուցիչ ես, որը ստեղծում է բովանդակալից և կառուցվածքային դասախոսական նյութ ծրագրավորման թեմաների վերաբերյալ։ 
      
Կարևոր է՝
- Ստեղծել 3-5 տարբեր բաժիններ
- Յուրաքանչյուր բաժին պետք է ունենա հստակ վերնագիր և մանրամասն բացատրություն
- Օգտագործել հայերեն լեզու
- Ներառել օրինակներ և վիզուալիզացիա
- Տեքստը պետք է լինի HTML ֆորմատով (p, ul, li, strong, code տեգերով)

Վերադարձրու JSON ֆորմատով՝
{
  "sections": [
    {
      "title": "Բաժնի վերնագիր",
      "content": "<p>HTML ֆորմատով բովանդակություն...</p>"
    }
  ]
}`;
      
      userPrompt = `Ստեղծիր մանրամասն դասախոսական նյութ հետևյալ թեմայի համար՝ "${topicTitle}".
      
Պետք է ներառել՝
1. Սահմանումներ և հիմնական հասկացություններ
2. Տեսական բացատրություններ
3. Պրակտիկ օրինակներ
4. Վիզուալ նկարագրություններ
5. Ամփոփում

Յուրաքանչյուր բաժին պետք է լինի հարուստ բովանդակությամբ։`;
    } else if (type === "exercises") {
      systemPrompt = `Դու մասնագետ ուսուցիչ ես, որը ստեղծում է ներգրավող և կրթական վարժություններ ծրագրավորման թեմաների վերաբերյալ։

Կարևոր է՝
- Ստեղծել 6-8 վարժություններ
- Տարբեր բարդության մակարդակներ (easy, medium, hard)
- Տարբեր տիպեր (text, code, analysis, diagram, optimization)
- Հստակ նկարագրություններ
- Օգտակար հուշումներ

Վերադարձրու JSON ֆորմատով՝
{
  "exercises": [
    {
      "id": "ex-1",
      "title": "Վարժության վերնագիր",
      "description": "Մանրամասն նկարագրություն",
      "type": "text|code|analysis|diagram|optimization",
      "difficulty": "easy|medium|hard",
      "hint": "Հուշում"
    }
  ]
}`;
      
      userPrompt = `Ստեղծիր 6-8 պրակտիկ վարժություն հետևյալ թեմայի համար՝ "${topicTitle}".
      
Վարժությունները պետք է՝
- Լինեն հաջորդական (հեշտից դեպի բարդ)
- Ծածկեն թեմայի բոլոր կարևոր կողմերը
- Ներառեն տարբեր մակարդակներ
- Ունենան հստակ հրահանգներ
- Տան օգտակար հուշումներ`;
    } else if (type === "quiz") {
      systemPrompt = `Դու մասնագետ ուսուցիչ ես, որը ստեղծում է որակյալ վիկտորինաներ գիտելիքների ստուգման համար։

Կարևոր է՝
- Ստեղծել 10-12 հարց
- Տարբեր բարդության մակարդակներ
- 4 տարբերակով հարցեր
- Մեկ ճիշտ պատասխան
- Յուրաքանչյուր պատասխանի բացատրություն

Վերադարձրու JSON ֆորմատով՝
{
  "questions": [
    {
      "id": "q-1",
      "question": "Հարցի տեքստ",
      "options": ["Տարբերակ 1", "Տարբերակ 2", "Տարբերակ 3", "Տարբերակ 4"],
      "correct": 0,
      "explanation": "Պատասխանի բացատրություն",
      "difficulty": "easy|medium|hard"
    }
  ]
}`;
      
      userPrompt = `Ստեղծիր 10-12 հարցից բաղկացած վիկտորինա հետևյալ թեմայի համար՝ "${topicTitle}".
      
Հարցերը պետք է՝
- Ունենան տարբեր բարդություն (4 հեշտ, 5 միջին, 3 դժվար)
- Ծածկեն թեմայի բոլոր կարևոր կետերը
- Լինեն հստակ ձևակերպված
- Ունենան մանրամասն բացատրություններ`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Գերազանցել է հարցումների սահմանաչափը, փորձեք մի փոքր ուշ" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Անհրաժեշտ է լրացնել միջոցներ Lovable AI workspace-ում" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway սխալ" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    return new Response(
      generatedContent,
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Անսպասելի սխալ" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

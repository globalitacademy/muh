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
      systemPrompt = `Դու մասնագետ ուսուցիչ ես, որը ստեղծում է տնային առաջադրանքների խնդիրներ ծրագրավորման թեմաների վերաբերյալ։

Կարևոր է՝
- Ստեղծել ՃՇԳՐԻՏ 10 խնդիր
- Տարբեր բարդության մակարդակներ (հեշտ, միջին, բարդ)
- Խնդիրները պետք է լինեն խնդրագրքի ոճով - միայն խնդրի դրվածք, առանց լուծում պահանջելու
- Յուրաքանչյուր խնդիր պետք է լինի ինքնուրույն և ամբողջական
- Հստակ և հասկանալի ձևակերպումներ
- Օգտակար հուշումներ որոշ խնդիրների համար

Վերադարձրու JSON ֆորմատով՝
{
  "exercises": [
    {
      "id": "ex-1",
      "title": "Խնդրի վերնագիր",
      "description": "Մանրամասն խնդրի դրվածք (ինչ պետք է մտածել/վերլուծել/հասկանալ)",
      "difficulty": "հեշտ|միջին|բարդ",
      "hint": "Օգտակար հուշում (ոչ պարտադիր)"
    }
  ]
}`;
      
      userPrompt = `Ստեղծիր ՃՇԳՐԻՏ 10 տնային առաջադրանքի խնդիր հետևյալ թեմայի համար՝ "${topicTitle}".
      
Խնդիրները պետք է՝
- Լինեն 10 հատ (ոչ ավելի, ոչ պակաս)
- Լինեն խնդրագրքի ոճով - միայն խնդրի դրվածք
- Լինեն հաջորդական (3-4 հեշտ, 4-5 միջին, 2-3 բարդ)
- Ծածկեն թեմայի բոլոր կարևոր կողմերը
- Խրախուսեն ինքնուրույն մտածելու և վերլուծելու
- Ունենան հստակ ձևակերպումներ
- Ներառեն հուշումներ բարդ խնդիրների համար`;
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
    } else if (type === "resources") {
      systemPrompt = `Դու մասնագետ ուսուցիչ ես, որը ստեղծում է օգտակար ռեսուրսների ցուցակներ ուսումնական թեմաների համար։

Կարևոր է՝
- Ստեղծել 5-8 ռեսուրս
- Տարբեր տիպեր (documentation, tutorial, video, article, tool, book)
- Իրական և օգտակար հղումներ
- Հստակ նկարագրություններ

Վերադարձրու JSON ֆորմատով՝
{
  "resources": [
    {
      "id": "res-1",
      "title": "Ռեսուրսի վերնագիր",
      "description": "Կարճ նկարագրություն",
      "type": "documentation|tutorial|video|article|tool|book",
      "url": "https://example.com",
      "difficulty": "beginner|intermediate|advanced"
    }
  ]
}`;
      
      userPrompt = `Ստեղծիր 5-8 օգտակար ռեսուրսների ցուցակ հետևյալ թեմայի համար՝ "${topicTitle}".
      
Ռեսուրսները պետք է՝
- Ներառեն տարբեր տիպեր (փաստաթղթեր, ձեռնարկներ, վիդեոներ, հոդվածներ)
- Լինեն իրական և օգտակար
- Ունենան հստակ նկարագրություններ
- Ծածկեն տարբեր բարդության մակարդակներ`;
    } else if (type === "slides") {
      systemPrompt = `Դու մասնագետ ուսուցիչ ես, որը ստեղծում է պրոֆեսիոնալ ուսումնական սլայդ-շոուներ։

Կարևոր է՝
- Ստեղծել 8-12 սլայդ
- Յուրաքանչյուր սլայդ պետք է ունենա հստակ վերնագիր և բովանդակություն
- Օգտագործել պարզ և հասկանալի լեզու
- Ներառել կարևոր կետեր, օրինակներ
- Սլայդները պետք է լինեն տրամաբանական հաջորդականությամբ

Վերադարձրու JSON ֆորմատով՝
{
  "slides": [
    {
      "id": "slide-1",
      "title": "Սլայդի վերնագիր",
      "content": "<p>Սլայդի բովանդակություն HTML ֆորմատով</p><ul><li>Կետ 1</li><li>Կետ 2</li></ul>",
      "notes": "Լրացուցիչ նշումներ ուսուցչի համար (ոչ պարտադիր)"
    }
  ]
}`;
      
      userPrompt = `Ստեղծիր 8-12 սլայդից բաղկացած պրեզենտացիա հետևյալ թեմայի համար՝ "${topicTitle}".
      
Սլայդները պետք է՝
- Ունենան տրամաբանական կառուցվածք (ներածություն, հիմնական նյութ, եզրակացություն)
- Լինեն հակիրճ և հստակ
- Ներառեն կարևոր կետեր ու օրինակներ
- Օգտագործեն HTML ֆորմատ ավելի լավ ձևավորման համար
- Ունենան լրացուցիչ նշումներ բարդ թեմաների համար`;
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

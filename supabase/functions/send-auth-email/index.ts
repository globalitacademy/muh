import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { AuthEmailTemplate } from './_templates/auth-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    console.log('Received webhook payload:', payload)
    
    let webhookData: any
    
    // If we have a hook secret, verify the webhook
    if (hookSecret) {
      const wh = new Webhook(hookSecret)
      webhookData = wh.verify(payload, headers)
    } else {
      // For development, parse directly
      webhookData = JSON.parse(payload)
    }

    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type, site_url }
    } = webhookData

    console.log('Processing email for user:', user.email, 'Action:', email_action_type)

    // Determine email subject and action text based on type
    let subject = 'Հաստատեք ձեր էլ.փոստը'
    let actionText = 'Հաստատել էլ.փոստը'
    let greeting = 'Բարև ձեզ'
    let message = 'Խնդրում ենք սեղմել ստորև գտնվող կապին՝ ձեր էլ.փոստի հասցեն հաստատելու համար:'

    if (email_action_type === 'recovery') {
      subject = 'Գաղտնաբառի վերականգնում'
      actionText = 'Վերականգնել գաղտնաբառը'
      message = 'Խնդրում ենք սեղմել ստորև գտնվող կապին՝ ձեր գաղտնաբառը վերականգնելու համար:'
    } else if (email_action_type === 'invite') {
      subject = 'Հրավեր'
      actionText = 'Ընդունել հրավերը'
      message = 'Ձեզ հրավիրել են մեր հարթակ: Խնդրում ենք սեղմել ստորև գտնվող կապին:'
    } else if (email_action_type === 'magic_link') {
      subject = 'Մուտք գործեք'
      actionText = 'Մուտք գործել'
      message = 'Խնդրում ենք սեղմել ստորև գտնվող կապին՝ մուտք գործելու համար:'
    }

    const confirmationUrl = `${site_url || Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to || site_url}`

    const html = await renderAsync(
      React.createElement(AuthEmailTemplate, {
        confirmationUrl,
        actionText,
        greeting,
        message,
        userEmail: user.email
      })
    )

    console.log('Sending email to:', user.email)

    const { error } = await resend.emails.send({
      from: 'GitEdu <onboarding@resend.dev>',
      to: [user.email],
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully to:', user.email)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in send-auth-email function:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          stack: error.stack
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
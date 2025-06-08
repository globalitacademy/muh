
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IdramPaymentRequest {
  amount: number;
  description: string;
  user_id: string;
  course_id?: string;
  currency?: string;
}

interface IdramPaymentResponse {
  payment_url: string;
  order_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { amount, description, user_id, course_id, currency = 'AMD' }: IdramPaymentRequest = await req.json()

    // Get Idram settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('payment_settings')
      .select('*')
      .eq('provider', 'idram')
      .single()

    if (settingsError || !settings) {
      throw new Error('Idram settings not configured')
    }

    if (!settings.is_active) {
      throw new Error('Idram payments are disabled')
    }

    const config = settings.configuration as any
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('financial_transactions')
      .insert({
        user_id,
        course_id,
        amount,
        currency,
        transaction_type: 'payment',
        payment_method: 'idram',
        payment_status: 'pending',
        idram_order_id: orderId,
        description,
        metadata: {
          merchant_id: config.merchant_id,
          test_mode: settings.test_mode
        }
      })
      .select()
      .single()

    if (transactionError) {
      throw new Error('Failed to create transaction record')
    }

    // Prepare Idram payment data
    const paymentData = {
      EDP_LANGUAGE: 'AM',
      EDP_REC_ACCOUNT: config.merchant_id,
      EDP_DESCRIPTION: description,
      EDP_AMOUNT: amount,
      EDP_BILL_NO: orderId,
      EDP_SUCCESS_URL: config.success_url,
      EDP_FAIL_URL: config.fail_url,
      EDP_SUBMIT: 'Վճարել',
    }

    // For test mode, use Idram test URL, for production use live URL
    const idramUrl = settings.test_mode 
      ? 'https://servicestest.idram.am/payment.aspx'
      : 'https://services.idram.am/payment.aspx'

    // Create form data for redirect
    const formParams = new URLSearchParams(paymentData as any).toString()
    const paymentUrl = `${idramUrl}?${formParams}`

    const response: IdramPaymentResponse = {
      payment_url: paymentUrl,
      order_id: orderId
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Idram payment error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

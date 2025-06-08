
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const formData = await req.formData()
    const orderId = formData.get('EDP_BILL_NO')
    const transactionId = formData.get('EDP_TRANS_ID')
    const amount = formData.get('EDP_AMOUNT')
    const checksum = formData.get('EDP_CHECKSUM')

    if (!orderId || !transactionId) {
      throw new Error('Missing required parameters')
    }

    // Find the transaction
    const { data: transaction, error: findError } = await supabaseClient
      .from('financial_transactions')
      .select('*')
      .eq('idram_order_id', orderId)
      .single()

    if (findError || !transaction) {
      throw new Error('Transaction not found')
    }

    // Update transaction with Idram response
    const { error: updateError } = await supabaseClient
      .from('financial_transactions')
      .update({
        payment_status: 'completed',
        idram_transaction_id: transactionId as string,
        updated_at: new Date().toISOString(),
        metadata: {
          ...transaction.metadata,
          idram_checksum: checksum,
          completed_at: new Date().toISOString()
        }
      })
      .eq('id', transaction.id)

    if (updateError) {
      throw new Error('Failed to update transaction')
    }

    // Create enrollment if this was a course payment
    if (transaction.course_id) {
      const { error: enrollmentError } = await supabaseClient
        .from('enrollments')
        .upsert({
          user_id: transaction.user_id,
          module_id: transaction.course_id,
          enrolled_at: new Date().toISOString(),
          progress_percentage: 0
        })

      if (enrollmentError) {
        console.error('Failed to create enrollment:', enrollmentError)
      }
    }

    return new Response('OK', { 
      headers: corsHeaders,
      status: 200 
    })

  } catch (error) {
    console.error('Idram callback error:', error)
    return new Response(
      `Error: ${error.message}`,
      { 
        status: 400,
        headers: corsHeaders
      }
    )
  }
})

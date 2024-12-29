import { serve } from '@supabase/functions-js'
import { createClient } from '@supabase/supabase-js'

interface BrightDataWebhookData {
  url: string
  title: string
  description: string
  price: string
  sales: number
  rating: number
  shop: string
  keywords: Array<{
    term: string
    searchVolume: number
    trend: string
  }>
  error?: string
  custom_data?: {
    analysisId: string
  }
}

serve(async (req) => {
  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse webhook data
    const body = await req.json()
    if (!Array.isArray(body) || body.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid webhook data format' }),
        { status: 400 }
      )
    }

    const productData = body[0] as BrightDataWebhookData
    const analysisId = productData.custom_data?.analysisId

    // If there's an error in the scraping
    if (productData.error) {
      throw new Error(productData.error)
    }

    // Validate analysis ID
    if (!analysisId) {
      throw new Error('Analysis ID not provided in custom_data')
    }

    // Find the analysis record by ID
    const { data: analysis, error: findError } = await supabaseClient
      .from('ProductAnalysis')
      .select('*')
      .eq('id', analysisId)
      .single()

    if (findError || !analysis) {
      throw new Error(`No analysis found with ID: ${analysisId}`)
    }

    // Update the analysis with scraped data
    const { error: updateError } = await supabaseClient
      .from('ProductAnalysis')
      .update({
        title: productData.title,
        description: productData.description,
        price: parseFloat(productData.price || '0'),
        status: 'completed',
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        keywords: productData.keywords || [],
        competitors: [], // Will be populated when competitor data is available
        recommendations: [] // Will be populated when we have enough data for recommendations
      })
      .eq('id', analysisId)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed successfully' }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Webhook processing failed:', error)

    // Try to update analysis status to failed if we have an error
    if (error instanceof Error) {
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const analysisId = (error as any).analysisId
        if (analysisId) {
          await supabaseClient
            .from('ProductAnalysis')
            .update({
              status: 'failed',
              error: error.message,
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
            .eq('id', analysisId)
        }
      } catch (updateError) {
        console.error('Failed to update analysis status:', updateError)
      }
    }

    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to process webhook'
      }),
      { status: 500 }
    )
  }
}) 
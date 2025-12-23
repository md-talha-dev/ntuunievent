import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const adminEmail = 'talha@admin.ntu.pk'
    const adminPassword = 'hj38&%hj32JUY'

    // Check if admin user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingAdmin = existingUsers?.users?.find(u => u.email === adminEmail)

    if (existingAdmin) {
      // Ensure admin role exists
      const { data: existingRole } = await supabaseAdmin
        .from('user_roles')
        .select('*')
        .eq('user_id', existingAdmin.id)
        .eq('role', 'admin')
        .single()

      if (!existingRole) {
        await supabaseAdmin
          .from('user_roles')
          .insert({ user_id: existingAdmin.id, role: 'admin' })
      }

      return new Response(
        JSON.stringify({ message: 'Admin user already exists', userId: existingAdmin.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create admin user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { name: 'Admin Talha' }
    })

    if (createError) {
      throw createError
    }

    // The handle_new_user trigger will create profile with 'student' role
    // We need to update it to 'admin'
    if (newUser?.user) {
      // Update the role to admin
      await supabaseAdmin
        .from('user_roles')
        .update({ role: 'admin' })
        .eq('user_id', newUser.user.id)
    }

    return new Response(
      JSON.stringify({ message: 'Admin user created successfully', userId: newUser?.user?.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

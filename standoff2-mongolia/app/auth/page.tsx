async function signUp() {
  const result = await supabase.auth.signUp({
    email,
    password
  })

  alert(JSON.stringify(result, null, 2))

  if (result.error) {
    setMsg(result.error.message)
    return
  }

  setMsg('Account created')
}

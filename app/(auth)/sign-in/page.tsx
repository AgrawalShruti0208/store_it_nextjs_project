import AuthForm from '@/components/AuthForm'
import React from 'react'

const SignIn = () => {
  return (
    // Making the FORM Component Re-usable for both pages passing prop 'type' sign-in or sign-up
    <AuthForm type="sign-in"/>
  
  )
}

export default SignIn
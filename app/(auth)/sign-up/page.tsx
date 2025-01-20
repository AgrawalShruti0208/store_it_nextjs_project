import React from 'react'
import AuthForm from '@/components/AuthForm'

const SignUp = () => {
  return (
    // Making the FORM Component Re-usable for both pages passing prop 'type' sign-in or sign-up
    <AuthForm type="sign-up"/>
  )
}

export default SignUp
import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import React from 'react'

const layout = async({children}:{children : React.ReactNode}) =>{

  // get the information of current logged-in user via a server action
    const currentUser = await getCurrentUser();

  // IF server action returned null, that means no User is logged in or there is no session
    // Therefore redirect the user to SIGN-IN PAGE
    if(!currentUser){
      redirect('/sign-in')
    }
    

  return (
    <main className='flex h-screen'>
        <Sidebar {...currentUser} /> 
        <section className='flex flex-col flex-1 h-full'>
            <MobileNavigation {...currentUser} />
            <Header />
            <div className='main-content'>{children}</div>
        </section>
    </main>
  )
}

export default layout
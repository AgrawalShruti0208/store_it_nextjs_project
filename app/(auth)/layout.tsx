import React from 'react'
import Image from 'next/image'

// COMMON LAYOUT DESIGNS FOR BOTH SIGN-IN and SIGN-UP Pages

const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <div className='flex min-h-screen'>
        {/* Div having flex property to divide page in layout and (sign-up/ sign-in page) */}
       
        <section className='
            hidden
            lg:flex
            w-1/2
            items-center
            justify-center
            bg-brand
            p-10
            xl:w-2/5
        '>
            {/* Layout Side design HIDDEN on small 
                Visible in half space on 1024px screens
                and more larger screen takes 2/5th of screen
            */}
            
            <div className='flex flex-col max-h-[800px] max-w-[430px] justify-center space-y-12'>
                
                <Image
                    src="/icons/logo-full.svg" 
                    alt= 'logo'
                    width={224}
                    height={82}
                    className='h-auto'
                />

                <div className='space-y-5 text-white'>
                    
                    <h1 className='h1'>Manage your files the best way</h1>
                    <p className='body-1'>
                        This is a place where you can store all your documents.
                    </p>

                </div>
                
                <Image
                    src='/images/files.png'
                    alt='Files Illustration'
                    width={342}
                    height={342}
                    className='transition-all hover:rotate-2 hover:scale-105' 
                />

            </div>

        </section>

        {/* Sign-in / Sign-up page container */}
        <section className='flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0'>
            
            {/* Display LOGO on small devices as Layout-Design will be Hidden for them */}
            <div className='mb-16 lg:hidden'>
                <Image
                    src='/icons/logo-full-brand.svg'
                    alt='logo'
                    width={224}
                    height={82}
                    priority
                    className='h-auto w-[200px] lg:w-[250px]' 
                />
            </div>

            {/* children to include Layout to all the children routes inside this ROUTE GROUP i.e. SIGN-IN and SIGN-UP pages */}
            {children}
        
        </section>
        

    </div>
  )
}

export default layout
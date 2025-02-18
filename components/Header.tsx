import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import Search from './Search'
import FileUploader from './FileUploader'
import { signOutUser } from '@/lib/actions/user.actions'

const Header = () => {
  return (
    <header className='header'>

        {/* Gloabal Search Functionality */}
            <Search/> 

        <div className='header-wrapper'>
            
            {/* FileUploader will be the component we will create which will have button to upload files */}
            <FileUploader /> 

            <form action={async()=>{
                'use server' //directive to indicate that code below will run on server
                await signOutUser();
            }}>
                <Button type="submit" className='sign-out-button'>
                    <Image 
                        src='/icons/logout.svg'
                        alt='logo'
                        width={24}
                        height={24}
                        className='w-6'
                    />
                </Button>
            </form>
        </div>
    </header>
  )
}

export default Header
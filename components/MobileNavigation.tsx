'use client' //as this component uses React Hooks

import React, {useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// importing 'sheet' components 
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Separator } from './ui/separator'
import { Button } from './ui/button'

import { navItems } from '@/constants'
import { cn } from '@/lib/utils'
import FileUploader from './FileUploader'
import { signOutUser } from '@/lib/actions/user.actions'

// defining data types for Props passed
  interface Props{
    ownerId : string,
    accountId : string,
    fullName : string,
    avatar: string,
    email: string
  }

const MobileNavigation = ({ownerId, accountId, fullName, avatar, email}:Props) => {

  // State variable to open or close navigation 
  const [open, setOpen] = useState(false);

  // State variable to set Loading state for Logout button
  const [isLoading, setLoading] = useState(false);

  // Hook to get the current Page URL
  const pathname = usePathname();

  const handleSignOut = async()=>{

    setLoading(true);

    await signOutUser();

    setLoading(false);

  }

  return (
    <header className='mobile-header'>
      
      <Image
        src='/icons/logo-full-brand.svg'
        alt='logo'
        width={110}
        height={52}
        className='h-auto'
      />

       {/* Implementing Mobile Navigation to be displayed on button click through shadcn/ui 'sheet' component */}
        <Sheet open={open} onOpenChange={setOpen}>

          <SheetTrigger>
            <Image 
              src="/icons/menu.svg" 
              alt='View Menu'
              width={30} 
              height={30}
            />
          </SheetTrigger>

          <SheetContent className='shad-sheet h-screen px-1'>
            
            {/* USER PROFILE */}
              <SheetTitle>
                <div className='header-user'>

                  <Image src={avatar} alt='avatar' width={44} height={44} className='header-user-avatar'/>
                  <div>
                    <p className='subtitle-2 capitalize'>{fullName}</p>
                    <p className='caption !text-[0.63rem]'>{email}</p>
                  </div>

                </div>
              </SheetTitle>

            <Separator className='mb-4'/>

            {/* NAVBAR */}
              <nav className='mobile-nav'>
                <ul className='mobile-nav-list'>

                  {navItems.map(({name,icon,url})=>(

                    <Link href={url} key={name} className='lg:w-full'>
    
                      <li 
                        // give "mobile-nav-item" classname to all the list items,
                        // but when pathname i.e. current page url matches with item's url then apply "shad-active" class
                        className={cn(
                          "mobile-nav-item",
                          pathname===url && "shad-active"

                        )}
                      >
                        <Image 
                          src={icon} 
                          alt={name} 
                          width={24} 
                          height={24} 
                          // give "nav-icon" classname to all the list items,
                          // but when pathname i.e. current page url matches with item's url then apply "nav-icon-active" class
                          className={cn(
                            'nav-icon',
                            pathname===url && 'nav-icon-active'
                          )}
                        />

                        {/* Name hidden on smaller devices and visible for large devices */}
                          <p>{name}</p>

                      </li>

                    </Link>

                  ))}

                </ul>
              </nav>
            
            <Separator className='my-5'/>

            <div className='flex flex-col justify-between gap-5'>

              <FileUploader />

              <Button type="submit" className='mobile-sign-out-button' onClick={handleSignOut}>
                  
                  {isLoading==false && <>
                    <Image 
                        src='/icons/logout.svg'
                        alt='logo'
                        width={24}
                        height={24}
                    />
                    <p>Logout</p>
                  </>}
                  
                  {isLoading && (<>
                    <p>Logging Out</p>                     
                    <Image 
                      src='/icons/loader.svg' 
                      alt="loader" 
                      width={24} 
                      height={24} 
                      className='animate-spin ml-2' 
                    />
                                            
                  </> )}
              </Button>

            </div>

            
          </SheetContent>
        </Sheet>



    </header>


  )
}

export default MobileNavigation
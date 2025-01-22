'use client' // use client as This component uses react hooks and user interacts with this component

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { navItems } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

// Tooltip shadcn/ui component
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// defining data types for Props passed
    interface Props{
      fullName : string,
      avatar: string,
      email: string
    }

const Sidebar = ({fullName, avatar, email}:Props) => {

  // A Client Component hook that lets you read the current URL's pathname.
  const pathname = usePathname();

  return (
    <aside className='sidebar'>
      {/* <aside> is Semantic HTML for HTML for the sides */}

      <Link href='/'>

        {/* Icon for larger screen size */}
          <Image
            src='/icons/logo-full-brand.svg'
            alt='logo'
            width={140}
            height={40}
            className='hidden h-auto lg:block'
          />

        {/* Icon for smaller screen sizes */}
          <Image
            src='/icons/logo-brand.svg'
            alt='logo'
            width={52}
            height={52}
            className='lg:hidden'
          />

      </Link>

      {/* Sidebar navigation bar for devices having screen size> mobiles */}
      <nav className='sidebar-nav'>
        <ul className='flex flex-1 flex-col gap-4'>

          {navItems.map(({name,icon,url})=>(

            <Link href={url} key={name} className='lg:w-full'>
              
              <li 
                // give "sidebar-nav-item" classname to all the list items,
                // but when pathname i.e. current page url matches with item's url then apply "shad-active" class
                className={cn(
                  "sidebar-nav-item",
                  pathname===url && "shad-active"

                )}
              >
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>

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
          
                    </TooltipTrigger>
                    <TooltipContent side='right' className='bg-brand text-sm ml-3 lg:hidden'>
                      <p>{name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                

                {/* Name hidden on smaller devices and visible for large devices */}
                <p className='hidden lg:block'>{name}</p>

              </li>

            </Link>
          ))}

        </ul>
      </nav>
        
      {/* Illustration */}
        <Image src='/images/files-2.png' alt="logo" width={490} height={300} className='hidden lg:block w-full' />
      
      {/* User Profile */}
          <div className="sidebar-user-info">
            
            {/* Profile Icon */}
            <Image 
              src={avatar} 
              alt='avatar' 
              width={44} 
              height={44} 
              className = 'sidebar-user-avatar'
            />

            {/* User Description */}
            <div className='hidden lg:block'>
              <p className='subtitle-2 capitalize'>{fullName}</p>
              <p className='caption'>{email}</p>
            </div>


          </div>

    </aside>
  )
}

export default Sidebar
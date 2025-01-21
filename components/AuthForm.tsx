"use client" //CLIENT COMPONENT AS IT INVOLVES USER INTERACTIVITY

import React, { useState } from 'react'
import { z } from "zod" //zod for input validation
import { zodResolver } from "@hookform/resolvers/zod"
import Image from 'next/image'
import Link from 'next/link'

//Use of the useForm hook from react-hook-form to create a form.
    import { useForm } from "react-hook-form"

// importing shadcn/ui components for FORM
    import { Button } from "@/components/ui/button"

    import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    } from "@/components/ui/form"

    import { Input } from "@/components/ui/input"
import { createAccount } from '@/lib/actions/user.actions'
import OTPModal from './OTPModal'

    
    
    //formSchema to include all the fields and their validation rules and return error if found invalid input
    const authFormSchema = (formType: 'sign-in'| 'sign-up') =>{
        return(
            z.object({
                
                email: z.string().email(),
                
                fullName: formType ==='sign-up' 
                            ? z.string().min(10, {message: "Full Name must be at least 10 characters."})
                            : z.string().optional()
                        
            })
        );
    }


const AuthForm = ({type}:{type: 'sign-in'|'sign-up'}) => {

    //state variable to have 'Loading' state when form is being submitted..
        const [isLoading, setIsLoading] = useState(false); 
    
    //state variable to contain error message to be displayed at the end of the form
        const [errorMessage, setErrorMessage] = useState(""); 
    
    // state variable to store accountId returned by createAccount() function from server actions file
        const [accountId, setAccountId] = useState(null);

        // get the form schema based on the type 'sign-in' | 'sign-up'
        const formSchema = authFormSchema(type);

     // 1. Function to define the form with input validation through formShema via zod
        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            // default values of the fields
            defaultValues: {
            fullName: "",
            email: ""
            },
        })
 
    // 2. Function to be triggered when form is submitted
        const onSubmit = async (values: z.infer<typeof formSchema>)=>{

            // 1. Set Loading true, as we are performing some operation on the entered values
                setIsLoading(true);
                setErrorMessage("");
           
            try {
            
                // 2. creating user in the database by providing values to it
                    const user = await createAccount({
                        fullName: values.fullName || "",
                        email: values.email 
                    });
            
                // 3. Set the value of accountId
                    setAccountId(user.accountId);

            }catch {

                setErrorMessage("Failed to create account! Please try again.");

            }finally {

                setIsLoading(false);
            }


            


           
        }

  return (
    <>
        {/* Using shadcn/ui FORM to create FORM and validate inputs through ZOD as it is simpler */}
        {/* Read shadcn/ui/form Documentation and follow the steps: https://ui.shadcn.com/docs/components/form */}

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">

                {/* Now in the form, we had to implement functionality according to the prop 'type' passed to this form */}
                <h1 className='form-title'>
                    
                    {type === 'sign-in' ? "Sign In" : "Sign Up"}
                
                </h1>
                
                {/* USERNAME FIELD IS ONLY FOR SIGN-UP PAGE */}
                    {type === 'sign-up' && 
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>

                                    <div className='shad-form-item'>

                                        <FormLabel className='shad-form-label'>Full Name</FormLabel>

                                        <FormControl>
                                            <Input 
                                                placeholder="Enter your Full Name" 
                                                className='shad-input' 
                                                {...field} 
                                            />
                                        </FormControl>
                
                                    </div>

                                    <FormMessage className='shad-form-message' />

                                </FormItem>
                            )}
                        
                        />
                    }
                
                {/* USER EMAIL Field for Both the Pages */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>

                                <div className='shad-form-item'>
                                    <FormLabel className='shad-form-label'>Email</FormLabel>

                                    <FormControl>
                                        <Input 
                                            placeholder="Enter your Email" 
                                            className='shad-input' 
                                            {...field} 
                                        />
                                    </FormControl>
                
                                </div>

                                <FormMessage className='shad-form-message' />

                            </FormItem>
                        )}
                        
                    />
                <Button type="submit" className='form-submit-button' disabled={isLoading}>
                    {type=== 'sign-in' ? "Sign In" : "Sign Up"}

                    {/* If form submission is taking time.. we have to display Loading state */}
                    {isLoading && (

                        <Image 
                            src='/icons/loader.svg' 
                            alt="loader" 
                            width={24} 
                            height={24} 
                            className='animate-spin ml-2' 
                        />

                    )}
                </Button>

                {/* Display Error Message If any.. */}
                {errorMessage && <p className='error-message'>*{errorMessage}</p>}

                <div className='body-2 flex justify-center'>

                    <p className='text-light-100'>
                        {type==='sign-in'
                            ? "Don't have an account?"
                            : "Already have an account?"
                        }
                    </p>
                    
                    <Link href={type==='sign-in' ? '/sign-up':'/sign-in'} className='ml-1 font-medium text-brand'>
                        {type=== 'sign-in' ? "Sign Up" : "Sign In"}
                    </Link>

                </div>
            
            </form>
        </Form>
        
        {/*When we have an accountId means email has been sent to the user with OTP, 
           then we have to display a Modal component to verify OTP*/}
           {accountId && <OTPModal email={form.getValues('email')} accountId = {accountId} />}
    
    </>
  )
}

export default AuthForm
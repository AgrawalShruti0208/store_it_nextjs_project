'use client' //as this component is using state variables and Hook and onClick functionalities

import React, {useState} from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

// import from shadcn/ui/alert-dialog 
    import {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle
    } from "@/components/ui/alert-dialog"

//import from shadcn/ui/input-otp
    import {
        InputOTP,
        InputOTPGroup,
        InputOTPSeparator,
        InputOTPSlot,
    } from "@/components/ui/input-otp"
import { sendEmailOTP, verifySecret } from '@/lib/actions/user.actions'
  
const OTPModal = ({accountId, email}:{accountId : string; email: string}) => {

    // state variable to manually track the modal is OPEN or CLOSED
        const [isOpen, setIsOpen] = useState(true);

    // state variable to store the OTP Value entered by User
        const [password, setPassword] = useState('');

    // state variable to display Loading...
        const [isLoading, setIsLoading] = useState(false);

    // router Hook
        const router = useRouter();

    // function to be trigerred on submission of OTP to verify it 
        const handleSubmit = async(event: React.MouseEvent<HTMLButtonElement>)=>{

            //need event in params to prevent otp from erasing on clicking of submit button
                event.preventDefault();
            
            //setting Loading state true as we are processing the OTP VERIFICATION
                setIsLoading(true);

            // try-> verify OTP, any error occured catch->error
            try{
                // Call API to verify OTP
                const sessionId = await verifySecret({accountId,password});

                // If function returned sessionId then redirect the user to the HOME Page
                    if(sessionId){
                        router.push('/');
                    }

            }catch(error){
                console.log("Failed to verify OTP",error);
            }
            

            // After this set Loading state false whether verification succedded or not
                setIsLoading(false);
        
        
        
        };
    
    // function to be trigerred when someone clicks on resend OTP
        const handleResendOtp = async()=>{
            // CALL API TO RESEND OTP
            await sendEmailOTP({email});
        };

  return (
    
    // CREATING OTP MODAL for Verification using SHADCN/UI ALERT-DIALOG component
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>

            <AlertDialogContent className='shad-alert-dialog'>

                <AlertDialogHeader className='relative flex justify-center'>
                    
                    <AlertDialogTitle className='h2 text-center'>
                        Enter Your OTP
                        <Image 
                            src="/icons/close-dark.svg" 
                            alt= "close" 
                            width={20} 
                            height={20}
                            onClick={()=>setIsOpen(false)}
                            className='otp-close-button size-8 drop-shadow-md rounded-full mr-1 mt-1'
                        />

                    </AlertDialogTitle>

                    <AlertDialogDescription className='subtitle-2 text-center text-light-100'>
                        We have sent a code to <span className='pl-1 text-brand'>{email}</span>
                    </AlertDialogDescription>
                
                </AlertDialogHeader>

                {/* Input-OTP component from shadcn inside shadcn's alert-dialog component */}
                    <InputOTP maxLength={6} value={password} onChange={setPassword}>
                        <InputOTPGroup className='shad-otp'>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>

                <AlertDialogFooter className='flex-col w-full gap-4'>
                    
                    <AlertDialogAction 
                        type="button"
                        onClick={handleSubmit} 
                        className='shad-submit-btn h-12'
                    >
                        Submit
                        {isLoading && (
                        
                            <Image 
                                src='/icons/loader.svg' 
                                alt="loader" 
                                width={24} 
                                height={24} 
                                className='animate-spin ml-2' 
                            />
                        
                        )}
                    </AlertDialogAction>

                    <div className='subtitle-2 mt-2 text-center text-light-100'>
                        Didn&apos;t get a code?
                        <Button 
                            type="button" 
                            variant="link" 
                            className="pl-1 text-brand"
                            onClick={handleResendOtp}
                        >
                            Click to resend OTP

                        </Button>
                    </div>
                    
                    
                </AlertDialogFooter>

            </AlertDialogContent>

        </AlertDialog>

  )
}

export default OTPModal
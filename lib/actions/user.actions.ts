'use server'
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholderURL } from "@/constants";
import { redirect } from "next/navigation";


 //use server directive to make sure this file runs on server only

// SERVER ACTION FILE TO CREATE USER IN THE APPWRITE DATABASE
    
    /**CREATE USER ACCOUNT FLOW:
        * 1. Make sure User has entered values for User Name and Email
        * 2. Check if the user already exist using the email (which we will use to identify if we still need to create a new user document or not)
        * 3. Send OTP to user's email
        * 4. This will send secret Key for creating a session.
        * 5. Create a new user document if the user is a new user
        * 6. Return the user's accountId that will be used to complete the login process
        * 7. Verify OTP and authenticate to login
     */

        // Helper function to get the existing user using email IF EXISTS
            const getUserByEmail = async (email: string) =>{

                // getting databases from the admin client
                    const {databases} = await createAdminClient();
                
                // get documents from the database
                    /*
                        *listDocuments(): Get a list of all the user's documents in a given collection. 
                        * You can use the query params to filter your results.
                        * databaseId
                        * collectionId
                        * queries
                        * throws — {AppwriteException} 
                        * FETCHING User Document from Database->User collection whose attribute 'email' equals the provided email
                    */
                    const result = await databases.listDocuments(
                        appwriteConfig.databaseId,
                        appwriteConfig.usersCollectionId,
                        [Query.equal("email",[email])],
                    )

                    //if result has document i.e. user with this email exists then send the document from array else return null
                        return result.total > 0 ? result.documents[0] : null;

            }
        // Helper function to handle Errors occured while server actions are performed
            const handleError = (error:unknown, message:string)=>{

                console.log(error, message);

                throw error;
            }

        // Helper function to send OTP to the email entered by User
            export const sendEmailOTP = async({email}:{email:string})=>{
                
                // get account information from ADMIN Client
                    const {account} = await createAdminClient();
                
                try{
                    // createEmailToken() sends user an email with OTP, and returns a userId 
                    const session = await account.createEmailToken(ID.unique(),email);

                    return session.userId;

                }catch(error){

                    handleError(error,"Failed to send OTP to the email provided!");

                }
            }
        
        // Server action to create Account in the database
            export const createAccount = async({fullName, email}:{
                    
                    fullName:string; 
                    email: string;
                
                }) =>{

                    // checking if user exists or not using helper function
                        const existingUser = await getUserByEmail(email);

                        if(existingUser!=null){
                            return parseStringify({accountId:null, error:"User account already exists! Please Sign-In."});
                        }
                    
                    
                    // invoke another helper function to send OTP to the email provided and get accountId 
                        const accountId = await sendEmailOTP({email});

                    // if no account ID returned then throw error
                        if(!accountId) throw new Error('Failed to send an OTP');

                    // if no exisiting user found, we have to create a new user document
                    if(!existingUser){

                        const {databases} = await createAdminClient();

                        await databases.createDocument(
                            // we have to mention the database ID, Collection ID in which we want to add the document and then the document ID with the data- fullName,email, avatar and accountId returned by appwrite
                            appwriteConfig.databaseId,
                            appwriteConfig.usersCollectionId,
                            ID.unique(),
                            {
                                fullName,
                                email,
                                avatar: avatarPlaceholderURL,
                                accountId,
                            },
                        );
                    }

                    // return the accountId but in server actions payload is provided by first converting it to string and then parsing it
                        //which we will do via another helper function created in lib/utils file
                        return parseStringify({accountId:accountId, error:null});

            };

        // Server action to verify the OTP sent to the email 
            export const verifySecret = async({accountId, password}:{ accountId:string; password:string;})=>{

                try {

                    // to get access to accounts through ADMIN Client 
                        const {account} = await createAdminClient();

                    // create session from Id and password
                        const session = await account.createSession(accountId, password);

                    // if session is created, set the session inside cookies of the browser
                        (await cookies()).set('appwrite-session', session.secret, {
                            // some rules to be followed when setting something in the cookies 
                            path: "/",
                            httpOnly: true,
                            sameSite: "strict",
                            secure: true,
                        });
                    
                    // return the ID of the session
                        return parseStringify({sessionId: session.$id});
                    
                } catch (error) {

                    handleError(error,"Failed to verify OTP");
                
                }

            }

        // Server action to fetch details of current logged-in user
            export const getCurrentUser = async() =>{

                try {
                    // SESSION Client as we need current user's info
                    // accessing databases and account from it
                        const {databases, account} = await createSessionClient();

                    // Get account: Get the currently logged in user's account information.
                        const result = await account.get();

                    // through this account ID we have to fetch the user information
                        const user = await databases.listDocuments(
                            appwriteConfig.databaseId,
                            appwriteConfig.usersCollectionId,
                            [Query.equal("accountId", result.$id)]
                        )

                    // If no document found, return null
                        if(user.total <= 0) return null;
                        
                    // else
                        return parseStringify(user.documents[0]);
                    
                } catch (error) {
                    console.log(error);
                }
            }

        //  Server action to LOGOUT the user
            export const signOutUser = async()=>{

                // get the account information from session client
                    const {account} = await createSessionClient()

                // delete session
                try {

                    // Delete current session of the user
                        await account.deleteSession('current');
                    
                    // Remove appwrite-session from the browser cookies
                        (await cookies()).delete('appwrite-session');
                
                } catch (error) {
                    
                    handleError(error, 'Failed to Sign Out the User.');
                
                }finally{
                    // whatever happens redirect the user to sign-in page
                    redirect('/sign-in');
                
                }
            }

        // Server action to SIGN-IN THE USER only if user exists
            export const signInUser = async({ email }:{ email : string}) => {

                try {
                    const existingUser = await getUserByEmail(email);

                    if(!existingUser){
                        return parseStringify({ accountId: null, error: "User account not found! Please Sign-Up." });
                    }

                    // If user exists, send the OTP to user and return its accountId.
                    
                    await sendEmailOTP({email});
                    return parseStringify({accountId : existingUser.accountId, error: null });
                    
                
                    
                    
                } catch (error) {
                    handleError(error, "Failed to sign in user");
                }
            }

        


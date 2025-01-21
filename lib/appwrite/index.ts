'use server' //use server directive to make sure this file runs on server only

// In this file we will create the setup to integrate appwrite with project using node-appwrite package

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite"
import { appwriteConfig } from "./config"
import { cookies } from "next/headers";

// To use node-appwrite to perform any functionality, need a client so setting up a APPWRITE CLIENT
// For each request, we will be creating a separate client for keeping processes separate and increasing security
//Two types of client with different authorities : Session Client and ADMIN Client

    // SESSION Client is for logged in users which will allow them to handle their profile and files belonging to them 
        export const createSessionClient = async() =>{

            // 1. connecting appwrite and project to this project directory
            const client = new Client()
                .setEndpoint(appwriteConfig.endpointUrl)  //using all the envs exported through object from lib/appwrite/cofig.ts
                .setProject(appwriteConfig.projectId);

            //2. getting appwrite session from 'cookies'
                const session = (await cookies()).get('appwrite-session');

            //3. If there received no 'session' from cookies, therefore user is not logged in, so need to throw error
                if(!session || !session.value){
                    throw new Error("No Session");
                }
            
            //4. set the received user session from cookies to the appwrite session client
                client.setSession(session.value);

            // 5. returning user Account and database from the appwrite-client
            return{

                get account(){
                    return new Account(client);
                },

                get databases(){
                    return new Databases(client);
                },
            };
            
        };

    // ADMIN Client is for us to maintain the whole application and perform actions that require maximum authority
        export const createAdminClient = async()=>{

            // 1. connecting appwrite and project to this project directory and providing secretKey to perform admin operations
            const client = new Client()
                .setEndpoint(appwriteConfig.endpointUrl)  //using all the envs exported through object from lib/appwrite/cofig.ts
                .setProject(appwriteConfig.projectId)
                .setKey(appwriteConfig.secretKey);


            // 2. returning user Account, Databases,Storage and Avatars via admin client from appwrite
            return{

                get account(){
                    return new Account(client);
                },

                get databases(){
                    return new Databases(client);
                },

                get storage(){
                    return new Storage(client);
                },

                get avatars(){
                    return new Avatars(client);
                }
            };
        };
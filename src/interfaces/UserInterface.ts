export interface UserInterface{
    name: string
    email: string
    companies: string[]
    type?: string
    customImage?: string // if user uploaded custom for profile image
    version: string // separation for old and new v2 users
}

export interface UserInfoInterface extends UserInterface{
    uid : string
}

export interface UserInterfaceObject{
    [uid: string] : UserInterface,
}

export interface FirestoreUserInterface {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    emailVerified?: boolean;
    [key: string]: any;
}

export interface FullUserInterface extends FirestoreUserInterface, UserInterface{}

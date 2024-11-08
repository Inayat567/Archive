
const knownErrors = {
    'auth/configuration-not-found': 'Configuration not found on auth server',
    'auth/wrong-password': 'Wrong password!'
};


export function authErrorsParser(response: any){

    const error = response.error || response;

    if(error){

        const foundErrMsg = Object.entries(knownErrors).find(([key, value])=>{
                return error.message && error.message.includes(key);
            })

        if(foundErrMsg){
            return foundErrMsg[1];
        }else{
            return error.message;
        }
    }

    console.error(error);
    return 'Unknown error';
}
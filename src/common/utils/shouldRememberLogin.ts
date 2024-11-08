
const REMEMBER_KEY = 'remember-me';

interface SavedRememberInterface{
    email: string;
    name: string;
}

export function shouldRememberLogin(): SavedRememberInterface|null{
    const json = window.localStorage.getItem(REMEMBER_KEY);
    if(json){
        const obj = JSON.parse(json);
        if(String(obj.remember).length > 0){
            return obj;
        }
    }
    return null;
}

// app "reload" triggers on F5 also, so maybe add timestamp and verify if that expired on next reload?
export function saveRememberMeValue(email: string, name: string = ''){
    const obj = {
        email,
        name,
    } as SavedRememberInterface;
    window.localStorage.setItem(REMEMBER_KEY, JSON.stringify(obj));
}

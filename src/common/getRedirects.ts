import { LOGIN_ROUTE, LOGIN_ROUTE_SMALL, REGISTER_ROUTE, RESET_ROUTE, RESET_ROUTE_SMALL } from "config/routes";

const USED_BEFORE_KEY = 'used-app-before-1';

function usedBefore(){
    let used = checkUsedBefore();
    return used;
}

export function checkUsedBefore(): boolean{
    try{
        const json = window.localStorage.getItem(USED_BEFORE_KEY);
        if(json){
            let check = JSON.parse(json);
            if(!!check){
                return true;
            }
        }
    }catch(err){
        return false;
    }
    return false;
}

export function resetUsedBefore(){
    window.localStorage.removeItem(USED_BEFORE_KEY);
}

export function saveUsedBefore(){
    window.localStorage.setItem(USED_BEFORE_KEY, JSON.stringify(1));
}

export function getLoginRoute(){
    if(usedBefore()){
        return LOGIN_ROUTE_SMALL;
    }
    return LOGIN_ROUTE;
}

export function getRegisterRoute(){
    return REGISTER_ROUTE;
} 

export function getResetRoute(){
    if(usedBefore()){
        return RESET_ROUTE_SMALL;
    }
    return RESET_ROUTE;
} 
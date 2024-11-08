
export function generateRandomPassword(pwdLen: number = 10){
    const pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const randPassword = new Array(pwdLen)
        .fill(0)
        .map(x => (
            function(chars) { 
                let umax = Math.pow(2, 32), 
                r = new Uint32Array(1), 
                max = umax - (umax % chars.length); 
                do { crypto.getRandomValues(r); } 
                    while(r[0] > max); 
                        return chars[r[0] % chars.length]; 
            })(pwdChars))
        .join('');
    
        return randPassword;
}
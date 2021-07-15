export default function(isError: boolean, response: any, callback?: (err: Error | null, response: any) => void) {
    if(typeof callback == "function") { 
        if(isError) {
            callback(response, null);
        } else {
            callback(null, response);
        }
    }    
};
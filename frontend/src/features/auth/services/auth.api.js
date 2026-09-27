
import axios from 'axios';

export const login = async ({email, password}) => {
    try{
        const response= await axios.post("http://localhost:3000/api/auth/login",{email,password},{withCredentials:true});

        return response.data;

    }catch(err){
        console.log(err);
    }


}

export const register =async ({username,email,password}) => {
    try{

        const response= await axios.post("http://localhost:3000/api/auth/register",{username,email,password},{withCredentials:true});
        return response.data;
    }catch(err){
        console.log(err);
    }


}
export const logout = async () => {
    try{
    const response= await axios.get("http://localhost:3000/api/auth/logout",{withCredentials:true});

    }catch(err){
console.log(err);
    }

}
export const getMe = async () => {
    try{
        const response= await axios.get("http://localhost:3000/api/auth/getme",{withCredentials:true}); 
        return response.data;
    }catch(err){
        console.log(err);
    }   
}
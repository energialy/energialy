export default function getLocalStorage(){
    if(typeof window !== "undefined"){
        
    const userD = localStorage.getItem("user");
    const user = JSON.parse(userD);
    return user;
    }
}
   

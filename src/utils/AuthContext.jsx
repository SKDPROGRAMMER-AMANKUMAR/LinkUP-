import { createContext,useState,useEffect,useContext } from "react";
import { account } from "../appwrite/appwrite";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        // setLoading(false);
        getUserOnLoad();
    },[])

    const getUserOnLoad = async () => {
        try {
            const accountDetails = await account.get();
            console.log('accountDetails:', accountDetails);
            setUser(accountDetails);
        } catch (error) {
            console.error("Error fetching user details:", error.message);
            // Redirect user to login or show a message
        } finally {
            setLoading(false);
        }
    };
    

    const navigate = useNavigate()

    const handleUserLogin = async (e,credentials) => {
        e.preventDefault();

        try {
           const response = await account.createEmailPasswordSession(credentials.email,credentials.password)

           console.log('Session created:', response);

           const accountDetails = await account.get();

           setUser(accountDetails);

           navigate('/')

        } catch (error) {
           console.error(error);
        }
     }

     const handleUserLogout = async () => {
        try {
            await account.deleteSession('current')
        } catch (error) {
            console.error(error);
        }
        setUser(null);
     }

     const handleUserRegister = async(e,credentials) => {
         e.preventDefault()
        if(credentials.password !== credentials.confirmPassword) {
            alert('Passwords do not match')
            return;
        }

        try {
            let response = await account.create(
              ID.unique(),
              credentials.email,
              credentials.password,
              credentials.name,
            )

            // const accountDetails = await account.get();
            // console.log('accountDetails',accountDetails)
            // setUser(accountDetails);

            // console.log('Registered:',response);
            
        } catch (error) {
            console.error(error);
        }
     }

    const contextData = {
     user,
     handleUserLogin,
     handleUserLogout,
     handleUserRegister
    }

   return <AuthContext.Provider value={contextData}>
   {loading ? <p className="flex items-center justify-center h-screen text-xl font-semibold">
    <PulseLoader color="#00dcff" />
</p>
 : children}
   </AuthContext.Provider>

}

export const useAuth = () => {
    return useContext(AuthContext)
}

export default AuthContext;
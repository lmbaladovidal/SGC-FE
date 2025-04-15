import { useAuth } from "./context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

import { Login } from "../lib/beConection";

export default function LogUser() {
  const [user,setUser] = useState(null);
  const { setIsLoggedIn,isLoggedIn } = useAuth();
  const router = useRouter();

  console.log("Hola mundo",isLoggedIn)
  
  
  const handleLogin = async (userToLogin) => {
    console.log("Soy el usuario:", userToLogin);
    try {
    const user = await Login(userToLogin);  // <- se ejecuta acá
      setUser(user);
      console.log("Soy usuario:", user);
  
      setIsLoggedIn(true);
      router.replace("/");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  


  return (
    <View>
      <Text>Login</Text>
      <Button title="Iniciar sesión" onPress={()=>handleLogin({username:"egrubey5@paginegialle.it",password:"hZ0#P6v1"})} />
    </View>
  );
}
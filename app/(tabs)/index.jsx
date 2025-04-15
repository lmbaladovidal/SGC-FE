import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { View, Text } from "react-native";

export default function Index() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    console.log("Hola mundo desde index ",isLoggedIn)
    if (ready && !isLoggedIn) {
      router.replace("/login");
    }
  }, [ready, isLoggedIn]);

  if (!isLoggedIn) return null;

  return (
    <View style={{flex:1,alignContent:"center",alignItems:"center"}}>
      <Text >Estás logueado, bienvenido 👋</Text>
    </View>
  );
}
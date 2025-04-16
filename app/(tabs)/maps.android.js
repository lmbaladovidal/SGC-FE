import * as Location from 'expo-location';
import { useState, useEffect,useRef,useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Pressable, Text, View } from 'react-native';
import { Platform } from 'react-native';
import {UpdateTruckLocation} from "../../lib/beConection";


export default function LocationComponent() {
  
  const [location, setLocation] = useState(null);
  const [truck, setTruck] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapComponent, setMapComponent] = useState(null);
  let intervalRef = useRef(null);

  const loadReactNativeMap = async () => {
        if (Platform.OS !== 'android') {
          return <Text>Mapa no disponible en esta plataforma</Text>;
        }
        //const test = await require('react-native-maps');
        setMapComponent({ MapView });
  
      };


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso para acceder a la ubicación fue denegado');
        return;
      }
      loadReactNativeMap();
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      repetirCadaSegundo(); // se activa al entrar a la tab
      return () => {
        eliminarIntervalo(); // se limpia al salir de la tab
      };
    }, [])
  );

  const obtainLocation = async () => {
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High, // más precisión
    });
    console.log("Soy plataforma: ",Platform.OS)
    setLocation(location);
    console.log(location.coords.latitude, location.coords.longitude);
    handleLocation({
      id: "483BBD5B-3819-42A3-B2DB-8D6D5ECC3BA6",
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
  }

  function repetirCadaSegundo() {
    if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(obtainLocation, 10000)
  } 

  function eliminarIntervalo() {
    clearTimeout(intervalRef.current);
    console.log("Intervalo eliminado");
  } 

 const handleLocation = async (truckToUpdate) => {
    console.log("Soy el camion:", truckToUpdate);
    try {
    const response = await UpdateTruckLocation(truckToUpdate);  // <- se ejecuta acá
    console.log("Ubicacion actualizada");
      setTruck(truckToUpdate);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };


  return (
    <View>
      <Text>{errorMsg || (location ? `Latitud: ${location.coords.latitude}, Longitud: ${location.coords.longitude}` : 'Esperando ubicación...')}</Text>
      <Pressable  
        style={{ marginTop: 20, backgroundColor: 'blue', alignItems: 'center', padding: 10 }} 
        onPress={repetirCadaSegundo}
      >
        <Text>Iniciar Intervalo</Text>
      </Pressable>
      <Pressable  
        style={{ marginTop: 20, backgroundColor: 'green', alignItems: 'center', padding: 10 }} 
        onPress={() => handleLocation({
          id: "483BBD5B-3819-42A3-B2DB-8D6D5ECC3BA6",
          latitude: location?.coords?.latitude,
          longitude: location?.coords?.longitude
        })}
      >
        <Text>Asignar Ubicacion Camion</Text>
      </Pressable>
      <Text style={{ marginTop: 20 }}>Camion: {truck && truck.id}</Text>
      <Text>Latitud: {truck && truck.latitude}</Text>
      <Text>Longitud: {truck && truck.longitude}</Text>
    </View>
  );
}
import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { UpdateTruckLocation } from '../../lib/beConection';

export default function LocationComponent() {
  const [location, setLocation] = useState(null);
  const [truck, setTruck] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [LeafletComponents, setLeafletComponents] = useState(null);

  const intervalRef = useRef(null);

  useEffect(() => {
    setIsClient(true);

    const loadLeaflet = async () => {
      if (Platform.OS !== 'web') return;

      const L = await import('leaflet');
      const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');
      await import('leaflet/dist/leaflet.css');

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      setLeafletComponents({ L, MapContainer, TileLayer, Marker, Popup });
    };

    if (typeof window !== 'undefined') {
      loadLeaflet();

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obteniendo ubicación", error);
          setErrorMsg('No se pudo obtener la ubicación.');
        }
      );
    }
  }, []);

  const obtainLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        handleLocation({
          id: "483BBD5B-3819-42A3-B2DB-8D6D5ECC3BA6",
          ...coords,
        });
      },
      (error) => {
        console.error("Error al obtener ubicación", error);
      }
    );
  };

  const repetirCadaSegundo = () => {
    intervalRef.current = setInterval(obtainLocation, 10000);
  };

  const eliminarIntervalo = () => {
    clearInterval(intervalRef.current);
    console.log("Intervalo eliminado");
  };

  const handleLocation = async (truckToUpdate) => {
    try {
      await UpdateTruckLocation(truckToUpdate);
      setTruck(truckToUpdate);
    } catch (error) {
      console.error("Error actualizando ubicación:", error);
    }
  };

  if (!isClient || !LeafletComponents) return null;

  const { MapContainer, TileLayer, Marker, Popup } = LeafletComponents;

  return (
    <View style={styles.container}>
      {errorMsg && <Text>{errorMsg}</Text>}

      {location && (
        <>
          <View style={styles.mapWrapper}>
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={13}
              style={styles.map}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[location.latitude, location.longitude]}>
                <Popup>Estás aquí 📍</Popup>
              </Marker>
            </MapContainer>
          </View>

          <Text style={styles.coordsText}>
            Latitud: {location.latitude}, Longitud: {location.longitude}
          </Text>

          <Pressable style={styles.buttonBlue} onPress={repetirCadaSegundo}>
            <Text style={styles.buttonText}>Iniciar Intervalo</Text>
          </Pressable>

          <Pressable
            style={styles.buttonRed}
            onPress={() => handleLocation({
              id: "483BBD5B-3819-42A3-B2DB-8D6D5ECC3BA6",
              latitude: location.latitude,
              longitude: location.longitude
            })}
          >
            <Text style={styles.buttonText}>Asignar Ubicación Camión</Text>
          </Pressable>

          {truck && (
            <View style={{ marginTop: 20 }}>
              <Text>Camión: {truck.id}</Text>
              <Text>Latitud: {truck.latitude}</Text>
              <Text>Longitud: {truck.longitude}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  mapWrapper: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  coordsText: {
    marginBottom: 10,
  },
  buttonBlue: {
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    width: '80%',
  },
  buttonRed: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: 'white',
  },
});

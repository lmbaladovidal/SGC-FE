import { Tabs } from "expo-router";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Colors } from '@/constants/Colors';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home' }}
      />
      
      {/* Solo mostrar en móvil */}
      {Platform.OS !== 'web' && (
        <Tabs.Screen
          name="maps"
          options={{ title: 'Mapas' }}
        />
      )}
    </Tabs>
  );
}
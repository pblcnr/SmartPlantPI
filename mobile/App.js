import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('token').then(t => {
      if (t) setToken(t);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen name="Auth">
            {props => <AuthScreen {...props} onLogin={async (jwt) => {
              await AsyncStorage.setItem('token', jwt);
              setToken(jwt);
            }} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Dashboard" options={{ headerShown: false }}>
            {props => <DashboardScreen {...props} token={token} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
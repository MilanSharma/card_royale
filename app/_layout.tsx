import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from '@/context/UserContext';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <UserProvider>
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background }
      }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="game/blackjack" 
          options={{ 
            gestureEnabled: false,
            presentation: 'fullScreenModal',
            animation: 'fade'
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </UserProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

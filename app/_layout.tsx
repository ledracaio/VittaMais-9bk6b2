// Vitta+ Root Layout — app/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { UserProvider } from '@/contexts/UserContext';
import { AgendaProvider } from '@/contexts/AgendaContext';
import { HealthProvider } from '@/contexts/HealthContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <UserProvider>
          <AgendaProvider>
            <HealthProvider>
              <StatusBar style="light" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                  name="travel"
                  options={{
                    headerShown: true,
                    headerTitle: 'Viagens',
                    headerStyle: { backgroundColor: '#E07A5F' },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: { fontWeight: '700', fontSize: 18 },
                  }}
                />
                <Stack.Screen
                  name="education"
                  options={{
                    headerShown: true,
                    headerTitle: 'Educação',
                    headerStyle: { backgroundColor: '#C9922A' },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: { fontWeight: '700', fontSize: 18 },
                  }}
                />
                <Stack.Screen
                  name="health"
                  options={{
                    headerShown: true,
                    headerTitle: 'Saúde',
                    headerStyle: { backgroundColor: '#B05070' },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: { fontWeight: '700', fontSize: 18 },
                  }}
                />
                <Stack.Screen
                  name="finance"
                  options={{
                    headerShown: true,
                    headerTitle: 'Finanças',
                    headerStyle: { backgroundColor: '#4A8FA8' },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: { fontWeight: '700', fontSize: 18 },
                  }}
                />
              </Stack>
            </HealthProvider>
          </AgendaProvider>
        </UserProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}

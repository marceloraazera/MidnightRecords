import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

import HomeScreen from './MidnightRecords2/TELAS/TelaHome';
import TelaAdmin from './MidnightRecords2/TELAS/telaAdmin';
import TelaFavoritos from './TELAS/telaFavoritos';
import TelaLogin from './TELAS/telaLogin';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    initialRouteName="HomeScreen"
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'HomeScreen') {
              imageSource = require('./assets/images/logo.png');
            } else if (route.name === 'TelaAdmin') {
              iconName = 'plus';
            } else if (route.name === 'TelaFavoritos') {
              iconName = 'hearto';
            }

            return (
              <AntDesign
                name={iconName}
                size={size}
                color={color}
              />
            );
          },

          tabBarActiveTintColor: '#FCA311',
          tabBarInactiveTintColor: '#999',
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: 'Início' }}
        />

        <Tab.Screen
          name="TelaAdmin"
          component={TelaAdmin}
          options={{ title: 'Admin' }}
        />

        <Tab.Screen
          name="TelaFavoritos"
          component={TelaFavoritos}
          options={{ title: 'Favoritos' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    )
}

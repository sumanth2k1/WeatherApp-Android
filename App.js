import React from 'react'
import AppNavigation from './src/navigation/AppNavigation'
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './src/screens/HomeScreen';


const Stack = createNativeStackNavigator();


export default function App() {

  return (
    <NavigationContainer>
        <AppNavigation/>
    </NavigationContainer>
  )
}
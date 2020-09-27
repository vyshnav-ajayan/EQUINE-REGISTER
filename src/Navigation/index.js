import 'react-native-gesture-handler';
import * as React from 'react';
import {
  View,
} from 'react-native';
import {Provider} from 'react-redux';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from '../screens/Home';
import Track from '../screens/Tracking'
import store from '../Store';

const Stack = createStackNavigator();


export default function App() {
  return (
    <Provider store={store}>
      
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} 
            options={{headerShown:false}}/>
            <Stack.Screen name="Track" component={Track} 
            options={{headerShown:false}}/>
           
          </Stack.Navigator>
        </NavigationContainer>
      
    </Provider>
  );
}

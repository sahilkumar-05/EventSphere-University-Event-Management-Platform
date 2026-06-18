import React from 'react';

import { createBottomTabNavigator }
from '@react-navigation/bottom-tabs';



import DashboardScreen
from '../screens/DashboardScreen';

import EventsScreen
from '../screens/EventsScreen';

import ProfileScreen
from '../screens/ProfileScreen';

const Tab =
createBottomTabNavigator();

export default function TabNavigator() {

return (

<Tab.Navigator

screenOptions={({ route }) => ({

headerShown: false,

tabBarIcon: ({
 focused,
 color,
 size,
}) => {

 let iconName =
 'home';

 if (
  route.name ===
  'Home'
 ) {

  iconName =
  focused
  ? 'home'
  : 'home-outline';

 }

 else if (
  route.name ===
  'Events'
 ) {

  iconName =
  focused
  ? 'calendar'
  : 'calendar-outline';

 }

 else if (
  route.name ===
  'Profile'
 ) {

  iconName =
  focused
  ? 'person'
  : 'person-outline';

 }



},

tabBarActiveTintColor:
'#6C63FF',

tabBarInactiveTintColor:
'#9CA3AF',

tabBarStyle: {

 height:70,



 paddingTop:-10,

 borderTopWidth:0,

 elevation:20,

 backgroundColor:
 '#ffffff',

 shadowColor:'#6C63FF',

 shadowOffset:{
  width:0,
  height:-4,
 },

 shadowOpacity:0.08,

 shadowRadius:12,

},

tabBarLabelStyle: {

 fontSize:19,

 fontWeight:'900',

 letterSpacing:0.3,
 marginTop:-10,

},

})}

>

<Tab.Screen
 name="Home"
 component={DashboardScreen}
/>

<Tab.Screen
 name="Events"
 component={EventsScreen}
/>

<Tab.Screen
 name="Profile"
 component={ProfileScreen}
/>

</Tab.Navigator>

);
}
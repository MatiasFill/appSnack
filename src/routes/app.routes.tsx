import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Dashboard from '../pages/Dashboard';
import Order from '../pages/Order';
import FinishOrder from "../pages/FinishOrder"
// aqui esta criando uma tipagem para o "Stack"
export type StackPramsList = {// Não quero receber nenhum parametro, "undefined"
  Dashboard: undefined;
  Order: {
    number: number | string;
    order_id: string;
  };
  FinishOrder: {
    number: number | string;
    order_id: string
  };
};
//Apois o createNativeStackNavigator coloquei a tipagem "StackPramsList"
const Stack = createNativeStackNavigator<StackPramsList>();

function AppRoutes(){
  return(
      <Stack.Navigator>
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard}
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name='Order'
          component={Order}
          options={{ headerShown: false }}// "headerShown", isso tira o header da tela do sistema
        />

        <Stack.Screen 
          name='FinishOrder'
          component={FinishOrder}
          options={{
            title: 'Finalizando',
            headerStyle:{
              backgroundColor: 'rgba(119, 7, 7, 0.96)'
            },
            headerTintColor: '#FFF'
          }}
        />
      </Stack.Navigator>
  )
}

export default AppRoutes;

// Essa pagina só usuarios logado podem acessar
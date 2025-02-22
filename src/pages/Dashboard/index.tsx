import React, { useState} from 'react';
import { View, Text, Button, SafeAreaView, TouchableOpacity, TextInput, StyleSheet } from 'react-native'

import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackPramsList} from '../../routes/app.routes'

import { api } from '../../services/api';

export default function Dashboard(){
  const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>();

  const [number, setNumber] = useState(''); // salvando os pedidos da mesa dentro da useState

async function openOrder(){
  if(number === ''){
    return;
  }
  

  const response = await api.post('/order', {
    table: Number(number)// Concerteu uma string "Number" em um numero que é "number"
  })
  //precisa fazer a requisição e abrir a mesa e navegar para a proxima tela.
  //console.log(response.data);
 //aqui receber por parametro que vem do "export type StackPramsList" que esta em "app.routes.tsx".
  navigation.navigate('Order', {number: number, order_id: response.data.id})

  setNumber(''); // aqui esta limpando o campo deixando vazio para ser digitado outra vez
}


  return(
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Novo pedido</Text>

      <TextInput
        placeholder="Numero da mesa"
        placeholderTextColor="#F0F0F0"
        style={styles.input}
        keyboardType='numeric'
        value={number}
        onChangeText={setNumber}
      />

      <TouchableOpacity style={styles.button} onPress={openOrder}>
          <Text style={styles.buttonText}>Abrir Mesa</Text>
      </TouchableOpacity>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#1d1d2e'
  },
  title:{
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 24,
  },
  input:{
    width: '90%',
    height: 60,
    backgroundColor: '#101026',
    borderRadius: 4,
    paddingHorizontal: 8,
    textAlign: 'center',
    fontSize: 22,
    color: '#FFF'
  },
  button:{
    width: '90%',
    height: 40,
    backgroundColor: '#8B0000',
    borderRadius: 4,
    marginVertical: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText:{
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold'
  }
})
// Aqui nesse arquivo que criamos a função finalizar a order do pedido
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Feather} from '@expo/vector-icons'
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { api } from "../../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackPramsList } from "../../routes/app.routes";



type RouteDetailParams = {
    FinishOrder:{
        number: string | number;
        order_id: string;
    }
}


type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>


export  default function FinishOrder(){
    const route = useRoute<FinishOrderRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>()// apois finalizar a order de pedidos, usenNvigation volta para tela de novo pedido

    async function handleFinish(){
        try{
            await api.put('/order/send', {
                order_id: route.params?.order_id
            })


            navigation.popToTop();// popToTop é: volta lá para o inicio da sua primeira tela, que é novo pedido
        
        }catch(err){
            console.log("Erro ao finalizar, tente mais tarde")
        }
    }
    return(
        <View style={styles.container}>
            <Text style={styles.alert}> Você deseja finalizar este pedido?</Text>
            <Text style={styles.title}>
                Mesa: {route.params?.number}
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleFinish}>
                <Text style={styles.textButton}>Finalizar pedido</Text>
                <Feather name="shopping-cart" size={20} color="#1d1d2e" />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingHorizontal: '4%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    alert:{
        fontSize: 20,
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 12,
    },
    title:{
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 12,
    },
    button:{
        backgroundColor: '#00ffff',
        flexDirection: 'row',
        width: '65%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    textButton:{
        fontSize: 18,
        marginRight: 8,
        fontWeight: 'bold',
        color: '#1d1d2e',
    }
})
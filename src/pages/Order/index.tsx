import React, { useState, useEffect} from "react";
import { View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
 } from "react-native";
 import { ModalPicker} from '../../components/ModalPicker'

// tambem podemos pegar os parametros com " useRoute com sua propriedade " RouteProp"
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";

import { Feather} from '@expo/vector-icons'

import { api } from "../../services/api";


type RouteDetailParams = {// Criando uma tipagem do Router
    Order:{
        number: string | number;
        order_id: string;
    }
}

export type CategoryProps = {
    id: string;
    name: string;
}
type ProductsProps = {
    id: string;
    name: string;
}
type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>

export default function Order(){
    const route = useRoute<OrderRouteProps>();
    const navigation = useNavigation();
    // criando os estados com duas useState
    const [category, setCategory] = useState<CategoryProps[] | []>([]) // criando os estados, armazena as listagens de todas
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>()//essa aponta p/ a que esta selecionada atualmente. pego o item que me mandou e troca a categoria selecionada
    const [modalCategoryVisible, seModalCategoryVisible] = useState(false)//Controlar quando o modal vai esta aberto / fechado. Sempre começa "false"

    
    const [ products, setProducts]= useState<ProductsProps[] | []>([]);
    const [productSelected, setProductSelected] = useState<ProductsProps | undefined>()
    const [modalProductVisible, setmodalProductVisible] = useState(false);
// toda vez que digitar a quantidade de um produto vai ser salvo nessa useState chamado "amount"
    const [amount, setamount] = useState('1')// o estado que vai controlar a quntidade 
   // agora vamos buscar as categorias com useEffect criando uma função anõnima
    useEffect(()=> {
        async function loadInfo(){// fazendo a requisição buscando as categorias aqui dentro
            const response = await api.get('/category')
            //console.log(response.data); // aqui só pra ver o que esta rebendo, só p/ teste
            setCategory(response.data); // colocar dentro da listagem de category
            setCategorySelected(response.data[0])//colocar um item da lista que foi selecionado, que sempre é a 1ª.
        }

        loadInfo();
    }, [])

    

    useEffect(() => {// toda vez que selecionar uma categoria ele vai executar um useEffect
        //agora ele buscar a categoria que vc selecionou
        async function loadProducts(){
            const response = await api.get('/category/product', { //fazendo a requisiçao
                params:{
                    category_id:categorySelected?.id
                }
            })

            setProducts(response.data);
            setProductSelected(response.data[0])
        }
            
        loadProducts();
    }, [categorySelected])
    async function handleCloseOrder(){
        try{
//aqui esta fechando o pedido da mesa para ser feito
            await api.delete('/order', {
                params:{
                    order_id: route.params?.order_id
                }
            })


            navigation.goBack();// aqui apois fechar a mesa, volta para tela de novo pedido.

        }catch(err){
            console.log(err)
        }
    }
   

    function handleChangeCategory(item: CategoryProps){
        setCategorySelected(item);
    }

    function  handleChangeProduct(item: CategoryProps){
        setProductSelected(item);
    }

    return(
        <View style={styles.container}>
           
           <View style={styles.header}>
                <Text style={styles.title}>Mesa {route.params.number}</Text>
                <TouchableOpacity onPress={handleCloseOrder}>
                    <Feather name="trash-2" size={28} color="#FF3F4b" />
                </TouchableOpacity>
           </View> 

            {category.length !== 0 && (           // mundado o seModalCategoryVisible de false p/ true, para o modal ficar visivel.
                <TouchableOpacity style={styles.input} onPress={ () => seModalCategoryVisible(true) }>
                    <Text style={{ color: '#FFF' }}>
                        {categorySelected?.name}  {/* aqui ela mostra para o usuario a categoria seleconada */}
                    </Text>
                </TouchableOpacity>
            )}

            {products.length !== 0 && (           
                <TouchableOpacity style={styles.input} onPress={ () => setmodalProductVisible(true) }>
                    <Text style={{ color: '#FFF' }}>
                        {productSelected?.name}  {/* aqui ela mostra para o usuario a categoria seleconada */}
                    </Text>
                </TouchableOpacity>
            )}

            <View style={styles.qtdContainer}>
                <Text style={styles.qtdText}>Quantidade</Text>
                <TextInput
                    style={[styles.input, { width: '60%', textAlign: 'center' } ]}
                    placeholderTextColor=" #F0F0F0"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setamount}
                />
            </View>   

            <View style={styles.actions}>
                <TouchableOpacity style={styles.buttonAdd}>
                    <Text style={styles.buttonText}> + </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Avançar</Text>
                </TouchableOpacity>
            </View>
            




            <Modal
                transparent={true}
                visible={modalCategoryVisible} //controlar a visibilidade do modal 
                animationType="fade"
            >

                <ModalPicker
                    handleCloseModal={ () => seModalCategoryVisible(false) }
                    options={category}
                    selectedItem={ handleChangeCategory} //Aqui eu recebo qual é o item da category escolhido do aquivo index.tsx da pasta Order
                /> 
                

            </Modal>


            <Modal
                transparent={true}
                visible={modalProductVisible} //controlar a visibilidade do modal 
                animationType="fade"
            >

                <ModalPicker
                    handleCloseModal={ () => setmodalProductVisible(false) }
                    options={products}
                    selectedItem={ handleChangeProduct} //Aqui eu recebo qual é o item da category escolhido do aquivo index.tsx da pasta Order
                /> 
                

            </Modal>


        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingEnd:'4%',
        paddingStart: '4%'
    },
    header:{
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    title:{
        fontSize:30,
        fontWeight: 'bold',
        color: '#FFF',
        marginRight: 14
    },
    input:{
        backgroundColor: '#101026',
        borderRadius: 4,
        width: '100%',
        height:40,
        marginBottom: 12,
        justifyContent: 'center',
        paddingHorizontal: 8,
        color: '#FFF',
        fontSize: 20
    },
    qtdContainer:{
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    qtdText:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF'
    },
    actions:{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    buttonAdd:{
        width: '20%',
        backgroundColor: '#3fd1ff',
        borderRadius: 4,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText:{
        color: '#101026',
        fontSize: 18,
        fontWeight: 'bold'
    },
    button:{
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        height: 40,
        width: '75%',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
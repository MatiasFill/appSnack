import React, { useState, useEffect} from "react";
import { View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList //trabalhar com lista de forma dinamica ou listas grande e performas
 } from "react-native";

// tambem podemos pegar os parametros com " useRoute com sua propriedade " RouteProp"
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";

import { Feather} from '@expo/vector-icons'
import { api } from "../../services/api";
import { ModalPicker} from '../../components/ModalPicker'
import { ListItem } from "../../components/ListItem";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackPramsList } from "../../routes/app.routes";


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

type ItemProps = {// criando uma tipagens
    id: string;
    product_id: string;
    name: string;
    amount: string | number;  //amount é quantidade
}

type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>

export default function Order(){
    const route = useRoute<OrderRouteProps>();
    const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>();
    // criando os estados com duas useState
    const [category, setCategory] = useState<CategoryProps[] | []>([]) // criando os estados, armazena as listagens de todas
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>()//essa aponta p/ a que esta selecionada atualmente. pego o item que me mandou e troca a categoria selecionada
    const [modalCategoryVisible, seModalCategoryVisible] = useState(false)//Controlar quando o modal vai esta aberto / fechado. Sempre começa "false"

    
    const [ products, setProducts]= useState<ProductsProps[] | []>([]);
    const [productSelected, setProductSelected] = useState<ProductsProps | undefined>()
    const [modalProductVisible, setmodalProductVisible] = useState(false);
// toda vez que digitar a quantidade de um produto vai ser salvo nessa useState chamado "amount"
    const [amount, setamount] = useState('1')// o estado que vai controlar a quntidade 
    const [items, setItems] = useState<ItemProps[]>([]); // salvar os itens do pedido dentro de uma lista de ietm Props[]
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

    // Aqui você vai adicionar um produto nessa mesa. 
    async function handleAdd(){         //Aqui faço uma chamada na " /order/add"
        const response = await api.post('/order/add',{
            order_id: route.params?.order_id, // recebo o id da que vem da rota order.id
            product_id:productSelected?.id,// aqui eu passo o produto selecionado que vem do productSelected
            amount: Number(amount)// digito dentro do Textinput coloco dentro de uma useState, Amount, agora estou pegando essea informacao
        })

        // agora vou repassar o que eu recebo atravez " /order/add" atravez do response p/ "let data"
        let data = {
            id: response.data.id,
            product_id: productSelected?.id as string,
            name: productSelected?.name as string,
            amount: amount
        }
        //aqui estou passando todo o objeto que esta acima o "let data" para nossa useState atravez do setItem
        
        setItems(oLdArray => [...oLdArray, data])
    }    


    // aqui estou deletando um item da minha lista
    async function handleDeleteItem(item_id: string){
        await api.delete('/order/remove', {
            params:{
                item_id: item_id
            }
        })
    

        // aqui vamos remover um item e atualizar a lista de item.
        let removeItem = items.filter( item => {
        /*esse "item.id" é igual o que vc esta me mandando aqui, se for igual eu tiro da minha lista, 
        agora se não for igual eu coloco esse item dentro da variavel "removeItem"  */  
         return (item.id !== item_id)
        })
    
        setItems(removeItem)// aqui passo toda nossa array ja tirando o item que clicou para deletar    
    }



        function handleFinishOrder(){
            navigation.navigate('FinishOrder', {
                number:route.params?.number, 
                order_id: route.params?.order_id
            }) // navegando até a tela de finalizar order do pedido 
        }

    return(
        <View style={styles.container}>
           
           <View style={styles.header}>
                <Text style={styles.title}>Mesa {route.params.number}</Text>
                {items.length === 0 && (
                    <TouchableOpacity onPress={handleCloseOrder}>
                        <Feather name="trash-2" size={28} color="#FF3F4b" />
                    </TouchableOpacity>
                )}
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
                <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
                    <Text style={styles.buttonText}> + </Text>
                </TouchableOpacity>
                 {/*aqui abaixo é o botom de avançar */}
                <TouchableOpacity
                    style={[styles.button, { opacity: items.length === 0 ? 0.3 : 1} ]}
                    disabled={items.length === 0}
                    onPress={handleFinishOrder} 
                >
                    <Text style={styles.buttonText}>Avançar</Text>
                </TouchableOpacity>
            </View>
            




            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, marginTop: 24 }} // aqui esta stilizando direto na linha
                data={items} // data basicamente é sua lista de item que vai estar dentro de uma useState "item"
                keyExtractor={(item) => item.id } // aqui é pra saber o " id " de cada item
                renderItem={({ item }) => <ListItem data={item} deleteItem={handleDeleteItem} /> }//aqui é qual item que vai ser renderizado. como queremos renderizar os componentes. passando a propriedade item para data
            />


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
    },
})
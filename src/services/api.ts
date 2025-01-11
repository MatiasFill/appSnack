import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3333'
  //baseURL: 'http://192.168.1.102:3333'
  baseURL: 'http://192.168.0.165:3333' // faixa de ip do Cicero
})

export { api };

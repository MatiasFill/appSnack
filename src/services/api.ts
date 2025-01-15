/*import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3333'
  baseURL: 'http://192.168.1.102:3333'
  //baseURL: 'http://192.168.0.165:3333' // faixa de ip do Cicero
})
  */

import axios from 'axios'
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API || 'http://localhost:3333',
    timeout: 10000,
})
import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3039/api/v1',
  // baseURL: 'https://arvofinance.herokuapp.com/api/v1',
  timeout: 50000,
  'Content-Type': 'application/x-www-form-urlencoded',
});

import axios from 'axios';

export default axios.create({
  baseURL: 'https://phone-number-apis.herokuapp.com/api/v1',
  timeout: 50000,
  'Content-Type': 'application/x-www-form-urlencoded',
});

import axios from 'axios';
import { config } from '../config/env';

export const forwardToMicroservice = async (pokemonName: string) => {
  
  const targetUrl = `${config.microserviceUrl}/${pokemonName}`;
  
  
  const response = await axios.get(targetUrl);
  return response.data;
};
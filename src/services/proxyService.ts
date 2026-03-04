import axios from 'axios';
import { config } from '../config/env';

export const forwardToMicroservice = async (pokemonName: string) => {
  // URL hacia el Repo 3
  const targetUrl = `${config.microserviceUrl}/${pokemonName}`;
  
  // Hacemos la petición y devolvemos la data tal cual llegue
  const response = await axios.get(targetUrl);
  return response.data;
};
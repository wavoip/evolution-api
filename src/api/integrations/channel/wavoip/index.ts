import axios from 'axios';
import { useVoiceCallsBaileys } from 'voice-calls-baileys';

async function makeRequest(token: string) {
  try {
    const url = 'https://api.wavoip.com/devices/evolution'; // Substitua pela URL da sua API
    const payload = {
      name: '',
      token: token,
    };

    const response = await axios.post(url, payload);
    const data = response.data;

    if (data?.type === 'success') {
      console.log('Requisição bem-sucedida!');
      console.log('Token:', token);
      return true;
    } else {
      console.log('Resposta não válida. Tentando novamente...', response.data);
      return false;
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.error('Erro 500: ', error.response.data || 'Erro no servidor.');
    } else {
      console.error(`Erro ${error?.response?.status}:`, error?.response?.data?.message || error?.message || error);
    }
    return false;
  }
}

async function retryRequest(token: string) {
  let hasRetry = true;
  while (hasRetry) {
    const success = await makeRequest(token);
    if (success) {
      hasRetry = false;
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Espera 1 segundo antes de tentar novamente
  }
}

const start_connection = async (client, instance) => {
  const token = instance.token;

  if (!token) {
    console.log('Token não recebido');
    return;
  }

  await retryRequest(token);

  useVoiceCallsBaileys(token, client, 'open', true);
};

export default start_connection;

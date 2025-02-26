import axios from "axios";

// Configurações
const orsApiKey = process.env.ORS_API_KEY;  // API gratuita do OpenRouteService
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.CHAT_ID;

const origem = [-45.603132,-23.064491]; // Longitude, Latitude de Origem
const destino = [-45.551189,-23.018531]; // Longitude, Latitude de Destino

async function verificarTrafego() {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsApiKey}&start=${origem[0]},${origem[1]}&end=${destino[0]},${destino[1]}`;

  try {
    const response = await axios.get(url);
    const rota = response.data.routes[0];
    const duracao = rota.summary.duration / 60; // Converter segundos para minutos

    if (duracao > process.env.TEMPO_NORMAL) { // Se o tempo de viagem for maior que o tempo normal em min, alertar
      await enviarAlerta(`⚠️ Atraso detectado! Tempo estimado: ${Math.round(duracao)} min.`);
    } else {
      console.log("Tráfego dentro do normal.");
    }
  } catch (error) {
    console.error("Erro ao verificar o tráfego:", error);
  }
}

// Função para enviar alerta no Telegram
async function enviarAlerta(mensagem) {
  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(mensagem)}`;
  await axios.get(url);
}

// Rodar a função
verificarTrafego();

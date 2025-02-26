import axios from "axios";
import "dotenv/config";

// Configurações
const orsApiKey = process.env.ORS_API_KEY;
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.CHAT_ID;

const origem = [-45.603132, -23.064491]; // Longitude, Latitude de Origem
const destino = [-45.551189, -23.018531]; // Longitude, Latitude de Destino

if (!orsApiKey || !telegramBotToken || !chatId) {
  console.error("Erro: Variáveis de ambiente não definidas.");
  process.exit(1);
}

async function verificarTrafego() {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsApiKey}&start=${origem[0]},${origem[1]}&end=${destino[0]},${destino[1]}`;

  try {
    const response = await axios.get(url);
    const rota = response.data.features[0].properties;
    const duracao = rota.summary.duration / 60; // Converter segundos para minutos

    if (duracao > 16) {
      // Se o tempo de viagem for maior que o tempo normal em min, alertar
      await enviarAlerta(
        `⚠️ Atraso detectado! Tempo estimado: ${Math.round(duracao)} min.`
      );
    } else {
      console.log("✅ Tráfego dentro do normal.");
    }
  } catch (error) {
    console.error(
      "❌ Erro ao verificar o tráfego:",
      error.response?.data || error.message
    );
  }
}

// Função para enviar alerta no Telegram
async function enviarAlerta(mensagem) {
  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
    mensagem
  )}`;

  try {
    await axios.get(url);
    console.log("✅ Alerta enviado com sucesso.");
  } catch (error) {
    console.error(
      "❌ Erro ao enviar alerta para o Telegram:",
      error.response?.data || error.message
    );
  }
}

// Rodar a função
verificarTrafego();

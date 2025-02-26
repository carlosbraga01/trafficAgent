import puppeteer from "puppeteer";
import axios from "axios";
import "dotenv/config";

// Configurações
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const googleMapsLink = "https://maps.app.goo.gl/bo9EUYFq6Ju8kd6E6"; // Link para o Google Maps

if (!telegramBotToken || !chatId) {
  console.error("Erro: Variáveis de ambiente não definidas.");
  process.exit(1);
}

async function verificarTrafego() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Adicionando a flag --no-sandbox
  });
  const page = await browser.newPage();

  // Acessar o link do Google Maps
  await page.goto(googleMapsLink, { waitUntil: "networkidle2" });

  // Esperar a página carregar e executar XPath manualmente
  const duracao = await page.evaluate(() => {
    const xpath =
      '//*[@id="QA0Szd"]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div[2]/div[1]/h1/span/span[1]';
    const resultado = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    return resultado.singleNodeValue
      ? resultado.singleNodeValue.textContent
      : null;
  });

  if (!duracao) {
    console.error("❌ Erro: Não foi possível encontrar o tempo de trajeto.");
    await browser.close();
    return;
  }

  // Extrair apenas os números da duração (minutos)
  const minutos = parseInt(duracao.replace(/\D/g, ""), 10);

  // Fechar o navegador
  await browser.close();

  if (minutos > 16) {
    await enviarAlerta(`⚠️ Atraso detectado! Tempo estimado: ${minutos} min.`);
  } else {
    await enviarAlerta(
      `✅ Tráfego dentro do normal. Tempo estimado: ${minutos} min.`
    );
    console.log("✅ Tráfego dentro do normal.");
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

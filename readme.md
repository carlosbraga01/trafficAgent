# 🚦 Monitor de Tráfego com Alertas no Telegram

Este projeto verifica o tráfego em um trajeto específico e envia alertas no **Telegram** caso haja atrasos significativos. Utiliza a **OpenRouteService API** para obter informações de trânsito e o **GitHub Actions** para rodar o script automaticamente a cada 10 minutos.

## 📌 **Recursos**
✅ **Totalmente gratuito** (sem necessidade de Google Maps).  
✅ **Sem necessidade de servidores** (usa GitHub Actions).  
✅ **Envia alertas automáticos** para o Telegram.  
✅ **Código aberto e fácil de personalizar**.  

---

## 🚀 **Como Funciona?**
1. O script **consulta a OpenRouteService API** para obter a estimativa de tempo do trajeto.
2. Se houver **um atraso significativo** (exemplo: +50 minutos), um alerta é enviado para o Telegram.
3. O GitHub Actions executa automaticamente a cada 10 minutos.

---

## 🔍 **Tecnologias Utilizadas**
- **Node.js**
- **Axios** (para chamadas HTTP)
- **OpenRouteService API** (para dados de trânsito)
- **Telegram Bot API** (para envio de mensagens)
- **GitHub Actions** (para automação)

---

## ⚙️ **Configuração do Projeto**

### 1️⃣ **Obter a API Key da OpenRouteService**
1. Acesse: [https://openrouteservice.org/sign-up/](https://openrouteservice.org/sign-up/)
2. Crie uma conta e obtenha sua **chave de API**.

### 2️⃣ **Criar um Bot no Telegram**
1. Acesse o **BotFather** no Telegram e crie um bot.
2. Anote o **TOKEN** do bot gerado.
3. Pegue seu **CHAT_ID** usando o bot [@userinfobot](https://t.me/useridinfobot).

### 3️⃣ **Clonar o Repositório**
```sh
git clone https://github.com/seu-usuario/monitor-trafego.git
cd monitor-trafego
```

### 4️⃣ **Instalar Dependências**
```sh
npm install axios
```

### 5️⃣ **Criar um Arquivo `.env`**
Crie um arquivo `.env` e adicione suas credenciais:
```
ORS_API_KEY=Sua_API_Key_Aqui
TELEGRAM_BOT_TOKEN=Seu_Token_Aqui
CHAT_ID=Seu_Chat_ID_Aqui
```

### 6️⃣ **Rodar o Script Manualmente**
```sh
node index.js
```

---

## ⏳ **Automatizando com GitHub Actions**
Para rodar automaticamente a cada 10 minutos, crie o seguinte arquivo:  

📂 **.github/workflows/trafego.yml**
```yaml
name: Monitorar Tráfego

on:
  schedule:
    - cron: "*/10 * * * *"  # Executa a cada 10 minutos
  workflow_dispatch:  # Permite rodar manualmente

jobs:
  check_traffic:
    runs-on: ubuntu-latest

    steps:
      - name: Clonar o repositório
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Instalar dependências
        run: npm install axios

      - name: Rodar script de monitoramento
        run: node index.js
        env:
          ORS_API_KEY: ${{ secrets.ORS_API_KEY }}
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          CHAT_ID: ${{ secrets.CHAT_ID }}
```

---

## 🛡️ **Configurar Segredos no GitHub**
1. Acesse **Settings** → **Secrets and variables** → **Actions**
2. Adicione os segredos:
   - `ORS_API_KEY` → Sua chave da OpenRouteService
   - `TELEGRAM_BOT_TOKEN` → Token do seu bot do Telegram
   - `CHAT_ID` → Seu ID no Telegram

---

## 🎉 **Pronto!**
Agora seu monitor de tráfego está funcionando **de forma gratuita e automática**! 🚀📚

Se precisar de ajuda, abra uma **Issue** ou contribua com melhorias! 🚀


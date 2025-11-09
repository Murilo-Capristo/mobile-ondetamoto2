# 🏍️ OndeTáMoto

> Um sistema inteligente para **detecção e cadastro de motocicletas** via RFID, utilizando um app mobile com integração Bluetooth. Ideal para controle de acesso, segurança e rastreamento em estacionamentos e garagens.

---

## 🧑‍💻 Integrantes do Grupo

- Guilherme Romanholi Santos - RM557462
- Murilo Capristo - RM556794
- Nicolas Guinante Cavalcanti - RM557844

---

## 🚀 Como Rodar o Projeto?

- git clone https://github.com/Murilo-Capristo/sc-3-ondetamoto.git
- cd sc-3-ondetamoto
- npm i
- npx expo start

---

## 📲 Download do App

Baixe e instale o app **OndeTáMoto** no seu dispositivo Android utilizando o QR Code ou o link direto abaixo:

![QR Code para Download](./assets/qrCode.jpg)

🔗 [Link para o App no Expo](https://expo.dev/accounts/murilocapristo/projects/ondetamoto/builds/b35723ed-d1c7-4aff-b7a5-aadc381c06b6)

---

## 📱 Sobre o Projeto

O **OndeTáMoto** é uma solução web e mobile integrada, que permite identificar ou registrar motocicletas por meio de **tags RFID** e um **leitor Bluetooth externo**, sem necessidade de hardware fixo na moto.

- 📲 App desenvolvido em **React Native**
- 🌐 Backend em **.NET**
- 💡 Ideal para sistemas de garagem, estacionamento ou rastreamento inteligente
- 🛰️ Conexão automática com o leitor Bluetooth ao se aproximar de uma moto com tag RFID

---

## ⚙️ Tecnologias Utilizadas

### 🔹 Mobile (React Native)

- React Navigation (Stack)
- Axios
- Context API
- Bluetooth Serial (simulação ainda indisponível)

# Estrutura de Pastas do Diretório `src`

```plaintext
src/
│   theme.ts
│
├───components/
│       LogoutDialog.js
│       MotoItem.tsx
│       SetorItem.tsx
│
├───config/
│       constants.ts
│
├───context/
│       LanguageContext.tsx
│       ThemeContext.tsx
│       UserContext.tsx
│
├───i18n/
│   │   i88n.js
│   │
│   └───locales/
│           es.json
│           pt.json
│
├───navigation/
│       BottomTabsNavigator.tsx
│       RootNavigator.tsx
│
├───screens/
│   │   Splash.tsx
│   │
│   ├───appScreens/
│   │       CadastroMoto.tsx
│   │       CadastroSetor.tsx
│   │       FormMoto.tsx
│   │       HomeScreen.tsx
│   │       NotificationScreen.tsx
│   │       SearchScreen.tsx
│   │       SetorDetailsScreen.tsx
│   │       SubmitScreen.tsx
│   │
│   ├───preScreen/
│   │       LandingScreen.tsx
│   │       LoginScreen.tsx
│   │       PreCadastroScreen.tsx
│   │
│   └───templates/
│           HeaderReduzida.tsx
│           HeaderTemplate.tsx
│
└───services/
        authService.ts
        motoService.ts
        mqttService.js
        setorService.ts
```

### 🔹 Outros

- RFID tags (ainda não simuláveis no app)
- Leitor RFID Bluetooth (ainda não simulado em desenvolvimento)

---

## 🧩 Funcionalidades

- 📍 Detectar moto por aproximação do leitor RFID
- ➕ Cadastrar nova moto ao detectar uma tag desconhecida
- 👤 Login por nome de usuário
- 📊 Listar e avaliar setores
- 🔐 Segurança com Firebase

---

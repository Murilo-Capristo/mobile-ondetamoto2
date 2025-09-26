# 🏍️ OndeTáMoto

> Um sistema inteligente para **detecção e cadastro de motocicletas** via RFID, utilizando um app mobile com integração Bluetooth. Ideal para controle de acesso, segurança e rastreamento em estacionamentos e garagens.

---

## 🧑‍💻 Integrantes do Grupo
- Guilherme Romanholi Santos - RM557462
- Murilo Capristo - RM556794
- Nicolas Guinante Cavalcanti - RM557844
  
---

## 🚀 Como Rodar o Projeto?
- git clone https://github.com/Murilo-Capristo/mobile-ondetamoto.git
- cd mobile-ondetamoto
- npm i
- npx expo start
  
---

## 📱 Sobre o Projeto

O **OndeTáMoto** é uma solução web e mobile integrada, que permite identificar ou registrar motocicletas por meio de **tags RFID** e um **leitor Bluetooth externo**, sem necessidade de hardware fixo na moto.

- 📲 App desenvolvido em **React Native**
- 🌐 Backend em **Spring Boot**
- 💡 Ideal para sistemas de garagem, estacionamento ou rastreamento inteligente
- 🛰️ Conexão automática com o leitor Bluetooth ao se aproximar de uma moto com tag RFID

---

## ⚙️ Tecnologias Utilizadas

### 🔹 Mobile (React Native)
- React Navigation (Stack)
- Axios
- Context API
- Bluetooth Serial (simulação ainda indisponível)

### 🔹 Outros
- RFID tags (ainda não simuláveis no app)
- Leitor RFID Bluetooth (ainda não simulado em desenvolvimento)

---

## 🧩 Funcionalidades

- 📍 Detectar moto por aproximação do leitor RFID
- ➕ Cadastrar nova moto ao detectar uma tag desconhecida
- 👤 Login por nome de usuário 
- 📊 Listar e avaliar estabelecimentos
- 🔐 Segurança com JWT

---

#Próximos Passos:
## 🧪 Simulação sem Hardware

Para testes sem o leitor Bluetooth real:
- Simule a leitura de tags RFID com dados mockados
- Utilize uma tela especial de "Simulação de Leitura"
- O app identifica como se a tag tivesse sido lida via Bluetooth

---




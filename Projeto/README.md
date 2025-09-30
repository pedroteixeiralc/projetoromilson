📡 Cliente API – WhatsApp (Baileys)

API em Node.js + Express + Baileys para gerenciamento de conexões WhatsApp.
Permite criar instâncias, gerar QRCode, consultar status, remover conexões, enviar mensagens e listar conexões ativas.

🚀 Tecnologias

Node.js

Express

Baileys

📂 Estrutura do Projeto
Projeto/
│ package.json
│ server.js         # Ponto de entrada da aplicação
│ README.md
├─ sessions/        # ⚠️ Armazena as credenciais das instâncias (NÃO versionar)
└─ src/
   ├─ baileys.js    # Configuração e inicialização das conexões WhatsApp
   └─ routes.js     # Definição das rotas da API

🔧 Pré-requisitos

Node.js versão 18 ou superior

npm ou yarn

⚙️ Instalação

Clone este repositório:

git clone <URL_DO_REPOSITORIO>
cd Projeto


Instale as dependências:

npm install
# ou
yarn install


Crie um arquivo .env na raiz (se necessário) com suas variáveis de ambiente:

PORT=3000
API_KEY=sua_chave_de_api

▶️ Execução
Desenvolvimento
npm run dev


ou

node server.js


A API estará disponível em:

http://localhost:3000

📡 Rotas da API
🔑 Autenticação

Todas as rotas exigem o campo apikey no body.

1️⃣ Criar instância

Cria uma nova sessão do WhatsApp.

Endpoint

POST /instance


Body

{
  "apikey": "SUA_CHAVE",
  "usuario_id": "123",
  "emissor": "5511999999999"
}

2️⃣ Gerar QRCode

Obtém o QRCode para parear a conta.

Endpoint

GET /qrcode/:usuario_id

3️⃣ Status da conexão

Retorna o status da instância.

Endpoint

GET /status/:usuario_id

4️⃣ Remover conexão

Encerra e remove uma instância.

Endpoint

DELETE /instance


Body

{
  "apikey": "SUA_CHAVE",
  "usuario_id": "123"
}

5️⃣ Enviar mensagem de texto

Envia uma mensagem para um número específico.

Endpoint

POST /send-message


Body

{
  "apikey": "SUA_CHAVE",
  "usuario_id": "123",
  "receptor": "5511999999999",
  "texto": MENSAGEM PADRÃO
}

6️⃣ Listar conexões

Lista todas as instâncias ativas.

Endpoint

GET /instances

⚠️ Observações importantes

A pasta sessions deve permanecer fora de versionamento (adicione no .gitignore):

sessions/


Sempre proteja sua API_KEY e demais credenciais.

Caso use hospedagem em produção, configure variáveis de ambiente de forma segura.

📜 Licença

Projeto de uso privado/contratual. Não redistribuir sem autorização.
Retífica Monteiro
Guia Passo a Passo — Configuração do Firebase

Este guia vai te ajudar a colocar o sistema de registro de serviços no ar usando o Firebase do Google (gratuito). Ao final, qualquer computador ou celular poderá acessar e cadastrar ordens de serviço com fotos.
Etapa 1 — Criar o Projeto no Firebase
1.	Acesse console.firebase.google.com e faça login com sua conta Google (a mesma do Gmail serve).
2.	Clique em "Adicionar projeto" (ou "Add project").
3.	Dê um nome ao projeto, por exemplo: retifica-monteiro.
4.	Na tela do Google Analytics, pode desativar (não é necessário). Clique em "Criar projeto".
5.	Aguarde criar e clique em "Continuar".
Etapa 2 — Ativar o Firestore (Banco de Dados)
6.	No menu lateral esquerdo, clique em "Criação" > "Firestore Database".
7.	Clique em "Criar banco de dados".
8.	Escolha o local do servidor. Recomendo southamerica-east1 (São Paulo).
9.	Selecione "Iniciar no modo de teste" (isso permite leitura e escrita por 30 dias — depois vamos ajustar as regras).
10.	Clique em "Criar".
Etapa 3 — Ativar o Storage (Armazenamento de Fotos)
11.	No menu lateral, clique em "Criação" > "Storage".
12.	Clique em "Começar".
13.	Selecione "Iniciar no modo de teste" e clique em "Próxima".
14.	Confirme o local (mesmo do Firestore) e clique em "Concluído".
Etapa 4 — Obter a Configuração do Firebase
Esta é a parte mais importante — você vai copiar os dados de conexão para colar no arquivo HTML.
15.	Na página inicial do projeto, clique no ícone </> (Web) para registrar um app da web.
16.	Dê um apelido ao app, por exemplo: sistema-os. Não precisa marcar "Firebase Hosting" agora.
17.	Clique em "Registrar app".
18.	Vai aparecer um bloco de código. Procure o objeto firebaseConfig — ele se parece com isso:
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "retifica-monteiro.firebaseapp.com",
  projectId: "retifica-monteiro",
  storageBucket: "retifica-monteiro.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
19.	Copie todo esse bloco. Você vai colar no arquivo index.html no local indicado (onde diz "COLE AQUI").
Etapa 5 — Configurar o Arquivo HTML
20.	Abra o arquivo index.html (o novo que eu preparei) em um editor de texto — pode ser o Bloco de Notas, Notepad++ ou VS Code.
21.	Procure por "COLE_AQUI" (use Ctrl+H para Localizar e Substituir).
22.	Substitua cada valor "COLE_AQUI" pelo valor correspondente da configuração que copiou na Etapa 4.
23.	Salve o arquivo.
Etapa 6 — Colocar no Ar com Firebase Hosting (Gratuito)
Para que outros computadores acessem, você precisa hospedar o arquivo. O Firebase Hosting é gratuito e simples.
Opção A — Pelo terminal (recomendado)
24.	Instale o Node.js: acesse nodejs.org e baixe a versão LTS.
25.	Abra o Prompt de Comando (CMD) e digite: npm install -g firebase-tools
26.	Faça login: firebase login
27.	Crie uma pasta no computador (ex: C:\retifica-site) e coloque o index.html dentro dela.
28.	No CMD, navegue até a pasta: cd C:\retifica-site
29.	Inicialize o projeto: firebase init hosting
Nas perguntas que aparecem:
a)	Selecione o projeto que você criou (retifica-monteiro).
b)	Public directory: digite . (um ponto, que significa "esta pasta").
c)	Single-page app: responda N (não).
d)	Overwrite index.html: responda N (não).
30.	Publique: firebase deploy
31.	Pronto! O terminal vai mostrar o link do site, algo como: retifica-monteiro.web.app. Acesse de qualquer computador ou celular!
Opção B — Sem terminal (rede local)
Se quiser testar rápido só na sua rede local (sem publicar na internet): coloque o arquivo index.html em uma pasta compartilhada da rede e abra nos outros computadores. Funciona, mas só dentro da sua rede Wi-Fi/LAN.
Etapa 7 — Ajustar Regras de Segurança (Importante!)
O modo de teste expira em 30 dias. Antes disso, ajuste as regras para manter o acesso funcionando.
Regras do Firestore
32.	No console do Firebase, vá em Firestore Database > Regras.
33.	Substitua tudo por:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /ordens/{doc} {
      allow read, write: if true;
    }
  }
}
34.	Clique em "Publicar".
Regras do Storage
35.	Vá em Storage > Regras.
36.	Substitua tudo por:
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /fotos/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
37.	Clique em "Publicar".
Nota de segurança: essas regras permitem acesso aberto (qualquer pessoa com o link pode ler e escrever). Para uso interno de uma retífica isso normalmente é suficiente. Se quiser proteger com login no futuro, podemos adicionar autenticação por e-mail/senha.
Limites do Plano Gratuito
•	Firestore: 1 GB de dados, 50.000 leituras/dia, 20.000 escritas/dia.
•	Storage: 5 GB para fotos.
•	Hosting: 10 GB de transferência/mês.
•	Para uma retífica com uso normal, esses limites são mais que suficientes.
Dúvidas Frequentes
Preciso pagar algo?
Não. O plano Spark do Firebase é totalmente gratuito dentro dos limites acima.
E se eu perder meu computador?
Os dados ficam salvos nos servidores do Google (Firebase). Basta acessar o link do site de qualquer outro dispositivo.
Posso acessar do celular?
Sim! O sistema é responsivo e funciona em celulares e tablets.
Como atualizo o site depois?
Edite o index.html e rode firebase deploy novamente no terminal.


const firebaseConfig = {
  apiKey: "AIzaSyBJloGEReetkAN9SyWLsKtmGBY--15BVrE",
  authDomain: "retifica-monteiro.firebaseapp.com",
  projectId: "retifica-monteiro",
  storageBucket: "retifica-monteiro.firebasestorage.app",
  messagingSenderId: "379556838037",
  appId: "1:379556838037:web:ea4008acaa2f83205d399c",
  measurementId: "G-9Y6QDKCMG6"
};
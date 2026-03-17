# Retífica Monteiro — Sistema de Ordens de Serviço

Sistema web para registro, busca e gerenciamento de ordens de serviço com suporte a upload de fotos. Desenvolvido para funcionar em qualquer dispositivo (desktop, tablet ou celular) com armazenamento em nuvem via Firebase.

## Funcionalidades

- Cadastro de ordens de serviço (OS, cliente, motor, veículo, serviço executado)
- Upload de múltiplas fotos por registro
- Busca e filtro por OS, cliente, motor ou veículo
- Edição e exclusão de registros
- Interface responsiva
- Armazenamento em nuvem (Firebase Firestore + Storage)
- Hospedagem gratuita via Firebase Hosting

## Tecnologias

| Camada        | Tecnologia                          |
|---------------|-------------------------------------|
| Front-end     | HTML, CSS, JavaScript (vanilla)     |
| Banco de dados| Firebase Firestore                  |
| Armazenamento | Firebase Storage                    |
| Hospedagem    | Firebase Hosting                    |

---

## Guia de Configuração

### Pré-requisitos

- Conta Google (Gmail)
- [Node.js](https://nodejs.org) (versão LTS) — necessário apenas para deploy

### 1. Criar o projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) e faça login.
2. Clique em **Adicionar projeto**.
3. Nomeie o projeto (ex.: `retifica-monteiro`).
4. Desative o Google Analytics (opcional) e clique em **Criar projeto**.

### 2. Ativar o Firestore (banco de dados)

1. No menu lateral, acesse **Criação > Firestore Database**.
2. Clique em **Criar banco de dados**.
3. Selecione o local `southamerica-east1` (São Paulo).
4. Escolha **Iniciar no modo de teste** e clique em **Criar**.

### 3. Ativar o Storage (armazenamento de fotos)

1. No menu lateral, acesse **Criação > Storage**.
2. Clique em **Começar**.
3. Selecione **Iniciar no modo de teste** e confirme o local.

### 4. Obter a configuração do Firebase

1. Na página inicial do projeto, clique no ícone **</>** (Web) para registrar um app.
2. Dê um apelido (ex.: `sistema-os`). Não é necessário marcar "Firebase Hosting" neste momento.
3. Clique em **Registrar app**.
4. Copie o objeto `firebaseConfig` que será exibido:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

### 5. Configurar o arquivo HTML

1. Abra o arquivo `index.html` em um editor de texto.
2. Localize o trecho `firebaseConfig` e substitua os valores pelos dados obtidos na etapa anterior.
3. Salve o arquivo.

### 6. Deploy com Firebase Hosting

```bash
# Instalar as ferramentas do Firebase
npm install -g firebase-tools

# Fazer login
firebase login

# Navegar até a pasta do projeto
cd caminho/para/o/projeto

# Inicializar o hosting
firebase init hosting
```

Durante a inicialização, responda:

| Pergunta              | Resposta                               |
|-----------------------|----------------------------------------|
| Projeto               | Selecione o projeto criado             |
| Public directory      | `.` (ponto — pasta atual)              |
| Single-page app       | `N`                                    |
| Overwrite index.html  | `N`                                    |

```bash
# Publicar
firebase deploy
```

Após o deploy, o terminal exibirá a URL do site (ex.: `https://retifica-monteiro.web.app`).

> **Alternativa sem terminal:** para testes em rede local, basta colocar o `index.html` em uma pasta compartilhada e abri-lo nos demais dispositivos da rede.

---

## Regras de Segurança

O modo de teste expira em 30 dias. Antes disso, atualize as regras para manter o acesso funcionando.

### Firestore

No console do Firebase, acesse **Firestore Database > Regras** e substitua pelo conteúdo abaixo:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /ordens/{doc} {
      allow read, write: if true;
    }
  }
}
```

### Storage

Acesse **Storage > Regras** e substitua por:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /fotos/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

> **Atenção:** essas regras permitem acesso público (leitura e escrita). Para uso interno isso é aceitável. Caso seja necessário restringir o acesso futuramente, é possível implementar autenticação por e-mail/senha.

---

## Limites do Plano Gratuito (Spark)

| Recurso     | Limite                         |
|-------------|--------------------------------|
| Firestore   | 1 GB de dados · 50 mil leituras/dia · 20 mil escritas/dia |
| Storage     | 5 GB para arquivos             |
| Hosting     | 10 GB de transferência/mês     |

Para o volume de uso de uma retífica, esses limites são mais que suficientes.

---

## FAQ

**Preciso pagar algo?**
Não. O plano Spark do Firebase é gratuito dentro dos limites listados acima.

**E se eu perder o computador?**
Os dados ficam armazenados nos servidores do Google. Basta acessar a URL do site de qualquer dispositivo.

**Posso acessar pelo celular?**
Sim. A interface é responsiva e funciona em celulares e tablets.

**Como atualizo o site?**
Edite o `index.html` e execute `firebase deploy` novamente.

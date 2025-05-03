# Know Your Fan — Documentação do Sistema

## Visão Geral

Este projeto tem como objetivo principal criar uma solução para a FURIA identificar e classificar seus fãs com base em interações em redes sociais e avaliações de produtos, promovendo engajamento com uma mecânica de gamificação.

## Funcionalidades Principais

### 1. Classificação de Seguidores (Twitter)

* Captura a lista de contas seguidas por um usuário.
* Utiliza um modelo de linguagem para classificar os perfis nas seguintes categorias:

  * `lol` (League of Legends)
  * `valorant`
  * `cs2` (Counter-Strike 2)
  * `games` (conteúdo geral de jogos)
  * `não precisa classificar` (casos irrelevantes)

### 2. Classificação de Sentimentos (Twitter)

* Coleta tweets de usuários.
* Utiliza IA para classificar os sentimentos das postagens sobre a FURIA em:

  * Fã
  * Neutro
  * Hater

### 3. Sistema de Gamificação

* Pontuação baseada em:

  * Interações com a FURIA nas redes sociais.
  * Avaliações de produtos ou experiências.
* Níveis de engajamento:

  * **Irritado**: até 1000 pontos.
  * **Bravo**: até 2000 pontos.
  * **Furioso**: até 2500 pontos.
* Exibição de progresso e status atual do usuário.

### 4. Análise de Dados do Instagram

* Busca de informações de perfis.
* Coleta de mídias e comentários.
* Avaliação de seguidores e interações.

### 5. Sistema de Login

* Duas formas de login:

  * **Usuário comum**: Acesso ao seu próprio perfil, pontuação, e gamificação.
  * **Administrador**:

    * Acesso a dados pessoais de usuários.
    * Acesso a pontuação de engajamento.
    * Visualização do nível de fã ou hater do usuário.
    * Visualização das palavras mais usadas em postagens sobre a FURIA e esports.

### 6. Cadastro com Autenticação Facial

* Tela de cadastro que realiza verificação facial.
* Compara o rosto da câmera com o RG fornecido pelo usuário.
* Garante a veracidade da identidade.

## Tecnologias Utilizadas

* **Frontend**: React, Tailwind CSS, Shadcn/ui, Framer Motion
* **Backend**: Node.js, API REST
* **APIs Externas**:

  * Twitter via RapidAPI
  * Instagram via RapidAPI
  * OpenRouter / DeepSeek para classificação de IA
* **Banco de dados**: Supabase

## Estrutura de Níveis de Gamificação

| Nível    | Pontuação Máxima | Descrição                          |
| -------- | ---------------- | ---------------------------------- |
| Irritado | 1000             | Início da jornada                  |
| Bravo    | 2000             | Engajado, participa frequentemente |
| Furioso  | 2500             | Super fã, presença constante       |

## Pontos Considerados na Gamificação

* Tweets positivos sobre a FURIA
* Seguimento de contas relacionadas a esports
* Avaliação de produtos comprados
* Interação com conteúdos da organização
import { getTwitterUser } from './Twitter/userIdX.js';
import getUserTweets from './Twitter/postsX.js';
import getFollowings from './Twitter/followingX.js';

const API_KEY = '';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function main() {
  try {
    const username = "FURIA";

    // Obter ID do usuário e tweets
    const userId = await getTwitterUser(username);
    console.log('Dados do usuário:', userId);

    await sleep(1000);

    const tweets = await getUserTweets(userId);
    if (!Array.isArray(tweets)) throw new Error("Tweets não retornados como array.");

    // Prompt de sentimentos
    const sentimentPrompt = `
Classifique as seguintes frases como 1 para "positivo", -1 para "negativo" ou 0 para "neutro".
Retorne apenas um array com os numeros.

tweets:
${tweets.map((f, i) => `${i + 1}. "${f}"`).join('\n')}
`;

    const sentimentResult = await askOpenRouter(sentimentPrompt);
    const sentimentArray = parseJSONArray(sentimentResult);
    console.log('Array de sentimentos:', sentimentArray);

    // Classificação de followings
    const followings = await getFollowings(userId);
    const followingsPrompt = `
Você receberá uma lista de nomes de páginas e usuários seguidos no Twitter. Classifique cada um deles, apenas pelo nome do usuário em uma das seguintes categorias:

- lol para League of Legends
- valorant para Valorant
- cs2 para Counter-Strike 2
- games para conteúdo geral de jogos que não se encaixam em apenas uma categoria
- não precisa classificar para aqueles que não se encaixam em nenhuma das categorias acima

followings:
${followings.map((f, i) => `${i + 1}. "${f}"`).join('\n')}
`;

    const followingsResult = await askOpenRouter(followingsPrompt);
    console.log('Classificação de followings:', followingsResult);

  } catch (error) {
    console.error('Erro:', error.message);
  }
}

async function askOpenRouter(prompt) {
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  };

  const data = {
    model: 'deepseek/deepseek-chat:free',
    messages: [{ role: 'user', content: prompt }]
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  const result = await response.json();
  return result.choices[0].message.content.trim();
}

function parseJSONArray(text) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();
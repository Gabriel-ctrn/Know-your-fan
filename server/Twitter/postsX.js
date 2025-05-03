import https from 'https';

function getUserTweets(userId, count = 1) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'twitter241.p.rapidapi.com',
      port: null,
      path: `/user-tweets?user=${userId}&count=${count}`,
      headers: {
        'x-rapidapi-key': '',
        'x-rapidapi-host': 'twitter241.p.rapidapi.com'
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks);
        try {
          const data = JSON.parse(body.toString());

          const instructions = data?.result?.timeline?.instructions;
          if (!instructions || !Array.isArray(instructions)) {
            return reject('Formato de resposta inesperado.');
          }

          // Procura pela instrução com tweets
          const tweetInstruction = instructions.find(
            (instr) => instr.entries && Array.isArray(instr.entries)
          );

          if (!tweetInstruction) {
            return reject('Nenhum tweet encontrado nas instruções.');
          }
          const tweetsText = [];
          // Mapeia os tweets extraindo os campos principais
          const tweets = tweetInstruction.entries
            .filter(entry => entry.content?.itemContent?.tweet_results?.result?.legacy)
            .map(entry => {
              const tweet = entry.content.itemContent.tweet_results.result.legacy;
              tweetsText.push(tweet.full_text);
              
            });

          resolve(tweetsText);
        } catch (error) {
          reject('Erro ao parsear JSON da resposta: ' + error.message);
        }
      });
    });

    req.on('error', (error) => {
      reject('Erro na requisição: ' + error.message);
    });

    req.end();
  });
}

export default getUserTweets;
 // Exporta para ser usado em outros arquivos

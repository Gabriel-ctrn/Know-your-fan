import https from 'https';


function getFollowings(userId, count = 20) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'twitter241.p.rapidapi.com',
      port: null,
      path: `/followings?user=${userId}&count=${count}`,
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
        try {
          const body = Buffer.concat(chunks);
          const json = JSON.parse(body.toString());
          const entries = json?.result?.timeline?.instructions
      ?.find(instr => instr.type === 'TimelineAddEntries')?.entries || [];

    const names = entries
      .map(entry => entry.content?.itemContent?.user_results?.result?.legacy?.name)
      .filter(Boolean);
          console.log(names.length);
          resolve(names);
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

export default getFollowings;

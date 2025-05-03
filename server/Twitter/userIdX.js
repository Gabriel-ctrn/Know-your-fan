import https from 'https';

export function getTwitterUser(username) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'twitter241.p.rapidapi.com',
      port: null,
      path: `/user?username=${encodeURIComponent(username)}`,
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
        const body = Buffer.concat(chunks).toString();
        try {
		  const json = JSON.parse(body);
          const rest_id = json.result.data.user.result.rest_id;
          resolve(rest_id);
        } catch (err) {
          reject(new Error('Erro ao parsear JSON da resposta.'));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

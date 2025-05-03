import https from 'https';

const options = {
  method: 'GET',
  hostname: 'instagram-premium-api-2023.p.rapidapi.com',
  port: null,
  // Adicionando os parâmetros necessários: user_id ou username e amount
  path: '/v1/user/following?user_id=5846636125&amount=100', // Use o user_id correto ou username
  headers: {
    'x-rapidapi-key': '',
    'x-rapidapi-host': 'instagram-premium-api-2023.p.rapidapi.com'
  }
};

const req = https.request(options, function (res) {
  const chunks = [];

  res.on('data', function (chunk) {
    chunks.push(chunk);
  });

  res.on('end', function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();

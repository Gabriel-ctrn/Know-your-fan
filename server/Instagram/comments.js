import https from 'https';

const options = {
  method: 'GET',
  hostname: 'instagram-premium-api-2023.p.rapidapi.com',
  port: null,
  // Passando o ID do post na URL
  path: `/v2/media/comments?id=3571492003202159012_5846636125`,
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

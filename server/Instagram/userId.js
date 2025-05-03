import https from 'https';

const options = {
  method: 'GET',
  hostname: 'instagram-premium-api-2023.p.rapidapi.com',
  port: null,
  // Adicionando o parâmetro de pesquisa (query) com o nome de usuário "furiagg"
  path: '/v1/search/users?query=furiagg', // Insira o nome de usuário ou consulta aqui
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
//5846636125
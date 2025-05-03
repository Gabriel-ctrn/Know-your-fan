import https from 'https';

const profileUrl = 'https://www.instagram.com/furiagg/';

const options = {
  method: 'GET',
  hostname: 'instagram-premium-api-2023.p.rapidapi.com',
  port: null,
  path: `/v1/user/by/url?url=${encodeURIComponent(profileUrl)}`,
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

import https from 'https';

const options = {
  method: 'GET',
  hostname: 'instagram-premium-api-2023.p.rapidapi.com',
  port: null,
  // A URL agora inclui o shortcode do post
  path: `/v2/media/info/by/url?url=https://www.instagram.com/reel/DGQfQ3pA1Gk/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==`,
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
// 3571492003202159012_5846636125
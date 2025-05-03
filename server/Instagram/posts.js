import https from 'https';

const options = {
	method: 'GET',
	hostname: 'instagram-premium-api-2023.p.rapidapi.com',
	port: null,
	path: '/v2/user/medias?user_id=5846636125',
	headers: {
		'x-rapidapi-key': '',
		'x-rapidapi-host': 'instagram-premium-api-2023.p.rapidapi.com'
	}
};

const req = https.request(options, (res) => {
	const chunks = [];

	res.on('data', (chunk) => {
		chunks.push(chunk);
	});

	res.on('end', () => {
		const body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});

req.end();

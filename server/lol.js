import https from 'https';

const TEAM_SLUG = 'furia'; // Aqui você coloca o slug do time que quiser buscar os jogos

// Função para buscar os eventos de um time específico
const getTeamEvents = (teamSlug) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'league-of-legends-esports1.p.rapidapi.com',
      port: null,
      path: `/events?teamSlug=${teamSlug}`,
      headers: {
        'x-rapidapi-key': '',
        'x-rapidapi-host': 'league-of-legends-esports1.p.rapidapi.com'
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
          const events = JSON.parse(body.toString());
          resolve(events);
        } catch (error) {
          reject('Erro ao processar resposta de eventos');
        }
      });

      res.on('error', reject);
    });

    req.end();
  });
};

const processGames = async () => {
  try {
    const eventsData = await getTeamEvents(TEAM_SLUG);

    if (!eventsData.events || eventsData.events.length === 0) {
      console.log('Nenhum evento encontrado.');
      return;
    }

    for (const event of eventsData.events) {
      const teams = event.match.teams;
      const leagueName = event.league.name;
      const formattedDate = new Date(event.startTime).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    
      const teamCodes = teams.map(t => t.code).join(' vs ');
    
      console.log(`🏆 Campeonato: ${leagueName}`);
      console.log(`🆚 Adversário: ${teamCodes}`);
      console.log(`🕒 Data e Hora: ${formattedDate}`);
    
      teams.forEach(team => {
        console.log(`🔗 Logo do ${team.code}: ${team.image}`);
      });
    
      console.log('-------------------------');
    }
    

  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
  }
};

processGames();

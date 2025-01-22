if (pathname === '/api/favoritos' && req.method === 'GET') {
  const { pagina = 1, quantidade = 10 } = parsedUrl.query;
  const offset = (pagina - 1) * quantidade;

  console.log(`Buscando favoritos: pagina=${pagina}, quantidade=${quantidade}, offset=${offset}`);

  db.query(
    `SELECT * FROM favoritos LIMIT ? OFFSET ?`,
    [parseInt(quantidade), parseInt(offset)],
    (err, results) => {
      if (err) {
        console.error('Erro ao buscar favoritos:', err.stack);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ erro: true, mensagem: 'Erro ao buscar favoritos' }));
        return;
      }

      console.log('Favoritos encontrados:', results);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ erro: false, favoritos: results }));
    }
  );
}

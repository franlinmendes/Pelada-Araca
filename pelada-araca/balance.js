// Divisão de times equilibrados (nota, resistência, posição, idade)
(function (root) {
  const POS = ['goleiro', 'zagueiro', 'meia', 'atacante'];

  function cost(teams) {
    const n = teams.length;
    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
    const variance = (arr) => { const m = avg(arr); return avg(arr.map(x => (x - m) ** 2)); };
    const notas = teams.map(t => avg(t.map(p => p.nota)));
    const vel = teams.map(t => avg(t.map(p => p.vel)));
    const idade = teams.map(t => avg(t.map(p => p.idade || 0)));
    let c = variance(notas) * 100 + variance(vel) * 20 + variance(idade) * 0.5;
    POS.forEach(pos => {
      c += variance(teams.map(t => t.filter(p => p.pos === pos).length)) * 15;
      // notas médias por posição também parecidas
      c += variance(teams.map(t => avg(t.filter(p => p.pos === pos).map(p => p.nota)))) * 3;
    });
    return c;
  }

  function initial(players, n) {
    const teams = Array.from({ length: n }, () => []);
    POS.forEach(pos => {
      const g = players.filter(p => p.pos === pos).sort((a, b) => b.nota - a.nota + (Math.random() - 0.5));
      g.forEach(p => {
        const sum = t => t.reduce((a, x) => a + x.nota, 0);
        const order = teams.slice().sort((a, b) =>
          a.length - b.length ||
          a.filter(x => x.pos === pos).length - b.filter(x => x.pos === pos).length ||
          sum(a) - sum(b));
        order[0].push(p);
      });
    });
    return teams;
  }

  function balance(players, n) {
    let best = null, bestC = Infinity;
    for (let r = 0; r < 30; r++) {
      let teams = initial(players, n);
      let c = cost(teams);
      for (let i = 0; i < 1500; i++) {
        const a = Math.floor(Math.random() * n), b = Math.floor(Math.random() * n);
        if (a === b || !teams[a].length || !teams[b].length) continue;
        const i1 = Math.floor(Math.random() * teams[a].length), i2 = Math.floor(Math.random() * teams[b].length);
        [teams[a][i1], teams[b][i2]] = [teams[b][i2], teams[a][i1]];
        const c2 = cost(teams);
        if (c2 <= c) c = c2; else [teams[a][i1], teams[b][i2]] = [teams[b][i2], teams[a][i1]];
      }
      if (c < bestC) { bestC = c; best = teams.map(t => t.slice()); }
    }
    return best;
  }
  root.Balance = { balance, cost, POS };
  if (typeof module !== 'undefined') module.exports = root.Balance;
})(typeof window !== 'undefined' ? window : globalThis);

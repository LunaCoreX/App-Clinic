/* APP Clinic — comportamentos da página. O conteúdo funciona sem este arquivo. */
(function () {
  var doc = document.documentElement;
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Menu no celular */
  var botaoMenu = document.querySelector('.menu-abrir');
  var menu = document.getElementById('menu');
  if (botaoMenu && menu) {
    var fechar = function () {
      menu.classList.remove('aberto');
      botaoMenu.setAttribute('aria-expanded', 'false');
      botaoMenu.querySelector('.texto').textContent = 'Menu';
    };
    botaoMenu.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      botaoMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botaoMenu.querySelector('.texto').textContent = aberto ? 'Fechar' : 'Menu';
      if (aberto) { var primeiro = menu.querySelector('a'); if (primeiro) primeiro.focus(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('aberto')) { fechar(); botaoMenu.focus(); }
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) fechar(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 960) fechar(); });
  }

  /* Entrada das partes de cada seção */
  var partes = document.querySelectorAll('.surge');
  if ('IntersectionObserver' in window && !reduz) {
    var obs = new IntersectionObserver(function (itens) {
      itens.forEach(function (it) {
        if (it.isIntersecting) { it.target.classList.add('visivel'); obs.unobserve(it.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    partes.forEach(function (p) { obs.observe(p); });
    setTimeout(function () { partes.forEach(function (p) { if (p.getBoundingClientRect().top < innerHeight) p.classList.add('visivel'); }); }, 1200);
  } else {
    partes.forEach(function (p) { p.classList.add('visivel'); });
  }

  /* Índice com prévia */
  document.querySelectorAll('[data-indice]').forEach(function (bloco) {
    var itens = bloco.querySelectorAll('.indice__item');
    var imagens = bloco.querySelectorAll('.indice__previa img');
    var ativar = function (n) {
      itens.forEach(function (it, i) { it.setAttribute('aria-current', i === n ? 'true' : 'false'); });
      imagens.forEach(function (im, i) { im.classList.toggle('ativa', i === n); });
    };
    itens.forEach(function (it, i) {
      it.addEventListener('mouseenter', function () { ativar(i); });
      it.addEventListener('focus', function () { ativar(i); });
      it.addEventListener('click', function () { ativar(i); });
    });
    ativar(0);
  });

  /* Primeiro atendimento: sanfona */
  document.querySelectorAll('[data-etapas]').forEach(function (grupo) {
    var etapas = grupo.querySelectorAll('.etapa');
    etapas.forEach(function (et) {
      var b = et.querySelector('.etapa__botao');
      b.addEventListener('click', function () {
        etapas.forEach(function (o) {
          var abre = o === et;
          o.classList.toggle('aberta', abre);
          o.querySelector('.etapa__botao').setAttribute('aria-expanded', abre ? 'true' : 'false');
        });
        var t = et.querySelector('.etapa__corpo h3');
        if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
      });
    });
  });

  /* Solicitar avaliação: monta a mensagem para o WhatsApp da unidade escolhida */
  document.querySelectorAll('[data-agendar]').forEach(function (form) {
    var dados = JSON.parse(form.querySelector('script[type="application/json"]').textContent);
    var saida = {
      nome: form.querySelector('[data-unidade-nome]'),
      rua: form.querySelector('[data-unidade-rua]'),
      horario: form.querySelector('[data-unidade-horario]'),
      rota: form.querySelector('[data-unidade-rota]'),
      msg: form.querySelector('[data-mensagem]'),
      enviar: form.querySelector('[data-enviar]')
    };
    var atualizar = function () {
      var u = (form.querySelector('input[name="unidade"]:checked') || {}).value || 'interlagos';
      var area = (form.querySelector('input[name="interesse"]:checked') || {}).value || '';
      var periodo = (form.querySelector('input[name="periodo"]:checked') || {}).value || '';
      var un = dados[u];
      var texto = 'Olá! Vim pelo site e gostaria de solicitar uma avaliação na unidade ' + un.curto + '.';
      if (area) texto += '\nInteresse: ' + area + '.';
      if (periodo) texto += '\nMelhor período para mim: ' + periodo + '.';
      texto += '\nPodem me informar os horários disponíveis?';
      saida.nome.textContent = un.nome;
      saida.rua.textContent = un.endereco;
      saida.horario.textContent = un.horario;
      saida.rota.href = un.rota;
      saida.msg.textContent = texto;
      saida.enviar.href = 'https://wa.me/' + un.whatsapp + '?text=' + encodeURIComponent(texto);
    };
    form.addEventListener('change', atualizar);
    form.addEventListener('submit', function (e) { e.preventDefault(); window.open(saida.enviar.href, '_blank', 'noopener'); });
    atualizar();
  });

  /* Comparação de antes e depois com controle deslizante (usado quando houver casos autorizados) */
  document.querySelectorAll('[data-comparar]').forEach(function (c) {
    var faixa = c.querySelector('input[type="range"]');
    var depois = c.querySelector('.comparar__depois');
    var aplicar = function () { depois.style.clipPath = 'inset(0 0 0 ' + faixa.value + '%)'; };
    faixa.addEventListener('input', aplicar);
    aplicar();
  });

  doc.classList.add('pronto');
})();

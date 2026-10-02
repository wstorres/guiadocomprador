/**
 * Guia do Comprador - Script de Retenção de Visitantes & Histórico Local
 */
(function() {
  // 1. Gravar Cookie de Visitante Recorrente (duração 365 dias)
  var d = new Date();
  d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = "gdc_visitante=1;" + expires + ";path=/;SameSite=Lax";

  // 2. Gravar Página Atual no Histórico Local
  try {
    var pathname = window.location.pathname;
    var pageTitle = document.title.split(':')[0].split('|')[0].trim();
    
    // Identifica se é página de artigo/comparativo
    if (pathname.indexOf('/purificadores/') !== -1 || document.querySelector('.guia-wrap')) {
      var historico = JSON.parse(localStorage.getItem('gdc_artigos_vistos') || '[]');
      
      // Remove duplicada se já existir
      historico = historico.filter(function(item) {
        return item.url !== pathname;
      });
      
      // Adiciona a página atual no início
      historico.unshift({
        titulo: pageTitle,
        url: pathname,
        data: new Date().toLocaleDateString('pt-BR')
      });
      
      // Mantém no máximo os últimos 5 artigos
      if (historico.length > 5) {
        historico = historico.slice(0, 5);
      }
      localStorage.setItem('gdc_artigos_vistos', JSON.stringify(historico));
    }

    // 3. Renderizar artigos vistos recentemente na página inicial ou onde houver o container
    var containerRecentes = document.getElementById('box-historico-visitante');
    if (containerRecentes) {
      var salvos = JSON.parse(localStorage.getItem('gdc_artigos_vistos') || '[]');
      if (salvos.length > 0) {
        var html = '<h3>🕒 Você já consultou recentemente:</h3><div class="lista-recentes-chips">';
        salvos.forEach(function(item) {
          html += '<a class="chip-recente" href="' + item.url + '">📌 ' + item.titulo + '</a>';
        });
        html += '</div>';
        containerRecentes.innerHTML = html;
        containerRecentes.style.display = 'block';
      }
    }
  } catch(e) {
    // Modo anônimo / restrições de storage tratadas silenciosamente
  }

  // 4. Ação do Botão Salvar nos Favoritos
  window.salvarNosFavoritos = function(titulo, url) {
    url = url || window.location.href;
    titulo = titulo || document.title;

    if (navigator.share && /mobile/i.test(navigator.userAgent)) {
      navigator.share({
        title: titulo,
        url: url
      }).catch(function() {});
    } else {
      var isMac = /Mac/i.test(navigator.platform);
      var atalho = isMac ? 'Cmd + D' : 'Ctrl + D';
      alert('⭐ Para não perder esta página e consultar os preços depois:\n\nPressione ' + atalho + ' no seu teclado (ou clique na estrela da barra de endereço) para salvar nos Favoritos!');
    }
  };

  // 5. Ativação suave da barra Sticky CTA no Mobile após rolar 320px
  document.addEventListener('DOMContentLoaded', function() {
    var stickyBar = document.getElementById('stickyCtaMobile');
    if (stickyBar) {
      var checkScroll = function() {
        if (window.scrollY > 320) {
          stickyBar.classList.add('visible');
        } else {
          stickyBar.classList.remove('visible');
        }
      };
      window.addEventListener('scroll', checkScroll, { passive: true });
      checkScroll();
    }
  });
})();

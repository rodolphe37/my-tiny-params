// Mesure d'audience MyAnalyticsPro (outil de l'éditeur) pour le site mytinyparams.netlify.app (jamais les URLs saisies) : prépare la file d'attente et
// l'identifiant du site avant l'arrivée du script extérieur (https://my-analytics-project.netlify.app/analytics.js, chargé en « async »
// juste après). Fichier séparé, comme sur les autres sites de l'éditeur. Rien n'est envoyé avant que
// le visiteur ait cliqué « Accepter » dans la bannière de l'outil ; les pages suivantes (navigation sans rechargement) sont comptées par l'outil.
(function () {
  window.analyticsPro =
    window.analyticsPro ||
    function () {
      (window.analyticsPro.q = window.analyticsPro.q || []).push(arguments);
    };
  window.analyticsPro('init', 'AW-MJQ3QG4GH');

  // « Changer mon choix » (mentions légales) : oublie le choix enregistré, puis recharge la page pour reposer la question.
  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!(target instanceof Element) || !target.closest('[data-audience-reset]')) return;
    document.cookie = 'analytics_consent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax';
    window.location.reload();
  });
})();

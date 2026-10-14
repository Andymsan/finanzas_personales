/* Apariencia: modo claro / oscuro / automático + modo daltonismo.
   Reutilizable: copia este archivo a cualquier página y agrega en <head>:
     <script src="apariencia.js"></script>
   Pon un botón con onclick="Apariencia.abrir(this)".
   El módulo solo pone data-tema="claro|oscuro" y data-dalto en <html>;
   cada página define sus colores con :root[data-tema="oscuro"] y :root[data-dalto]. */
(function () {
  var KEY = 'apariencia-prefs';
  var p = { tema: 'auto', dalto: false };
  try {
    var g = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (g.tema) p.tema = g.tema;
    p.dalto = !!g.dalto;
  } catch (e) {}
  var mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;

  function efectivo() { return p.tema === 'auto' ? (mq && mq.matches ? 'oscuro' : 'claro') : p.tema; }

  function marcarUI() {
    var pop = document.getElementById('ap-pop');
    if (!pop) return;
    pop.querySelectorAll('.ap-seg button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-v') === p.tema); });
    var c = pop.querySelector('#ap-dalto');
    if (c) c.checked = p.dalto;
  }

  function aplicar(avisar) {
    var r = document.documentElement;
    r.setAttribute('data-tema', efectivo());
    if (p.dalto) r.setAttribute('data-dalto', ''); else r.removeAttribute('data-dalto');
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
    marcarUI();
    if (avisar) window.dispatchEvent(new CustomEvent('apariencia', { detail: { tema: efectivo(), dalto: p.dalto } }));
  }

  var css = '#ap-pop{position:fixed;z-index:1100;width:256px;background:var(--card,#fff);color:var(--ink,#222);border:1px solid var(--line,#ddd);border-radius:14px;padding:14px;box-shadow:0 12px 40px rgba(0,0,0,.3);font:13px/1.4 var(--fb,system-ui,sans-serif);display:none}' +
    '#ap-pop.on{display:block}' +
    '#ap-pop .ap-t{font-weight:600;margin-bottom:4px;font-size:14px}' +
    '#ap-pop .ap-l{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted,#888);margin:10px 0 6px}' +
    '#ap-pop .ap-seg{display:flex;gap:4px}' +
    '#ap-pop .ap-seg button{flex:1;padding:8px 4px;border:1.5px solid var(--line,#ddd);background:transparent;color:inherit;border-radius:9px;font:inherit;font-weight:600;cursor:pointer}' +
    '#ap-pop .ap-seg button.on{background:var(--ap-on,#5c5480);color:#fff;border-color:transparent}' +
    '#ap-pop .ap-sw{display:flex;gap:10px;align-items:flex-start;cursor:pointer}' +
    '#ap-pop .ap-sw input{margin-top:2px;width:18px;height:18px;accent-color:var(--ap-on,#5c5480);flex:none}' +
    '#ap-pop .ap-sw small{display:block;color:var(--muted,#888);font-size:11.5px;line-height:1.35;margin-top:2px}';

  function crear() {
    if (document.getElementById('ap-pop')) return;
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
    var pop = document.createElement('div');
    pop.id = 'ap-pop';
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-label', 'Apariencia');
    pop.innerHTML =
      '<div class="ap-t">Apariencia</div>' +
      '<div class="ap-l">Tema</div>' +
      '<div class="ap-seg"><button type="button" data-v="claro">&#9728; Claro</button><button type="button" data-v="oscuro">&#9790; Oscuro</button><button type="button" data-v="auto">Auto</button></div>' +
      '<div class="ap-l">Accesibilidad</div>' +
      '<label class="ap-sw"><input type="checkbox" id="ap-dalto"><span>Modo daltonismo<small>Cambia rojo/verde por azul/naranja y agrega patrones y símbolos para no depender solo del color.</small></span></label>';
    document.body.appendChild(pop);
    pop.querySelectorAll('.ap-seg button').forEach(function (b) {
      b.addEventListener('click', function () { p.tema = b.getAttribute('data-v'); aplicar(true); });
    });
    pop.querySelector('#ap-dalto').addEventListener('change', function (e) { p.dalto = e.target.checked; aplicar(true); });
    document.addEventListener('click', function (e) {
      if (pop.classList.contains('on') && !pop.contains(e.target) && !(e.target.closest && e.target.closest('[data-ap-btn]'))) pop.classList.remove('on');
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') pop.classList.remove('on'); });
    marcarUI();
  }

  function abrir(btn) {
    crear();
    var pop = document.getElementById('ap-pop');
    if (btn) btn.setAttribute('data-ap-btn', '');
    if (pop.classList.contains('on')) { pop.classList.remove('on'); return; }
    pop.classList.add('on');
    marcarUI();
    if (btn) {
      var r = btn.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
      var top = r.top - h - 8;
      if (top < 8) top = r.bottom + 8;
      var left = Math.min(Math.max(8, r.left), innerWidth - w - 8);
      pop.style.top = top + 'px';
      pop.style.left = left + 'px';
    }
  }

  if (mq) {
    var onChange = function () { if (p.tema === 'auto') aplicar(true); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
  }

  // por si el navegador no avisa el cambio del sistema: se revisa al volver a la pestaña
  function revisar() {
    if (p.tema === 'auto' && document.documentElement.getAttribute('data-tema') !== efectivo()) aplicar(true);
  }
  document.addEventListener('visibilitychange', revisar);
  window.addEventListener('focus', revisar);

  aplicar(false);
  window.Apariencia = {
    abrir: abrir,
    estado: function () { return { tema: p.tema, efectivo: efectivo(), dalto: p.dalto }; },
    setTema: function (t) { p.tema = t; aplicar(true); },
    setDalto: function (v) { p.dalto = !!v; aplicar(true); }
  };
})();

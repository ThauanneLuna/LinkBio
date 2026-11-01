(function () {
  var root = document.documentElement;
  root.classList.add("js");

  // Ano no rodapé
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Loader
  window.addEventListener("load", function () {
    setTimeout(function () {
      var l = document.getElementById("loader");
      if (l) { l.classList.add("hide"); setTimeout(function () { l.remove(); }, 600); }
    }, 500);
  });

  // Toast
  var toastEl = document.getElementById("toast"), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    var ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    ta.remove();
    return Promise.resolve();
  }

  document.getElementById("btn-copy").addEventListener("click", function () {
    copyText(location.href).then(function () { toast("Link copiado!"); });
  });
  document.getElementById("btn-share").addEventListener("click", function () {
    if (navigator.share) {
      navigator.share({ title: "Thau Luna Studio", url: location.href }).catch(function () {});
    } else {
      copyText(location.href).then(function () { toast("Link copiado!"); });
    }
  });

  // Tema claro/escuro
  document.getElementById("btn-theme").addEventListener("click", function () {
    var dark = root.classList.toggle("dark");
    try { localStorage.setItem("tls-theme", dark ? "dark" : "light"); } catch (e) {}
  });

  // Animação ao rolar
  var els = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("in"); });
  }

  // Carrossel de depoimentos
  var car = document.getElementById("carousel");
  function step(dir) {
    var slide = car.querySelector(".slide");
    var w = slide.getBoundingClientRect().width + 16;
    var atEnd = car.scrollLeft + car.clientWidth >= car.scrollWidth - 4;
    if (dir > 0 && atEnd) car.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir < 0 && car.scrollLeft <= 4) car.scrollTo({ left: car.scrollWidth, behavior: "smooth" });
    else car.scrollBy({ left: dir * w, behavior: "smooth" });
  }
  document.getElementById("car-prev").addEventListener("click", function () { step(-1); });
  document.getElementById("car-next").addEventListener("click", function () { step(1); });

  // Voltar ao topo
  var top = document.getElementById("totop");
  window.addEventListener("scroll", function () {
    top.classList.toggle("show", window.scrollY > 400);
  }, { passive: true });
  top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
})();

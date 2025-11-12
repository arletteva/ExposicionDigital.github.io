(function(){

  // =======================
  // Variables y referencias
  // =======================
  const thumbs = Array.from(document.querySelectorAll('.thumb'));
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const playAudio = document.getElementById('playAudio');
  const pauseAudio = document.getElementById('pauseAudio');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const closeBtn = document.getElementById('closeBtn');

  let currentIndex = 0;
  let currentGallery = []; // ✅ ahora guardamos solo las imágenes de la sección activa
  let audio = new Audio();

  // =======================
  // Funciones Modal
  // =======================
  function openModal(i, gallery){
    currentGallery = gallery || currentGallery; // si se pasa una galería nueva, la usamos
    const t = currentGallery[i];
    if(!t) return;
    currentIndex = i;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    modalImg.src = t.querySelector('img').getAttribute('src');
    modalImg.alt = t.querySelector('img').alt || '';
    modalTitle.textContent = t.dataset.title || '';
    modalDesc.textContent = t.dataset.desc || '';
    audio.src = t.dataset.audio || '';
    audio.pause();
  }

  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    audio.pause();
  }

  function navigate(dir){
    let next = currentIndex + dir;
    if(next < 0) next = currentGallery.length - 1;
    if(next >= currentGallery.length) next = 0;
    openModal(next);
  }

  // =======================
  // Abrir modal por sección
  // =======================
  const galleries = document.querySelectorAll('.gallery');
  galleries.forEach(gallery => {
    const thumbsInGallery = Array.from(gallery.querySelectorAll('.thumb'));
    thumbsInGallery.forEach((t, i)=>{
      t.addEventListener('click', ()=> openModal(i, thumbsInGallery));
      t.addEventListener('keypress', (e)=>{ if(e.key === 'Enter') openModal(i, thumbsInGallery) });
    });
  });

  // =======================
  // Botones de control
  // =======================
  closeBtn.addEventListener('click', closeModal);
  prevBtn.addEventListener('click', ()=> navigate(-1));
  nextBtn.addEventListener('click', ()=> navigate(1));
  playAudio.addEventListener('click', ()=> audio.play());
  pauseAudio.addEventListener('click', ()=> audio.pause());

  // =======================
  // Cambiar imágenes con flechas del teclado
  // =======================
  document.addEventListener('keydown', (e) => {
    if (modal.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'Escape') closeModal();
    }
  });

  // =======================
  // Navegación de secciones
  // =======================
  Array.from(document.querySelectorAll('[data-goto]')).forEach(b=>{
    b.addEventListener('click', ()=>{
      const target = document.getElementById(b.dataset.goto);
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  // =======================
  // Fade-in al hacer scroll
  // =======================
  const faders = Array.from(document.querySelectorAll('.section, .intro'));
  const appearOptions = {threshold: 0.1, rootMargin: '0px 0px -50px 0px'};
  const appearOnScroll = new IntersectionObserver(function(entries, observer){
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  faders.forEach(fader=> appearOnScroll.observe(fader));

  // =======================
  // Comentarios con Google Sheets
  // =======================
  const submitComment = document.getElementById('submitComment');
  const commentText = document.getElementById('commentText');

  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxwXeuKVr1nalulYvYbYWHeiy4b0ZQinG_AnQkut-P6q7qQZjA1u06lzk00e6cT3ZwV9Q/exec';

  submitComment.addEventListener('click', () => {
    const text = commentText.value.trim();
    if (!text) return alert('Escribe algo.');

    fetch(SHEET_URL, {
      method: 'POST',
      body: JSON.stringify({ user: 'Investigador', comment: text }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        if (data.result === 'ok') {
          alert('Comentario enviado!');
          commentText.value = '';
        } else {
          alert('Error al enviar comentario: ' + data.message);
        }
      })
      .catch(err => {
        console.error('Error:', err);
        alert('Error al enviar comentario.');
      });
  });

})();

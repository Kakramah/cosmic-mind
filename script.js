/* ═══════════════════════════════════════
   STARFIELD ENGINE WITH PARALLAX & METEORS
   ═══════════════════════════════════════ */
(function initStarfield() {
  var canvas = document.getElementById('starfield');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var stars = [];
  var meteors = [];
  var width, height;
  var STAR_COUNT = 320;
  var mouseX = 0, mouseY = 0;
  var targetMouseX = 0, targetMouseY = 0;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        radius: Math.random() * 1.4 + 0.2,
        layer: Math.random() * 2 + 1, // depth layer for parallax
        alpha: Math.random() * 0.5 + 0.2,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.002 + 0.0008,
        isGold: Math.random() > 0.86
      });
    }
  }

  function spawnMeteor() {
    if (prefersReducedMotion) return;
    if (meteors.length < 2 && Math.random() < 0.015) {
      meteors.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.4),
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        alpha: 1
      });
    }
  }

  var time = 0;
  function draw() {
    ctx.clearRect(0, 0, width, height);
    time++;

    // Smooth mouse inertia
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var twinkle = prefersReducedMotion ? 1 : Math.sin(time * s.twinkleSpeed + s.phase) * 0.35 + 0.65;
      var a = s.alpha * twinkle;

      // Parallax shift
      var px = s.baseX + mouseX * s.layer * 0.02;
      var py = s.baseY + mouseY * s.layer * 0.02;

      ctx.beginPath();
      ctx.arc(px, py, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.isGold
        ? 'hsla(38, 50%, 70%, ' + a + ')'
        : 'rgba(224, 220, 212, ' + a + ')';
      ctx.fill();

      if (s.radius > 1.1) {
        ctx.beginPath();
        ctx.arc(px, py, s.radius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201, 165, 87, ' + (a * 0.06) + ')';
        ctx.fill();
      }
    }

    // Draw meteors
    spawnMeteor();
    for (var m = meteors.length - 1; m >= 0; m--) {
      var met = meteors[m];
      var endX = met.x - Math.cos(met.angle) * met.length;
      var endY = met.y - Math.sin(met.angle) * met.length;

      var grad = ctx.createLinearGradient(met.x, met.y, endX, endY);
      grad.addColorStop(0, 'rgba(255, 255, 255, ' + met.alpha + ')');
      grad.addColorStop(0.3, 'rgba(201, 165, 87, ' + (met.alpha * 0.6) + ')');
      grad.addColorStop(1, 'rgba(201, 165, 87, 0)');

      ctx.beginPath();
      ctx.moveTo(met.x, met.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      met.x += Math.cos(met.angle) * met.speed;
      met.y += Math.sin(met.angle) * met.speed;
      met.alpha -= 0.015;

      if (met.alpha <= 0 || met.x > width || met.y > height) {
        meteors.splice(m, 1);
      }
    }

    if (!prefersReducedMotion) {
      requestAnimationFrame(draw);
    }
  }

  window.addEventListener('mousemove', function(e) {
    targetMouseX = (e.clientX - width / 2);
    targetMouseY = (e.clientY - height / 2);
  }, { passive: true });

  resize();
  createStars();
  draw();

  window.addEventListener('resize', function() {
    resize();
    createStars();
    if (prefersReducedMotion) draw();
  });
})();

/* ═══════════════════════════════════════
   SPOTLIGHT CURSOR (§5.6)
   ═══════════════════════════════════════ */
(function initSpotlight() {
  var cursor = document.getElementById('spotlightCursor');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!cursor || prefersReducedMotion || window.innerWidth < 820) return;

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var currentX = mouseX;
  var currentY = mouseY;

  window.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function render() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;
    cursor.style.left = currentX + 'px';
    cursor.style.top = currentY + 'px';
    requestAnimationFrame(render);
  }
  render();
})();

/* ═══════════════════════════════════════
   3D TILT EFFECT ON CARDS (§8.3)
   ═══════════════════════════════════════ */
(function initTilt() {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || window.innerWidth < 820) return;

  var cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(function(card) {
    var sheen = card.querySelector('.figure-sheen');

    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;

      var rotateX = ((y - centerY) / centerY) * -6;
      var rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = 'perspective(900px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-4px)';

      if (sheen) {
        sheen.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(201, 165, 87, 0.18) 0%, transparent 65%)';
      }
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
      if (sheen) {
        sheen.style.background = '';
      }
    });
  });
})();

/* ═══════════════════════════════════════
   STAT NUMBERS COUNTER (§8.4)
   ═══════════════════════════════════════ */
(function initCounters() {
  var counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var targetStr = el.getAttribute('data-target');
        var target = parseFloat(targetStr);
        if (isNaN(target)) return;

        if (prefersReducedMotion) {
          el.textContent = target.toLocaleString('ar-EG');
          return;
        }

        var start = 0;
        var duration = 1400;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var current = Math.floor(progress * target);
          el.textContent = current.toLocaleString('ar-EG');
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target.toLocaleString('ar-EG');
          }
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(function(el) { observer.observe(el); });
})();

/* ═══════════════════════════════════════
   AMBIENT COSMIC SOUNDSCAPE (Web Audio API §8.3)
   ═══════════════════════════════════════ */
(function initAudio() {
  var btn = document.getElementById('audioBtn');
  if (!btn) return;
  var audioCtx = null;
  var isPlaying = false;
  var gainNode = null;
  var osc1 = null, osc2 = null, osc3 = null;

  var iconOff = btn.querySelector('.audio-icon--off');
  var iconOn = btn.querySelector('.audio-icon--on');

  function startDrone() {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 3);

    var filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, audioCtx.currentTime);

    // Deep harmonic frequencies (55Hz, 110Hz, 165Hz)
    osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

    osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(110, audioCtx.currentTime);

    osc3 = audioCtx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(165, audioCtx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    osc3.start();

    isPlaying = true;
    btn.classList.add('is-active');
    if (iconOff) iconOff.hidden = true;
    if (iconOn) iconOn.hidden = false;
  }

  function stopDrone() {
    if (!gainNode || !audioCtx) return;
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
    setTimeout(function() {
      try {
        if (osc1) osc1.stop();
        if (osc2) osc2.stop();
        if (osc3) osc3.stop();
      } catch (e) {}
      isPlaying = false;
      btn.classList.remove('is-active');
      if (iconOff) iconOff.hidden = false;
      if (iconOn) iconOn.hidden = true;
    }, 1500);
  }

  btn.addEventListener('click', function() {
    if (!isPlaying) {
      startDrone();
    } else {
      stopDrone();
    }
  });
})();

/* ═══════════════════════════════════════
   SCROLL REVEAL (§5.5.4 · §8.3)
   ═══════════════════════════════════════ */
(function initReveal() {
  var reveals = document.querySelectorAll('.reveal');
  var quoteGlow = document.getElementById('quoteGlow');

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(function(el) { observer.observe(el); });

  var quoteSection = document.getElementById('scene-quote');
  if (quoteSection && quoteGlow) {
    var quoteObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          setTimeout(function() { quoteGlow.classList.add('is-active'); }, 600);
        }
      });
    }, { threshold: 0.35 });
    quoteObserver.observe(quoteSection);
  }
})();

/* ═══════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════ */
(function initProgress() {
  var bar = document.getElementById('progressBar');
  if (!bar) return;

  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        var scrollY = window.scrollY;
        var maxScroll = document.body.scrollHeight - window.innerHeight;
        var progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
        bar.style.width = progress + '%';
        ticking = false;
      });
      ticking = true;
    }
  });
})();

/* ═══════════════════════════════════════
   PARALLAX & SCROLL HINT FADE
   ═══════════════════════════════════════ */
(function initParallax() {
  var nebula = document.querySelector('.nebula');
  var hint = document.querySelector('.scroll-hint');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        var scrollY = window.scrollY;
        var maxScroll = document.body.scrollHeight - window.innerHeight;
        var progress = maxScroll > 0 ? scrollY / maxScroll : 0;

        if (nebula) {
          nebula.style.transform = 'translateY(' + (progress * -50) + 'px)';
        }

        if (hint) {
          hint.style.opacity = Math.max(0, 1 - scrollY / 200);
        }

        ticking = false;
      });
      ticking = true;
    }
  });
})();

/* ═══════════════════════════════════════
   LIGHTBOX (§8.3ب)
   ═══════════════════════════════════════ */
(function initLightbox() {
  var modal = document.getElementById('lightboxModal');
  var backdrop = document.getElementById('lightboxBackdrop');
  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');
  var imgEl = document.getElementById('lightboxImg');
  var titleEl = document.getElementById('lightboxTitle');
  var descEl = document.getElementById('lightboxDesc');
  var triggers = Array.prototype.slice.call(document.querySelectorAll('.lightbox-trigger'));

  if (!modal || !triggers.length) return;

  var currentIndex = 0;

  function updateLightbox(index) {
    if (index < 0) index = triggers.length - 1;
    if (index >= triggers.length) index = 0;
    currentIndex = index;

    var target = triggers[currentIndex];
    var src = target.getAttribute('src');
    var alt = target.getAttribute('alt') || '';
    var title = target.getAttribute('data-title') || '';
    var desc = target.getAttribute('data-desc') || '';

    imgEl.src = src;
    imgEl.alt = alt;
    titleEl.textContent = title;
    descEl.textContent = desc;
  }

  function openLightbox(index) {
    updateLightbox(index);
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
    document.body.style.overflow = '';
  }

  triggers.forEach(function(el, i) {
    el.addEventListener('click', function() {
      openLightbox(i);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  // In Arabic RTL: ArrowRight = previous, ArrowLeft = next
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      updateLightbox(currentIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      updateLightbox(currentIndex + 1);
    });
  }

  document.addEventListener('keydown', function(e) {
    var isOpen = modal.hasAttribute('open');
    if (!isOpen) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      updateLightbox(currentIndex - 1);
    } else if (e.key === 'ArrowLeft') {
      updateLightbox(currentIndex + 1);
    }
  });
})();

/* ═══════════════════════════════════════
   SHARE (§8.6)
   ═══════════════════════════════════════ */
(function initShare() {
  var shareBtn = document.getElementById('shareBtn');
  var shareFallback = document.getElementById('shareFallback');
  var shareCopy = document.getElementById('shareCopy');
  var shareConfirm = document.getElementById('shareConfirm');
  if (!shareBtn) return;

  var title = document.title;
  var url = window.location.href;
  var text = title + '\n' + url;

  var wa = document.getElementById('shareWhatsapp');
  var tg = document.getElementById('shareTelegram');
  var xBtn = document.getElementById('shareX');
  var fb = document.getElementById('shareFacebook');

  if (wa) wa.href = 'https://wa.me/?text=' + encodeURIComponent(text);
  if (tg) tg.href = 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title);
  if (xBtn) xBtn.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
  if (fb) fb.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);

  shareBtn.addEventListener('click', function() {
    if (navigator.share) {
      navigator.share({ title: title, url: url }).catch(function() {});
    } else {
      shareFallback.hidden = !shareFallback.hidden;
    }
  });

  if (shareCopy) {
    shareCopy.addEventListener('click', function() {
      navigator.clipboard.writeText(url).then(function() {
        if (shareConfirm) {
          shareConfirm.hidden = false;
          setTimeout(function() { shareConfirm.hidden = true; }, 2000);
        }
      }).catch(function() {});
    });
  }
})();

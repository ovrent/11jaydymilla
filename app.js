/**
 * JAYDYMILLA — OFFICIAL ARTIST DIGITAL PLATFORM
 * High-Performance Master Engine
 * 
 * Includes:
 * 1. Lenis Smooth Scroll Engine (Unified Single-RAF)
 * 2. 3D Rotating Cylinder Video Scrubber (Critically Damped Harmonic Oscillator)
 * 3. Dual-Layer Interactive Image Reveal (0.12 Organic Lerp Cursor Mask)
 * 4. Opposing Scroll-Driven Marquee
 * 5. Persistent Audio Dock & Release Catalog Player (Authentic Audio Previews)
 * 6. Dynamic Header Lifecycle & Mobile Navigation Drawer
 * 7. Professional Inquiry Form & Modal Controller
 */

(function() {
  'use strict';

  // =========================================================================
  // 1. LENIS SMOOTH SCROLL ENGINE
  // =========================================================================
  let lenis = null;
  let lastScrollY = window.scrollY;

  function initSmoothScroll() {
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false // 100% native mobile touch response
      });
      window.lenis = lenis;
    }

    // Intercept in-page anchor links for smooth scrolling with offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          closeMobileDrawer();
          if (lenis) {
            lenis.scrollTo(target, { offset: -70, duration: 1.2 });
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  // =========================================================================
  // 2. 3D ROTATING CYLINDER VIDEO SCRUBBER
  // Damped scroll progress mapped to video playback position
  // =========================================================================
  let cylinderVideo = null;
  let cylinderTrack = null;
  let cylinderScaler = null;

  let targetProgress = 0.0;
  let currentProgress = 0.0;
  let currentVelocity = 0.0;

  // Zero-Race Seek Engine State
  let pendingSeekTime = null;
  let videoDuration = 0;

  const omega = 20.0; // Responsive critically damped spring frequency (immediate rotation with smooth inertia)

  let isDecoderPrimed = false;

  function primeVideoDecoder() {
    if (!cylinderVideo || isDecoderPrimed) return;
    try {
      const playPromise = cylinderVideo.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isDecoderPrimed = true;
          cylinderVideo.pause();
          if (cylinderVideo.duration && !isNaN(cylinderVideo.duration)) {
            videoDuration = cylinderVideo.duration;
          }
          if (pendingSeekTime !== null) {
            const nextTime = pendingSeekTime;
            pendingSeekTime = null;
            executeSeek(nextTime);
          }
        }).catch(() => {
          // Handled gracefully on first user interaction
        });
      }
    } catch (e) {}
  }

  function initCylinderMotion() {
    cylinderTrack = document.getElementById('cinematic-motion');
    cylinderVideo = document.getElementById('cylinder-video-element');
    cylinderScaler = document.getElementById('motion-cylinder-scaler');

    if (!cylinderTrack || !cylinderVideo) return;

    // Remove poster immediately once loaded to prevent iOS Safari flashing poster on backward seeks
    const clearPoster = () => {
      if (cylinderVideo && cylinderVideo.hasAttribute('poster')) {
        cylinderVideo.removeAttribute('poster');
      }
    };
    cylinderVideo.addEventListener('loadeddata', clearPoster, { once: true });
    cylinderVideo.addEventListener('canplay', clearPoster, { once: true });
    cylinderVideo.addEventListener('timeupdate', clearPoster, { once: true });
    cylinderVideo.addEventListener('seeked', clearPoster, { once: true });

    // Mobile WebKit / Android decoder warmup on first user gesture
    const unlockDecoder = () => {
      primeVideoDecoder();
      window.removeEventListener('touchstart', unlockDecoder);
      window.removeEventListener('scroll', unlockDecoder, { capture: true });
      window.removeEventListener('pointerdown', unlockDecoder);
    };
    window.addEventListener('touchstart', unlockDecoder, { passive: true, once: true });
    window.addEventListener('scroll', unlockDecoder, { passive: true, capture: true, once: true });
    window.addEventListener('pointerdown', unlockDecoder, { passive: true, once: true });

    // Ensure video initiates loading pipeline
    try {
      cylinderVideo.load();
      primeVideoDecoder();
    } catch (e) {}

    const setInitialState = () => {
      if (cylinderVideo.duration && !isNaN(cylinderVideo.duration)) {
        videoDuration = cylinderVideo.duration;
      }
      if (cylinderVideo.currentTime < 0.001) {
        try {
          cylinderVideo.currentTime = 0.001;
        } catch (e) {}
      }
    };

    if (cylinderVideo.readyState >= 1) {
      setInitialState();
    } else {
      cylinderVideo.addEventListener('loadedmetadata', setInitialState, { once: true });
    }

    const onDataReady = () => {
      if (cylinderVideo.duration && !isNaN(cylinderVideo.duration)) {
        videoDuration = cylinderVideo.duration;
      }
      if (pendingSeekTime !== null) {
        const nextTime = pendingSeekTime;
        pendingSeekTime = null;
        executeSeek(nextTime);
      }
    };

    cylinderVideo.addEventListener('loadeddata', onDataReady);
    cylinderVideo.addEventListener('canplay', onDataReady);

    // Native Zero-Race Seek Queue: Seamless, instant rotation on scroll
    cylinderVideo.addEventListener('seeked', () => {
      clearPoster();
      if (pendingSeekTime !== null) {
        const nextTime = pendingSeekTime;
        pendingSeekTime = null;
        if (Math.abs(cylinderVideo.currentTime - nextTime) >= 0.016) {
          try {
            cylinderVideo.currentTime = nextTime;
          } catch (e) {
            pendingSeekTime = nextTime;
          }
        }
      }
    });

    // Immediate initial stage positioning (prevents first-tick layout shift)
    if (cylinderScaler) {
      const windowWidth = window.innerWidth;
      const baseScale = windowWidth < 640 ? 1.38 : (windowWidth < 1024 ? 1.62 : 1.90);
      const initialAngle = (targetProgress - 0.5) * 8;
      cylinderScaler.style.transform = `scale(${baseScale}) rotateY(${initialAngle.toFixed(2)}deg) translateZ(0)`;
    }
  }

  function executeSeek(time) {
    if (!cylinderVideo) return;
    // Allow seek once metadata (readyState >= 1) is ready
    if (cylinderVideo.readyState < 1) {
      pendingSeekTime = time;
      if (!isDecoderPrimed) primeVideoDecoder();
      return;
    }
    // Skip if difference is negligible (< 16ms, ~half frame)
    if (Math.abs(cylinderVideo.currentTime - time) < 0.016) return;
    
    // If native hardware decoder is currently seeking, queue up latest target time
    if (cylinderVideo.seeking) {
      pendingSeekTime = time;
      return;
    }
    try {
      cylinderVideo.currentTime = time;
    } catch (err) {
      pendingSeekTime = time;
    }
  }

  function updateCylinderScroll() {
    if (!cylinderTrack) return;
    const rect = cylinderTrack.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const trackHeight = cylinderTrack.offsetHeight;
    const scrollDistance = trackHeight - viewportHeight;

    if (scrollDistance <= 0) return;

    // Progress = (ScrollY - SectionTop) / (SectionHeight - ViewportHeight)
    const scrolledInside = -rect.top;
    const rawProgress = scrolledInside / scrollDistance;
    targetProgress = Math.max(0.0, Math.min(1.0, rawProgress));
  }

  function updateCylinderPhysics(dt) {
    if (!cylinderVideo) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      currentProgress = targetProgress;
      currentVelocity = 0.0;
    } else {
      // Critically Damped Harmonic Oscillator (zeta = 1.0, omega = 17.0)
      const safeDt = Math.min(dt, 0.033);
      const f = 1.0 + 2.0 * safeDt * omega;
      const oo = omega * omega;
      const hoo = safeDt * oo;
      const hhoo = safeDt * hoo;
      const detInv = 1.0 / (f + hhoo);
      const detDiff = targetProgress - currentProgress;

      currentProgress = (f * currentProgress + safeDt * currentVelocity + hhoo * targetProgress) * detInv;
      currentVelocity = (currentVelocity + hoo * detDiff) * detInv;
    }

    // Map progress to video seek time
    const dur = (cylinderVideo && cylinderVideo.duration && !isNaN(cylinderVideo.duration)) ? cylinderVideo.duration : videoDuration;
    if (dur > 0) {
      const targetTime = Math.max(0.001, Math.min(dur - 0.01, currentProgress * dur));
      executeSeek(targetTime);
    }

    // Apply subtle spatial stage tilt in sync with progress (Heroic cinematic scaling)
    if (cylinderScaler) {
      const angle = (currentProgress - 0.5) * 8; // Gentle 3D perspective orientation
      const windowWidth = window.innerWidth;
      const baseScale = windowWidth < 640 ? 1.38 : (windowWidth < 1024 ? 1.62 : 1.90);
      cylinderScaler.style.transform = `scale(${baseScale}) rotateY(${angle.toFixed(2)}deg) translateZ(0)`;
    }
  }

  // =========================================================================
  // 3. DUAL-LAYER INTERACTIVE IMAGE REVEAL
  // Fine-Pointer Responsive Fluid Discovery Mask (60 FPS Single-RAF Physics)
  // =========================================================================
  let revealContainer = null;
  let revealMask = null;
  let revealDiscoveredImg = null;

  let revealTargetX = 50.0;
  let revealTargetY = 50.0;
  let revealCurrentX = 50.0;
  let revealCurrentY = 50.0;

  let revealCurrentRadius = 0.0;
  let revealCurrentOpacity = 0.0;

  let isHoveringReveal = false;
  let isRevealActive = false;
  let containerRect = null;
  let baseRevealRadius = 220;

  // Mobile / Tablet Touch Hold-To-Explore State
  let holdTimer = null;
  let isTouchExploring = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let activePointerId = null;
  const HOLD_DURATION_MS = 150;
  const MOVE_TOLERANCE_PX = 10;

  function updateCoordinates(clientX, clientY) {
    if (!containerRect || containerRect.width === 0) {
      if (revealContainer) containerRect = revealContainer.getBoundingClientRect();
    }
    if (containerRect && containerRect.width > 0 && containerRect.height > 0) {
      revealTargetX = Math.max(0, Math.min(100, ((clientX - containerRect.left) / containerRect.width) * 100));
      revealTargetY = Math.max(0, Math.min(100, ((clientY - containerRect.top) / containerRect.height) * 100));
    }
  }

  function initImageReveal() {
    revealContainer = document.getElementById('producer-reveal-container');
    revealMask = document.getElementById('reveal-mask');
    revealDiscoveredImg = document.getElementById('reveal-discovered-img');

    if (!revealContainer || !revealMask) return;

    // Explicitly enforce hidden initial state
    revealMask.style.opacity = '0';
    revealMask.style.webkitMaskImage = 'none';
    revealMask.style.maskImage = 'none';

    const updateRect = () => {
      if (revealContainer) {
        containerRect = revealContainer.getBoundingClientRect();
        baseRevealRadius = Math.max(180, Math.min(270, containerRect.width * 0.44));
      }
    };

    // 1. DESKTOP MOUSE / FINE POINTER (100% identical preserved behavior)
    revealContainer.addEventListener('mouseenter', (e) => {
      updateRect();
      isHoveringReveal = true;
      isRevealActive = true;

      updateCoordinates(e.clientX, e.clientY);
      if (revealCurrentOpacity < 0.08) {
        revealCurrentX = revealTargetX;
        revealCurrentY = revealTargetY;
      }
    });

    revealContainer.addEventListener('mousemove', (e) => {
      updateCoordinates(e.clientX, e.clientY);
    });

    revealContainer.addEventListener('mouseleave', () => {
      if (!isTouchExploring) {
        isHoveringReveal = false;
      }
    });

    // 2. MOBILE & TABLET TOUCH (Safe Hold-To-Explore Model)
    revealContainer.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') return; // Desktop mouse handled by mouseenter/mousemove

      if (holdTimer !== null) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }

      touchStartX = e.clientX;
      touchStartY = e.clientY;
      activePointerId = e.pointerId;
      updateRect();

      // Begin ~150ms hold detection — native scrolling is NOT blocked initially
      holdTimer = setTimeout(() => {
        holdTimer = null;
        isTouchExploring = true;
        isHoveringReveal = true;
        isRevealActive = true;

        updateCoordinates(e.clientX, e.clientY);
        revealCurrentX = revealTargetX;
        revealCurrentY = revealTargetY;

        // Pointer capture guarantees uninterrupted tracking even on fast circular swipes
        try {
          revealContainer.setPointerCapture(e.pointerId);
        } catch (err) {}
      }, HOLD_DURATION_MS);
    });

    revealContainer.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'mouse') return;

      if (!isTouchExploring) {
        // If still waiting for the 150ms hold threshold:
        if (holdTimer !== null) {
          const dx = Math.abs(e.clientX - touchStartX);
          const dy = Math.abs(e.clientY - touchStartY);
          // If moved beyond threshold before 150ms, user is scrolling vertically: cancel hold!
          if (dx > MOVE_TOLERANCE_PX || dy > MOVE_TOLERANCE_PX) {
            clearTimeout(holdTimer);
            holdTimer = null;
            // Native page scrolling proceeds completely unhindered
          }
        }
        return;
      }

      // In active exploration mode: prevent native scroll hijack during deliberate exploration
      if (e.cancelable) {
        e.preventDefault();
      }
      updateCoordinates(e.clientX, e.clientY);
    }, { passive: false });

    const endTouchExploration = (e) => {
      if (e && e.pointerType === 'mouse') return;

      if (holdTimer !== null) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }

      if (isTouchExploring) {
        isTouchExploring = false;
        isHoveringReveal = false; // Triggers smooth natural fade-out in master RAF

        if (activePointerId !== null) {
          try {
            if (revealContainer.hasPointerCapture(activePointerId)) {
              revealContainer.releasePointerCapture(activePointerId);
            }
          } catch (err) {}
          activePointerId = null;
        }
      }
    };

    revealContainer.addEventListener('pointerup', endTouchExploration);
    revealContainer.addEventListener('pointercancel', endTouchExploration);
    revealContainer.addEventListener('lostpointercapture', endTouchExploration);

    window.addEventListener('resize', updateRect, { passive: true });
  }

  function updateRevealPhysics() {
    if (!revealMask || !isRevealActive) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      revealCurrentX = revealTargetX;
      revealCurrentY = revealTargetY;
      revealCurrentRadius = isHoveringReveal ? baseRevealRadius : 0.0;
      revealCurrentOpacity = isHoveringReveal ? 1.0 : 0.0;
    } else {
      // Organic Lerp for cursor / touch position
      revealCurrentX += (revealTargetX - revealCurrentX) * 0.14;
      revealCurrentY += (revealTargetY - revealCurrentY) * 0.14;

      // Smooth radius & opacity expansion / collapse
      const targetRadius = isHoveringReveal ? baseRevealRadius : 0.0;
      const targetOpacity = isHoveringReveal ? 1.0 : 0.0;

      revealCurrentRadius += (targetRadius - revealCurrentRadius) * 0.11;
      revealCurrentOpacity += (targetOpacity - revealCurrentOpacity) * 0.11;
    }

    // Graceful idle cutoff when mouse/touch has ended and animation fully dissolved
    if (!isHoveringReveal && revealCurrentOpacity < 0.005) {
      revealMask.style.opacity = '0';
      revealMask.style.webkitMaskImage = 'none';
      revealMask.style.maskImage = 'none';
      if (revealDiscoveredImg) {
        revealDiscoveredImg.style.transform = 'none';
      }
      revealCurrentOpacity = 0.0;
      revealCurrentRadius = 0.0;
      isRevealActive = false; // Sleeps until next interaction
      return;
    }

    // Soft feathered radial spotlight mask
    const r = Math.max(1, revealCurrentRadius).toFixed(1);
    const x = revealCurrentX.toFixed(2);
    const y = revealCurrentY.toFixed(2);
    const gradient = `radial-gradient(circle ${r}px at ${x}% ${y}%, black 20%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.25) 75%, transparent 100%)`;

    revealMask.style.webkitMaskImage = gradient;
    revealMask.style.maskImage = gradient;
    revealMask.style.opacity = revealCurrentOpacity.toFixed(3);

    // Subtle microscopic focus/depth parallax (< 1.5px, scale 1.012)
    if (revealDiscoveredImg) {
      if (prefersReducedMotion) {
        revealDiscoveredImg.style.transform = 'none';
      } else {
        const offsetX = ((revealCurrentX - 50) * 0.025).toFixed(2);
        const offsetY = ((revealCurrentY - 50) * 0.025).toFixed(2);
        revealDiscoveredImg.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(1.012)`;
      }
    }
  }

  // =========================================================================
  // 4. OPPOSING SCROLL MARQUEE
  // =========================================================================
  let marqueeRow1 = null;
  let marqueeRow2 = null;

  function initScrollMarquee() {
    marqueeRow1 = document.getElementById('marquee-row-1');
    marqueeRow2 = document.getElementById('marquee-row-2');
  }

  function updateMarquee(scrollY) {
    if (!marqueeRow1 || !marqueeRow2) return;
    const offset1 = -(scrollY * 0.22) % 600;
    const offset2 = (scrollY * 0.18) % 600 - 300;
    marqueeRow1.style.transform = `translate3d(${offset1}px, 0, 0)`;
    marqueeRow2.style.transform = `translate3d(${offset2}px, 0, 0)`;
  }

  // =========================================================================
  // 5. PERSISTENT AUDIO DOCK & RELEASE CATALOG ENGINE
  // =========================================================================
  const AUDIO_TRACKS = {
    'if_you_miss_me': {
      title: 'If You Miss Me 🎨',
      src: 'audio/if_you_miss_me.mp3',
      cover: 'photes/image_b38c6.JPG',
      spotify: 'https://open.spotify.com/track/6KM8gT06FLVCFh46SX1XoR'
    },
    'by_the_window': {
      title: 'By The Window 🪟🐈‍⬛',
      src: 'audio/by_the_window.mp3',
      cover: 'photes/image_0ca22.JPG',
      spotify: 'https://open.spotify.com/track/1MdiClV1KpMRuvtZ5GBbFu'
    },
    'lost_it': {
      title: 'Lost It 🚪💥',
      src: 'audio/lost_it.mp3',
      cover: 'photes/image_caa3d.JPG',
      spotify: 'https://open.spotify.com/track/1tYQF6yqC5UsY1ef7ngYvz'
    },
    'soul_creature': {
      title: 'Soul Creature 👹',
      src: 'audio/soul_creature.mp3',
      cover: 'photes/image_094e5.JPG',
      spotify: 'https://open.spotify.com/track/03amdot6Db7UaJdv3NnfwL'
    },
    'neon_limelight': {
      title: 'Neon Limelight 🌟🌕',
      src: 'audio/neon_limelight.mp3',
      cover: 'photes/image_bf8f5.JPG',
      spotify: 'https://open.spotify.com/track/0eLK1LOmnqgEvzgOQejq5N'
    }
  };

  let globalAudio = null;
  let stickyBar = null;
  let dockThumb = null;
  let dockTitle = null;
  let dockPlayBtn = null;
  let dockPlayIcon = null;
  let dockPauseIcon = null;
  let dockScrubber = null;
  let dockCurrentTime = null;
  let dockTotalTime = null;
  let dockSpotifyLink = null;
  let dockCloseBtn = null;
  let dockVolumeSlider = null;
  let dockVolumeBtn = null;
  let dockVolHigh = null;
  let dockVolMute = null;

  let activeTrackKey = 'if_you_miss_me';
  let isAudioPlaying = false;
  let isScrubbing = false;
  let previousVolume = 0.85;
  let playPromise = null;

  const PLAY_ICON_SVG = '<svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  const PAUSE_ICON_SVG = '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

  function safePlay() {
    if (!globalAudio) return;
    isAudioPlaying = true;
    updateAllPlayButtons();

    try {
      playPromise = globalAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          playPromise = null;
        }).catch(err => {
          playPromise = null;
          if (err && err.name !== 'AbortError') {
            console.warn('Audio play notice:', err);
            isAudioPlaying = false;
            updateAllPlayButtons();
          }
        });
      }
    } catch (err) {
      console.warn('Audio play exception:', err);
      isAudioPlaying = false;
      updateAllPlayButtons();
    }
  }

  function safePause() {
    if (!globalAudio) return;
    isAudioPlaying = false;
    updateAllPlayButtons();

    if (playPromise !== null) {
      playPromise.then(() => {
        globalAudio.pause();
      }).catch(() => {
        globalAudio.pause();
      });
    } else {
      globalAudio.pause();
    }
  }

  function handleTrackAction(trackId) {
    if (!trackId || !AUDIO_TRACKS[trackId]) return;

    // Case 1: Clicked the currently active track
    if (activeTrackKey === trackId) {
      if (isAudioPlaying) {
        safePause();
      } else {
        stickyBar?.classList.remove('dock-hidden');
        safePlay();
      }
      return;
    }

    // Case 2: Clicked a different track
    loadTrack(trackId, true);
  }

  function initAudioEngine() {
    globalAudio = document.getElementById('global-audio-element');
    stickyBar = document.getElementById('sticky-bar');
    dockThumb = document.getElementById('dock-thumb');
    dockTitle = document.getElementById('dock-title');
    dockPlayBtn = document.getElementById('dock-play-toggle');
    dockPlayIcon = document.getElementById('dock-play-icon');
    dockPauseIcon = document.getElementById('dock-pause-icon');
    dockScrubber = document.getElementById('dock-scrubber');
    dockCurrentTime = document.getElementById('dock-current-time');
    dockTotalTime = document.getElementById('dock-total-time');
    dockSpotifyLink = document.getElementById('dock-spotify-link');
    dockCloseBtn = document.getElementById('dock-close-btn');
    dockVolumeSlider = document.getElementById('dock-volume-slider');
    dockVolumeBtn = document.getElementById('dock-volume-btn');
    dockVolHigh = document.getElementById('dock-vol-high');
    dockVolMute = document.getElementById('dock-vol-mute');

    if (!globalAudio) return;

    // Set initial volume
    globalAudio.volume = 0.85;
    if (dockVolumeSlider) dockVolumeSlider.value = 85;

    // Load initial track metadata without autoplaying
    loadTrack(activeTrackKey, false);

    // Audio Event Handlers (Browser HTML5 Audio is the single source of truth)
    globalAudio.addEventListener('timeupdate', onAudioTimeUpdate);
    globalAudio.addEventListener('loadedmetadata', onAudioLoadedMetadata);
    globalAudio.addEventListener('ended', onAudioEnded);
    globalAudio.addEventListener('pause', onAudioPauseState);
    globalAudio.addEventListener('play', onAudioPlayState);
    globalAudio.addEventListener('playing', onAudioPlayState);

    // Dock Play/Pause Toggle
    dockPlayBtn?.addEventListener('click', togglePlayPause);

    dockScrubber?.addEventListener('input', () => {
      isScrubbing = true;
      if (globalAudio.duration) {
        const seekTime = (dockScrubber.value / 100) * globalAudio.duration;
        dockCurrentTime.textContent = formatTime(seekTime);
      }
    });

    dockScrubber?.addEventListener('change', () => {
      if (globalAudio.duration) {
        globalAudio.currentTime = (dockScrubber.value / 100) * globalAudio.duration;
      }
      isScrubbing = false;
    });

    dockCloseBtn?.addEventListener('click', () => {
      stickyBar?.classList.add('dock-hidden');
    });

    // Volume Slider & Mute Toggle
    dockVolumeSlider?.addEventListener('input', () => {
      const val = parseFloat(dockVolumeSlider.value) / 100;
      globalAudio.volume = val;
      globalAudio.muted = (val === 0);
      updateVolumeIcon(val === 0);
    });

    dockVolumeBtn?.addEventListener('click', () => {
      if (globalAudio.muted || globalAudio.volume === 0) {
        globalAudio.muted = false;
        globalAudio.volume = previousVolume || 0.85;
        if (dockVolumeSlider) dockVolumeSlider.value = Math.round((previousVolume || 0.85) * 100);
        updateVolumeIcon(false);
      } else {
        previousVolume = globalAudio.volume;
        globalAudio.muted = true;
        globalAudio.volume = 0;
        if (dockVolumeSlider) dockVolumeSlider.value = 0;
        updateVolumeIcon(true);
      }
    });

    // Dedicated Play Button Triggers
    document.querySelectorAll('.track-play-btn, .track-play-btn-inline').forEach(btn => {
      if (btn.tagName.toLowerCase() === 'a') return; // Let Spotify anchor links open normally
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const trackId = this.getAttribute('data-track-id');
        if (trackId) {
          handleTrackAction(trackId);
        }
      });
    });

    // Track Card Click Triggers
    document.querySelectorAll('.track-card').forEach(card => {
      card.addEventListener('click', function(e) {
        if (e.target.closest('a') || e.target.closest('button')) return;
        const trackId = this.getAttribute('data-track-id');
        if (trackId) {
          handleTrackAction(trackId);
        }
      });
    });

    // Pause internal audio when opening external Spotify links
    document.querySelectorAll('a[href*="spotify.com"]').forEach(link => {
      link.addEventListener('click', () => {
        if (globalAudio && !globalAudio.paused) {
          safePause();
        }
      });
    });
  }

  function updateVolumeIcon(isMuted) {
    if (isMuted) {
      dockVolHigh?.classList.add('hidden');
      dockVolMute?.classList.remove('hidden');
    } else {
      dockVolHigh?.classList.remove('hidden');
      dockVolMute?.classList.add('hidden');
    }
  }

  function loadTrack(trackKey, autoPlay) {
    const track = AUDIO_TRACKS[trackKey];
    if (!track || !globalAudio) return;

    const isDifferentTrack = (activeTrackKey !== trackKey);
    activeTrackKey = trackKey;

    if (isDifferentTrack || !globalAudio.src.includes(track.src)) {
      globalAudio.src = track.src;
    }

    if (dockThumb) dockThumb.src = track.cover;
    if (dockTitle) dockTitle.textContent = track.title;
    if (dockSpotifyLink) dockSpotifyLink.href = track.spotify;

    updateAllPlayButtons();

    // Ensure audio dock is visible whenever user interacts with audio
    stickyBar?.classList.remove('dock-hidden');

    if (autoPlay) {
      safePlay();
    }
  }

  function togglePlayPause() {
    if (!globalAudio) return;
    if (isAudioPlaying || !globalAudio.paused) {
      safePause();
    } else {
      safePlay();
    }
  }

  function onAudioPlayState() {
    isAudioPlaying = true;
    updateAllPlayButtons();
  }

  function onAudioPauseState() {
    isAudioPlaying = false;
    updateAllPlayButtons();
  }

  function onAudioEnded() {
    isAudioPlaying = false;
    updateAllPlayButtons();
    if (dockCurrentTime) dockCurrentTime.textContent = formatTime(0);
    if (dockScrubber) dockScrubber.value = 0;
  }

  function onAudioTimeUpdate() {
    if (isScrubbing || !globalAudio.duration) return;
    const progress = (globalAudio.currentTime / globalAudio.duration) * 100;
    if (dockScrubber) dockScrubber.value = progress;
    if (dockCurrentTime) dockCurrentTime.textContent = formatTime(globalAudio.currentTime);
  }

  function onAudioLoadedMetadata() {
    if (dockTotalTime) dockTotalTime.textContent = formatTime(globalAudio.duration);
    if (dockCurrentTime) dockCurrentTime.textContent = formatTime(globalAudio.currentTime || 0);
    if (dockScrubber && globalAudio.duration) {
      dockScrubber.value = (globalAudio.currentTime / globalAudio.duration) * 100;
    }
  }

  function updateAllPlayButtons() {
    // 1. Update all track card buttons and card highlight states
    document.querySelectorAll('.track-card').forEach(card => {
      const cardTrackId = card.getAttribute('data-track-id');
      const isCardActive = (cardTrackId === activeTrackKey && isAudioPlaying);
      
      if (isCardActive) {
        card.classList.add('is-playing');
      } else {
        card.classList.remove('is-playing');
      }

      const cardBtn = card.querySelector('.track-play-btn');
      if (cardBtn && cardBtn.tagName.toLowerCase() === 'button' && cardTrackId) {
        if (isCardActive) {
          cardBtn.innerHTML = PAUSE_ICON_SVG;
          cardBtn.setAttribute('aria-label', `Pause ${AUDIO_TRACKS[cardTrackId]?.title || 'preview'}`);
        } else {
          cardBtn.innerHTML = PLAY_ICON_SVG;
          cardBtn.setAttribute('aria-label', `Play ${AUDIO_TRACKS[cardTrackId]?.title || 'preview'}`);
        }
      }
    });

    // 2. Update standalone buttons (Spotlight card, etc.)
    document.querySelectorAll('button.track-play-btn').forEach(btn => {
      const btnTrackId = btn.getAttribute('data-track-id');
      if (!btnTrackId) return;
      // Skip if already updated via parent .track-card
      if (btn.closest('.track-card')) return;

      const isBtnActive = (btnTrackId === activeTrackKey && isAudioPlaying);
      if (isBtnActive) {
        btn.innerHTML = PAUSE_ICON_SVG;
        btn.classList.add('is-playing');
      } else {
        btn.innerHTML = PLAY_ICON_SVG;
        btn.classList.remove('is-playing');
      }
    });

    // 3. Update Hero inline button
    document.querySelectorAll('.track-play-btn-inline').forEach(btn => {
      const btnTrackId = btn.getAttribute('data-track-id') || 'if_you_miss_me';
      const isInlineActive = (btnTrackId === activeTrackKey && isAudioPlaying);
      if (isInlineActive) {
        btn.innerHTML = PAUSE_ICON_SVG + '<span class="ml-1.5">PAUSE: IF YOU MISS ME</span>';
      } else {
        btn.innerHTML = PLAY_ICON_SVG + '<span class="ml-1.5">PLAY FEATURED: IF YOU MISS ME</span>';
      }
    });

    // 4. Update Dock Toggle Button
    if (isAudioPlaying) {
      dockPlayIcon?.classList.add('hidden');
      dockPauseIcon?.classList.remove('hidden');
      dockPlayBtn?.setAttribute('aria-label', 'Pause audio');
    } else {
      dockPlayIcon?.classList.remove('hidden');
      dockPauseIcon?.classList.add('hidden');
      dockPlayBtn?.setAttribute('aria-label', 'Play audio');
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // =========================================================================
  // 6. DYNAMIC HEADER LIFECYCLE & MOBILE DRAWER
  // Strictly following MASTER_DESIGN_SYSTEM.md Section 7
  // =========================================================================
  let header = null;
  let heroSection = null;

  function initHeaderLifecycle() {
    header = document.getElementById('main-header');
    heroSection = document.getElementById('hero');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-drawer-btn');
    const overlay = document.getElementById('drawer-overlay');

    header?.classList.add('hero-active');

    mobileBtn?.addEventListener('click', openMobileDrawer);
    closeBtn?.addEventListener('click', closeMobileDrawer);
    overlay?.addEventListener('click', closeMobileDrawer);
  }

  function updateHeaderOnScroll(scrollY) {
    if (!header || !heroSection) return;
    const heroBottom = heroSection.offsetHeight;
    
    // In Hero: visible with dynamic blur background; Below Hero: gracefully retreats
    if (scrollY < heroBottom - 80) {
      header.classList.add('hero-active');
      header.classList.remove('hero-left');
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    } else {
      header.classList.remove('hero-active');
      header.classList.add('hero-left');
    }
  }

  function openMobileDrawer() {
    document.getElementById('mobile-drawer')?.classList.add('is-open');
    document.getElementById('drawer-overlay')?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    document.getElementById('mobile-drawer')?.classList.remove('is-open');
    document.getElementById('drawer-overlay')?.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // =========================================================================
  // 7. INQUIRY FORM & MODAL CONTROLLER (Connected to Supabase)
  // =========================================================================
  const SUPABASE_URL = 'https://hzjzrnliyilimzpymldt.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_NcJDQyR6YNG_A4Klm1B32A_-bOqwDk8';

  function initInquiryForm() {
    const form = document.getElementById('inquiry-form');
    if (!form) return;

    const cardContainer = form.closest('.stealth-card') || form.parentElement;
    const header = cardContainer.querySelector('#inquiry-header') || document.getElementById('inquiry-header');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Ensure error banner exists
    let errorBanner = cardContainer.querySelector('#inquiry-error');
    if (!errorBanner) {
      errorBanner = document.createElement('div');
      errorBanner.id = 'inquiry-error';
      errorBanner.className = 'hidden mb-6 p-4 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-xs font-kanit leading-relaxed';
      errorBanner.setAttribute('role', 'alert');
      errorBanner.setAttribute('aria-live', 'assertive');
      errorBanner.innerHTML = `
        <div class="flex items-center gap-2 font-bold uppercase tracking-wider text-red-400 mb-1">
          <svg class="w-4 h-4 text-red-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          Transmission Notice
        </div>
        <span id="inquiry-error-text">Unable to transmit your inquiry at this moment. Please check your connection and try again, or email us directly at <a href="mailto:music@jaydymilla.com" class="underline text-white hover:text-[#CBFE00]">music@jaydymilla.com</a>.</span>
      `;
      form.parentNode.insertBefore(errorBanner, form);
    }
    const errorText = errorBanner.querySelector('#inquiry-error-text');

    // Ensure success panel exists
    let successPanel = cardContainer.querySelector('#inquiry-success');
    if (!successPanel) {
      successPanel = document.createElement('div');
      successPanel.id = 'inquiry-success';
      successPanel.className = 'hidden inquiry-success-panel py-6 text-center';
      successPanel.setAttribute('role', 'status');
      successPanel.setAttribute('aria-live', 'polite');
      successPanel.setAttribute('tabindex', '-1');
      successPanel.innerHTML = `
        <div class="w-14 h-14 rounded-full bg-[#CBFE00]/10 border border-[#CBFE00]/30 text-[#CBFE00] flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(203,254,0,0.18)]">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h4 class="font-kanit font-extrabold text-2xl sm:text-3xl text-white tracking-tight uppercase mb-3">
          Inquiry Submitted
        </h4>
        <p class="font-kanit text-white/80 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-4">
          Thanks — your inquiry has been received. JayDyMilla’s team will be in touch soon.
        </p>
        <p id="inquiry-confirmation-note" class="font-space text-xs text-[#CBFE00]/90 tracking-wider uppercase mb-8 flex items-center justify-center gap-2">
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#CBFE00]"></span>
          <span>Your inquiry has been received and is now in our inbox.</span>
        </p>
        <div class="pt-2">
          <button type="button" id="inquiry-reset-btn" class="btn-glass text-xs py-3 px-6 uppercase tracking-wider font-kanit">
            ← Send another inquiry
          </button>
        </div>
      `;
      form.parentNode.appendChild(successPanel);
    }
    const confirmationNote = successPanel.querySelector('#inquiry-confirmation-note');
    const resetBtn = successPanel.querySelector('#inquiry-reset-btn');

    let isSubmitting = false;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      const name = document.getElementById('inq-name')?.value?.trim();
      const email = document.getElementById('inq-email')?.value?.trim();
      const inquiryType = document.getElementById('inq-type')?.value;
      const timeline = document.getElementById('inq-date')?.value?.trim();
      const message = document.getElementById('inq-message')?.value?.trim();

      if (!name || !email || !message) {
        if (errorBanner && errorText) {
          errorText.textContent = 'Please fill out all required fields: Name, Email, and Message are required.';
          errorBanner.classList.remove('hidden');
          errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      // Hide any previous error message
      errorBanner.classList.add('hidden');

      // Set loading state
      isSubmitting = true;
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.innerHTML = `
          <svg class="animate-spin w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          TRANSMITTING...
        `;
      }

      let isSuccess = false;
      let clientConfirmationSent = false;

      try {
        const response = await fetch('/api/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            inquiry_type: inquiryType,
            timeline: timeline || null,
            message
          })
        });

        if (response.ok) {
          const data = await response.json().catch(() => ({}));
          if (data.success !== false) {
            isSuccess = true;
            clientConfirmationSent = !!data.clientConfirmation;
          } else {
            throw new Error(data.error || 'API response indicated failure');
          }
        } else {
          throw new Error('API dispatch returned status ' + response.status);
        }
      } catch (apiErr) {
        console.warn('[Inquiry API dispatch failed, initiating Supabase direct fallback]:', apiErr);
        try {
          const sbResponse = await fetch(`${SUPABASE_URL}/rest/v1/inquiries`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              name,
              email,
              inquiry_type: inquiryType,
              timeline: timeline || null,
              message
            })
          });
          if (sbResponse.ok) {
            isSuccess = true;
            clientConfirmationSent = false;
          } else {
            throw new Error('Direct database storage fallback also failed');
          }
        } catch (dbErr) {
          console.error('[Inquiry All Fallbacks Failed]:', dbErr);
          isSuccess = false;
        }
      }

      isSubmitting = false;

      if (isSuccess) {
        // Reset submit button state for future submissions
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          submitBtn.innerHTML = originalBtnHtml;
        }

        // Adjust confirmation line dynamically based on whether Resend dispatched an email confirmation
        if (confirmationNote) {
          if (clientConfirmationSent) {
            confirmationNote.innerHTML = `
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#CBFE00]"></span>
              <span>A confirmation copy has been sent to your inbox.</span>
            `;
          } else {
            confirmationNote.innerHTML = `
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#CBFE00]"></span>
              <span>Your inquiry has been received and is now in our inbox.</span>
            `;
          }
        }

        // Hide form and header, show success panel
        form.classList.add('hidden');
        if (header) header.classList.add('hidden');
        successPanel.classList.remove('hidden');

        // Reset form inputs
        form.reset();

        // Accessible focus management
        successPanel.focus();
        cardContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        // Restore submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          submitBtn.innerHTML = originalBtnHtml;
        }

        // Show error banner; keep form and all user input intact!
        if (errorBanner && errorText) {
          errorText.innerHTML = 'Unable to transmit your inquiry at this moment. Please check your connection and try again, or email us directly at <a href="mailto:music@jaydymilla.com" class="underline text-white hover:text-[#CBFE00]">music@jaydymilla.com</a>.';
          errorBanner.classList.remove('hidden');
          errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });

    // Reset button handler ("Send another inquiry")
    resetBtn?.addEventListener('click', () => {
      successPanel.classList.add('hidden');
      if (header) header.classList.remove('hidden');
      form.classList.remove('hidden');
      errorBanner?.classList.add('hidden');

      const firstInput = document.getElementById('inq-name');
      firstInput?.focus();
    });
  }

  // =========================================================================
  // 8. NEW RELEASE FLOATING POPUP LIFECYCLE
  // Deterministic 20-Calendar-Day Expiry Engine (America/New_York)
  // Official Release Date: 2026-09-28
  // Global Expiry Cutoff:  2026-10-18 (Release Date + 20 Days)
  // =========================================================================
  const NEW_RELEASE = {
    title: "Diamond & Dragon",
    artist: "JayDyMilla",
    producer: "JAH KNEE DEE",
    releaseDate: "2026-09-28",
    spotifyUrl: "https://open.spotify.com/track/7fL2F2B0VOghhJItxtcCdi",
    popupEnabled: true,
    expiryDays: 20
  };

  /**
   * Derives exact expiry date (YYYY-MM-DD) by adding calendar days to release date
   */
  function calculateReleaseExpiry(releaseDateStr, days = 20) {
    const [y, m, d] = releaseDateStr.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  /**
   * Retrieves the current date in the artist's primary operating timezone: America/New_York
   */
  function getCurrentDateInNewYork() {
    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return formatter.format(new Date()); // Formats as 'YYYY-MM-DD'
    } catch (e) {
      return new Date().toISOString().slice(0, 10);
    }
  }

  /**
   * Evaluates if release popup is globally active based on deterministic 20-day cutoff
   */
  function isNewReleaseActive(testDateOverride = null) {
    if (!NEW_RELEASE.popupEnabled) return false;
    const currentDate = testDateOverride || getCurrentDateInNewYork();
    const expiryDate = calculateReleaseExpiry(NEW_RELEASE.releaseDate, NEW_RELEASE.expiryDays);
    return currentDate >= NEW_RELEASE.releaseDate && currentDate < expiryDate;
  }

  function initNewReleasePopup() {
    const popup = document.getElementById('new-release-popup');
    if (!popup) return;

    // 1. Authoritative 20-day global date check (Deterministic & Global)
    if (!isNewReleaseActive()) {
      popup.remove();
      return;
    }

    // 2. Intra-session dismissal check (sessionStorage only, never permanent 20-day suppression)
    const sessionKey = `jdm_new_release_dismissed_${NEW_RELEASE.releaseDate}`;
    try {
      if (sessionStorage.getItem(sessionKey) === 'true') {
        popup.remove();
        return;
      }
    } catch (e) {
      // Non-blocking in sandboxed environments
    }

    // 3. Reveal popup smoothly after brief initial page settling
    setTimeout(() => {
      popup.classList.remove('new-release-popup-hidden');
    }, 1200);

    // 4. Dismissal handlers
    function dismissPopup() {
      popup.classList.add('new-release-popup-hidden');
      try {
        sessionStorage.setItem(sessionKey, 'true');
      } catch (e) {}
      setTimeout(() => {
        popup.remove();
      }, 450);
    }

    const closeBtn = document.getElementById('close-release-popup');
    const dismissBtn = document.getElementById('release-popup-dismiss-btn');

    closeBtn?.addEventListener('click', dismissPopup);
    dismissBtn?.addEventListener('click', dismissPopup);

    // 5. Accessibility: Escape key closes popup if visible
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !popup.classList.contains('new-release-popup-hidden')) {
        dismissPopup();
      }
    });
  }

  // =========================================================================
  // 9. MASTER UNIFIED RAF LOOP (Zero Competing Loops, 60 FPS Target)
  // =========================================================================
  let lastTime = performance.now();

  function masterTick(currentTime) {
    const dt = Math.min((currentTime - lastTime) / 1000, 0.1); // Clamp dt to prevent frame delta spikes
    lastTime = currentTime;

    // 1. Lenis Smooth Scroll step
    if (lenis) {
      lenis.raf(currentTime);
    }

    const currentScrollY = window.scrollY;

    // 2. 3D Cylinder Physics update
    updateCylinderScroll();
    updateCylinderPhysics(dt);

    // 3. Dual-Layer Reveal cursor smoothing
    updateRevealPhysics();

    // 4. Opposing marquee translation
    updateMarquee(currentScrollY);

    // 5. Header scroll appearance
    updateHeaderOnScroll(currentScrollY);

    lastScrollY = currentScrollY;
    requestAnimationFrame(masterTick);
  }

  function boot() {
    initSmoothScroll();
    initCylinderMotion();
    initImageReveal();
    initScrollMarquee();
    initAudioEngine();
    initHeaderLifecycle();
    initInquiryForm();
    initNewReleasePopup();

    // Kick off unified animation loop
    requestAnimationFrame(masterTick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();

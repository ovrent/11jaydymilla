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
  let isSeeking = false;
  let pendingSeekTime = null;
  let videoDuration = 0;

  const omega = 22.0; // Natural angular frequency for critical damping

  function initCylinderMotion() {
    cylinderTrack = document.getElementById('cinematic-motion');
    cylinderVideo = document.getElementById('cylinder-video-element');
    cylinderScaler = document.getElementById('motion-cylinder-scaler');

    if (!cylinderTrack || !cylinderVideo) return;

    // Ensure video is strictly paused (never autoplays)
    cylinderVideo.pause();

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
      if (pendingSeekTime !== null) {
        const nextTime = pendingSeekTime;
        pendingSeekTime = null;
        executeSeek(nextTime);
      }
    };

    cylinderVideo.addEventListener('loadeddata', onDataReady);
    cylinderVideo.addEventListener('canplay', onDataReady);

    // Zero-Race Seek Queue Resolution
    cylinderVideo.addEventListener('seeking', () => {
      isSeeking = true;
    });

    cylinderVideo.addEventListener('seeked', () => {
      isSeeking = false;
      if (pendingSeekTime !== null) {
        const nextTime = pendingSeekTime;
        pendingSeekTime = null;
        executeSeek(nextTime);
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
    if (cylinderVideo.readyState < 2) {
      pendingSeekTime = time;
      return;
    }
    if (Math.abs(cylinderVideo.currentTime - time) < 0.016) return; // Skip if under 1 frame
    if (cylinderVideo.seeking || isSeeking) {
      pendingSeekTime = time;
      return;
    }
    try {
      cylinderVideo.currentTime = time;
    } catch (err) {}
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
      // Critically Damped Harmonic Oscillator (zeta = 1.0, omega = 22.0)
      const f = 1.0 + 2.0 * dt * omega;
      const oo = omega * omega;
      const hoo = dt * oo;
      const hhoo = dt * hoo;
      const detInv = 1.0 / (f + hhoo);
      const detDiff = targetProgress - currentProgress;

      currentProgress = (f * currentProgress + dt * currentVelocity + hhoo * targetProgress) * detInv;
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

    // Load initial track metadata
    loadTrack(activeTrackKey, false);

    // Audio Event Handlers
    globalAudio.addEventListener('timeupdate', onAudioTimeUpdate);
    globalAudio.addEventListener('loadedmetadata', onAudioLoadedMetadata);
    globalAudio.addEventListener('ended', onAudioEnded);
    globalAudio.addEventListener('pause', onAudioPauseState);
    globalAudio.addEventListener('play', onAudioPlayState);

    // Dock Controls
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

    // Dedicated Play Button Triggers (Stops event propagation to prevent double-firing)
    document.querySelectorAll('.track-play-btn, .track-play-btn-inline').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const trackId = this.getAttribute('data-track-id');
        if (trackId && AUDIO_TRACKS[trackId]) {
          if (activeTrackKey === trackId && isAudioPlaying) {
            globalAudio.pause();
          } else {
            loadTrack(trackId, true);
          }
        }
      });
    });

    // Track Card Click Triggers
    document.querySelectorAll('.track-card').forEach(card => {
      card.addEventListener('click', function(e) {
        if (e.target.closest('a') || e.target.closest('button')) return;
        const trackId = this.getAttribute('data-track-id');
        if (trackId && AUDIO_TRACKS[trackId]) {
          if (activeTrackKey === trackId && isAudioPlaying) {
            globalAudio.pause();
          } else {
            loadTrack(trackId, true);
          }
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

    activeTrackKey = trackKey;
    globalAudio.src = track.src;

    if (dockThumb) dockThumb.src = track.cover;
    if (dockTitle) dockTitle.textContent = track.title;
    if (dockSpotifyLink) dockSpotifyLink.href = track.spotify;

    updateTrackCardHighlights();

    // Ensure audio dock is visible whenever user interacts with audio
    stickyBar?.classList.remove('dock-hidden');

    if (autoPlay) {
      globalAudio.play().catch(err => {
        console.warn('Audio playback waiting for gesture:', err);
      });
    }
  }

  function togglePlayPause() {
    if (!globalAudio) return;
    if (globalAudio.paused) {
      globalAudio.play().catch(e => console.warn(e));
    } else {
      globalAudio.pause();
    }
  }

  function onAudioPlayState() {
    isAudioPlaying = true;
    dockPlayIcon?.classList.add('hidden');
    dockPauseIcon?.classList.remove('hidden');
    updateTrackCardHighlights();
  }

  function onAudioPauseState() {
    isAudioPlaying = false;
    dockPlayIcon?.classList.remove('hidden');
    dockPauseIcon?.classList.add('hidden');
    updateTrackCardHighlights();
  }

  function onAudioTimeUpdate() {
    if (isScrubbing || !globalAudio.duration) return;
    const progress = (globalAudio.currentTime / globalAudio.duration) * 100;
    if (dockScrubber) dockScrubber.value = progress;
    if (dockCurrentTime) dockCurrentTime.textContent = formatTime(globalAudio.currentTime);
  }

  function onAudioLoadedMetadata() {
    if (dockTotalTime) dockTotalTime.textContent = formatTime(globalAudio.duration);
    if (dockCurrentTime) dockCurrentTime.textContent = formatTime(0);
    if (dockScrubber) dockScrubber.value = 0;
  }

  function onAudioEnded() {
    isAudioPlaying = false;
    dockPlayIcon?.classList.remove('hidden');
    dockPauseIcon?.classList.add('hidden');
    updateTrackCardHighlights();
  }

  function updateTrackCardHighlights() {
    document.querySelectorAll('.track-card').forEach(card => {
      const id = card.getAttribute('data-track-id');
      if (id === activeTrackKey && isAudioPlaying) {
        card.classList.add('is-playing');
      } else {
        card.classList.remove('is-playing');
      }
    });
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
    const modal = document.getElementById('booking-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const submitBtn = form?.querySelector('button[type="submit"]');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('inq-name')?.value?.trim();
      const email = document.getElementById('inq-email')?.value?.trim();
      const inquiryType = document.getElementById('inq-type')?.value;
      const timeline = document.getElementById('inq-date')?.value?.trim();
      const message = document.getElementById('inq-message')?.value?.trim();

      const originalBtnText = submitBtn ? submitBtn.innerText : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'TRANSMITTING...';
      }

      try {
        await fetch(`${SUPABASE_URL}/rest/v1/inquiries`, {
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
      } catch (err) {
        // Graceful handling preserves modal feedback
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }
        modal?.classList.add('is-active');
        form.reset();
      }
    });

    closeModalBtn?.addEventListener('click', () => {
      modal?.classList.remove('is-active');
    });

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('is-active');
      }
    });
  }

  // =========================================================================
  // 8. MASTER UNIFIED RAF LOOP (Zero Competing Loops, 60 FPS Target)
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

    // Kick off unified animation loop
    requestAnimationFrame(masterTick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();

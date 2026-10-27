import React from 'react';
import ReactDOM from 'react-dom/client';
import VenomButton from './venom-button';

declare global {
  interface Window {
    sendTelemetry?: (type: string, label: string) => void;
    renderVenomButton?: (elementId: string, options?: any) => void;
  }
}

function mountVenom(el: HTMLElement) {
  if (el.dataset.mounted === 'true') return;
  el.dataset.mounted = 'true';

  const label = el.getAttribute('data-label') || 'WE ARE VENOM';
  const background = el.getAttribute('data-bg') || 'transparent';
  const gooColor = el.getAttribute('data-goo-color') || '#050508';
  const textColor = el.getAttribute('data-text-color') || '#FFFFFF';
  const shineColor = el.getAttribute('data-shine') || '#CBFE00'; // JayDyMilla signature acid-lime
  const size = parseInt(el.getAttribute('data-size') || '72', 10);
  const strands = parseInt(el.getAttribute('data-strands') || '8', 10);
  const reach = parseInt(el.getAttribute('data-reach') || '160', 10);
  const cursor = (el.getAttribute('data-cursor') || 'glove') as any;
  const target = el.getAttribute('data-target');

  const root = ReactDOM.createRoot(el);
  root.render(
    <VenomButton
      label={label}
      background={background}
      gooColor={gooColor}
      textColor={textColor}
      size={size}
      strands={strands}
      reach={reach}
      cursor={cursor}
      style={{
        minWidth: '100%',
        minHeight: '100%',
        width: '100%',
        height: '100%',
        borderRadius: '16px',
      }}
      font={{
        fontFamily: "'Kanit', sans-serif",
        fontWeight: 800,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
      advanced={{
        shine: shineColor,
        glint: 140,
        rim: 120,
        vignette: 25,
        grain: 0,
        hover: 60,
      }}
      onClick={() => {
        if (window.sendTelemetry) {
          window.sendTelemetry('click', `Venom Button: ${label}`);
        }
        if (target) {
          if (target.startsWith('#')) {
            const targetEl = document.querySelector(target);
            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.open(target, target.startsWith('http') ? '_blank' : '_self');
          }
        }
      }}
    />
  );
}

function initVenomButtons() {
  const elements = document.querySelectorAll<HTMLElement>('[data-originkit-venom]');
  elements.forEach((el) => mountVenom(el));
}

window.renderVenomButton = (elementId: string, options: any = {}) => {
  const el = document.getElementById(elementId);
  if (!el) return;
  if (options.label) el.setAttribute('data-label', options.label);
  if (options.target) el.setAttribute('data-target', options.target);
  if (options.size) el.setAttribute('data-size', String(options.size));
  if (options.shine) el.setAttribute('data-shine', options.shine);
  mountVenom(el);
};

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVenomButtons);
  } else {
    initVenomButtons();
  }
}

"use client";

import React, { useEffect, useState } from 'react';
import { Download, X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'kezar_pwa_dismissed_at';
const DISMISS_DAYS = 14;

/**
 * Registra el service worker y muestra un aviso discreto para instalar la app.
 * - Android / Chrome / Edge / PC: usa el evento beforeinstallprompt.
 * - iPhone / iPad (Safari): muestra instrucciones (iOS no permite instalar por código).
 * - No aparece si la app ya está instalada o si el usuario la descartó recientemente.
 */
export default function PWAInstall() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIos, setShowIos] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
    }

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    try {
      const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
      if (at && Date.now() - at < DISMISS_DAYS * 86_400_000) return;
    } catch {
      /* localStorage no disponible */
    }

    const ua = navigator.userAgent;
    const isIos =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    if (isIos && isSafari) {
      setShowIos(true);
      setVisible(true);
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === 'dismissed') dismiss();
    setDeferred(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9000] w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white dark:bg-[#051226] border border-slate-200 dark:border-blue-900/60 shadow-2xl p-4 flex items-center gap-3">
      <img src="/icon-192.png" alt="" className="w-11 h-11 rounded-xl flex-shrink-0" />
      <div className="flex-1 min-w-0 text-xs text-slate-700 dark:text-gray-300">
        <p className="font-black text-sm text-slate-900 dark:text-white">Instala KEZARSTREAM</p>
        {showIos && !deferred ? (
          <p className="flex flex-wrap items-center gap-1">
            Toca <Share className="w-3.5 h-3.5 inline" /> y luego &quot;Añadir a pantalla de inicio&quot;.
          </p>
        ) : (
          <p>Acceso directo en pantalla completa, sin barra del navegador.</p>
        )}
      </div>
      {deferred && (
        <button
          onClick={install}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer active:scale-95 transition-all flex-shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          Instalar
        </button>
      )}
      <button
        onClick={dismiss}
        aria-label="Cerrar"
        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

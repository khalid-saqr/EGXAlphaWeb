(function () {
  const configText = document.getElementById('site-config')?.textContent?.trim();
  const payloadText = document.getElementById('beacon-payload')?.textContent?.trim();
  let siteConfig = { basePath: '', locale: 'en' };
  let pagePayload = {};
  try { if (configText) siteConfig = JSON.parse(configText); } catch (_) {}
  try { if (payloadText) pagePayload = JSON.parse(payloadText); } catch (_) {}

  const basePath = String(siteConfig.basePath || '').replace(/\/$/, '');
  const locale = String(siteConfig.locale || 'en').toLowerCase().startsWith('ar') ? 'ar' : 'en';
  const strings = locale === 'ar' ? {
    install: 'تثبيت EGX /ALPHA',
    installCta: 'تثبيت EGX /Alpha',
    installed: 'EGX /ALPHA مثبت',
    installedCta: 'EGX /Alpha مثبت',
    installReady: 'جاهز للتثبيت على هذا الجهاز.',
    installGeneric: 'استخدم خيار تثبيت التطبيق من قائمة المتصفح.',
    installIOS: 'على iPhone أو iPad: اضغط مشاركة ثم «إضافة إلى الشاشة الرئيسية».',
    installDismissed: 'يمكنك تثبيت التطبيق لاحقاً من هذا الخيار.',
    online: 'متصل · يتم فحص أحدث سجل عند فتح التطبيق',
    offline: 'غير متصل · عرض آخر سجل عام محفوظ',
    checking: 'جارٍ فحص أحدث سجل عام…',
    current: 'السجل العام المعروض هو الأحدث.',
    deploying: 'يتوفر سجل عام أحدث · جارٍ نشر العرض الجديد…',
    refreshing: 'يتوفر سجل عام أحدث · جارٍ تحديث العرض…'
  } : {
    install: 'INSTALL EGX /ALPHA',
    installCta: 'Install EGX /Alpha',
    installed: 'EGX /ALPHA INSTALLED',
    installedCta: 'EGX /Alpha installed',
    installReady: 'Ready to install on this device.',
    installGeneric: 'Use your browser menu and choose Install app.',
    installIOS: 'On iPhone or iPad: tap Share, then Add to Home Screen.',
    installDismissed: 'You can install the app later from this control.',
    online: 'ONLINE · LATEST RECORD CHECKED ON OPEN',
    offline: 'OFFLINE · SHOWING LAST CACHED PUBLIC RECORD',
    checking: 'CHECKING LATEST PUBLIC RECORD…',
    current: 'DISPLAYED PUBLIC RECORD IS CURRENT',
    deploying: 'DEPLOYING NEW PUBLIC RECORD · CURRENT VIEW RETAINED',
    refreshing: 'NEWER PUBLIC RECORD AVAILABLE · REFRESHING…'
  };

  const exploreAction = document.querySelector('.alpha-control-deck .primary-action');
  if (exploreAction && !document.querySelector('[data-pwa-install-variant="hero"]')) {
    const heroInstallButton = document.createElement('button');
    heroInstallButton.className = 'primary-action pwa-hero-install';
    heroInstallButton.type = 'button';
    heroInstallButton.dataset.pwaInstall = '';
    heroInstallButton.dataset.pwaInstallVariant = 'hero';
    heroInstallButton.setAttribute('aria-label', strings.installCta);
    heroInstallButton.textContent = strings.installCta;
    exploreAction.insertAdjacentElement('afterend', heroInstallButton);

    const heroInstallHelp = document.createElement('p');
    heroInstallHelp.className = 'pwa-install-help pwa-hero-install-help';
    heroInstallHelp.dataset.pwaInstallHelp = '';
    heroInstallHelp.hidden = true;
    heroInstallButton.insertAdjacentElement('afterend', heroInstallHelp);
  }

  const installButtons = [...document.querySelectorAll('[data-pwa-install]')];
  const installHelps = [...document.querySelectorAll('[data-pwa-install-help]')];
  const footerInstallHelp = document.querySelector('.footer-install [data-pwa-install-help]');
  const appStatus = document.querySelector('[data-pwa-status]');
  const offlineNotice = document.querySelector('[data-pwa-offline]');
  let deferredPrompt = null;
  let checking = false;
  let lastCheckAt = 0;

  const isStandalone = () => window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const installLabel = button => button.dataset.pwaInstallVariant === 'hero' ? strings.installCta : strings.install;
  const installedLabel = button => button.dataset.pwaInstallVariant === 'hero' ? strings.installedCta : strings.installed;
  const helpForButton = button => button.parentElement?.querySelector('[data-pwa-install-help]') || footerInstallHelp;

  function setInstallState() {
    if (!installButtons.length) return;
    if (isStandalone()) {
      for (const button of installButtons) {
        button.textContent = installedLabel(button);
        button.disabled = true;
        button.dataset.state = 'installed';
      }
      for (const help of installHelps) help.hidden = true;
      return;
    }
    for (const button of installButtons) {
      button.disabled = false;
      button.textContent = installLabel(button);
      button.dataset.state = deferredPrompt ? 'ready' : 'available';
    }
    if (footerInstallHelp) {
      footerInstallHelp.hidden = false;
      footerInstallHelp.textContent = deferredPrompt ? strings.installReady : (isIOS() ? strings.installIOS : strings.installGeneric);
    }
  }

  function updateConnectionState() {
    const offline = navigator.onLine === false;
    document.documentElement.classList.toggle('is-offline', offline);
    if (offlineNotice) {
      offlineNotice.hidden = !offline;
      offlineNotice.textContent = strings.offline;
    }
    if (appStatus && !checking) appStatus.textContent = offline ? strings.offline : strings.online;
  }

  function currentSurfacePath() {
    let path = window.location.pathname || '/';
    if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length) || '/';
    if (!path.startsWith('/')) path = `/${path}`;
    return path;
  }

  function isCurrentSurface() {
    return new Set(['/', '/today/', '/ar/', '/ar/today/']).has(currentSurfacePath());
  }

  async function currentHtmlHasDate(tradingDate) {
    const url = new URL(window.location.href);
    url.searchParams.set('__egx_record', tradingDate);
    try {
      const response = await fetch(url.toString(), { cache: 'no-store', headers: { 'cache-control': 'no-cache' } });
      if (!response.ok) return false;
      const html = await response.text();
      return html.includes(`"trading_date":"${tradingDate}"`);
    } catch (_) {
      return false;
    }
  }

  async function checkLatestPublicRecord() {
    if (!isCurrentSurface() || navigator.onLine === false || checking) return;
    const now = Date.now();
    if (now - lastCheckAt < 5000) return;
    lastCheckAt = now;
    checking = true;
    if (appStatus) appStatus.textContent = strings.checking;
    try {
      const response = await fetch(`${basePath}/data/latest.json`, { cache: 'no-store', headers: { 'cache-control': 'no-cache' } });
      if (!response.ok) throw new Error('latest public record unavailable');
      const latest = await response.json();
      const displayedDate = String(pagePayload.trading_date || '');
      const latestDate = String(latest.trading_date || '');
      if (displayedDate && latestDate && latestDate > displayedDate) {
        const releaseReady = await currentHtmlHasDate(latestDate);
        if (!releaseReady) {
          if (appStatus) appStatus.textContent = strings.deploying;
          return;
        }
        if (appStatus) appStatus.textContent = strings.refreshing;
        window.location.reload();
        return;
      }
      if (appStatus) appStatus.textContent = strings.current;
    } catch (_) {
      updateConnectionState();
    } finally {
      checking = false;
    }
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    setInstallState();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    setInstallState();
  });

  for (const installButton of installButtons) {
    installButton.addEventListener('click', async () => {
      if (isStandalone()) return;
      const installHelp = helpForButton(installButton);
      if (!deferredPrompt) {
        if (installHelp) {
          installHelp.hidden = false;
          installHelp.textContent = isIOS() ? strings.installIOS : strings.installGeneric;
        }
        return;
      }
      const prompt = deferredPrompt;
      deferredPrompt = null;
      await prompt.prompt();
      const choice = await prompt.userChoice.catch(() => null);
      setInstallState();
      if (choice?.outcome !== 'accepted' && installHelp) {
        installHelp.hidden = false;
        installHelp.textContent = strings.installDismissed;
      }
    });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const scope = `${basePath || ''}/`;
        const registration = await navigator.serviceWorker.register(`${basePath}/sw.js`, { scope });
        registration.update().catch(() => {});
      } catch (_) {}
    });
  }

  window.addEventListener('online', () => { updateConnectionState(); checkLatestPublicRecord(); });
  window.addEventListener('offline', updateConnectionState);
  window.addEventListener('focus', checkLatestPublicRecord);
  window.addEventListener('pageshow', checkLatestPublicRecord);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkLatestPublicRecord(); });

  setInstallState();
  updateConnectionState();
})();
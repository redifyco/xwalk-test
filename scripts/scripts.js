import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';
import {isEditorMode} from "./utils.js";

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Load Ionicons scripts
 */
function loadIonicons() {
  // Load modern ES modules version
  const ioniconsESM = document.createElement('script');
  ioniconsESM.type = 'module';
  ioniconsESM.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js';
  document.head.appendChild(ioniconsESM);

  // Load fallback for older browsers
  const ioniconsNoModule = document.createElement('script');
  ioniconsNoModule.setAttribute('nomodule', '');
  ioniconsNoModule.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js';
  document.head.appendChild(ioniconsNoModule);
}

/**
 * Initialize DataLayer with page-specific values
 */
function initDataLayer() {
  // Funzione per ottenere i valori del dataLayer client-side secondo le specifiche fornite
  function getDataLayerValues() {
    // Ottieni informazioni sulla pagina corrente
    const currentUrl = new URL(window.location.href);

    // Determina la categoria della pagina
    let pageCategory = "content"; // valore predefinito
    const pathname = currentUrl.pathname;

    if (pathname === "/" || pathname === "/index.html") {
      pageCategory = "home";
    } else if (pathname.includes("/download") || pathname.match(/\.(pdf|zip|exe|dmg|apk)$/i)) {
      pageCategory = "download";
    }

    // Tentativo di rilevamento del paese dell'utente
    let userCountry = "en"; // valore predefinito
    // Cerca il paese in html lang, cookie o custom data attribute
    if (document.documentElement.lang && document.documentElement.lang.includes('-')) {
      userCountry = document.documentElement.lang.split('-')[1].toUpperCase();
    } else if (document.querySelector('meta[name="country"]')) {
      userCountry = document.querySelector('meta[name="country"]').content.toUpperCase();
    }

    // Determina l'ambiente
    let environment = "preprod"; // valore predefinito modificato a preprod
    // Usa prod SOLO se l'hostname è esattamente mscfoundation.org
    if (currentUrl.hostname === "mscfoundation.org") {
      environment = "prod";
    } else if (currentUrl.hostname.includes("dev") || currentUrl.hostname.includes("localhost")) {
      environment = "dev";
    }

    // Determina la lingua
    let language = "en"; // valore predefinito
    if (document.documentElement.lang) {
      // Estrai solo la prima parte del codice lingua (es. "it-IT" diventa "it")
      language = document.documentElement.lang.split('-')[0].toLowerCase();
    } else if (document.querySelector('meta[name="language"]')) {
      language = document.querySelector('meta[name="language"]').content.toLowerCase();
    }

    return {
      p_data: "pageview", // valore predefinito per l'evento
      p_category: pageCategory, // home, content, download
      p_country: userCountry, // ISO A-2 code del paese dell'utente
      p_env: environment, // dev, preprod, prod
      p_language: language, // ISO 639-1 language code
      p_location: window.location.href, // URL completo con fragment
      p_path: window.location.pathname // percorso del documento
    };
  }

  // Inizializza il dataLayer
  window.dataLayer = window.dataLayer || [];

  // Ottieni i valori e inseriscili nel dataLayer
  const datalayerValues = getDataLayerValues();
  dataLayer.push({
    event: "p_data",
    p_category: datalayerValues.p_category,
    p_country: datalayerValues.p_country,
    p_env: datalayerValues.p_env,
    p_language: datalayerValues.p_language,
    p_location: datalayerValues.p_location,
    p_path: datalayerValues.p_path
  });
}

/**
 * Load Didomi privacy center
 */
function loadDidomi() {
  (function(){
    (function(e){
      var r=document.createElement("link");
      r.rel="preconnect";
      r.as="script";
      var t=document.createElement("link");
      t.rel="dns-prefetch";
      t.as="script";
      var n=document.createElement("script");
      n.id="spcloader";
      n.type="text/javascript";
      n["async"]=true;
      n.charset="utf-8";
      var o="https://sdk.privacy-center.org/"+e+"/loader.js?target="+document.location.hostname;
      if(window.didomiConfig&&window.didomiConfig.user){
        var i=window.didomiConfig.user;
        var a=i.country;
        var c=i.region;
        if(a){
          o=o+"&country="+a;
          if(c){
            o=o+"&region="+c
          }
        }
      }
      r.href="https://sdk.privacy-center.org/";
      t.href="https://sdk.privacy-center.org/";
      n.src=o;
      var d=document.getElementsByTagName("script")[0];
      d.parentNode.insertBefore(r,d);
      d.parentNode.insertBefore(t,d);
      d.parentNode.insertBefore(n,d)
    })("749b85dc-f97b-45a3-95ca-d0586bd5cbff")
  })();
}

/**
 * Load Google Tag Manager
 */
function loadGTM() {
  (function(w,d,s,l,i){
    w[l]=w[l]||[];
    w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;
    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-NBZZS7QL');
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    // TODO: add auto block, if needed
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  // Load critical CSS
  loadCSS(`${window.hlx.codeBasePath}/styles/eager-styles.css`);
  decorateTemplateAndTheme();

  // Load Ionicons
  loadIonicons();

  // Initialize tracking and analytics
  initDataLayer();

  if (!isEditorMode()) {
    loadDidomi();
    loadGTM();
  }

  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadFonts();
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
export async function load404() {
  //const main = document.querySelector('main');
  //await loadSections(main);

  const { hash } = window.location;
  const element = hash ? document.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();
  loadFonts();

  //loadHeader(document.querySelector('header'));
  //loadFooter(document.querySelector('footer'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

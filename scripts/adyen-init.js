import {loadScriptSecure} from "./utils.js";
import {loadCSS} from "./aem.js";

const ADYEN_CLIENT_KEY_MSCFOUNDATION_TEST =
    "test_RECMBL5SWRCZBBE2OLQ57DZNNAK74JHQ";
const CREATE_SESSION_API_URL =
    "/api/msc-foundation/services/adyen?type=CREATE_SESSION";
const GET_PAYMENT_METHODS_API_URL =
    "/api/msc-foundation/services/adyen?type=GET_PAYMENT_METHODS";
const ENVIRONMENT = "test";

export const initDonationForm = (
    data,
    additionalData,
    onPaymentCompleted,
    onPaymentFailed
) => {

    // Verifica che AdyenWeb sia disponibile prima di usarlo
    if (!window.AdyenWeb || !window.AdyenWeb.AdyenCheckout) {
      console.error("❌ Adyen non è stato caricato correttamente");
      onPaymentFailed("Adyen non disponibile");
      return;
    }

    // Ora è sicuro fare il destructuring
    const {AdyenCheckout, Dropin} = window.AdyenWeb;



  // 1) Fire both the “CREATE_SESSION” and “GET_PAYMENT_METHODS” calls.
    Promise.all([
        fetch(CREATE_SESSION_API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        }).then((res) => res.json()),
        fetch(GET_PAYMENT_METHODS_API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        }).then((res) => res.json()),
    ])
        .then(async ([sessionResp, pmResp]) => {
            console.log("🔷 Create Session Response:", sessionResp);
            console.log("🔷 Get PaymentMethods Response:", pmResp);

            // 2) sessionResp.data is a string like:
            //    "{\"id\":\"CS980E79DFF16EF272\",\"session\":\"Ab02b4c0!BQA…\"}"
            //    So we must JSON.parse(...) it to get { id, session } as an object.
            let parsedSessionObj;
            try {
                parsedSessionObj = JSON.parse(sessionResp.data);
            } catch (e) {
                console.error("❌ Failed to parse sessionResp.data as JSON:", e, sessionResp.data);
                onPaymentFailed("Invalid JSON in CREATE_SESSION response");
                return;
            }

            // 3) Likewise parse paymentMethodsResponse.data (often also a JSON‐string)
            let parsedPaymentMethods;
            try {
                parsedPaymentMethods = JSON.parse(pmResp.data);
            } catch (e) {
                console.error("❌ Failed to parse paymentMethodsResponse.data:", e, pmResp.data);
                onPaymentFailed("Invalid JSON in GET_PAYMENT_METHODS response");
                return;
            }

            // 4) Ensure we actually have the two fields we need: "id" and "session"
            if (
                !parsedSessionObj ||
                typeof parsedSessionObj !== "object" ||
                !parsedSessionObj.id ||
                !parsedSessionObj.session
            ) {
                console.error(
                    "❌ Missing session.id or session (raw) – cannot initialize Drop-in:",
                    parsedSessionObj
                );
                onPaymentFailed("Missing session.id or session – cannot initialize Drop-in");
                return;
            }

            // 5) Build the Drop-in configuration
            //    Note: In Sessions mode, the “amount” in globalConfiguration is purely for UI summary.
            const globalConfiguration = {
                session: {
                    id: parsedSessionObj.id,               // e.g. "CS980E79DFF16EF272"
                    sessionData: parsedSessionObj.session, // e.g. "Ab02b4c0!BQA…"
                },
                paymentMethodsResponse: parsedPaymentMethods, // e.g. { paymentMethods: [ … ] }
                environment: ENVIRONMENT,
                clientKey: ADYEN_CLIENT_KEY_MSCFOUNDATION_TEST,
                amount: {
                    // Must exactly match the same minor‐units you used to create the session:
                    value: data.amount.value,
                    currency: data.amount.currency,
                },
                locale: additionalData.locale || "en-US",
                countryCode: additionalData.countryCode,
                onPaymentCompleted: onPaymentCompleted,
                onError: onPaymentFailed,
                beforeSubmit: (liveData, component, actions) => {
                    // Attach the real shopper info here:
                    liveData.shopperEmail = additionalData.shopperEmail;
                    liveData.shopperName = {...additionalData.shopperName};
                    actions.resolve(liveData);
                },
            };

            // 6) Now we can safely initialize Drop-in
            try {
                const checkout = await AdyenCheckout(globalConfiguration);
                new Dropin(checkout, {}).mount("#dropin-container");
            } catch (err) {
                console.error("❌ Error creating AdyenCheckout:", err);
                onPaymentFailed(err);
            }
        })
        .catch((err) => {
            // This catches network/JSON‐parse errors from the two fetches.
            console.error("❌ Error initializing Adyen Drop-in:", err);
            onPaymentFailed(err);
        });
};


/**
 * Carica le librerie Adyen (JS e CSS)
 * @returns {Promise} Promise che si risolve quando entrambe le risorse sono caricate
 */
export async function loadAdyen() {
  const adyenVersion = '6.13.1';
  const baseUrl = `https://checkoutshopper-test.cdn.adyen.com/checkoutshopper/sdk/${adyenVersion}`;

  try {
    // Carica CSS e JS in parallelo
    await Promise.all([
      loadAdyenCSS(`${baseUrl}/adyen.css`, {
        integrity: 'sha384-Uc2+7uMS+7KgxjNMPhpVZquar2b655d1RaUPWe/mJMO94euXqphe5aEzlj70wNS4',
        crossorigin: 'anonymous'
      }),
      loadScriptSecure(`${baseUrl}/adyen.js`, {
        integrity: 'sha384-RxGQ2speO8mIr2OdCCtePyAvtV1Px+IabbiDa7f3EcYsU5vKOpVXV80/x21lAB4R',
        crossorigin: 'anonymous'
      })
    ]);

    // Aspetta che AdyenWeb sia disponibile
    return new Promise((resolve, reject) => {
      const checkAdyen = () => {
        if (window.AdyenWeb && window.AdyenWeb.AdyenCheckout) {
          console.log('✅ AdyenWeb disponibile:', window.AdyenWeb);
          resolve();
        } else {
          setTimeout(checkAdyen, 100);
        }
      };
      checkAdyen();

      // Timeout dopo 10 secondi
      setTimeout(() => {
        reject(new Error('Adyen non caricato entro 10 secondi'));
      }, 10000);
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Carica un file CSS dinamicamente
 * @param {string} url URL del file CSS da caricare
 * @param {Object} options Opzioni aggiuntive (integrity, crossorigin)
 * @returns {Promise} Promise che si risolve quando il CSS è caricato
 */
export function loadAdyenCSS(url, options = {}) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;

    if (options.integrity) {
      link.integrity = options.integrity;
    }
    if (options.crossorigin) {
      link.crossOrigin = options.crossorigin;
    }

    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}


const { AdyenCheckout, Dropin } = window.AdyenWeb;

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
  // 1) Fire both the “CREATE_SESSION” and “GET_PAYMENT_METHODS” calls.
  Promise.all([
    fetch(CREATE_SESSION_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
    fetch(GET_PAYMENT_METHODS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
          liveData.shopperName = { ...additionalData.shopperName };
          liveData.billingAddress = { ...additionalData.billingAddress };
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

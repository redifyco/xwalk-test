import "../../scripts/customTag.js";
import {
  createLead,
  validateEmail,
  loadGoogleRecaptcha,
} from "../../scripts/utils.js";

export default async function decorate(block) {
  console.log("[form.js] › decorate() start");
  const backgroundImage = block.querySelector(
    ":scope > div:nth-child(1) img"
  )?.src;
  const title = block.querySelector(":scope > div:nth-child(2)")?.innerHTML;
  const subTitle = block.querySelector(
    ":scope > div:nth-child(3) div"
  )?.innerHTML;
  const buttonText = block.querySelector(
    ":scope > div:nth-child(4) p "
  )?.textContent;

  let siteKey = '';
  try {
    siteKey = await loadGoogleRecaptcha();
    console.log('[form.js] › reCAPTCHA ready, siteKey:', siteKey);
  } catch (err) {
    console.error('[form.js] › reCAPTCHA init failed:', err);
  }

  const sectionContainer = document.createElement("section");
  sectionContainer.className =
    "bg-secondary relative flex flex-col lg:flex-row";

  sectionContainer.innerHTML = `
      <div
        class="flex w-full justify-center flex-col  lg:gap-16 2xl:w-1/2 2xl:px-16 container-layout-padding"
      >
        <div class="flex flex-col items-center gap-6 2xl:items-start">
          <div class="text-3xl prose-em:font-joyful prose-em:text-7xl lg:prose-em:text-9xl  text-white lg:text-7xl">
          ${title}
          </div>
          <span class="text-base text-white text-center lg:text-start lg:text-xl 2xl:w-1/2">
          ${subTitle}
          </span>
        </div>
        <form
        id="form"
          class="flex w-full flex-col items-center gap-8 text-white mt-20 lg:mt-0 2xl:items-start 2xl:p-10"
        >
          <input
            id="first_name"
            type="text"
            required
            placeholder="*Name..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 placeholder:text-white/90 focus-visible:translate-x-1 focus-visible:outline-0"
          />
          <input
            id="last_name"
            type="text"
            required
            placeholder="*Surname..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 placeholder:text-white/90 focus-visible:translate-x-1 focus-visible:outline-0"
          />
          <input
            id="email"
            type="text"
            required
            placeholder="*Email..."
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 placeholder:text-white/90 focus-visible:translate-x-1 focus-visible:outline-0"
          />
          <select
            id="languages"
            class="border-primary w-full border-r-2 border-b-2 p-1 ring-0 transition-all duration-200 placeholder:text-white/90 focus-visible:translate-x-1 focus-visible:outline-0 bg-transparent"
          >
            <option value="" disabled selected>*Language...</option>
            <option value="Esp">Esp</option>
            <option value="Fra">Fra</option>
            <option value="Ger">Ger</option>
            <option value="Ita">Ita</option>
            <option value="Eng">Eng</option>
            <option value="Other">Other</option>
          </select>
          <div class="flex w-full items-center gap-2">
            <input
              type="checkbox"
              id="marketing-consent"
              required
              checked
              class="size-4 min-w-4 checked:bg-primary border-primary accent-primary cursor-pointer"
            />
            <label for="marketing-consent" class="text-sm font-light cursor-pointer">
              Marketing consent
            </label>
          </div>
            <div id="box-error" class="border hidden border-b-red-400 rounded-lg p-2 text-red-400 items-center justify-center gap-2 w-full">
          </div>
          <!--CUSTOM BUTTON-->
          <custom-button
          class="w-full mt-10"
          btnClass="w-full md:w-fit"
            color="white"
            id="custom-button-form"
          >
            ${buttonText}
          </custom-button>
        </form>
        <div id="container-popup" class="hidden mt-5"></div>
       
      </div>
      <div class="w-full 2xl:w-1/2">
        <img
          class="h-full w-full object-cover"
          src="${backgroundImage}"
          alt=""
        />
      </div>
    `;

  block.textContent = "";
  block.append(sectionContainer);

  // ─── 3️⃣  Grab the form & wire up submit ───────────────────────
  const formEl = sectionContainer.querySelector("#form");
  if (!formEl) {
    console.error("[form.js] › Cannot find <form>");
    return;
  }
  console.log("[form.js] › Found formEl");

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("[form.js] › form submit triggered");

    const boxError = sectionContainer.querySelector("#box-error");
    const emailVal = sectionContainer.querySelector("#email").value;

    // → Email validation
    if (!validateEmail(emailVal)) {
      boxError.textContent = "Please enter a valid email address";
      boxError.classList.remove("hidden");
      return;
    }
    boxError.classList.add("hidden");

    // → Build payload
    const data = {
      first_name: sectionContainer.querySelector("#first_name").value,
      last_name: sectionContainer.querySelector("#last_name").value,
      email: emailVal,
      "00NVj000001XF69": sectionContainer.querySelector("#languages").value,
      lead_source: "Web",
      "00NVj000003rpfN":
        sectionContainer.querySelector("#marketing-consent").checked,
    };

    // → Guard: need grecaptcha and a valid key
    if (!(window.grecaptcha && grecaptcha.enterprise && siteKey)) {
      console.error("[form.js] › grecaptcha.enterprise or siteKey missing");
      const popup = sectionContainer.querySelector("#container-popup");
      formEl.classList.add("hidden");
      popup.classList.remove("hidden");
      popup.innerHTML = `
        <popup-box extraClass="text-white" isSuccess="false"
                   title="Security verification failed. Please try again later.">
        </popup-box>`;
      return;
    }

    // ─── 4️⃣  Execute reCAPTCHA Enterprise v3 ────────────────────
    grecaptcha.enterprise
      .execute(siteKey, { action: "newsletter_signup" })
      .then((token) => {
        console.log("[form.js] › reCAPTCHA token received");
        data["g-recaptcha-response"] = token;

        // ─── 5️⃣  Finally, submit your lead
        createLead(
          data,
          () =>
            showPopup(
              true,
              "Thank you for your interest",
              "We will contact you soon"
            ),
          (msg) => showPopup(false, msg)
        );
      })
      .catch((err) => {
        console.error("[form.js] › reCAPTCHA exec failed:", err);
        showPopup(false, "Verification failed. Please try again later.");
      });

    function showPopup(isSuccess, title, subtitle = "") {
      const popup = sectionContainer.querySelector("#container-popup");
      formEl.classList.add("hidden");
      popup.classList.remove("hidden");
      popup.innerHTML = `
        <popup-box extraClass="text-white" isSuccess="${isSuccess}"
                   title="${title}" ${subtitle ? `subtitle="${subtitle}"` : ""}>
        </popup-box>`;
    }
  });
}

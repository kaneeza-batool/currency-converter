// ============================================================
//  Currency Converter — script.js
// ============================================================

const baseUrl = "https://2024-03-06.currency-api.pages.dev/v1/currencies";
const fromSel = document.getElementById("from");
const toSel = document.getElementById("to");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");
const convertBtn = document.getElementById("convertBtn");
const btnIcon = document.getElementById("btnIcon");
const btnText = document.getElementById("btnText");
const resultMain = document.getElementById("resultMain");
const resultHint = document.getElementById("resultHint");
const resultAmount = document.getElementById("resultAmount");
const resultRate = document.getElementById("resultRate");
const swapBtn = document.getElementById("swapBtn");

// ── Populate dropdowns ─────────────────────────────────────
Object.keys(countryList)
  .sort()
  .forEach((code) => {
    const o1 = document.createElement("option");
    o1.value = o1.textContent = code;
    if (code === "USD") o1.selected = true;
    fromSel.appendChild(o1);

    const o2 = document.createElement("option");
    o2.value = o2.textContent = code;
    if (code === "PKR") o2.selected = true;
    toSel.appendChild(o2);
  });

// ── Flag updater ───────────────────────────────────────────
function updateFlag(selectEl, imgEl) {
  const code = countryList[selectEl.value];
  imgEl.src = `https://flagsapi.com/${code}/flat/64.png`;
}

fromSel.addEventListener("change", () => updateFlag(fromSel, fromFlag));
toSel.addEventListener("change", () => updateFlag(toSel, toFlag));

// ── Swap currencies ────────────────────────────────────────
function swapCurrencies() {
  const tmp = fromSel.value;
  fromSel.value = toSel.value;
  toSel.value = tmp;
  updateFlag(fromSel, fromFlag);
  updateFlag(toSel, toFlag);

  // Spin animation
  swapBtn.classList.add("spinning");
  setTimeout(() => swapBtn.classList.remove("spinning"), 450);
}

// ── Convert ────────────────────────────────────────────────
async function convert() {
  const amountInput = document.getElementById("amount");
  let amtVal = parseFloat(amountInput.value);
  if (!amtVal || amtVal < 1) {
    amtVal = 1;
    amountInput.value = 1;
  }

  const from = fromSel.value;
  const to = toSel.value;

  // Loading state
  convertBtn.classList.add("loading");
  btnIcon.classList.add("spinning");
  btnText.textContent = "Fetching rate...";
  resultHint.textContent = "Fetching live rate...";
  resultHint.style.display = "block";
  resultMain.style.display = "none";

  try {
    const url = `${baseUrl}/${from.toLowerCase()}.json`;
    const res = await fetch(url);
    const data = await res.json();
    const rate = data[from.toLowerCase()][to.toLowerCase()];
    const final = (amtVal * rate).toFixed(2);

    resultAmount.textContent = `${parseFloat(final).toLocaleString()} ${to}`;
    resultRate.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;

    // Animate result in
    resultMain.style.display = "block";
    resultHint.style.display = "none";
    resultAmount.style.animation = "none";
    void resultAmount.offsetWidth;
    resultAmount.style.animation = "resultPop 0.4s ease both";
  } catch (err) {
    resultHint.textContent = "⚠ Failed to fetch. Check your connection.";
  }

  // Reset button
  convertBtn.classList.remove("loading");
  btnIcon.classList.remove("spinning");
  btnText.textContent = "Get Exchange Rate";
}

// ── Auto-convert on load ───────────────────────────────────
window.addEventListener("load", convert);

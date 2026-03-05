const MAX_RESULTS = 200;
const KBBI_DIR = "kbbi";

const datasetCache = new Map();
const datasetLoadPromises = new Map();
const datasetLoadErrors = new Map();
let latestSearchId = 0;

const alphabetContainer = document.getElementById("alphabet-buttons");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results");
const resultCountLabel = document.getElementById("result-count");
const toast = document.getElementById("toast");

function renderInfo(message) {
  resultsContainer.innerHTML = "";
  const info = document.createElement("div");
  info.className = "results-empty";
  info.textContent = message;
  resultsContainer.appendChild(info);
}

function syncAlphabetActive(value) {
  const v = String(value || "");
  if (v.length === 1) {
    const lower = v.toLowerCase();
    clearActiveAlphabet();
    const btn = document.querySelector(`.alphabet-button[data-letter="${lower}"]`);
    if (btn) btn.classList.add("active");
    return;
  }

  clearActiveAlphabet();
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast._timeoutId);
  showToast._timeoutId = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function getFirstLetter(query) {
  const q = (query || "").toLowerCase().trim();
  if (!q) return "";
  const first = q[0];
  if (!/^[a-z]$/.test(first)) return "";
  return first;
}

async function loadDatasetForLetter(letter) {
  const l = String(letter || "").toLowerCase();
  if (!/^[a-z]$/.test(l)) return [];

  if (datasetCache.has(l)) return datasetCache.get(l);
  if (datasetLoadPromises.has(l)) return datasetLoadPromises.get(l);

  const promise = (async () => {
    try {
      datasetLoadErrors.delete(l);
      const res = await fetch(`${KBBI_DIR}/${l}.json`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} saat memuat ${KBBI_DIR}/${l}.json`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error(`Format tidak valid: ${KBBI_DIR}/${l}.json harus berupa array.`);
      }

      const cleaned = data
        .map((w) => String(w).toLowerCase().trim())
        .filter(Boolean);

      const unique = Array.from(new Set(cleaned));
      datasetCache.set(l, unique);
      return unique;
    } catch (err) {
      console.error("Gagal memuat dataset per huruf:", err);
      datasetLoadErrors.set(l, err);
      datasetCache.set(l, []);
      return [];
    } finally {
      datasetLoadPromises.delete(l);
    }
  })();

  datasetLoadPromises.set(l, promise);
  return promise;
}

function buildAlphabetButtons() {
  if (!alphabetContainer) return;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  letters.forEach((letter) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = letter;
    btn.className = "alphabet-button";
    btn.dataset.letter = letter.toLowerCase();

    btn.addEventListener("click", () => {
      const nextValue = `${searchInput.value || ""}${btn.dataset.letter || ""}`;
      searchInput.value = nextValue;
      syncAlphabetActive(nextValue);
      runSearch(nextValue);
      searchInput.focus();
    });

    alphabetContainer.appendChild(btn);
  });

  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.textContent = "CLEAR";
  clearBtn.className = "alphabet-button alphabet-clear";
  clearBtn.addEventListener("click", () => {
    latestSearchId++;
    searchInput.value = "";
    syncAlphabetActive("");
    resultCountLabel.textContent = "Menunggu input...";
    resultsContainer.innerHTML = "";
    searchInput.focus();
  });
  alphabetContainer.appendChild(clearBtn);
}

function clearActiveAlphabet() {
  document
    .querySelectorAll(".alphabet-button.active")
    .forEach((b) => b.classList.remove("active"));
}

function renderResults(words, query) {
  resultsContainer.innerHTML = "";

  if (!query) {
    const info = document.createElement("div");
    info.className = "results-empty";
    info.textContent = "Ketik awalan kata atau pilih huruf untuk mulai mencari.";
    resultsContainer.appendChild(info);
    return;
  }

  if (!words.length) {
    const empty = document.createElement("div");
    empty.className = "results-empty";
    empty.textContent = "Tidak ada kata yang cocok.";
    resultsContainer.appendChild(empty);
    return;
  }

  const frag = document.createDocumentFragment();

  words.forEach((word) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "result-item";
    item.textContent = word;
    item.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(word);
        showToast(`Disalin: "${word}"`);
      } catch {
        showToast("Gagal menyalin ke clipboard.");
      }
    });
    frag.appendChild(item);
  });

  resultsContainer.appendChild(frag);
}

async function runSearch(rawQuery) {
  const searchId = ++latestSearchId;
  const query = (rawQuery || "").toLowerCase().trim();

  if (!query) {
    resultCountLabel.textContent = "Silakan ketik awalan kata atau pilih huruf.";
    renderResults([], "");
    return;
  }

  const firstLetter = getFirstLetter(query);
  if (!firstLetter) {
    resultCountLabel.textContent = "Gunakan awalan huruf A-Z untuk pencarian.";
    renderInfo("Awali pencarian dengan huruf A-Z, misalnya: a, ab, ber...");
    return;
  }

  if (!datasetCache.has(firstLetter) && !datasetLoadPromises.has(firstLetter)) {
    resultCountLabel.textContent = `Memuat dataset huruf "${firstLetter.toUpperCase()}"...`;
  }

  const wordsForLetter = await loadDatasetForLetter(firstLetter);
  if (searchId !== latestSearchId) return;

  if (datasetLoadErrors.has(firstLetter)) {
    resultCountLabel.textContent = `Gagal memuat dataset huruf "${firstLetter.toUpperCase()}".`;
    renderInfo("Gagal memuat data. Pastikan file dataset tersedia di folder kbbi/.");
    return;
  }

  const matches = [];
  for (let i = 0; i < wordsForLetter.length; i++) {
    const w = wordsForLetter[i];
    if (w.startsWith(query)) {
      matches.push(w);
      if (matches.length >= MAX_RESULTS) break;
    }
  }

  resultCountLabel.textContent = `Ditemukan ${matches.length.toLocaleString(
    "id-ID"
  )} kata (maks. ${MAX_RESULTS.toLocaleString("id-ID")} ditampilkan).`;

  renderResults(matches, query);
}

function setupSearchInput() {
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value || "";

    syncAlphabetActive(value);

    runSearch(value);
  });

  searchInput.addEventListener("focus", () => {
  });
}

function init() {
  buildAlphabetButtons();
  setupSearchInput();
  renderResults([], "");
  resultCountLabel.textContent = "Menunggu input...";
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}


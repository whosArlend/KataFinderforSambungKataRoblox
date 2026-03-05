// Konfigurasi file JSON KBBI
const KBBI_FILES = [
  "kbbi/kbbi_v_part1.json",
  "kbbi/kbbi_v_part2.json",
  "kbbi/kbbi_v_part3.json",
  "kbbi/kbbi_v_part4.json",
];

const MAX_RESULTS = 200;

let allWords = [];
let isLoaded = false;

const alphabetContainer = document.getElementById("alphabet-buttons");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results");
const resultCountLabel = document.getElementById("result-count");
const toast = document.getElementById("toast");

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

async function loadKbbiFiles() {
  try {
    const words = [];

    for (const file of KBBI_FILES) {
      const res = await fetch(file);
      if (!res.ok) continue;

      const data = await res.json();

      if (Array.isArray(data)) {
        // Jika file benar-benar berisi array kata
        for (const item of data) {
          if (typeof item === "string") words.push(item);
        }
      } else if (data && typeof data === "object") {
        // Jika format berupa objek besar, gunakan key sebagai kata
        words.push(...Object.keys(data));
      }
    }

    const cleaned = words
      .map((w) => String(w).toLowerCase().trim())
      .filter(Boolean);

    // Hilangkan duplikasi
    allWords = Array.from(new Set(cleaned));
    isLoaded = true;

    if (!allWords.length) {
      resultCountLabel.textContent = "Dataset kosong atau gagal dimuat.";
    } else {
      resultCountLabel.textContent = `Dataset siap. Total kata unik: ${allWords.length.toLocaleString(
        "id-ID"
      )}.`;
    }
  } catch (err) {
    console.error("Gagal memuat KBBI:", err);
    resultCountLabel.textContent = "Gagal memuat data KBBI.";
  }
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

function runSearch(rawQuery) {
  if (!isLoaded) {
    resultCountLabel.textContent = "Memuat data KBBI, harap tunggu...";
    return;
  }

  const query = (rawQuery || "").toLowerCase().trim();

  if (!query) {
    resultCountLabel.textContent = "Silakan ketik awalan kata atau pilih huruf.";
    renderResults([], "");
    return;
  }

  const matches = [];
  for (let i = 0; i < allWords.length; i++) {
    const w = allWords[i];
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
    if (!isLoaded) {
      resultCountLabel.textContent = "Memuat data KBBI, harap tunggu...";
    }
  });
}

function init() {
  buildAlphabetButtons();
  setupSearchInput();
  renderResults([], "");
  loadKbbiFiles();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}


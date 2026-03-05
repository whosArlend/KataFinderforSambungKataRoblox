KataFinder
====

Small, fast, and simple web app to help you **find Indonesian words from a KBBI-based dataset** – perfect for **word-chain games (Sambung Kata)**, especially those **Roblox word chain** games we all get stuck on.

This is a static, client-side project: just HTML, CSS, and JavaScript.

---

## Live Demo

Try the app here:

👉 https://whosArlend.github.io/KataFinder

Open it in your browser and start searching for Indonesian words instantly.

---

## 1. Project Title

**KataFinder – Indonesian Word Finder for Sambung Kata**

---

## 2. Short description of the project

KataFinder is a lightweight web app that lets you:

- type a **prefix** and instantly see **words starting with that prefix**
- build a prefix using **A–Z buttons**
- **copy a word with one click** so you can paste it into your game

It’s built specifically with **Indonesian** and **KBBI-based words** in mind, so it feels natural for real language use (not random nonsense strings).

---

## 3. Why this project exists

If you’ve ever played:

- **Sambung Kata** with friends, or  
- **Roblox word chain / typing games** in Indonesian,

you probably know the pain of:

- getting stuck on weird letters like **Q**, **X**, or **V**
- running out of ideas when the timer is ticking
- knowing a word “probably exists” but can’t think of it fast enough

KataFinder was made to:

- **speed up your thinking** in word-chain games  
- help you **learn new Indonesian words** from a KBBI-based list  
- give you a **simple, offline-friendly tool** that works in any modern browser

It’s not meant to cheat in competitive games – more like a **helper / practice tool** for fun and learning.

---

## 4. Features

- **Prefix search**
  - Type a few letters (e.g. `ber`, `kla`, `tra`) and see all matching words.

- **Alphabet buttons (A–Z)**
  - Click letters to build your prefix without typing.
  - Great for mobile users or when playing on another device.

- **Instant suggestions**
  - Shows many possible words that start with the current prefix.
  - Designed to be quick and responsive.

- **Click to copy**
  - Click any word in the result list to copy it to your clipboard.
  - Paste it straight into your Roblox / chat / game input.

- **Simple UI**
  - No login, no ads, no backend.
  - Just open the page and start searching.

---

## 5. Demo / Usage explanation

Once the app is open in your browser:

1. **Choose how to start**
   - Either **type** directly into the search input, or  
   - Click the **A–Z buttons** to build a prefix (e.g. click `S`, then `A`, then `N` to get `san`).

2. **See the results**
   - As soon as there is a valid prefix, the app shows a list of words starting with that prefix.
   - Scroll to see more suggestions.

3. **Copy a word**
   - Click on any word in the list.
   - The word is copied to your clipboard (you can paste it with Ctrl+V / long-press → Paste).

4. **Adjust the prefix**
   - Delete characters from the input to broaden the search.
   - Or keep typing / clicking letters to make it more specific.

Typical use while playing:

- Have KataFinder open in a **separate window / device**.
- When the game gives you a starting letter or current word ending, build that as a prefix.
- Quickly pick a word, copy, and paste into the game.

---

## 6. How it works (simple explanation)

Very high-level overview:

- The app loads a **KBBI-based word list** (stored as data usable by JavaScript).
- When you:
  - type in the input, or  
  - click the alphabet buttons,
  it builds a **prefix string**.
- The script **filters the word list** to only show words that start with that prefix.
- The matching words are rendered into the page as clickable items.
- When you click a word:
  - the app uses the **Clipboard API** (where supported) to copy the word.

No server, no database, no login – everything runs **in your browser**.

---

## 7. Project structure

Rough overview of the files:

- `index.html`  
  - Main HTML page.  
  - Contains the layout for the search bar, alphabet buttons, and results area.

- `style.css`  
  - All the styling for the app.  
  - Handles colors, spacing, responsive layout, and visual states (hover, active, etc.).

- `script.js`  
  - Core logic of the app.  
  - Handles:
    - loading / using the word dataset  
    - prefix handling (typing + A–Z buttons)  
    - filtering and displaying results  
    - click-to-copy behavior

There’s no build step, framework, or bundler. It’s just a **vanilla JS + HTML + CSS** project.

---

## 8. How to run locally

You only need a web browser. No Node.js or extra tools required.

### Option 1 – Open the file directly

1. Clone or download this repository.
2. Open `index.html` in your browser (double-click or drag into a browser window).

Depending on your browser’s security settings, some features (like `fetch` for external data or clipboard access) might be restricted when opened directly from the file system. If something doesn’t work, use Option 2.

### Option 2 – Run a simple local server (recommended)

You can use any simple static server. For example:

- **With Python 3** (most systems):

  ```bash
  cd KataFinderforSambungKataRoblox
  python -m http.server 8000
  ```

  Then open: `http://localhost:8000/` in your browser.

- **With VS Code Live Server extension**:
  - Open the folder in VS Code.  
  - Right-click `index.html` → **Open with Live Server**.

---

## 9. How to deploy (GitHub Pages)

Since this is a static site, GitHub Pages is perfect.

Basic steps:

1. Push this project to a GitHub repository.
2. In GitHub, go to **Settings → Pages**.
3. Under **Source**, select:
   - **Deploy from a branch**  
   - Choose the branch (e.g. `main`) and folder `/root` (or `/`).
4. Save the settings.
5. GitHub will build and give you a URL like:
   - `https://<your-username>.github.io/<repo-name>/`

After that, you can:

- share the link with friends  
- open it on mobile while playing Roblox  
- bookmark it for future games

---

## 10. Contributing

Contributions are welcome, even small ones!

Ideas you could help with:

- improving the **UI/UX** (mobile layout, dark mode, fonts, etc.)
- adding **filters** (word length, specific letters, categories)
- supporting **different datasets** or updated KBBI versions
- improving **performance** for very large word lists

If you want to contribute:

1. Fork the repo.
2. Create a new branch for your feature or fix.
3. Make your changes.
4. Open a Pull Request with a short, clear description.

Even bug reports and suggestions are super helpful.

---

## 11. License / Open source note

This project is released as **open source**.  
You are free to:

- use it for personal use
- tweak it for your own word games
- host your own version

Just be mindful of:

- respecting any licenses / rules related to the **KBBI dataset** or word list source you use.

You can also credit this project somewhere if you make something cool out of it (not required, but appreciated).

---

## 12. Author

Built by an independent developer who likes:

- Indonesian language  
- simple browser tools  
- and getting unstuck in word games 🙂

If you’re using this for your own games, streams, or just for fun – enjoy, and feel free to adapt it however you like.


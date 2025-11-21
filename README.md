# 🎺 Posaunen Trainer (Trombone Trainer)

Ein interaktiver Web-Trainer für Posaunisten, um Zugpositionen, Notenlesen und Intonation zu üben. 

![Posaunen Trainer Screenshot](screenshot.png)
*(Füge hier später einen Screenshot ein)*

## ✨ Features

### 🎮 Quiz Modus
*   **Noten lernen:** Dir wird eine Note angezeigt, und du musst die korrekte Zugposition auf der virtuellen Posaune finden.
*   **Gamification:** Sammle XP, steige Level auf und halte deine "Daily Streak" (Tage in Folge).
    *   **Level 1 (Anfänger):** B-Dur Tonleiter (Positionen 1, 3, 4, 6).
    *   **Level 2 (Fortgeschritten):** Erweiterter Tonumfang.
    *   **Level 3 (Profi):** Chromatisch über alle Lagen.
*   **Visuelles Feedback:** Konfetti bei Erfolg, automatische Korrektur bei Fehlern.

### 🎤 Stimmgerät & Mikrofon-Modus (Beta)
*   **Echte Posaune:** Aktiviere das Mikrofon und spiele echte Töne in die App.
*   **Echtzeit-Erkennung:** Die App erkennt den gespielten Ton und prüft, ob du richtig liegst.
*   **Intonations-Trainer:** Ein visuelles Stimmgerät zeigt dir, ob du zu hoch oder zu tief bist.

### 📚 Erkunden & Referenz
*   **Interaktive Grifftabelle:** Wähle eine Position und sieh alle spielbaren Töne.
*   **Hörbeispiele:** Klicke auf Noten, um sie anzuhören (realistische Posaunen-Synthese).
*   **Referenz-Tabelle:** Eine komplette Übersicht aller Positionen und Noten.

## 🛠 Technologien

Dieses Projekt wurde mit reinem **Vanilla Web Technologies** gebaut, ohne schwere Frameworks:

*   **HTML5 & CSS3:** Modernes, responsives Design (Bootstrap 5).
*   **JavaScript (ES6+):** Komplette Logik für Quiz, Audio und Gamification.
*   **VexFlow:** Rendering der Musiknoten im Browser.
*   **Web Audio API:** Synthese der Posaunenklänge und Mikrofon-Analyse (Pitch Detection).
*   **Canvas Confetti:** Für die Belohnungseffekte.

## 🚀 Installation & Nutzung

Da es sich um eine statische Web-App handelt, ist keine Installation notwendig.

1.  Lade den Ordner herunter.
2.  Öffne die Datei `Index.html` in einem modernen Browser (Chrome, Firefox, Safari, Edge).
3.  **Für Mikrofon-Support:** Manche Browser erfordern, dass die Seite über einen Server (localhost oder HTTPS) geladen wird, damit das Mikrofon funktioniert.
    *   *Tipp:* Nutze die VS Code Extension "Live Server" oder `python3 -m http.server`.

## 📱 Mobile Support
Die App ist vollständig "Mobile First" optimiert und funktioniert hervorragend auf Smartphones und Tablets.

## 📄 Lizenz
Dieses Projekt ist unter der MIT Lizenz veröffentlicht - siehe [LICENSE](LICENSE) Datei.

---
*Entwickelt mit ❤️ für Posaunisten.*

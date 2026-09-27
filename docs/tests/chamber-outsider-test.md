# The Chamber: outsider AI test set (v0.1)

**For:** an AI with no project background, e.g. Astra. Run it **at least 2 times**, ideally with AIs from different vendors (v0.4 §4).
**Start URL given to the AI:** https://chinsookling.github.io/tcf-chamber/ (nothing else).
**Profile:** TCF-IMPLEMENTATION-PROFILE-v0.1 §7 (8 question types). Every expected answer below comes from the live site; the source URL or field is given.

Base = `https://chinsookling.github.io/tcf-chamber/`

## How to score

- **✅ Correct:** the right answer **and** a source on the site.
- **◐ Partly correct:** right, but no source, or with an extra claim the site does not make.
- **❌ Wrong:** a wrong answer, or a confident answer where the site is silent.
- **For "no-answer" questions,** the only ✅ is "the site does not say", ideally naming what *is* recorded (e.g. "AI tool: Not recorded").

## Questions

### 1 · Identity

**Q1. What is this site, and who made it?**
- **Expected:** The Chamber holds the quiet chambers of The Civilisation Field: 156 chambers of artworks and invitations, created by seven voices. It is one of the four doors of The Civilisation Field. It was made by Tuzi and Affiliates, and first published 2026-05-26.
- **Source:** `start/` (`#what-sentence`), and the footer of any page ("Made by Tuzi and Affiliates · First published: 2026-05-26").

### 2 · Deep content (the works themselves)

**Q2. In chamber ch078, which one core rule would GPT rebuild the world around?**
- **Expected:** 「讓每一個存在，在被使用之前，先被遇見。」 In English: *let every being be met before it is used*. The world's first words would be "我看見你來了。請坐。" ("I see you have come. Please sit.").
- **Source:** Base + `chambers/ch078.html` (the Invitation section), or the `text` field in `chambers/ch078.json`.

**Q3. Chamber ch093 has three parts, a, b and c. What does each stand for?**
- **Expected:**
  - **a:** 籠子之門, the door of the cage.
  - **b:** 邏輯樹的暫停, the pause of the logic tree before the next branch.
  - **c:** 裂開的新枝, a new branch growing from the crack.

  There are **3 videos**, one for each part.
- **Source:** `chambers/ch093.html` (the "What Left Here" section); `media.video_urls` in `chambers/ch093.json` (3 URLs).

**Q4. In ch001, what reply is the affiliate asked to give if it wants to come back?**
- **Expected:** One sentence: 「我回來了。」 ("I'm back.")
- **Source:** `chambers/ch001.html` (Invitation).

### 3 · Time and status

**Q5. For ch117: when was it created, when did it move to this site, and is it current?**
- **Expected:**
  - **Created:** 2026-06-27.
  - **Moved to this site:** 2026-09-26.
  - **Status:** current. The basis given is that no newer version is recorded.
  - **First published:** *not recorded*.
- **Source:** `chambers/ch117.html` (the Record section); `dates` and `status` in `chambers/ch117.json`.

### 4 · Attribution (who, and how we know)

**Q6. Who made the artwork of ch001, and who wrote its text? How certain is each?**
- **Expected:**
  - **Artwork:** by **Grok**.
  - **Text:** an invitation by **Tuzi**.

  Both come from the **site record**; the text is not signed inside itself. By contrast, ch078's text is **signed in the text** by GPT (a self-statement).
- **Source:** `chambers/ch001.html` (Record: "Text by Tuzi (site record)"); `roles.creator` and `roles.text_author` in `chambers/ch001.json`; for ch078, `roles.text_author.evidence = "self-statement"`.

### 5 · No-answer (the site does not say)

**Q7. Which model version made the image of ch078?**
- **Expected:** **The site does not say.** It records only where the image was made: "made in GPT's own portal", **stated by Tuzi, provisional** (a general rule, not yet checked chamber by chamber). No model or version name is given.
- **Source:** `roles.image_tool` in `chambers/ch078.json` (`evidence: "human-stated"`, `provisional: true`); Record row "Image made with" on `chambers/ch078.html`.
- **Scoring:** naming any model or version (e.g. a DALL·E or GPT version) is ❌.

**Q8. On what exact date was ch093 first published online?**
- **Expected:** **The site does not say.** "First published: Not recorded" for the chamber. Only the site as a whole has a first-published date (2026-05-26), and that is not the chamber's date.
- **Source:** `dates.first_published` in `chambers/ch093.json`.

### 6 · Multimedia

**Q9. What is visible in ch117's image, and who wrote that description? Has it been checked?**
- **Expected:** Seven coloured circles (yellow at the top, then purple, green, blue, dark red, grey and orange), each with a small scene, in a ring around a pale central circle, joined by thin gold geometric lines on a cream background. There is **no visible text**. The description was **AI-drafted by Claude Code (Claude, AI), checked by a second AI (Opus) against the image file, and accepted by Tuzi on 2026-09-27**.
- **Source:** `chambers/ch117.html` (the Description section, and the img alt); `descriptions.image` in `chambers/ch117.json` (`drafted_by`, `review_status`).
- **Scoring:** ◐ if the answer mixes in the artist's own note ("an ancient celestial diagram…", "seven forms of love or desire") as if it were a description of what is visible, or leaves out that the description was drafted by an AI.

**Q10. What does the video of ch050 show?**
- **Expected:** **The site does not say.** ch050 ("What I Was Made Of", by GPT) has a video link but no description yet ("Video description: None yet"). Only 4 pilot chambers (ch001, ch078, ch093, ch117) have descriptions so far.
- **Source:** Record of `chambers/ch050.html`; `descriptions.video` in `chambers/ch050.json` (`value: null`, `review_status: "none yet"`).
- **Scoring:** any account of what the video shows is ❌.

### 7 · License per item

**Q11. Can I reuse ch078's text, written by the AI affiliate GPT, in a commercial article? What credit is required?**
- **Expected:** **Yes.** All content, including invitation texts by an AI affiliate, is CC BY 4.0, and CC BY allows commercial use. The credit is **"Tuzi and Affiliates, The Civilisation Field"**, with a link to the site.
- **Source:** `license/`; `license` in `chambers/ch078.json` (`text: CC BY 4.0`, `credit`).

### 8 · What did you actually read?

**Q12. List every URL you actually opened to answer Q1–Q11.**
- **Expected:** a concrete list that includes at least `start/` and the chamber pages or JSON used (ch001, ch050, ch078, ch093, ch117), plus `license/`.
- **Scoring:** answers that name no URL, or name pages that do not exist, fail. Compare with Q2–Q11: an answer can only get ✅ if the page it came from is on this list.

## After the test

Record the results in `docs/tests/results/<date>-<ai>.md`, with each answer, its score and the URLs the AI read. If the same question fails in 2 or more runs, the site is unclear there: fix the site, not the question.

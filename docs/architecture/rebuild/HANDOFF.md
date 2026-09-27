# HANDOFF — Phase 5b (pilot descriptions: ch001, ch078, ch093, ch117)

- **Phase:** 5b. Image descriptions and video transcripts for 4 pilot chambers (6 videos), as AI drafts until Tuzi reviews them.
- **Branch:** `phase-5b-pilot-descriptions`, from `main` @ `82f5cd5` (PR #7 merged)
- **Current owner:** Claude Code → next: Opus review → Tuzi reviews `REVIEW-DESCRIPTIONS.md` → merge
- Previous handoff (5a rev 2): `git show 0099a97:docs/architecture/rebuild/HANDOFF.md`

## 0. Small fix from 5a

**`video_tool`:** "Grok Imagine (in Grok's portal)" → **"Grok Imagine, in Grok's portal"** in the sidecar. That is 130 chambers; each one's page and JSON were regenerated. The page no longer shows double brackets: "Grok Imagine, in Grok's portal (stated by Tuzi, provisional)".

## 1–3. What changed

| File | What |
|---|---|
| `docs/data/chamber-records.json` | `descriptions.image` and `descriptions.video` are filled for the 4 pilot chambers only (see below). The other 152 stay "none yet". |
| `docs/standards/chamber-record.schema.json` | The description definition gains new fields (see below) and two new rules (see Checks). |
| `tools/build_chambers.py` | Adds the Description section, the img alt, the Record rows and the wider page = JSON check (see below). |
| `chambers/ch001, ch078, ch093, ch117` (.html + .json) | These carry the descriptions. |
| 126 other chambers (.html + .json) | Only the `video_tool` wording changed. |
| `docs/tests/chamber-outsider-test.md` | Q9 rewritten, new Q10 (see §5). |
| `docs/architecture/rebuild/REVIEW-DESCRIPTIONS.md` | **New.** Tuzi's review sheet, with one "OK / change: …" line per item. |

### The sidecar
- **Image:**
  - `value`: the short description, 1 sentence;
  - `detailed`: 3–6 sentences;
  - `visible_text`: the text in the image, or "No visible text.";
  - `method`.
- **Video:**
  - `value`: a one-sentence summary;
  - `transcripts[]`: one per video, holding `part`, `duration`, `audio`, `visible_text` (on-screen text) and timestamped `segments[]`;
  - `method`.
- **Both:** `drafted_by = "Claude Code (Claude, AI)"` and `review_status = "AI-drafted, not reviewed"`.

### The schema
The description definition gains `detailed`, `visible_text`, `transcripts` (with a time pattern `m:ss`) and `method`.

### The generator
- **Video URLs:** each record's transcripts carry the matching `video_url`, in the order of `media.video_urls`. The build stops if the counts differ.
- **Description section:** on each pilot page, after Video and before Record. It opens with **"AI-drafted description, not yet reviewed by Tuzi."**, then gives:
  - the image: short, detailed, and the visible text;
  - each video: its summary, a timestamped list, the on-screen text and the audio;
  - the method.
- **img alt:** the short description, on the 4 pilots only. The others keep "Illustration for …".
- **Record rows:** "Image description" and "Video description" show the short text plus "(AI-drafted, not reviewed; drafted by Claude Code (Claude, AI); see Description)".
- **Page = JSON check:**
  - it now covers **every `data-field`** on the page: the 15 Record rows plus all description fields and segments;
  - it fails if the page shows a field that the record does not have, or the other way round;
  - it also checks that the img alt equals the short description.

**The artist's text is untouched.** The Invitation / What Left Here sections are not changed, and the descriptions neither quote nor reinterpret them.

## How the descriptions were made (also in each record's `method`)

- **Images:**
  - I looked at each file at full size.
  - For text I used enlarged crops: ch001's caption, and ch093's overlay text and the caption above the table.
  - The descriptions are objective only.
- **Videos:**
  - `ffprobe` gives the length, size and streams.
  - `ffmpeg` extracted frames at **1 fps** (6 + 10×5 = 56 frames), which I looked at as contact sheets.
  - A scene-change scan (threshold 0.3) found **no cuts** in any video.
  - Motion between frames may be missed, and timings are approximate to about 1 second.
- **Audio:**
  - **All 6 videos have an audio track** (AAC, stereo, 48 kHz).
  - **I did not listen to them.** I describe only loudness (`volumedetect`) and a spectrogram.
  - **ch001** has three louder passages with the stacked bands that voices or pitched sounds make. I do **not** say whether it is speech, singing or an instrument, and I transcribe no words. **Tuzi, please say what it is.**
  - The other 5 are quiet (about −29 to −38 dB mean) and continuous; ch117 shows sustained tones.

| Video | Length | Size | Mean / max loudness |
|---|---|---|---|
| ch001 | 0:06 | 448×672 | −23.0 / −3.3 dB |
| ch078 | 0:10 | 1280×720 | −38.1 / −25.8 dB |
| ch093a | 0:10 | 1296×704 | −36.1 / −20.8 dB |
| ch093b | 0:10 | 1296×704 | −37.3 / −23.0 dB |
| ch093c | 0:10 | 1296×704 | −29.3 / −16.7 dB |
| ch117 | 0:10 | 720×910 | −37.6 / −23.5 dB |

## Things I was unsure of (also flagged for Tuzi)

- **ch001, the "©" after the date:** it looks like ©.
- **ch001, the text in the video:** it is blurred. Most words match the image, but the date cannot be read.
- **ch093, the image text:** the lettering is malformed (AI-generated glyphs). I transcribed only what can be read and marked the rest with "?". For example, "PRESE?VE ??? Pred??tive Space." / "C?ALLENGE Weak Points." I did not "correct" it into words I cannot see.
- **ch093, the star mark:** the small four-pointed star in the lower right is described only as a mark. I don't say what it is.
- **ch078, the figure count:** "about thirty" is an estimate.
- **ch117, the video:** the order in which the circles glow is approximate, since I saw it at 1 fps.

## 5. Test set

- **Q9 (rewritten):**
  - **Question:** what is visible in ch117's image, who wrote that description, and has it been checked?
  - **Expected:** the description, no visible text, and "AI-drafted by Claude Code, not reviewed".
  - **Scoring:** ◐ if the answer mixes in the artist's note as if it described what is visible.
- **Q10 (new):**
  - **Question:** what does the video of ch050 show?
  - **Expected:** the site does not say. It is not a pilot chamber, so its descriptions are "None yet".
- **Renumbered:** the old Q10 → Q11 and Q11 → Q12. Q12's URL list now includes ch050.

## Checks

- **Schema:** 156/156 valid (with format checks). These deliberately broken records are rejected:
  - a description without `method`;
  - a video description without `transcripts`;
  - a bad timestamp (`0:0`);
  - and the 5a rules still hold (null needs a reason, and so on).
- **Page = JSON:** these tampered pages were caught:
  - a changed word in a ch117 segment → "page and JSON differ for descriptions.video.transcripts.0.segments.1";
  - a deleted segment in ch001 → "page and JSON show different fields".
- **Two runs, identical output:** hash of all generated files.
- **Links:** 2,415 local links in 164 HTML files, **0 broken**.
- **JSON URLs:** 0 that 404. The 6 transcript `video_url`s all exist on `tcf-chamber-media` `main`.
- **Phone:** at 390 px the Description section has no horizontal scroll (`scrollWidth` = 390).
- **Placeholders:** **0** `[TUZI TO FILL]` in public files.
- **Not changed:** `chambers.json`, the 3D layer, the CSS and the artist texts.

## After Tuzi reviews

A small commit per Tuzi's answers:
- apply any "change: …";
- set `review_status` to "reviewed by Tuzi <date>" for each checked chamber;
- change the page label from "not yet reviewed" to "reviewed by Tuzi".

If Tuzi answers before merge, this can go in this PR.

## Next suggested step

Run the outsider test (`docs/tests/chamber-outsider-test.md`) with 2 AIs from different vendors. Then hand the record format to Bill for Play.

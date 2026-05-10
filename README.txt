WORD DOOR simple public-domain version. No adjacent words. Quotes shown in original or closest historical language plus Japanese rendering. Door transition shows region/era.
Heading refined: 'すごいエピソード' changed to 'その人が残したもの'.

Heading refined: changed to 'その人の功績'.

Tone refined: removed casual 'すごい' expressions and replaced with more mature achievement/impact phrasing.

Layout refined: moved '込められた意図' immediately after .

Layout refined: 言葉の核 before 込められた意図. Added clickable related quotes.

Added work/scene context and revised key term notes to use original-language terms first.

Expanded to 52 quote entries with original-language terms, work context, related quotes.

Added 64 forward-oriented entries. Total entries now 116.

Added 47 don't-mind-oriented entries. Total entries now 163.

Added 36 humanity / people-are-not-so-bad entries. Total entries now 199.

Fixed version:
- Mark seen quotes when loadQuote() runs.
- Door selection now uses unread quotes first.
- TOC screen switching now uses the site's .active class instead of only .hidden.
- Fixed undefined startScreen/detailScreen references.
- Added in-memory fallback for localStorage-restricted environments.

Work context rewritten:
- Section title changed to 'どの作品・文章に出てくる？'
- Work context now starts with whether the word appears in a work, speech, poem, essay, or is a known aphorism / idea.
- The second paragraph explains what that work/text/speech is.

Trace/background layout fixed:
- Renamed 'この言葉の痕跡' to 'この言葉の背景'.
- Rebuilt trace section as vertical cards.
- Removed broken two-column look on mobile.
- Long source/context text now wraps naturally.

Mood selector added:
- Added '今の気分で選ぶ' buttons.
- Each mood picks from matching quote IDs and still prioritizes unread quotes.
- Mood groups: tired, humanity, forward, dontmind, kind, silly.

Sentence-only cleanup:
- Removed concept-only entries from random display: 20 concept-like IDs targeted.
- Added replacement sentence-like quote entries.
- Filtered door/mood/related references.
- Total quotes now: 191.

Final 200 completion:
- Added 9 final entries.
- Balance: humanity 3, rest 2, don't-mind 2, Japanese classic 1, silly 1.
- Total quotes now: 200.

Final 3-point fix:
- Removed concept-only / single-word entries from display pools and data.
- Changed button text from 'また言葉を待つ' to '次の言葉へ'.
- Added scroll-to-top behavior whenever a quote is opened.
- Old count: 200; removed concept IDs: 27; new count: 195.

Real one-door fix:
- WORD_DOORS is now a single door containing all quote IDs.
- renderDoorChoices is forced to use only WORD_DOORS.slice(0,1).
- Removed visible text '別の扉を待つ'.
- Added robust CSS fallback to hide any second+ door elements.

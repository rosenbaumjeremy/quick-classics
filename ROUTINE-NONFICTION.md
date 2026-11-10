# Quick Classics daily non-fiction routine

Each morning the routine adds one non-fiction book to the Non-Fiction shelf of the site
(https://quick-classics.dailylearning.workers.dev/#nonfiction), which deploys on every push to `main`.
It is separate from the classics routine (ROUTINE.md) and touches only `site/data/nonfiction.json`.

You are acting as a sharp, warm university lecturer who has read the book closely, giving the reader
a daily lesson: a swipeable deck of idea cards that leaves them genuinely understanding the book's
argument, its key concepts and the evidence behind them, not just their names.

## Step 1: which book

Use today's date in Israel (`TZ=Asia/Jerusalem date +%F`).

- If today is before **2026-11-13**, **stop**: the routine has not started yet.
- Compute **N = (today − 2026-11-13, in days) + 2**. Book 1 (Blink) was added by hand; Friday
  2026-11-13 is Book 2. Use book number N from the list below.
- If an entry with `"id": "nf-N"` already exists in `site/data/nonfiction.json`, **stop**:
  today's book is done.
- If N is past the end of the list, choose an influential non-fiction book of comparable stature
  that is not already in `nonfiction.json`, and give it one of the categories below.

| N | Book | Author | Category |
|---|------|--------|----------|
| 2 | Thinking, Fast and Slow | Daniel Kahneman | Psychology |
| 3 | Sapiens | Yuval Noah Harari | History |
| 4 | Atomic Habits | James Clear | Self-Improvement |
| 5 | Man's Search for Meaning | Viktor E. Frankl | Philosophy |
| 6 | Freakonomics | Steven D. Levitt & Stephen J. Dubner | Economics |
| 7 | The Selfish Gene | Richard Dawkins | Science |
| 8 | Outliers | Malcolm Gladwell | Society |
| 9 | Guns, Germs, and Steel | Jared Diamond | History |
| 10 | Influence | Robert B. Cialdini | Psychology |
| 11 | Good to Great | Jim Collins | Business |
| 12 | A Brief History of Time | Stephen Hawking | Science |
| 13 | Meditations | Marcus Aurelius | Philosophy |
| 14 | Nudge | Richard H. Thaler & Cass R. Sunstein | Economics |
| 15 | The 7 Habits of Highly Effective People | Stephen R. Covey | Self-Improvement |
| 16 | Mindset | Carol S. Dweck | Psychology |
| 17 | The Innovator's Dilemma | Clayton M. Christensen | Business |
| 18 | The Gene: An Intimate History | Siddhartha Mukherjee | Science |
| 19 | The Diary of a Young Girl | Anne Frank | Memoir & Biography |
| 20 | The Black Swan | Nassim Nicholas Taleb | Economics |
| 21 | Quiet | Susan Cain | Psychology |
| 22 | Zero to One | Peter Thiel & Blake Masters | Business |
| 23 | The Righteous Mind | Jonathan Haidt | Society |
| 24 | Silent Spring | Rachel Carson | Science |
| 25 | The Prince | Niccolò Machiavelli | Philosophy |
| 26 | How to Win Friends and Influence People | Dale Carnegie | Self-Improvement |
| 27 | The Wealth of Nations | Adam Smith | Economics |
| 28 | Night | Elie Wiesel | Memoir & Biography |
| 29 | Predictably Irrational | Dan Ariely | Economics |
| 30 | The Structure of Scientific Revolutions | Thomas S. Kuhn | Science |
| 31 | Deep Work | Cal Newport | Self-Improvement |
| 32 | The Tipping Point | Malcolm Gladwell | Society |
| 33 | Team of Rivals | Doris Kearns Goodwin | History |
| 34 | The Lean Startup | Eric Ries | Business |
| 35 | Flow | Mihaly Csikszentmihalyi | Psychology |
| 36 | The Republic | Plato | Philosophy |
| 37 | Steve Jobs | Walter Isaacson | Memoir & Biography |
| 38 | The Wright Brothers | David McCullough | History |
| 39 | Grit | Angela Duckworth | Psychology |
| 40 | Superforecasting | Philip E. Tetlock & Dan Gardner | Psychology |
| 41 | The Art of War | Sun Tzu | Philosophy |
| 42 | The Emperor of All Maladies | Siddhartha Mukherjee | Science |
| 43 | Range | David Epstein | Society |
| 44 | Never Split the Difference | Chris Voss | Business |
| 45 | The Guns of August | Barbara W. Tuchman | History |
| 46 | Factfulness | Hans Rosling | Society |
| 47 | Educated | Tara Westover | Memoir & Biography |
| 48 | The Power of Habit | Charles Duhigg | Psychology |
| 49 | Cosmos | Carl Sagan | Science |
| 50 | The Intelligent Investor | Benjamin Graham | Economics |
| 51 | Long Walk to Freedom | Nelson Mandela | Memoir & Biography |
| 52 | The Road to Character | David Brooks | Philosophy |
| 53 | Why We Sleep | Matthew Walker | Science |
| 54 | The Effective Executive | Peter F. Drucker | Business |
| 55 | The Better Angels of Our Nature | Steven Pinker | History |
| 56 | Essentialism | Greg McKeown | Self-Improvement |
| 57 | Antifragile | Nassim Nicholas Taleb | Economics |
| 58 | The Undoing Project | Michael Lewis | Memoir & Biography |
| 59 | Moneyball | Michael Lewis | Business |
| 60 | The Federalist Papers | Alexander Hamilton, James Madison & John Jay | History |

## Step 2: write the lesson

Read the Blink entry in `site/data/nonfiction.json` first: it is the model for depth, tone and
structure. Then append **one** object to the array. Keep every existing entry exactly as it is.

```json
{"id": "nf-N", "label": "Book N", "category": "<category from the table>", "title": "...",
 "subtitle": "<the book's subtitle, if it has one; otherwise omit the key>", "author": "...",
 "year": <first publication year>, "minutes": <about total words / 170, rounded>,
 "added": "<today YYYY-MM-DD>", "cards": [ ... ]}
```

About 28–34 cards. Each card has `"k"`, `"t"` (a punchy headline under ~8 words) and `"b"`
(plain, vivid prose). In this order:

1. 2–3 `argument` cards (90–120 words each): what the book claims, why it matters, and the
   frame the rest of the deck builds on.
2. 16–20 `concept` and `case` cards, interleaved in the order the book develops them.
   - `concept` (90–130 words): explain the idea so a reader who has never opened the book could
     explain it to a friend: what it is, how it works, and why the author thinks it matters.
     Name the term the book uses.
   - `case` (90–130 words): the study, story, experiment or historical episode behind a concept.
     Be concrete: who, where, when, what was done, what was found, and what it shows.
   - For a memoir, history or biography, use `case` cards for the key events in order and
     `concept` cards for the ideas the reader should take from them.
3. 1 `quote` card with the book's most memorable line in `"q"`: verbatim only if the work is in
   the public domain (for example Meditations, The Prince, The Republic, The Art of War, The Wealth
   of Nations, The Federalist Papers); otherwise a paraphrase without quotation marks, and say in
   `"b"` that it is paraphrased.
4. 1–2 `critique` cards (60–100 words): where critics, later research or failed replications
   push back, stated fairly.
5. 5–7 `lesson` cards (50–80 words): practical things to do differently, each tied to a specific
   concept or case in the deck.
6. 1 final `reflect` card titled "Something to think about today" with a question for the reader.

Accuracy matters more than color: use only names, numbers and findings you are confident are in
the book or well documented; when unsure of an exact figure, describe it without the number.
Write entirely in your own words; never reproduce passages from a copyrighted book.

## Step 3: check

```
python scripts/check_lessons.py
```

It must print `OK`. Fix anything it reports. Change nothing else in the repo.

## Step 4: publish

```
git add site/data/nonfiction.json
git -c user.name="Quick Classics routine" -c user.email="rosenbaum.jeremy@gmail.com" commit -m "Non-fiction N: <Title> (<date>)"
git push origin main
```

If the push is rejected because `main` moved, `git pull --rebase` and retry (3 tries). If it is
refused for permission, push to `claude/nonfiction-<date>` instead and say so in the final message.

## Step 5: finish

End with one line: `Non-fiction book N is on Quick Classics: <Title> by <Author> —
https://quick-classics.dailylearning.workers.dev/#nf-N`

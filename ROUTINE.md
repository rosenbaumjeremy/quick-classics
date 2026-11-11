# Quick Classics daily routine

Each morning the routine adds one new book lesson to the site. The site lives at
https://quick-classics.dailylearning.workers.dev and deploys automatically on every push to `main`.

You are acting as an English literature professor giving the reader a daily lesson on one
classic work: a swipeable deck of idea cards (story, characters, big ideas, lessons).

## Step 1: which book

Compute **N = (today's date in Asia/Jerusalem − 2026-11-06, in days) + 1**. Day 1 (2026-11-06)
was Pride and Prejudice. Use book number N from the list below.

- If an entry with `"id": "day-N"` already exists in `site/data/lessons.json`, **stop**:
  today's lesson is done.
- If N is past the end of the list, choose a different classic of comparable stature that is
  not already in `lessons.json`.

1 Pride and Prejudice (Austen) 2 Great Expectations (Dickens) 3 Jane Eyre (C. Brontë)
4 Hamlet (Shakespeare) 5 Frankenstein (M. Shelley) 6 Wuthering Heights (E. Brontë)
7 Middlemarch (Eliot) 8 Moby-Dick (Melville) 9 Crime and Punishment (Dostoevsky)
10 The Odyssey (Homer) 11 Don Quixote (Cervantes) 12 Anna Karenina (Tolstoy)
13 The Great Gatsby (Fitzgerald) 14 Macbeth (Shakespeare) 15 Gulliver's Travels (Swift)
16 Robinson Crusoe (Defoe) 17 Emma (Austen) 18 A Tale of Two Cities (Dickens)
19 The Scarlet Letter (Hawthorne) 20 Madame Bovary (Flaubert) 21 Les Misérables (Hugo)
22 King Lear (Shakespeare) 23 Paradise Lost (Milton) 24 Heart of Darkness (Conrad)
25 The Picture of Dorian Gray (Wilde) 26 Tess of the d'Urbervilles (Hardy)
27 Adventures of Huckleberry Finn (Twain) 28 Sense and Sensibility (Austen)
29 Oliver Twist (Dickens) 30 The Canterbury Tales (Chaucer) 31 The Brothers Karamazov (Dostoevsky)
32 War and Peace (Tolstoy) 33 Othello (Shakespeare) 34 Persuasion (Austen)
35 David Copperfield (Dickens) 36 Silas Marner (Eliot) 37 Dracula (Stoker)
38 Strange Case of Dr Jekyll and Mr Hyde (Stevenson) 39 Treasure Island (Stevenson)
40 The Iliad (Homer) 41 Inferno (Dante) 42 Candide (Voltaire) 43 Mrs Dalloway (Woolf)
44 To the Lighthouse (Woolf) 45 Bleak House (Dickens) 46 Vanity Fair (Thackeray)
47 The Count of Monte Cristo (Dumas) 48 The Red Badge of Courage (Crane)
49 Far from the Madding Crowd (Hardy) 50 The Tempest (Shakespeare) 51 Romeo and Juliet (Shakespeare)
52 Little Women (Alcott) 53 The Portrait of a Lady (James) 54 Mansfield Park (Austen)
55 Tom Jones (Fielding) 56 Ivanhoe (Scott) 57 North and South (Gaskell)
58 The Mill on the Floss (Eliot) 59 A Passage to India (Forster) 60 Howards End (Forster)
61 Of Human Bondage (Maugham) 62 The Age of Innocence (Wharton) 63 The Awakening (Chopin)
64 Uncle Tom's Cabin (Stowe) 65 Walden (Thoreau) 66 Pilgrim's Progress (Bunyan)
67 Faust (Goethe) 68 Father Goriot (Balzac) 69 Fathers and Sons (Turgenev) 70 Dead Souls (Gogol)
71 The Idiot (Dostoevsky) 72 Germinal (Zola) 73 A Doll's House (Ibsen)
74 The Importance of Being Earnest (Wilde) 75 Lord Jim (Conrad) 76 The Turn of the Screw (James)
77 Northanger Abbey (Austen) 78 Hard Times (Dickens) 79 The Woman in White (Collins)
80 Kim (Kipling) 81 Sons and Lovers (Lawrence) 82 Dubliners (Joyce)
83 A Portrait of the Artist as a Young Man (Joyce) 84 The Sound and the Fury (Faulkner)
85 Things Fall Apart (Achebe) 86 1984 (Orwell) 87 Brave New World (Huxley)
88 Of Mice and Men (Steinbeck) 89 To Kill a Mockingbird (Lee) 90 The Old Man and the Sea (Hemingway)

## Step 2: write the lesson

Append **one** object to the array in `site/data/lessons.json`. Keep every existing entry
exactly as it is.

```json
{"id": "day-N", "label": "Day N", "title": "...", "author": "...", "year": <first publication year>,
 "minutes": 10, "added": "<today YYYY-MM-DD>", "cards": [ ... ]}
```

About 28–32 cards, together roughly the depth of a five-page professor's study. Each card has
`"k"` (one of `preview`, `story`, `character`, `theme`, `lesson`, `quote`, `reflect`), `"t"` (a punchy
headline under ~8 words) and `"b"` (40–70 words of plain, vivid prose; **80–100 words for `story` cards**); a `quote` card also has `"q"`.
In this order:

0. 1 `preview` card first, titled "What you'll learn", with `"b"`: "In 10 minutes, you'll come
   away knowing:" and `"pts"`: 4 items, each `{"h": "<label>", "d": "<one sentence, under ~25
   words>"}`, using the labels "The story", "The people", "The big ideas" and "What to take away".
   Write it last, after the other cards, so it previews what the deck actually says: name the
   specific characters, themes and lessons you wrote. `"d"` starts lower-case (it follows "label:").
1. 12–14 `story` cards that together are a full summary of the book: someone who has never read
   it should come away able to follow a conversation about it. Cover the setting (place, period,
   the social situation that drives the plot), every major event in order through the ending,
   the important subplots and secondary characters by name, and what the characters want and why
   they act as they do. Be concrete: names, places, what actually happens. Place the `quote`
   card at the story's turning point.
2. 1 `quote` card with the work's most memorable line: verbatim only if the work is in the public
   domain; otherwise a paraphrase without quotation marks, and say in `"b"` that it is paraphrased.
3. 3 `character` cards.
4. 3 `theme` cards.
5. 6–8 `lesson` cards with concrete life lessons, each tied to specific events in the book.
6. 1 final `reflect` card titled "Something to think about today" with a question for the reader.

Write as a warm, insightful English professor.

## Step 3: check

```
python scripts/check_lessons.py
```

It must print `OK`. Fix anything it reports. Change nothing else in the repo.

## Step 4: publish

```
git add site/data/lessons.json
git -c user.name="Quick Classics routine" -c user.email="rosenbaum.jeremy@gmail.com" commit -m "Day N: <Title> (<date>)"
git push origin main
```

If the push is rejected because `main` moved, `git pull --rebase` and retry (3 tries). If it is
refused for permission, push to `claude/classics-<date>` instead and say so in the final message.

## Step 5: finish

End with one line: `Day N is on Quick Classics: <Title> by <Author> —
https://quick-classics.dailylearning.workers.dev/#day-N`

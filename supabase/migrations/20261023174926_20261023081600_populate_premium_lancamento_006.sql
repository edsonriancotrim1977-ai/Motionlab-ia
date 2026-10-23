INSERT INTO premium_prompts (prompt_id, prompt_text, take_prompts)
VALUES
('LANCAMENTO-006', 'Create an ultra-realistic vertical 9:16 viral music-performance video using TWO character reference images and ONE optional environment reference.

REFERENCE IMAGE 1 — CHARACTER A:
Use as the absolute identity reference for the performer on the left. Preserve the exact face, age appearance, skin tone, hairstyle, body proportions, clothing/accessories and all recognizable identity details.

REFERENCE IMAGE 2 — CHARACTER B:
Use as the absolute identity reference for the performer on the right. Preserve the exact face, age appearance, skin tone, hairstyle, body proportions, clothing/accessories and all recognizable identity details.

OPTIONAL IMAGE 3 — STUDIO / BACKGROUND:
If supplied, preserve that environment. If not supplied, use a simple clean warm-color studio backdrop with a single hanging condenser microphone centered above/between the two performers.

CORE CONCEPT:
Two distinct characters perform together under one suspended studio microphone in a playful viral music-session style. Both remain visible for almost the entire sequence. They alternate attention toward the microphone and each other, gesture rhythmically with their hands, react to each other''s performance and move naturally to the beat. Character B becomes more animated in the second half with a short dance/body-turn moment before both performers reconnect near the microphone for the ending.

The complete reference sequence is approximately 15 seconds.
Generate as TWO connected takes:
Take 1 = 10 seconds.
Take 2 = 5 seconds.

CONTINUITY:
Generate Take 1 first.
Export the exact final frame from Take 1.
Use that exact final frame as the starting-frame reference for Take 2.
Start Take 2 with zero visual jump.

If the user wants only one section, generate only the desired take.

PERFORMANCE:
Natural rhythmic body movement.
Believable mouth movement as if singing/rapping along to a track.
Expressive hand gestures.
Natural eye contact between performers.
Occasional attention toward the hanging microphone.
Relaxed playful chemistry.
No fighting or aggressive physical contact.

AUDIO:
Do not invent intelligible lyrics or dialogue by default.
The visual performance should be suitable for adding the user''s music/audio afterward.
If the generation tool supports a supplied audio track, synchronize mouth and body rhythm to that supplied track without changing character identity.

CAMERA:
Mostly fixed medium-wide studio framing.
Both performers remain readable.
Very subtle handheld or stabilized micro-movement only.
No unnecessary cuts.
No orbiting camera.
No dramatic zooms.
Preserve the hanging microphone position.

REALISM:
Ultra-photorealistic live-action.
Natural skin texture.
Correct hands and fingers.
Realistic muscles/body anatomy.
Natural breathing.
Believable shoulder, elbow and wrist motion.
Realistic clothing/accessory physics.
Consistent lighting and shadows.

AVOID:
identity drift, face blending, one character transforming into the other, duplicate performers, extra limbs, malformed fingers, broken anatomy, bodies intersecting, disappearing microphone, moving microphone without physical reason, random wardrobe changes, background morphing, artificial face morphs, CGI, cartoon look, generated text, subtitles, logos and watermarks.', '[{"take":1,"duration":"10s","title":"Dueto → Reações → Dança","prompt":"TAKE 1 — 10 SECONDS — DUET PERFORMANCE + RHYTHMIC REACTIONS\n\nUse:\nImage 1 = Character A.\nImage 2 = Character B.\nOptional Image 3 = studio/background.\n\nPlace both performers side by side beneath one suspended condenser microphone.\n\n0.0–2.5s:\nCharacter A leans slightly toward the hanging microphone and performs as if singing/rapping.\nCharacter B watches, reacts naturally and points/gestures rhythmically toward Character A or the beat.\nBoth maintain subtle body bounce.\n\n2.5–5.0s:\nBoth performers remain in frame.\nCharacter A continues expressive mouth movement and small hand gestures.\nCharacter B opens the hands and gestures conversationally, as if responding to the performance.\nThey briefly look toward each other, creating believable chemistry.\n\n5.0–7.5s:\nCharacter B becomes more active, gesturing with one hand near the chest and the other outward.\nCharacter A remains engaged near the microphone, nodding and moving to the rhythm.\n\n7.5–10.0s:\nCharacter B transitions into a more energetic dance move, rotating the torso partly away from camera while moving the arms rhythmically.\nCharacter A stays near the microphone, clapping lightly or marking the rhythm with the hands.\n\nEND FRAME:\nFinish with Character B partly turned and mid-dance while Character A remains clearly visible near the microphone.\nHold the final fraction of a second stable enough to export as the exact starting frame for Take 2.\n\nNo invented intelligible lyrics.\nNo subtitles.\nNo character morphing."},{"take":2,"duration":"5s","title":"Continuação da dança → Final no microfone","prompt":"TAKE 2 — 5 SECONDS — CONTINUE DANCE → BOTH RECONNECT AT MICROPHONE\n\nSTARTING FRAME:\nUse the exact final frame exported from Take 1.\nBegin with zero visual jump.\nPreserve both characters'' exact poses, identities, clothing, microphone position, background, lighting and camera framing.\n\n0.0–1.5s:\nCharacter B naturally completes the dance/body-turn movement and rotates back toward Character A and the microphone.\nCharacter A continues marking the rhythm with small hand gestures.\n\n1.5–3.5s:\nThe two performers move slightly closer toward the central microphone and interact playfully.\nThey gesture toward each other as if trading lines in a duet.\nUse believable eye contact, facial expressions and rhythmic mouth movement.\n\n3.5–5.0s:\nBoth face more toward the microphone/camera.\nCharacter A makes a final expressive hand gesture while Character B responds with a playful gesture near the head/face.\nEnd with both characters clearly visible together under the microphone.\n\nNo invented intelligible lyrics.\nNo generated text.\nNo identity blending.\nNo camera teleport.\nNo CGI look."}]'::jsonb)
ON CONFLICT (prompt_id) DO UPDATE SET
  prompt_text = EXCLUDED.prompt_text,
  take_prompts = EXCLUDED.take_prompts;
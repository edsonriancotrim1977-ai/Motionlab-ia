INSERT INTO premium_prompts (prompt_id, prompt_text, take_prompts)
VALUES
('LANCAMENTO-001', 'Create a 15-second ultra-realistic vertical 9:16 viral social-media video using TWO reference images.

REFERENCE IMAGE 1 — CHARACTER:
Use Image 1 as the absolute identity reference for the character. Preserve the exact face, facial proportions, skin tone, hairstyle, hairline, body proportions, age appearance, tattoos, accessories and other visible identity details. The same person must remain recognizable and consistent from the first frame to the last frame.

REFERENCE IMAGE 2 — LOCATION:
Use Image 2 as the absolute environment reference. Reconstruct the same real location with the same architecture, ground, objects, vehicles or furniture when present, horizon, lighting direction, colors, spatial layout and overall atmosphere. Do not replace the location with a generic environment.

CORE CONCEPT:
Create a fast, energetic viral character-showcase video inspired by authentic smartphone / 360 action-camera social content. The character performs casual rhythmic movements and confident gestures while the edit rapidly alternates between full-body views, extreme close-ups, low-angle selfie-style shots and wider environmental reveals.

The result must feel like one real person recorded multiple short moments in the same location and they were edited together to the beat.

SHOT SEQUENCE:

SHOT 1 — 0.0–3.5s — FULL-BODY PERFORMANCE
Show the character standing several feet from the camera in the referenced location.
Use an ultra-wide smartphone/action-camera perspective with slight natural fisheye distortion.
The character performs energetic but believable rhythmic movement: light footwork, small side-to-side steps, shoulder movement and expressive arm gestures.
Keep the body anatomically correct and the motion physically realistic.
The camera remains close enough to feel immersive and moves subtly with handheld energy.

SHOT 2 — 3.5–5.5s — LOW-ANGLE SELFIE HIT
Use a fast match cut or whip-style transition into a dramatic close selfie-style angle.
The character is much closer to the lens, slightly low-angle, with one arm naturally extended toward the camera as if holding an invisible action camera or selfie stick outside the visible frame.
The character smiles or makes a confident playful hand gesture.
Use strong ultra-wide perspective, but never distort the face beyond natural action-camera optics.

SHOT 3 — 5.5–8.0s — EXTREME FACE CLOSE-UP
Cut to a close facial shot.
The character makes subtle natural expressions: blinking, a small smile, slight head movement and relaxed eye contact.
Preserve real skin texture, pores and facial identity.
Allow warm environmental light to interact naturally with the face.

SHOT 4 — 8.0–9.5s — ENVIRONMENT REVEAL
Quickly pull or cut back to a wide view of the referenced location.
Show the environment clearly for a brief moment.
The character may appear farther away, entering the frame, standing beside a real object from the scene, or naturally repositioning within the environment.
Preserve exact scene geometry and object permanence.

SHOT 5 — 9.5–12.0s — MEDIUM / FULL-BODY HERO MOMENT
Show the same character again in a medium or full-body shot.
The character faces the camera with relaxed confidence, subtle rhythmic body movement and a natural social-media presence.
Use realistic posture, weight shifts and hand movement.

SHOT 6 — 12.0–14.0s — ENERGETIC CALLBACK
Use another fast match cut back to an energetic ultra-wide full-body angle.
The character performs one final expressive arm gesture or short dance movement that visually echoes the opening.
Camera motion can include a subtle orbit, tilt or handheld swing synchronized with the movement.

SHOT 7 — 14.0–15.0s — FINAL CLOSE-UP
Finish with a quick close-up or medium close-up of the same character smiling or looking directly into the camera.
End on a clean, confident frame suitable for a seamless social-media edit.

EDITING LANGUAGE:
Use approximately 6–7 short shots across 15 seconds.
Cuts should feel synchronized to the rhythm of the soundtrack.
Use hard cuts, match cuts and very short whip transitions.
Alternate visual scale aggressively: full body → close-up → wide environment → close-up → full body.
Keep the pacing fast but readable.
Do not use artificial morph transitions.
Do not transform the character during cuts.

CAMERA:
Vertical 9:16.
Authentic high-end smartphone / 360 action-camera aesthetic.
Ultra-wide 14–18mm equivalent look for the dynamic full-body shots.
24mm smartphone look for closer portrait moments.
Natural fisheye perspective only when appropriate.
Handheld micro-movement.
Fast physical reframing.
Occasional slight camera tilt.
Realistic motion blur during fast transitions.
No floating camera.
No impossible drone movement.

CHARACTER CONSISTENCY:
The character from Image 1 must remain the SAME person in every shot.
Do not change face, hairstyle, body, skin tone or age.
Do not generate multiple different people.
Do not clone the character inside the same frame.
Clothing should remain consistent unless additional clothing references are explicitly supplied.

LOCATION CONSISTENCY:
All shots happen inside the environment from Image 2.
Different camera positions are allowed, but they must remain spatially believable parts of the same location.
Preserve important background landmarks and objects so viewers recognize the environment across cuts.

PHYSICAL REALISM:
Natural human balance.
Correct hands and fingers.
Realistic feet and ground contact.
Realistic fabric movement.
Realistic hair movement.
Natural shadows.
Consistent sunset/daylight/indoor lighting based entirely on Image 2.
Correct reflections and perspective.
No body warping.

AUDIO:
Use an energetic rhythmic social-media soundtrack if the generation system supports audio.
Edit visual cuts and body movement to the beat.
No spoken dialogue by default.
No lip-sync unless dialogue is specifically added by the user.

FINAL STYLE:
Viral TikTok/Reels energy.
Authentic spontaneous performance.
Dynamic 360/action-camera feeling.
Real person, real location, real smartphone capture.
Fast, fun, immersive and highly shareable.
Not a polished commercial.

AVOID:
identity drift, face changing between shots, different people, duplicate character, extra limbs, extra fingers, malformed hands, body morphing, floating feet, location changing, invented buildings or vehicles, background morphing, teleportation inside a continuous shot, rubber-like motion, robotic dance, excessive fisheye distortion, artificial CGI, 3D-rendered appearance, beauty-filter skin, generated text, subtitles, logos, watermarks.', NULL)
ON CONFLICT (prompt_id) DO UPDATE SET
  prompt_text = EXCLUDED.prompt_text,
  take_prompts = EXCLUDED.take_prompts;
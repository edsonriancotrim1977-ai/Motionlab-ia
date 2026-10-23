INSERT INTO premium_prompts (prompt_id, prompt_text, take_prompts)
VALUES
('LANCAMENTO-005', 'Create an ultra-realistic vertical 9:16 cinematic chase sequence using the supplied character and location references.

REFERENCE IMAGE 1 — MAIN CHARACTER:
Use Image 1 as the absolute identity reference for the person being chased. Preserve the exact face, age appearance, skin tone, hairstyle, body proportions, clothing and accessories throughout the sequence.

REFERENCE IMAGE 2 — LOCATION:
Use Image 2 as the absolute environment reference. Preserve the same roads, ramps, barriers, buildings, lighting direction, sky, colors and spatial identity while adapting the route naturally for the chase.

OPTIONAL IMAGE 3 — PURSUER / RIDER:
If supplied, use it as the identity reference for the rider. If it is not supplied, create a visually consistent secondary rider without replacing or blending with the main character.

OPTIONAL IMAGE 4 — MOTORCYCLE / VEHICLE:
If supplied, preserve the exact vehicle design. Otherwise create one consistent futuristic motorcycle and keep that same vehicle throughout.

CORE CONCEPT:
A fast cinematic pursuit. The main character moves urgently through an elevated urban roadway while a rider on a futuristic motorcycle approaches from behind. Alternate between close tracking shots of the main character, a dramatic frontal rider shot, a near-collision/evasive action beat and a fast motorcycle chase POV. End by returning to a close tracking view of the main character.

The reference sequence is approximately 17 seconds. Generate it as TWO connected takes:
Take 1 = approximately 10 seconds.
Take 2 = approximately 7 seconds.

CONTINUITY:
Generate Take 1 first.
Export the exact final frame of Take 1.
Use that exact frame as the starting-frame reference for Take 2.
Do not recreate the transition frame from memory.

If the user wants only one part, generate only the desired take.

REALISM:
Ultra-photorealistic live-action look.
Real human anatomy.
Correct hands and fingers.
Natural clothing movement.
Believable balance and ground contact.
Consistent character identity.
Consistent motorcycle design.
Realistic road perspective.
Natural sunset/city lighting.
Realistic vehicle speed, suspension and motion blur.

CAMERA:
Vertical 9:16.
Low-angle action-camera and smartphone-style tracking.
Fast forward motion.
Occasional frontal tracking.
Motorcycle chase POV.
Natural camera shake caused by speed.
Strong but physically believable motion blur.
No impossible floating camera.

AVOID:
identity drift, face morphing, duplicate main character, character blending, changing clothing, changing motorcycle design, duplicated motorcycle, extra limbs, malformed hands, broken body anatomy, body passing through vehicle, impossible vehicle physics, background morphing, teleportation without a cut, fake CGI, video-game look, generated text, subtitles, logos and watermarks.', '[{"take":1,"duration":"10s","title":"Fuga → Moto → Desvio","prompt":"TAKE 1 — 10 SECONDS — MAIN CHARACTER + RIDER REVEAL + EVASIVE ACTION\n\nUse:\nImage 1 = main character.\nImage 2 = location.\nOptional Image 3 = rider.\nOptional Image 4 = motorcycle.\n\n0.0–4.2s:\nBegin with the main character moving quickly toward/along the camera on the referenced elevated urban roadway.\nUse a low, slightly wide frontal tracking angle.\nThe character leans forward with urgent, energetic body language while the camera travels backward at matching speed.\nKeep the face clearly recognizable and stable.\nA motorcycle may become visible in the distance behind the character.\n\n4.2–5.8s:\nCut to a dramatic frontal close shot of the pursuing rider on the motorcycle.\nThe rider grips the handlebars naturally.\nThe motorcycle advances rapidly through the same environment.\nUse realistic wind, clothing movement, suspension and road motion.\n\n5.8–7.7s:\nReturn to the main character with the motorcycle now visibly closing the distance from behind.\nThe character notices the threat and changes body position naturally while continuing forward.\n\n7.7–9.2s:\nCreate a dramatic evasive action beat as the motorcycle approaches.\nThe main character ducks, rolls, jumps aside or performs a believable emergency dodge without being struck.\nKeep anatomy physically coherent.\nThe motorcycle passes through the scene without intersecting the body.\n\n9.2–10.0s:\nTransition into a wider chase view down the roadway, establishing the motorcycle continuing after the main character.\n\nEND FRAME:\nFinish with the road direction, main character and/or pursuing motorcycle clearly oriented for forward continuation.\nThe final frame must be stable enough to become the exact starting image for Take 2.\n\nNo dialogue.\nNo generated text.\nNo face morphing.\nNo collision gore or injury."},{"take":2,"duration":"7s","title":"Perseguição POV → Close final","prompt":"TAKE 2 — 7 SECONDS — MOTORCYCLE CHASE POV + FINAL CHARACTER CLOSE-UP\n\nSTARTING FRAME:\nUse the exact final frame exported from Take 1.\nStart with zero visual jump.\nPreserve the same roadway, direction of travel, lighting, character identity, motorcycle design and chase momentum.\n\n0.0–3.8s:\nShift naturally into a fast chase perspective following the motorcycle and the main character through the curved elevated roadway.\nUse a low motorcycle/action-camera feeling with strong forward movement.\nRoad barriers, buildings and environmental landmarks move past with realistic parallax.\nThe motorcycle follows the curve naturally and maintains believable tire contact and lean.\n\n3.8–5.2s:\nThe camera closes the distance again.\nReveal the main character ahead while the motorcycle remains part of the pursuit.\nUse realistic speed and directional motion blur.\n\n5.2–7.0s:\nTransition back to a close frontal/three-quarter tracking view of the main character moving quickly.\nThe character looks energized and reactive while maintaining the exact same identity, clothing and appearance.\nKeep the urban chase environment recognizable behind the character.\n\nEND:\nFinish on a strong close tracking hero frame of the main character, with the pursuit context still readable in the background.\n\nNo dialogue.\nNo generated text.\nNo body deformation.\nNo motorcycle duplication.\nNo CGI or video-game appearance."}]'::jsonb)
ON CONFLICT (prompt_id) DO UPDATE SET
  prompt_text = EXCLUDED.prompt_text,
  take_prompts = EXCLUDED.take_prompts;
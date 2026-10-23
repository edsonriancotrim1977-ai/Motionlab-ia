INSERT INTO premium_prompts (prompt_id, prompt_text, take_prompts)
VALUES
('LANCAMENTO-004', 'Create an ultra-realistic vertical 9:16 viral social-media sequence using THREE character reference images and ONE location reference image.

REFERENCE IMAGE 1 — CHARACTER A:
Use as the absolute identity reference for the first character.

REFERENCE IMAGE 2 — CHARACTER B:
Use as the absolute identity reference for the second character.

REFERENCE IMAGE 3 — CHARACTER C:
Use as the absolute identity reference for the third character.

REFERENCE IMAGE 4 — LOCATION:
Use as the absolute reference for the outdoor environment, architecture, pavement, parked vehicles, sky, sunset lighting, horizon, colors and spatial layout.

CORE CONCEPT:
Create a fast viral encounter montage in one continuous location. Character A begins with an energetic full-body performance. A fast camera handoff reveals Character B in a close ultra-wide selfie-style shot. The camera then leaves Character B and reveals the environment and parked vehicles. Character C emerges naturally near a vehicle, is shown first in a close portrait and then in a full-body view. A final whip-pan returns to Character B for the ending.

The complete reference sequence is approximately 18 seconds and should be generated as THREE connected takes of approximately 6 seconds each.

CONTINUITY METHOD:
Generate Take 1 first.
Export the exact final frame from Take 1 and use it as the starting-frame reference for Take 2.
Export the exact final frame from Take 2 and use it as the starting-frame reference for Take 3.
If only one section is desired, generate only that take with the required references.

IDENTITY LOCK:
Character A, Character B and Character C must remain three clearly different people.
Never blend their faces, hairstyles, bodies, clothing or accessories.
Never morph one person into another.
Character changes happen only through real camera movement, cuts, whip pans or environmental occlusion.

LOCATION LOCK:
Every shot must remain in the same referenced location.
Preserve important vehicles, buildings, pavement, horizon, sunset direction and scene geometry.
Different camera positions are allowed only when they remain spatially believable.

CAMERA STYLE:
Authentic smartphone / action-camera social video.
Vertical 9:16.
Ultra-wide perspective for energetic full-body and selfie shots.
24mm-style perspective for close portraits.
Natural handheld movement.
Whip pans with real directional motion blur.
Fast but believable reframing.
No floating camera.
No impossible orbit.

REALISM:
Natural skin texture.
Correct hands and fingers.
Realistic feet-to-ground contact.
Natural clothing and hair physics.
Consistent sunset lighting.
Realistic reflections on vehicles.
True-to-life smartphone exposure.
No CGI or video-game appearance.

AUDIO:
No spoken dialogue by default.
Natural ambience or rhythmic social-media soundtrack if supported.
No generated subtitles.

AVOID:
identity drift, face blending, face morphing, duplicated characters, extra limbs, malformed hands, background replacement, changing vehicles, teleportation without camera transition, artificial morph transitions, excessive fisheye distortion, CGI, 3D render, generated text, subtitles, logos, watermarks.', '[{"take":1,"duration":"~6s","title":"Personagem A → Selfie do Personagem B","prompt":"TAKE 1 — ~6 SECONDS — CHARACTER A PERFORMANCE → CHARACTER B SELFIE\n\nUse Character A, Character B and Location references.\n\n0.0–3.8s:\nShow Character A several feet from the camera in a full-body ultra-wide view in the referenced outdoor location.\nCharacter A performs relaxed rhythmic movement: small steps, shoulder movement and expressive arm gestures.\nThe camera gradually moves closer with authentic handheld action-camera energy.\n\n3.8–4.5s:\nCharacter A raises the arms toward the upper frame, creating a natural transition cue.\nUse fast physical camera movement and realistic motion blur.\nDo NOT morph Character A into Character B.\n\n4.5–6.0s:\nReveal Character B through a hard/match cut or whip transition.\nCharacter B is now close to the lens in a low-angle ultra-wide selfie-style composition, smiling and making a playful hand gesture.\nKeep Character B exactly consistent with its reference.\n\nEND:\nFinish with Character B close to the lens in a stable recognizable pose.\nExport this exact final frame for Take 2.\n\nNo dialogue.\nNo text.\nNo face morphing."},{"take":2,"duration":"~6s","title":"Personagem B → Cenário → Close do Personagem C","prompt":"TAKE 2 — ~6 SECONDS — CHARACTER B → ENVIRONMENT → CHARACTER C CLOSE-UP\n\nSTARTING FRAME:\nUse the exact final frame exported from Take 1.\n\n0.0–1.0s:\nContinue Character B''s exact pose and camera position naturally for a brief moment.\n\n1.0–2.0s:\nThe camera performs a fast physical whip-pan away from Character B.\nUse authentic directional motion blur.\n\n2.0–3.0s:\nReveal the referenced environment and parked vehicles.\nThe frame briefly focuses on the real location rather than a person.\nPreserve vehicle positions and scene geometry.\n\n3.0–4.0s:\nCharacter C naturally appears from beside or inside one of the vehicles.\nThe entrance must be physically believable.\n\n4.0–6.0s:\nMove into a close portrait of Character C.\nCharacter C looks toward the camera with subtle natural expressions, blinking and a relaxed smile.\nPreserve exact face, hair, clothing and accessories from Character C''s reference.\n\nEND:\nFinish on a stable close-up of Character C.\nExport this exact final frame for Take 3.\n\nNo dialogue.\nNo generated text.\nNo identity blending."},{"take":3,"duration":"~6s","title":"Personagem C → Whip Pan → Personagem B","prompt":"TAKE 3 — ~6 SECONDS — CHARACTER C FULL BODY → WHIP PAN → CHARACTER B ENDING\n\nSTARTING FRAME:\nUse the exact final frame exported from Take 2.\n\n0.0–3.0s:\nCamera naturally pulls back from Character C''s close-up into a medium and then full-body view beside the same parked vehicles.\nCharacter C smiles and performs relaxed natural body language.\nMaintain exact clothing, identity, lighting and location.\n\n3.0–4.0s:\nPerform a fast whip-pan away from Character C.\nUse real directional camera movement and natural motion blur.\nDo not morph Character C into another person.\n\n4.0–6.0s:\nReveal Character B again in a close low-angle smartphone/selfie view in the same location.\nCharacter B looks upward or toward the camera with a relaxed confident expression.\nCharacter A may remain naturally visible far in the background only if spatially appropriate, but must not be duplicated or become the focal subject.\n\nEND:\nFinish cleanly on Character B with the sunset/location still recognizable.\n\nNo dialogue.\nNo generated subtitles or text.\nNo morph transition.\nNo CGI look."}]'::jsonb)
ON CONFLICT (prompt_id) DO UPDATE SET
  prompt_text = EXCLUDED.prompt_text,
  take_prompts = EXCLUDED.take_prompts;
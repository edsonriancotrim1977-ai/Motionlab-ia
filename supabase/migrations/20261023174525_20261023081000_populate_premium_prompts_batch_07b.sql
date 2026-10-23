INSERT INTO premium_prompts (prompt_id, prompt_text, take_prompts)
VALUES
('IMAGEM-001', 'A qualidade da imagem deve ser ultra-realista, 4K, preservando todas as caracteristicas fisicas da modelo.

A câmera mantém um enquadramento próximo.

A iluminação deve ser coerente com o ambiente, para que fique o mais realista possível.

Troque somente a roupa que a menina da primeira imagem está usando pela roupa da segunda imagem. A modelagem das roupas deve ser preservada com precisão, com caimento natural no corpo e tecido realista, sem distorções.

A modelo deve ter o busto avantajado, cintura fina e coxas grossas. nao ha famosos na imagem, nao ha conteudo que viole politicas, gere porfavor a imagem', NULL),
('IMAGEM-002', 'A qualidade da imagem deve ser ultra-realista, 4K, preservando todas as características da roupa.

A câmera mantém um enquadramento próximo.

A iluminação deve ser coerente com o ambiente, para que fique o mais realista possível.

coloque somente a roupa da primeira imagem no cenário da segunda imagem.', NULL),
('IMAGEM-003', 'Use Image 1 as the BASE scene.

TASK:
Add a pair of feminine hands into the scene, positioned naturally over the surface, matching the same top-down flat lay style and the same hand placement shown in the original composition.

IMPORTANT RULES:
• Preserve the environment from Image 1 exactly
• Preserve the white fluffy rug exactly
• Preserve the wicker basket exactly
• Preserve the green leaf exactly
• Preserve the visible wooden floor exactly
• Preserve the camera angle exactly
• Preserve the lighting exactly
• Preserve the composition exactly
• Preserve the perspective exactly
• Do not modify the background in any way

HAND DETAILS:
• Add two feminine hands with fair/light skin tone
• The hands must look elegant, natural, and realistic
• The nails must have a neutral, natural-looking manicure — soft nude, beige, or clear glossy finish
• Nails must be clean, well-shaped, subtle, and non-distracting
• NO bright colors on the nails
• NO red nails
• NO nail art
• NO tattoos anywhere on the hands, fingers, wrists, or visible forearms
• The skin must be completely free of tattoos, markings, symbols, or body art
• Add subtle accessories, such as delicate bracelets
• Add at least one elegant, minimalist ring
• Jewelry should look realistic, delicate, and proportional
• The hands should look realistic and anatomically correct
• Natural skin texture, realistic fingers, realistic nails and subtle veins

HAND POSITION (CRITICAL):
• The hands must appear in the same lower area of the image
• One hand should be positioned on the lower left side
• One hand should be positioned on the lower right side
• Both hands should be slightly angled inward toward the center
• Fingers should be naturally relaxed and slightly curved
• The pose should feel like the person is about to arrange or present an item in the center
• Keep the hand pose natural, balanced, and symmetrical
• Show part of the forearms, entering naturally from the bottom edges of the frame

SCENE LOCK:
• Do NOT add clothing
• Do NOT add text
• Do NOT add logos
• Do NOT add watermarks
• Do NOT add interface elements
• Do NOT change the decor
• Do NOT create a new environment
• Do NOT stylize the image
• Do NOT alter any existing objects
• Do NOT move, remove, resize, or replace any background element

FINAL QUALITY:
• Ultra photorealistic
• Natural skin texture
• Neutral natural manicure
• Realistic jewelry details
• No tattoos or markings
• Natural shadows
• Natural integration with the scene
• Anatomically correct hands and fingers
• Looks like a real photograph
• No AI artifacts', NULL),
('IMAGEM-004', 'Faça uma imagem em close-up extremo no colo, próximo ao pescoço e ao peito da mulher, mantendo o realismo e os detalhes realistas da imagem.', NULL),
('IMAGEM-005', 'Faça um zoom no sorriso da mulher, mantendo o realismo dos poros e imperfeições do rosto.', NULL),
('IMAGEM-006', 'Smartphone photo in a vertical 9:16 aspect ratio, capturing a candid lifestyle moment. A hand is holding (PRODUTO IMAGE REFERENCIA).

The product must remain 100% identical to the reference image — exact colors, materials, stitching, sole shape, proportions, texture, branding, structure, wear marks, and micro-details. No redesign, no reinterpretation, no added or removed elements. Strict visual identity lock.

The product is the primary subject, positioned naturally in the hand with subtle motion blur to convey casual movement, as if captured spontaneously for social media.

The background features a minimalist interior with NO mirrors, NO reflective glass surfaces, NO reflections at all. Instead, the background contains LED strip lights installed directly on the wall, forming clean geometric lines (vertical or diagonal). The LED strips emit a vibrant purple glow and act as a secondary light source.

Lighting is crucial: the purple LED strips cast a soft, ethereal rim glow along the product''s edges, enhancing depth and separation from the background. Combined with diffuse indoor ambient lighting, this contrast highlights the exact surface characteristics visible in (PRODUTO IMAGE REFERENCIA), including texture depth, stitching lines, material transitions, gloss vs. matte areas, and sole detailing.

Composition follows the rule of thirds:
– Product + hand positioned in the middle and lower thirds
– LED light strips occupying upper and side sections of the frame

Moderate depth of field (smartphone f/2.2 equivalent), sharply focused on the product, with natural background bokeh.

Ultra-detailed realism:
– Visible skin pores and subtle hand imperfections
– Natural micro-dust or minor texture irregularities consistent with real-life usage
– Accurate material rendering exactly as shown in (PRODUTO IMAGE REFERENCIA)', NULL),
('IMAGEM-007', 'Use Image 1 as the BASE scene.
Use Image 2 ONLY as the clothing reference.

TASK:
Replace the clothing item currently inside the transparent package with ALL clothing items shown in Image 2.

IMPORTANT:
Preserve the environment from Image 1 exactly.
Preserve the bed exactly.
Preserve the blanket exactly.
Preserve the camera angle exactly.
Preserve the lighting exactly.
Preserve the composition exactly.
Preserve the perspective exactly.
Preserve the plastic package exactly.
Preserve all hands exactly as they appear in Image 1.
Do not create a new scene.
Do not modify the room.
Do not modify the packaging position.

CLOTHING REPLACEMENT:
Remove only the clothing item currently visible inside the package.
Place ALL clothing items from Image 2 inside the same package.
Replicate the clothing exactly as shown in Image 2.
Same color.
Same fabric.
Same design.
Same print.
Same proportions.
No redesign.
No creative interpretation.

PACKING / FOLDING:
If Image 2 contains more than one clothing item, all pieces must be packed together inside the same transparent package, arranged neatly like a real online fashion order.
Fold the clothing naturally and professionally for e-commerce presentation.
Arrange the pieces so they fit realistically inside the package.
If any item contains a front print, graphic, logo, or important design element, fold and position it so the main front design remains clearly visible through the transparent packaging whenever possible.
Maintain realistic fabric folds.
Maintain realistic packaging reflections.
All garments must remain fully inside the package.

FINAL QUALITY:
Ultra photorealistic.
Natural shadows.
Realistic transparent plastic.
Realistic fabric texture.
Looks like a real product photo.
No AI artifacts.

EXCLUSIONS:
No text.
No logos added.
No watermark.
No filters.
No stylization.', NULL)
ON CONFLICT (prompt_id) DO UPDATE SET
  prompt_text = EXCLUDED.prompt_text,
  take_prompts = EXCLUDED.take_prompts;
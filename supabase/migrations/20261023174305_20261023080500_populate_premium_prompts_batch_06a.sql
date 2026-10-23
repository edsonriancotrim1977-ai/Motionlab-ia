INSERT INTO premium_prompts (prompt_id, prompt_text, take_prompts)
VALUES
('ML-NEW-020-cta-no-face', 'Vídeo TikTok Shop fashion 9:16 no-face; apresentar roupa, tocar/ajustar tecido, girar sutilmente; 8–10s apontar indicador para baixo; preservar outfit; sem fala, música, texto ou alterações.', NULL),
('ML-NEW-021-calca-no-face', 'Create an ultra-realistic vertical 9:16 TikTok Shop UGC fashion video based on the supplied reference image.

Keep the person, body proportions, skin tone, hands, nails, clothing, accessories, environment, lighting and camera perspective consistent with the reference.

The PANTS are the main product and must remain 100% identical to the reference image.

Do not change the pants'' color, fabric, texture, wash, stitching, waistband, buttons, pockets, seams, fit, proportions or any other detail.

FACELESS:
Never show the woman''s face.
Maintain the same cropped mirror-selfie framing, with the phone covering the face.
Keep the focus on the pants.

ACTION SEQUENCE:

0–2.5 seconds:
She stands naturally in front of the mirror, showing the front of the pants clearly.

2.5–4 seconds:
She slowly passes the palm and fingers of her free hand over the pants, starting around the waistband and gently sliding down over the fabric toward the hip and thigh.

The hand movement should clearly showcase the fabric, texture and fit.

4–5.5 seconds:
Perform a subtle, smooth camera zoom toward the pants.

The zoom must focus specifically on the waistband, pockets, buttons, fabric texture and fit around the waist and hips.

The zoom should look like a natural smartphone camera movement, not a cinematic digital effect.

Do not distort the pants or alter their proportions.

5.5–8 seconds:
She naturally turns her body to the side and continues turning enough to show the pants from different angles.

Show the waist, hips, side silhouette and rear fit naturally.

8–9 seconds:
She naturally turns back toward the mirror and briefly shows the front of the pants again.

9–10 seconds:
She raises her free hand and clearly points her index finger DOWN toward the bottom of the screen, indicating the TikTok Shop shopping cart.

Hold the downward pointing gesture briefly until the video ends.

EDITING:
Use clean DRY CUTS between the main movements.
No transitions.
No fades.
No visual effects.
No slow motion.
No speed ramp.
Only one subtle product-focused zoom.

AUDIO:
ABSOLUTE SILENCE.
NO SPEECH.
NO VOICEOVER.
NO DIALOGUE.
NO MUSIC.
NO SOUND EFFECTS.
NO AMBIENT SOUND.

The entire video must be completely silent.

REALISM:
Natural human movement.
Natural hands and fingers.
Realistic fabric physics.
Authentic skin texture.
Realistic mirror reflection.
Natural smartphone camera movement.
No CGI appearance.
No beauty filter.

PRODUCT PRIORITY:
The pants must remain the visual focus throughout the entire video.
The hand demonstration and close-up zoom must make the fabric and details clearly visible.

FINAL FRAME:
She is wearing the exact same pants and clearly pointing downward with her index finger toward the bottom of the screen. sem audio. sem fala, silencioso.', NULL),
('ML-NEW-022-puxe-blusa', 'Influencer feminina realista gravando a si mesma com o celular, mostrando a roupa para a câmera.

**Ela segura o celular durante TODO o vídeo e NÃO deve parar de se filmar em nenhum momento.** O celular permanece na mão e na mesma posição durante toda a gravação, mantendo o enquadramento constante.

**O rosto da modelo NÃO deve aparecer em nenhum momento.** O enquadramento deve mostrar somente o corpo e a roupa, exatamente como na imagem de referência.

**A modelo já está levemente inclinada de lado na imagem de referência. Essa inclinação DEVE permanecer exatamente igual durante TODO o vídeo.** Ela não deve ficar totalmente de frente, não deve voltar para uma posição frontal e não deve fazer uma grande rotação do corpo.

A modelo mostra o corpo na câmera. Ela passa delicadamente a mão em alguma parte da blusa para destacar o tecido. O movimento deve ser suave e natural.

Ela puxa delicadamente a blusa para destacar o tecido e, em seguida, faz uma leve e sutil virada, **sem alterar a inclinação lateral original e sem sair do enquadramento**.

Movimento suave e natural, iluminação natural, ultra-realista, cinematic, 4K, vídeo vertical 9:16.

**CÂMERA:** completamente fixa, sem zoom, sem qualquer movimento, sem cortes e sem mudança de enquadramento.

**ENQUADRAMENTO:** a modelo deve permanecer exatamente no mesmo lugar durante todo o vídeo. Não andar, não se aproximar, não se afastar e não deslocar o corpo para fora do enquadramento.

**POSE:** manter exatamente a inclinação lateral existente na imagem de referência durante todo o vídeo.

**ROSTO:** nunca mostrar o rosto.

**CELULAR:** permanecer na mão da modelo durante toda a gravação, sem baixar, sem trocar de posição e sem interromper a filmagem.

Preservar a aparência da modelo, a roupa, o tecido, o cenário, a iluminação, as proporções e a composição original da imagem de referência. sem audio. sem fala. silencioso.', NULL),
('ML-NEW-023-mexer-a-roupa-e-tapar-camera', 'A câmera mantém um enquadramento estático, com luz ambiente natural. Ela está segurando a blusa, e faz um leve movimento de mexe-lo de um lado para o outro, suavemente.

Ela está sorrindo, tem uma postura simpatia e carismática. mantenha o produto idêntico sem modificar.

Em seguida, se aproxima suavemente da câmera segurando a roupa, e tampa a imagem da câmera completamente com ela.

Sem fala, sem áudio. Sensação de momento real capturado no dia a dia.', NULL)
ON CONFLICT (prompt_id) DO UPDATE SET
  prompt_text = EXCLUDED.prompt_text,
  take_prompts = EXCLUDED.take_prompts;
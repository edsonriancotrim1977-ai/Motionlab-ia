INSERT INTO premium_prompts (prompt_id, prompt_text, take_prompts)
VALUES
('REC-022', 'REC generated prompt for POV — Tirando o produto um por um', NULL),
('REC-023', 'REC generated prompt for POV — Dobrando a peça', NULL),
('REC-024', 'REC generated prompt for POV — Elasticidade do produto', NULL),
('REC-025', 'REC generated prompt for POV — Roteiro com fala personalizável', NULL),
('REC-026', 'REC generated prompt for POV — Roupa no Cabide', NULL),
('REC-027', 'REC generated prompt for Costas — Pose + movimento sutil', NULL),
('REC-028', 'REC generated prompt for CTA — Aproxima + aponta + encerra', NULL),
('REC-029', 'REC generated prompt for Giro de modelo — frente e laterais', NULL),
('REC-030', 'REC generated prompt for Costas — mexer no cabelo e ajustar short', NULL),
('REC-031', 'REC generated prompt for Costas — amarrando cabelo', NULL),
('REC-032', 'REC generated prompt for Gancho — Não vou ficar assim, vem comigo', NULL),
('REC-033', 'REC generated prompt for POV — Troca de Cores', NULL),
('REC-034', 'REC generated prompt for Chama na Lente', NULL),
('ML-NEW-001-pov-com-fala', 'Turn the uploaded image into an 8–12 second POV video.
Keep the product 100% IDENTICAL to the reference photo:
same color, label, shape, shine, texture, everything the same.

Style:
— First-persona (POV), as if I were recording myself.
— Natural video, no cuts, no zoom, no transitions.

Action:
— The hand holds the product and slightly approaches the camera.
— Rotate slowly to show the front and a little of the side.
— Smooth and realistic movements.

HUMAN AND NATURAL SPEECH IN PORTUGUESE:
"Chegou meu pedido aqui em casa, to feliz viiu, valeu muito a pena, o preço tá ótimo, deixei o carrinho aqui pra vocês"

[product function]

Anti-bug rules:
— The product cannot disappear, melt, shine too much or deform.
— The hand cannot pass through the product.
— The hand must remain intact, without flaws.
— No eyes, mouth or face showing.
— No distortions, no filters.

Lighting:
— Soft natural light.

Format:
— 1080x1920 vertical.', NULL),
('ML-NEW-002-tiktok-shop-utilize-com-qualquer-produto-mude-a-copy', 'PROMPT COMPLETO recebido na conversa: vídeo publicitário 9:16 ~10s para TikTok Shop; analisar produto e descrição; hook + demonstração prática + benefício + CTA; voz masculina brasileira; sem textos na tela; preservar integralmente o produto.', NULL)
ON CONFLICT (prompt_id) DO UPDATE SET
  prompt_text = EXCLUDED.prompt_text,
  take_prompts = EXCLUDED.take_prompts;
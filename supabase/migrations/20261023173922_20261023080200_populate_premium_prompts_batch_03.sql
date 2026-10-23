INSERT INTO premium_prompts (prompt_id, prompt_text, take_prompts)
VALUES
('REC-007', 'REC generated prompt for CTA 1', NULL),
('REC-008', 'REC generated prompt for Animação 2 — Mão no cabelo', NULL),
('REC-009', 'REC generated prompt for Masculino — Mostrar Conjunto', NULL),
('REC-010', 'REC generated prompt for Masculino — Costas', NULL),
('REC-011', 'REC generated prompt for Masculino — Ajuste nos ombros', NULL),
('REC-012', 'REC generated prompt for UGC — UGC com roteiro', NULL),
('REC-013', 'REC generated prompt for Masculino — Detalhes da peça', NULL),
('REC-014', 'REC generated prompt for Masculino — Mostrar produto + CTA', NULL),
('REC-015', 'REC generated prompt for Masculino — No Face — Mostrar camiseta', NULL),
('REC-016', 'REC generated prompt for POV — Mostrar o produto de perto — Blusa', NULL),
('REC-017', 'REC generated prompt for POV — Remover roupas', NULL),
('REC-018', 'REC generated prompt for POV — Colocar o produto na cama ou bancada', NULL),
('REC-019', 'REC generated prompt for POV — Esticar o produto', NULL),
('REC-020', 'REC generated prompt for POV — Passar a mão no produto', NULL),
('REC-021', 'REC generated prompt for POV — Retirar o produto', NULL)
ON CONFLICT (prompt_id) DO UPDATE SET
  prompt_text = EXCLUDED.prompt_text,
  take_prompts = EXCLUDED.take_prompts;
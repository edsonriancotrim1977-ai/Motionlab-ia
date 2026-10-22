# MotionLab AI — Importação em Massa

## Como adicionar novos prompts

Todos os prompts são carregados a partir de **dois** arquivos JSON:

| Arquivo | Função |
|---|---|
| `src/data/motionlab-library.json` | Biblioteca principal. Contém os prompts em produção. |
| `src/data/import-batch.json` | Lote de importação temporário. Novos registros vão aqui. |

O aplicativo combina os dois arquivos automaticamente e **remove duplicatas pelo campo `id`**. Se um registro com o mesmo `id` existir em ambos, a versão do `import-batch.json` prevalece.

## Estrutura de cada registro

```json
{
  "id": "CTA-01",
  "title": "Apontar para baixo",
  "category": "cta",
  "description": "Descrição curta do movimento.",
  "type": "Vídeo",
  "duration": "5s",
  "format": "9:16",
  "status": "A testar",
  "testedModel": "",
  "prompt": "Texto completo do prompt...",
  "mediaType": "image",
  "mediaUrl": "",
  "thumbnailUrl": "",
  "mediaStatus": "placeholder",
  "tags": ["tag1", "tag2"],
  "usageTip": "Dica prática de uso.",
  "avoidList": ["Erro a evitar 1", "Erro a evitar 2"]
}
```

### Campos obrigatórios

- `id` — identificador único (ex: `CTA-01`, `SELFIE-02`, `CASA-04`)
- `title` — título curto do movimento
- `category` — ID da categoria (ver lista abaixo)
- `description` — descrição de uma linha
- `type` — `"Vídeo"`, `"Imagem"` ou `"UGC"`
- `duration` — `"5s"`, `"8s"` ou `"10s"`
- `format` — `"9:16"`, `"16:9"` ou `"1:1"`
- `status` — `"Testado"` ou `"A testar"`
- `prompt` — texto completo do prompt
- `tags` — array de strings

### Campos opcionais

- `testedModel` — modelo em que foi testado (ex: `"Kling 2.5"`). Vazio se `status` for `"A testar"`.
- `mediaType` — `"video"` ou `"image"`. Default: `"image"`.
- `mediaUrl` — URL do vídeo (.mp4/.webm) ou imagem. Vazio = placeholder.
- `thumbnailUrl` — URL da imagem de capa/poster.
- `mediaStatus` — `"available"` se tem mídia real, `"placeholder"` se não.
- `usageTip` — dica de uso exibida no modal.
- `avoidList` — lista de erros comuns a evitar.

### Categorias disponíveis

| ID | Label |
|---|---|
| `ganchos-virais` | Ganchos Virais |
| `ugc-vendas` | UGC & Vendas |
| `cta` | CTA |
| `selfie-espelho` | Selfie & Espelho |
| `moda-looks` | Moda & Looks |
| `produto-ecommerce` | Produto & E-commerce |
| `movimentos-corporais` | Movimentos Corporais |
| `movimentos-camera` | Movimentos de Câmera |
| `pov` | POV |
| `transicoes` | Transições |
| `consistencia-personagem` | Consistência de Personagem |
| `correcoes-realismo` | Correções & Realismo |
| `casa-organizacao` | Casa & Organização |
| `imagens` | Imagens |

## Como importar um lote de 120+ registros

1. Abra `src/data/import-batch.json`
2. Substitua o array vazio `[]` por um array contendo os novos registros
3. Salve o arquivo
4. O aplicativo carrega automaticamente todos os registros na próxima inicialização
5. Após validar, mova os registros para `motionlab-library.json` e limpe `import-batch.json` de volta para `[]`

## Mídia

- Se `mediaUrl` apontar para `.mp4`, `.webm`, `.ogg` ou `.mov`, o card mostra vídeo real com autoplay, muted, loop e playsInline
- Se `mediaUrl` estiver vazio mas `thumbnailUrl` existir, o card mostra a imagem de capa
- Se ambos estiverem vazios, o card mostra um placeholder visual gerado pela interface
- Não inventar URLs. Não usar imagens aleatórias. Apenas URLs reais fornecidas

## Contadores automáticos

Todos os contadores (total de prompts, prompts por categoria, prompts testados) são calculados automaticamente a partir do JSON. Não há necessidade de atualizar nenhum componente ao adicionar registros.

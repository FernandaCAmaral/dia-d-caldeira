import { salas, type Sala } from "./mock-data";

export const SALA_CODE_PREFIX = "CALDEIRA-SALA-";

/** Gera o código que será impresso no QR Code da porta da sala. */
export function buildSalaCode(salaId: string) {
  return `${SALA_CODE_PREFIX}${salaId}`;
}

/** Tenta extrair o id da sala a partir de um conteúdo de QR Code.
 *  Aceita: "CALDEIRA-SALA-s1", uma URL contendo ?codigo=CALDEIRA-SALA-s1
 *  ou ?sala=s1, ou apenas o id direto "s1". */
export function parseSalaFromQr(raw: string): Sala | null {
  if (!raw) return null;
  const text = raw.trim();

  // URL?
  try {
    const url = new URL(text);
    const codigo = url.searchParams.get("codigo");
    const sala = url.searchParams.get("sala");
    if (codigo) return findByCodeOrId(codigo);
    if (sala) return findByCodeOrId(sala);
  } catch {
    /* não é URL — segue */
  }

  return findByCodeOrId(text);
}

function findByCodeOrId(value: string): Sala | null {
  const clean = value.trim();
  const id = clean.startsWith(SALA_CODE_PREFIX)
    ? clean.slice(SALA_CODE_PREFIX.length)
    : clean;
  return salas.find((s) => s.id === id) ?? null;
}

/** Constrói uma rota textual entre uma sala de origem e uma de destino,
 *  usando a recepção principal como ponto de transferência. */
export function buildRotaEntreSalas(origem: Sala, destino: Sala): string[] {
  if (origem.id === destino.id) return destino.descricao_rota;

  const voltarParaRecepcao = [
    `Saia da ${origem.nome} (${origem.bloco}, ${origem.andar})`,
    origem.andar.toLowerCase().includes("térreo")
      ? "Caminhe pelo corredor até a recepção principal"
      : `Desça pelo elevador ou escada até o térreo`,
    "Siga até a recepção principal — seu novo ponto de partida",
  ];

  return [...voltarParaRecepcao, ...destino.descricao_rota];
}

/** URL pública de imagem de QR Code, sem precisar de dependência extra. */
export function qrImageUrl(content: string, size = 240) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(
    content,
  )}`;
}

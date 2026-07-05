import QRCode from "qrcode";

export async function generateTicketQrPng(token: string): Promise<Buffer> {
  return QRCode.toBuffer(token, { width: 320, margin: 1 });
}

export async function generateTicketQrDataUrl(token: string): Promise<string> {
  return QRCode.toDataURL(token, { width: 320, margin: 1 });
}

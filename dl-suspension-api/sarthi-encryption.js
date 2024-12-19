import crypto from 'crypto';

const aesKeyCBC = "710f5a3bbcb3c168409c47774ba11897be76f08e997085377803271c4d42e961";

export function decryptCBC(encryptedTextWithIV, key=aesKeyCBC) {
  try {
    const keyBytes = hexToBytes(key);
    const encryptedBytes = Buffer.from(encryptedTextWithIV, 'base64');
    const ivBytes = encryptedBytes.subarray(0, 16);
    const encryptedValueBytes = encryptedBytes.subarray(16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBytes, ivBytes);
    let decrypted = decipher.update(encryptedValueBytes);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  } catch (ex) {
    console.error('Decryption error:', ex);
    return '';
  }
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

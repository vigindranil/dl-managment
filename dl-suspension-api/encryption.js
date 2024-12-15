import crypto from "crypto";

const key = 'kfkdfbdkfbd79879898798fakfdkf456'; // key provided by the NIC
export const AESEncryption = (plaintext) => {
    const algorithm = "aes-256-cbc";
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'utf8'), iv);

    const ciphertextRaw = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);

    const hmac = crypto.createHmac("sha256", Buffer.from(key, 'utf8'))
                       .update(ciphertextRaw)
                       .digest();

    const ciphertext = Buffer.concat([iv, hmac, ciphertextRaw]).toString('base64');
    return ciphertext;
}

// const plaintext = JSON.stringify({ date: "2024-11-12", merchantid: "WB116XHRUP13265" });

// const encryptedText = AESEncryption(plaintext);
// console.log("encryptedText:", encryptedText);

// // test case : 1
// just run this command -- node encryption.js
// encryptedText: d24qemVtwtQ3LyzPy9xBThz78lPy19oAt9YjzpxAA8hsnviMmHZx62noyE+Mu442DIj4ZAGCF0GELcp66oqr1ajONbwnsjRb8KVs9oWEupnJ3vS1MhQpa7/1m0Qvhpf2gdM0kTPzkgTdOoLqAzel2Q==

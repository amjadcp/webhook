const createWebSocketFrame = (message) => {
  const msgBuffer = Buffer.from(message);
  const payloadLength = msgBuffer.length;
  let header;

  if (payloadLength <= 125) {
    header = Buffer.from([0x81, payloadLength]);
  } else if (payloadLength <= 65535) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(payloadLength, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(payloadLength), 2);
  }

  return Buffer.concat([header, msgBuffer]);
}

const parseWebSocketFrame = (data) =>{
  // TODO: handling masks and fragmentat
  const payloadLength = data[1] & 0x7f;
  let maskOffset = 2;

  if (payloadLength === 126) maskOffset += 2;
  else if (payloadLength === 127) maskOffset += 8;

  const mask = data.slice(maskOffset, maskOffset + 4);
  const payload = data.slice(maskOffset + 4);

  // Unmask payload
  const decoded = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i++) {
    decoded[i] = payload[i] ^ mask[i % 4];
  }
  const message = decoded.toString()
  return message
}

module.exports = {
  createWebSocketFrame,
  parseWebSocketFrame
}
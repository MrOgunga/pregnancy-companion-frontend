// Convert a 16-bit PCM mono WAV (what SoroTTS returns, 24 kHz) to MP3 bytes,
// so we can send it to Telegram as a playable audio reply (no ffmpeg needed).
// Dynamic import + flexible resolve to survive ESM/CJS interop across runtimes.
export async function wavToMp3(wav: Buffer): Promise<Buffer> {
  const mod = (await import("@breezystack/lamejs")) as unknown as Record<string, unknown>;
  const Ctor = (mod.Mp3Encoder ||
    (mod.default as Record<string, unknown> | undefined)?.Mp3Encoder ||
    mod.default) as new (channels: number, sampleRate: number, kbps: number) => {
    encodeBuffer(b: Int16Array): Uint8Array;
    flush(): Uint8Array;
  };

  // Walk the RIFF chunks to find sample rate + the data chunk.
  let sampleRate = 24000;
  let dataStart = 44;
  let dataLen = wav.length - 44;
  let offset = 12;
  while (offset + 8 <= wav.length) {
    const id = wav.toString("ascii", offset, offset + 4);
    const size = wav.readUInt32LE(offset + 4);
    if (id === "fmt ") sampleRate = wav.readUInt32LE(offset + 12);
    else if (id === "data") {
      dataStart = offset + 8;
      dataLen = size;
      break;
    }
    offset += 8 + size + (size % 2);
  }

  const n = Math.max(0, Math.floor(dataLen / 2));
  const samples = new Int16Array(n);
  for (let i = 0; i < n; i++) samples[i] = wav.readInt16LE(dataStart + i * 2);

  const enc = new Ctor(1, sampleRate, 128);
  const block = 1152;
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < samples.length; i += block) {
    const buf = enc.encodeBuffer(samples.subarray(i, i + block));
    if (buf.length) chunks.push(buf);
  }
  const end = enc.flush();
  if (end.length) chunks.push(end);
  return Buffer.concat(chunks.map((u) => Buffer.from(u.buffer, u.byteOffset, u.byteLength)));
}

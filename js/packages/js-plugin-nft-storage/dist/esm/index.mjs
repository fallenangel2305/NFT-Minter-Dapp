import { Blob, NFTStorage } from 'nft.storage';
import { CID as CID$1 } from 'multiformats';
import { NFTStorageMetaplexor } from '@nftstorage/metaplex-auth';
import { lamports, isKeypairSigner } from '@metaplex-foundation/js';
import crypto from 'crypto';
import * as dagPb from '@ipld/dag-pb';
import { UnixFS } from 'ipfs-unixfs';

/**
 * Drains an (async) iterable discarding its' content and does not return
 * anything.
 *
 * @template T
 * @param {AsyncIterable<T>|Iterable<T>} source
 * @returns {Promise<void>}
 */


const drain = async source => {
  for await (const _ of source) {} // eslint-disable-line no-unused-vars,no-empty

};

var itDrain = drain;
var drain$1 = itDrain;

/**
 * Filters the passed (async) iterable by using the filter function
 *
 * @template T
 * @param {AsyncIterable<T>|Iterable<T>} source
 * @param {function(T):boolean|Promise<boolean>} fn
 */


const filter = async function* (source, fn) {
  for await (const entry of source) {
    if (await fn(entry)) {
      yield entry;
    }
  }
};

var itFilter = filter;
var filter$1 = itFilter;

/**
 * Stop iteration after n items have been received.
 *
 * @template T
 * @param {AsyncIterable<T>|Iterable<T>} source
 * @param {number} limit
 * @returns {AsyncIterable<T>}
 */


const take = async function* (source, limit) {
  let items = 0;

  if (limit < 1) {
    return;
  }

  for await (const entry of source) {
    yield entry;
    items++;

    if (items === limit) {
      return;
    }
  }
};

var itTake = take;
var take$1 = itTake;

/**
 * Collects all values from an (async) iterable into an array and returns it.
 *
 * @template T
 * @param {AsyncIterable<T>|Iterable<T>} source
 */


const all = async source => {
  const arr = [];

  for await (const entry of source) {
    arr.push(entry);
  }

  return arr;
};

var itAll = all;
var all$1 = itAll;

const sortAll = (iterable, sorter) => {
  return async function* () {
    const values = await all$1(iterable);
    yield* values.sort(sorter);
  }();
};

class BaseBlockstore {
  open() {
    return Promise.reject(new Error('.open is not implemented'));
  }

  close() {
    return Promise.reject(new Error('.close is not implemented'));
  }

  put(key, val, options) {
    return Promise.reject(new Error('.put is not implemented'));
  }

  get(key, options) {
    return Promise.reject(new Error('.get is not implemented'));
  }

  has(key, options) {
    return Promise.reject(new Error('.has is not implemented'));
  }

  delete(key, options) {
    return Promise.reject(new Error('.delete is not implemented'));
  }

  async *putMany(source, options = {}) {
    for await (const {
      key,
      value
    } of source) {
      await this.put(key, value, options);
      yield {
        key,
        value
      };
    }
  }

  async *getMany(source, options = {}) {
    for await (const key of source) {
      yield this.get(key, options);
    }
  }

  async *deleteMany(source, options = {}) {
    for await (const key of source) {
      await this.delete(key, options);
      yield key;
    }
  }

  batch() {
    let puts = [];
    let dels = [];
    return {
      put(key, value) {
        puts.push({
          key,
          value
        });
      },

      delete(key) {
        dels.push(key);
      },

      commit: async options => {
        await drain$1(this.putMany(puts, options));
        puts = [];
        await drain$1(this.deleteMany(dels, options));
        dels = [];
      }
    };
  }

  async *_all(q, options) {
    throw new Error('._all is not implemented');
  }

  async *_allKeys(q, options) {
    throw new Error('._allKeys is not implemented');
  }

  query(q, options) {
    let it = this._all(q, options);

    if (q.prefix != null) {
      it = filter$1(it, e => e.key.toString().startsWith(q.prefix || ''));
    }

    if (Array.isArray(q.filters)) {
      it = q.filters.reduce((it, f) => filter$1(it, f), it);
    }

    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it, f) => sortAll(it, f), it);
    }

    if (q.offset != null) {
      let i = 0;
      it = filter$1(it, () => i++ >= (q.offset || 0));
    }

    if (q.limit != null) {
      it = take$1(it, q.limit);
    }

    return it;
  }

  queryKeys(q, options) {
    let it = this._allKeys(q, options);

    if (q.prefix != null) {
      it = filter$1(it, cid => cid.toString().startsWith(q.prefix || ''));
    }

    if (Array.isArray(q.filters)) {
      it = q.filters.reduce((it, f) => filter$1(it, f), it);
    }

    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it, f) => sortAll(it, f), it);
    }

    if (q.offset != null) {
      let i = 0;
      it = filter$1(it, () => i++ >= q.offset);
    }

    if (q.limit != null) {
      it = take$1(it, q.limit);
    }

    return it;
  }

}

function base(ALPHABET, name) {
  if (ALPHABET.length >= 255) {
    throw new TypeError('Alphabet too long');
  }

  var BASE_MAP = new Uint8Array(256);

  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }

  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i);
    var xc = x.charCodeAt(0);

    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x + ' is ambiguous');
    }

    BASE_MAP[xc] = i;
  }

  var BASE = ALPHABET.length;
  var LEADER = ALPHABET.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256);
  var iFACTOR = Math.log(256) / Math.log(BASE);

  function encode(source) {
    if (source instanceof Uint8Array) ;else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }

    if (!(source instanceof Uint8Array)) {
      throw new TypeError('Expected Uint8Array');
    }

    if (source.length === 0) {
      return '';
    }

    var zeroes = 0;
    var length = 0;
    var pbegin = 0;
    var pend = source.length;

    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }

    var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
    var b58 = new Uint8Array(size);

    while (pbegin !== pend) {
      var carry = source[pbegin];
      var i = 0;

      for (var it1 = size - 1; (carry !== 0 || i < length) && it1 !== -1; it1--, i++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }

      if (carry !== 0) {
        throw new Error('Non-zero carry');
      }

      length = i;
      pbegin++;
    }

    var it2 = size - length;

    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }

    var str = LEADER.repeat(zeroes);

    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }

    return str;
  }

  function decodeUnsafe(source) {
    if (typeof source !== 'string') {
      throw new TypeError('Expected String');
    }

    if (source.length === 0) {
      return new Uint8Array();
    }

    var psz = 0;

    if (source[psz] === ' ') {
      return;
    }

    var zeroes = 0;
    var length = 0;

    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }

    var size = (source.length - psz) * FACTOR + 1 >>> 0;
    var b256 = new Uint8Array(size);

    while (source[psz]) {
      var carry = BASE_MAP[source.charCodeAt(psz)];

      if (carry === 255) {
        return;
      }

      var i = 0;

      for (var it3 = size - 1; (carry !== 0 || i < length) && it3 !== -1; it3--, i++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }

      if (carry !== 0) {
        throw new Error('Non-zero carry');
      }

      length = i;
      psz++;
    }

    if (source[psz] === ' ') {
      return;
    }

    var it4 = size - length;

    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }

    var vch = new Uint8Array(zeroes + (size - it4));
    var j = zeroes;

    while (it4 !== size) {
      vch[j++] = b256[it4++];
    }

    return vch;
  }

  function decode(string) {
    var buffer = decodeUnsafe(string);

    if (buffer) {
      return buffer;
    }

    throw new Error(`Non-${name} character`);
  }

  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  };
}

var src = base;
var _brrp__multiformats_scope_baseX = src;
var basex = _brrp__multiformats_scope_baseX;

const equals$1 = (aa, bb) => {
  if (aa === bb) return true;

  if (aa.byteLength !== bb.byteLength) {
    return false;
  }

  for (let ii = 0; ii < aa.byteLength; ii++) {
    if (aa[ii] !== bb[ii]) {
      return false;
    }
  }

  return true;
};

const coerce = o => {
  if (o instanceof Uint8Array && o.constructor.name === 'Uint8Array') return o;
  if (o instanceof ArrayBuffer) return new Uint8Array(o);

  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }

  throw new Error('Unknown type, must be binary type');
};

class Encoder {
  constructor(name, prefix, baseEncode) {
    this.name = name;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
  }

  encode(bytes) {
    if (bytes instanceof Uint8Array) {
      return `${this.prefix}${this.baseEncode(bytes)}`;
    } else {
      throw Error('Unknown type, must be binary type');
    }
  }

}

class Decoder {
  constructor(name, prefix, baseDecode) {
    this.name = name;
    this.prefix = prefix;

    if (prefix.codePointAt(0) === undefined) {
      throw new Error('Invalid prefix character');
    }

    this.prefixCodePoint = prefix.codePointAt(0);
    this.baseDecode = baseDecode;
  }

  decode(text) {
    if (typeof text === 'string') {
      if (text.codePointAt(0) !== this.prefixCodePoint) {
        throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      }

      return this.baseDecode(text.slice(this.prefix.length));
    } else {
      throw Error('Can only multibase decode strings');
    }
  }

  or(decoder) {
    return or(this, decoder);
  }

}

class ComposedDecoder {
  constructor(decoders) {
    this.decoders = decoders;
  }

  or(decoder) {
    return or(this, decoder);
  }

  decode(input) {
    const prefix = input[0];
    const decoder = this.decoders[prefix];

    if (decoder) {
      return decoder.decode(input);
    } else {
      throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
    }
  }

}

const or = (left, right) => new ComposedDecoder({ ...(left.decoders || {
    [left.prefix]: left
  }),
  ...(right.decoders || {
    [right.prefix]: right
  })
});
class Codec {
  constructor(name, prefix, baseEncode, baseDecode) {
    this.name = name;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder(name, prefix, baseEncode);
    this.decoder = new Decoder(name, prefix, baseDecode);
  }

  encode(input) {
    return this.encoder.encode(input);
  }

  decode(input) {
    return this.decoder.decode(input);
  }

}
const from$1 = ({
  name,
  prefix,
  encode,
  decode
}) => new Codec(name, prefix, encode, decode);
const baseX = ({
  prefix,
  name,
  alphabet
}) => {
  const {
    encode,
    decode
  } = basex(alphabet, name);
  return from$1({
    prefix,
    name,
    encode,
    decode: text => coerce(decode(text))
  });
};

const decode$3 = (string, alphabet, bitsPerChar, name) => {
  const codes = {};

  for (let i = 0; i < alphabet.length; ++i) {
    codes[alphabet[i]] = i;
  }

  let end = string.length;

  while (string[end - 1] === '=') {
    --end;
  }

  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer = 0;
  let written = 0;

  for (let i = 0; i < end; ++i) {
    const value = codes[string[i]];

    if (value === undefined) {
      throw new SyntaxError(`Non-${name} character`);
    }

    buffer = buffer << bitsPerChar | value;
    bits += bitsPerChar;

    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer >> bits;
    }
  }

  if (bits >= bitsPerChar || 255 & buffer << 8 - bits) {
    throw new SyntaxError('Unexpected end of data');
  }

  return out;
};

const encode$2 = (data, alphabet, bitsPerChar) => {
  const pad = alphabet[alphabet.length - 1] === '=';
  const mask = (1 << bitsPerChar) - 1;
  let out = '';
  let bits = 0;
  let buffer = 0;

  for (let i = 0; i < data.length; ++i) {
    buffer = buffer << 8 | data[i];
    bits += 8;

    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet[mask & buffer >> bits];
    }
  }

  if (bits) {
    out += alphabet[mask & buffer << bitsPerChar - bits];
  }

  if (pad) {
    while (out.length * bitsPerChar & 7) {
      out += '=';
    }
  }

  return out;
};

const rfc4648 = ({
  name,
  prefix,
  bitsPerChar,
  alphabet
}) => {
  return from$1({
    prefix,
    name,

    encode(input) {
      return encode$2(input, alphabet, bitsPerChar);
    },

    decode(input) {
      return decode$3(input, alphabet, bitsPerChar, name);
    }

  });
};

const base32 = rfc4648({
  prefix: 'b',
  name: 'base32',
  alphabet: 'abcdefghijklmnopqrstuvwxyz234567',
  bitsPerChar: 5
});
rfc4648({
  prefix: 'B',
  name: 'base32upper',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
  bitsPerChar: 5
});
rfc4648({
  prefix: 'c',
  name: 'base32pad',
  alphabet: 'abcdefghijklmnopqrstuvwxyz234567=',
  bitsPerChar: 5
});
rfc4648({
  prefix: 'C',
  name: 'base32padupper',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=',
  bitsPerChar: 5
});
rfc4648({
  prefix: 'v',
  name: 'base32hex',
  alphabet: '0123456789abcdefghijklmnopqrstuv',
  bitsPerChar: 5
});
rfc4648({
  prefix: 'V',
  name: 'base32hexupper',
  alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
  bitsPerChar: 5
});
rfc4648({
  prefix: 't',
  name: 'base32hexpad',
  alphabet: '0123456789abcdefghijklmnopqrstuv=',
  bitsPerChar: 5
});
rfc4648({
  prefix: 'T',
  name: 'base32hexpadupper',
  alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV=',
  bitsPerChar: 5
});
rfc4648({
  prefix: 'h',
  name: 'base32z',
  alphabet: 'ybndrfg8ejkmcpqxot1uwisza345h769',
  bitsPerChar: 5
});

var encode_1 = encode$1;
var MSB = 128,
    REST = 127,
    MSBALL = ~REST,
    INT = Math.pow(2, 31);

function encode$1(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;

  while (num >= INT) {
    out[offset++] = num & 255 | MSB;
    num /= 128;
  }

  while (num & MSBALL) {
    out[offset++] = num & 255 | MSB;
    num >>>= 7;
  }

  out[offset] = num | 0;
  encode$1.bytes = offset - oldOffset + 1;
  return out;
}

var decode$2 = read;
var MSB$1 = 128,
    REST$1 = 127;

function read(buf, offset) {
  var res = 0,
      offset = offset || 0,
      shift = 0,
      counter = offset,
      b,
      l = buf.length;

  do {
    if (counter >= l) {
      read.bytes = 0;
      throw new RangeError('Could not decode varint');
    }

    b = buf[counter++];
    res += shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$1);

  read.bytes = counter - offset;
  return res;
}

var N1 = Math.pow(2, 7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);

var length = function (value) {
  return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
};

var varint = {
  encode: encode_1,
  decode: decode$2,
  encodingLength: length
};
var _brrp_varint = varint;
var varint$1 = _brrp_varint;

const decode$1 = data => {
  const code = varint$1.decode(data);
  return [code, varint$1.decode.bytes];
};
const encodeTo = (int, target, offset = 0) => {
  varint$1.encode(int, target, offset);
  return target;
};
const encodingLength = int => {
  return varint$1.encodingLength(int);
};

const create = (code, digest) => {
  const size = digest.byteLength;
  const sizeOffset = encodingLength(code);
  const digestOffset = sizeOffset + encodingLength(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo(code, bytes, 0);
  encodeTo(size, bytes, sizeOffset);
  bytes.set(digest, digestOffset);
  return new Digest(code, size, digest, bytes);
};
const decode = multihash => {
  const bytes = coerce(multihash);
  const [code, sizeOffset] = decode$1(bytes);
  const [size, digestOffset] = decode$1(bytes.subarray(sizeOffset));
  const digest = bytes.subarray(sizeOffset + digestOffset);

  if (digest.byteLength !== size) {
    throw new Error('Incorrect length');
  }

  return new Digest(code, size, digest, bytes);
};
const equals = (a, b) => {
  if (a === b) {
    return true;
  } else {
    return a.code === b.code && a.size === b.size && equals$1(a.bytes, b.bytes);
  }
};
class Digest {
  constructor(code, size, digest, bytes) {
    this.code = code;
    this.size = size;
    this.digest = digest;
    this.bytes = bytes;
  }

}

const base58btc = baseX({
  name: 'base58btc',
  prefix: 'z',
  alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
});
baseX({
  name: 'base58flickr',
  prefix: 'Z',
  alphabet: '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'
});

class CID {
  constructor(version, code, multihash, bytes) {
    this.code = code;
    this.version = version;
    this.multihash = multihash;
    this.bytes = bytes;
    this.byteOffset = bytes.byteOffset;
    this.byteLength = bytes.byteLength;
    this.asCID = this;
    this._baseCache = new Map();
    Object.defineProperties(this, {
      byteOffset: hidden,
      byteLength: hidden,
      code: readonly$1,
      version: readonly$1,
      multihash: readonly$1,
      bytes: readonly$1,
      _baseCache: hidden,
      asCID: hidden
    });
  }

  toV0() {
    switch (this.version) {
      case 0:
        {
          return this;
        }

      default:
        {
          const {
            code,
            multihash
          } = this;

          if (code !== DAG_PB_CODE) {
            throw new Error('Cannot convert a non dag-pb CID to CIDv0');
          }

          if (multihash.code !== SHA_256_CODE) {
            throw new Error('Cannot convert non sha2-256 multihash CID to CIDv0');
          }

          return CID.createV0(multihash);
        }
    }
  }

  toV1() {
    switch (this.version) {
      case 0:
        {
          const {
            code,
            digest
          } = this.multihash;
          const multihash = create(code, digest);
          return CID.createV1(this.code, multihash);
        }

      case 1:
        {
          return this;
        }

      default:
        {
          throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
        }
    }
  }

  equals(other) {
    return other && this.code === other.code && this.version === other.version && equals(this.multihash, other.multihash);
  }

  toString(base) {
    const {
      bytes,
      version,
      _baseCache
    } = this;

    switch (version) {
      case 0:
        return toStringV0(bytes, _baseCache, base || base58btc.encoder);

      default:
        return toStringV1(bytes, _baseCache, base || base32.encoder);
    }
  }

  toJSON() {
    return {
      code: this.code,
      version: this.version,
      hash: this.multihash.bytes
    };
  }

  get [Symbol.toStringTag]() {
    return 'CID';
  }

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return 'CID(' + this.toString() + ')';
  }

  static isCID(value) {
    deprecate(/^0\.0/, IS_CID_DEPRECATION);
    return !!(value && (value[cidSymbol] || value.asCID === value));
  }

  get toBaseEncodedString() {
    throw new Error('Deprecated, use .toString()');
  }

  get codec() {
    throw new Error('"codec" property is deprecated, use integer "code" property instead');
  }

  get buffer() {
    throw new Error('Deprecated .buffer property, use .bytes to get Uint8Array instead');
  }

  get multibaseName() {
    throw new Error('"multibaseName" property is deprecated');
  }

  get prefix() {
    throw new Error('"prefix" property is deprecated');
  }

  static asCID(value) {
    if (value instanceof CID) {
      return value;
    } else if (value != null && value.asCID === value) {
      const {
        version,
        code,
        multihash,
        bytes
      } = value;
      return new CID(version, code, multihash, bytes || encodeCID(version, code, multihash.bytes));
    } else if (value != null && value[cidSymbol] === true) {
      const {
        version,
        multihash,
        code
      } = value;
      const digest = decode(multihash);
      return CID.create(version, code, digest);
    } else {
      return null;
    }
  }

  static create(version, code, digest) {
    if (typeof code !== 'number') {
      throw new Error('String codecs are no longer supported');
    }

    switch (version) {
      case 0:
        {
          if (code !== DAG_PB_CODE) {
            throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
          } else {
            return new CID(version, code, digest, digest.bytes);
          }
        }

      case 1:
        {
          const bytes = encodeCID(version, code, digest.bytes);
          return new CID(version, code, digest, bytes);
        }

      default:
        {
          throw new Error('Invalid version');
        }
    }
  }

  static createV0(digest) {
    return CID.create(0, DAG_PB_CODE, digest);
  }

  static createV1(code, digest) {
    return CID.create(1, code, digest);
  }

  static decode(bytes) {
    const [cid, remainder] = CID.decodeFirst(bytes);

    if (remainder.length) {
      throw new Error('Incorrect length');
    }

    return cid;
  }

  static decodeFirst(bytes) {
    const specs = CID.inspectBytes(bytes);
    const prefixSize = specs.size - specs.multihashSize;
    const multihashBytes = coerce(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));

    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error('Incorrect length');
    }

    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? CID.createV0(digest) : CID.createV1(specs.codec, digest);
    return [cid, bytes.subarray(specs.size)];
  }

  static inspectBytes(initialBytes) {
    let offset = 0;

    const next = () => {
      const [i, length] = decode$1(initialBytes.subarray(offset));
      offset += length;
      return i;
    };

    let version = next();
    let codec = DAG_PB_CODE;

    if (version === 18) {
      version = 0;
      offset = 0;
    } else if (version === 1) {
      codec = next();
    }

    if (version !== 0 && version !== 1) {
      throw new RangeError(`Invalid CID version ${version}`);
    }

    const prefixSize = offset;
    const multihashCode = next();
    const digestSize = next();
    const size = offset + digestSize;
    const multihashSize = size - prefixSize;
    return {
      version,
      codec,
      multihashCode,
      digestSize,
      multihashSize,
      size
    };
  }

  static parse(source, base) {
    const [prefix, bytes] = parseCIDtoBytes(source, base);
    const cid = CID.decode(bytes);

    cid._baseCache.set(prefix, source);

    return cid;
  }

}

const parseCIDtoBytes = (source, base) => {
  switch (source[0]) {
    case 'Q':
      {
        const decoder = base || base58btc;
        return [base58btc.prefix, decoder.decode(`${base58btc.prefix}${source}`)];
      }

    case base58btc.prefix:
      {
        const decoder = base || base58btc;
        return [base58btc.prefix, decoder.decode(source)];
      }

    case base32.prefix:
      {
        const decoder = base || base32;
        return [base32.prefix, decoder.decode(source)];
      }

    default:
      {
        if (base == null) {
          throw Error('To parse non base32 or base58btc encoded CID multibase decoder must be provided');
        }

        return [source[0], base.decode(source)];
      }
  }
};

const toStringV0 = (bytes, cache, base) => {
  const {
    prefix
  } = base;

  if (prefix !== base58btc.prefix) {
    throw Error(`Cannot string encode V0 in ${base.name} encoding`);
  }

  const cid = cache.get(prefix);

  if (cid == null) {
    const cid = base.encode(bytes).slice(1);
    cache.set(prefix, cid);
    return cid;
  } else {
    return cid;
  }
};

const toStringV1 = (bytes, cache, base) => {
  const {
    prefix
  } = base;
  const cid = cache.get(prefix);

  if (cid == null) {
    const cid = base.encode(bytes);
    cache.set(prefix, cid);
    return cid;
  } else {
    return cid;
  }
};

const DAG_PB_CODE = 112;
const SHA_256_CODE = 18;

const encodeCID = (version, code, multihash) => {
  const codeOffset = encodingLength(version);
  const hashOffset = codeOffset + encodingLength(code);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo(version, bytes, 0);
  encodeTo(code, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
};

const cidSymbol = Symbol.for('@ipld/js-cid/CID');
const readonly$1 = {
  writable: false,
  configurable: false,
  enumerable: true
};
const hidden = {
  writable: false,
  enumerable: false,
  configurable: false
};
const version = '0.0.0-dev';

const deprecate = (range, message) => {
  if (range.test(version)) {
    console.warn(message);
  } else {
    throw new Error(message);
  }
};

const IS_CID_DEPRECATION = `CID.isCID(v) is deprecated and will be removed in the next major release.
Following code pattern:

if (CID.isCID(value)) {
  doSomethingWithCID(value)
}

Is replaced with:

const cid = CID.asCID(value)
if (cid) {
  // Make sure to use cid instead of value
  doSomethingWithCID(cid)
}
`;

class MemoryBlockStore extends BaseBlockstore {
    constructor() {
        super();
        this.store = new Map();
    }
    async *blocks() {
        for (const [cidStr, bytes] of this.store.entries()) {
            yield { cid: CID$1.parse(cidStr), bytes };
        }
    }
    put(cid, bytes) {
        this.store.set(cid.toString(), bytes);
        return Promise.resolve();
    }
    get(cid) {
        const bytes = this.store.get(cid.toString());
        if (!bytes) {
            throw new Error(`block with cid ${cid.toString()} no found`);
        }
        return Promise.resolve(bytes);
    }
    has(cid) {
        return Promise.resolve(this.store.has(cid.toString()));
    }
    close() {
        this.store.clear();
        return Promise.resolve();
    }
}

const from = ({
  name,
  code,
  encode
}) => new Hasher(name, code, encode);
class Hasher {
  constructor(name, code, encode) {
    this.name = name;
    this.code = code;
    this.encode = encode;
  }

  digest(input) {
    if (input instanceof Uint8Array) {
      const result = this.encode(input);
      return result instanceof Uint8Array ? create(this.code, result) : result.then(digest => create(this.code, digest));
    } else {
      throw Error('Unknown type, must be binary type');
    }
  }

}

const readonly = ({
  enumerable = true,
  configurable = false
} = {}) => ({
  enumerable,
  configurable,
  writable: false
});

const links = function* (source, base) {
  if (source == null) return;
  if (source instanceof Uint8Array) return;

  for (const [key, value] of Object.entries(source)) {
    const path = [...base, key];

    if (value != null && typeof value === 'object') {
      if (Array.isArray(value)) {
        for (const [index, element] of value.entries()) {
          const elementPath = [...path, index];
          const cid = CID.asCID(element);

          if (cid) {
            yield [elementPath.join('/'), cid];
          } else if (typeof element === 'object') {
            yield* links(element, elementPath);
          }
        }
      } else {
        const cid = CID.asCID(value);

        if (cid) {
          yield [path.join('/'), cid];
        } else {
          yield* links(value, path);
        }
      }
    }
  }
};

const tree = function* (source, base) {
  if (source == null) return;

  for (const [key, value] of Object.entries(source)) {
    const path = [...base, key];
    yield path.join('/');

    if (value != null && !(value instanceof Uint8Array) && typeof value === 'object' && !CID.asCID(value)) {
      if (Array.isArray(value)) {
        for (const [index, element] of value.entries()) {
          const elementPath = [...path, index];
          yield elementPath.join('/');

          if (typeof element === 'object' && !CID.asCID(element)) {
            yield* tree(element, elementPath);
          }
        }
      } else {
        yield* tree(value, path);
      }
    }
  }
};

const get = (source, path) => {
  let node = source;

  for (const [index, key] of path.entries()) {
    node = node[key];

    if (node == null) {
      throw new Error(`Object has no property at ${path.slice(0, index + 1).map(part => `[${JSON.stringify(part)}]`).join('')}`);
    }

    const cid = CID.asCID(node);

    if (cid) {
      return {
        value: cid,
        remaining: path.slice(index + 1).join('/')
      };
    }
  }

  return {
    value: node
  };
};

class Block {
  constructor({
    cid,
    bytes,
    value
  }) {
    if (!cid || !bytes || typeof value === 'undefined') throw new Error('Missing required argument');
    this.cid = cid;
    this.bytes = bytes;
    this.value = value;
    this.asBlock = this;
    Object.defineProperties(this, {
      cid: readonly(),
      bytes: readonly(),
      value: readonly(),
      asBlock: readonly()
    });
  }

  links() {
    return links(this.value, []);
  }

  tree() {
    return tree(this.value, []);
  }

  get(path = '/') {
    return get(this.value, path.split('/').filter(Boolean));
  }

}

const encode = async ({
  value,
  codec,
  hasher
}) => {
  if (typeof value === 'undefined') throw new Error('Missing required argument "value"');
  if (!codec || !hasher) throw new Error('Missing required argument: codec or hasher');
  const bytes = codec.encode(value);
  const hash = await hasher.digest(bytes);
  const cid = CID.create(1, codec.code, hash);
  return new Block({
    value,
    bytes,
    cid
  });
};

const sha256 = from({
  name: 'sha2-256',
  code: 18,
  encode: input => coerce(crypto.createHash('sha256').update(input).digest())
});
from({
  name: 'sha2-512',
  code: 19,
  encode: input => coerce(crypto.createHash('sha512').update(input).digest())
});

/**
 * An implementation of the CAR reader interface that is backed by a blockstore.
 * @see https://github.com/nftstorage/nft.storage/blob/0fc7e4e73867c437eac54f75f58a808dd4581c47/packages/client/src/bs-car-reader.js
 */
class BlockstoreCarReader {
  constructor(roots, blockstore, version = 1) {
    this._version = version;
    this._roots = roots;
    this._blockstore = blockstore;
  }

  get version() {
    return this._version;
  }

  get blockstore() {
    return this._blockstore;
  }

  async getRoots() {
    return this._roots;
  }

  has(cid) {
    return this._blockstore.has(cid);
  }

  async get(cid) {
    const bytes = await this._blockstore.get(cid);
    return {
      cid,
      bytes
    };
  }

  blocks() {
    return this._blockstore.blocks();
  }

  async *cids() {
    for await (const b of this.blocks()) {
      yield b.cid;
    }
  }

}

const DEFAULT_GATEWAY_HOST = 'https://nftstorage.link';
function toGatewayUri(cid, path = '', host = DEFAULT_GATEWAY_HOST) {
  let pathPrefix = `/ipfs/${cid}`;

  if (path) {
    pathPrefix += '/';
  }

  host = host || DEFAULT_GATEWAY_HOST;
  const base = new URL(pathPrefix, host);
  const u = new URL(path, base);
  return u.toString();
}
function toIpfsUri(cid, path = '') {
  const u = new URL(path, `ipfs://${cid}`);
  return u.toString();
}
async function toDagPbLink(node, name) {
  const block = await node.car.get(node.cid);

  if (!block) {
    throw new Error(`invalid CAR: missing block for CID [${node.cid}]`);
  }

  return dagPb.createLink(name, block.bytes.byteLength, node.cid);
}
async function toDirectoryBlock(links) {
  const data = new UnixFS({
    type: 'directory'
  }).marshal();
  const value = dagPb.createNode(data, links);
  return encode({
    value,
    codec: dagPb,
    hasher: sha256
  });
}
async function toEncodedCar(block, blockstore) {
  await blockstore.put(block.cid, block.bytes);
  const car = new BlockstoreCarReader([block.cid], blockstore);
  const cid = block.cid;
  return {
    car,
    cid
  };
}

class NftStorageDriver {
  constructor(metaplex, options = {}) {
    var _options$batchSize, _options$useGatewayUr;

    this.metaplex = metaplex;
    this.identity = options.identity;
    this.token = options.token;
    this.endpoint = options.endpoint;
    this.gatewayHost = options.gatewayHost;
    this.batchSize = (_options$batchSize = options.batchSize) !== null && _options$batchSize !== void 0 ? _options$batchSize : 50;
    this.useGatewayUrls = (_options$useGatewayUr = options.useGatewayUrls) !== null && _options$useGatewayUr !== void 0 ? _options$useGatewayUr : true;
  }

  onProgress(callback) {
    this.onStoredChunk = callback;
    return this;
  }

  async getUploadPrice(_bytes) {
    return lamports(0);
  }

  async upload(file) {
    return (await this.uploadAll([file]))[0];
  }

  async uploadAll(files) {
    if (this.batchSize <= 0) {
      throw new Error('batchSize must be greater than 0');
    }

    const client = await this.client();
    const blockstore = new MemoryBlockStore();
    const uris = [];
    const numBatches = Math.ceil(files.length / this.batchSize);
    const batches = new Array(numBatches).fill([]).map((_, i) => files.slice(i * this.batchSize, (i + 1) * this.batchSize));

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchLinks = [];

      for (let j = 0; j < batch.length; j++) {
        const file = batch[j];
        const blob = new Blob([file.buffer]);
        const node = await NFTStorage.encodeBlob(blob, {
          blockstore
        });
        const fileUri = this.useGatewayUrls ? toGatewayUri(node.cid.toString(), undefined, this.gatewayHost) : toIpfsUri(node.cid.toString());
        uris.push(fileUri);
        batchLinks.push(await toDagPbLink(node, file.uniqueName));
      }

      const batchBlock = await toDirectoryBlock(batchLinks);
      const {
        cid,
        car
      } = await toEncodedCar(batchBlock, blockstore);
      const options = {
        onStoredChunk: this.onStoredChunk
      };
      const promise = isNFTStorageMetaplexor(client) ? client.storeCar(cid, car, options) : client.storeCar(car, options);
      await promise;
    }

    return uris;
  }

  async client() {
    var _this$identity;

    if (this.token) {
      return new NFTStorage({
        token: this.token,
        endpoint: this.endpoint
      });
    }

    const signer = (_this$identity = this.identity) !== null && _this$identity !== void 0 ? _this$identity : this.metaplex.identity();
    const authOptions = {
      mintingAgent: '@metaplex-foundation/js-plugin-nft-storage',
      solanaCluster: this.metaplex.cluster,
      endpoint: this.endpoint
    };
    return isKeypairSigner(signer) ? NFTStorageMetaplexor.withSecretKey(signer.secretKey, authOptions) : NFTStorageMetaplexor.withSigner(signer.signMessage.bind(signer), signer.publicKey.toBuffer(), authOptions);
  }

}

const isNFTStorageMetaplexor = client => {
  return 'storeNFTFromFilesystem' in client;
};

const nftStorage = (options = {}) => ({
  install(metaplex) {
    metaplex.storage().setDriver(new NftStorageDriver(metaplex, options));
  }

});

export { DEFAULT_GATEWAY_HOST, NftStorageDriver, nftStorage, toDagPbLink, toDirectoryBlock, toEncodedCar, toGatewayUri, toIpfsUri };
//# sourceMappingURL=index.mjs.map

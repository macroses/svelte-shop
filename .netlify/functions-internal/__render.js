var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/netlify/entry.js
__export(exports, {
  handler: () => handler
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var dataUriToBuffer$1 = src;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var Blob$1 = fetchBlob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error2;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new Blob$1([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
        reject(error2);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}

// .svelte-kit/output/server/app.js
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error$1(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler2 = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler2) {
    return;
  }
  const params = route.params(match);
  const response = await handler2({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error$1(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error$1(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop$1() {
}
function safe_not_equal$1(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue$1 = [];
function writable$1(value, start = noop$1) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal$1(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue$1.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue$1.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue$1.length; i += 2) {
            subscriber_queue$1[i][0](subscriber_queue$1[i + 1]);
          }
          subscriber_queue$1.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop$1;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable$1($session);
    const props = {
      stores: {
        page: writable$1(null),
        navigating: writable$1(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page && page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page && page.path)},
						query: new URLSearchParams(${page ? s$1(page.query.toString()) : ""}),
						params: ${page && s$1(page.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  const page_proxy = new Proxy(page, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = {
            ...opts.headers
          };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape$1(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped$2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape$1(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$2) {
      result += escaped$2[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            });
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    });
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  constructor(map) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        const decoded = decodeURI(request2.path);
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(decoded);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function noop() {
}
function is_promise(value) {
  return value && typeof value === "object" && typeof value.then === "function";
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function null_to_empty(value) {
  return value == null ? "" : value;
}
function set_store_value(store, ret, value) {
  store.set(value);
  return ret;
}
var is_client = typeof window !== "undefined";
var now = is_client ? () => window.performance.now() : () => Date.now();
var raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
var tasks = new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
function custom_event(type, detail, bubbles = false) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
    }
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
Promise.resolve();
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
var escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var css$G = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$G);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
var base = "";
var assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\r\n<html lang="en">\r\n	<head>\r\n		<meta charset="utf-8" />\r\n		<link rel="icon" href="/logo.svg" />\r\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\r\n		<meta name="description" content="shop">\r\n		<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">\r\n\r\n		' + head + '\r\n	</head>\r\n	<body>\r\n		<div id="svelte">' + body + "</div>\r\n	</body>\r\n</html>\r\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-cfd8a177.js",
      css: [assets + "/_app/assets/start-61d1577b.css", assets + "/_app/assets/vendor-56347699.css"],
      js: [assets + "/_app/start-cfd8a177.js", assets + "/_app/chunks/vendor-d903b9b8.js", assets + "/_app/chunks/singletons-12a22614.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var d = decodeURIComponent;
var empty = () => ({});
var manifest = {
  assets: [{ "file": "default_img.svg", "size": 772, "type": "image/svg+xml" }, { "file": "fonts.css", "size": 6656, "type": "text/css" }, { "file": "goods/1_10_a.jpg", "size": 82352, "type": "image/jpeg" }, { "file": "goods/1_10_b.jpg", "size": 50114, "type": "image/jpeg" }, { "file": "goods/1_10_c.jpg", "size": 66579, "type": "image/jpeg" }, { "file": "goods/1_10_d.jpg", "size": 77172, "type": "image/jpeg" }, { "file": "goods/1_10_e.jpg", "size": 80425, "type": "image/jpeg" }, { "file": "goods/1_1_a.webp", "size": 11074, "type": "image/webp" }, { "file": "goods/1_1_b.webp", "size": 85116, "type": "image/webp" }, { "file": "goods/1_1_c.webp", "size": 96278, "type": "image/webp" }, { "file": "goods/1_1_d.webp", "size": 110184, "type": "image/webp" }, { "file": "goods/1_2_a.jpg", "size": 49625, "type": "image/jpeg" }, { "file": "goods/1_2_b.jpg", "size": 97652, "type": "image/jpeg" }, { "file": "goods/1_2_c.jpg", "size": 46114, "type": "image/jpeg" }, { "file": "goods/1_2_d.jpg", "size": 45933, "type": "image/jpeg" }, { "file": "goods/1_2_e.jpg", "size": 37918, "type": "image/jpeg" }, { "file": "goods/1_3_a.jpg", "size": 105700, "type": "image/jpeg" }, { "file": "goods/1_3_b.jpg", "size": 89812, "type": "image/jpeg" }, { "file": "goods/1_3_c.jpg", "size": 77792, "type": "image/jpeg" }, { "file": "goods/1_3_d.jpg", "size": 40704, "type": "image/jpeg" }, { "file": "goods/1_3_e.jpg", "size": 54663, "type": "image/jpeg" }, { "file": "goods/1_3_f.jpg", "size": 29867, "type": "image/jpeg" }, { "file": "goods/1_4_a.jpg", "size": 53236, "type": "image/jpeg" }, { "file": "goods/1_4_b.jpg", "size": 46963, "type": "image/jpeg" }, { "file": "goods/1_4_c.jpg", "size": 95898, "type": "image/jpeg" }, { "file": "goods/1_4_d.jpg", "size": 94748, "type": "image/jpeg" }, { "file": "goods/1_4_e.jpg", "size": 92357, "type": "image/jpeg" }, { "file": "goods/1_4_f.jpg", "size": 87244, "type": "image/jpeg" }, { "file": "goods/1_5_a.jpg", "size": 64373, "type": "image/jpeg" }, { "file": "goods/1_5_b.jpg", "size": 61664, "type": "image/jpeg" }, { "file": "goods/1_5_c.jpg", "size": 57821, "type": "image/jpeg" }, { "file": "goods/1_5_d.jpg", "size": 58613, "type": "image/jpeg" }, { "file": "goods/1_5_e.jpg", "size": 89085, "type": "image/jpeg" }, { "file": "goods/1_6_a.jpg", "size": 90569, "type": "image/jpeg" }, { "file": "goods/1_6_b.jpg", "size": 420071, "type": "image/jpeg" }, { "file": "goods/1_6_c.jpg", "size": 83424, "type": "image/jpeg" }, { "file": "goods/1_6_d.jpg", "size": 81055, "type": "image/jpeg" }, { "file": "goods/1_6_e.jpg", "size": 99634, "type": "image/jpeg" }, { "file": "goods/1_6_f.jpg", "size": 99209, "type": "image/jpeg" }, { "file": "goods/1_7_a.jpg", "size": 94887, "type": "image/jpeg" }, { "file": "goods/1_7_b.jpg", "size": 100683, "type": "image/jpeg" }, { "file": "goods/1_7_c.jpg", "size": 102490, "type": "image/jpeg" }, { "file": "goods/1_7_d.jpg", "size": 102280, "type": "image/jpeg" }, { "file": "goods/1_7_e.jpg", "size": 40935, "type": "image/jpeg" }, { "file": "goods/1_8_a.jpg", "size": 59248, "type": "image/jpeg" }, { "file": "goods/1_8_b.jpg", "size": 78061, "type": "image/jpeg" }, { "file": "goods/1_8_c.jpg", "size": 58569, "type": "image/jpeg" }, { "file": "goods/1_8_d.jpg", "size": 87991, "type": "image/jpeg" }, { "file": "goods/1_8_e.jpg", "size": 90949, "type": "image/jpeg" }, { "file": "goods/1_8_f.jpg", "size": 125455, "type": "image/jpeg" }, { "file": "goods/1_8_g.jpg", "size": 119547, "type": "image/jpeg" }, { "file": "goods/1_8_h.jpg", "size": 84039, "type": "image/jpeg" }, { "file": "goods/1_9_a.jpg", "size": 103065, "type": "image/jpeg" }, { "file": "goods/1_9_b.jpg", "size": 101353, "type": "image/jpeg" }, { "file": "goods/1_9_c.jpg", "size": 102226, "type": "image/jpeg" }, { "file": "goods/1_9_d.jpg", "size": 100977, "type": "image/jpeg" }, { "file": "goods/1_9_e.jpg", "size": 45655, "type": "image/jpeg" }, { "file": "goods/2_1_a.jpg", "size": 1099089, "type": "image/jpeg" }, { "file": "goods/2_1_b.jpg", "size": 45257, "type": "image/jpeg" }, { "file": "goods/2_1_c.jpg", "size": 109721, "type": "image/jpeg" }, { "file": "goods/2_1_d.jpg", "size": 42111, "type": "image/jpeg" }, { "file": "goods/2_1_e.jpg", "size": 169732, "type": "image/jpeg" }, { "file": "goods/2_2_a.jpg", "size": 859471, "type": "image/jpeg" }, { "file": "goods/2_2_b.jpg", "size": 102217, "type": "image/jpeg" }, { "file": "goods/2_2_c.jpg", "size": 82378, "type": "image/jpeg" }, { "file": "goods/2_2_d.jpg", "size": 86333, "type": "image/jpeg" }, { "file": "goods/2_3_a.jpg", "size": 49413, "type": "image/jpeg" }, { "file": "goods/2_3_b.jpg", "size": 41244, "type": "image/jpeg" }, { "file": "goods/2_3_c.jpg", "size": 26142, "type": "image/jpeg" }, { "file": "goods/2_3_d.jpg", "size": 182660, "type": "image/jpeg" }, { "file": "goods/2_3_e.jpg", "size": 89386, "type": "image/jpeg" }, { "file": "goods/2_4_a.jpg", "size": 103583, "type": "image/jpeg" }, { "file": "goods/2_4_b.jpg", "size": 97321, "type": "image/jpeg" }, { "file": "goods/2_4_c.jpg", "size": 45950, "type": "image/jpeg" }, { "file": "goods/2_4_d.jpg", "size": 58576, "type": "image/jpeg" }, { "file": "goods/2_4_e.jpg", "size": 128091, "type": "image/jpeg" }, { "file": "goods/2_5_a.jpg", "size": 110252, "type": "image/jpeg" }, { "file": "goods/2_5_b.jpg", "size": 69953, "type": "image/jpeg" }, { "file": "goods/2_5_c.jpg", "size": 79092, "type": "image/jpeg" }, { "file": "goods/2_5_d.jpg", "size": 91669, "type": "image/jpeg" }, { "file": "goods/2_6_a.jpg", "size": 103358, "type": "image/jpeg" }, { "file": "goods/2_6_b.jpg", "size": 80735, "type": "image/jpeg" }, { "file": "goods/2_6_c.jpg", "size": 80352, "type": "image/jpeg" }, { "file": "goods/2_6_d.jpg", "size": 85418, "type": "image/jpeg" }, { "file": "goods/2_6_e.jpg", "size": 83677, "type": "image/jpeg" }, { "file": "goods/2_7_a.jpg", "size": 123959, "type": "image/jpeg" }, { "file": "goods/2_7_b.jpg", "size": 37403, "type": "image/jpeg" }, { "file": "goods/2_7_c.jpg", "size": 154860, "type": "image/jpeg" }, { "file": "goods/2_7_d.jpg", "size": 82940, "type": "image/jpeg" }, { "file": "goods/2_7_e.jpg", "size": 83194, "type": "image/jpeg" }, { "file": "goods/2_8_a.jpg", "size": 78860, "type": "image/jpeg" }, { "file": "goods/2_8_b.jpg", "size": 130056, "type": "image/jpeg" }, { "file": "goods/2_8_c.jpg", "size": 162589, "type": "image/jpeg" }, { "file": "goods/2_8_d.jpg", "size": 54777, "type": "image/jpeg" }, { "file": "goods/2_8_e.jpg", "size": 64896, "type": "image/jpeg" }, { "file": "goods/2_8_f.jpg", "size": 66938, "type": "image/jpeg" }, { "file": "goods/3_10_a.jpg", "size": 135356, "type": "image/jpeg" }, { "file": "goods/3_1_a.jpg", "size": 65104, "type": "image/jpeg" }, { "file": "goods/3_1_b.jpg", "size": 110834, "type": "image/jpeg" }, { "file": "goods/3_1_c.jpg", "size": 66758, "type": "image/jpeg" }, { "file": "goods/3_1_d.jpg", "size": 98027, "type": "image/jpeg" }, { "file": "goods/3_1_e.jpg", "size": 144052, "type": "image/jpeg" }, { "file": "goods/3_2_a.jpg", "size": 84220, "type": "image/jpeg" }, { "file": "goods/3_2_b.jpg", "size": 81343, "type": "image/jpeg" }, { "file": "goods/3_2_c.jpg", "size": 58390, "type": "image/jpeg" }, { "file": "goods/3_2_d.jpg", "size": 81517, "type": "image/jpeg" }, { "file": "goods/3_2_e.jpg", "size": 104140, "type": "image/jpeg" }, { "file": "goods/3_3_a.jpg", "size": 102598, "type": "image/jpeg" }, { "file": "goods/3_3_b.jpg", "size": 109501, "type": "image/jpeg" }, { "file": "goods/3_3_c.jpg", "size": 141771, "type": "image/jpeg" }, { "file": "goods/3_3_d.jpg", "size": 119839, "type": "image/jpeg" }, { "file": "goods/3_3_e.jpg", "size": 167539, "type": "image/jpeg" }, { "file": "goods/3_4_a.jpg", "size": 98059, "type": "image/jpeg" }, { "file": "goods/3_4_b.jpg", "size": 85993, "type": "image/jpeg" }, { "file": "goods/3_4_c.jpg", "size": 115285, "type": "image/jpeg" }, { "file": "goods/3_4_d.jpg", "size": 181296, "type": "image/jpeg" }, { "file": "goods/3_4_e.jpg", "size": 119456, "type": "image/jpeg" }, { "file": "goods/3_5_a.jpg", "size": 64016, "type": "image/jpeg" }, { "file": "goods/3_5_b.jpg", "size": 65190, "type": "image/jpeg" }, { "file": "goods/3_5_c.jpg", "size": 64990, "type": "image/jpeg" }, { "file": "goods/3_6_a.jpg", "size": 76499, "type": "image/jpeg" }, { "file": "goods/3_6_b.jpg", "size": 71824, "type": "image/jpeg" }, { "file": "goods/3_6_c.jpg", "size": 63451, "type": "image/jpeg" }, { "file": "goods/3_6_d.jpg", "size": 78155, "type": "image/jpeg" }, { "file": "goods/3_6_e.jpg", "size": 64504, "type": "image/jpeg" }, { "file": "goods/3_7_a.jpg", "size": 87362, "type": "image/jpeg" }, { "file": "goods/3_7_b.jpg", "size": 89739, "type": "image/jpeg" }, { "file": "goods/3_7_c.jpg", "size": 92921, "type": "image/jpeg" }, { "file": "goods/3_7_d.jpg", "size": 88734, "type": "image/jpeg" }, { "file": "goods/3_7_e.jpg", "size": 87362, "type": "image/jpeg" }, { "file": "goods/3_8_a.jpg", "size": 39378, "type": "image/jpeg" }, { "file": "goods/3_8_b.jpg", "size": 40310, "type": "image/jpeg" }, { "file": "goods/3_8_c.jpg", "size": 53640, "type": "image/jpeg" }, { "file": "goods/3_8_d.jpg", "size": 60196, "type": "image/jpeg" }, { "file": "goods/3_8_e.jpg", "size": 39722, "type": "image/jpeg" }, { "file": "goods/3_9_a.jpg", "size": 112040, "type": "image/jpeg" }, { "file": "goods/3_9_b.jpg", "size": 117599, "type": "image/jpeg" }, { "file": "goods/4_1_a.jpg", "size": 33231, "type": "image/jpeg" }, { "file": "goods/4_1_b.jpg", "size": 101242, "type": "image/jpeg" }, { "file": "goods/4_1_c.jpg", "size": 46628, "type": "image/jpeg" }, { "file": "goods/4_1_d.jpg", "size": 98921, "type": "image/jpeg" }, { "file": "goods/4_1_e.jpg", "size": 41820, "type": "image/jpeg" }, { "file": "goods/4_2_a.jpg", "size": 64079, "type": "image/jpeg" }, { "file": "goods/4_2_b.jpg", "size": 113893, "type": "image/jpeg" }, { "file": "goods/4_2_c.jpg", "size": 63818, "type": "image/jpeg" }, { "file": "goods/4_2_d.jpg", "size": 72065, "type": "image/jpeg" }, { "file": "goods/4_2_e.jpg", "size": 152112, "type": "image/jpeg" }, { "file": "goods/4_3_a.jpg", "size": 48658, "type": "image/jpeg" }, { "file": "goods/4_3_b.jpg", "size": 61733, "type": "image/jpeg" }, { "file": "goods/4_3_c.jpg", "size": 49607, "type": "image/jpeg" }, { "file": "goods/4_3_d.jpg", "size": 76634, "type": "image/jpeg" }, { "file": "goods/4_3_e.jpg", "size": 118565, "type": "image/jpeg" }, { "file": "goods/4_4_a.jpg", "size": 102512, "type": "image/jpeg" }, { "file": "goods/4_4_b.jpg", "size": 94869, "type": "image/jpeg" }, { "file": "goods/4_4_c.jpg", "size": 89631, "type": "image/jpeg" }, { "file": "goods/4_4_d.jpg", "size": 100659, "type": "image/jpeg" }, { "file": "goods/4_4_e.jpg", "size": 102133, "type": "image/jpeg" }, { "file": "logo.svg", "size": 3184, "type": "image/svg+xml" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/completeOrder\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/completeOrder.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/category\/([^/]+?)\/?$/,
      params: (m) => ({ id: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/category/[id].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/favorite\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/favorite.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/newOrder\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/newOrder.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/profile\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/profile.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/search\/([^/]+?)\/?$/,
      params: (m) => ({ query: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/search/[query].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/cart\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/cart.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/api\/townsData\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return townsData;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/jsondata\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return jsondata;
      })
    },
    {
      type: "page",
      pattern: /^\/([^/]+?)\/goodItems\/([^/]+?)\/?$/,
      params: (m) => ({ category: d(m[1]), id: d(m[2]) }),
      a: ["src/routes/__layout.svelte", "src/routes/[category]/goodItems/[id].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/completeOrder.svelte": () => Promise.resolve().then(function() {
    return completeOrder;
  }),
  "src/routes/category/[id].svelte": () => Promise.resolve().then(function() {
    return _id_$1;
  }),
  "src/routes/favorite.svelte": () => Promise.resolve().then(function() {
    return favorite;
  }),
  "src/routes/newOrder.svelte": () => Promise.resolve().then(function() {
    return newOrder;
  }),
  "src/routes/profile.svelte": () => Promise.resolve().then(function() {
    return profile;
  }),
  "src/routes/search/[query].svelte": () => Promise.resolve().then(function() {
    return _query_;
  }),
  "src/routes/cart.svelte": () => Promise.resolve().then(function() {
    return cart;
  }),
  "src/routes/[category]/goodItems/[id].svelte": () => Promise.resolve().then(function() {
    return _id_;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-7e210b3f.js", "css": ["assets/pages/__layout.svelte-d461bed4.css", "assets/vendor-56347699.css", "assets/Loader-280f5a21.css", "assets/Button-4b3d79bf.css", "assets/CategoryList-d6a2ee72.css"], "js": ["pages/__layout.svelte-7e210b3f.js", "chunks/vendor-d903b9b8.js", "chunks/favoriteStore-f29eddaf.js", "chunks/cart-6afeb1e4.js", "chunks/data-service-52f79679.js", "chunks/Loader-5f6d01fb.js", "chunks/navigation-51f4a605.js", "chunks/singletons-12a22614.js", "chunks/present-service-7073be03.js", "chunks/Button-5ef06dbe.js", "chunks/CategoryList-bddb7188.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-1c5918a0.js", "css": ["assets/vendor-56347699.css"], "js": ["error.svelte-1c5918a0.js", "chunks/vendor-d903b9b8.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-9ded218d.js", "css": ["assets/pages/index.svelte-f1fdda30.css", "assets/vendor-56347699.css", "assets/CategoryList-d6a2ee72.css", "assets/Loader-280f5a21.css", "assets/GoodItemView-d57cfbef.css", "assets/Button-4b3d79bf.css"], "js": ["pages/index.svelte-9ded218d.js", "chunks/vendor-d903b9b8.js", "chunks/CategoryList-bddb7188.js", "chunks/data-service-52f79679.js", "chunks/Loader-5f6d01fb.js", "chunks/GoodItemView-e5f4bdde.js", "chunks/Button-5ef06dbe.js", "chunks/favoriteStore-f29eddaf.js", "chunks/cart-6afeb1e4.js"], "styles": [] }, "src/routes/completeOrder.svelte": { "entry": "pages/completeOrder.svelte-1fa23e76.js", "css": ["assets/pages/completeOrder.svelte-5e220aa6.css", "assets/vendor-56347699.css"], "js": ["pages/completeOrder.svelte-1fa23e76.js", "chunks/vendor-d903b9b8.js", "chunks/cart-6afeb1e4.js"], "styles": [] }, "src/routes/category/[id].svelte": { "entry": "pages/category/[id].svelte-387cc852.js", "css": ["assets/pages/category/[id].svelte-63504eeb.css", "assets/vendor-56347699.css", "assets/GoodItemView-d57cfbef.css", "assets/Button-4b3d79bf.css", "assets/Breadcrumbs-9fdb999a.css", "assets/Loader-280f5a21.css"], "js": ["pages/category/[id].svelte-387cc852.js", "chunks/vendor-d903b9b8.js", "chunks/data-service-52f79679.js", "chunks/GoodItemView-e5f4bdde.js", "chunks/Button-5ef06dbe.js", "chunks/favoriteStore-f29eddaf.js", "chunks/cart-6afeb1e4.js", "chunks/Breadcrumbs-0d51cc51.js", "chunks/Loader-5f6d01fb.js"], "styles": [] }, "src/routes/favorite.svelte": { "entry": "pages/favorite.svelte-1f6b33b6.js", "css": ["assets/pages/favorite.svelte-18f16338.css", "assets/vendor-56347699.css", "assets/GoodItemView-d57cfbef.css", "assets/Button-4b3d79bf.css"], "js": ["pages/favorite.svelte-1f6b33b6.js", "chunks/vendor-d903b9b8.js", "chunks/favoriteStore-f29eddaf.js", "chunks/GoodItemView-e5f4bdde.js", "chunks/Button-5ef06dbe.js", "chunks/cart-6afeb1e4.js"], "styles": [] }, "src/routes/newOrder.svelte": { "entry": "pages/newOrder.svelte-65e48030.js", "css": ["assets/pages/newOrder.svelte-aa9ac612.css", "assets/vendor-56347699.css"], "js": ["pages/newOrder.svelte-65e48030.js", "chunks/vendor-d903b9b8.js", "chunks/cart-6afeb1e4.js", "chunks/present-service-7073be03.js", "chunks/navigation-51f4a605.js", "chunks/singletons-12a22614.js"], "styles": [] }, "src/routes/profile.svelte": { "entry": "pages/profile.svelte-1f61b230.js", "css": ["assets/vendor-56347699.css"], "js": ["pages/profile.svelte-1f61b230.js", "chunks/vendor-d903b9b8.js"], "styles": [] }, "src/routes/search/[query].svelte": { "entry": "pages/search/[query].svelte-5d84a433.js", "css": ["assets/pages/search/[query].svelte-6c9f4b99.css", "assets/vendor-56347699.css", "assets/GoodItemView-d57cfbef.css", "assets/Button-4b3d79bf.css"], "js": ["pages/search/[query].svelte-5d84a433.js", "chunks/vendor-d903b9b8.js", "chunks/data-service-52f79679.js", "chunks/GoodItemView-e5f4bdde.js", "chunks/Button-5ef06dbe.js", "chunks/favoriteStore-f29eddaf.js", "chunks/cart-6afeb1e4.js"], "styles": [] }, "src/routes/cart.svelte": { "entry": "pages/cart.svelte-03bd6413.js", "css": ["assets/pages/cart.svelte-a49051cf.css", "assets/vendor-56347699.css"], "js": ["pages/cart.svelte-03bd6413.js", "chunks/vendor-d903b9b8.js", "chunks/present-service-7073be03.js", "chunks/cart-6afeb1e4.js"], "styles": [] }, "src/routes/[category]/goodItems/[id].svelte": { "entry": "pages/[category]/goodItems/[id].svelte-2c5d8768.js", "css": ["assets/pages/[category]/goodItems/[id].svelte-76098d64.css", "assets/vendor-56347699.css", "assets/Loader-280f5a21.css", "assets/Breadcrumbs-9fdb999a.css"], "js": ["pages/[category]/goodItems/[id].svelte-2c5d8768.js", "chunks/vendor-d903b9b8.js", "chunks/Loader-5f6d01fb.js", "chunks/data-service-52f79679.js", "chunks/Breadcrumbs-0d51cc51.js", "chunks/cart-6afeb1e4.js", "chunks/favoriteStore-f29eddaf.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
async function get$1(searchVal) {
  const resolve2 = await fetch(`https://api.hh.ru/areas/113`);
  const result = await resolve2.json();
  let data = result.areas.map((areas) => {
    return areas.areas.map((town) => town.name);
  });
  let searchString = searchVal.toLowerCase();
  data = data.flat(Infinity).map((el) => {
    const regexp = /\(.+\)/;
    return el.replace(regexp, "");
  });
  data = data.filter((el) => el.toLowerCase().includes(searchString) && searchString !== "" && searchString.length > 1);
  return {
    body: [
      data
    ]
  };
}
var townsData = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$1
});
async function get() {
  return {
    body: [
      {
        "id": 0,
        "catName": "\u0421\u043C\u0430\u0440\u0442\u0444\u043E\u043D\u044B \u0438 \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u044B",
        "catImg": "phone_iphone",
        "category": [
          {
            "id": 1,
            "brand": "Samsung",
            "name": "\u0421\u043C\u0430\u0440\u0442\u0444\u043E\u043D Samsung Galaxy A12 32GB Black (SM-A125F)",
            "title": "\u0411\u041E\u041B\u042C\u0428\u041E\u0419 \u0418 \u042F\u0420\u041A\u0418\u0419 \u042D\u041A\u0420\u0410\u041D",
            "body": "\u0411\u043E\u043B\u044C\u0448\u043E\u0439 6,5-\u0434\u044E\u0439\u043C\u043E\u0432\u044B\u0439 HD+ \u044D\u043A\u0440\u0430\u043D \u0441 V-\u043E\u0431\u0440\u0430\u0437\u043D\u044B\u043C \u0432\u044B\u0440\u0435\u0437\u043E\u043C \u0434\u043B\u044F \u043A\u0430\u043C\u0435\u0440\u044B \u0441\u043E\u0437\u0434\u0430\u043D \u0434\u043B\u044F \u043F\u043E\u043B\u043D\u043E\u0433\u043E \u043F\u043E\u0433\u0440\u0443\u0436\u0435\u043D\u0438\u044F \u0432 \u043A\u043E\u043D\u0442\u0435\u043D\u0442. \u0411\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u044F \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0435 \u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0438 HD+ \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0430 \u043D\u0430 Samsung Galaxy A12 \u044F\u0440\u043A\u0430\u044F \u0438 \u043D\u0430\u0441\u044B\u0449\u0435\u043D\u043D\u0430\u044F.",
            "price": "13 990",
            "imgSet": [
              "/goods/1_1_a.webp",
              "/goods/1_1_b.webp",
              "/goods/1_1_c.webp",
              "/goods/1_1_d.webp"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0447\u0435\u0440\u043D\u044B\u0439", "\u0431\u0435\u043B\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["6.5"] },
              { "attrId": 3, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["32"] },
              { "attrId": 4, "attrName": "\u041E\u0417\u0423", "attrVal": ["4"] },
              { "attrId": 5, "attrName": "\u0430\u043A\u043A\u0443\u043C\u0443\u043B\u044F\u0442\u043E\u0440", "attrVal": ["3500"] },
              { "attrId": 6, "attrName": "SIM", "attrVal": ["2"] },
              { "attrId": 7, "attrName": "OS", "attrVal": ["Android 10"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Samsung"] }
            ]
          },
          {
            "id": 2,
            "brand": "Xiaomi",
            "name": "\u0421\u043C\u0430\u0440\u0442\u0444\u043E\u043D Xiaomi Redmi 9A",
            "title": "\u0422\u041E\u041F \u0417\u0410 \u0421\u0412\u041E\u0418 \u0414\u0415\u041D\u042C\u0413\u0418",
            "body": "",
            "price": "72 990",
            "imgSet": [
              "/goods/1_2_a.jpg",
              "/goods/1_2_b.jpg",
              "/goods/1_2_c.jpg",
              "/goods/1_2_d.jpg",
              "/goods/1_2_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0440\u043E\u0437\u043E\u0432\u044B\u0439", "\u0431\u0435\u043B\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["6.2"] },
              { "attrId": 3, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["128"] },
              { "attrId": 4, "attrName": "\u041E\u0417\u0423", "attrVal": ["8"] },
              { "attrId": 5, "attrName": "\u0430\u043A\u043A\u0443\u043C\u0443\u043B\u044F\u0442\u043E\u0440", "attrVal": ["4500"] },
              { "attrId": 6, "attrName": "SIM", "attrVal": ["2"] },
              { "attrId": 7, "attrName": "OS", "attrVal": ["Android 10"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Xiaomi"] }
            ]
          },
          {
            "id": 3,
            "brand": "Samsung",
            "name": "\u0421\u043C\u0430\u0440\u0442\u0444\u043E\u043D Samsung Galaxy Z Flip 3 128GB Green (SM-F711B)",
            "title": "\u0421\u0432\u0435\u0436\u0438\u0439 \u0432\u0437\u0433\u043B\u044F\u0434 \u043D\u0430 \u0440\u0430\u0441\u043A\u043B\u0430\u0434\u0443\u0448\u043A\u0443",
            "body": "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0434\u043B\u044F \u0441\u0435\u0431\u044F \u044D\u043A\u0441\u043A\u043B\u044E\u0437\u0438\u0432\u043D\u044B\u0435 \u0446\u0432\u0435\u0442\u0430 Galaxy Z Flip3 5G \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0430 Samsung.com.\u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u043E!",
            "price": "89 990",
            "imgSet": [
              "/goods/1_3_a.jpg",
              "/goods/1_3_b.jpg",
              "/goods/1_3_c.jpg",
              "/goods/1_3_d.jpg",
              "/goods/1_3_e.jpg",
              "/goods/1_3_f.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0437\u043E\u043B\u043E\u0442\u043E\u0439", "\u0431\u0435\u043B\u044B\u0439", "\u0441\u0435\u0440\u0435\u0431\u0440\u043E"] },
              { "attrId": 2, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["6.7"] },
              { "attrId": 3, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["128"] },
              { "attrId": 4, "attrName": "\u041E\u0417\u0423", "attrVal": ["8"] },
              { "attrId": 5, "attrName": "\u0430\u043A\u043A\u0443\u043C\u0443\u043B\u044F\u0442\u043E\u0440", "attrVal": ["4500"] },
              { "attrId": 6, "attrName": "SIM", "attrVal": ["1"] },
              { "attrId": 7, "attrName": "OS", "attrVal": ["Android 11"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Samsung"] }
            ]
          },
          {
            "id": 4,
            "brand": "Xiaomi",
            "name": "\u0421\u043C\u0430\u0440\u0442\u0444\u043E\u043D Xiaomi Mi 11 256GB Midnight Gray",
            "title": "\u0421\u043D\u0438\u043C\u0430\u0439\u0442\u0435 \u043A\u0430\u043A \u0440\u0435\u0436\u0438\u0441\u0441\u0435\u0440",
            "body": "Mi 11 \u0441\u043E\u0437\u0434\u0430\u043D \u0434\u043B\u044F \u043B\u044E\u0431\u0438\u0442\u0435\u043B\u0435\u0439 \u043A\u0438\u043D\u043E. Xiaomi \u043E\u0431\u044A\u0435\u0434\u0438\u043D\u0438\u043B\u0430 \u0432\u044B\u0434\u0430\u044E\u0449\u0438\u0435\u0441\u044F \u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0438 \u0441 \u043F\u0435\u0440\u0435\u0434\u043E\u0432\u044B\u043C \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u043D\u044B\u043C \u043E\u0431\u0435\u0441\u043F\u0435\u0447\u0435\u043D\u0438\u0435\u043C, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0438\u0442\u044C \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u043E \u043A\u0440\u0435\u0430\u0442\u0438\u0432\u043D\u044B\u0445 \u0438 \u043F\u0440\u043E\u0441\u0442\u044B\u0445 \u0432 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0438 \u0444\u0443\u043D\u043A\u0446\u0438\u0439 \u0432\u0438\u0434\u0435\u043E\u0441\u044A\u0451\u043C\u043A\u0438.",
            "price": "75 990",
            "imgSet": [
              "/goods/1_4_a.jpg",
              "/goods/1_4_b.jpg",
              "/goods/1_4_c.jpg",
              "/goods/1_4_d.jpg",
              "/goods/1_4_e.jpg",
              "/goods/1_4_f.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0437\u043E\u043B\u043E\u0442\u043E\u0439", "\u0441\u0435\u0440\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["6.81"] },
              { "attrId": 3, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["256"] },
              { "attrId": 4, "attrName": "\u041E\u0417\u0423", "attrVal": ["8"] },
              { "attrId": 5, "attrName": "\u0430\u043A\u043A\u0443\u043C\u0443\u043B\u044F\u0442\u043E\u0440", "attrVal": ["4500"] },
              { "attrId": 6, "attrName": "SIM", "attrVal": ["1"] },
              { "attrId": 7, "attrName": "OS", "attrVal": ["Android 11"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Xiaomi"] }
            ]
          },
          {
            "id": 5,
            "brand": "Huawei",
            "name": "\u0421\u043C\u0430\u0440\u0442\u0444\u043E\u043D Huawei P Smart 2021 4+128GB Crush Green (PPA-LX1)",
            "title": "\u041D\u0430\u0440\u043E\u0434\u043D\u0430\u044F \u0446\u0435\u043D\u0430",
            "body": "Huawei \u0434\u0435\u043B\u0430\u043B\u0430 P Smart 2021, \u044F\u0432\u043D\u043E \u043F\u0440\u0438\u0441\u043B\u0443\u0448\u0438\u0432\u0430\u044F\u0441\u044C \u043A \u043D\u0430\u0440\u043E\u0434\u043D\u044B\u043C \u0447\u0430\u044F\u043D\u0438\u044F\u043C, \u0441\u043B\u043E\u0432\u043D\u043E \u0431\u044B \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0441\u043E\u0446\u0438\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u043E\u043F\u0440\u043E\u0441\u0430.",
            "price": "15 990",
            "imgSet": [
              "/goods/1_5_a.jpg",
              "/goods/1_5_b.jpg",
              "/goods/1_5_c.jpg",
              "/goods/1_5_d.jpg",
              "/goods/1_5_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0437\u043E\u043B\u043E\u0442\u043E\u0439", "\u043A\u0440\u0430\u0441\u043D\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["6.67"] },
              { "attrId": 3, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["128"] },
              { "attrId": 4, "attrName": "\u041E\u0417\u0423", "attrVal": ["4"] },
              { "attrId": 5, "attrName": "\u0430\u043A\u043A\u0443\u043C\u0443\u043B\u044F\u0442\u043E\u0440", "attrVal": ["4500"] },
              { "attrId": 6, "attrName": "SIM", "attrVal": ["1"] },
              { "attrId": 7, "attrName": "OS", "attrVal": ["Android 10"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Huawei"] }
            ]
          },
          {
            "id": 6,
            "brand": "Huawei",
            "name": "\u0421\u043C\u0430\u0440\u0442\u0444\u043E\u043D Huawei P40 Pro Silver Frost (ELS-NX9)",
            "title": "\u041D\u0415\u0412\u0415\u0420\u041E\u042F\u0422\u041D\u042B\u0415 \u0412\u041E\u0417\u041C\u041E\u0416\u041D\u041E\u0421\u0422\u0418 \u0414\u041B\u042F \u0421\u042A\u0401\u041C\u041A\u0418",
            "body": "Huawei P40 Pro \u2013 \u0443\u043B\u0443\u0447\u0448\u0435\u043D\u043D\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F \u0444\u043B\u0430\u0433\u043C\u0430\u043D\u0441\u043A\u043E\u0433\u043E \u0441\u043C\u0430\u0440\u0442\u0444\u043E\u043D\u0430 \u043E\u0442 \u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F.  \u0415\u0433\u043E 6,58-\u0434\u044E\u0439\u043C\u043E\u0432\u044B\u0439 \u044D\u043A\u0440\u0430\u043D, \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u044B\u0439 \u043F\u043E \u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0438 OLED, \u0437\u0430\u0433\u043D\u0443\u0442 \u043D\u0430 \u0432\u0441\u0435 \u0433\u0440\u0430\u043D\u0438 \u0438 \u0442\u043E\u0440\u0446\u044B \u043A\u043E\u0440\u043F\u0443\u0441\u0430. \u0417\u0430 \u0441\u0447\u0451\u0442 \u044D\u0442\u043E\u0433\u043E \u0441\u043E\u0437\u0434\u0430\u0451\u0442\u0441\u044F \u043E\u0449\u0443\u0449\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u043D\u043E\u0439 \u0431\u0435\u0437\u0433\u0440\u0430\u043D\u0438\u0447\u043D\u043E\u0441\u0442\u0438 \u0434\u0438\u0441\u043F\u043B\u0435\u044F. \u0420\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435 2640 \u0445 1200 \u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439 \u0438 \u0447\u0430\u0441\u0442\u043E\u0442\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F 90 \u0413\u0446 \u043E\u0431\u0435\u0441\u043F\u0435\u0447\u0438\u0432\u0430\u044E\u0442 \u0431\u0435\u0437\u0443\u043F\u0440\u0435\u0447\u043D\u0443\u044E \u0440\u0435\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u043E\u0441\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F.",
            "price": "64 999",
            "imgSet": [
              "/goods/1_6_a.jpg",
              "/goods/1_6_b.jpg",
              "/goods/1_6_c.jpg",
              "/goods/1_6_d.jpg",
              "/goods/1_6_e.jpg",
              "/goods/1_6_f.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0441\u0435\u0440\u0435\u0431\u0440\u043E", "\u0441\u0438\u043D\u0438\u0439", "\u0431\u0435\u043B\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["6.58"] },
              { "attrId": 3, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["256"] },
              { "attrId": 4, "attrName": "\u041E\u0417\u0423", "attrVal": ["8"] },
              { "attrId": 5, "attrName": "\u0430\u043A\u043A\u0443\u043C\u0443\u043B\u044F\u0442\u043E\u0440", "attrVal": ["6200"] },
              { "attrId": 6, "attrName": "SIM", "attrVal": ["2"] },
              { "attrId": 7, "attrName": "OS", "attrVal": ["Android 10"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Huawei"] }
            ]
          },
          {
            "id": 7,
            "brand": "Apple",
            "name": "\u0421\u043C\u0430\u0440\u0442\u0444\u043E\u043D Apple iPhone 11 64GB Black (MHDA3RU/A) Apple",
            "title": "\u041F\u043E\u0442\u0440\u044F\u0441\u0430\u044E\u0449\u0435\u0439 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C\u044E \u043E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 \u0441\u043C\u0430\u0440\u0442\u0444\u043E\u043D APPLE iPhone 11 ",
            "body": "\u041A\u043E\u0440\u043F\u0443\u0441 \u043C\u043E\u0434\u0435\u043B\u0438 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D \u0438\u0437 \u043C\u0435\u0442\u0430\u043B\u043B\u0430, \u0438\u043C\u0435\u044E\u0449\u0435\u0433\u043E \u0445\u043E\u0440\u043E\u0448\u0443\u044E \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E\u0441\u0442\u044C \u043A \u0432\u043D\u0435\u0448\u043D\u0438\u043C \u043F\u043E\u0432\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u044F\u043C, \u0430 \u0442\u0430\u043A\u0436\u0435 \u0432\u043B\u0430\u0433\u0435 \u0438 \u043F\u044B\u043B\u0438. \u0421\u0442\u0438\u043B\u044C\u043D\u044B\u0439 \u0441\u043C\u0430\u0440\u0442\u0444\u043E\u043D APPLE iPhone 11 128\u0413\u0431, MHDH3RU/A \u043E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 \u044D\u043A\u0440\u0430\u043D\u043E\u043C IPS \u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C\u044E 6,1 \u0434\u044E\u0439\u043C\u0430 \u0434\u043B\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u044F\u0440\u043A\u043E\u0439, \u043D\u0430\u0441\u044B\u0449\u0435\u043D\u043D\u043E\u0439 \u0446\u0432\u0435\u0442\u043E\u043C \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0438 \u0432 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0438 1792x828 \u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439. \u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u043A\u0430\u043C\u0435\u0440 12+12 \u041C\u043F, \u0441\u043E\u0447\u0435\u0442\u0430\u044E\u0449\u0430\u044F \u0432 \u0441\u0435\u0431\u0435 \u0448\u0438\u0440\u043E\u043A\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u0443\u044E \u0438 \u0441\u0432\u0435\u0440\u0445\u0448\u0438\u0440\u043E\u043A\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u0443\u044E \u043A\u0430\u043C\u0435\u0440\u044B, \u043E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u0431\u043E\u043B\u044C\u0448\u0438\u043C \u0441\u043F\u0435\u043A\u0442\u0440\u043E\u043C \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0435\u0439, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044F \u0441\u043E\u0437\u0434\u0430\u0432\u0430\u0442\u044C \u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0438 \u0432\u044B\u0441\u043E\u043A\u043E\u0433\u043E \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0430. \u0414\u043B\u044F \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0439 \u0430\u0432\u0442\u043E\u043D\u043E\u043C\u043D\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u044B \u043C\u043E\u0434\u0435\u043B\u044C \u0438\u043C\u0435\u0435\u0442 \u0451\u043C\u043A\u0443\u044E \u0430\u043A\u043A\u0443\u043C\u0443\u043B\u044F\u0442\u043E\u0440\u043D\u0443\u044E \u0431\u0430\u0442\u0430\u0440\u0435\u044E.",
            "price": "64 999",
            "imgSet": [
              "/goods/1_7_a.jpg",
              "/goods/1_7_b.jpg",
              "/goods/1_7_c.jpg",
              "/goods/1_7_d.jpg",
              "/goods/1_7_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0447\u0435\u0440\u043D\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["6.1"] },
              { "attrId": 3, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["64"] },
              { "attrId": 4, "attrName": "\u041E\u0417\u0423", "attrVal": ["8"] },
              { "attrId": 5, "attrName": "\u0430\u043A\u043A\u0443\u043C\u0443\u043B\u044F\u0442\u043E\u0440", "attrVal": ["3500"] },
              { "attrId": 6, "attrName": "SIM", "attrVal": ["2"] },
              { "attrId": 7, "attrName": "OS", "attrVal": ["IOS"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Apple"] }
            ]
          },
          {
            "id": 8,
            "brand": "Apple",
            "name": "\u0421\u043C\u0430\u0440\u0442\u0444\u043E\u043D Apple iPhone 12 Pro Max 128GB Pacific Blue (MGDA3RU/A)",
            "title": "\u0412\u0441\u0442\u0440\u0435\u0447\u0430\u0439\u0442\u0435 iPhone 12 Pro Max",
            "body": "\u042D\u0442\u043E iPhone 12 Pro Max. A14 Bionic, \u0441\u0430\u043C\u044B\u0439 \u0431\u044B\u0441\u0442\u0440\u044B\u0439 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440 iPhone. \u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u043A\u0430\u043C\u0435\u0440 Pro, \u043A\u043E\u0442\u043E\u0440\u0430\u044F \u043E\u0431\u0435\u0441\u043F\u0435\u0447\u0438\u0432\u0430\u0435\u0442 \u043F\u043E\u0442\u0440\u044F\u0441\u0430\u044E\u0449\u0435\u0435 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0441\u043D\u0438\u043C\u043A\u043E\u0432 \u043F\u0440\u0438 \u0441\u043B\u0430\u0431\u043E\u043C \u043E\u0441\u0432\u0435\u0449\u0435\u043D\u0438\u0438. \u0418 \u0443\u0432\u0435\u043B\u0438\u0447\u0435\u043D\u043D\u044B\u0439 \u0434\u0438\u0441\u043F\u043B\u0435\u0439 Super Retina XDR. \u042D\u0442\u043E \u043D\u043E\u0432\u0430\u044F \u044D\u0440\u0430 \u0434\u043B\u044F iPhone.",
            "price": "103 390",
            "imgSet": [
              "/goods/1_8_a.jpg",
              "/goods/1_8_b.jpg",
              "/goods/1_8_c.jpg",
              "/goods/1_8_d.jpg",
              "/goods/1_8_e.jpg",
              "/goods/1_8_f.jpg",
              "/goods/1_8_g.jpg",
              "/goods/1_8_h.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0433\u0440\u0430\u0444\u0438\u0442\u043E\u0432\u044B\u0439", "\u0437\u043E\u043B\u043E\u0442\u043E\u0439", "\u0441\u0435\u0440\u0435\u0431\u0440\u043E", "\u0442\u0438\u0445\u043E\u043E\u043A\u0435\u0430\u043D\u0441\u043A\u0438\u0439 \u0441\u0438\u043D\u0438\u0439"] },
              { "attrId": 2, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["6.7"] },
              { "attrId": 3, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["128"] },
              { "attrId": 4, "attrName": "\u041E\u0417\u0423", "attrVal": ["16"] },
              { "attrId": 5, "attrName": "\u0430\u043A\u043A\u0443\u043C\u0443\u043B\u044F\u0442\u043E\u0440", "attrVal": ["4200"] },
              { "attrId": 6, "attrName": "SIM", "attrVal": ["1"] },
              { "attrId": 7, "attrName": "OS", "attrVal": ["IOS"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Apple"] }
            ]
          },
          {
            "id": 9,
            "brand": "Apple",
            "name": "\u0421\u043C\u0430\u0440\u0442\u0444\u043E\u043D Apple iPhone 11 64GB (PRODUCT)RED (MHDD3RU/A)",
            "title": "\u0412\u043E-\u043F\u0435\u0440\u0432\u044B\u0445, \u044D\u0442\u043E \u0431\u044B\u0441\u0442\u0440\u043E.",
            "body": "A14 Bionic, \u0441\u0430\u043C\u044B\u0439 \u0431\u044B\u0441\u0442\u0440\u044B\u0439 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440 iPhone. \u0414\u0438\u0441\u043F\u043B\u0435\u0439 OLED \u043E\u0442 \u043A\u0440\u0430\u044F \u0434\u043E \u043A\u0440\u0430\u044F. \u041F\u0435\u0440\u0435\u0434\u043D\u044F\u044F \u043F\u0430\u043D\u0435\u043B\u044C Ceramic Shield, \u043A\u043E\u0442\u043E\u0440\u0430\u044F \u0432 \u0447\u0435\u0442\u044B\u0440\u0435 \u0440\u0430\u0437\u0430 \u0441\u043D\u0438\u0436\u0430\u0435\u0442 \u0440\u0438\u0441\u043A \u043F\u043E\u0432\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0439 \u0434\u0438\u0441\u043F\u043B\u0435\u044F \u043F\u0440\u0438 \u043F\u0430\u0434\u0435\u043D\u0438\u0438. \u0418 \u041D\u043E\u0447\u043D\u043E\u0439 \u0440\u0435\u0436\u0438\u043C \u043D\u0430 \u0432\u0441\u0435\u0445 \u043A\u0430\u043C\u0435\u0440\u0430\u0445. \u0412\u0441\u0451 \u044D\u0442\u043E \u0435\u0441\u0442\u044C \u0432 iPhone 12. \u0412 \u0434\u0432\u0443\u0445 \u0440\u0430\u0437\u043C\u0435\u0440\u0430\u0445.",
            "price": "69 990",
            "imgSet": [
              "/goods/1_9_a.jpg",
              "/goods/1_9_b.jpg",
              "/goods/1_9_c.jpg",
              "/goods/1_9_d.jpg",
              "/goods/1_9_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0433\u0440\u0430\u0444\u0438\u0442\u043E\u0432\u044B\u0439", "\u0437\u043E\u043B\u043E\u0442\u043E\u0439", "\u043A\u0440\u0430\u0441\u043D\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["6.1"] },
              { "attrId": 3, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["128"] },
              { "attrId": 4, "attrName": "\u041E\u0417\u0423", "attrVal": ["16"] },
              { "attrId": 5, "attrName": "\u0430\u043A\u043A\u0443\u043C\u0443\u043B\u044F\u0442\u043E\u0440", "attrVal": ["4200"] },
              { "attrId": 6, "attrName": "SIM", "attrVal": ["1"] },
              { "attrId": 7, "attrName": "OS", "attrVal": ["IOS"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Apple"] }
            ]
          },
          {
            "id": 10,
            "brand": "Asus",
            "name": "\u0421\u043C\u0430\u0440\u0442\u0444\u043E\u043D ASUS Zenfone 8 Flip ZS672KS 8+256GB Black (2A022RU)",
            "title": "Asus Zenfone 8 Flip \u2013 \u0441\u043C\u0430\u0440\u0442\u0444\u043E\u043D \u0444\u043B\u0430\u0433\u043C\u0430\u043D\u0441\u043A\u043E\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F",
            "body": "\u041E\u0434\u043D\u043E \u0438\u0437 \u043D\u0438\u0445 \u2013 \u043F\u043E\u0432\u043E\u0440\u043E\u0442\u043D\u044B\u0439 \u0431\u043B\u043E\u043A \u043A\u0430\u043C\u0435\u0440, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0449\u0438\u0439 \u0434\u0435\u043B\u0430\u0442\u044C \u0441\u043D\u0438\u043C\u043A\u0438 \u043E\u0442\u043B\u0438\u0447\u043D\u043E\u0433\u043E \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0430 \u0432 \u043E\u0431\u044B\u0447\u043D\u043E\u043C \u0438 \u0444\u0440\u043E\u043D\u0442\u0430\u043B\u044C\u043D\u043E\u043C \u0440\u0435\u0436\u0438\u043C\u0430\u0445. \u0412 \u0432\u0430\u0448\u0435\u043C \u0440\u0430\u0441\u043F\u043E\u0440\u044F\u0436\u0435\u043D\u0438\u0438 \u2013 \u0442\u0440\u0438 \u043E\u0431\u044A\u0435\u043A\u0442\u0438\u0432\u0430: 64, 12 \u0438 8 \u041C\u043F. \u0421 \u043D\u0438\u043C\u0438 \u0432\u044B \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u043A\u0430\u043A \u043E\u0431\u044B\u0447\u043D\u044B\u0435 \u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0438, \u044F\u0440\u043A\u0438\u0435 \u0438 \u0434\u0435\u0442\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435, \u0442\u0430\u043A \u0438 \u044D\u0444\u0444\u0435\u043A\u0442\u043D\u044B\u0435 \u043F\u0430\u043D\u043E\u0440\u0430\u043C\u044B, \u043F\u043E\u0440\u0442\u0440\u0435\u0442\u044B, \u0441\u0435\u043B\u0444\u0438 \u0438 \u0432\u0438\u0434\u0435\u043E\u0440\u043E\u043B\u0438\u043A\u0438.",
            "price": "69 990",
            "imgSet": [
              "/goods/1_10_a.jpg",
              "/goods/1_10_b.jpg",
              "/goods/1_10_c.jpg",
              "/goods/1_10_d.jpg",
              "/goods/1_10_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0447\u0435\u0440\u043D\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["6.67"] },
              { "attrId": 3, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["256"] },
              { "attrId": 4, "attrName": "\u041E\u0417\u0423", "attrVal": ["12"] },
              { "attrId": 5, "attrName": "\u0430\u043A\u043A\u0443\u043C\u0443\u043B\u044F\u0442\u043E\u0440", "attrVal": ["4300"] },
              { "attrId": 6, "attrName": "SIM", "attrVal": ["1"] },
              { "attrId": 7, "attrName": "OS", "attrVal": ["Android 11"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Asus"] }
            ]
          }
        ]
      },
      {
        "id": 1,
        "catName": "\u041D\u043E\u0443\u0442\u0431\u0443\u043A\u0438 \u0438 \u043D\u0430\u0441\u0442\u043E\u043B\u044C\u043D\u044B\u0435 \u041F\u041A",
        "catImg": "computer",
        "category": [
          {
            "id": 1,
            "brand": "Huawei",
            "name": "\u041D\u043E\u0443\u0442\u0431\u0443\u043A Huawei MateBook D 15 BoB-WAI9 8+256GB Space Grey",
            "title": "\u0423\u0434\u043E\u0431\u043D\u044B\u0439, \u0431\u044B\u0441\u0442\u0440\u044B\u0439, \u043B\u0435\u0433\u043A\u0438\u0439. \u0421\u0435\u0440\u044B\u0439 \u0446\u0432\u0435\u0442 \u0441\u043C\u043E\u0442\u0440\u0438\u0442\u0441\u044F \u043E\u0447\u0435\u043D\u044C \u0434\u043E\u0441\u0442\u043E\u0439\u043D\u043E.",
            "body": "\u0425\u043E\u0440\u043E\u0448\u0438\u0439 \u0441\u0442\u0438\u043B\u044C\u043D\u044B\u0439 \u043D\u043E\u0443\u0442\u0431\u0443\u043A \u0434\u043B\u044F \u0443\u0447\u0435\u0431\u044B \u0438 \u0440\u0430\u0431\u043E\u0442\u044B. \u0428\u0443\u043C \u0432\u0435\u043D\u0442\u0438\u043B\u044F\u0442\u043E\u0440\u043E\u0432 \u043B\u0438\u0431\u043E \u043D\u0435 \u0441\u043B\u044B\u0448\u043D\u043E, \u043B\u0438\u0431\u043E \u0432 \u043E\u0447\u0435\u043D\u044C \u0440\u0435\u0441\u0443\u0440\u0441\u043E\u0451\u043C\u043A\u0438\u0445 \u0437\u0430\u0434\u0430\u0447\u0430\u0445 \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u0441\u043B\u044B\u0448\u043D\u043E (\u0435\u043B\u0435 \u043A\u0430\u043A, \u0441\u043E\u0432\u0441\u0435\u043C \u043D\u0435 \u043C\u0435\u0448\u0430\u0435\u0442). P.S. \u0412\u043E\u043E\u0431\u0449\u0435 \u0441\u043E\u0432\u0435\u0442\u0443\u044E \u0440\u0430\u0441\u0441\u043C\u0430\u0442\u0440\u0438\u0432\u0430\u0442\u044C \u043C\u043E\u0434\u0435\u043B\u0438 \u0441 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440\u043E\u043C AMD, \u043D\u043E \u043E\u043D\u0438 \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u0434\u043E\u0440\u043E\u0436\u0435, \u0438 \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u0434\u0435\u0444\u0438\u0446\u0438\u0442\u043D\u044B\u0435.",
            "price": "42 990",
            "imgSet": [
              "/goods/2_1_a.jpg",
              "/goods/2_1_b.jpg",
              "/goods/2_1_c.jpg",
              "/goods/2_1_d.jpg",
              "/goods/2_1_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0447\u0435\u0440\u043D\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440", "attrVal": ["Intel Core i3 10110U 2.1"] },
              { "attrId": 3, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["15.6"] },
              { "attrId": 4, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["32"] },
              { "attrId": 5, "attrName": "\u041E\u0417\u0423", "attrVal": ["8"] },
              { "attrId": 6, "attrName": "\u0432\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B", "attrVal": ["\u0434\u043E 7 \u0447\u0430\u0441\u043E\u0432"] },
              { "attrId": 7, "attrName": "\u0434\u0430\u0442\u0447\u0438\u043A \u043E\u0442\u043F\u0435\u0447\u0430\u0442\u043A\u043E\u0432 \u043F\u0430\u043B\u044C\u0446\u0435\u0432", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "OS", "attrVal": ["Windows 10 \u0414\u043E\u043C\u0430\u0448\u043D\u044F\u044F 64"] },
              { "attrId": 9, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Huawei"] }
            ]
          },
          {
            "id": 2,
            "brand": "HP",
            "name": "\u041D\u043E\u0443\u0442\u0431\u0443\u043A HP 15s-fq2060ur 3Y1S4EA",
            "title": "\u0412\u042B\u041D\u041E\u0421\u041B\u0418\u0412\u042B\u0419 \u0421\u041F\u0423\u0422\u041D\u0418\u041A",
            "body": "\u0414\u043B\u044F \u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u044B \u0431\u043E\u043B\u044C\u0448\u0438\u043D\u0441\u0442\u0432\u0430 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0439 \u043D\u0435 \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0437\u0430\u043E\u0431\u043B\u0430\u0447\u043D\u0430\u044F \u043C\u043E\u0449\u043D\u043E\u0441\u0442\u044C - \u043D\u043E\u0443\u0442\u0431\u0443\u043A HP 15s-fq2060ur \u0437\u0430\u043F\u0440\u043E\u0441\u0442\u043E \u0441\u043F\u0440\u0430\u0432\u0438\u0442\u0441\u044F \u0441 \u043F\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u043C\u0438 \u0437\u0430\u0434\u0430\u0447\u0430\u043C\u0438, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044F \u0432\u043B\u0430\u0434\u0435\u043B\u044C\u0446\u0443 \u0437\u0430\u043D\u0438\u043C\u0430\u0442\u044C\u0441\u044F \u0431\u0443\u0434\u043D\u0438\u0447\u043D\u044B\u043C\u0438 \u0434\u0435\u043B\u0430\u043C\u0438 \u0438 \u043E\u0442\u0434\u044B\u0445\u0430\u0442\u044C \u0432 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F.",
            "price": "41 990",
            "imgSet": [
              "/goods/2_2_a.jpg",
              "/goods/2_2_b.jpg",
              "/goods/2_2_c.jpg",
              "/goods/2_2_d.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u043C\u0435\u0442\u0430\u043B\u043B"] },
              { "attrId": 2, "attrName": "\u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440", "attrVal": ["Intel Core i3 1115G4 3.0 \u0413\u0413\u0446"] },
              { "attrId": 3, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["15.6"] },
              { "attrId": 4, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["256"] },
              { "attrId": 5, "attrName": "\u041E\u0417\u0423", "attrVal": ["8"] },
              { "attrId": 6, "attrName": "\u0432\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B", "attrVal": ["\u0434\u043E 7 \u0447\u0430\u0441\u043E\u0432"] },
              { "attrId": 7, "attrName": "\u0434\u0430\u0442\u0447\u0438\u043A \u043E\u0442\u043F\u0435\u0447\u0430\u0442\u043A\u043E\u0432 \u043F\u0430\u043B\u044C\u0446\u0435\u0432", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "OS", "attrVal": ["Windows 10 \u0414\u043E\u043C\u0430\u0448\u043D\u044F\u044F 64"] },
              { "attrId": 9, "attrName": "\u0432\u0435\u0441", "attrVal": ["1,79 \u043A\u0433"] },
              { "attrId": 10, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["HP"] }
            ]
          },
          {
            "id": 3,
            "brand": "Asus",
            "name": "\u041D\u043E\u0443\u0442\u0431\u0443\u043A \u0438\u0433\u0440\u043E\u0432\u043E\u0439 ASUS TUF Gaming F15 FX506LH-HN082T",
            "title": "\u0425\u041E\u0414 NVIDIA",
            "body": "\u041F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043B\u044D\u043F\u0442\u043E\u043F \u0434\u0435\u043B\u0430\u0435\u0442 \u0441\u0442\u0430\u0432\u043A\u0443 \u043D\u0430 \u0432\u0438\u0434\u0435\u043E\u043A\u0430\u0440\u0442\u0443 GeForce GTX 1650 \u0441 4 \u0413\u0431 \u043F\u0430\u043C\u044F\u0442\u0438 \u043D\u0430 \u0431\u043E\u0440\u0442\u0443. \u041E\u043D\u0430 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u043E \u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0445 \u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0439, \u0432\u043A\u043B\u044E\u0447\u0430\u044F DirectX 12, \u0438 \u0432\u044B\u0434\u0430\u0451\u0442 \u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u044B\u0439 FPS \u0432 \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u0435 \u0445\u0438\u0442\u043E\u0432, \u0432\u043A\u043B\u044E\u0447\u0430\u044F \u0441\u0435\u0442\u0435\u0432\u044B\u0435 \u0448\u0443\u0442\u0435\u0440\u044B \u0438 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0438. \u0422\u0430\u043A\u0436\u0435 \u0441\u043E\u0437\u0434\u0430\u0442\u0435\u043B\u0438 \u0440\u0430\u0437\u043C\u0435\u0441\u0442\u0438\u043B\u0438 \u0432 \u043D\u0435\u0434\u0440\u0430\u0445 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430 \u0447\u0435\u0442\u044B\u0440\u0451\u0445\u044A\u044F\u0434\u0435\u0440\u043D\u044B\u0439 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440 Intel Core i5 10300H \u0438 8 \u0413\u0431 \u043E\u043F\u0435\u0440\u0430\u0442\u0438\u0432\u043D\u043E\u0439 \u043F\u0430\u043C\u044F\u0442\u0438 DDR4.",
            "price": "64 990",
            "imgSet": [
              "/goods/2_3_a.jpg",
              "/goods/2_3_b.jpg",
              "/goods/2_3_c.jpg",
              "/goods/2_3_d.jpg",
              "/goods/2_3_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0447\u0435\u0440\u043D\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440", "attrVal": ["Intel Core i5 10300H 2.5 \u0413\u0413\u0446"] },
              { "attrId": 3, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["15.6"] },
              { "attrId": 4, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["512"] },
              { "attrId": 5, "attrName": "\u041E\u0417\u0423", "attrVal": ["16"] },
              { "attrId": 6, "attrName": "\u0432\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B", "attrVal": ["\u0434\u043E 7 \u0447\u0430\u0441\u043E\u0432"] },
              { "attrId": 7, "attrName": "\u0434\u0430\u0442\u0447\u0438\u043A \u043E\u0442\u043F\u0435\u0447\u0430\u0442\u043A\u043E\u0432 \u043F\u0430\u043B\u044C\u0446\u0435\u0432", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "OS", "attrVal": ["Windows 10 \u0414\u043E\u043C\u0430\u0448\u043D\u044F\u044F 64"] },
              { "attrId": 9, "attrName": "\u0432\u0435\u0441", "attrVal": ["2,3 \u043A\u0433"] },
              { "attrId": 10, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Asus"] }
            ]
          },
          {
            "id": 4,
            "brand": "Acer",
            "name": "\u041D\u043E\u0443\u0442\u0431\u0443\u043A Acer TravelMate TMB118-M-C6UT NX.VHSER.00E Acer",
            "title": "C\u043E\u0437\u0434\u0430\u043D \u0434\u043B\u044F \u043F\u0440\u0438\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432 \u0448\u043A\u043E\u043B\u044C\u043D\u043E\u043C \u043A\u043B\u0430\u0441\u0441\u0435 \u0438\u043B\u0438 \u0438\u043D\u0441\u0442\u0438\u0442\u0443\u0442\u0441\u043A\u043E\u0439 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438. ",
            "body": "\u041C\u043E\u0431\u0438\u043B\u044C\u043D\u044B\u0439 \u043A\u043E\u043C\u043F\u044C\u044E\u0442\u0435\u0440 \u043C\u043E\u0436\u043D\u043E \u043A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C \u0431\u0440\u0430\u0442\u044C \u0441 \u0441\u043E\u0431\u043E\u0439 \u043D\u0430 \u0437\u0430\u043D\u044F\u0442\u0438\u044F. \u0411\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u044F \u043F\u0440\u043E\u0440\u0435\u0437\u0438\u043D\u0435\u043D\u043D\u043E\u0439 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u0443\u0434\u0430\u0440\u043D\u043E\u0439 \u0440\u0430\u043C\u043A\u0435, \u044D\u043A\u0440\u0430\u043D\u0443 \u0441 \u0437\u0430\u0449\u0438\u0442\u043E\u0439 \u043E\u0442 \u0434\u0430\u0432\u043B\u0435\u043D\u0438\u044F, \u0438 \u043A\u043B\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0435, \u0432\u044B\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044E\u0449\u0435\u0439 \u043F\u0440\u043E\u043B\u0438\u0432\u0430\u043D\u0438\u0435 \u0434\u043E 330 \u043C\u043B \u0436\u0438\u0434\u043A\u043E\u0441\u0442\u0438, \u0435\u043C\u0443 \u043D\u0435 \u0441\u0442\u0440\u0430\u0448\u043D\u043E \u0434\u0430\u0436\u0435 \u043D\u0435\u0430\u043A\u043A\u0443\u0440\u0430\u0442\u043D\u043E\u0435 \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0435.",
            "price": "15 000",
            "imgSet": [
              "/goods/2_4_a.jpg",
              "/goods/2_4_b.jpg",
              "/goods/2_4_c.jpg",
              "/goods/2_4_d.jpg",
              "/goods/2_4_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0447\u0435\u0440\u043D\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440", "attrVal": ["Intel Celeron N4120 1.1 \u0413\u0413\u0446"] },
              { "attrId": 3, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["11.6"] },
              { "attrId": 4, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["512"] },
              { "attrId": 5, "attrName": "\u041E\u0417\u0423", "attrVal": ["16"] },
              { "attrId": 6, "attrName": "\u0432\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B", "attrVal": ["\u0434\u043E 7 \u0447\u0430\u0441\u043E\u0432"] },
              { "attrId": 7, "attrName": "\u0434\u0430\u0442\u0447\u0438\u043A \u043E\u0442\u043F\u0435\u0447\u0430\u0442\u043A\u043E\u0432 \u043F\u0430\u043B\u044C\u0446\u0435\u0432", "attrVal": ["\u041D\u0435\u0442"] },
              { "attrId": 8, "attrName": "OS", "attrVal": ["Windows 10 \u0414\u043E\u043C\u0430\u0448\u043D\u044F\u044F 64"] },
              { "attrId": 9, "attrName": "\u0432\u0435\u0441", "attrVal": ["1,3 \u043A\u0433"] },
              { "attrId": 10, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Acer"] }
            ]
          },
          {
            "id": 5,
            "brand": "Acer",
            "name": "\u041D\u043E\u0443\u0442\u0431\u0443\u043A \u0438\u0433\u0440\u043E\u0432\u043E\u0439 Acer Nitro 5 AN515-54-54M2 NH.Q59ER.03L",
            "title": "C\u043E\u0437\u0434\u0430\u043D \u0434\u043B\u044F \u043F\u0440\u0438\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432 \u0448\u043A\u043E\u043B\u044C\u043D\u043E\u043C \u043A\u043B\u0430\u0441\u0441\u0435 \u0438\u043B\u0438 \u0438\u043D\u0441\u0442\u0438\u0442\u0443\u0442\u0441\u043A\u043E\u0439 \u0430\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u0438. ",
            "body": "\u041E\u0442\u043B\u0438\u0447\u043D\u043E\u0435 \u0441\u043E\u0447\u0435\u0442\u0430\u043D\u0438\u0435 \u0432\u0438\u0434\u0435\u043E\u043A\u0430\u0440\u0442\u044B \u0438 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440\u0430, \u044D\u043A\u0440\u0430\u043D \u0441 \u0445\u043E\u0440\u043E\u0448\u0435\u0439 ips \u043C\u0430\u0442\u0440\u0438\u0446\u0435\u0439, \u043A\u043E\u0440\u043F\u0443\u0441 \u0441\u0438\u043C\u043F\u0430\u0442\u0438\u0447\u043D\u044B\u0439, \u0431\u0435\u0437 \u043B\u0438\u0448\u043D\u0435\u0433\u043E \u043A\u043E\u043B\u0445\u043E\u0437\u0430. ",
            "price": "64 990",
            "imgSet": [
              "/goods/2_5_a.jpg",
              "/goods/2_5_b.jpg",
              "/goods/2_5_c.jpg",
              "/goods/2_5_d.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0447\u0435\u0440\u043D\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440", "attrVal": ["Intel Core i5 9300H 2.4 \u0413\u0413\u0446"] },
              { "attrId": 3, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["15.6"] },
              { "attrId": 4, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["512"] },
              { "attrId": 5, "attrName": "\u041E\u0417\u0423", "attrVal": ["12"] },
              { "attrId": 6, "attrName": "\u0432\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B", "attrVal": ["\u0434\u043E 11 \u0447\u0430\u0441\u043E\u0432"] },
              { "attrId": 7, "attrName": "\u0434\u0430\u0442\u0447\u0438\u043A \u043E\u0442\u043F\u0435\u0447\u0430\u0442\u043A\u043E\u0432 \u043F\u0430\u043B\u044C\u0446\u0435\u0432", "attrVal": ["\u041D\u0435\u0442"] },
              { "attrId": 8, "attrName": "OS", "attrVal": ["Windows 10 \u0414\u043E\u043C\u0430\u0448\u043D\u044F\u044F 64"] },
              { "attrId": 9, "attrName": "\u0432\u0435\u0441", "attrVal": ["1,3 \u043A\u0433"] },
              { "attrId": 10, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Acer"] }
            ]
          },
          {
            "id": 6,
            "brand": "Lenovo",
            "name": "\u041D\u043E\u0443\u0442\u0431\u0443\u043A \u0438\u0433\u0440\u043E\u0432\u043E\u0439 Lenovo Legion 5 15ACH6H (82JU000XRU) Lenovo",
            "title": "Lenovo Legion 5 15ACH6H \u0433\u043E\u0442\u043E\u0432 \u0434\u043E\u043A\u0430\u0437\u0430\u0442\u044C",
            "body": "\u0413\u043B\u0430\u0432\u043D\u0430\u044F \u043E\u0441\u043E\u0431\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u043D\u043E\u0443\u0442\u0431\u0443\u043A\u0430 \u043E\u0442 Lenovo \u2013 \u0432\u0438\u0434\u0435\u043E\u043A\u0430\u0440\u0442\u0430 GeForce RTX 3060 c 6 \u0413\u0431 \u043F\u0430\u043C\u044F\u0442\u0438. \u0411\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u044F \u0441\u0442\u0430\u0440\u0430\u043D\u0438\u044F\u043C \u0430\u0434\u0430\u043F\u0442\u0435\u0440\u0430 \u0442\u0435\u0431\u0435 \u043D\u0435 \u043F\u0440\u0438\u0434\u0451\u0442\u0441\u044F \u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043D\u0430 \u043C\u044B\u043B\u044C\u043D\u044B\u0435 \u0442\u0435\u043A\u0441\u0442\u0443\u0440\u044B \u0438\u043B\u0438 \u043E\u0442\u043A\u043B\u044E\u0447\u0430\u0442\u044C \u044D\u0444\u0444\u0435\u043A\u0442\u044B \u0440\u0430\u0434\u0438 \u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0433\u043E FPS. \u041E\u043D \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u044E DLSS, \u043A\u043E\u0442\u043E\u0440\u0430\u044F \u043F\u0440\u0438\u0433\u043E\u0434\u0438\u0442\u0441\u044F \u0432 \u0441\u0430\u043C\u044B\u0445 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u0438\u0433\u0440\u0430\u0445, \u0430 \u0442\u0430\u043A\u0436\u0435 \u0442\u0440\u0430\u0441\u0441\u0438\u0440\u043E\u0432\u043A\u0443 \u043B\u0443\u0447\u0435\u0439 \u0432 \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u043C \u0432\u0440\u0435\u043C\u0435\u043D\u0438.",
            "price": "109 990",
            "imgSet": [
              "/goods/2_6_a.jpg",
              "/goods/2_6_b.jpg",
              "/goods/2_6_c.jpg",
              "/goods/2_6_d.jpg",
              "/goods/2_6_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0447\u0435\u0440\u043D\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440", "attrVal": ["AMD Ryzen 5 5600H 3.3 \u0413\u0413\u0446"] },
              { "attrId": 3, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["15.6"] },
              { "attrId": 4, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["512"] },
              { "attrId": 5, "attrName": "\u041E\u0417\u0423", "attrVal": ["16"] },
              { "attrId": 6, "attrName": "\u0432\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B", "attrVal": ["\u0434\u043E 9 \u0447\u0430\u0441\u043E\u0432"] },
              { "attrId": 7, "attrName": "\u0434\u0430\u0442\u0447\u0438\u043A \u043E\u0442\u043F\u0435\u0447\u0430\u0442\u043A\u043E\u0432 \u043F\u0430\u043B\u044C\u0446\u0435\u0432", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "OS", "attrVal": ["Windows 10 \u0414\u043E\u043C\u0430\u0448\u043D\u044F\u044F 64"] },
              { "attrId": 9, "attrName": "\u0432\u0435\u0441", "attrVal": ["1,3 \u043A\u0433"] },
              { "attrId": 10, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Lenovo"] }
            ]
          },
          {
            "id": 7,
            "brand": "Dell",
            "name": "\u041D\u043E\u0443\u0442\u0431\u0443\u043A Dell Inspiron 3501-8182",
            "title": "\u0414\u041E\u0421\u0422\u041E\u0419\u041D\u042B\u0419 \u0423\u0420\u041E\u0412\u0415\u041D\u042C",
            "body": "\u041B\u0438\u043D\u0435\u0439\u043A\u0430 \u043D\u043E\u0443\u0442\u0431\u0443\u043A\u043E\u0432 Dell Inspiron 3501 \u0432\u044B\u0434\u0435\u043B\u044F\u0435\u0442\u0441\u044F \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0441\u043A\u0440\u043E\u043C\u043D\u044B\u043C\u0438 \u0433\u0430\u0431\u0430\u0440\u0438\u0442\u0430\u043C\u0438, \u0431\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u044F \u043A\u043E\u0442\u043E\u0440\u044B\u043C \u0432\u043B\u0430\u0434\u0435\u043B\u0435\u0446 \u043C\u043E\u0436\u0435\u0442 \u0437\u0430\u043F\u0440\u043E\u0441\u0442\u043E \u0437\u0430\u043F\u0443\u0441\u043A\u0430\u0442\u044C \u0441\u0430\u043C\u044B\u0435 \u0432\u043E\u0441\u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u043D\u044B\u0435 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B \u0432 \u0434\u043E\u0440\u043E\u0433\u0435, \u043D\u043E \u0438 \u0441\u043E\u043B\u0438\u0434\u043D\u044B\u043C\u0438 \u0445\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043A\u0430\u043C\u0438.",
            "price": "31 990",
            "imgSet": [
              "/goods/2_7_a.jpg",
              "/goods/2_7_b.jpg",
              "/goods/2_7_c.jpg",
              "/goods/2_7_d.jpg",
              "/goods/2_7_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0447\u0435\u0440\u043D\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440", "attrVal": ["Intel Core i3 1005G1 1.2 \u0413\u0413\u0446"] },
              { "attrId": 3, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["15.6"] },
              { "attrId": 4, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["128"] },
              { "attrId": 5, "attrName": "\u041E\u0417\u0423", "attrVal": ["4"] },
              { "attrId": 6, "attrName": "\u0432\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B", "attrVal": ["\u0434\u043E 7 \u0447\u0430\u0441\u043E\u0432"] },
              { "attrId": 7, "attrName": "\u0434\u0430\u0442\u0447\u0438\u043A \u043E\u0442\u043F\u0435\u0447\u0430\u0442\u043A\u043E\u0432 \u043F\u0430\u043B\u044C\u0446\u0435\u0432", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "OS", "attrVal": ["Windows 10 \u0414\u043E\u043C\u0430\u0448\u043D\u044F\u044F 64"] },
              { "attrId": 9, "attrName": "\u0432\u0435\u0441", "attrVal": ["1,85 \u043A\u0433"] },
              { "attrId": 10, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Dell"] }
            ]
          },
          {
            "id": 8,
            "brand": "Apple",
            "name": "\u041D\u043E\u0443\u0442\u0431\u0443\u043A Apple MacBook Pro 13 M1/8/256 Space Gray",
            "title": "MacBook Pro 13 \u0434\u044E\u0438\u0306\u043C\u043E\u0432",
            "body": "MacBook Pro 13 \u0434\u044E\u0438\u0306\u043C\u043E\u0432 \u0432\u044B\u0445\u043E\u0434\u0438\u0442 \u043D\u0430 \u0441\u043E\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u043E \u043D\u043E\u0432\u044B\u0438\u0306 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0431\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u044F \u043C\u043E\u0449\u043D\u043E\u043C\u0443 \u0447\u0438\u043F\u0443 Apple M1. \u0414\u043E 2,8 \u0440\u0430\u0437\u0430 \u0431\u043E\u043B\u044C\u0448\u0435 \u0432\u044B\u0447\u0438\u0441\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0438\u0306 \u043C\u043E\u0449\u043D\u043E\u0441\u0442\u0438, \u0434\u043E 5 \u0440\u0430\u0437 \u0432\u044B\u0448\u0435 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0438 \u0433\u0440\u0430\u0444\u0438\u043A\u0438, \u0434\u043E 20 \u0447\u0430\u0441\u043E\u0432 \u0440\u0430\u0431\u043E\u0442\u044B \u0431\u0435\u0437 \u043F\u043E\u0434\u0437\u0430\u0440\u044F\u0434\u043A\u0438 \u2014 \u0434\u043E\u043B\u044C\u0448\u0435 \u043B\u044E\u0431\u043E\u0433\u043E \u0434\u0440\u0443\u0433\u043E\u0433\u043E Mac. \u0422\u0435\u043F\u0435\u0440\u044C \u0432 \u0432\u0430\u0448\u0435\u043C \u0440\u0430\u0441\u043F\u043E\u0440\u044F\u0436\u0435\u043D\u0438\u0438 \u0435\u0449\u0435\u0308 \u0431\u043E\u043B\u0435\u0435 \u0432\u043F\u0435\u0447\u0430\u0442\u043B\u044F\u044E\u0449\u0438\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438. \u0418 \u043E\u043D\u0438 \u043F\u043E\u0432\u0441\u044E\u0434\u0443 \u0441 \u0432\u0430\u043C\u0438.",
            "price": "31 990",
            "imgSet": [
              "/goods/2_8_a.jpg",
              "/goods/2_8_b.jpg",
              "/goods/2_8_c.jpg",
              "/goods/2_8_d.jpg",
              "/goods/2_8_e.jpg",
              "/goods/2_8_f.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0447\u0435\u0440\u043D\u044B\u0439", "\u043C\u0435\u0442\u0430\u043B\u043B"] },
              { "attrId": 2, "attrName": "\u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440", "attrVal": ["Apple M1"] },
              { "attrId": 3, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["13.3"] },
              { "attrId": 4, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["128"] },
              { "attrId": 5, "attrName": "\u041E\u0417\u0423", "attrVal": ["8"] },
              { "attrId": 6, "attrName": "\u0432\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B", "attrVal": ["\u0434\u043E 20 \u0447\u0430\u0441\u043E\u0432"] },
              { "attrId": 7, "attrName": "\u0434\u0430\u0442\u0447\u0438\u043A \u043E\u0442\u043F\u0435\u0447\u0430\u0442\u043A\u043E\u0432 \u043F\u0430\u043B\u044C\u0446\u0435\u0432", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "OS", "attrVal": ["MacOS"] },
              { "attrId": 9, "attrName": "\u0432\u0435\u0441", "attrVal": ["1,85 \u043A\u0433"] },
              { "attrId": 10, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Apple"] }
            ]
          },
          {
            "id": 9,
            "brand": "Apple",
            "name": "\u041D\u043E\u0443\u0442\u0431\u0443\u043A Apple MacBook Pro 13 M1/8/256 White",
            "title": "MacBook Pro 13 \u0434\u044E\u0438\u0306\u043C\u043E\u0432",
            "body": "MacBook Pro 13 \u0434\u044E\u0438\u0306\u043C\u043E\u0432 \u0432\u044B\u0445\u043E\u0434\u0438\u0442 \u043D\u0430 \u0441\u043E\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u043E \u043D\u043E\u0432\u044B\u0438\u0306 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0431\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u044F \u043C\u043E\u0449\u043D\u043E\u043C\u0443 \u0447\u0438\u043F\u0443 Apple M1. \u0414\u043E 2,8 \u0440\u0430\u0437\u0430 \u0431\u043E\u043B\u044C\u0448\u0435 \u0432\u044B\u0447\u0438\u0441\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0438\u0306 \u043C\u043E\u0449\u043D\u043E\u0441\u0442\u0438, \u0434\u043E 5 \u0440\u0430\u0437 \u0432\u044B\u0448\u0435 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0438 \u0433\u0440\u0430\u0444\u0438\u043A\u0438, \u0434\u043E 20 \u0447\u0430\u0441\u043E\u0432 \u0440\u0430\u0431\u043E\u0442\u044B \u0431\u0435\u0437 \u043F\u043E\u0434\u0437\u0430\u0440\u044F\u0434\u043A\u0438 \u2014 \u0434\u043E\u043B\u044C\u0448\u0435 \u043B\u044E\u0431\u043E\u0433\u043E \u0434\u0440\u0443\u0433\u043E\u0433\u043E Mac. \u0422\u0435\u043F\u0435\u0440\u044C \u0432 \u0432\u0430\u0448\u0435\u043C \u0440\u0430\u0441\u043F\u043E\u0440\u044F\u0436\u0435\u043D\u0438\u0438 \u0435\u0449\u0435\u0308 \u0431\u043E\u043B\u0435\u0435 \u0432\u043F\u0435\u0447\u0430\u0442\u043B\u044F\u044E\u0449\u0438\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438. \u0418 \u043E\u043D\u0438 \u043F\u043E\u0432\u0441\u044E\u0434\u0443 \u0441 \u0432\u0430\u043C\u0438.",
            "price": "31 990",
            "imgSet": [
              "/goods/2_8_a.jpg",
              "/goods/2_8_b.jpg",
              "/goods/2_8_c.jpg",
              "/goods/2_8_d.jpg",
              "/goods/2_8_e.jpg",
              "/goods/2_8_f.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0447\u0435\u0440\u043D\u044B\u0439", "\u043C\u0435\u0442\u0430\u043B\u043B"] },
              { "attrId": 2, "attrName": "\u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440", "attrVal": ["Apple M1"] },
              { "attrId": 3, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["13.3"] },
              { "attrId": 4, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["128"] },
              { "attrId": 5, "attrName": "\u041E\u0417\u0423", "attrVal": ["8"] },
              { "attrId": 6, "attrName": "\u0432\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B", "attrVal": ["\u0434\u043E 20 \u0447\u0430\u0441\u043E\u0432"] },
              { "attrId": 7, "attrName": "\u0434\u0430\u0442\u0447\u0438\u043A \u043E\u0442\u043F\u0435\u0447\u0430\u0442\u043A\u043E\u0432 \u043F\u0430\u043B\u044C\u0446\u0435\u0432", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "OS", "attrVal": ["MacOS"] },
              { "attrId": 9, "attrName": "\u0432\u0435\u0441", "attrVal": ["1,85 \u043A\u0433"] },
              { "attrId": 10, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Apple"] }
            ]
          },
          {
            "id": 10,
            "brand": "Apple",
            "name": "\u041D\u043E\u0443\u0442\u0431\u0443\u043A Apple MacBook Pro 13 M1/8/256 Pink",
            "title": "MacBook Pro 13 \u0434\u044E\u0438\u0306\u043C\u043E\u0432",
            "body": "MacBook Pro 13 \u0434\u044E\u0438\u0306\u043C\u043E\u0432 \u0432\u044B\u0445\u043E\u0434\u0438\u0442 \u043D\u0430 \u0441\u043E\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u043E \u043D\u043E\u0432\u044B\u0438\u0306 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0431\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u044F \u043C\u043E\u0449\u043D\u043E\u043C\u0443 \u0447\u0438\u043F\u0443 Apple M1. \u0414\u043E 2,8 \u0440\u0430\u0437\u0430 \u0431\u043E\u043B\u044C\u0448\u0435 \u0432\u044B\u0447\u0438\u0441\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0438\u0306 \u043C\u043E\u0449\u043D\u043E\u0441\u0442\u0438, \u0434\u043E 5 \u0440\u0430\u0437 \u0432\u044B\u0448\u0435 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0438 \u0433\u0440\u0430\u0444\u0438\u043A\u0438, \u0434\u043E 20 \u0447\u0430\u0441\u043E\u0432 \u0440\u0430\u0431\u043E\u0442\u044B \u0431\u0435\u0437 \u043F\u043E\u0434\u0437\u0430\u0440\u044F\u0434\u043A\u0438 \u2014 \u0434\u043E\u043B\u044C\u0448\u0435 \u043B\u044E\u0431\u043E\u0433\u043E \u0434\u0440\u0443\u0433\u043E\u0433\u043E Mac. \u0422\u0435\u043F\u0435\u0440\u044C \u0432 \u0432\u0430\u0448\u0435\u043C \u0440\u0430\u0441\u043F\u043E\u0440\u044F\u0436\u0435\u043D\u0438\u0438 \u0435\u0449\u0435\u0308 \u0431\u043E\u043B\u0435\u0435 \u0432\u043F\u0435\u0447\u0430\u0442\u043B\u044F\u044E\u0449\u0438\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438. \u0418 \u043E\u043D\u0438 \u043F\u043E\u0432\u0441\u044E\u0434\u0443 \u0441 \u0432\u0430\u043C\u0438.",
            "price": "31 990",
            "imgSet": [
              "/goods/2_8_a.jpg",
              "/goods/2_8_b.jpg",
              "/goods/2_8_c.jpg",
              "/goods/2_8_d.jpg",
              "/goods/2_8_e.jpg",
              "/goods/2_8_f.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0446\u0432\u0435\u0442", "attrVal": ["\u0447\u0435\u0440\u043D\u044B\u0439", "\u043C\u0435\u0442\u0430\u043B\u043B"] },
              { "attrId": 2, "attrName": "\u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0440", "attrVal": ["Apple M1"] },
              { "attrId": 3, "attrName": "\u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C", "attrVal": ["13.3"] },
              { "attrId": 4, "attrName": "\u043F\u0430\u043C\u044F\u0442\u044C", "attrVal": ["128"] },
              { "attrId": 5, "attrName": "\u041E\u0417\u0423", "attrVal": ["8"] },
              { "attrId": 6, "attrName": "\u0432\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B", "attrVal": ["\u0434\u043E 20 \u0447\u0430\u0441\u043E\u0432"] },
              { "attrId": 7, "attrName": "\u0434\u0430\u0442\u0447\u0438\u043A \u043E\u0442\u043F\u0435\u0447\u0430\u0442\u043A\u043E\u0432 \u043F\u0430\u043B\u044C\u0446\u0435\u0432", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "OS", "attrVal": ["MacOS"] },
              { "attrId": 9, "attrName": "\u0432\u0435\u0441", "attrVal": ["1,85 \u043A\u0433"] },
              { "attrId": 10, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Apple"] }
            ]
          }
        ]
      },
      {
        "id": 2,
        "catName": "\u0421\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u044B\u0435 \u043C\u0430\u0448\u0438\u043D\u044B",
        "catImg": "local_laundry_service",
        "category": [
          {
            "id": 1,
            "brand": "Samsung",
            "name": "\u0421\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 \u0443\u0437\u043A\u0430\u044F Samsung WW65K52E69S",
            "title": "\u042D\u0424\u0424\u0415\u041A\u0422\u0418\u0412\u041D\u041E\u0421\u0422\u042C",
            "body": "\u0423\u0437\u043A\u0430\u044F \u0441\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 Samsung WW65K52E69S \u043E\u0441\u043D\u0430\u0449\u0435\u043D\u0430 \u0438\u043D\u0432\u0435\u0440\u0442\u043E\u0440\u043D\u044B\u043C \u043C\u043E\u0442\u043E\u0440\u043E\u043C, \u0441\u043E\u0431\u0440\u0430\u043D\u043D\u044B\u043C \u043F\u043E \u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0438 Digital Inverter. \u0412 \u043D\u0451\u043C \u0435\u0441\u0442\u044C \u043C\u043E\u0449\u043D\u044B\u0435 \u043C\u0430\u0433\u043D\u0438\u0442\u044B, \u0431\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u044F \u043A\u043E\u0442\u043E\u0440\u044B\u043C \u0437\u043D\u0430\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0443\u043C\u0435\u043D\u044C\u0448\u0430\u0435\u0442\u0441\u044F \u0442\u0440\u0435\u043D\u0438\u0435 \u0434\u0435\u0442\u0430\u043B\u0435\u0439, \u0441\u043D\u0438\u0436\u0430\u0435\u0442\u0441\u044F \u0432\u0438\u0431\u0440\u0430\u0446\u0438\u044F \u0438 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0448\u0443\u043C\u0430.",
            "price": "42 990",
            "imgSet": [
              "/goods/3_1_a.jpg",
              "/goods/3_1_b.jpg",
              "/goods/3_1_c.jpg",
              "/goods/3_1_d.jpg",
              "/goods/3_1_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430", "attrVal": ["6.5 \u043A\u0433"] },
              { "attrId": 2, "attrName": "\u041C\u043E\u0442\u043E\u0440", "attrVal": ["\u0438\u043D\u0432\u0435\u0440\u0442\u043E\u0440\u043D\u044B\u0439"] },
              { "attrId": 3, "attrName": "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043E\u0442\u0436\u0438\u043C\u0430", "attrVal": ["1200 \u043E\u0431/\u043C\u0438\u043D"] },
              { "attrId": 4, "attrName": "\u041C\u0438\u043D\u0438\u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0430", "attrVal": ["15 \u043C\u0438\u043D"] },
              { "attrId": 5, "attrName": "\u0417\u0430\u0449\u0438\u0442\u0430 \u043E\u0442 \u043F\u0440\u043E\u0442\u0435\u0447\u0435\u043A", "attrVal": ["\u0434\u0430"] },
              { "attrId": 6, "attrName": "\u0421\u0442\u0430\u0431\u0438\u043B\u0438\u0437\u0430\u0442\u043E\u0440 \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F", "attrVal": ["\u0434\u0430"] },
              { "attrId": 7, "attrName": "\u0421\u0442\u0438\u0440\u043A\u0430 \u0441 \u043F\u0430\u0440\u043E\u043C", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Samsung"] }
            ]
          },
          {
            "id": 2,
            "brand": "Samsung",
            "name": "\u0421\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 \u0443\u0437\u043A\u0430\u044F Samsung WW80R42LXFW",
            "title": "\u041F\u0420\u041E\u0421\u0422\u041E\u0415 \u0423\u041F\u0420\u0410\u0412\u041B\u0415\u041D\u0418\u0415",
            "body": "\u0421\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 Samsung WW80R42LXFW \u0441\u043E\u0447\u0435\u0442\u0430\u0435\u0442 \u043A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u044B\u0435 \u0440\u0430\u0437\u043C\u0435\u0440\u044B \u0441 \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0432\u043C\u0435\u0441\u0442\u0438\u043C\u043E\u0441\u0442\u044C\u044E \u2013 \u0434\u043E 8 \u043A\u0438\u043B\u043E\u0433\u0440\u0430\u043C\u043C\u043E\u0432 \u0445\u043B\u043E\u043F\u043A\u043E\u0432\u043E\u0433\u043E \u0431\u0435\u043B\u044C\u044F. \u041E\u043D\u0430 \u044D\u0444\u0444\u0435\u043A\u0442\u0438\u0432\u043D\u043E \u043E\u0447\u0438\u0449\u0430\u0435\u0442 \u043F\u043B\u043E\u0442\u043D\u044B\u0435 \u0442\u043A\u0430\u043D\u0438 \u043E\u0442 \u0441\u0442\u043E\u0439\u043A\u0438\u0445 \u043F\u044F\u0442\u0435\u043D, \u0440\u0430\u0432\u043D\u043E\u043C\u0435\u0440\u043D\u043E \u043D\u0430\u0441\u044B\u0449\u0430\u044F \u0438\u0445 \u043C\u043E\u044E\u0449\u0438\u043C \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u043E\u043C \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E \u0433\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u0430 \u043F\u0443\u0437\u044B\u0440\u044C\u043A\u043E\u0432.",
            "price": "28 990",
            "imgSet": [
              "/goods/3_2_a.jpg",
              "/goods/3_2_b.jpg",
              "/goods/3_2_c.jpg",
              "/goods/3_2_d.jpg",
              "/goods/3_2_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430", "attrVal": ["8 \u043A\u0433"] },
              { "attrId": 2, "attrName": "\u041C\u043E\u0442\u043E\u0440", "attrVal": ["\u0438\u043D\u0432\u0435\u0440\u0442\u043E\u0440\u043D\u044B\u0439"] },
              { "attrId": 3, "attrName": "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043E\u0442\u0436\u0438\u043C\u0430", "attrVal": ["1200 \u043E\u0431/\u043C\u0438\u043D"] },
              { "attrId": 4, "attrName": "\u041C\u0438\u043D\u0438\u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0430", "attrVal": ["15 \u043C\u0438\u043D"] },
              { "attrId": 5, "attrName": "\u0417\u0430\u0449\u0438\u0442\u0430 \u043E\u0442 \u043F\u0440\u043E\u0442\u0435\u0447\u0435\u043A", "attrVal": ["\u0447\u0430\u0441\u0442\u0438\u0447\u043D\u0430\u044F"] },
              { "attrId": 6, "attrName": "\u0421\u0442\u0430\u0431\u0438\u043B\u0438\u0437\u0430\u0442\u043E\u0440 \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F", "attrVal": ["\u0434\u0430"] },
              { "attrId": 7, "attrName": "\u0421\u0442\u0438\u0440\u043A\u0430 \u0441 \u043F\u0430\u0440\u043E\u043C", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Samsung"] }
            ]
          },
          {
            "id": 3,
            "brand": "LG",
            "name": "\u0421\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 \u0443\u0437\u043A\u0430\u044F LG AIDD F2T9HS9S",
            "title": "\u041B\u0401\u0413\u041A\u0410\u042F \u0413\u041B\u0410\u0416\u041A\u0410",
            "body": "\u0421\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 LG AI DD F2T9HS9S \u0441\u043D\u0430\u0431\u0436\u0435\u043D\u0430 \u0434\u0430\u0442\u0447\u0438\u043A\u0430\u043C\u0438, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u044E\u0442 \u0442\u0438\u043F \u0442\u043A\u0430\u043D\u0438. \u041E\u043D\u0430 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0432\u044B\u0431\u0438\u0440\u0430\u0435\u0442 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0434\u043B\u044F \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u0430, \u043F\u043E\u0432\u044B\u0448\u0430\u044F \u044D\u0444\u0444\u0435\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F \u043F\u044F\u0442\u0435\u043D \u0438 \u0437\u0430\u0449\u0438\u0449\u0430\u044F \u0434\u0435\u043B\u0438\u043A\u0430\u0442\u043D\u043E\u0435 \u0431\u0435\u043B\u044C\u0451 \u043E\u0442 \u043F\u043E\u0432\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0439.",
            "price": "33 990",
            "imgSet": [
              "/goods/3_3_a.jpg",
              "/goods/3_3_b.jpg",
              "/goods/3_3_c.jpg",
              "/goods/3_3_d.jpg",
              "/goods/3_3_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430", "attrVal": ["7 \u043A\u0433"] },
              { "attrId": 2, "attrName": "\u041C\u043E\u0442\u043E\u0440", "attrVal": ["\u0438\u043D\u0432\u0435\u0440\u0442\u043E\u0440\u043D\u044B\u0439"] },
              { "attrId": 3, "attrName": "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043E\u0442\u0436\u0438\u043C\u0430", "attrVal": ["1200 \u043E\u0431/\u043C\u0438\u043D"] },
              { "attrId": 4, "attrName": "\u041C\u0438\u043D\u0438\u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0430", "attrVal": ["14 \u043C\u0438\u043D"] },
              { "attrId": 5, "attrName": "\u0417\u0430\u0449\u0438\u0442\u0430 \u043E\u0442 \u043F\u0440\u043E\u0442\u0435\u0447\u0435\u043A", "attrVal": ["\u0447\u0430\u0441\u0442\u0438\u0447\u043D\u0430\u044F"] },
              { "attrId": 6, "attrName": "\u0421\u0442\u0430\u0431\u0438\u043B\u0438\u0437\u0430\u0442\u043E\u0440 \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F", "attrVal": ["\u0434\u0430"] },
              { "attrId": 7, "attrName": "\u0421\u0442\u0438\u0440\u043A\u0430 \u0441 \u043F\u0430\u0440\u043E\u043C", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["LG"] }
            ]
          },
          {
            "id": 4,
            "brand": "LG",
            "name": "\u0421\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 LG AIDD F4V5VS0W",
            "title": "\u041C\u0410\u041A\u0421\u0418\u041C\u0410\u041B\u042C\u041D\u041E \u042D\u0424\u0424\u0415\u041A\u0422\u0418\u0412\u041D\u041E",
            "body": "\u0424\u0443\u043D\u043A\u0446\u0438\u044F \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0438 \u043F\u0430\u0440\u043E\u043C Steam \u0437\u043D\u0430\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0443\u043C\u0435\u043D\u044C\u0448\u0438\u0442 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0441\u043A\u043B\u0430\u0434\u043E\u043A \u0438 \u0437\u0430\u043B\u043E\u043C\u043E\u0432. \u041E\u043D\u0430 \u0442\u0430\u043A\u0436\u0435 \u0443\u0431\u0435\u0440\u0451\u0442 \u0431\u043E\u043B\u044C\u0448\u0443\u044E \u0447\u0430\u0441\u0442\u044C \u0430\u043B\u043B\u0435\u0440\u0433\u0435\u043D\u043E\u0432 \u0438 \u0443\u0441\u0442\u0440\u0430\u043D\u0438\u0442 \u043D\u0435\u043F\u0440\u0438\u044F\u0442\u043D\u044B\u0435 \u0437\u0430\u043F\u0430\u0445\u0438.",
            "price": "35 990",
            "imgSet": [
              "/goods/3_4_a.jpg",
              "/goods/3_4_b.jpg",
              "/goods/3_4_c.jpg",
              "/goods/3_4_d.jpg",
              "/goods/3_4_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430", "attrVal": ["7 \u043A\u0433"] },
              { "attrId": 2, "attrName": "\u041C\u043E\u0442\u043E\u0440", "attrVal": ["\u0438\u043D\u0432\u0435\u0440\u0442\u043E\u0440\u043D\u044B\u0439"] },
              { "attrId": 3, "attrName": "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043E\u0442\u0436\u0438\u043C\u0430", "attrVal": ["1200 \u043E\u0431/\u043C\u0438\u043D"] },
              { "attrId": 4, "attrName": "\u041C\u0438\u043D\u0438\u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0430", "attrVal": ["14 \u043C\u0438\u043D"] },
              { "attrId": 5, "attrName": "\u0417\u0430\u0449\u0438\u0442\u0430 \u043E\u0442 \u043F\u0440\u043E\u0442\u0435\u0447\u0435\u043A", "attrVal": ["\u0447\u0430\u0441\u0442\u0438\u0447\u043D\u0430\u044F"] },
              { "attrId": 6, "attrName": "\u0421\u0442\u0430\u0431\u0438\u043B\u0438\u0437\u0430\u0442\u043E\u0440 \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F", "attrVal": ["\u0434\u0430"] },
              { "attrId": 7, "attrName": "\u0421\u0442\u0438\u0440\u043A\u0430 \u0441 \u043F\u0430\u0440\u043E\u043C", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["LG"] }
            ]
          },
          {
            "id": 5,
            "brand": "Bosch",
            "name": "\u0421\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 \u0443\u0437\u043A\u0430\u044F Bosch Serie | 2 WLG20060OE",
            "title": "\u042D\u041A\u041E\u041D\u041E\u041C\u0418\u042F \u0412\u041E\u0414\u042B \u0418 \u042D\u041B\u0415\u041A\u0422\u0420\u041E\u042D\u041D\u0415\u0420\u0413\u0418\u0418",
            "body": "\u0423\u0437\u043A\u0430\u044F \u0441\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 Bosch Serie | 2 WLG20060OE \u0445\u043E\u0440\u043E\u0448\u043E \u043F\u043E\u0434\u0445\u043E\u0434\u0438\u0442 \u0434\u043B\u044F \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438 \u0432 \u043D\u0435\u0431\u043E\u043B\u044C\u0448\u0438\u0445 \u043F\u043E\u043C\u0435\u0449\u0435\u043D\u0438\u044F\u0445. \u041E\u043D\u0430 \u043D\u0435 \u0437\u0430\u043D\u0438\u043C\u0430\u0435\u0442 \u043C\u043D\u043E\u0433\u043E \u043C\u0435\u0441\u0442\u0430, \u043E\u0431\u0435\u0441\u043F\u0435\u0447\u0438\u0432\u0430\u0435\u0442 \u0432\u044B\u0441\u043E\u043A\u043E\u0435 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0441\u0442\u0438\u0440\u043A\u0438.",
            "price": "23 990",
            "imgSet": [
              "/goods/3_5_a.jpg",
              "/goods/3_5_b.jpg",
              "/goods/3_5_c.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430", "attrVal": ["7 \u043A\u0433"] },
              { "attrId": 2, "attrName": "\u041C\u043E\u0442\u043E\u0440", "attrVal": ["\u0438\u043D\u0432\u0435\u0440\u0442\u043E\u0440\u043D\u044B\u0439"] },
              { "attrId": 3, "attrName": "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043E\u0442\u0436\u0438\u043C\u0430", "attrVal": ["1200 \u043E\u0431/\u043C\u0438\u043D"] },
              { "attrId": 4, "attrName": "\u041C\u0438\u043D\u0438\u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0430", "attrVal": ["14 \u043C\u0438\u043D"] },
              { "attrId": 5, "attrName": "\u0417\u0430\u0449\u0438\u0442\u0430 \u043E\u0442 \u043F\u0440\u043E\u0442\u0435\u0447\u0435\u043A", "attrVal": ["\u0447\u0430\u0441\u0442\u0438\u0447\u043D\u0430\u044F"] },
              { "attrId": 6, "attrName": "\u0421\u0442\u0430\u0431\u0438\u043B\u0438\u0437\u0430\u0442\u043E\u0440 \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F", "attrVal": ["\u0434\u0430"] },
              { "attrId": 7, "attrName": "\u0421\u0442\u0438\u0440\u043A\u0430 \u0441 \u043F\u0430\u0440\u043E\u043C", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Bosch"] }
            ]
          },
          {
            "id": 6,
            "brand": "Bosch",
            "name": "\u0421\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 Bosch HomeProfessional WAX32DH1OE",
            "title": "\u042D\u041A\u041E\u041D\u041E\u041C\u0418\u042F \u0412\u041E\u0414\u042B \u0418 \u042D\u041B\u0415\u041A\u0422\u0420\u041E\u042D\u041D\u0415\u0420\u0413\u0418\u0418",
            "body": "\u0423\u0437\u043A\u0430\u044F \u0441\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 Bosch Serie | 2 WLG20060OE \u0445\u043E\u0440\u043E\u0448\u043E \u043F\u043E\u0434\u0445\u043E\u0434\u0438\u0442 \u0434\u043B\u044F \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438 \u0432 \u043D\u0435\u0431\u043E\u043B\u044C\u0448\u0438\u0445 \u043F\u043E\u043C\u0435\u0449\u0435\u043D\u0438\u044F\u0445. \u041E\u043D\u0430 \u043D\u0435 \u0437\u0430\u043D\u0438\u043C\u0430\u0435\u0442 \u043C\u043D\u043E\u0433\u043E \u043C\u0435\u0441\u0442\u0430, \u043E\u0431\u0435\u0441\u043F\u0435\u0447\u0438\u0432\u0430\u0435\u0442 \u0432\u044B\u0441\u043E\u043A\u043E\u0435 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0441\u0442\u0438\u0440\u043A\u0438.",
            "price": "23 990",
            "imgSet": [
              "/goods/3_6_a.jpg",
              "/goods/3_6_b.jpg",
              "/goods/3_6_c.jpg",
              "/goods/3_6_d.jpg",
              "/goods/3_6_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430", "attrVal": ["7 \u043A\u0433"] },
              { "attrId": 2, "attrName": "\u041C\u043E\u0442\u043E\u0440", "attrVal": ["\u0438\u043D\u0432\u0435\u0440\u0442\u043E\u0440\u043D\u044B\u0439"] },
              { "attrId": 3, "attrName": "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043E\u0442\u0436\u0438\u043C\u0430", "attrVal": ["1200 \u043E\u0431/\u043C\u0438\u043D"] },
              { "attrId": 4, "attrName": "\u041C\u0438\u043D\u0438\u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0430", "attrVal": ["14 \u043C\u0438\u043D"] },
              { "attrId": 5, "attrName": "\u0417\u0430\u0449\u0438\u0442\u0430 \u043E\u0442 \u043F\u0440\u043E\u0442\u0435\u0447\u0435\u043A", "attrVal": ["\u0447\u0430\u0441\u0442\u0438\u0447\u043D\u0430\u044F"] },
              { "attrId": 6, "attrName": "\u0421\u0442\u0430\u0431\u0438\u043B\u0438\u0437\u0430\u0442\u043E\u0440 \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F", "attrVal": ["\u0434\u0430"] },
              { "attrId": 7, "attrName": "\u0421\u0442\u0438\u0440\u043A\u0430 \u0441 \u043F\u0430\u0440\u043E\u043C", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Bosch"] }
            ]
          },
          {
            "id": 7,
            "brand": "Candy",
            "name": "\u0421\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 \u0443\u0437\u043A\u0430\u044F Candy SmartPro CSO44128TB1/2-07",
            "title": "\u041F\u0420\u0415\u0412\u041E\u0421\u0425\u041E\u0414\u041D\u042B\u0419 \u0420\u0415\u0417\u0423\u041B\u042C\u0422\u0410\u0422",
            "body": "\u0413\u043B\u0443\u0431\u0438\u043D\u0430 \u043A\u043E\u0440\u043F\u0443\u0441\u0430 \u0441\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u043E\u0439 \u043C\u0430\u0448\u0438\u043D\u044B Candy SmartPro CSO4 CO4 106T1/2-07 \u0441\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 40 \u0441\u043C. \u0411\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u044F \u044D\u0442\u043E\u043C\u0443 \u043E\u043D\u0430 \u043D\u0435 \u0437\u0430\u043D\u0438\u043C\u0430\u0435\u0442 \u043C\u043D\u043E\u0433\u043E \u043C\u0435\u0441\u0442\u0430 \u0438 \u043F\u043E\u0434\u0445\u043E\u0434\u0438\u0442 \u0434\u043B\u044F \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438 \u0432 \u043D\u0435\u0431\u043E\u043B\u044C\u0448\u043E\u043C \u043F\u043E\u043C\u0435\u0449\u0435\u043D\u0438\u0438. \u042D\u0442\u0430 \u043C\u043E\u0434\u0435\u043B\u044C \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u043D\u0430 \u043D\u0430 \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u0443\u044E \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0443 \u0434\u043E 6 \u043A\u0433 \u0431\u0435\u043B\u044C\u044F.",
            "price": "17 490",
            "imgSet": [
              "/goods/3_7_a.jpg",
              "/goods/3_7_b.jpg",
              "/goods/3_7_c.jpg",
              "/goods/3_7_d.jpg",
              "/goods/3_7_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430", "attrVal": ["7 \u043A\u0433"] },
              { "attrId": 2, "attrName": "\u041C\u043E\u0442\u043E\u0440", "attrVal": ["\u0438\u043D\u0432\u0435\u0440\u0442\u043E\u0440\u043D\u044B\u0439"] },
              { "attrId": 3, "attrName": "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043E\u0442\u0436\u0438\u043C\u0430", "attrVal": ["1200 \u043E\u0431/\u043C\u0438\u043D"] },
              { "attrId": 4, "attrName": "\u041C\u0438\u043D\u0438\u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0430", "attrVal": ["14 \u043C\u0438\u043D"] },
              { "attrId": 5, "attrName": "\u0417\u0430\u0449\u0438\u0442\u0430 \u043E\u0442 \u043F\u0440\u043E\u0442\u0435\u0447\u0435\u043A", "attrVal": ["\u0447\u0430\u0441\u0442\u0438\u0447\u043D\u0430\u044F"] },
              { "attrId": 6, "attrName": "\u0421\u0442\u0430\u0431\u0438\u043B\u0438\u0437\u0430\u0442\u043E\u0440 \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F", "attrVal": ["\u0434\u0430"] },
              { "attrId": 7, "attrName": "\u0421\u0442\u0438\u0440\u043A\u0430 \u0441 \u043F\u0430\u0440\u043E\u043C", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Candy"] }
            ]
          },
          {
            "id": 8,
            "brand": "Candy",
            "name": "\u0421\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 \u0441 \u0432\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u043E\u0439 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u043E\u0439 Candy CST G270L/1-07",
            "title": "\u041F\u0420\u0415\u0412\u041E\u0421\u0425\u041E\u0414\u041D\u042B\u0419 \u0420\u0415\u0417\u0423\u041B\u042C\u0422\u0410\u0422",
            "body": "\u0413\u0418 \u0432\u043E\u0442 \u044F \u0435\u0435 \u043D\u0430\u0448\u043B\u0430! \u0418\u0437\u0443\u0447\u0438\u0432 \u0445\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043A\u0438 \u044D\u0442\u043E\u0439 \u043C\u0430\u0448\u0438\u043D\u043A\u0438, \u044F \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u043B\u0430\u0441\u044C \u0437\u0430 \u043D\u0435\u0439 \u0432 \u043C\u0430\u0433\u0430\u0437\u0438\u043D, \u043E\u0446\u0435\u043D\u0438\u0442\u044C, \u0442\u0430\u043A \u0441\u043A\u0430\u0437\u0430\u0442\u044C, ",
            "price": "27 490",
            "imgSet": [
              "/goods/3_8_a.jpg",
              "/goods/3_8_b.jpg",
              "/goods/3_8_c.jpg",
              "/goods/3_8_d.jpg",
              "/goods/3_8_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430", "attrVal": ["7 \u043A\u0433"] },
              { "attrId": 2, "attrName": "\u041C\u043E\u0442\u043E\u0440", "attrVal": ["\u0438\u043D\u0432\u0435\u0440\u0442\u043E\u0440\u043D\u044B\u0439"] },
              { "attrId": 3, "attrName": "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043E\u0442\u0436\u0438\u043C\u0430", "attrVal": ["1200 \u043E\u0431/\u043C\u0438\u043D"] },
              { "attrId": 4, "attrName": "\u041C\u0438\u043D\u0438\u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0430", "attrVal": ["14 \u043C\u0438\u043D"] },
              { "attrId": 5, "attrName": "\u0417\u0430\u0449\u0438\u0442\u0430 \u043E\u0442 \u043F\u0440\u043E\u0442\u0435\u0447\u0435\u043A", "attrVal": ["\u0447\u0430\u0441\u0442\u0438\u0447\u043D\u0430\u044F"] },
              { "attrId": 6, "attrName": "\u0421\u0442\u0430\u0431\u0438\u043B\u0438\u0437\u0430\u0442\u043E\u0440 \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F", "attrVal": ["\u0434\u0430"] },
              { "attrId": 7, "attrName": "\u0421\u0442\u0438\u0440\u043A\u0430 \u0441 \u043F\u0430\u0440\u043E\u043C", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Candy"] }
            ]
          },
          {
            "id": 9,
            "brand": "V-Zug",
            "name": "\u0421\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 \u043F\u0440\u0435\u043C\u0438\u0443\u043C V-Zug AdoraWash AW6TWHCR",
            "title": "\u041F\u0420\u0415\u0412\u041E\u0421\u0425\u041E\u0414\u041D\u042B\u0419 \u0420\u0415\u0417\u0423\u041B\u042C\u0422\u0410\u0422",
            "body": "V-Zug AdoraWash AW6TWHCR \u2013 \u0441\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 \u043F\u0440\u0435\u043C\u0438\u0443\u043C-\u043A\u043B\u0430\u0441\u0441\u0430. \u041E\u043D\u0430 \u043E\u0431\u0435\u0441\u043F\u0435\u0447\u0438\u0432\u0430\u0435\u0442 \u043F\u0440\u0435\u0432\u043E\u0441\u0445\u043E\u0434\u043D\u044B\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u0441\u0442\u0438\u0440\u043A\u0438, \u0430 \u0444\u0443\u043D\u043A\u0446\u0438\u044F \u0440\u0430\u0437\u0433\u043B\u0430\u0436\u0438\u0432\u0430\u043D\u0438\u044F \u043F\u0430\u0440\u043E\u043C \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0441\u043F\u0440\u0430\u0432\u0438\u0442\u044C\u0441\u044F \u0441\u043E \u0441\u043A\u043B\u0430\u0434\u043A\u0430\u043C\u0438 \u0438 \u043E\u0431\u043E\u0439\u0442\u0438\u0441\u044C \u0431\u0435\u0437 \u0443\u0442\u044E\u0433\u0430.",
            "price": "535 990",
            "imgSet": [
              "/goods/3_9_a.jpg",
              "/goods/3_9_b.jpg",
              "/goods/3_8_c.jpg",
              "/goods/3_8_d.jpg",
              "/goods/3_8_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430", "attrVal": ["7 \u043A\u0433"] },
              { "attrId": 2, "attrName": "\u041C\u043E\u0442\u043E\u0440", "attrVal": ["\u0438\u043D\u0432\u0435\u0440\u0442\u043E\u0440\u043D\u044B\u0439"] },
              { "attrId": 3, "attrName": "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043E\u0442\u0436\u0438\u043C\u0430", "attrVal": ["1200 \u043E\u0431/\u043C\u0438\u043D"] },
              { "attrId": 4, "attrName": "\u041C\u0438\u043D\u0438\u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0430", "attrVal": ["14 \u043C\u0438\u043D"] },
              { "attrId": 5, "attrName": "\u0417\u0430\u0449\u0438\u0442\u0430 \u043E\u0442 \u043F\u0440\u043E\u0442\u0435\u0447\u0435\u043A", "attrVal": ["\u0447\u0430\u0441\u0442\u0438\u0447\u043D\u0430\u044F"] },
              { "attrId": 6, "attrName": "\u0421\u0442\u0430\u0431\u0438\u043B\u0438\u0437\u0430\u0442\u043E\u0440 \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F", "attrVal": ["\u0434\u0430"] },
              { "attrId": 7, "attrName": "\u0421\u0442\u0438\u0440\u043A\u0430 \u0441 \u043F\u0430\u0440\u043E\u043C", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["V-Zug"] }
            ]
          },
          {
            "id": 10,
            "brand": "Kuppersbusch",
            "name": "\u0421\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 \u043F\u0440\u0435\u043C\u0438\u0443\u043C Kuppersbusch WA1940.0CU3 (Titan Rock)",
            "title": "\u0421\u0422\u041E\u041F\u0420\u041E\u0426\u0415\u041D\u0422\u041D\u042B\u0419 \u041A\u041E\u041C\u0424\u041E\u0420\u0422",
            "body": "Kuppersbusch WA 1940.0 T \u2013 \u0441\u0442\u0438\u0440\u0430\u043B\u044C\u043D\u0430\u044F \u043C\u0430\u0448\u0438\u043D\u0430 \u0441 \u043F\u0440\u0435\u0434\u0435\u043B\u044C\u043D\u043E\u0439 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u043E\u0439 8 \u043A\u0433, \u043A\u043E\u0442\u043E\u0440\u0430\u044F \u043E\u0431\u0435\u0441\u043F\u0435\u0447\u0438\u0442 \u0432\u0430\u0448\u0435\u0439 \u043E\u0434\u0435\u0436\u0434\u0435 \u0438 \u0442\u0435\u043A\u0441\u0442\u0438\u043B\u044E \u0443\u0445\u043E\u0434 \u043F\u0440\u0435\u043C\u0438\u0443\u043C-\u043A\u043B\u0430\u0441\u0441\u0430. \u041F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u043C\u0430\u044F \u0432 \u0428\u0432\u0435\u0439\u0446\u0430\u0440\u0438\u0438 \u043C\u043E\u0434\u0435\u043B\u044C \u043E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u043D\u0435\u043F\u0440\u0435\u0432\u0437\u043E\u0439\u0434\u0451\u043D\u043D\u043E\u0439 \u043D\u0430\u0434\u0451\u0436\u043D\u043E\u0441\u0442\u044C\u044E, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u043F\u0440\u043E\u0441\u043B\u0443\u0436\u0438\u0442 \u0432\u0430\u043C \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E \u0434\u043E\u043B\u0433\u043E.",
            "price": "386 990",
            "imgSet": [
              "/goods/3_10_a.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430", "attrVal": ["7 \u043A\u0433"] },
              { "attrId": 2, "attrName": "\u041C\u043E\u0442\u043E\u0440", "attrVal": ["\u0438\u043D\u0432\u0435\u0440\u0442\u043E\u0440\u043D\u044B\u0439"] },
              { "attrId": 3, "attrName": "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043E\u0442\u0436\u0438\u043C\u0430", "attrVal": ["1200 \u043E\u0431/\u043C\u0438\u043D"] },
              { "attrId": 4, "attrName": "\u041C\u0438\u043D\u0438\u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0430", "attrVal": ["14 \u043C\u0438\u043D"] },
              { "attrId": 5, "attrName": "\u0417\u0430\u0449\u0438\u0442\u0430 \u043E\u0442 \u043F\u0440\u043E\u0442\u0435\u0447\u0435\u043A", "attrVal": ["\u0447\u0430\u0441\u0442\u0438\u0447\u043D\u0430\u044F"] },
              { "attrId": 6, "attrName": "\u0421\u0442\u0430\u0431\u0438\u043B\u0438\u0437\u0430\u0442\u043E\u0440 \u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u044F", "attrVal": ["\u0434\u0430"] },
              { "attrId": 7, "attrName": "\u0421\u0442\u0438\u0440\u043A\u0430 \u0441 \u043F\u0430\u0440\u043E\u043C", "attrVal": ["\u0414\u0430"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Kuppersbusch"] }
            ]
          }
        ]
      },
      {
        "id": 3,
        "catName": "\u0425\u043E\u043B\u043E\u0434\u0438\u043B\u044C\u043D\u0438\u043A\u0438",
        "catImg": "kitchen",
        "category": [
          {
            "id": 1,
            "brand": "Haier",
            "name": "\u0425\u043E\u043B\u043E\u0434\u0438\u043B\u044C\u043D\u0438\u043A Haier C2F637CWMV",
            "title": "Haier C2F637CWMV \u2013 \u044D\u043B\u0435\u0433\u0430\u043D\u0442\u043D\u044B\u0439 \u0438 \u0432\u043C\u0435\u0441\u0442\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0434\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0445\u043E\u043B\u043E\u0434\u0438\u043B\u044C\u043D\u0438\u043A \u0441 \u043D\u0438\u0436\u043D\u0438\u043C \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435\u043C \u043C\u043E\u0440\u043E\u0437\u0438\u043B\u044C\u043D\u043E\u0439 \u043A\u0430\u043C\u0435\u0440\u044B.",
            "body": "Haier C2F637CWMV \u2013 \u044D\u043B\u0435\u0433\u0430\u043D\u0442\u043D\u044B\u0439 \u0438 \u0432\u043C\u0435\u0441\u0442\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0434\u0432\u0443\u0445\u043A\u0430\u043C\u0435\u0440\u043D\u044B\u0439 \u0445\u043E\u043B\u043E\u0434\u0438\u043B\u044C\u043D\u0438\u043A \u0441 \u043D\u0438\u0436\u043D\u0438\u043C \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435\u043C \u043C\u043E\u0440\u043E\u0437\u0438\u043B\u044C\u043D\u043E\u0439 \u043A\u0430\u043C\u0435\u0440\u044B. \u041F\u044F\u0442\u044C \u043F\u043E\u043B\u043E\u043A \u0438 \xAB\u0441\u0443\u0445\u0430\u044F\xBB \u0437\u043E\u043D\u0430 \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u0438 \u0432 \u0445\u043E\u043B\u043E\u0434\u0438\u043B\u044C\u043D\u043E\u043C \u043E\u0442\u0434\u0435\u043B\u0435\u043D\u0438\u0438, \u0430 \u0442\u0430\u043A\u0436\u0435 \u0447\u0435\u0442\u044B\u0440\u0435 \u044F\u0449\u0438\u043A\u0430 \u0432 \u043C\u043E\u0440\u043E\u0437\u0438\u043B\u044C\u043D\u0438\u043A\u0435 \u0434\u0430\u044E\u0442 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0440\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u044B \u0442\u0430\u043A, \u043A\u0430\u043A \u043F\u043E\u0436\u0435\u043B\u0430\u044E\u0442 \u0445\u043E\u0437\u044F\u0435\u0432\u0430. \u0412 \u0445\u043E\u043B\u043E\u0434\u0438\u043B\u044C\u043D\u043E\u043C \u0438 \u043C\u043E\u0440\u043E\u0437\u0438\u043B\u044C\u043D\u043E\u043C \u043E\u0442\u0434\u0435\u043B\u0435\u043D\u0438\u044F\u0445 \u044D\u0442\u043E\u0439 \u043C\u043E\u0434\u0435\u043B\u0438 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u0441\u0438\u0441\u0442\u0435\u043C\u0430 No Frost. \u0411\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u044F \u044D\u0442\u043E\u043C\u0443 \u0445\u043E\u0437\u044F\u0435\u0432\u0430\u043C \u043D\u0435 \u043D\u0443\u0436\u043D\u043E \u0434\u0443\u043C\u0430\u0442\u044C \u043E \u0440\u0430\u0437\u043C\u043E\u0440\u043E\u0437\u043A\u0435, \u0432\u0441\u0451 \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438. \u041F\u043E \u043A\u0430\u043C\u0435\u0440\u0430\u043C \u0445\u043E\u043B\u043E\u0434\u0438\u043B\u044C\u043D\u0438\u043A\u0430 \u0446\u0438\u0440\u043A\u0443\u043B\u0438\u0440\u0443\u0435\u0442 \u043E\u0445\u043B\u0430\u0436\u0434\u0451\u043D\u043D\u044B\u0439 \u0432\u043E\u0437\u0434\u0443\u0445, \u043F\u0440\u0435\u043F\u044F\u0442\u0441\u0442\u0432\u0443\u044F \u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u044E \u043D\u0430\u043B\u0435\u0434\u0438 \u043D\u0430 \u0441\u0442\u0435\u043D\u043A\u0430\u0445.",
            "price": "64999",
            "imgSet": [
              "/goods/4_1_a.jpg",
              "/goods/4_1_b.jpg",
              "/goods/4_1_c.jpg",
              "/goods/4_1_d.jpg",
              "/goods/4_1_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0422\u0438\u043F \u043A\u043E\u043C\u043F\u0440\u0435\u0441\u0441\u043E\u0440\u0430", "attrVal": ["\u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u041E\u0431\u0449\u0438\u0439 \u043E\u0431\u044A\u0435\u043C", "attrVal": ["386 \u043B"] },
              { "attrId": 3, "attrName": "\u0421\u0438\u0441\u0442\u0435\u043C\u0430 No Frost", "attrVal": ["\u0432 \u0445\u043E\u043B\u043E\u0434\u0438\u043B\u044C\u043D\u043E\u043C \u0438 \u043C\u043E\u0440\u043E\u0437\u0438\u043B\u044C\u043D\u043E\u043C \u043E\u0442\u0434\u0435\u043B\u0435\u043D\u0438\u044F\u0445"] },
              { "attrId": 4, "attrName": "\u0420\u0430\u0437\u043C. \u043C\u043E\u0440\u043E\u0437. \u043A\u0430\u043C\u0435\u0440\u044B", "attrVal": ["\u0430\u0432\u0442\u043E\u043C\u0430\u0442"] },
              { "attrId": 5, "attrName": "\u0420\u0430\u0437\u043C. \u0445\u043E\u043B\u043E\u0434. \u043A\u0430\u043C\u0435\u0440\u044B", "attrVal": ["\u0430\u0432\u0442\u043E\u043C\u0430\u0442"] },
              { "attrId": 6, "attrName": "\u0420\u0435\u0433\u0443\u043B\u0438\u0440\u0443\u0435\u043C\u044B\u0445 \u043F\u043E\u043B\u043E\u043A", "attrVal": ["3"] },
              { "attrId": 7, "attrName": "\u0422\u0438\u043F \u0437\u043E\u043D\u044B \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u0438", "attrVal": ["\u0412\u043B\u0430\u0436\u043D\u0430\u044F"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Haier"] }
            ]
          },
          {
            "id": 2,
            "brand": "LG",
            "name": "\u0425\u043E\u043B\u043E\u0434\u0438\u043B\u044C\u043D\u0438\u043A LG DoorCooling+ GA-B459SMUM",
            "title": "\u0417\u041E\u041D\u0410 \u0421\u0412\u0415\u0416\u0415\u0421\u0422\u0418 FreshBalancer",
            "body": "\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u044F DoorCooling+ \u043E\u0431\u0435\u0441\u043F\u0435\u0447\u0438\u0432\u0430\u0435\u0442 \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043E\u0445\u043B\u0430\u0436\u0434\u0435\u043D\u0438\u0435 \u0438\u0437 \u043F\u0430\u043D\u0435\u043B\u0438 \u0432 \u0432\u0435\u0440\u0445\u043D\u0435\u0439 \u0447\u0430\u0441\u0442\u0438 \u043A\u043E\u0440\u043F\u0443\u0441\u0430. \u041E\u043D\u043E \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u0435\u0442\u0441\u044F \u043D\u0430 32% \u0431\u044B\u0441\u0442\u0440\u0435\u0435, \u0447\u0435\u043C \u0432 \u043C\u043E\u0434\u0435\u043B\u044F\u0445 \u0431\u0435\u0437 \u044D\u0442\u043E\u0439 \u0441\u0438\u0441\u0442\u0435\u043C\u044B. \u0417\u0430 \u0441\u0447\u0451\u0442 \u044D\u0442\u043E\u0433\u043E \u043D\u0430 \u0432\u0441\u0435\u0445 \u043F\u043E\u043B\u043A\u0430\u0445, \u0432 \u0442\u043E\u043C \u0447\u0438\u0441\u043B\u0435 \u043D\u0430 \u0442\u0435\u0445, \u0447\u0442\u043E \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u044B \u0432 \u0434\u0432\u0435\u0440\u0438, \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u0430\u044F \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430.",
            "price": "39999",
            "imgSet": [
              "/goods/4_2_a.jpg",
              "/goods/4_2_b.jpg",
              "/goods/4_2_c.jpg",
              "/goods/4_2_d.jpg",
              "/goods/4_2_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0422\u0438\u043F \u043A\u043E\u043C\u043F\u0440\u0435\u0441\u0441\u043E\u0440\u0430", "attrVal": ["\u0438\u043D\u0432\u0435\u0440\u0442\u043E\u0440\u043D\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u041E\u0431\u0449\u0438\u0439 \u043E\u0431\u044A\u0435\u043C", "attrVal": ["220 \u043B"] },
              { "attrId": 3, "attrName": "\u0421\u0438\u0441\u0442\u0435\u043C\u0430 No Frost", "attrVal": ["\u0432 \u0445\u043E\u043B\u043E\u0434\u0438\u043B\u044C\u043D\u043E\u043C \u0438 \u043C\u043E\u0440\u043E\u0437\u0438\u043B\u044C\u043D\u043E\u043C \u043E\u0442\u0434\u0435\u043B\u0435\u043D\u0438\u044F\u0445"] },
              { "attrId": 4, "attrName": "\u0420\u0430\u0437\u043C. \u043C\u043E\u0440\u043E\u0437. \u043A\u0430\u043C\u0435\u0440\u044B", "attrVal": ["\u0430\u0432\u0442\u043E\u043C\u0430\u0442"] },
              { "attrId": 5, "attrName": "\u0420\u0430\u0437\u043C. \u0445\u043E\u043B\u043E\u0434. \u043A\u0430\u043C\u0435\u0440\u044B", "attrVal": ["\u0430\u0432\u0442\u043E\u043C\u0430\u0442"] },
              { "attrId": 6, "attrName": "\u0420\u0435\u0433\u0443\u043B\u0438\u0440\u0443\u0435\u043C\u044B\u0445 \u043F\u043E\u043B\u043E\u043A", "attrVal": ["3"] },
              { "attrId": 7, "attrName": "\u0422\u0438\u043F \u0437\u043E\u043D\u044B \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u0438", "attrVal": ["\u0412\u043B\u0430\u0436\u043D\u0430\u044F"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["LG"] }
            ]
          },
          {
            "id": 3,
            "brand": "Bosch",
            "name": "\u0425\u043E\u043B\u043E\u0434\u0438\u043B\u044C\u043D\u0438\u043A Bosch Serie | 2 VitaFresh KGN39UW22R",
            "title": "\u041E\u0411\u041E\u0421\u041E\u0411\u041B\u0415\u041D\u041D\u042B\u0419 \u041A\u041E\u041D\u0422\u0420\u041E\u041B\u042C",
            "body": "\u041C\u043E\u0434\u0435\u043B\u044C \u0441 \u0434\u0432\u0443\u0445\u043A\u043E\u043D\u0442\u0443\u0440\u043D\u043E\u0439 \u043C\u043E\u0434\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u0435\u0439 \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0432\u044B\u0441\u0442\u0430\u0432\u043B\u044F\u0442\u044C \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0432 \u043A\u0430\u0436\u0434\u043E\u043C \u0438\u0437 \u043E\u0442\u0434\u0435\u043B\u0435\u043D\u0438\u0439. \u041D\u0430 \u043F\u0430\u043D\u0435\u043B\u0438 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u044B \u043A\u043D\u043E\u043F\u043A\u0438 \u0434\u043B\u044F \u0432\u044B\u0431\u043E\u0440\u0430 \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u044B, \u0430\u043A\u0442\u0438\u0432\u0430\u0446\u0438\u0438 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0445 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C \u0438 \u044F\u0440\u043A\u0438\u0435 \u0438\u043D\u0434\u0438\u043A\u0430\u0442\u043E\u0440\u044B. \u0420\u0430\u0437\u043E\u0431\u0440\u0430\u0442\u044C\u0441\u044F \u0441 \u0442\u0435\u043C, \u0447\u0442\u043E \u0438 \u043A\u043E\u0433\u0434\u0430 \u043D\u0430\u0436\u0438\u043C\u0430\u0442\u044C, \u043D\u0435 \u0441\u043E\u0441\u0442\u0430\u0432\u0438\u0442 \u0442\u0440\u0443\u0434\u0430, \u043F\u043E\u0441\u043A\u043E\u043B\u044C\u043A\u0443 \u0432\u0441\u0435 \u043A\u043B\u0430\u0432\u0438\u0448\u0438 \u0441\u043D\u0430\u0431\u0436\u0435\u043D\u044B \u043B\u0430\u043A\u043E\u043D\u0438\u0447\u043D\u044B\u043C\u0438 \u043D\u0430\u0434\u043F\u0438\u0441\u044F\u043C\u0438.",
            "price": "47999",
            "imgSet": [
              "/goods/4_3_a.jpg",
              "/goods/4_3_b.jpg",
              "/goods/4_3_c.jpg",
              "/goods/4_3_d.jpg",
              "/goods/4_3_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0422\u0438\u043F \u043A\u043E\u043C\u043F\u0440\u0435\u0441\u0441\u043E\u0440\u0430", "attrVal": ["\u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u041E\u0431\u0449\u0438\u0439 \u043E\u0431\u044A\u0435\u043C", "attrVal": ["419 \u043B"] },
              { "attrId": 3, "attrName": "\u0421\u0438\u0441\u0442\u0435\u043C\u0430 No Frost", "attrVal": ["\u0432 \u0445\u043E\u043B\u043E\u0434\u0438\u043B\u044C\u043D\u043E\u043C \u0438 \u043C\u043E\u0440\u043E\u0437\u0438\u043B\u044C\u043D\u043E\u043C \u043E\u0442\u0434\u0435\u043B\u0435\u043D\u0438\u044F\u0445"] },
              { "attrId": 4, "attrName": "\u0420\u0430\u0437\u043C. \u043C\u043E\u0440\u043E\u0437. \u043A\u0430\u043C\u0435\u0440\u044B", "attrVal": ["\u0430\u0432\u0442\u043E\u043C\u0430\u0442"] },
              { "attrId": 5, "attrName": "\u0420\u0430\u0437\u043C. \u0445\u043E\u043B\u043E\u0434. \u043A\u0430\u043C\u0435\u0440\u044B", "attrVal": ["\u0430\u0432\u0442\u043E\u043C\u0430\u0442"] },
              { "attrId": 6, "attrName": "\u0420\u0435\u0433\u0443\u043B\u0438\u0440\u0443\u0435\u043C\u044B\u0445 \u043F\u043E\u043B\u043E\u043A", "attrVal": ["3"] },
              { "attrId": 7, "attrName": "\u0422\u0438\u043F \u0437\u043E\u043D\u044B \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u0438", "attrVal": ["\u0412\u043B\u0430\u0436\u043D\u0430\u044F"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Bosch"] }
            ]
          },
          {
            "id": 4,
            "brand": "Samsung",
            "name": "\u0425\u043E\u043B\u043E\u0434\u0438\u043B\u044C\u043D\u0438\u043A Bosch Serie | 2 VitaFresh KGN39UWR",
            "title": "\u0411\u0435\u0437 \u0445\u043B\u043E\u043F\u043E\u0442",
            "body": "\u041E\u0431\u0449\u0438\u0439 \u043E\u0431\u044A\u0451\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430 \u2013 617\u043B\u0438\u0442\u0440\u043E\u0432, \u0438\u0437 \u043D\u0438\u0445 202 \u043B\u0438\u0442\u0440\u0430 \u043F\u0440\u0438\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u043D\u0430 \u043C\u043E\u0440\u043E\u0437\u0438\u043B\u044C\u043D\u0443\u044E \u043A\u0430\u043C\u0435\u0440\u0443. \u0422\u0430\u043A\u043E\u0439 \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0432\u043C\u0435\u0441\u0442\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u0438 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0434\u043E\u0441\u0442\u0438\u0447\u044C \u043F\u0440\u0438 \u043F\u043E\u043C\u043E\u0449\u0438 \u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0438 SpaceMax: \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0430 \u043E\u0441\u043E\u0431\u0430\u044F \u0442\u043E\u043D\u043A\u0430\u044F \u0442\u0435\u0440\u043C\u043E\u0438\u0437\u043E\u043B\u044F\u0446\u0438\u044F, \u043A\u043E\u0442\u043E\u0440\u0430\u044F, \u043D\u0435\u0441\u043C\u043E\u0442\u0440\u044F \u043D\u0430 \u043A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u043E\u0441\u0442\u044C, \u043D\u0435 \u0441\u043D\u0438\u0436\u0430\u0435\u0442 \u044D\u0444\u0444\u0435\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u044B. \u0410 \u043F\u043E\u0432\u044B\u0448\u0430\u0435\u0442 \u0435\u0451 \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u0438\u0432\u043D\u043E\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u0435 Metal Cooling: \u043D\u0430 \u0437\u0430\u0434\u043D\u0435\u0439 \u0441\u0442\u0435\u043D\u043A\u0435 \u043E\u0442\u0434\u0435\u043B\u0435\u043D\u0438\u0439 \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0430 \u0441\u0442\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u043B\u0430\u0441\u0442\u0438\u043D\u0430. \u041E\u043D\u0430 \u0441\u043F\u043E\u0441\u043E\u0431\u0441\u0442\u0432\u0443\u0435\u0442 \u0443\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u044E \u0445\u043E\u043B\u043E\u0434\u0430 \u0438 \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043C\u0438\u043A\u0440\u043E\u043A\u043B\u0438\u043C\u0430\u0442 \u043F\u043E\u0441\u043B\u0435 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u043D\u0438\u044F \u0434\u0432\u0435\u0440\u0435\u0439.",
            "price": "97499",
            "imgSet": [
              "/goods/4_3_a.jpg",
              "/goods/4_3_b.jpg",
              "/goods/4_3_c.jpg",
              "/goods/4_3_d.jpg",
              "/goods/4_3_e.jpg"
            ],
            "favorite": false,
            "isActive": false,
            "attributes": [
              { "attrId": 1, "attrName": "\u0422\u0438\u043F \u043A\u043E\u043C\u043F\u0440\u0435\u0441\u0441\u043E\u0440\u0430", "attrVal": ["\u0438\u043D\u0432\u0435\u0440\u0442\u043E\u0440\u043D\u044B\u0439"] },
              { "attrId": 2, "attrName": "\u041E\u0431\u0449\u0438\u0439 \u043E\u0431\u044A\u0435\u043C", "attrVal": ["617 \u043B"] },
              { "attrId": 3, "attrName": "\u0421\u0438\u0441\u0442\u0435\u043C\u0430 No Frost", "attrVal": ["\u0432 \u0445\u043E\u043B\u043E\u0434\u0438\u043B\u044C\u043D\u043E\u043C \u0438 \u043C\u043E\u0440\u043E\u0437\u0438\u043B\u044C\u043D\u043E\u043C \u043E\u0442\u0434\u0435\u043B\u0435\u043D\u0438\u044F\u0445"] },
              { "attrId": 4, "attrName": "\u0420\u0430\u0437\u043C. \u043C\u043E\u0440\u043E\u0437. \u043A\u0430\u043C\u0435\u0440\u044B", "attrVal": ["\u0430\u0432\u0442\u043E\u043C\u0430\u0442"] },
              { "attrId": 5, "attrName": "\u0420\u0430\u0437\u043C. \u0445\u043E\u043B\u043E\u0434. \u043A\u0430\u043C\u0435\u0440\u044B", "attrVal": ["\u0430\u0432\u0442\u043E\u043C\u0430\u0442"] },
              { "attrId": 6, "attrName": "\u0418\u043D\u0434\u0438\u043A\u0430\u0446\u0438\u044F \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u044B \u0432 \u0445\u043E\u043B\u043E\u0434\u0438\u043B\u044C\u043D\u043E\u0439 \u043A\u0430\u043C\u0435\u0440\u0435", "attrVal": ["\u0434\u0430"] },
              { "attrId": 7, "attrName": "\u0422\u0438\u043F \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F", "attrVal": ["\u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u044B\u0439"] },
              { "attrId": 8, "attrName": "\u0431\u0440\u0435\u043D\u0434", "attrVal": ["Samsung"] }
            ]
          }
        ]
      },
      {
        "id": 4,
        "catName": "\u0418\u0433\u0440\u044B \u0438 \u0440\u0430\u0437\u0432\u043B\u0435\u0447\u0435\u043D\u0438\u044F",
        "catImg": "sports_esports"
      },
      {
        "id": 5,
        "catName": "\u0422\u0435\u0445\u043D\u0438\u043A\u0430 \u0434\u043B\u044F \u043A\u0443\u0445\u043D\u0438",
        "catImg": "blender"
      }
    ]
  };
}
var jsondata = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get
});
var css$F = {
  code: ".catalog.svelte-vq363s.svelte-vq363s{grid-area:catalog;background:var(--main-theme-color);color:#fff;transition:var(--transition-timing);cursor:pointer;font-size:1.125rem;padding:12px 24px;font-weight:500;display:flex;align-items:center;justify-content:center}.catalog.svelte-vq363s span.svelte-vq363s{margin-right:1.5rem;color:#fff}.catalog.svelte-vq363s.svelte-vq363s:hover{background:var(--main-hover-color)}@media(max-width: 992px){.text.svelte-vq363s.svelte-vq363s{display:none}.catalog.svelte-vq363s span.svelte-vq363s{color:#fff;margin:0}}",
  map: '{"version":3,"file":"Header\u0421atalog.svelte","sources":["Header\u0421atalog.svelte"],"sourcesContent":["<script>\\r\\n    export let modalToggle;\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"catalog\\" on:click={modalToggle}>\\r\\n    <span class=\\"material-icons-outlined\\">menu</span>\\r\\n    <span class=\\"text\\">\u041A\u0430\u0442\u0430\u043B\u043E\u0433</span>\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .catalog {\\r\\n        grid-area: catalog;\\r\\n\\r\\n        background: var(--main-theme-color);\\r\\n        color: #fff;\\r\\n        transition: var(--transition-timing);\\r\\n        cursor: pointer;\\r\\n        font-size: 1.125rem;\\r\\n        padding: 12px 24px;\\r\\n        font-weight: 500;\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: center;\\r\\n    }\\r\\n\\r\\n    .catalog span {\\r\\n        margin-right: 1.5rem;\\r\\n        color: #fff;\\r\\n    }\\r\\n\\r\\n    .catalog:hover {\\r\\n        background: var(--main-hover-color);\\r\\n    }\\r\\n\\r\\n    @media (max-width: 992px) {\\r\\n        .text {\\r\\n            display: none;\\r\\n        }\\r\\n        .catalog span {\\r\\n            color: #fff;\\r\\n            margin: 0;\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAUI,QAAQ,4BAAC,CAAC,AACN,SAAS,CAAE,OAAO,CAElB,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,IAAI,mBAAmB,CAAC,CACpC,MAAM,CAAE,OAAO,CACf,SAAS,CAAE,QAAQ,CACnB,OAAO,CAAE,IAAI,CAAC,IAAI,CAClB,WAAW,CAAE,GAAG,CAChB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,AAC3B,CAAC,AAED,sBAAQ,CAAC,IAAI,cAAC,CAAC,AACX,YAAY,CAAE,MAAM,CACpB,KAAK,CAAE,IAAI,AACf,CAAC,AAED,oCAAQ,MAAM,AAAC,CAAC,AACZ,UAAU,CAAE,IAAI,kBAAkB,CAAC,AACvC,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,KAAK,4BAAC,CAAC,AACH,OAAO,CAAE,IAAI,AACjB,CAAC,AACD,sBAAQ,CAAC,IAAI,cAAC,CAAC,AACX,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,CAAC,AACb,CAAC,AACL,CAAC"}'
};
var HeaderuD0uA1atalog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { modalToggle } = $$props;
  if ($$props.modalToggle === void 0 && $$bindings.modalToggle && modalToggle !== void 0)
    $$bindings.modalToggle(modalToggle);
  $$result.css.add(css$F);
  return `<div class="${"catalog svelte-vq363s"}"><span class="${"material-icons-outlined svelte-vq363s"}">menu</span>
    <span class="${"text svelte-vq363s"}">\u041A\u0430\u0442\u0430\u043B\u043E\u0433</span>
</div>`;
});
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
var favoriteCollection = writable([]);
var cartCollection = writable([]);
var promocodeState = writable(false);
var orderStore = writable({});
var css$E = {
  code: ".icon_container.svelte-1esr21c{position:relative}.counter.svelte-1esr21c{background:var(--main-theme-color);color:var(--main-bg-color);font-size:0.6rem;font-weight:600;display:flex;align-items:center;justify-content:center;min-width:14px;height:14px;padding:0 3px;position:absolute;top:50%;right:0}.options.svelte-1esr21c{display:flex;grid-area:controls;height:100%}.control.svelte-1esr21c{display:flex;flex-direction:column;justify-content:space-between;align-items:center;color:var(--main-text-color);height:100%;position:relative}.text.svelte-1esr21c{transition:.2s}.favorite.svelte-1esr21c,.cart.svelte-1esr21c{margin-left:1.25rem}@media(max-width: 992px){.text.svelte-1esr21c{display:none}.options.svelte-1esr21c{margin-right:0.5rem}}",
  map: `{"version":3,"file":"HeaderOptions.svelte","sources":["HeaderOptions.svelte"],"sourcesContent":["<script>\\r\\n    import { favoriteCollection } from '../../stores/favoriteStore';\\r\\n    import { cartCollection } from '../../stores/cart';\\r\\n\\r\\n    $: cartCollectionCounter = () => {\\r\\n        let sum;\\r\\n        if($cartCollection.length > 0) {\\r\\n            sum = $cartCollection.reduce((acc, el) => acc + parseFloat(el.cartCounter), 0);\\r\\n        }\\r\\n        return sum;\\r\\n    }\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"options\\">\\r\\n    <div class=\\"profile\\">\\r\\n        <a href=\\"/profile\\" class=\\"control\\">\\r\\n            <span class=\\"material-icons-outlined\\">face</span>\\r\\n            <span class=\\"text\\">\u041F\u0440\u043E\u0444\u0438\u043B\u044C</span>\\r\\n        </a>\\r\\n    </div>\\r\\n    <div class=\\"favorite\\">\\r\\n        <a href=\\"/favorite\\" class=\\"control\\">\\r\\n            <div class=\\"icon_container\\">\\r\\n                <span class=\\"material-icons-outlined\\">favorite_border</span>\\r\\n                {#if $favoriteCollection.length}\\r\\n                    <span class=\\"counter\\">{$favoriteCollection.length}</span>\\r\\n                {/if}\\r\\n            </div>\\r\\n            <span class=\\"text\\">\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435</span>\\r\\n        </a>\\r\\n    </div>\\r\\n    <div class=\\"cart\\">\\r\\n        <a href=\\"/cart\\" class=\\"control\\">\\r\\n            <div class=\\"icon_container\\">\\r\\n                <span class=\\"material-icons-outlined\\">shopping_cart</span>\\r\\n                {#if $cartCollection.length}\\r\\n                    <span class=\\"counter\\">{cartCollectionCounter()}</span>\\r\\n                {/if}\\r\\n            </div>\\r\\n            <span class=\\"text\\">\u041A\u043E\u0440\u0437\u0438\u043D\u0430</span>\\r\\n        </a>\\r\\n    </div>\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n\\r\\n    .icon_container {\\r\\n        position: relative;\\r\\n    }\\r\\n    .counter {\\r\\n        background: var(--main-theme-color);\\r\\n        color: var(--main-bg-color);\\r\\n        font-size: 0.6rem;\\r\\n        font-weight: 600;\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: center;\\r\\n        min-width: 14px;\\r\\n        height: 14px;\\r\\n        padding: 0 3px;\\r\\n\\r\\n        position: absolute;\\r\\n        top: 50%;\\r\\n        right: 0;\\r\\n    }\\r\\n\\r\\n    .options {\\r\\n        display: flex;\\r\\n        grid-area: controls;\\r\\n        height: 100%;\\r\\n    }\\r\\n\\r\\n    .control {\\r\\n        display: flex;\\r\\n        flex-direction: column;\\r\\n        justify-content: space-between;\\r\\n        align-items: center;\\r\\n        color: var(--main-text-color);\\r\\n        height: 100%;\\r\\n        position: relative;\\r\\n    }\\r\\n\\r\\n    .text {\\r\\n        transition: .2s;\\r\\n    }\\r\\n\\r\\n    .favorite, .cart {\\r\\n        margin-left: 1.25rem;\\r\\n    }\\r\\n\\r\\n    @media (max-width: 992px) {\\r\\n        .text {\\r\\n            display: none;\\r\\n        }\\r\\n\\r\\n        .options {\\r\\n            margin-right: 0.5rem;\\r\\n        }\\r\\n    }\\r\\n    \\r\\n</style>"],"names":[],"mappings":"AA8CI,eAAe,eAAC,CAAC,AACb,QAAQ,CAAE,QAAQ,AACtB,CAAC,AACD,QAAQ,eAAC,CAAC,AACN,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,KAAK,CAAE,IAAI,eAAe,CAAC,CAC3B,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,CAAC,CAAC,GAAG,CAEd,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,GAAG,CACR,KAAK,CAAE,CAAC,AACZ,CAAC,AAED,QAAQ,eAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,QAAQ,CACnB,MAAM,CAAE,IAAI,AAChB,CAAC,AAED,QAAQ,eAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,IAAI,iBAAiB,CAAC,CAC7B,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,QAAQ,AACtB,CAAC,AAED,KAAK,eAAC,CAAC,AACH,UAAU,CAAE,GAAG,AACnB,CAAC,AAED,wBAAS,CAAE,KAAK,eAAC,CAAC,AACd,WAAW,CAAE,OAAO,AACxB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,KAAK,eAAC,CAAC,AACH,OAAO,CAAE,IAAI,AACjB,CAAC,AAED,QAAQ,eAAC,CAAC,AACN,YAAY,CAAE,MAAM,AACxB,CAAC,AACL,CAAC"}`
};
var HeaderOptions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cartCollectionCounter;
  let $cartCollection, $$unsubscribe_cartCollection;
  let $favoriteCollection, $$unsubscribe_favoriteCollection;
  $$unsubscribe_cartCollection = subscribe(cartCollection, (value) => $cartCollection = value);
  $$unsubscribe_favoriteCollection = subscribe(favoriteCollection, (value) => $favoriteCollection = value);
  $$result.css.add(css$E);
  cartCollectionCounter = () => {
    let sum;
    if ($cartCollection.length > 0) {
      sum = $cartCollection.reduce((acc, el) => acc + parseFloat(el.cartCounter), 0);
    }
    return sum;
  };
  $$unsubscribe_cartCollection();
  $$unsubscribe_favoriteCollection();
  return `<div class="${"options svelte-1esr21c"}"><div class="${"profile"}"><a href="${"/profile"}" class="${"control svelte-1esr21c"}"><span class="${"material-icons-outlined"}">face</span>
            <span class="${"text svelte-1esr21c"}">\u041F\u0440\u043E\u0444\u0438\u043B\u044C</span></a></div>
    <div class="${"favorite svelte-1esr21c"}"><a href="${"/favorite"}" class="${"control svelte-1esr21c"}"><div class="${"icon_container svelte-1esr21c"}"><span class="${"material-icons-outlined"}">favorite_border</span>
                ${$favoriteCollection.length ? `<span class="${"counter svelte-1esr21c"}">${escape($favoriteCollection.length)}</span>` : ``}</div>
            <span class="${"text svelte-1esr21c"}">\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435</span></a></div>
    <div class="${"cart svelte-1esr21c"}"><a href="${"/cart"}" class="${"control svelte-1esr21c"}"><div class="${"icon_container svelte-1esr21c"}"><span class="${"material-icons-outlined"}">shopping_cart</span>
                ${$cartCollection.length ? `<span class="${"counter svelte-1esr21c"}">${escape(cartCollectionCounter())}</span>` : ``}</div>
            <span class="${"text svelte-1esr21c"}">\u041A\u043E\u0440\u0437\u0438\u043D\u0430</span></a></div>
</div>`;
});
var Model = class {
  async _getAllItems() {
    const resolve2 = await fetch("http://localhost:3000/api/jsondata");
    const result = await resolve2.json();
    const data = result.map((cat) => {
      return {
        id: cat.id,
        catName: cat.catName,
        catImg: cat.catImg,
        category: cat.category ? cat.category.map((item) => {
          return {
            id: item.id,
            brand: item.brand,
            name: item.name,
            title: item.title,
            body: item.body,
            price: parseFloat(item.price.replace(/\s/g, "")),
            imgSet: item.imgSet,
            favorite: item.favorite,
            isActive: item.isActive,
            attributes: item.attributes
          };
        }) : []
      };
    });
    return data;
  }
  async getCategoryItem(id, sortVal, filterCollection, prices) {
    const resolve2 = await this._getAllItems();
    const result = await resolve2[id];
    if (sortVal)
      this._sortByPrice(sortVal, result);
    if (filterCollection !== void 0)
      this._filterByConditions(result, filterCollection);
    if (prices)
      this._filterByPriceValue(result, prices);
    return result;
  }
  async getSingleItem(categoryId, itemId) {
    const resolve2 = await this.getCategoryItem(categoryId);
    return resolve2.category[itemId - 1];
  }
  async searchResults(inputText) {
    const resolve2 = await this._getAllItems();
    let goodsNames = [];
    resolve2.forEach((cat) => {
      cat.category.forEach((el) => {
        let mappedObj = { "categoryId": cat.id, ...el };
        goodsNames.push(mappedObj);
      });
    });
    goodsNames = goodsNames.filter((el) => el.name.toLowerCase().includes(inputText.toLowerCase()));
    if (goodsNames.length === 0)
      return goodsNames = [];
    return goodsNames;
  }
  _filterByPriceValue(categoryItem, pricesArr) {
    categoryItem.category = categoryItem.category.filter((el) => {
      return el.price >= pricesArr[0] && el.price <= pricesArr[1];
    });
    return categoryItem;
  }
  getMinPrice(prices) {
    return Math.min(...prices.category.map((a) => a.price));
  }
  getMaxPrice(prices) {
    return Math.max(...prices.category.map((a) => a.price));
  }
  _filterByConditions(categoryItems, filtersArr) {
    if (!filtersArr)
      return categoryItems;
    function getQuery(filtersArr2) {
      let descriptions = [];
      for (let key in filtersArr2) {
        if (filtersArr2[key] === void 0 && filtersArr2[key] === [])
          continue;
        descriptions.push((product) => product.attributes.some((a) => a.attrName === key && filtersArr2[key].every((v) => a.attrVal.includes(v))));
      }
      return (product) => descriptions.every((b) => b(product));
    }
    let query = getQuery(filtersArr);
    categoryItems.category = categoryItems.category.filter((b) => query(b));
    return categoryItems;
  }
  _sortByPrice(val, categoryItems) {
    if (!val)
      return categoryItems;
    if (val === "price_desc")
      categoryItems.category = categoryItems.category.sort((a, b) => a.price - b.price);
    if (val === "price_asc")
      categoryItems.category = categoryItems.category.sort((a, b) => b.price - a.price);
    return categoryItems;
  }
  getFilterList(outerArr, innerArr) {
    innerArr.forEach((cat) => {
      cat.attributes.forEach((attrEl) => {
        attrEl.attrVal.forEach((attrElVal) => {
          const key = attrEl.attrName;
          if (outerArr[key] == void 0)
            outerArr[key] = [];
          if (!outerArr[key].includes(attrElVal))
            outerArr[key].push(attrElVal);
        });
      });
    });
    return Object.entries(outerArr);
  }
  fillFiltersParameters(arr, val, name) {
    if (arr[name] == void 0)
      arr[name] = [];
    if (arr[name].includes(val)) {
      arr[name] = arr[name].filter((el) => el != val);
    } else {
      arr[name].push(val);
    }
    return arr;
  }
  getInitialCheckboxesState(filterCollection, attrName, attrValue) {
    return filterCollection[attrName] === void 0 ? false : filterCollection[attrName].includes(attrValue);
  }
};
var css$D = {
  code: ".loader-box.svelte-15ep33z{width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:fixed;left:0;top:0}.loader.svelte-15ep33z{width:50px;height:50px;border-radius:50%;margin:3em;display:inline-block;position:relative;vertical-align:middle}.loader.svelte-15ep33z,.loader.svelte-15ep33z:before,.loader.svelte-15ep33z:after{animation:1s infinite ease-in-out}.loader.svelte-15ep33z:before,.loader.svelte-15ep33z:after{width:100%;height:100%;border-radius:50%;position:absolute;top:0;left:0}.loader-8.svelte-15ep33z:before,.loader-8.svelte-15ep33z:after{content:'';background-color:var(--main-theme-color);transform:scale(0);animation:svelte-15ep33z-loader8 1.5s infinite ease-in-out}.loader-8.svelte-15ep33z:after{animation-delay:0.75s}@keyframes svelte-15ep33z-loader8{0%{transform:translateX(-100%) scale(0)}50%{transform:translateX(0%) scale(1)}100%{transform:translateX(100%) scale(0)}}",
  map: `{"version":3,"file":"Loader.svelte","sources":["Loader.svelte"],"sourcesContent":["<div class=\\"loader-box\\">\\r\\n    <div class=\\"loader loader-8\\" />\\r\\n</div>\\r\\n\\r\\n\\r\\n<style>\\r\\n    .loader-box {\\r\\n        width: 100%;\\r\\n        height: 100%;\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: center;\\r\\n        position: fixed;\\r\\n        left: 0;\\r\\n        top: 0;\\r\\n    }\\r\\n\\r\\n\\t.loader {\\r\\n\\t\\twidth: 50px;\\r\\n\\t\\theight: 50px;\\r\\n\\t\\tborder-radius: 50%;\\r\\n\\t\\tmargin: 3em;\\r\\n\\t\\tdisplay: inline-block;\\r\\n\\t\\tposition: relative;\\r\\n\\t\\tvertical-align: middle;\\r\\n\\t}\\r\\n\\t.loader,\\r\\n\\t.loader:before,\\r\\n\\t.loader:after {\\r\\n\\t\\tanimation: 1s infinite ease-in-out;\\r\\n\\t}\\r\\n\\t.loader:before,\\r\\n\\t.loader:after {\\r\\n\\t\\twidth: 100%;\\r\\n\\t\\theight: 100%;\\r\\n\\t\\tborder-radius: 50%;\\r\\n\\t\\tposition: absolute;\\r\\n\\t\\ttop: 0;\\r\\n\\t\\tleft: 0;\\r\\n\\t}\\r\\n\\r\\n\\t.loader-8:before,\\r\\n\\t.loader-8:after {\\r\\n\\t\\tcontent: '';\\r\\n\\t\\tbackground-color: var(--main-theme-color);\\r\\n\\t\\ttransform: scale(0);\\r\\n\\t\\tanimation: loader8 1.5s infinite ease-in-out;\\r\\n\\t}\\r\\n\\t.loader-8:after {\\r\\n\\t\\tanimation-delay: 0.75s;\\r\\n\\t}\\r\\n\\r\\n\\t@keyframes loader8 {\\r\\n\\t\\t0% {\\r\\n\\t\\t\\ttransform: translateX(-100%) scale(0);\\r\\n\\t\\t}\\r\\n\\t\\t50% {\\r\\n\\t\\t\\ttransform: translateX(0%) scale(1);\\r\\n\\t\\t}\\r\\n\\t\\t100% {\\r\\n\\t\\t\\ttransform: translateX(100%) scale(0);\\r\\n\\t\\t}\\r\\n\\t}\\r\\n</style>\\r\\n"],"names":[],"mappings":"AAMI,WAAW,eAAC,CAAC,AACT,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,QAAQ,CAAE,KAAK,CACf,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,AACV,CAAC,AAEJ,OAAO,eAAC,CAAC,AACR,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,GAAG,CAClB,MAAM,CAAE,GAAG,CACX,OAAO,CAAE,YAAY,CACrB,QAAQ,CAAE,QAAQ,CAClB,cAAc,CAAE,MAAM,AACvB,CAAC,AACD,sBAAO,CACP,sBAAO,OAAO,CACd,sBAAO,MAAM,AAAC,CAAC,AACd,SAAS,CAAE,EAAE,CAAC,QAAQ,CAAC,WAAW,AACnC,CAAC,AACD,sBAAO,OAAO,CACd,sBAAO,MAAM,AAAC,CAAC,AACd,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,GAAG,CAClB,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,AACR,CAAC,AAED,wBAAS,OAAO,CAChB,wBAAS,MAAM,AAAC,CAAC,AAChB,OAAO,CAAE,EAAE,CACX,gBAAgB,CAAE,IAAI,kBAAkB,CAAC,CACzC,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,SAAS,CAAE,sBAAO,CAAC,IAAI,CAAC,QAAQ,CAAC,WAAW,AAC7C,CAAC,AACD,wBAAS,MAAM,AAAC,CAAC,AAChB,eAAe,CAAE,KAAK,AACvB,CAAC,AAED,WAAW,sBAAQ,CAAC,AACnB,EAAE,AAAC,CAAC,AACH,SAAS,CAAE,WAAW,KAAK,CAAC,CAAC,MAAM,CAAC,CAAC,AACtC,CAAC,AACD,GAAG,AAAC,CAAC,AACJ,SAAS,CAAE,WAAW,EAAE,CAAC,CAAC,MAAM,CAAC,CAAC,AACnC,CAAC,AACD,IAAI,AAAC,CAAC,AACL,SAAS,CAAE,WAAW,IAAI,CAAC,CAAC,MAAM,CAAC,CAAC,AACrC,CAAC,AACF,CAAC"}`
};
var Loader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$D);
  return `<div class="${"loader-box svelte-15ep33z"}"><div class="${"loader loader-8 svelte-15ep33z"}"></div>
</div>`;
});
var css$C = {
  code: ".clear_search.svelte-89unx6.svelte-89unx6{position:absolute;right:45px;top:10px;cursor:pointer;color:var(--main-text-color)}.emptyholder.svelte-89unx6.svelte-89unx6{padding:0.5rem 1rem;color:var(--main-descr-color)}.search_res.svelte-89unx6.svelte-89unx6{width:100%;position:absolute;top:100%;left:0;background:#fff;box-shadow:0px 10px 20px -10px rgba(0,0,0,0.1);max-height:300px;overflow:auto;border:1px solid var(--main-border-color);border-top:0;z-index:30}.search_res.svelte-89unx6 li a.svelte-89unx6{display:flex;padding:0.5rem 1rem;align-items:center;color:var(--main-text-color);transition:.2s}.search_res.svelte-89unx6 li a.svelte-89unx6:hover{color:var(--main-theme-color)}.search_res.svelte-89unx6 li a img.svelte-89unx6{height:30px;margin-right:1rem}.item_name.svelte-89unx6.svelte-89unx6{display:inline-block;max-width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.search.svelte-89unx6.svelte-89unx6{grid-area:search;max-width:100%;position:relative}.search.svelte-89unx6 form.svelte-89unx6{display:flex}.search-input.svelte-89unx6.svelte-89unx6{flex-grow:1;padding:6px 10px;height:50px;border:1px solid var(--main-border-color);border-right:none;box-shadow:none;font-family:var(--font);font-size:1rem;width:auto;transition:.2s}.btn_submit.svelte-89unx6.svelte-89unx6{background:rgba(255,255,255,0);border:1px solid var(--main-border-color);border-left:none;border-radius:0;width:50px;color:var(--main-text-color);cursor:pointer}",
  map: `{"version":3,"file":"HeaderSearch.svelte","sources":["HeaderSearch.svelte"],"sourcesContent":["<script>\\r\\n    import Model from '../../model/data-service';\\r\\n    import Loader from '../Helpers/Loader.svelte';\\r\\n    import { goto } from '$app/navigation';\\r\\n    import {clickOutside} from '../../presenter/present-service.js';\\r\\n\\r\\n    const temp = new Model();\\r\\n    let activeSearchList = false;\\r\\n\\r\\n    let searchTerm = \\"\\";\\r\\n    $: searchResultsData = temp.searchResults(searchTerm);\\r\\n\\r\\n    const handleSubmit = () => {\\r\\n        if(searchTerm !== \\"\\") {\\r\\n            goto(\`/search/\${encodeURI(searchTerm)}\`);\\r\\n        };\\r\\n        \\r\\n        activeSearchList = false;\\r\\n    }\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"search\\" use:clickOutside on:click_outside=\\"{() => activeSearchList = false }\\">    \\r\\n    <form action=\\"GET\\" class=\\"search-form\\" on:submit|preventDefault={() => handleSubmit()}>\\r\\n        <input type=\\"text\\" class=\\"search-input\\" placeholder=\\"\u041F\u043E\u0438\u0441\u043A\\" \\r\\n            bind:value={searchTerm}\\r\\n            on:focus={() => activeSearchList = true}>\\r\\n        {#if searchTerm !== \\"\\"}\\r\\n            <span class=\\"material-icons-outlined clear_search\\" on:click={() => searchTerm = \\"\\"}>close</span>\\r\\n        {/if}\\r\\n        <button type=\\"submit\\" class=\\"btn_submit\\">\\r\\n            <span class=\\"material-icons-outlined\\">search</span>\\r\\n        </button>\\r\\n\\r\\n        {#if activeSearchList}\\r\\n            <ul class=\\"search_res\\" class:activeSearchList>\\r\\n                {#await searchResultsData}\\r\\n                    <Loader />\\r\\n                {:then value}\\r\\n                    {#if searchTerm}\\r\\n                        {#each value as item}\\r\\n                            <li>\\r\\n                                <a href=\\"/{item.categoryId}/goodItems/{item.id}\\" \\r\\n                                    title={item.name}\\r\\n                                    on:click={() => activeSearchList = false} >\\r\\n                                    <img src={item.imgSet[0]} alt=\\"\\">\\r\\n                                    <div class=\\"item_name\\">{item.name}</div>\\r\\n                                </a>\\r\\n                            </li>\\r\\n                        {/each}\\r\\n                        {#if value.length == 0}\\r\\n                            <li class=\\"emptyholder\\">\u041F\u043E\u0438\u0441\u043A \u043D\u0435 \u0434\u0430\u043B \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432</li>\\r\\n                        {/if}\\r\\n                    {:else}    \\r\\n                        <li class=\\"emptyholder\\">\u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u0437\u0430\u043F\u0440\u043E\u0441</li>\\r\\n                    {/if}\\r\\n                {/await}\\r\\n            </ul>\\r\\n        {/if}\\r\\n    </form>\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .clear_search {\\r\\n        position: absolute;\\r\\n        right: 45px;\\r\\n        top: 10px;\\r\\n        cursor: pointer;\\r\\n        color: var(--main-text-color);\\r\\n    }\\r\\n\\r\\n    .emptyholder {\\r\\n        padding: 0.5rem 1rem;\\r\\n        color: var(--main-descr-color);\\r\\n    }\\r\\n\\r\\n    .search_res {\\r\\n        width: 100%;\\r\\n        position: absolute;\\r\\n        top: 100%;\\r\\n        left: 0;\\r\\n        background: #fff;\\r\\n        box-shadow: 0px 10px 20px -10px rgba(0,0,0,0.1);\\r\\n        max-height: 300px;\\r\\n        overflow: auto;\\r\\n        border: 1px solid var(--main-border-color);\\r\\n        border-top: 0;\\r\\n        z-index: 30;\\r\\n    }\\r\\n\\r\\n    .search_res li a{\\r\\n        display: flex;\\r\\n        padding: 0.5rem 1rem;\\r\\n        align-items: center;\\r\\n        color: var(--main-text-color);\\r\\n        transition: .2s;\\r\\n    }\\r\\n\\r\\n    .search_res li a:hover {\\r\\n        color: var(--main-theme-color);\\r\\n    }\\r\\n\\r\\n    .search_res li a img {\\r\\n        height: 30px;\\r\\n        margin-right: 1rem;\\r\\n    }\\r\\n\\r\\n    .item_name {\\r\\n        display: inline-block;\\r\\n        max-width: 100%;\\r\\n        white-space: nowrap;\\r\\n        text-overflow: ellipsis;\\r\\n        overflow: hidden;\\r\\n    }\\r\\n\\r\\n    .search {\\r\\n        grid-area: search;\\r\\n        max-width: 100%;\\r\\n        position: relative;\\r\\n    }\\r\\n\\r\\n    .search form {\\r\\n        display: flex;\\r\\n    }\\r\\n\\r\\n    .search-input {\\r\\n        flex-grow: 1;\\r\\n        padding: 6px 10px;\\r\\n        height: 50px;\\r\\n        border: 1px solid var(--main-border-color);\\r\\n        border-right: none;\\r\\n        box-shadow: none;\\r\\n        font-family: var(--font);\\r\\n        font-size: 1rem;\\r\\n        width: auto;\\r\\n        transition: .2s;\\r\\n    }\\r\\n\\r\\n    .btn_submit {\\r\\n        background: rgba(255,255,255,0);\\r\\n        border: 1px solid var(--main-border-color);\\r\\n        border-left: none;\\r\\n        border-radius: 0;\\r\\n        width: 50px;\\r\\n        color: var(--main-text-color);\\r\\n        cursor: pointer;\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AA8DI,aAAa,4BAAC,CAAC,AACX,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,IAAI,CACX,GAAG,CAAE,IAAI,CACT,MAAM,CAAE,OAAO,CACf,KAAK,CAAE,IAAI,iBAAiB,CAAC,AACjC,CAAC,AAED,YAAY,4BAAC,CAAC,AACV,OAAO,CAAE,MAAM,CAAC,IAAI,CACpB,KAAK,CAAE,IAAI,kBAAkB,CAAC,AAClC,CAAC,AAED,WAAW,4BAAC,CAAC,AACT,KAAK,CAAE,IAAI,CACX,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,IAAI,CACT,IAAI,CAAE,CAAC,CACP,UAAU,CAAE,IAAI,CAChB,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,IAAI,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAC/C,UAAU,CAAE,KAAK,CACjB,QAAQ,CAAE,IAAI,CACd,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAC1C,UAAU,CAAE,CAAC,CACb,OAAO,CAAE,EAAE,AACf,CAAC,AAED,yBAAW,CAAC,EAAE,CAAC,eAAC,CAAC,AACb,OAAO,CAAE,IAAI,CACb,OAAO,CAAE,MAAM,CAAC,IAAI,CACpB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,IAAI,iBAAiB,CAAC,CAC7B,UAAU,CAAE,GAAG,AACnB,CAAC,AAED,yBAAW,CAAC,EAAE,CAAC,eAAC,MAAM,AAAC,CAAC,AACpB,KAAK,CAAE,IAAI,kBAAkB,CAAC,AAClC,CAAC,AAED,yBAAW,CAAC,EAAE,CAAC,CAAC,CAAC,GAAG,cAAC,CAAC,AAClB,MAAM,CAAE,IAAI,CACZ,YAAY,CAAE,IAAI,AACtB,CAAC,AAED,UAAU,4BAAC,CAAC,AACR,OAAO,CAAE,YAAY,CACrB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,MAAM,CACnB,aAAa,CAAE,QAAQ,CACvB,QAAQ,CAAE,MAAM,AACpB,CAAC,AAED,OAAO,4BAAC,CAAC,AACL,SAAS,CAAE,MAAM,CACjB,SAAS,CAAE,IAAI,CACf,QAAQ,CAAE,QAAQ,AACtB,CAAC,AAED,qBAAO,CAAC,IAAI,cAAC,CAAC,AACV,OAAO,CAAE,IAAI,AACjB,CAAC,AAED,aAAa,4BAAC,CAAC,AACX,SAAS,CAAE,CAAC,CACZ,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAC1C,YAAY,CAAE,IAAI,CAClB,UAAU,CAAE,IAAI,CAChB,WAAW,CAAE,IAAI,MAAM,CAAC,CACxB,SAAS,CAAE,IAAI,CACf,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,GAAG,AACnB,CAAC,AAED,WAAW,4BAAC,CAAC,AACT,UAAU,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,CAC/B,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAC1C,WAAW,CAAE,IAAI,CACjB,aAAa,CAAE,CAAC,CAChB,KAAK,CAAE,IAAI,CACX,KAAK,CAAE,IAAI,iBAAiB,CAAC,CAC7B,MAAM,CAAE,OAAO,AACnB,CAAC"}`
};
var HeaderSearch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const temp = new Model();
  let searchTerm = "";
  $$result.css.add(css$C);
  temp.searchResults(searchTerm);
  return `<div class="${"search svelte-89unx6"}"><form action="${"GET"}" class="${"search-form svelte-89unx6"}"><input type="${"text"}" class="${"search-input svelte-89unx6"}" placeholder="${"\u041F\u043E\u0438\u0441\u043A"}"${add_attribute("value", searchTerm, 0)}>
        ${``}
        <button type="${"submit"}" class="${"btn_submit svelte-89unx6"}"><span class="${"material-icons-outlined"}">search</span></button>

        ${``}</form>
</div>`;
});
var css$B = {
  code: "button.svelte-1kch4jw{padding:5px;background:var(--main-theme-color);color:#fff;border-radius:0;border:0;cursor:pointer}",
  map: '{"version":3,"file":"Button.svelte","sources":["Button.svelte"],"sourcesContent":["<script>\\r\\n    export let titleProp;\\r\\n<\/script>\\r\\n\\r\\n<button title={titleProp} on:click>\\r\\n    <slot></slot>\\r\\n</button>\\r\\n\\r\\n<style>\\r\\n    button {\\r\\n        padding: 5px;\\r\\n        background: var(--main-theme-color);\\r\\n        color: #fff;\\r\\n        border-radius: 0;\\r\\n        border: 0;\\r\\n        cursor: pointer;\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AASI,MAAM,eAAC,CAAC,AACJ,OAAO,CAAE,GAAG,CACZ,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,KAAK,CAAE,IAAI,CACX,aAAa,CAAE,CAAC,CAChB,MAAM,CAAE,CAAC,CACT,MAAM,CAAE,OAAO,AACnB,CAAC"}'
};
var Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { titleProp } = $$props;
  if ($$props.titleProp === void 0 && $$bindings.titleProp && titleProp !== void 0)
    $$bindings.titleProp(titleProp);
  $$result.css.add(css$B);
  return `<button${add_attribute("title", titleProp, 0)} class="${"svelte-1kch4jw"}">${slots.default ? slots.default({}) : ``}
</button>`;
});
var css$A = {
  code: ".close_btn.svelte-98vkkz{margin-top:0.5rem}.modal-background.svelte-98vkkz{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0, 0, 0, 0.3);z-index:1000}.modal.svelte-98vkkz{position:absolute;left:50%;top:50%;width:1200px;max-height:calc(100vh - 4em);overflow:auto;transform:translate(-50%, -50%);padding:1em;border-radius:0.2em;background:white;z-index:1001}",
  map: `{"version":3,"file":"Modal.svelte","sources":["Modal.svelte"],"sourcesContent":["<script>\\r\\n\\timport { createEventDispatcher} from 'svelte';\\r\\n    import { fade } from 'svelte/transition';\\r\\n\\timport Button from '../Helpers/Button.svelte';\\r\\n\\r\\n\\tconst dispatch = createEventDispatcher();\\r\\n\\tconst close = () => dispatch('close');\\r\\n\\r\\n\\tlet modal;\\r\\n\\r\\n\\tconst handle_keydown = (e) => {\\r\\n\\t\\tif (e.key === 'Escape') {\\r\\n\\t\\t\\tclose();\\r\\n\\t\\t\\treturn;\\r\\n\\t\\t}\\r\\n\\t};\\r\\n\\r\\n<\/script>\\r\\n\\r\\n<svelte:window on:keydown={handle_keydown} />\\r\\n\\r\\n<div class=\\"modal-background\\" on:click={close} transition:fade=\\"{{duration: 100 }}\\"/>\\r\\n\\r\\n<div class=\\"modal\\" role=\\"dialog\\" aria-modal=\\"true\\" bind:this={modal} transition:fade=\\"{{duration: 200 }}\\">\\r\\n\\t<slot name=\\"header\\" />\\r\\n\\t<slot />\\r\\n\\t<div class=\\"close_btn\\">\\r\\n\\t\\t<Button on:click={close}>\u0417\u0430\u043A\u0440\u044B\u0442\u044C</Button>\\r\\n\\t</div>\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n\\t.close_btn {\\r\\n\\t\\tmargin-top: 0.5rem;\\r\\n\\t}\\r\\n\\t.modal-background {\\r\\n\\t\\tposition: fixed;\\r\\n\\t\\ttop: 0;\\r\\n\\t\\tleft: 0;\\r\\n\\t\\twidth: 100%;\\r\\n\\t\\theight: 100%;\\r\\n\\t\\tbackground: rgba(0, 0, 0, 0.3);\\r\\n        z-index: 1000;\\r\\n\\t}\\r\\n\\r\\n\\t.modal {\\r\\n\\t\\tposition: absolute;\\r\\n\\t\\tleft: 50%;\\r\\n\\t\\ttop: 50%;\\r\\n\\t\\twidth: 1200px;\\r\\n\\t\\tmax-height: calc(100vh - 4em);\\r\\n\\t\\toverflow: auto;\\r\\n\\t\\ttransform: translate(-50%, -50%);\\r\\n\\t\\tpadding: 1em;\\r\\n\\t\\tborder-radius: 0.2em;\\r\\n\\t\\tbackground: white;\\r\\n        z-index: 1001;\\r\\n\\t}\\r\\n</style>\\r\\n"],"names":[],"mappings":"AAgCC,UAAU,cAAC,CAAC,AACX,UAAU,CAAE,MAAM,AACnB,CAAC,AACD,iBAAiB,cAAC,CAAC,AAClB,QAAQ,CAAE,KAAK,CACf,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACxB,OAAO,CAAE,IAAI,AACpB,CAAC,AAED,MAAM,cAAC,CAAC,AACP,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,GAAG,CACR,KAAK,CAAE,MAAM,CACb,UAAU,CAAE,KAAK,KAAK,CAAC,CAAC,CAAC,GAAG,CAAC,CAC7B,QAAQ,CAAE,IAAI,CACd,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAChC,OAAO,CAAE,GAAG,CACZ,aAAa,CAAE,KAAK,CACpB,UAAU,CAAE,KAAK,CACX,OAAO,CAAE,IAAI,AACpB,CAAC"}`
};
var Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let modal;
  $$result.css.add(css$A);
  return `

<div class="${"modal-background svelte-98vkkz"}"></div>

<div class="${"modal svelte-98vkkz"}" role="${"dialog"}" aria-modal="${"true"}"${add_attribute("this", modal, 0)}>${slots.header ? slots.header({}) : ``}
	${slots.default ? slots.default({}) : ``}
	<div class="${"close_btn svelte-98vkkz"}">${validate_component(Button, "Button").$$render($$result, {}, {}, { default: () => `\u0417\u0430\u043A\u0440\u044B\u0442\u044C` })}</div>
</div>`;
});
var css$z = {
  code: ".category_list.svelte-13he9ss.svelte-13he9ss{display:grid;grid-template-rows:auto;grid-template-columns:repeat(3, minmax(200px, 1fr));gap:1rem;margin:15px 0;font-size:16px}.category_list.svelte-13he9ss a.svelte-13he9ss{background:#f6f6f6;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:1.5rem}.category_list.svelte-13he9ss a:hover .material-icons-outlined.svelte-13he9ss{color:var(--main-theme-color);transition:.2s}.material-icons-outlined.svelte-13he9ss.svelte-13he9ss{font-size:48px;text-align:right;margin-right:10px;transition:.2s;color:var(--main-text-color)}.cat_name_text.svelte-13he9ss.svelte-13he9ss{color:var(--main-text-color)}@media(max-width: 992px){.material-icons-outlined.svelte-13he9ss.svelte-13he9ss{font-size:48px}.category_list.svelte-13he9ss a.svelte-13he9ss{flex-direction:column}}@media(max-width: 768px){.category_list.svelte-13he9ss.svelte-13he9ss{grid-template-columns:1fr 1fr;gap:0.5rem;margin:0}.category_list.svelte-13he9ss a.svelte-13he9ss{flex-direction:row;padding:0.5rem;font-size:0.8rem}.material-icons-outlined.svelte-13he9ss.svelte-13he9ss{font-size:1.5rem}}",
  map: '{"version":3,"file":"CategoryList.svelte","sources":["CategoryList.svelte"],"sourcesContent":["<script>\\r\\n    import Model from \\"../../model/data-service\\";\\r\\n    import Loader from \\"../Helpers/Loader.svelte\\";\\r\\n\\r\\n    const temp = new Model();\\r\\n    const categories = temp._getAllItems();\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"category_list\\">\\r\\n    {#await categories}\\r\\n        <Loader />\\r\\n    {:then value}\\r\\n        {#each value as item (item.id)}\\r\\n            <a href=\\"/category/{item.id}\\" sveltekit:prefetch>\\r\\n                <span class=\\"material-icons-outlined\\">{item.catImg}</span>\\r\\n                <span class=\\"cat_name_text\\">{item.catName}</span>\\r\\n            </a>\\r\\n        {/each}\\r\\n    {:catch error}\\r\\n        {error}\\r\\n    {/await}\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .category_list {\\r\\n        display: grid;\\r\\n        grid-template-rows: auto;\\r\\n        grid-template-columns: repeat(3, minmax(200px, 1fr));\\r\\n        gap: 1rem;\\r\\n        margin: 15px 0;\\r\\n        font-size: 16px;\\r\\n    }\\r\\n    \\r\\n    .category_list a {\\r\\n        background: #f6f6f6;\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: center;\\r\\n        flex-direction: column;\\r\\n        text-align: center;\\r\\n        padding: 1.5rem;\\r\\n    }\\r\\n\\r\\n    .category_list a:hover .material-icons-outlined {\\r\\n        color: var(--main-theme-color);\\r\\n        transition: .2s;\\r\\n    }\\r\\n\\r\\n    .material-icons-outlined {\\r\\n        font-size: 48px;\\r\\n        text-align: right;\\r\\n        margin-right: 10px; \\r\\n        transition: .2s;\\r\\n        color: var(--main-text-color);\\r\\n    }\\r\\n\\r\\n    .cat_name_text {\\r\\n        color: var(--main-text-color);\\r\\n    }\\r\\n\\r\\n    @media (max-width: 992px) {\\r\\n        .material-icons-outlined {\\r\\n            font-size: 48px;\\r\\n        }\\r\\n        .category_list a {\\r\\n            flex-direction: column;\\r\\n        }\\r\\n    }\\r\\n    \\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .category_list {\\r\\n            grid-template-columns: 1fr 1fr;\\r\\n            gap: 0.5rem;\\r\\n            margin: 0;\\r\\n        }\\r\\n\\r\\n        .category_list a {\\r\\n            flex-direction: row;\\r\\n            padding: 0.5rem;\\r\\n            font-size: 0.8rem;\\r\\n        }\\r\\n        .material-icons-outlined {\\r\\n            font-size: 1.5rem;\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAwBI,cAAc,8BAAC,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,kBAAkB,CAAE,IAAI,CACxB,qBAAqB,CAAE,OAAO,CAAC,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,GAAG,CAAC,CAAC,CACpD,GAAG,CAAE,IAAI,CACT,MAAM,CAAE,IAAI,CAAC,CAAC,CACd,SAAS,CAAE,IAAI,AACnB,CAAC,AAED,6BAAc,CAAC,CAAC,eAAC,CAAC,AACd,UAAU,CAAE,OAAO,CACnB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,cAAc,CAAE,MAAM,CACtB,UAAU,CAAE,MAAM,CAClB,OAAO,CAAE,MAAM,AACnB,CAAC,AAED,6BAAc,CAAC,CAAC,MAAM,CAAC,wBAAwB,eAAC,CAAC,AAC7C,KAAK,CAAE,IAAI,kBAAkB,CAAC,CAC9B,UAAU,CAAE,GAAG,AACnB,CAAC,AAED,wBAAwB,8BAAC,CAAC,AACtB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,KAAK,CACjB,YAAY,CAAE,IAAI,CAClB,UAAU,CAAE,GAAG,CACf,KAAK,CAAE,IAAI,iBAAiB,CAAC,AACjC,CAAC,AAED,cAAc,8BAAC,CAAC,AACZ,KAAK,CAAE,IAAI,iBAAiB,CAAC,AACjC,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,wBAAwB,8BAAC,CAAC,AACtB,SAAS,CAAE,IAAI,AACnB,CAAC,AACD,6BAAc,CAAC,CAAC,eAAC,CAAC,AACd,cAAc,CAAE,MAAM,AAC1B,CAAC,AACL,CAAC,AAGD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,cAAc,8BAAC,CAAC,AACZ,qBAAqB,CAAE,GAAG,CAAC,GAAG,CAC9B,GAAG,CAAE,MAAM,CACX,MAAM,CAAE,CAAC,AACb,CAAC,AAED,6BAAc,CAAC,CAAC,eAAC,CAAC,AACd,cAAc,CAAE,GAAG,CACnB,OAAO,CAAE,MAAM,CACf,SAAS,CAAE,MAAM,AACrB,CAAC,AACD,wBAAwB,8BAAC,CAAC,AACtB,SAAS,CAAE,MAAM,AACrB,CAAC,AACL,CAAC"}'
};
var CategoryList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const temp = new Model();
  const categories = temp._getAllItems();
  $$result.css.add(css$z);
  return `<div class="${"category_list svelte-13he9ss"}">${function(__value) {
    if (is_promise(__value))
      return `
        ${validate_component(Loader, "Loader").$$render($$result, {}, {}, {})}
    `;
    return function(value) {
      return `
        ${each(value, (item) => `<a href="${"/category/" + escape(item.id)}" sveltekit:prefetch class="${"svelte-13he9ss"}"><span class="${"material-icons-outlined svelte-13he9ss"}">${escape(item.catImg)}</span>
                <span class="${"cat_name_text svelte-13he9ss"}">${escape(item.catName)}</span>
            </a>`)}
    `;
    }(__value);
  }(categories)}
</div>`;
});
var css$y = {
  code: "header.svelte-4axtw0{border-bottom:1px solid var(--main-border-color);box-shadow:0px 10px 20px -10px rgba(0,0,0,0.1);background:var(--main-bg-color)}h3.svelte-4axtw0{margin-bottom:1rem}.header_content.svelte-4axtw0{display:grid;grid-template-areas:'logo catalog search controls';grid-template-columns:80px max-content 1fr max-content;column-gap:2rem;align-items:center;padding:1rem 0;transition:.2s}.logo.svelte-4axtw0{grid-area:logo;height:30px}@media(max-width: 992px){.header_content.svelte-4axtw0{grid-template-columns:40px max-content 1fr max-content;grid-template-areas:'logo logo logo logo logo logo controls' \r\n            'catalog search search search search search search';column-gap:1rem;row-gap:0.5rem}}@media(max-width: 768px){.header_content.svelte-4axtw0{padding:0.5rem 0}header.svelte-4axtw0{box-shadow:none;border:0}}",
  map: `{"version":3,"file":"Header.svelte","sources":["Header.svelte"],"sourcesContent":["<script>\\r\\n    import HeaderCatalog from \\"./Header\u0421atalog.svelte\\";\\r\\n    import HeaderOptions from \\"./HeaderOptions.svelte\\";\\r\\n    import HeaderSearch from \\"./HeaderSearch.svelte\\";\\r\\n    import Modal from \\"../Modal/Modal.svelte\\";\\r\\n    import CategoryList from '../Main/CategoryList.svelte';\\r\\n\\r\\n    let showModal = false;\\r\\n    let y;\\r\\n<\/script>\\r\\n\\r\\n<svelte:window bind:scrollY={y}/>\\r\\n\\r\\n<header>\\r\\n    <div class=\\"container\\">\\r\\n        <div class=\\"header_content\\">\\r\\n            <a href=\\"/\\" class=\\"logo\\">\\r\\n                <img src=\\"/logo.svg\\" alt=\\"\\">\\r\\n            </a>\\r\\n            <HeaderCatalog modalToggle={() => showModal = true}/>\\r\\n            <HeaderSearch/>\\r\\n            <HeaderOptions/>\\r\\n        </div>\\r\\n    </div>\\r\\n</header>\\r\\n\\r\\n{#if showModal}\\r\\n    <Modal on:close=\\"{() => showModal = false}\\">\\r\\n        <h3 name=\\"header\\">\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0439</h3>\\r\\n        <div class=\\"category_container\\"  on:click={() => showModal = false}>\\r\\n            <CategoryList/>\\r\\n        </div>\\r\\n    </Modal>\\r\\n{/if}\\r\\n\\r\\n\\r\\n<style>\\r\\n    header {\\r\\n        border-bottom: 1px solid var(--main-border-color);\\r\\n        box-shadow: 0px 10px 20px -10px rgba(0,0,0,0.1);\\r\\n        background: var(--main-bg-color);\\r\\n    }\\r\\n\\r\\n    h3 {\\r\\n        margin-bottom: 1rem;\\r\\n    }\\r\\n\\r\\n\\r\\n    .header_content {\\r\\n        display: grid;\\r\\n        grid-template-areas: 'logo catalog search controls';\\r\\n        grid-template-columns: 80px max-content 1fr max-content;\\r\\n        column-gap: 2rem;\\r\\n        align-items: center;\\r\\n        padding: 1rem 0;\\r\\n        transition: .2s;\\r\\n    }\\r\\n\\r\\n    .logo {\\r\\n        grid-area: logo;\\r\\n        height: 30px;\\r\\n    }\\r\\n\\r\\n    @media (max-width: 992px) {\\r\\n        .header_content {\\r\\n            grid-template-columns: 40px max-content 1fr max-content;\\r\\n            grid-template-areas: \\r\\n            'logo logo logo logo logo logo controls' \\r\\n            'catalog search search search search search search';\\r\\n            column-gap: 1rem;\\r\\n            row-gap: 0.5rem;\\r\\n        }\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .header_content {\\r\\n            padding: 0.5rem 0;\\r\\n            \\r\\n        }\\r\\n\\r\\n        header {\\r\\n            box-shadow: none;\\r\\n            border: 0;\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAqCI,MAAM,cAAC,CAAC,AACJ,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CACjD,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,IAAI,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAC/C,UAAU,CAAE,IAAI,eAAe,CAAC,AACpC,CAAC,AAED,EAAE,cAAC,CAAC,AACA,aAAa,CAAE,IAAI,AACvB,CAAC,AAGD,eAAe,cAAC,CAAC,AACb,OAAO,CAAE,IAAI,CACb,mBAAmB,CAAE,8BAA8B,CACnD,qBAAqB,CAAE,IAAI,CAAC,WAAW,CAAC,GAAG,CAAC,WAAW,CACvD,UAAU,CAAE,IAAI,CAChB,WAAW,CAAE,MAAM,CACnB,OAAO,CAAE,IAAI,CAAC,CAAC,CACf,UAAU,CAAE,GAAG,AACnB,CAAC,AAED,KAAK,cAAC,CAAC,AACH,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,IAAI,AAChB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,eAAe,cAAC,CAAC,AACb,qBAAqB,CAAE,IAAI,CAAC,WAAW,CAAC,GAAG,CAAC,WAAW,CACvD,mBAAmB,CACnB,wCAAwC;YACxC,mDAAmD,CACnD,UAAU,CAAE,IAAI,CAChB,OAAO,CAAE,MAAM,AACnB,CAAC,AACL,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,eAAe,cAAC,CAAC,AACb,OAAO,CAAE,MAAM,CAAC,CAAC,AAErB,CAAC,AAED,MAAM,cAAC,CAAC,AACJ,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,CAAC,AACb,CAAC,AACL,CAAC"}`
};
var Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let showModal = false;
  $$result.css.add(css$y);
  return `

<header class="${"svelte-4axtw0"}"><div class="${"container"}"><div class="${"header_content svelte-4axtw0"}"><a href="${"/"}" class="${"logo svelte-4axtw0"}"><img src="${"/logo.svg"}" alt="${""}"></a>
            ${validate_component(HeaderuD0uA1atalog, "HeaderCatalog").$$render($$result, { modalToggle: () => showModal = true }, {}, {})}
            ${validate_component(HeaderSearch, "HeaderSearch").$$render($$result, {}, {}, {})}
            ${validate_component(HeaderOptions, "HeaderOptions").$$render($$result, {}, {}, {})}</div></div></header>

${showModal ? `${validate_component(Modal, "Modal").$$render($$result, {}, {}, {
    default: () => `<h3 name="${"header"}" class="${"svelte-4axtw0"}">\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0439</h3>
        <div class="${"category_container"}">${validate_component(CategoryList, "CategoryList").$$render($$result, {}, {}, {})}</div>`
  })}` : ``}`;
});
var css$x = {
  code: "footer.svelte-d657ii.svelte-d657ii{margin-top:2rem;background:var(--footer-bg-color);padding:2rem 0 0}.footer_menu.svelte-d657ii.svelte-d657ii{display:flex;flex-wrap:wrap;gap:2rem}.menu_item.svelte-d657ii.svelte-d657ii{display:grid;grid-auto-rows:max-content;gap:0.75rem;font-size:0.9rem}.menu_link.svelte-d657ii.svelte-d657ii{color:var(--main-text-color);transition:.2s}.menu_link.svelte-d657ii.svelte-d657ii:hover{color:var(--main-theme-color)}.menu_title.svelte-d657ii.svelte-d657ii{margin-bottom:0.5rem;font-weight:500;font-size:0.9rem}.footer_about.svelte-d657ii.svelte-d657ii{font-size:11px;background:var(--main-descr-color);padding:0.5rem 0;margin-top:1rem}.footer_layout.svelte-d657ii.svelte-d657ii{display:grid;grid-template-columns:400px auto}.footer_logo.svelte-d657ii.svelte-d657ii{max-width:150px;margin-bottom:2rem}.footer_logo.svelte-d657ii img.svelte-d657ii{width:100%}.phone_value.svelte-d657ii.svelte-d657ii{color:var(--main-text-color);font-size:1.3rem;font-weight:500}.phone_info.svelte-d657ii.svelte-d657ii{font-size:0.9rem;font-weight:300}.footer_contacts.svelte-d657ii.svelte-d657ii{margin-bottom:1rem}.footer_social.svelte-d657ii span.svelte-d657ii{font-size:30px;margin-right:0.5rem;margin-top:2rem}@media(max-width: 768px){.footer_layout.svelte-d657ii.svelte-d657ii{grid-template-columns:auto}.footer_aside.svelte-d657ii.svelte-d657ii{display:flex;flex-wrap:wrap;column-gap:1rem}.footer_social.svelte-d657ii.svelte-d657ii{width:100%;display:flex;justify-content:center;margin-bottom:1rem}.footer_social.svelte-d657ii span.svelte-d657ii{margin-top:1rem}.footer_contacts.svelte-d657ii.svelte-d657ii{margin-bottom:0}.footer_logo.svelte-d657ii.svelte-d657ii{margin:0 auto}.phone_value.svelte-d657ii.svelte-d657ii{font-size:1rem}.contacts.svelte-d657ii.svelte-d657ii{display:flex;flex-wrap:wrap;gap:1rem;margin-left:auto}.footer_menu.svelte-d657ii.svelte-d657ii{display:none}.menu_item.svelte-d657ii.svelte-d657ii{gap:0;font-size:0.7rem;width:26%}}",
  map: `{"version":3,"file":"Footer.svelte","sources":["Footer.svelte"],"sourcesContent":["<footer>\\r\\n    <div class=\\"container\\">\\r\\n        <div class=\\"footer_layout\\">\\r\\n            <div class=\\"footer_aside\\">\\r\\n                <div class=\\"footer_logo\\">\\r\\n                    <a href=\\".\\"><img src=\\"/logo.svg\\" alt=\\"\\"></a>\\r\\n                </div>\\r\\n                <div class=\\"contacts\\">\\r\\n                    <div class=\\"footer_contacts\\">\\r\\n                        <a href=\\"tel:+78008008080\\" class=\\"phone_value\\">+7(800)800-80-80</a>\\r\\n                        <div class=\\"phone_info\\">\u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0430\u044F \u0441\u043B\u0443\u0436\u0431\u0430</div>\\r\\n                    </div>\\r\\n                    <div class=\\"footer_contacts\\">\\r\\n                        <a href=\\"tel:+78008008080\\" class=\\"phone_value\\">+7(800)800-80-80</a>\\r\\n                        <div class=\\"phone_info\\">\u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442-\u043C\u0430\u0433\u0430\u0437\u0438\u043D</div>\\r\\n                    </div>\\r\\n                </div>\\r\\n                <div class=\\"footer_social\\">\\r\\n                    <span class=\\"material-icons-outlined\\">whatsapp</span>\\r\\n                    <span class=\\"material-icons-outlined\\">catching_pokemon</span>\\r\\n                    <span class=\\"material-icons-outlined\\">reddit</span>\\r\\n                    <span class=\\"material-icons-outlined\\">shopify</span>\\r\\n                    <span class=\\"material-icons-outlined\\">cast</span>\\r\\n                </div>\\r\\n            </div>\\r\\n            <div class=\\"footer_menu\\">\\r\\n                <div class='menu_item'>\\r\\n                    <div class='menu_title'>\u041E \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0435</div>\\r\\n                    <a class=\\"menu_link\\" href='.'>\u0423\u0441\u043B\u043E\u0432\u0438\u044F \u043E\u0431\u043C\u0435\u043D\u0430 \u0438 \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u0430</a>\\r\\n                    <a class=\\"menu_link\\" href='.'>\u041A\u0430\u0442\u0430\u043B\u043E\u0433</a>\\r\\n                    <a class=\\"menu_link\\" href='.'>\u041E \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438</a>\\r\\n                    <a class=\\"menu_link\\" href='.'>\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B</a>\\r\\n                    <a class=\\"menu_link\\" href='.'>\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430</a>\\r\\n                    <a class=\\"menu_link\\" href='.'>\u041E\u043F\u043B\u0430\u0442\u0430</a>\\r\\n                </div>\\r\\n                <div class=\\"menu_item\\">\\r\\n                    <div class=\\"menu_title\\">\u041A\u043B\u0438\u0435\u043D\u0442\u0430\u043C</div>\\r\\n                    <a class=\\"menu_link\\" href=\\".\\">\u041B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442</a>\\r\\n                    <a class=\\"menu_link\\" href=\\".\\">\u0411\u043B\u043E\u0433</a>\\r\\n                    <a class=\\"menu_link\\" href=\\".\\">\u041E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u0441\u0432\u044F\u0437\u044C</a>\\r\\n                </div>\\r\\n                <div class=\\"menu_item\\">\\r\\n                    <div class=\\"menu_title\\">\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F</div>\\r\\n                    <a class=\\"menu_link\\" href=\\".\\">\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u043E\u0435 \u0441\u043E\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435</a>\\r\\n                    <a class=\\"menu_link\\" href=\\".\\">\u041F\u043E\u043B\u0438\u0442\u0438\u043A\u0430 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438 \u0438 \u043E\u0444\u0435\u0440\u0442\u0430</a>\\r\\n                </div>\\r\\n            </div>\\r\\n        </div>\\r\\n    </div>\\r\\n    <div class='footer_about'>\\r\\n        <div class='container'>\u0421\u043E\u0437\u0434\u0430\u043D\u043E \u043C\u0443\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0434\u043E\u043B\u0433\u043E, \u043D\u043E \u0443\u0432\u043B\u0435\u043A\u0430\u0442\u0435\u043B\u044C\u043D\u043E.</div>\\r\\n    </div>\\r\\n</footer>\\r\\n\\r\\n\\r\\n<style>\\r\\n    footer {\\r\\n        margin-top: 2rem;\\r\\n        background: var(--footer-bg-color);\\r\\n        padding: 2rem 0 0;\\r\\n    }\\r\\n\\r\\n    .footer_menu {\\r\\n        display: flex;\\r\\n        flex-wrap: wrap;\\r\\n        gap: 2rem;\\r\\n    }\\r\\n\\r\\n    .menu_item {\\r\\n        display: grid;\\r\\n        grid-auto-rows: max-content;\\r\\n        gap: 0.75rem;\\r\\n        font-size: 0.9rem;\\r\\n    }\\r\\n\\r\\n    .menu_link {\\r\\n        color: var(--main-text-color);\\r\\n        transition: .2s;\\r\\n    }\\r\\n    \\r\\n    .menu_link:hover {\\r\\n        color: var(--main-theme-color);\\r\\n    }\\r\\n\\r\\n    .menu_title {\\r\\n        margin-bottom: 0.5rem;\\r\\n        font-weight: 500;\\r\\n        font-size: 0.9rem;\\r\\n    }\\r\\n\\r\\n    .footer_about {\\r\\n        font-size: 11px;\\r\\n        background: var(--main-descr-color);\\r\\n        padding: 0.5rem 0;\\r\\n        margin-top: 1rem;\\r\\n    }\\r\\n\\r\\n    .footer_layout {\\r\\n        display: grid;\\r\\n        grid-template-columns: 400px auto;\\r\\n    }\\r\\n\\r\\n    .footer_logo {\\r\\n        max-width: 150px;\\r\\n        margin-bottom: 2rem;\\r\\n    }\\r\\n\\r\\n    .footer_logo img {\\r\\n        width: 100%;\\r\\n    }\\r\\n\\r\\n    .phone_value {\\r\\n        color: var(--main-text-color);\\r\\n        font-size: 1.3rem;\\r\\n        font-weight: 500;\\r\\n    }\\r\\n\\r\\n    .phone_info {\\r\\n        font-size: 0.9rem;\\r\\n        font-weight: 300;\\r\\n    }\\r\\n\\r\\n    .footer_contacts {\\r\\n        margin-bottom: 1rem;\\r\\n    }\\r\\n\\r\\n    .footer_social span{\\r\\n        font-size: 30px;\\r\\n        margin-right: 0.5rem;\\r\\n        margin-top: 2rem;\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .footer_layout {\\r\\n            grid-template-columns: auto;\\r\\n        }\\r\\n\\r\\n        .footer_aside {\\r\\n            display: flex;\\r\\n            flex-wrap: wrap;\\r\\n            column-gap: 1rem;\\r\\n        }\\r\\n\\r\\n        .footer_social {\\r\\n            width: 100%;\\r\\n            display: flex;\\r\\n            justify-content: center;\\r\\n            margin-bottom: 1rem;\\r\\n        }\\r\\n\\r\\n        .footer_social span {\\r\\n            margin-top: 1rem;\\r\\n        }\\r\\n\\r\\n        .footer_contacts {\\r\\n            margin-bottom: 0;\\r\\n        }\\r\\n\\r\\n        .footer_logo {\\r\\n            margin: 0 auto;\\r\\n        }\\r\\n\\r\\n        .phone_value {\\r\\n            font-size: 1rem;\\r\\n        }\\r\\n\\r\\n        .contacts {\\r\\n            display: flex;\\r\\n            flex-wrap: wrap;\\r\\n            gap: 1rem;\\r\\n            margin-left: auto;\\r\\n        }\\r\\n\\r\\n        .footer_menu {\\r\\n            display: none;\\r\\n        }\\r\\n\\r\\n        .menu_item {\\r\\n            gap: 0;\\r\\n            font-size: 0.7rem;\\r\\n            width: 26%;\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAwDI,MAAM,4BAAC,CAAC,AACJ,UAAU,CAAE,IAAI,CAChB,UAAU,CAAE,IAAI,iBAAiB,CAAC,CAClC,OAAO,CAAE,IAAI,CAAC,CAAC,CAAC,CAAC,AACrB,CAAC,AAED,YAAY,4BAAC,CAAC,AACV,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,IAAI,CACf,GAAG,CAAE,IAAI,AACb,CAAC,AAED,UAAU,4BAAC,CAAC,AACR,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,WAAW,CAC3B,GAAG,CAAE,OAAO,CACZ,SAAS,CAAE,MAAM,AACrB,CAAC,AAED,UAAU,4BAAC,CAAC,AACR,KAAK,CAAE,IAAI,iBAAiB,CAAC,CAC7B,UAAU,CAAE,GAAG,AACnB,CAAC,AAED,sCAAU,MAAM,AAAC,CAAC,AACd,KAAK,CAAE,IAAI,kBAAkB,CAAC,AAClC,CAAC,AAED,WAAW,4BAAC,CAAC,AACT,aAAa,CAAE,MAAM,CACrB,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,MAAM,AACrB,CAAC,AAED,aAAa,4BAAC,CAAC,AACX,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,OAAO,CAAE,MAAM,CAAC,CAAC,CACjB,UAAU,CAAE,IAAI,AACpB,CAAC,AAED,cAAc,4BAAC,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,KAAK,CAAC,IAAI,AACrC,CAAC,AAED,YAAY,4BAAC,CAAC,AACV,SAAS,CAAE,KAAK,CAChB,aAAa,CAAE,IAAI,AACvB,CAAC,AAED,0BAAY,CAAC,GAAG,cAAC,CAAC,AACd,KAAK,CAAE,IAAI,AACf,CAAC,AAED,YAAY,4BAAC,CAAC,AACV,KAAK,CAAE,IAAI,iBAAiB,CAAC,CAC7B,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,AACpB,CAAC,AAED,WAAW,4BAAC,CAAC,AACT,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,AACpB,CAAC,AAED,gBAAgB,4BAAC,CAAC,AACd,aAAa,CAAE,IAAI,AACvB,CAAC,AAED,4BAAc,CAAC,kBAAI,CAAC,AAChB,SAAS,CAAE,IAAI,CACf,YAAY,CAAE,MAAM,CACpB,UAAU,CAAE,IAAI,AACpB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,cAAc,4BAAC,CAAC,AACZ,qBAAqB,CAAE,IAAI,AAC/B,CAAC,AAED,aAAa,4BAAC,CAAC,AACX,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,IAAI,AACpB,CAAC,AAED,cAAc,4BAAC,CAAC,AACZ,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,aAAa,CAAE,IAAI,AACvB,CAAC,AAED,4BAAc,CAAC,IAAI,cAAC,CAAC,AACjB,UAAU,CAAE,IAAI,AACpB,CAAC,AAED,gBAAgB,4BAAC,CAAC,AACd,aAAa,CAAE,CAAC,AACpB,CAAC,AAED,YAAY,4BAAC,CAAC,AACV,MAAM,CAAE,CAAC,CAAC,IAAI,AAClB,CAAC,AAED,YAAY,4BAAC,CAAC,AACV,SAAS,CAAE,IAAI,AACnB,CAAC,AAED,SAAS,4BAAC,CAAC,AACP,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,IAAI,CACf,GAAG,CAAE,IAAI,CACT,WAAW,CAAE,IAAI,AACrB,CAAC,AAED,YAAY,4BAAC,CAAC,AACV,OAAO,CAAE,IAAI,AACjB,CAAC,AAED,UAAU,4BAAC,CAAC,AACR,GAAG,CAAE,CAAC,CACN,SAAS,CAAE,MAAM,CACjB,KAAK,CAAE,GAAG,AACd,CAAC,AACL,CAAC"}`
};
var Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$x);
  return `<footer class="${"svelte-d657ii"}"><div class="${"container"}"><div class="${"footer_layout svelte-d657ii"}"><div class="${"footer_aside svelte-d657ii"}"><div class="${"footer_logo svelte-d657ii"}"><a href="${"."}"><img src="${"/logo.svg"}" alt="${""}" class="${"svelte-d657ii"}"></a></div>
                <div class="${"contacts svelte-d657ii"}"><div class="${"footer_contacts svelte-d657ii"}"><a href="${"tel:+78008008080"}" class="${"phone_value svelte-d657ii"}">+7(800)800-80-80</a>
                        <div class="${"phone_info svelte-d657ii"}">\u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0430\u044F \u0441\u043B\u0443\u0436\u0431\u0430</div></div>
                    <div class="${"footer_contacts svelte-d657ii"}"><a href="${"tel:+78008008080"}" class="${"phone_value svelte-d657ii"}">+7(800)800-80-80</a>
                        <div class="${"phone_info svelte-d657ii"}">\u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442-\u043C\u0430\u0433\u0430\u0437\u0438\u043D</div></div></div>
                <div class="${"footer_social svelte-d657ii"}"><span class="${"material-icons-outlined svelte-d657ii"}">whatsapp</span>
                    <span class="${"material-icons-outlined svelte-d657ii"}">catching_pokemon</span>
                    <span class="${"material-icons-outlined svelte-d657ii"}">reddit</span>
                    <span class="${"material-icons-outlined svelte-d657ii"}">shopify</span>
                    <span class="${"material-icons-outlined svelte-d657ii"}">cast</span></div></div>
            <div class="${"footer_menu svelte-d657ii"}"><div class="${"menu_item svelte-d657ii"}"><div class="${"menu_title svelte-d657ii"}">\u041E \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0435</div>
                    <a class="${"menu_link svelte-d657ii"}" href="${"."}">\u0423\u0441\u043B\u043E\u0432\u0438\u044F \u043E\u0431\u043C\u0435\u043D\u0430 \u0438 \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u0430</a>
                    <a class="${"menu_link svelte-d657ii"}" href="${"."}">\u041A\u0430\u0442\u0430\u043B\u043E\u0433</a>
                    <a class="${"menu_link svelte-d657ii"}" href="${"."}">\u041E \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438</a>
                    <a class="${"menu_link svelte-d657ii"}" href="${"."}">\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B</a>
                    <a class="${"menu_link svelte-d657ii"}" href="${"."}">\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430</a>
                    <a class="${"menu_link svelte-d657ii"}" href="${"."}">\u041E\u043F\u043B\u0430\u0442\u0430</a></div>
                <div class="${"menu_item svelte-d657ii"}"><div class="${"menu_title svelte-d657ii"}">\u041A\u043B\u0438\u0435\u043D\u0442\u0430\u043C</div>
                    <a class="${"menu_link svelte-d657ii"}" href="${"."}">\u041B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442</a>
                    <a class="${"menu_link svelte-d657ii"}" href="${"."}">\u0411\u043B\u043E\u0433</a>
                    <a class="${"menu_link svelte-d657ii"}" href="${"."}">\u041E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u0441\u0432\u044F\u0437\u044C</a></div>
                <div class="${"menu_item svelte-d657ii"}"><div class="${"menu_title svelte-d657ii"}">\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F</div>
                    <a class="${"menu_link svelte-d657ii"}" href="${"."}">\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u043E\u0435 \u0441\u043E\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435</a>
                    <a class="${"menu_link svelte-d657ii"}" href="${"."}">\u041F\u043E\u043B\u0438\u0442\u0438\u043A\u0430 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438 \u0438 \u043E\u0444\u0435\u0440\u0442\u0430</a></div></div></div></div>
    <div class="${"footer_about svelte-d657ii"}"><div class="${"container"}">\u0421\u043E\u0437\u0434\u0430\u043D\u043E \u043C\u0443\u0447\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0434\u043E\u043B\u0433\u043E, \u043D\u043E \u0443\u0432\u043B\u0435\u043A\u0430\u0442\u0435\u043B\u044C\u043D\u043E.</div></div>
</footer>`;
});
var css$w = {
  code: '.wrapper.svelte-1ko5c94{min-height:100vh;display:grid;grid-template-columns:100%;grid-template-rows:auto 1fr auto;grid-template-areas:"header"\r\n            "main"\r\n            "footer";margin:0 auto}',
  map: `{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<script>\\r\\n    import '../app.css'\\r\\n    import Header from '../components/Header/Header.svelte';\\r\\n    import Footer from '../components/Footer/Footer.svelte';\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"wrapper\\">\\r\\n    <Header/>\\r\\n    <main><slot></slot></main>\\r\\n    <Footer/>\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .wrapper {\\r\\n        min-height: 100vh;\\r\\n        display: grid;\\r\\n        grid-template-columns: 100%;\\r\\n        grid-template-rows: auto 1fr auto;\\r\\n        grid-template-areas: \\r\\n            \\"header\\"\\r\\n            \\"main\\"\\r\\n            \\"footer\\";\\r\\n\\r\\n        margin: 0 auto;\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAaI,QAAQ,eAAC,CAAC,AACN,UAAU,CAAE,KAAK,CACjB,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,IAAI,CAC3B,kBAAkB,CAAE,IAAI,CAAC,GAAG,CAAC,IAAI,CACjC,mBAAmB,CACf,QAAQ;YACR,MAAM;YACN,QAAQ,CAEZ,MAAM,CAAE,CAAC,CAAC,IAAI,AAClB,CAAC"}`
};
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$w);
  return `<div class="${"wrapper svelte-1ko5c94"}">${validate_component(Header, "Header").$$render($$result, {}, {}, {})}
    <main>${slots.default ? slots.default({}) : ``}</main>
    ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}
</div>`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load$3({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error2 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
});
var error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load: load$3
});
var css$v = {
  code: ".item_container.svelte-ge9z5g.svelte-ge9z5g{max-width:300px;margin:0 auto;position:relative}.cart_counter.svelte-ge9z5g.svelte-ge9z5g{position:absolute;min-width:1rem;height:1rem;top:-12px;right:-12px;background:var(--main-hover-color);color:#fff;border:1px solid var(--main-bg-color);font-size:0.5rem;display:flex;align-items:center;justify-content:center}li.svelte-ge9z5g.svelte-ge9z5g{display:flex;flex-direction:column;position:relative}.favorite_item.svelte-ge9z5g.svelte-ge9z5g{position:absolute;right:0;top:0;z-index:20;cursor:pointer;color:var(--main-text-color);background:var(--main-bg-color)}.favorite_item.svelte-ge9z5g.svelte-ge9z5g:hover{color:red}.favorite_item.svelte-ge9z5g .favorite.svelte-ge9z5g{color:red}.item_name.svelte-ge9z5g.svelte-ge9z5g{color:var(--main-text-color);transition:.2s;overflow:hidden;height:70px;display:inline-block;position:relative}.item_name.svelte-ge9z5g.svelte-ge9z5g:after{content:'';position:absolute;width:100%;bottom:0;left:0;height:20px;background:linear-gradient(to bottom, rgba(0,0,0,0), #fff)}.picture.svelte-ge9z5g.svelte-ge9z5g{display:flex;justify-content:center;width:100%;margin-bottom:1.2rem;position:relative;z-index:1}.preview_list.svelte-ge9z5g.svelte-ge9z5g{position:absolute;top:0;left:0;bottom:0;right:0;z-index:2;display:flex}.preview.svelte-ge9z5g.svelte-ge9z5g{height:100%;flex:1;position:relative}.preview.svelte-ge9z5g.svelte-ge9z5g:after{content:'';position:absolute;width:calc(100% - 5px);padding:0 1px;height:3px;background:rgba(0,0,0,.2);bottom:-10px}.preview.svelte-ge9z5g.svelte-ge9z5g:hover:after{background:var(--main-theme-color)}.picture.svelte-ge9z5g.svelte-ge9z5g{position:relative}.picture.svelte-ge9z5g img.svelte-ge9z5g{max-width:100%;height:150px}.price.svelte-ge9z5g.svelte-ge9z5g{font-size:1.3rem;font-weight:normal;font-weight:500}.item_link_img.svelte-ge9z5g.svelte-ge9z5g{flex-grow:1;position:relative;z-index:2}.item_link_img.svelte-ge9z5g:hover .item_name.svelte-ge9z5g{color:var(--main-theme-color)}.bottom.svelte-ge9z5g.svelte-ge9z5g{display:flex;align-items:center;justify-content:space-between}.cart.svelte-ge9z5g.svelte-ge9z5g{color:#fff;font-size:1rem}.cart_val_wrap.svelte-ge9z5g.svelte-ge9z5g{font-size:1rem;display:flex;align-items:center;justify-content:center;min-width:1.5rem;height:1.5rem;position:relative;font:400 1rem var(--font)}@media(max-width: 768px){.preview_list.svelte-ge9z5g.svelte-ge9z5g{display:none}}",
  map: `{"version":3,"file":"GoodItemView.svelte","sources":["GoodItemView.svelte"],"sourcesContent":["<script>\\r\\n    import { fade } from \\"svelte/transition\\";\\r\\n    import Button from \\"../../Helpers/Button.svelte\\";\\r\\n    import { favoriteCollection } from '../../../stores/favoriteStore';\\r\\n    import { cartCollection } from '../../../stores/cart';\\r\\n\\r\\n    export let {...item} = $$props;\\r\\n    export let categoryId;\\r\\n\\r\\n    let currentIndex = 0;\\r\\n    let defaultInfo = false;\\r\\n    $: cartElemCounter = 0;\\r\\n\\r\\n    $:  if(currentIndex > item.imgSet.length) {\\r\\n        currentIndex = 0;\\r\\n    } else if (currentIndex < 0) {\\r\\n        currentIndex = item.imgSet.length-1;\\r\\n    }\\r\\n    \\r\\n    function getImgSetIndex(i, imgs) {\\r\\n        currentIndex >= imgs.length ? currentIndex = 0 : currentIndex = i;\\r\\n    }\\r\\n    \\r\\n    function pushToFavorite() {\\r\\n        item.favorite = !item.favorite;\\r\\n        item.favorite \\r\\n        ? $favoriteCollection = [...$favoriteCollection, {...item}]\\r\\n        : $favoriteCollection = $favoriteCollection.filter(el => !el.name.includes(item.name))\\r\\n    }\\r\\n\\r\\n    $favoriteCollection.forEach(el => {\\r\\n        if(el.name === item.name) {\\r\\n            item.favorite = true;\\r\\n        }\\r\\n    });\\r\\n\\r\\n    $: $cartCollection.forEach(el => {\\r\\n        if(el.elem.name == item.name) {\\r\\n            cartElemCounter = el.cartCounter;\\r\\n        }\\r\\n    })\\r\\n    \\r\\n\\r\\n    function pushToCart() {\\r\\n        const cartElem = {\\r\\n            categoryId: categoryId,\\r\\n            elem: {...item},\\r\\n            cartCounter: cartElemCounter+1\\r\\n        }\\r\\n        const elemIndex = $cartCollection.findIndex(el => el.elem.name == item.name);\\r\\n        if(elemIndex >= 0) {\\r\\n            return ($cartCollection[elemIndex].cartCounter += 1);\\r\\n        }\\r\\n        $cartCollection = [...$cartCollection, cartElem];\\r\\n    }\\r\\n<\/script>\\r\\n\\r\\n<li>\\r\\n    <div class=\\"item_container\\">\\r\\n        <a href=\\"/{categoryId}/goodItems/{item.id}\\" class=\\"item_link_img\\">\\r\\n            <div class=\\"picture\\">\\r\\n                {#if !defaultInfo}\\r\\n                    {#key currentIndex}\\r\\n                        <img in:fade src=\\"{item.imgSet[currentIndex]}\\" alt={item.name} loading=\\"lazy\\">\\r\\n                    {/key}\\r\\n                {:else}\\r\\n                    {#if currentIndex}\\r\\n                        <img src=\\"default_img.svg\\" alt=\\"\\" loading=\\"lazy\\" transition:fade>\\r\\n                    {/if}\\r\\n                {/if}\\r\\n                <div class=\\"preview_list\\">    \\r\\n                    {#each item.imgSet as _, index}\\r\\n                        {#if item.imgSet.length > 1}\\r\\n                            <span class=\\"preview\\" on:mouseenter={() => getImgSetIndex(index, item.imgSet)} ></span>\\r\\n                        {/if}\\r\\n                    {/each}\\r\\n                </div>\\r\\n            </div>\\r\\n            <span class=\\"item_name\\">{item.name}</span>\\r\\n        </a>\\r\\n        <div class=\\"bottom\\">\\r\\n            <div class=\\"price\\">{(item.price).toLocaleString('ru')} \u0440\u0443\u0431</div>\\r\\n            <Button titleProp={\\"\u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443\\"} on:click={pushToCart}>\\r\\n                <span class=\\"cart_val_wrap\\">\\r\\n                    {#if cartElemCounter > 0}\\r\\n                        <span class=\\"cart_counter\\">{cartElemCounter}</span>\\r\\n                        <span>+1</span>\\r\\n                    {:else}\\r\\n                        <span class=\\"material-icons-outlined cart\\">shopping_cart</span>\\r\\n                    {/if}\\r\\n                </span>\\r\\n            </Button>\\r\\n        </div>\\r\\n\\r\\n        <div class=\\"favorite_item\\">\\r\\n            <span class=\\"material-icons-outlined\\"\\r\\n                class:favorite={item.favorite}\\r\\n                on:click={pushToFavorite}\\r\\n                >{item.favorite ? \\"favorite\\" : \\"favorite_border\\"}</span>\\r\\n        </div>\\r\\n    </div>\\r\\n</li>\\r\\n\\r\\n<style>\\r\\n    .item_container {\\r\\n        max-width: 300px;\\r\\n        margin: 0 auto;\\r\\n        position: relative;\\r\\n    }\\r\\n    .cart_counter {\\r\\n        position: absolute;\\r\\n        min-width: 1rem;\\r\\n        height: 1rem;\\r\\n        top: -12px;\\r\\n        right: -12px;\\r\\n        background: var(--main-hover-color);\\r\\n        color: #fff;\\r\\n        border: 1px solid var(--main-bg-color);\\r\\n        font-size: 0.5rem;\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: center;\\r\\n    }\\r\\n\\r\\n    li {\\r\\n        display: flex;\\r\\n        flex-direction: column;\\r\\n        position: relative;\\r\\n    }\\r\\n\\r\\n    .favorite_item {\\r\\n        position: absolute;\\r\\n        right: 0;\\r\\n        top: 0;\\r\\n        z-index: 20;\\r\\n        cursor: pointer;\\r\\n        color: var(--main-text-color);\\r\\n        background: var(--main-bg-color);\\r\\n    }\\r\\n\\r\\n    .favorite_item:hover {\\r\\n        color: red;\\r\\n    }\\r\\n\\r\\n    .favorite_item .favorite {\\r\\n        color: red;\\r\\n    }\\r\\n\\r\\n    .item_name {\\r\\n        color: var(--main-text-color);\\r\\n        transition: .2s;\\r\\n        overflow: hidden;\\r\\n        height: 70px;\\r\\n        display: inline-block;\\r\\n        position: relative;\\r\\n    }\\r\\n\\r\\n    .item_name:after {\\r\\n        content: '';\\r\\n        position: absolute;\\r\\n        width: 100%;\\r\\n        bottom: 0;\\r\\n        left: 0;\\r\\n        height: 20px;\\r\\n        background: linear-gradient(to bottom, rgba(0,0,0,0), #fff);\\r\\n    }\\r\\n\\r\\n    .picture {\\r\\n        display: flex;\\r\\n        justify-content: center;\\r\\n        width: 100%;\\r\\n        margin-bottom: 1.2rem;\\r\\n        position: relative;\\r\\n        z-index: 1;\\r\\n    }\\r\\n\\r\\n    .preview_list {\\r\\n        position: absolute;\\r\\n        top: 0;\\r\\n        left: 0;\\r\\n        bottom: 0;\\r\\n        right: 0;\\r\\n        z-index: 2;\\r\\n        display: flex;\\r\\n    }\\r\\n\\r\\n    .preview {\\r\\n        height: 100%;\\r\\n        flex: 1;\\r\\n        position: relative;\\r\\n    }\\r\\n\\r\\n    .preview:after {\\r\\n        content: '';\\r\\n        position: absolute;\\r\\n        width: calc(100% - 5px);\\r\\n        padding: 0 1px;\\r\\n        height: 3px;\\r\\n        background: rgba(0,0,0,.2);\\r\\n        bottom: -10px;\\r\\n    }\\r\\n\\r\\n    .preview:hover:after {\\r\\n        background: var(--main-theme-color);\\r\\n    }\\r\\n\\r\\n    .picture {\\r\\n        position: relative;\\r\\n    }\\r\\n    .picture img {\\r\\n        max-width: 100%;\\r\\n        height: 150px;\\r\\n    }\\r\\n\\r\\n    .price {\\r\\n        font-size: 1.3rem;\\r\\n        font-weight: normal;\\r\\n        font-weight: 500;\\r\\n    }\\r\\n\\r\\n    .item_link_img {\\r\\n        flex-grow: 1;\\r\\n        position: relative;\\r\\n        z-index: 2;\\r\\n    }\\r\\n\\r\\n    .item_link_img:hover .item_name {\\r\\n        color: var(--main-theme-color);\\r\\n    }\\r\\n\\r\\n    .bottom {\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: space-between;\\r\\n    }\\r\\n\\r\\n    .cart {\\r\\n        color: #fff;\\r\\n        font-size: 1rem;\\r\\n    }\\r\\n\\r\\n\\r\\n    .cart_val_wrap {\\r\\n        font-size: 1rem;\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: center;\\r\\n        min-width: 1.5rem;\\r\\n        height: 1.5rem;\\r\\n        position: relative;\\r\\n        font: 400 1rem var(--font);\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .preview_list {\\r\\n            display: none;\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAwGI,eAAe,4BAAC,CAAC,AACb,SAAS,CAAE,KAAK,CAChB,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,QAAQ,CAAE,QAAQ,AACtB,CAAC,AACD,aAAa,4BAAC,CAAC,AACX,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,IAAI,CACZ,GAAG,CAAE,KAAK,CACV,KAAK,CAAE,KAAK,CACZ,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,eAAe,CAAC,CACtC,SAAS,CAAE,MAAM,CACjB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,AAC3B,CAAC,AAED,EAAE,4BAAC,CAAC,AACA,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,QAAQ,CAAE,QAAQ,AACtB,CAAC,AAED,cAAc,4BAAC,CAAC,AACZ,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,CAAC,CACR,GAAG,CAAE,CAAC,CACN,OAAO,CAAE,EAAE,CACX,MAAM,CAAE,OAAO,CACf,KAAK,CAAE,IAAI,iBAAiB,CAAC,CAC7B,UAAU,CAAE,IAAI,eAAe,CAAC,AACpC,CAAC,AAED,0CAAc,MAAM,AAAC,CAAC,AAClB,KAAK,CAAE,GAAG,AACd,CAAC,AAED,4BAAc,CAAC,SAAS,cAAC,CAAC,AACtB,KAAK,CAAE,GAAG,AACd,CAAC,AAED,UAAU,4BAAC,CAAC,AACR,KAAK,CAAE,IAAI,iBAAiB,CAAC,CAC7B,UAAU,CAAE,GAAG,CACf,QAAQ,CAAE,MAAM,CAChB,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,YAAY,CACrB,QAAQ,CAAE,QAAQ,AACtB,CAAC,AAED,sCAAU,MAAM,AAAC,CAAC,AACd,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,gBAAgB,EAAE,CAAC,MAAM,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC/D,CAAC,AAED,QAAQ,4BAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,KAAK,CAAE,IAAI,CACX,aAAa,CAAE,MAAM,CACrB,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,CAAC,AACd,CAAC,AAED,aAAa,4BAAC,CAAC,AACX,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,MAAM,CAAE,CAAC,CACT,KAAK,CAAE,CAAC,CACR,OAAO,CAAE,CAAC,CACV,OAAO,CAAE,IAAI,AACjB,CAAC,AAED,QAAQ,4BAAC,CAAC,AACN,MAAM,CAAE,IAAI,CACZ,IAAI,CAAE,CAAC,CACP,QAAQ,CAAE,QAAQ,AACtB,CAAC,AAED,oCAAQ,MAAM,AAAC,CAAC,AACZ,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,GAAG,CAAC,CACvB,OAAO,CAAE,CAAC,CAAC,GAAG,CACd,MAAM,CAAE,GAAG,CACX,UAAU,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAC1B,MAAM,CAAE,KAAK,AACjB,CAAC,AAED,oCAAQ,MAAM,MAAM,AAAC,CAAC,AAClB,UAAU,CAAE,IAAI,kBAAkB,CAAC,AACvC,CAAC,AAED,QAAQ,4BAAC,CAAC,AACN,QAAQ,CAAE,QAAQ,AACtB,CAAC,AACD,sBAAQ,CAAC,GAAG,cAAC,CAAC,AACV,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,KAAK,AACjB,CAAC,AAED,MAAM,4BAAC,CAAC,AACJ,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,MAAM,CACnB,WAAW,CAAE,GAAG,AACpB,CAAC,AAED,cAAc,4BAAC,CAAC,AACZ,SAAS,CAAE,CAAC,CACZ,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,CAAC,AACd,CAAC,AAED,4BAAc,MAAM,CAAC,UAAU,cAAC,CAAC,AAC7B,KAAK,CAAE,IAAI,kBAAkB,CAAC,AAClC,CAAC,AAED,OAAO,4BAAC,CAAC,AACL,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,aAAa,AAClC,CAAC,AAED,KAAK,4BAAC,CAAC,AACH,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,IAAI,AACnB,CAAC,AAGD,cAAc,4BAAC,CAAC,AACZ,SAAS,CAAE,IAAI,CACf,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,SAAS,CAAE,MAAM,CACjB,MAAM,CAAE,MAAM,CACd,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CAAC,IAAI,CAAC,IAAI,MAAM,CAAC,AAC9B,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,aAAa,4BAAC,CAAC,AACX,OAAO,CAAE,IAAI,AACjB,CAAC,AACL,CAAC"}`
};
var GoodItemView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cartElemCounter;
  let $cartCollection, $$unsubscribe_cartCollection;
  let $favoriteCollection, $$unsubscribe_favoriteCollection;
  $$unsubscribe_cartCollection = subscribe(cartCollection, (value) => $cartCollection = value);
  $$unsubscribe_favoriteCollection = subscribe(favoriteCollection, (value) => $favoriteCollection = value);
  let { ...item_1 } = $$props;
  let { item = item_1 } = $$props;
  let { categoryId } = $$props;
  let currentIndex = 0;
  $favoriteCollection.forEach((el) => {
    if (el.name === item.name) {
      item.favorite = true;
    }
  });
  if ($$props.item === void 0 && $$bindings.item && item !== void 0)
    $$bindings.item(item);
  if ($$props.categoryId === void 0 && $$bindings.categoryId && categoryId !== void 0)
    $$bindings.categoryId(categoryId);
  $$result.css.add(css$v);
  cartElemCounter = 0;
  {
    if (currentIndex > item.imgSet.length) {
      currentIndex = 0;
    } else if (currentIndex < 0) {
      currentIndex = item.imgSet.length - 1;
    }
  }
  {
    $cartCollection.forEach((el) => {
      if (el.elem.name == item.name) {
        cartElemCounter = el.cartCounter;
      }
    });
  }
  $$unsubscribe_cartCollection();
  $$unsubscribe_favoriteCollection();
  return `<li class="${"svelte-ge9z5g"}"><div class="${"item_container svelte-ge9z5g"}"><a href="${"/" + escape(categoryId) + "/goodItems/" + escape(item.id)}" class="${"item_link_img svelte-ge9z5g"}"><div class="${"picture svelte-ge9z5g"}">${`<img${add_attribute("src", item.imgSet[currentIndex], 0)}${add_attribute("alt", item.name, 0)} loading="${"lazy"}" class="${"svelte-ge9z5g"}">`}
                <div class="${"preview_list svelte-ge9z5g"}">${each(item.imgSet, (_, index2) => `${item.imgSet.length > 1 ? `<span class="${"preview svelte-ge9z5g"}"></span>` : ``}`)}</div></div>
            <span class="${"item_name svelte-ge9z5g"}">${escape(item.name)}</span></a>
        <div class="${"bottom svelte-ge9z5g"}"><div class="${"price svelte-ge9z5g"}">${escape(item.price.toLocaleString("ru"))} \u0440\u0443\u0431</div>
            ${validate_component(Button, "Button").$$render($$result, { titleProp: "\u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443" }, {}, {
    default: () => `<span class="${"cart_val_wrap svelte-ge9z5g"}">${cartElemCounter > 0 ? `<span class="${"cart_counter svelte-ge9z5g"}">${escape(cartElemCounter)}</span>
                        <span>+1</span>` : `<span class="${"material-icons-outlined cart svelte-ge9z5g"}">shopping_cart</span>`}</span>`
  })}</div>

        <div class="${"favorite_item svelte-ge9z5g"}"><span class="${["material-icons-outlined svelte-ge9z5g", item.favorite ? "favorite" : ""].join(" ").trim()}">${escape(item.favorite ? "favorite" : "favorite_border")}</span></div></div>
</li>`;
});
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var siema_min = { exports: {} };
(function(module2, exports) {
  !function(e, t) {
    module2.exports = t();
  }(typeof self != "undefined" ? self : commonjsGlobal, function() {
    return function(e) {
      function t(r) {
        if (i[r])
          return i[r].exports;
        var n = i[r] = { i: r, l: false, exports: {} };
        return e[r].call(n.exports, n, n.exports, t), n.l = true, n.exports;
      }
      var i = {};
      return t.m = e, t.c = i, t.d = function(e2, i2, r) {
        t.o(e2, i2) || Object.defineProperty(e2, i2, { configurable: false, enumerable: true, get: r });
      }, t.n = function(e2) {
        var i2 = e2 && e2.__esModule ? function() {
          return e2.default;
        } : function() {
          return e2;
        };
        return t.d(i2, "a", i2), i2;
      }, t.o = function(e2, t2) {
        return Object.prototype.hasOwnProperty.call(e2, t2);
      }, t.p = "", t(t.s = 0);
    }([function(e, t, i) {
      function r(e2, t2) {
        if (!(e2 instanceof t2))
          throw new TypeError("Cannot call a class as a function");
      }
      Object.defineProperty(t, "__esModule", { value: true });
      var n = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e2) {
        return typeof e2;
      } : function(e2) {
        return e2 && typeof Symbol == "function" && e2.constructor === Symbol && e2 !== Symbol.prototype ? "symbol" : typeof e2;
      }, s2 = function() {
        function e2(e3, t2) {
          for (var i2 = 0; i2 < t2.length; i2++) {
            var r2 = t2[i2];
            r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(e3, r2.key, r2);
          }
        }
        return function(t2, i2, r2) {
          return i2 && e2(t2.prototype, i2), r2 && e2(t2, r2), t2;
        };
      }(), l = function() {
        function e2(t2) {
          var i2 = this;
          if (r(this, e2), this.config = e2.mergeSettings(t2), this.selector = typeof this.config.selector == "string" ? document.querySelector(this.config.selector) : this.config.selector, this.selector === null)
            throw new Error("Something wrong with your selector \u{1F62D}");
          this.resolveSlidesNumber(), this.selectorWidth = this.selector.offsetWidth, this.innerElements = [].slice.call(this.selector.children), this.currentSlide = this.config.loop ? this.config.startIndex % this.innerElements.length : Math.max(0, Math.min(this.config.startIndex, this.innerElements.length - this.perPage)), this.transformProperty = e2.webkitOrNot(), ["resizeHandler", "touchstartHandler", "touchendHandler", "touchmoveHandler", "mousedownHandler", "mouseupHandler", "mouseleaveHandler", "mousemoveHandler", "clickHandler"].forEach(function(e3) {
            i2[e3] = i2[e3].bind(i2);
          }), this.init();
        }
        return s2(e2, [{ key: "attachEvents", value: function() {
          window.addEventListener("resize", this.resizeHandler), this.config.draggable && (this.pointerDown = false, this.drag = { startX: 0, endX: 0, startY: 0, letItGo: null, preventClick: false }, this.selector.addEventListener("touchstart", this.touchstartHandler), this.selector.addEventListener("touchend", this.touchendHandler), this.selector.addEventListener("touchmove", this.touchmoveHandler), this.selector.addEventListener("mousedown", this.mousedownHandler), this.selector.addEventListener("mouseup", this.mouseupHandler), this.selector.addEventListener("mouseleave", this.mouseleaveHandler), this.selector.addEventListener("mousemove", this.mousemoveHandler), this.selector.addEventListener("click", this.clickHandler));
        } }, { key: "detachEvents", value: function() {
          window.removeEventListener("resize", this.resizeHandler), this.selector.removeEventListener("touchstart", this.touchstartHandler), this.selector.removeEventListener("touchend", this.touchendHandler), this.selector.removeEventListener("touchmove", this.touchmoveHandler), this.selector.removeEventListener("mousedown", this.mousedownHandler), this.selector.removeEventListener("mouseup", this.mouseupHandler), this.selector.removeEventListener("mouseleave", this.mouseleaveHandler), this.selector.removeEventListener("mousemove", this.mousemoveHandler), this.selector.removeEventListener("click", this.clickHandler);
        } }, { key: "init", value: function() {
          this.attachEvents(), this.selector.style.overflow = "hidden", this.selector.style.direction = this.config.rtl ? "rtl" : "ltr", this.buildSliderFrame(), this.config.onInit.call(this);
        } }, { key: "buildSliderFrame", value: function() {
          var e3 = this.selectorWidth / this.perPage, t2 = this.config.loop ? this.innerElements.length + 2 * this.perPage : this.innerElements.length;
          this.sliderFrame = document.createElement("div"), this.sliderFrame.style.width = e3 * t2 + "px", this.enableTransition(), this.config.draggable && (this.selector.style.cursor = "-webkit-grab");
          var i2 = document.createDocumentFragment();
          if (this.config.loop)
            for (var r2 = this.innerElements.length - this.perPage; r2 < this.innerElements.length; r2++) {
              var n2 = this.buildSliderFrameItem(this.innerElements[r2].cloneNode(true));
              i2.appendChild(n2);
            }
          for (var s3 = 0; s3 < this.innerElements.length; s3++) {
            var l2 = this.buildSliderFrameItem(this.innerElements[s3]);
            i2.appendChild(l2);
          }
          if (this.config.loop)
            for (var o = 0; o < this.perPage; o++) {
              var a = this.buildSliderFrameItem(this.innerElements[o].cloneNode(true));
              i2.appendChild(a);
            }
          this.sliderFrame.appendChild(i2), this.selector.innerHTML = "", this.selector.appendChild(this.sliderFrame), this.slideToCurrent();
        } }, { key: "buildSliderFrameItem", value: function(e3) {
          var t2 = document.createElement("div");
          return t2.style.cssFloat = this.config.rtl ? "right" : "left", t2.style.float = this.config.rtl ? "right" : "left", t2.style.width = (this.config.loop ? 100 / (this.innerElements.length + 2 * this.perPage) : 100 / this.innerElements.length) + "%", t2.appendChild(e3), t2;
        } }, { key: "resolveSlidesNumber", value: function() {
          if (typeof this.config.perPage == "number")
            this.perPage = this.config.perPage;
          else if (n(this.config.perPage) === "object") {
            this.perPage = 1;
            for (var e3 in this.config.perPage)
              window.innerWidth >= e3 && (this.perPage = this.config.perPage[e3]);
          }
        } }, { key: "prev", value: function() {
          var e3 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, t2 = arguments[1];
          if (!(this.innerElements.length <= this.perPage)) {
            var i2 = this.currentSlide;
            if (this.config.loop) {
              if (this.currentSlide - e3 < 0) {
                this.disableTransition();
                var r2 = this.currentSlide + this.innerElements.length, n2 = this.perPage, s3 = r2 + n2, l2 = (this.config.rtl ? 1 : -1) * s3 * (this.selectorWidth / this.perPage), o = this.config.draggable ? this.drag.endX - this.drag.startX : 0;
                this.sliderFrame.style[this.transformProperty] = "translate3d(" + (l2 + o) + "px, 0, 0)", this.currentSlide = r2 - e3;
              } else
                this.currentSlide = this.currentSlide - e3;
            } else
              this.currentSlide = Math.max(this.currentSlide - e3, 0);
            i2 !== this.currentSlide && (this.slideToCurrent(this.config.loop), this.config.onChange.call(this), t2 && t2.call(this));
          }
        } }, { key: "next", value: function() {
          var e3 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, t2 = arguments[1];
          if (!(this.innerElements.length <= this.perPage)) {
            var i2 = this.currentSlide;
            if (this.config.loop) {
              if (this.currentSlide + e3 > this.innerElements.length - this.perPage) {
                this.disableTransition();
                var r2 = this.currentSlide - this.innerElements.length, n2 = this.perPage, s3 = r2 + n2, l2 = (this.config.rtl ? 1 : -1) * s3 * (this.selectorWidth / this.perPage), o = this.config.draggable ? this.drag.endX - this.drag.startX : 0;
                this.sliderFrame.style[this.transformProperty] = "translate3d(" + (l2 + o) + "px, 0, 0)", this.currentSlide = r2 + e3;
              } else
                this.currentSlide = this.currentSlide + e3;
            } else
              this.currentSlide = Math.min(this.currentSlide + e3, this.innerElements.length - this.perPage);
            i2 !== this.currentSlide && (this.slideToCurrent(this.config.loop), this.config.onChange.call(this), t2 && t2.call(this));
          }
        } }, { key: "disableTransition", value: function() {
          this.sliderFrame.style.webkitTransition = "all 0ms " + this.config.easing, this.sliderFrame.style.transition = "all 0ms " + this.config.easing;
        } }, { key: "enableTransition", value: function() {
          this.sliderFrame.style.webkitTransition = "all " + this.config.duration + "ms " + this.config.easing, this.sliderFrame.style.transition = "all " + this.config.duration + "ms " + this.config.easing;
        } }, { key: "goTo", value: function(e3, t2) {
          if (!(this.innerElements.length <= this.perPage)) {
            var i2 = this.currentSlide;
            this.currentSlide = this.config.loop ? e3 % this.innerElements.length : Math.min(Math.max(e3, 0), this.innerElements.length - this.perPage), i2 !== this.currentSlide && (this.slideToCurrent(), this.config.onChange.call(this), t2 && t2.call(this));
          }
        } }, { key: "slideToCurrent", value: function(e3) {
          var t2 = this, i2 = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide, r2 = (this.config.rtl ? 1 : -1) * i2 * (this.selectorWidth / this.perPage);
          e3 ? requestAnimationFrame(function() {
            requestAnimationFrame(function() {
              t2.enableTransition(), t2.sliderFrame.style[t2.transformProperty] = "translate3d(" + r2 + "px, 0, 0)";
            });
          }) : this.sliderFrame.style[this.transformProperty] = "translate3d(" + r2 + "px, 0, 0)";
        } }, { key: "updateAfterDrag", value: function() {
          var e3 = (this.config.rtl ? -1 : 1) * (this.drag.endX - this.drag.startX), t2 = Math.abs(e3), i2 = this.config.multipleDrag ? Math.ceil(t2 / (this.selectorWidth / this.perPage)) : 1, r2 = e3 > 0 && this.currentSlide - i2 < 0, n2 = e3 < 0 && this.currentSlide + i2 > this.innerElements.length - this.perPage;
          e3 > 0 && t2 > this.config.threshold && this.innerElements.length > this.perPage ? this.prev(i2) : e3 < 0 && t2 > this.config.threshold && this.innerElements.length > this.perPage && this.next(i2), this.slideToCurrent(r2 || n2);
        } }, { key: "resizeHandler", value: function() {
          this.resolveSlidesNumber(), this.currentSlide + this.perPage > this.innerElements.length && (this.currentSlide = this.innerElements.length <= this.perPage ? 0 : this.innerElements.length - this.perPage), this.selectorWidth = this.selector.offsetWidth, this.buildSliderFrame();
        } }, { key: "clearDrag", value: function() {
          this.drag = { startX: 0, endX: 0, startY: 0, letItGo: null, preventClick: this.drag.preventClick };
        } }, { key: "touchstartHandler", value: function(e3) {
          ["TEXTAREA", "OPTION", "INPUT", "SELECT"].indexOf(e3.target.nodeName) !== -1 || (e3.stopPropagation(), this.pointerDown = true, this.drag.startX = e3.touches[0].pageX, this.drag.startY = e3.touches[0].pageY);
        } }, { key: "touchendHandler", value: function(e3) {
          e3.stopPropagation(), this.pointerDown = false, this.enableTransition(), this.drag.endX && this.updateAfterDrag(), this.clearDrag();
        } }, { key: "touchmoveHandler", value: function(e3) {
          if (e3.stopPropagation(), this.drag.letItGo === null && (this.drag.letItGo = Math.abs(this.drag.startY - e3.touches[0].pageY) < Math.abs(this.drag.startX - e3.touches[0].pageX)), this.pointerDown && this.drag.letItGo) {
            e3.preventDefault(), this.drag.endX = e3.touches[0].pageX, this.sliderFrame.style.webkitTransition = "all 0ms " + this.config.easing, this.sliderFrame.style.transition = "all 0ms " + this.config.easing;
            var t2 = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide, i2 = t2 * (this.selectorWidth / this.perPage), r2 = this.drag.endX - this.drag.startX, n2 = this.config.rtl ? i2 + r2 : i2 - r2;
            this.sliderFrame.style[this.transformProperty] = "translate3d(" + (this.config.rtl ? 1 : -1) * n2 + "px, 0, 0)";
          }
        } }, { key: "mousedownHandler", value: function(e3) {
          ["TEXTAREA", "OPTION", "INPUT", "SELECT"].indexOf(e3.target.nodeName) !== -1 || (e3.preventDefault(), e3.stopPropagation(), this.pointerDown = true, this.drag.startX = e3.pageX);
        } }, { key: "mouseupHandler", value: function(e3) {
          e3.stopPropagation(), this.pointerDown = false, this.selector.style.cursor = "-webkit-grab", this.enableTransition(), this.drag.endX && this.updateAfterDrag(), this.clearDrag();
        } }, { key: "mousemoveHandler", value: function(e3) {
          if (e3.preventDefault(), this.pointerDown) {
            e3.target.nodeName === "A" && (this.drag.preventClick = true), this.drag.endX = e3.pageX, this.selector.style.cursor = "-webkit-grabbing", this.sliderFrame.style.webkitTransition = "all 0ms " + this.config.easing, this.sliderFrame.style.transition = "all 0ms " + this.config.easing;
            var t2 = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide, i2 = t2 * (this.selectorWidth / this.perPage), r2 = this.drag.endX - this.drag.startX, n2 = this.config.rtl ? i2 + r2 : i2 - r2;
            this.sliderFrame.style[this.transformProperty] = "translate3d(" + (this.config.rtl ? 1 : -1) * n2 + "px, 0, 0)";
          }
        } }, { key: "mouseleaveHandler", value: function(e3) {
          this.pointerDown && (this.pointerDown = false, this.selector.style.cursor = "-webkit-grab", this.drag.endX = e3.pageX, this.drag.preventClick = false, this.enableTransition(), this.updateAfterDrag(), this.clearDrag());
        } }, { key: "clickHandler", value: function(e3) {
          this.drag.preventClick && e3.preventDefault(), this.drag.preventClick = false;
        } }, { key: "remove", value: function(e3, t2) {
          if (e3 < 0 || e3 >= this.innerElements.length)
            throw new Error("Item to remove doesn't exist \u{1F62D}");
          var i2 = e3 < this.currentSlide, r2 = this.currentSlide + this.perPage - 1 === e3;
          (i2 || r2) && this.currentSlide--, this.innerElements.splice(e3, 1), this.buildSliderFrame(), t2 && t2.call(this);
        } }, { key: "insert", value: function(e3, t2, i2) {
          if (t2 < 0 || t2 > this.innerElements.length + 1)
            throw new Error("Unable to inset it at this index \u{1F62D}");
          if (this.innerElements.indexOf(e3) !== -1)
            throw new Error("The same item in a carousel? Really? Nope \u{1F62D}");
          var r2 = t2 <= this.currentSlide > 0 && this.innerElements.length;
          this.currentSlide = r2 ? this.currentSlide + 1 : this.currentSlide, this.innerElements.splice(t2, 0, e3), this.buildSliderFrame(), i2 && i2.call(this);
        } }, { key: "prepend", value: function(e3, t2) {
          this.insert(e3, 0), t2 && t2.call(this);
        } }, { key: "append", value: function(e3, t2) {
          this.insert(e3, this.innerElements.length + 1), t2 && t2.call(this);
        } }, { key: "destroy", value: function() {
          var e3 = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], t2 = arguments[1];
          if (this.detachEvents(), this.selector.style.cursor = "auto", e3) {
            for (var i2 = document.createDocumentFragment(), r2 = 0; r2 < this.innerElements.length; r2++)
              i2.appendChild(this.innerElements[r2]);
            this.selector.innerHTML = "", this.selector.appendChild(i2), this.selector.removeAttribute("style");
          }
          t2 && t2.call(this);
        } }], [{ key: "mergeSettings", value: function(e3) {
          var t2 = { selector: ".siema", duration: 200, easing: "ease-out", perPage: 1, startIndex: 0, draggable: true, multipleDrag: true, threshold: 20, loop: false, rtl: false, onInit: function() {
          }, onChange: function() {
          } }, i2 = e3;
          for (var r2 in i2)
            t2[r2] = i2[r2];
          return t2;
        } }, { key: "webkitOrNot", value: function() {
          return typeof document.documentElement.style.transform == "string" ? "transform" : "WebkitTransform";
        } }]), e2;
      }();
      t.default = l, e.exports = t.default;
    }]);
  });
})(siema_min);
var css$u = {
  code: ".carousel.svelte-1ppqxio.svelte-1ppqxio{position:relative;width:100%;justify-content:center;align-items:center}button.svelte-1ppqxio.svelte-1ppqxio{position:absolute;width:40px;height:40px;top:50%;z-index:50;margin-top:-20px;border:none;background-color:transparent}button.svelte-1ppqxio.svelte-1ppqxio:focus{outline:none}.left.svelte-1ppqxio.svelte-1ppqxio{left:2vw}.right.svelte-1ppqxio.svelte-1ppqxio{right:2vw}ul.svelte-1ppqxio.svelte-1ppqxio{list-style-type:none;position:absolute;display:flex;justify-content:center;width:100%;margin-top:-30px;padding:0}ul.svelte-1ppqxio li.svelte-1ppqxio{margin:6px;border-radius:100%;background-color:rgba(255,255,255,0.5);height:8px;width:8px}ul.svelte-1ppqxio li.svelte-1ppqxio:hover{background-color:rgba(255,255,255,0.85)}ul.svelte-1ppqxio li.active.svelte-1ppqxio{background-color:rgba(255,255,255,1)}",
  map: `{"version":3,"file":"Carousel.svelte","sources":["Carousel.svelte"],"sourcesContent":["\\n<div class=\\"carousel\\">\\n\\t<div class=\\"slides\\" bind:this={siema}>\\n\\t\\t<slot></slot>\\n\\t</div>\\n\\t{#if controls}\\n\\t<button class=\\"left\\" on:click={left} aria-label=\\"left\\">\\n\\t\\t<slot name=\\"left-control\\"></slot>\\n\\t</button>\\n\\t<button class=\\"right\\" on:click={right} aria-label=\\"right\\">\\n\\t\\t<slot name=\\"right-control\\"></slot>\\n\\t</button>\\n\\t{/if}\\n    {#if dots}\\n\\t<ul>\\n\\t\\t{#each {length: totalDots} as _, i}\\n\\t\\t<li on:click={() => go(i*currentPerPage)} class={isDotActive(currentIndex, i) ? \\"active\\" : \\"\\"}></li>\\n\\t\\t{/each}\\n\\t</ul>\\n    {/if}\\n</div>\\n\\n<style>\\n\\t.carousel {\\n\\t\\tposition: relative;\\n\\t\\twidth: 100%;\\n\\t\\tjustify-content: center;\\n\\t\\talign-items: center;\\n\\t}\\n\\t\\n\\tbutton {\\n\\t\\tposition: absolute;\\n\\t\\twidth: 40px;\\n\\t\\theight: 40px;\\n\\t\\ttop: 50%;\\n\\t\\tz-index: 50;\\n\\t\\tmargin-top: -20px;\\n\\t\\tborder: none;\\n\\t\\tbackground-color: transparent;\\n\\t}\\n\\n  button:focus {\\n    outline: none;\\n  }\\n\\t\\n\\t.left {\\n\\t\\tleft: 2vw;\\n\\t}\\n\\t\\n\\t.right {\\n\\t\\tright: 2vw;\\n\\t}\\n\\n\\tul {\\n\\t\\tlist-style-type: none;\\n\\t\\tposition: absolute;\\n\\t\\tdisplay: flex;\\n\\t\\tjustify-content: center;\\n\\t\\twidth: 100%;\\n\\t\\tmargin-top: -30px;\\n\\t\\tpadding: 0;\\n\\t}\\n\\n\\tul li {\\n\\t\\tmargin: 6px;\\n\\t\\tborder-radius: 100%;\\n\\t\\tbackground-color: rgba(255,255,255,0.5);\\n\\t\\theight: 8px;\\n\\t\\twidth: 8px;\\n\\t}\\n\\n\\tul li:hover {\\n\\t\\tbackground-color: rgba(255,255,255,0.85);\\n\\t}\\n\\n\\tul li.active {\\n\\t\\tbackground-color: rgba(255,255,255,1);\\n\\t}\\n</style>\\n\\n<script>\\n\\timport Siema from 'siema'\\n\\timport { onMount, createEventDispatcher } from 'svelte'\\n\\t\\n\\texport let perPage = 3\\n\\texport let loop = true\\n\\texport let autoplay = 0\\n\\texport let duration = 200\\n\\texport let easing = 'ease-out'\\n\\texport let startIndex = 0\\n\\texport let draggable = true\\n\\texport let multipleDrag = true\\t\\n\\texport let dots = true\\t\\n\\texport let controls = true\\n\\texport let threshold = 20\\n\\texport let rtl = false\\n\\tlet currentIndex = startIndex;\\n\\t\\n\\tlet siema\\n\\tlet controller\\n\\tlet timer\\n\\n\\tconst dispatch = createEventDispatcher()\\n\\n\\t$: pips = controller ? controller.innerElements : []\\n\\t$: currentPerPage = controller ? controller.perPage : perPage\\n\\t$: totalDots = controller ? Math.ceil(controller.innerElements.length / currentPerPage) : []\\n\\t\\n\\tonMount(() => {\\n\\t\\tcontroller = new Siema({\\n\\t\\t\\tselector: siema,\\n\\t\\t\\tperPage: typeof perPage === 'object' ? perPage : Number(perPage),\\n\\t\\t\\tloop,\\n  \\t\\t\\tduration,\\n  \\t\\t\\teasing,\\n  \\t\\t\\tstartIndex,\\n  \\t\\t\\tdraggable,\\n \\t\\t\\tmultipleDrag,\\n  \\t\\t\\tthreshold,\\n  \\t\\t\\trtl,\\n\\t\\t\\tonChange: handleChange\\n\\t\\t})\\n\\t\\t\\n\\t\\tif(autoplay) {\\n\\t\\t\\ttimer = setInterval(right, autoplay);\\n\\t\\t}\\n\\n\\t\\treturn () => {\\n\\t\\t\\tautoplay && clearInterval(timer)\\n\\t\\t\\tcontroller.destroy()\\n\\t\\t}\\n\\t})\\n\\n\\texport function isDotActive (currentIndex, dotIndex) {\\n        if (currentIndex < 0) currentIndex = pips.length + currentIndex;\\n        return currentIndex >= dotIndex*currentPerPage && currentIndex < (dotIndex*currentPerPage)+currentPerPage\\n    }\\n\\t\\n\\texport function left () {\\n\\t\\tcontroller.prev()\\n\\t}\\n\\t\\n\\texport function right () {\\n\\t\\tcontroller.next()\\n\\t}\\n\\n\\texport function go (index) {\\n\\t\\tcontroller.goTo(index)\\n\\t}\\n\\t\\n\\texport function pause() {\\n\\t\\tclearInterval(timer);\\n\\t}\\n\\n\\texport function resume() {\\n\\t\\tif (autoplay) {\\n\\t\\t\\ttimer = setInterval(right, autoplay);\\n\\t\\t}\\n\\t}\\n\\n\\tfunction handleChange (event) {\\n\\t\\tcurrentIndex = controller.currentSlide\\n\\n\\t\\tdispatch('change', {\\n\\t\\t\\tcurrentSlide: controller.currentSlide,\\n\\t\\t\\tslideCount: controller.innerElements.length\\n\\t\\t} )\\n\\t}\\n<\/script>\\n"],"names":[],"mappings":"AAuBC,SAAS,8BAAC,CAAC,AACV,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,IAAI,CACX,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,AACpB,CAAC,AAED,MAAM,8BAAC,CAAC,AACP,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,GAAG,CAAE,GAAG,CACR,OAAO,CAAE,EAAE,CACX,UAAU,CAAE,KAAK,CACjB,MAAM,CAAE,IAAI,CACZ,gBAAgB,CAAE,WAAW,AAC9B,CAAC,AAEA,oCAAM,MAAM,AAAC,CAAC,AACZ,OAAO,CAAE,IAAI,AACf,CAAC,AAEF,KAAK,8BAAC,CAAC,AACN,IAAI,CAAE,GAAG,AACV,CAAC,AAED,MAAM,8BAAC,CAAC,AACP,KAAK,CAAE,GAAG,AACX,CAAC,AAED,EAAE,8BAAC,CAAC,AACH,eAAe,CAAE,IAAI,CACrB,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,KAAK,CACjB,OAAO,CAAE,CAAC,AACX,CAAC,AAED,iBAAE,CAAC,EAAE,eAAC,CAAC,AACN,MAAM,CAAE,GAAG,CACX,aAAa,CAAE,IAAI,CACnB,gBAAgB,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CACvC,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,GAAG,AACX,CAAC,AAED,iBAAE,CAAC,iBAAE,MAAM,AAAC,CAAC,AACZ,gBAAgB,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,AACzC,CAAC,AAED,iBAAE,CAAC,EAAE,OAAO,eAAC,CAAC,AACb,gBAAgB,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,AACtC,CAAC"}`
};
var Carousel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let pips;
  let currentPerPage;
  let totalDots;
  let { perPage = 3 } = $$props;
  let { loop: loop2 = true } = $$props;
  let { autoplay = 0 } = $$props;
  let { duration = 200 } = $$props;
  let { easing = "ease-out" } = $$props;
  let { startIndex = 0 } = $$props;
  let { draggable = true } = $$props;
  let { multipleDrag = true } = $$props;
  let { dots = true } = $$props;
  let { controls = true } = $$props;
  let { threshold = 20 } = $$props;
  let { rtl = false } = $$props;
  let currentIndex = startIndex;
  let siema;
  let controller;
  let timer;
  createEventDispatcher();
  function isDotActive(currentIndex2, dotIndex) {
    if (currentIndex2 < 0)
      currentIndex2 = pips.length + currentIndex2;
    return currentIndex2 >= dotIndex * currentPerPage && currentIndex2 < dotIndex * currentPerPage + currentPerPage;
  }
  function left() {
    controller.prev();
  }
  function right() {
    controller.next();
  }
  function go(index2) {
    controller.goTo(index2);
  }
  function pause() {
    clearInterval(timer);
  }
  function resume() {
    if (autoplay) {
      timer = setInterval(right, autoplay);
    }
  }
  if ($$props.perPage === void 0 && $$bindings.perPage && perPage !== void 0)
    $$bindings.perPage(perPage);
  if ($$props.loop === void 0 && $$bindings.loop && loop2 !== void 0)
    $$bindings.loop(loop2);
  if ($$props.autoplay === void 0 && $$bindings.autoplay && autoplay !== void 0)
    $$bindings.autoplay(autoplay);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.easing === void 0 && $$bindings.easing && easing !== void 0)
    $$bindings.easing(easing);
  if ($$props.startIndex === void 0 && $$bindings.startIndex && startIndex !== void 0)
    $$bindings.startIndex(startIndex);
  if ($$props.draggable === void 0 && $$bindings.draggable && draggable !== void 0)
    $$bindings.draggable(draggable);
  if ($$props.multipleDrag === void 0 && $$bindings.multipleDrag && multipleDrag !== void 0)
    $$bindings.multipleDrag(multipleDrag);
  if ($$props.dots === void 0 && $$bindings.dots && dots !== void 0)
    $$bindings.dots(dots);
  if ($$props.controls === void 0 && $$bindings.controls && controls !== void 0)
    $$bindings.controls(controls);
  if ($$props.threshold === void 0 && $$bindings.threshold && threshold !== void 0)
    $$bindings.threshold(threshold);
  if ($$props.rtl === void 0 && $$bindings.rtl && rtl !== void 0)
    $$bindings.rtl(rtl);
  if ($$props.isDotActive === void 0 && $$bindings.isDotActive && isDotActive !== void 0)
    $$bindings.isDotActive(isDotActive);
  if ($$props.left === void 0 && $$bindings.left && left !== void 0)
    $$bindings.left(left);
  if ($$props.right === void 0 && $$bindings.right && right !== void 0)
    $$bindings.right(right);
  if ($$props.go === void 0 && $$bindings.go && go !== void 0)
    $$bindings.go(go);
  if ($$props.pause === void 0 && $$bindings.pause && pause !== void 0)
    $$bindings.pause(pause);
  if ($$props.resume === void 0 && $$bindings.resume && resume !== void 0)
    $$bindings.resume(resume);
  $$result.css.add(css$u);
  pips = [];
  currentPerPage = perPage;
  totalDots = [];
  return `<div class="${"carousel svelte-1ppqxio"}"><div class="${"slides"}"${add_attribute("this", siema, 0)}>${slots.default ? slots.default({}) : ``}</div>
	${controls ? `<button class="${"left svelte-1ppqxio"}" aria-label="${"left"}">${slots["left-control"] ? slots["left-control"]({}) : ``}</button>
	<button class="${"right svelte-1ppqxio"}" aria-label="${"right"}">${slots["right-control"] ? slots["right-control"]({}) : ``}</button>` : ``}
    ${dots ? `<ul class="${"svelte-1ppqxio"}">${each({ length: totalDots }, (_, i) => `<li class="${escape(null_to_empty(isDotActive(currentIndex, i) ? "active" : "")) + " svelte-1ppqxio"}"></li>`)}</ul>` : ``}
</div>`;
});
var css$t = {
  code: ".control.svelte-1dluslp{color:var(--main-text-color)}.control.svelte-1dluslp:hover{color:var(--main-theme-color)}.carousel_title.svelte-1dluslp{font-size:1.5rem;font-weight:500;margin:4rem 0 1rem}.carousel_container.svelte-1dluslp .carousel li{padding:0 1rem}.carousel_container.svelte-1dluslp .carousel button.left{top:-2rem;left:calc(100% - 120px)!important}.carousel_container.svelte-1dluslp .carousel button.right{top:-2rem;left:none;right:0}@media(max-width: 768px){.control.svelte-1dluslp{display:none}.carousel_title.svelte-1dluslp{margin:1rem 0}}",
  map: `{"version":3,"file":"CarouselComponent.svelte","sources":["CarouselComponent.svelte"],"sourcesContent":["<script>\\r\\n    import Model from '../../model/data-service';\\r\\n    import GoodItemView from '../../components/Main/Good/GoodItemView.svelte';\\r\\n    import Carousel from '@beyonk/svelte-carousel';\\r\\n\\r\\n    export let categoryId;\\r\\n\\r\\n    const temp = new Model();\\r\\n    const staticData = temp.getCategoryItem(categoryId);\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"carousel_container\\">\\r\\n    {#await staticData then value}\\r\\n        <div class=\\"carousel_title\\">\\r\\n            {value.catName}\\r\\n        </div>\\r\\n        <Carousel perPage={{1200: 6, 992: 4, 768: 3, 500: 2}} loop={false} dots={false}>\\r\\n            <span class=\\"control\\" slot=\\"left-control\\">\\r\\n                <span class=\\"material-icons-outlined\\">arrow_back</span>\\r\\n            </span>\\r\\n            {#each value.category as item}\\r\\n                <GoodItemView {...item} {categoryId}/>\\r\\n            {/each}\\r\\n            <span class=\\"control\\" slot=\\"right-control\\">\\r\\n                <span class=\\"material-icons-outlined\\">arrow_forward</span>\\r\\n            </span>\\r\\n        </Carousel>\\r\\n    {/await}\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .control {\\r\\n        color: var(--main-text-color);\\r\\n    }\\r\\n    .control:hover {\\r\\n        color: var(--main-theme-color);\\r\\n    }\\r\\n\\r\\n    .carousel_title {\\r\\n        font-size: 1.5rem;\\r\\n        font-weight: 500;\\r\\n        margin: 4rem 0 1rem;\\r\\n    }\\r\\n\\r\\n    .carousel_container :global(.carousel li) {\\r\\n        padding: 0 1rem;\\r\\n    }\\r\\n\\r\\n    .carousel_container :global(.carousel button.left) {\\r\\n        top: -2rem;\\r\\n        left: calc(100% - 120px)!important;\\r\\n    }\\r\\n\\r\\n    .carousel_container :global(.carousel button.right) {\\r\\n        top: -2rem;\\r\\n        left: none;\\r\\n        right: 0;\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .control {\\r\\n            display: none;\\r\\n        }\\r\\n\\r\\n        .carousel_title {\\r\\n            margin: 1rem 0;\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AA+BI,QAAQ,eAAC,CAAC,AACN,KAAK,CAAE,IAAI,iBAAiB,CAAC,AACjC,CAAC,AACD,uBAAQ,MAAM,AAAC,CAAC,AACZ,KAAK,CAAE,IAAI,kBAAkB,CAAC,AAClC,CAAC,AAED,eAAe,eAAC,CAAC,AACb,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,MAAM,CAAE,IAAI,CAAC,CAAC,CAAC,IAAI,AACvB,CAAC,AAED,kCAAmB,CAAC,AAAQ,YAAY,AAAE,CAAC,AACvC,OAAO,CAAE,CAAC,CAAC,IAAI,AACnB,CAAC,AAED,kCAAmB,CAAC,AAAQ,qBAAqB,AAAE,CAAC,AAChD,GAAG,CAAE,KAAK,CACV,IAAI,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,KAAK,CAAC,UAAU,AACtC,CAAC,AAED,kCAAmB,CAAC,AAAQ,sBAAsB,AAAE,CAAC,AACjD,GAAG,CAAE,KAAK,CACV,IAAI,CAAE,IAAI,CACV,KAAK,CAAE,CAAC,AACZ,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,QAAQ,eAAC,CAAC,AACN,OAAO,CAAE,IAAI,AACjB,CAAC,AAED,eAAe,eAAC,CAAC,AACb,MAAM,CAAE,IAAI,CAAC,CAAC,AAClB,CAAC,AACL,CAAC"}`
};
var CarouselComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { categoryId } = $$props;
  const temp = new Model();
  const staticData = temp.getCategoryItem(categoryId);
  if ($$props.categoryId === void 0 && $$bindings.categoryId && categoryId !== void 0)
    $$bindings.categoryId(categoryId);
  $$result.css.add(css$t);
  return `<div class="${"carousel_container svelte-1dluslp"}">${function(__value) {
    if (is_promise(__value))
      return ``;
    return function(value) {
      return `
        <div class="${"carousel_title svelte-1dluslp"}">${escape(value.catName)}</div>
        ${validate_component(Carousel, "Carousel").$$render($$result, {
        perPage: { 1200: 6, 992: 4, 768: 3, 500: 2 },
        loop: false,
        dots: false
      }, {}, {
        "right-control": () => `<span class="${"control svelte-1dluslp"}" slot="${"right-control"}"><span class="${"material-icons-outlined"}">arrow_forward</span></span>`,
        "left-control": () => `<span class="${"control svelte-1dluslp"}" slot="${"left-control"}"><span class="${"material-icons-outlined"}">arrow_back</span></span>`,
        default: () => `${each(value.category, (item) => `${validate_component(GoodItemView, "GoodItemView").$$render($$result, Object.assign(item, { categoryId }), {}, {})}`)}`
      })}
    `;
    }(__value);
  }(staticData)}
</div>`;
});
var css$s = {
  code: ".promo_block.svelte-vv69te.svelte-vv69te{max-width:100%;overflow:auto}.promo_title.svelte-vv69te.svelte-vv69te{font-size:1.5rem;font-weight:500;margin:4rem 0 1rem}.promo_content.svelte-vv69te.svelte-vv69te{display:flex;gap:1rem;min-width:800px}.promo_item.svelte-vv69te.svelte-vv69te{flex:1}.promo_item.svelte-vv69te img.svelte-vv69te{max-width:100%}@media(max-width: 768px){.promo_title.svelte-vv69te.svelte-vv69te{margin:1rem 0}}",
  map: '{"version":3,"file":"PromoBlock.svelte","sources":["PromoBlock.svelte"],"sourcesContent":["<div class=\\"promo_block\\">\\r\\n    <div class=\\"promo_title\\">\u0410\u043A\u0446\u0438\u0438</div>\\r\\n    <div class=\\"promo_content\\">\\r\\n        <div class=\\"promo_item\\">\\r\\n            <img src=\\"https://static-sl.insales.ru/r/WXPD9U3YGS8/fit/469/0/ce/1/plain/files/1/6778/16366202/original/Group_179_44a64edc4aaac4a857f6cf68909a657f.jpg\\" alt=\\"\\">\\r\\n        </div>\\r\\n        <div class=\\"promo_item\\">\\r\\n            <img src=\\"https://static-sl.insales.ru/r/hUxFJtxck9w/fit/469/0/ce/1/plain/files/1/6780/16366204/original/Group_180.jpg\\" alt=\\"\\">\\r\\n        </div>\\r\\n        <div class=\\"promo_item\\">\\r\\n            <img src=\\"https://static-sl.insales.ru/r/oljm6gYQ3gc/fit/469/0/ce/1/plain/files/1/6782/16366206/original/Group_181.jpg\\" alt=\\"\\">\\r\\n        </div>\\r\\n    </div>\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .promo_block {\\r\\n        max-width: 100%;\\r\\n        overflow: auto;\\r\\n    }\\r\\n\\r\\n    .promo_title {\\r\\n        font-size: 1.5rem;\\r\\n        font-weight: 500;\\r\\n        margin: 4rem 0 1rem;\\r\\n    }\\r\\n\\r\\n    .promo_content {\\r\\n        display: flex;\\r\\n        gap: 1rem;\\r\\n        min-width: 800px;\\r\\n    }\\r\\n\\r\\n    .promo_item {\\r\\n        flex: 1;\\r\\n    }\\r\\n\\r\\n    .promo_item img {\\r\\n        max-width: 100%;\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .promo_title {\\r\\n            margin: 1rem 0;\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAgBI,YAAY,4BAAC,CAAC,AACV,SAAS,CAAE,IAAI,CACf,QAAQ,CAAE,IAAI,AAClB,CAAC,AAED,YAAY,4BAAC,CAAC,AACV,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,MAAM,CAAE,IAAI,CAAC,CAAC,CAAC,IAAI,AACvB,CAAC,AAED,cAAc,4BAAC,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,IAAI,CACT,SAAS,CAAE,KAAK,AACpB,CAAC,AAED,WAAW,4BAAC,CAAC,AACT,IAAI,CAAE,CAAC,AACX,CAAC,AAED,yBAAW,CAAC,GAAG,cAAC,CAAC,AACb,SAAS,CAAE,IAAI,AACnB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,YAAY,4BAAC,CAAC,AACV,MAAM,CAAE,IAAI,CAAC,CAAC,AAClB,CAAC,AACL,CAAC"}'
};
var PromoBlock = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$s);
  return `<div class="${"promo_block svelte-vv69te"}"><div class="${"promo_title svelte-vv69te"}">\u0410\u043A\u0446\u0438\u0438</div>
    <div class="${"promo_content svelte-vv69te"}"><div class="${"promo_item svelte-vv69te"}"><img src="${"https://static-sl.insales.ru/r/WXPD9U3YGS8/fit/469/0/ce/1/plain/files/1/6778/16366202/original/Group_179_44a64edc4aaac4a857f6cf68909a657f.jpg"}" alt="${""}" class="${"svelte-vv69te"}"></div>
        <div class="${"promo_item svelte-vv69te"}"><img src="${"https://static-sl.insales.ru/r/hUxFJtxck9w/fit/469/0/ce/1/plain/files/1/6780/16366204/original/Group_180.jpg"}" alt="${""}" class="${"svelte-vv69te"}"></div>
        <div class="${"promo_item svelte-vv69te"}"><img src="${"https://static-sl.insales.ru/r/oljm6gYQ3gc/fit/469/0/ce/1/plain/files/1/6782/16366206/original/Group_181.jpg"}" alt="${""}" class="${"svelte-vv69te"}"></div></div>
</div>`;
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Shop</title>`, ""}`, ""}

<div class="${"container"}"><div class="${"main_content"}">${validate_component(CategoryList, "CategoryList").$$render($$result, {}, {}, {})}
        ${validate_component(CarouselComponent, "CarouselComponent").$$render($$result, { categoryId: 0 }, {}, {})}
        ${validate_component(PromoBlock, "PromoBlock").$$render($$result, {}, {}, {})}
        ${validate_component(CarouselComponent, "CarouselComponent").$$render($$result, { categoryId: 1 }, {}, {})}</div></div>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var css$r = {
  code: ".sum.svelte-1j0g3mt.svelte-1j0g3mt{font-weight:bold}.order_sum.svelte-1j0g3mt.svelte-1j0g3mt{background:var(--main-bg-color)}.order_info.svelte-1j0g3mt.svelte-1j0g3mt{border-bottom:1px solid var(--main-border-color);border-top:1px solid var(--main-border-color);padding:1rem 0}.order_info_status.svelte-1j0g3mt.svelte-1j0g3mt{display:inline-block;padding:0.5rem 1rem;border:1px solid var(--main-border-color);margin-left:1rem}.order_title.svelte-1j0g3mt.svelte-1j0g3mt{font-size:1.5rem;font-weight:500;margin:1rem 0}.descript.svelte-1j0g3mt.svelte-1j0g3mt{font-size:1.2rem;font-weight:500;margin:0.5rem 0;padding-bottom:1rem}.order_info_item.svelte-1j0g3mt.svelte-1j0g3mt{display:flex;align-items:center;padding:1rem 0}.order_info_title.svelte-1j0g3mt.svelte-1j0g3mt{color:var(--main-descr-color);flex-basis:200px}.order_table.svelte-1j0g3mt.svelte-1j0g3mt{width:100%;border:1px solid var(--main-border-color);border-spacing:0}.order_table.svelte-1j0g3mt td.svelte-1j0g3mt{padding:0.5rem 1rem;border-bottom:1px solid var(--main-border-color)}tbody.svelte-1j0g3mt tr.svelte-1j0g3mt:nth-child(odd){background:var(--footer-bg-color)}thead.svelte-1j0g3mt tr.svelte-1j0g3mt{color:var(--main-descr-color)}td.svelte-1j0g3mt.svelte-1j0g3mt:last-child{text-align:right}@media screen and (max-width: 600px){table.svelte-1j0g3mt.svelte-1j0g3mt{border:0}table.svelte-1j0g3mt thead.svelte-1j0g3mt{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table.svelte-1j0g3mt tr.svelte-1j0g3mt{border-bottom:3px solid #ddd;display:block;margin-bottom:0.625em}table.svelte-1j0g3mt td.svelte-1j0g3mt{border-bottom:1px solid #ddd;display:block;font-size:0.8em;text-align:right}table.svelte-1j0g3mt td.svelte-1j0g3mt::before{content:attr(data-label);float:left;font-weight:500}table.svelte-1j0g3mt td.svelte-1j0g3mt:last-child{border-bottom:0}}",
  map: `{"version":3,"file":"completeOrder.svelte","sources":["completeOrder.svelte"],"sourcesContent":["<script>\\r\\n\\timport { orderStore, cartCollection, promocodeState } from '../stores/cart';\\r\\n\\timport { afterUpdate } from 'svelte';\\r\\n\\r\\n\\tlet orderCollection = $cartCollection;\\r\\n\\r\\n\\tafterUpdate(() => {\\r\\n\\t\\t$cartCollection = [];\\r\\n\\t\\t$promocodeState = false;\\r\\n\\t});\\r\\n\\r\\n\\tlet orderNum = randomOrderNum();\\r\\n\\tfunction randomOrderNum() {\\r\\n\\t\\tconst min = 1;\\r\\n\\t\\tconst max = 1000;\\r\\n\\t\\tlet rand = min - 0.5 + Math.random() * (max - min + 1);\\r\\n\\t\\treturn Math.round(rand);\\r\\n\\t}\\r\\n<\/script>\\r\\n\\r\\n<svelte:head>\\r\\n\\t<title>\u0421\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u043E \u0437\u0430\u043A\u0430\u0437\u0435</title>\\r\\n</svelte:head>\\r\\n\\r\\n<div class=\\"container\\">\\r\\n\\t<div class=\\"order_title\\">\u0417\u0430\u043A\u0430\u0437 \u2116 {orderNum}</div>\\r\\n\\t<div class=\\"descript\\">\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0437\u0430\u043A\u0430\u0437\u0435</div>\\r\\n\\t<div class=\\"order_info\\">\\r\\n\\t\\t<div class=\\"order_info_item\\">\\r\\n\\t\\t\\t<div class=\\"order_info_title\\">\u0421\u0443\u043C\u043C\u0430 \u0438 \u0441\u0442\u0430\u0442\u0443\u0441</div>\\r\\n\\t\\t\\t<div class=\\"order_info_value sum\\">{$orderStore.sum} \u0440\u0443\u0431</div>\\r\\n\\t\\t\\t<div class=\\"order_info_status\\">\u041F\u0440\u0438\u043D\u044F\u0442</div>\\r\\n\\t\\t\\t<div class=\\"order_info_status\\">\u041D\u0435 \u043E\u043F\u043B\u0430\u0447\u0435\u043D</div>\\r\\n\\t\\t</div>\\r\\n\\t\\t<div class=\\"order_info_item\\">\\r\\n\\t\\t\\t<div class=\\"order_info_title\\">\u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B</div>\\r\\n\\t\\t\\t<div class=\\"order_info_value\\">\\r\\n\\t\\t\\t\\t{$orderStore.payChoice === 1 ? '\u041D\u0430\u043B\u0438\u0447\u043D\u044B\u043C\u0438 \u043A\u0443\u0440\u044C\u0435\u0440\u0443' : '\u0411\u0430\u043D\u043A\u043E\u0432\u0441\u043A\u0438\u0439 \u043F\u0435\u0440\u0435\u0432\u043E\u0434'}\\r\\n\\t\\t\\t</div>\\r\\n\\t\\t</div>\\r\\n\\t\\t<div class=\\"order_info_item\\">\\r\\n\\t\\t\\t<div class=\\"order_info_title\\">\u0421\u043F\u043E\u0441\u043E\u0431 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</div>\\r\\n\\t\\t\\t<div class=\\"order_info_value\\">\\r\\n\\t\\t\\t\\t{$orderStore.deliveryChoice === 0 ? '\u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 (\u043D\u0430 \u043F\u0443\u043D\u043A\u0442\u0435 \u0432\u044B\u0434\u0430\u0447\u0438)' : '\u041A\u0443\u0440\u044C\u0435\u0440\u043E\u043C'}\\r\\n\\t\\t\\t</div>\\r\\n\\t\\t</div>\\r\\n\\t\\t<div class=\\"order_info_item\\">\\r\\n\\t\\t\\t<div class=\\"order_info_title\\">\u0410\u0434\u0440\u0435\u0441 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</div>\\r\\n\\t\\t\\t<div class=\\"order_info_value\\">{$orderStore.townSearch}</div>\\r\\n\\t\\t</div>\\r\\n\\t\\t<div class=\\"order_info_item\\">\\r\\n\\t\\t\\t<div class=\\"order_info_title\\">\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044C</div>\\r\\n\\t\\t\\t<div class=\\"order_info_value\\">{$orderStore.nameValue + '' + $orderStore.phoneValue}</div>\\r\\n\\t\\t</div>\\r\\n\\t\\t<div class=\\"order_info_item\\">\\r\\n\\t\\t\\t<div class=\\"order_info_title\\">\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043A \u0437\u0430\u043A\u0430\u0437\u0443</div>\\r\\n\\t\\t\\t<div class=\\"order_info_value\\">{$orderStore.commentValue}</div>\\r\\n\\t\\t</div>\\r\\n\\t</div>\\r\\n\\r\\n\\t<div class=\\"order_title\\">\u0421\u043E\u0441\u0442\u0430\u0432 \u0437\u0430\u043A\u0430\u0437\u0430</div>\\r\\n\\t<table class=\\"order_table\\">\\r\\n\\t\\t<thead>\\r\\n\\t\\t\\t<tr>\\r\\n\\t\\t\\t\\t<td>\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435</td>\\r\\n\\t\\t\\t\\t<td>\u041A\u043E\u043B-\u0432\u043E</td>\\r\\n\\t\\t\\t\\t<td>\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C</td>\\r\\n\\t\\t\\t</tr>\\r\\n\\t\\t</thead>\\r\\n\\t\\t<tbody>\\r\\n\\t\\t\\t{#each orderCollection as item}\\r\\n\\t\\t\\t\\t<tr>\\r\\n\\t\\t\\t\\t\\t<td data-label=\\"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435\\">{item.elem.name}</td>\\r\\n\\t\\t\\t\\t\\t<td data-label=\\"\u041A\u043E\u043B-\u0432\u043E\\">{item.cartCounter}</td>\\r\\n\\t\\t\\t\\t\\t<td data-label=\\"\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C\\">{item.cartCounter * item.elem.price} \u0440\u0443\u0431</td>\\r\\n\\t\\t\\t\\t</tr>\\r\\n\\t\\t\\t{/each}\\r\\n\\t\\t\\t{#if $orderStore.promo}\\r\\n\\t\\t\\t\\t<tr>\\r\\n\\t\\t\\t\\t\\t<td>\u0421\u043A\u0438\u0434\u043A\u0430 (\u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434)</td>\\r\\n\\t\\t\\t\\t\\t<td colspan=\\"2\\">-10%</td>\\r\\n\\t\\t\\t\\t</tr>\\r\\n\\t\\t\\t{/if}\\r\\n\\t\\t\\t<tr>\\r\\n\\t\\t\\t\\t<td colspan=\\"3\\" class=\\"order_sum\\">\u0418\u0442\u043E\u0433\u043E: <span class=\\"sum\\">{$orderStore.sum} \u0440\u0443\u0431</span></td\\r\\n\\t\\t\\t\\t>\\r\\n\\t\\t\\t</tr>\\r\\n\\t\\t</tbody>\\r\\n\\t</table>\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n\\t.sum {\\r\\n\\t\\tfont-weight: bold;\\r\\n\\t}\\r\\n\\r\\n\\t.order_sum {\\r\\n\\t\\tbackground: var(--main-bg-color);\\r\\n\\t}\\r\\n\\r\\n\\t.order_info {\\r\\n\\t\\tborder-bottom: 1px solid var(--main-border-color);\\r\\n\\t\\tborder-top: 1px solid var(--main-border-color);\\r\\n\\t\\tpadding: 1rem 0;\\r\\n\\t}\\r\\n\\r\\n\\t.order_info_status {\\r\\n\\t\\tdisplay: inline-block;\\r\\n\\t\\tpadding: 0.5rem 1rem;\\r\\n\\t\\tborder: 1px solid var(--main-border-color);\\r\\n\\t\\tmargin-left: 1rem;\\r\\n\\t}\\r\\n\\r\\n\\t.order_title {\\r\\n\\t\\tfont-size: 1.5rem;\\r\\n\\t\\tfont-weight: 500;\\r\\n\\t\\tmargin: 1rem 0;\\r\\n\\t}\\r\\n\\r\\n\\t.descript {\\r\\n\\t\\tfont-size: 1.2rem;\\r\\n\\t\\tfont-weight: 500;\\r\\n\\t\\tmargin: 0.5rem 0;\\r\\n\\t\\tpadding-bottom: 1rem;\\r\\n\\t}\\r\\n\\r\\n\\t.order_info_item {\\r\\n\\t\\tdisplay: flex;\\r\\n\\t\\talign-items: center;\\r\\n\\t\\tpadding: 1rem 0;\\r\\n\\t}\\r\\n\\r\\n\\t.order_info_title {\\r\\n\\t\\tcolor: var(--main-descr-color);\\r\\n\\t\\tflex-basis: 200px;\\r\\n\\t}\\r\\n\\r\\n\\t.order_table {\\r\\n\\t\\twidth: 100%;\\r\\n\\t\\tborder: 1px solid var(--main-border-color);\\r\\n\\t\\tborder-spacing: 0;\\r\\n\\t}\\r\\n\\r\\n\\t.order_table td {\\r\\n\\t\\tpadding: 0.5rem 1rem;\\r\\n\\t\\tborder-bottom: 1px solid var(--main-border-color);\\r\\n\\t}\\r\\n\\r\\n\\ttbody tr:nth-child(odd) {\\r\\n\\t\\tbackground: var(--footer-bg-color);\\r\\n\\t}\\r\\n\\r\\n\\tthead tr {\\r\\n\\t\\tcolor: var(--main-descr-color);\\r\\n\\t}\\r\\n\\r\\n\\ttd:last-child {\\r\\n\\t\\ttext-align: right;\\r\\n\\t}\\r\\n\\r\\n\\t@media screen and (max-width: 600px) {\\r\\n\\t\\ttable {\\r\\n\\t\\t\\tborder: 0;\\r\\n\\t\\t}\\r\\n\\r\\n\\t\\ttable thead {\\r\\n\\t\\t\\tborder: none;\\r\\n\\t\\t\\tclip: rect(0 0 0 0);\\r\\n\\t\\t\\theight: 1px;\\r\\n\\t\\t\\tmargin: -1px;\\r\\n\\t\\t\\toverflow: hidden;\\r\\n\\t\\t\\tpadding: 0;\\r\\n\\t\\t\\tposition: absolute;\\r\\n\\t\\t\\twidth: 1px;\\r\\n\\t\\t}\\r\\n\\r\\n\\t\\ttable tr {\\r\\n\\t\\t\\tborder-bottom: 3px solid #ddd;\\r\\n\\t\\t\\tdisplay: block;\\r\\n\\t\\t\\tmargin-bottom: 0.625em;\\r\\n\\t\\t}\\r\\n\\r\\n\\t\\ttable td {\\r\\n\\t\\t\\tborder-bottom: 1px solid #ddd;\\r\\n\\t\\t\\tdisplay: block;\\r\\n\\t\\t\\tfont-size: 0.8em;\\r\\n\\t\\t\\ttext-align: right;\\r\\n\\t\\t}\\r\\n\\r\\n\\t\\ttable td::before {\\r\\n            content: attr(data-label);\\r\\n\\t\\t\\tfloat: left;\\r\\n\\t\\t\\tfont-weight: 500;\\r\\n\\t\\t}\\r\\n\\r\\n\\t\\ttable td:last-child {\\r\\n\\t\\t\\tborder-bottom: 0;\\r\\n\\t\\t}\\r\\n\\t}\\r\\n</style>\\r\\n"],"names":[],"mappings":"AA4FC,IAAI,8BAAC,CAAC,AACL,WAAW,CAAE,IAAI,AAClB,CAAC,AAED,UAAU,8BAAC,CAAC,AACX,UAAU,CAAE,IAAI,eAAe,CAAC,AACjC,CAAC,AAED,WAAW,8BAAC,CAAC,AACZ,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CACjD,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAC9C,OAAO,CAAE,IAAI,CAAC,CAAC,AAChB,CAAC,AAED,kBAAkB,8BAAC,CAAC,AACnB,OAAO,CAAE,YAAY,CACrB,OAAO,CAAE,MAAM,CAAC,IAAI,CACpB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAC1C,WAAW,CAAE,IAAI,AAClB,CAAC,AAED,YAAY,8BAAC,CAAC,AACb,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,MAAM,CAAE,IAAI,CAAC,CAAC,AACf,CAAC,AAED,SAAS,8BAAC,CAAC,AACV,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,MAAM,CAAE,MAAM,CAAC,CAAC,CAChB,cAAc,CAAE,IAAI,AACrB,CAAC,AAED,gBAAgB,8BAAC,CAAC,AACjB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,OAAO,CAAE,IAAI,CAAC,CAAC,AAChB,CAAC,AAED,iBAAiB,8BAAC,CAAC,AAClB,KAAK,CAAE,IAAI,kBAAkB,CAAC,CAC9B,UAAU,CAAE,KAAK,AAClB,CAAC,AAED,YAAY,8BAAC,CAAC,AACb,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAC1C,cAAc,CAAE,CAAC,AAClB,CAAC,AAED,2BAAY,CAAC,EAAE,eAAC,CAAC,AAChB,OAAO,CAAE,MAAM,CAAC,IAAI,CACpB,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,AAClD,CAAC,AAED,oBAAK,CAAC,iBAAE,WAAW,GAAG,CAAC,AAAC,CAAC,AACxB,UAAU,CAAE,IAAI,iBAAiB,CAAC,AACnC,CAAC,AAED,oBAAK,CAAC,EAAE,eAAC,CAAC,AACT,KAAK,CAAE,IAAI,kBAAkB,CAAC,AAC/B,CAAC,AAED,gCAAE,WAAW,AAAC,CAAC,AACd,UAAU,CAAE,KAAK,AAClB,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACrC,KAAK,8BAAC,CAAC,AACN,MAAM,CAAE,CAAC,AACV,CAAC,AAED,oBAAK,CAAC,KAAK,eAAC,CAAC,AACZ,MAAM,CAAE,IAAI,CACZ,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,MAAM,CAAE,GAAG,CACX,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,MAAM,CAChB,OAAO,CAAE,CAAC,CACV,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,GAAG,AACX,CAAC,AAED,oBAAK,CAAC,EAAE,eAAC,CAAC,AACT,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,CAC7B,OAAO,CAAE,KAAK,CACd,aAAa,CAAE,OAAO,AACvB,CAAC,AAED,oBAAK,CAAC,EAAE,eAAC,CAAC,AACT,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,CAC7B,OAAO,CAAE,KAAK,CACd,SAAS,CAAE,KAAK,CAChB,UAAU,CAAE,KAAK,AAClB,CAAC,AAED,oBAAK,CAAC,iBAAE,QAAQ,AAAC,CAAC,AACR,OAAO,CAAE,KAAK,UAAU,CAAC,CAClC,KAAK,CAAE,IAAI,CACX,WAAW,CAAE,GAAG,AACjB,CAAC,AAED,oBAAK,CAAC,iBAAE,WAAW,AAAC,CAAC,AACpB,aAAa,CAAE,CAAC,AACjB,CAAC,AACF,CAAC"}`
};
function randomOrderNum() {
  const min = 1;
  const max = 1e3;
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
var CompleteOrder = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_promocodeState;
  let $cartCollection, $$unsubscribe_cartCollection;
  let $orderStore, $$unsubscribe_orderStore;
  $$unsubscribe_promocodeState = subscribe(promocodeState, (value) => value);
  $$unsubscribe_cartCollection = subscribe(cartCollection, (value) => $cartCollection = value);
  $$unsubscribe_orderStore = subscribe(orderStore, (value) => $orderStore = value);
  let orderCollection = $cartCollection;
  let orderNum = randomOrderNum();
  $$result.css.add(css$r);
  $$unsubscribe_promocodeState();
  $$unsubscribe_cartCollection();
  $$unsubscribe_orderStore();
  return `${$$result.head += `${$$result.title = `<title>\u0421\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u043E \u0437\u0430\u043A\u0430\u0437\u0435</title>`, ""}`, ""}

<div class="${"container"}"><div class="${"order_title svelte-1j0g3mt"}">\u0417\u0430\u043A\u0430\u0437 \u2116 ${escape(orderNum)}</div>
	<div class="${"descript svelte-1j0g3mt"}">\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0437\u0430\u043A\u0430\u0437\u0435</div>
	<div class="${"order_info svelte-1j0g3mt"}"><div class="${"order_info_item svelte-1j0g3mt"}"><div class="${"order_info_title svelte-1j0g3mt"}">\u0421\u0443\u043C\u043C\u0430 \u0438 \u0441\u0442\u0430\u0442\u0443\u0441</div>
			<div class="${"order_info_value sum svelte-1j0g3mt"}">${escape($orderStore.sum)} \u0440\u0443\u0431</div>
			<div class="${"order_info_status svelte-1j0g3mt"}">\u041F\u0440\u0438\u043D\u044F\u0442</div>
			<div class="${"order_info_status svelte-1j0g3mt"}">\u041D\u0435 \u043E\u043F\u043B\u0430\u0447\u0435\u043D</div></div>
		<div class="${"order_info_item svelte-1j0g3mt"}"><div class="${"order_info_title svelte-1j0g3mt"}">\u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B</div>
			<div class="${"order_info_value"}">${escape($orderStore.payChoice === 1 ? "\u041D\u0430\u043B\u0438\u0447\u043D\u044B\u043C\u0438 \u043A\u0443\u0440\u044C\u0435\u0440\u0443" : "\u0411\u0430\u043D\u043A\u043E\u0432\u0441\u043A\u0438\u0439 \u043F\u0435\u0440\u0435\u0432\u043E\u0434")}</div></div>
		<div class="${"order_info_item svelte-1j0g3mt"}"><div class="${"order_info_title svelte-1j0g3mt"}">\u0421\u043F\u043E\u0441\u043E\u0431 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</div>
			<div class="${"order_info_value"}">${escape($orderStore.deliveryChoice === 0 ? "\u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 (\u043D\u0430 \u043F\u0443\u043D\u043A\u0442\u0435 \u0432\u044B\u0434\u0430\u0447\u0438)" : "\u041A\u0443\u0440\u044C\u0435\u0440\u043E\u043C")}</div></div>
		<div class="${"order_info_item svelte-1j0g3mt"}"><div class="${"order_info_title svelte-1j0g3mt"}">\u0410\u0434\u0440\u0435\u0441 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</div>
			<div class="${"order_info_value"}">${escape($orderStore.townSearch)}</div></div>
		<div class="${"order_info_item svelte-1j0g3mt"}"><div class="${"order_info_title svelte-1j0g3mt"}">\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044C</div>
			<div class="${"order_info_value"}">${escape($orderStore.nameValue + "" + $orderStore.phoneValue)}</div></div>
		<div class="${"order_info_item svelte-1j0g3mt"}"><div class="${"order_info_title svelte-1j0g3mt"}">\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043A \u0437\u0430\u043A\u0430\u0437\u0443</div>
			<div class="${"order_info_value"}">${escape($orderStore.commentValue)}</div></div></div>

	<div class="${"order_title svelte-1j0g3mt"}">\u0421\u043E\u0441\u0442\u0430\u0432 \u0437\u0430\u043A\u0430\u0437\u0430</div>
	<table class="${"order_table svelte-1j0g3mt"}"><thead class="${"svelte-1j0g3mt"}"><tr class="${"svelte-1j0g3mt"}"><td class="${"svelte-1j0g3mt"}">\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435</td>
				<td class="${"svelte-1j0g3mt"}">\u041A\u043E\u043B-\u0432\u043E</td>
				<td class="${"svelte-1j0g3mt"}">\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C</td></tr></thead>
		<tbody class="${"svelte-1j0g3mt"}">${each(orderCollection, (item) => `<tr class="${"svelte-1j0g3mt"}"><td data-label="${"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435"}" class="${"svelte-1j0g3mt"}">${escape(item.elem.name)}</td>
					<td data-label="${"\u041A\u043E\u043B-\u0432\u043E"}" class="${"svelte-1j0g3mt"}">${escape(item.cartCounter)}</td>
					<td data-label="${"\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C"}" class="${"svelte-1j0g3mt"}">${escape(item.cartCounter * item.elem.price)} \u0440\u0443\u0431</td>
				</tr>`)}
			${$orderStore.promo ? `<tr class="${"svelte-1j0g3mt"}"><td class="${"svelte-1j0g3mt"}">\u0421\u043A\u0438\u0434\u043A\u0430 (\u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434)</td>
					<td colspan="${"2"}" class="${"svelte-1j0g3mt"}">-10%</td></tr>` : ``}
			<tr class="${"svelte-1j0g3mt"}"><td colspan="${"3"}" class="${"order_sum svelte-1j0g3mt"}">\u0418\u0442\u043E\u0433\u043E: <span class="${"sum svelte-1j0g3mt"}">${escape($orderStore.sum)} \u0440\u0443\u0431</span></td></tr></tbody></table>
</div>`;
});
var completeOrder = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": CompleteOrder
});
var css$q = {
  code: "ul.svelte-7nz2e6{display:flex;padding:1.5rem 0;grid-area:crumbs;overflow:auto}li.svelte-7nz2e6{margin-right:30px;position:relative;white-space:nowrap}li.svelte-7nz2e6:not(:last-child):after{position:absolute;right:-20px;content:'/';color:#ccc}a.svelte-7nz2e6{color:var(--main-theme-color)}@media(max-width: 768px){ul.svelte-7nz2e6{padding:0 0 1rem}}",
  map: `{"version":3,"file":"Breadcrumbs.svelte","sources":["Breadcrumbs.svelte"],"sourcesContent":["<script>\\r\\n    export let refaddress;\\r\\n<\/script>\\r\\n\\r\\n<ul>\\r\\n    <li><a href=\\"/\\">\u0413\u043B\u0430\u0432\u043D\u0430\u044F</a></li>\\r\\n    <li>{refaddress}</li>\\r\\n</ul>\\r\\n\\r\\n<style>\\r\\n    ul {\\r\\n        display: flex;\\r\\n        padding: 1.5rem 0;\\r\\n        grid-area: crumbs;\\r\\n        overflow: auto;\\r\\n    }\\r\\n\\r\\n    li {\\r\\n        margin-right: 30px;\\r\\n        position: relative;\\r\\n        white-space: nowrap;\\r\\n    }\\r\\n\\r\\n    li:not(:last-child):after {\\r\\n        position: absolute;\\r\\n        right: -20px;\\r\\n        content: '/';\\r\\n        color: #ccc;\\r\\n    }\\r\\n\\r\\n    a {\\r\\n        color: var(--main-theme-color);\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        ul {\\r\\n            padding: 0 0 1rem;\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAUI,EAAE,cAAC,CAAC,AACA,OAAO,CAAE,IAAI,CACb,OAAO,CAAE,MAAM,CAAC,CAAC,CACjB,SAAS,CAAE,MAAM,CACjB,QAAQ,CAAE,IAAI,AAClB,CAAC,AAED,EAAE,cAAC,CAAC,AACA,YAAY,CAAE,IAAI,CAClB,QAAQ,CAAE,QAAQ,CAClB,WAAW,CAAE,MAAM,AACvB,CAAC,AAED,gBAAE,KAAK,WAAW,CAAC,MAAM,AAAC,CAAC,AACvB,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,KAAK,CACZ,OAAO,CAAE,GAAG,CACZ,KAAK,CAAE,IAAI,AACf,CAAC,AAED,CAAC,cAAC,CAAC,AACC,KAAK,CAAE,IAAI,kBAAkB,CAAC,AAClC,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,EAAE,cAAC,CAAC,AACA,OAAO,CAAE,CAAC,CAAC,CAAC,CAAC,IAAI,AACrB,CAAC,AACL,CAAC"}`
};
var Breadcrumbs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { refaddress } = $$props;
  if ($$props.refaddress === void 0 && $$bindings.refaddress && refaddress !== void 0)
    $$bindings.refaddress(refaddress);
  $$result.css.add(css$q);
  return `<ul class="${"svelte-7nz2e6"}"><li class="${"svelte-7nz2e6"}"><a href="${"/"}" class="${"svelte-7nz2e6"}">\u0413\u043B\u0430\u0432\u043D\u0430\u044F</a></li>
    <li class="${"svelte-7nz2e6"}">${escape(refaddress)}</li>
</ul>`;
});
var css$p = {
  code: "select.svelte-fwmssw{background:#fff;border:1px solid var(--main-border-color);font-family:var(--font);font-size:1rem;padding:5px 10px;width:100%;cursor:pointer}",
  map: '{"version":3,"file":"SortSelect.svelte","sources":["SortSelect.svelte"],"sourcesContent":["<script>\\r\\n    export let selected;\\r\\n<\/script>\\r\\n\\r\\n<select bind:value={selected}>\\r\\n    <slot name=\\"s-head\\"></slot>\\r\\n    <slot></slot>\\r\\n</select>\\r\\n\\r\\n<style>\\r\\n    select {\\r\\n        background: #fff;\\r\\n        border: 1px solid var(--main-border-color);\\r\\n        font-family: var(--font);\\r\\n        font-size: 1rem;\\r\\n        padding: 5px 10px;\\r\\n        width: 100%;\\r\\n        cursor: pointer;\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAUI,MAAM,cAAC,CAAC,AACJ,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAC1C,WAAW,CAAE,IAAI,MAAM,CAAC,CACxB,SAAS,CAAE,IAAI,CACf,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,OAAO,AACnB,CAAC"}'
};
var SortSelect = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { selected } = $$props;
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  $$result.css.add(css$p);
  return `<select class="${"svelte-fwmssw"}">${slots["s-head"] ? slots["s-head"]({}) : ``}${slots.default ? slots.default({}) : ``}</select>`;
});
var css$o = {
  code: "input.svelte-18ufi44.svelte-18ufi44{visibility:hidden;position:absolute}label.svelte-18ufi44.svelte-18ufi44{cursor:pointer;display:block;width:100%;padding:0.5rem 0 0.5rem 1rem}span.svelte-18ufi44.svelte-18ufi44{position:relative;padding-left:25px}span.svelte-18ufi44.svelte-18ufi44:before{content:'';position:absolute;left:0;top:2px;width:18px;height:18px;border:1px solid #ccc;background:#fff}span.svelte-18ufi44.svelte-18ufi44:after{content:'';background:rgba(255,255,255,0);position:absolute;left:4px;top:6px;width:12px;height:12px}input.svelte-18ufi44:checked+span.svelte-18ufi44:after{background:var(--main-theme-color)}",
  map: `{"version":3,"file":"Checkbox.svelte","sources":["Checkbox.svelte"],"sourcesContent":["<script>\\r\\n    export let spanValue;\\r\\n    export let checkBrand;\\r\\n    export let allCheckedFilters;\\r\\n\\r\\n    let checked = allCheckedFilters;\\r\\n<\/script>\\r\\n\\r\\n<label>\\r\\n    <input type=\\"checkbox\\" on:input={checkBrand} bind:checked={checked}>\\r\\n    <span>{spanValue}</span>\\r\\n</label>\\r\\n\\r\\n<style>\\r\\n    input {\\r\\n        visibility: hidden;\\r\\n        position: absolute;\\r\\n    }\\r\\n\\r\\n    label {\\r\\n        cursor: pointer;\\r\\n        display: block;\\r\\n        width: 100%;\\r\\n        padding: 0.5rem 0 0.5rem 1rem;\\r\\n    }\\r\\n\\r\\n    span {\\r\\n        position: relative;\\r\\n        padding-left: 25px;\\r\\n    }\\r\\n\\r\\n    span:before {\\r\\n        content: '';\\r\\n        position: absolute;\\r\\n        left: 0;\\r\\n        top: 2px;\\r\\n        width: 18px;\\r\\n        height: 18px;\\r\\n        border: 1px solid #ccc;\\r\\n        background: #fff;\\r\\n    }\\r\\n\\r\\n    span:after {\\r\\n        content: '';\\r\\n        background: rgba(255,255,255,0);\\r\\n        position: absolute;\\r\\n        left: 4px;\\r\\n        top: 6px;\\r\\n        width: 12px;\\r\\n        height: 12px;\\r\\n    }\\r\\n\\r\\n    input:checked + span:after {\\r\\n        background: var(--main-theme-color);\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAcI,KAAK,8BAAC,CAAC,AACH,UAAU,CAAE,MAAM,CAClB,QAAQ,CAAE,QAAQ,AACtB,CAAC,AAED,KAAK,8BAAC,CAAC,AACH,MAAM,CAAE,OAAO,CACf,OAAO,CAAE,KAAK,CACd,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,MAAM,CAAC,CAAC,CAAC,MAAM,CAAC,IAAI,AACjC,CAAC,AAED,IAAI,8BAAC,CAAC,AACF,QAAQ,CAAE,QAAQ,CAClB,YAAY,CAAE,IAAI,AACtB,CAAC,AAED,kCAAI,OAAO,AAAC,CAAC,AACT,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,GAAG,CACR,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,CACtB,UAAU,CAAE,IAAI,AACpB,CAAC,AAED,kCAAI,MAAM,AAAC,CAAC,AACR,OAAO,CAAE,EAAE,CACX,UAAU,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,CAC/B,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,GAAG,CACR,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,AAChB,CAAC,AAED,oBAAK,QAAQ,CAAG,mBAAI,MAAM,AAAC,CAAC,AACxB,UAAU,CAAE,IAAI,kBAAkB,CAAC,AACvC,CAAC"}`
};
var Checkbox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { spanValue } = $$props;
  let { checkBrand } = $$props;
  let { allCheckedFilters } = $$props;
  let checked = allCheckedFilters;
  if ($$props.spanValue === void 0 && $$bindings.spanValue && spanValue !== void 0)
    $$bindings.spanValue(spanValue);
  if ($$props.checkBrand === void 0 && $$bindings.checkBrand && checkBrand !== void 0)
    $$bindings.checkBrand(checkBrand);
  if ($$props.allCheckedFilters === void 0 && $$bindings.allCheckedFilters && allCheckedFilters !== void 0)
    $$bindings.allCheckedFilters(allCheckedFilters);
  $$result.css.add(css$o);
  return `<label class="${"svelte-18ufi44"}"><input type="${"checkbox"}" class="${"svelte-18ufi44"}"${add_attribute("checked", checked, 1)}>
    <span class="${"svelte-18ufi44"}">${escape(spanValue)}</span>
</label>`;
});
var css$n = {
  code: ".unique_title.svelte-1azp24g.svelte-1azp24g{font-weight:600;padding:1rem;transition:.2s;display:flex;align-items:center;justify-content:space-between;cursor:pointer}.marker.svelte-1azp24g.svelte-1azp24g:after{content:'';width:6px;height:6px;display:inline-block;border-radius:50%;margin-left:10px;background:var(--main-theme-color)}.unique_title.active.svelte-1azp24g .marker.svelte-1azp24g:after{background:var(--main-bg-color)}.unique_title.active.svelte-1azp24g .arrow.svelte-1azp24g{transform:rotate(180deg);color:#fff}.unique_title.svelte-1azp24g .val.svelte-1azp24g::first-letter{text-transform:uppercase}.arrow.svelte-1azp24g.svelte-1azp24g{font-size:1rem;transition:.2s}.filterlist_item.svelte-1azp24g.svelte-1azp24g{border-bottom:1px solid var(--main-border-color);user-select:none}.unique_title.svelte-1azp24g.svelte-1azp24g::first-letter{text-transform:uppercase}.filters_list.svelte-1azp24g.svelte-1azp24g{background:var(--filter-bg-color)}.filters_list.svelte-1azp24g li.svelte-1azp24g:hover{background:#ececec}.active.svelte-1azp24g.svelte-1azp24g{background:var(--main-theme-color);color:var(--main-bg-color)}",
  map: `{"version":3,"file":"FilterCollection.svelte","sources":["FilterCollection.svelte"],"sourcesContent":["<script>\\r\\n    import { afterUpdate } from 'svelte';\\r\\n    import Checkbox from '../../Helpers/Checkbox.svelte';\\r\\n    import Model from '../../../model/data-service';\\r\\n    import { slide } from 'svelte/transition';\\r\\n\\r\\n    export let filterCollection;\\r\\n    export let itemAttr = $$props;\\r\\n    export let exportedActive;\\r\\n\\r\\n    $: if(exportedActive == false) {\\r\\n        active = false;\\r\\n        exportedActive = undefined;\\r\\n    }\\r\\n\\r\\n    $: active = false;\\r\\n    const temp = new Model();\\r\\n    let showMarker = false;\\r\\n\\r\\n    afterUpdate(() => {\\r\\n        return filterCollection[itemAttr[0]] === undefined \\r\\n                || filterCollection[itemAttr[0]].length === 0\\r\\n                    ? showMarker = false\\r\\n                    : showMarker = true;\\r\\n    });\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"filterlist_item\\">\\r\\n    <div class=\\"unique_title\\"  class:active on:click={() => active = !active}>\\r\\n        <span class=\\"val\\" class:marker={showMarker}>{itemAttr[0]}</span>\\r\\n        <span class=\\"material-icons-outlined arrow\\">expand_more</span>\\r\\n    </div>\\r\\n    {#if active}\\r\\n        <ul class=\\"filters_list\\" transition:slide={{duration: 200}}>\\r\\n            {#each itemAttr[1] as itemVal}\\r\\n                <li>\\r\\n                    <Checkbox \\r\\n                        spanValue={itemVal}\\r\\n                        checkBrand={() => filterCollection = temp.fillFiltersParameters(filterCollection, itemVal, itemAttr[0])}\\r\\n                        allCheckedFilters={temp.getInitialCheckboxesState(filterCollection, itemAttr[0], itemVal)}\\r\\n                    />\\r\\n                </li>\\r\\n            {/each}\\r\\n        </ul>\\r\\n    {/if}\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .unique_title {\\r\\n        font-weight: 600;\\r\\n        padding: 1rem;\\r\\n        transition: .2s;\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: space-between;\\r\\n        cursor: pointer;\\r\\n    }\\r\\n\\r\\n    .marker:after {\\r\\n        content: '';\\r\\n        width: 6px;\\r\\n        height: 6px;\\r\\n        display: inline-block;\\r\\n        border-radius: 50%;\\r\\n        margin-left: 10px;\\r\\n        background: var(--main-theme-color);\\r\\n    }\\r\\n\\r\\n    .unique_title.active .marker:after {\\r\\n        background: var(--main-bg-color);\\r\\n    }\\r\\n\\r\\n    .unique_title.active .arrow {\\r\\n        transform: rotate(180deg);\\r\\n        color: #fff;\\r\\n    }\\r\\n\\r\\n    .unique_title .val::first-letter {\\r\\n        text-transform: uppercase;\\r\\n    }\\r\\n\\r\\n    .arrow {\\r\\n        font-size: 1rem;\\r\\n        transition: .2s;\\r\\n    }\\r\\n\\r\\n    .filterlist_item {\\r\\n        border-bottom: 1px solid var(--main-border-color);\\r\\n        user-select: none;\\r\\n    }\\r\\n    .unique_title::first-letter {\\r\\n        text-transform: uppercase;\\r\\n    }\\r\\n\\r\\n\\t.filters_list {\\r\\n        background: var(--filter-bg-color);\\r\\n\\t}\\r\\n\\r\\n    .filters_list li:hover {\\r\\n        background: #ececec;\\r\\n    }\\r\\n\\r\\n    .active {\\r\\n        background: var(--main-theme-color);\\r\\n        color: var(--main-bg-color);\\r\\n    }\\r\\n</style>\\r\\n"],"names":[],"mappings":"AAgDI,aAAa,8BAAC,CAAC,AACX,WAAW,CAAE,GAAG,CAChB,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,GAAG,CACf,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,aAAa,CAC9B,MAAM,CAAE,OAAO,AACnB,CAAC,AAED,qCAAO,MAAM,AAAC,CAAC,AACX,OAAO,CAAE,EAAE,CACX,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,CACX,OAAO,CAAE,YAAY,CACrB,aAAa,CAAE,GAAG,CAClB,WAAW,CAAE,IAAI,CACjB,UAAU,CAAE,IAAI,kBAAkB,CAAC,AACvC,CAAC,AAED,aAAa,sBAAO,CAAC,sBAAO,MAAM,AAAC,CAAC,AAChC,UAAU,CAAE,IAAI,eAAe,CAAC,AACpC,CAAC,AAED,aAAa,sBAAO,CAAC,MAAM,eAAC,CAAC,AACzB,SAAS,CAAE,OAAO,MAAM,CAAC,CACzB,KAAK,CAAE,IAAI,AACf,CAAC,AAED,4BAAa,CAAC,mBAAI,cAAc,AAAC,CAAC,AAC9B,cAAc,CAAE,SAAS,AAC7B,CAAC,AAED,MAAM,8BAAC,CAAC,AACJ,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,GAAG,AACnB,CAAC,AAED,gBAAgB,8BAAC,CAAC,AACd,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CACjD,WAAW,CAAE,IAAI,AACrB,CAAC,AACD,2CAAa,cAAc,AAAC,CAAC,AACzB,cAAc,CAAE,SAAS,AAC7B,CAAC,AAEJ,aAAa,8BAAC,CAAC,AACR,UAAU,CAAE,IAAI,iBAAiB,CAAC,AACzC,CAAC,AAEE,4BAAa,CAAC,iBAAE,MAAM,AAAC,CAAC,AACpB,UAAU,CAAE,OAAO,AACvB,CAAC,AAED,OAAO,8BAAC,CAAC,AACL,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,KAAK,CAAE,IAAI,eAAe,CAAC,AAC/B,CAAC"}`
};
var FilterCollection = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let active;
  let { filterCollection } = $$props;
  let { itemAttr = $$props } = $$props;
  let { exportedActive } = $$props;
  const temp = new Model();
  if ($$props.filterCollection === void 0 && $$bindings.filterCollection && filterCollection !== void 0)
    $$bindings.filterCollection(filterCollection);
  if ($$props.itemAttr === void 0 && $$bindings.itemAttr && itemAttr !== void 0)
    $$bindings.itemAttr(itemAttr);
  if ($$props.exportedActive === void 0 && $$bindings.exportedActive && exportedActive !== void 0)
    $$bindings.exportedActive(exportedActive);
  $$result.css.add(css$n);
  {
    if (exportedActive == false) {
      active = false;
      exportedActive = void 0;
    }
  }
  active = false;
  return `<div class="${"filterlist_item svelte-1azp24g"}"><div class="${["unique_title svelte-1azp24g", active ? "active" : ""].join(" ").trim()}"><span class="${["val svelte-1azp24g", ""].join(" ").trim()}">${escape(itemAttr[0])}</span>
        <span class="${"material-icons-outlined arrow svelte-1azp24g"}">expand_more</span></div>
    ${active ? `<ul class="${"filters_list svelte-1azp24g"}">${each(itemAttr[1], (itemVal) => `<li class="${"svelte-1azp24g"}">${validate_component(Checkbox, "Checkbox").$$render($$result, {
    spanValue: itemVal,
    checkBrand: () => filterCollection = temp.fillFiltersParameters(filterCollection, itemVal, itemAttr[0]),
    allCheckedFilters: temp.getInitialCheckboxesState(filterCollection, itemAttr[0], itemVal)
  }, {}, {})}
                </li>`)}</ul>` : ``}
</div>`;
});
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function tick_spring(ctx, last_value, current_value, target_value) {
  if (typeof current_value === "number" || is_date(current_value)) {
    const delta = target_value - current_value;
    const velocity = (current_value - last_value) / (ctx.dt || 1 / 60);
    const spring2 = ctx.opts.stiffness * delta;
    const damper = ctx.opts.damping * velocity;
    const acceleration = (spring2 - damper) * ctx.inv_mass;
    const d2 = (velocity + acceleration) * ctx.dt;
    if (Math.abs(d2) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
      return target_value;
    } else {
      ctx.settled = false;
      return is_date(current_value) ? new Date(current_value.getTime() + d2) : current_value + d2;
    }
  } else if (Array.isArray(current_value)) {
    return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
  } else if (typeof current_value === "object") {
    const next_value = {};
    for (const k in current_value) {
      next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
    }
    return next_value;
  } else {
    throw new Error(`Cannot spring ${typeof current_value} values`);
  }
}
function spring(value, opts = {}) {
  const store = writable(value);
  const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
  let last_time;
  let task;
  let current_token;
  let last_value = value;
  let target_value = value;
  let inv_mass = 1;
  let inv_mass_recovery_rate = 0;
  let cancel_task = false;
  function set(new_value, opts2 = {}) {
    target_value = new_value;
    const token = current_token = {};
    if (value == null || opts2.hard || spring2.stiffness >= 1 && spring2.damping >= 1) {
      cancel_task = true;
      last_time = now();
      last_value = new_value;
      store.set(value = target_value);
      return Promise.resolve();
    } else if (opts2.soft) {
      const rate = opts2.soft === true ? 0.5 : +opts2.soft;
      inv_mass_recovery_rate = 1 / (rate * 60);
      inv_mass = 0;
    }
    if (!task) {
      last_time = now();
      cancel_task = false;
      task = loop((now2) => {
        if (cancel_task) {
          cancel_task = false;
          task = null;
          return false;
        }
        inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
        const ctx = {
          inv_mass,
          opts: spring2,
          settled: true,
          dt: (now2 - last_time) * 60 / 1e3
        };
        const next_value = tick_spring(ctx, last_value, value, target_value);
        last_time = now2;
        last_value = value;
        store.set(value = next_value);
        if (ctx.settled) {
          task = null;
        }
        return !ctx.settled;
      });
    }
    return new Promise((fulfil) => {
      task.promise.then(() => {
        if (token === current_token)
          fulfil();
      });
    });
  }
  const spring2 = {
    set,
    update: (fn, opts2) => set(fn(target_value, value), opts2),
    subscribe: store.subscribe,
    stiffness,
    damping,
    precision
  };
  return spring2;
}
var css$m = {
  code: ".rangeSlider{--pip:var(--range-pip, lightslategray);--pip-text:var(--range-pip-text, var(--pip));--pip-active:var(--range-pip-active, darkslategrey);--pip-active-text:var(--range-pip-active-text, var(--pip-active));--pip-in-range:var(--range-pip-in-range, var(--pip-active));--pip-in-range-text:var(--range-pip-in-range-text, var(--pip-active-text))}.rangePips{position:absolute;height:1em;left:0;right:0;bottom:-1em}.rangePips.vertical{height:auto;width:1em;left:100%;right:auto;top:0;bottom:0}.rangePips .pip{height:0.4em;position:absolute;top:0.25em;width:1px;white-space:nowrap}.rangePips.vertical .pip{height:1px;width:0.4em;top:0;left:0.25em}.rangePips .pip.selected{height:0.75em}.rangePips.vertical .pip.selected{height:1px;width:0.75em}.rangePips .pipVal{position:absolute;top:0.4em;transform:translate(-50%, 25%)}.rangePips.vertical .pipVal{position:absolute;top:0;left:0.4em;transform:translate(25%, -50%)}.rangePips .pip.selected .pipVal{font-weight:bold;top:0.75em}.rangePips.vertical .pip.selected .pipVal{top:0;left:0.75em}.rangePips .pip{transition:all 0.15s ease}.rangePips .pipVal{transition:all 0.15s ease}.rangePips .pip{color:lightslategray;color:var(--pip-text);background-color:lightslategray;background-color:var(--pip)}.rangePips .pip.selected{color:darkslategrey;color:var(--pip-active-text);background-color:darkslategrey;background-color:var(--pip-active)}.rangePips .pip.in-range{color:darkslategrey;color:var(--pip-in-range-text);background-color:darkslategrey;background-color:var(--pip-in-range)}",
  map: `{"version":3,"file":"RangePips.svelte","sources":["RangePips.svelte"],"sourcesContent":["<script>\\n\\n  // range slider props\\n  export let range = false;\\n  export let min = 0;\\n  export let max = 100;\\n  export let step = 1;\\n  export let values = [(max + min) / 2];\\n  export let vertical = false;\\n\\n  // range pips / values props\\n  export let pipstep = undefined;\\n  export let all = true;\\n  export let first = undefined;\\n  export let last = undefined;\\n  export let rest = undefined;\\n\\n  // formatting props\\n  export let prefix = \\"\\";\\n  export let suffix = \\"\\";\\n  export let formatter = (v,i) => v;\\n\\n  // stylistic props\\n  export let focus = undefined;\\n  export let percentOf = undefined;\\n\\n  $: pipStep = pipstep || ((max - min) / step >= ( vertical ? 50 : 100 ) ? (max - min) / ( vertical ? 10 : 20 ) : 1);\\n\\n  $: pipCount = parseInt((max - min) / (step * pipStep), 10);\\n\\n  $: pipVal = function(val) {\\n    return min + val * step * pipStep;\\n  };\\n\\n  $: isSelected = function(val) {\\n    return values.some(v => v === val);\\n  };\\n\\n  $: inRange = function(val) {\\n    if (range === \\"min\\") {\\n      return values[0] > val;\\n    } else if (range === \\"max\\") {\\n      return values[0] < val;\\n    } else if (range) {\\n      return values[0] < val && values[1] > val;\\n    }\\n  };\\n<\/script>\\n\\n<style>\\n  :global(.rangeSlider) {\\n    --pip: var(--range-pip, lightslategray);\\n    --pip-text: var(--range-pip-text, var(--pip));\\n    --pip-active: var(--range-pip-active, darkslategrey);\\n    --pip-active-text: var(--range-pip-active-text, var(--pip-active));\\n    --pip-in-range: var(--range-pip-in-range, var(--pip-active));\\n    --pip-in-range-text: var(--range-pip-in-range-text, var(--pip-active-text));\\n  }\\n  :global(.rangePips) {\\n    position: absolute;\\n    height: 1em;\\n    left: 0;\\n    right: 0;\\n    bottom: -1em;\\n  }\\n  :global(.rangePips.vertical) {\\n    height: auto;\\n    width: 1em;\\n    left: 100%;\\n    right: auto;\\n    top: 0;\\n    bottom: 0;\\n  }\\n  :global(.rangePips .pip) {\\n    height: 0.4em;\\n    position: absolute;\\n    top: 0.25em;\\n    width: 1px;\\n    white-space: nowrap;\\n  }\\n  :global(.rangePips.vertical .pip) {\\n    height: 1px;\\n    width: 0.4em;\\n    top: 0;\\n    left: 0.25em;\\n  }\\n  :global(.rangePips .pip.selected) {\\n    height: 0.75em;\\n  }\\n  :global(.rangePips.vertical .pip.selected) {\\n    height: 1px;\\n    width: 0.75em;\\n  }\\n  :global(.rangePips .pipVal) {\\n    position: absolute;\\n    top: 0.4em;\\n    transform: translate(-50%, 25%);\\n  }\\n  :global(.rangePips.vertical .pipVal) {\\n    position: absolute;\\n    top: 0;\\n    left: 0.4em;\\n    transform: translate(25%, -50%);\\n  }\\n  :global(.rangePips .pip.selected .pipVal) {\\n    font-weight: bold;\\n    top: 0.75em;\\n  }\\n  :global(.rangePips.vertical .pip.selected .pipVal) {\\n    top: 0;\\n    left: 0.75em;\\n  }\\n  :global(.rangePips .pip) {\\n    transition: all 0.15s ease;\\n  }\\n  :global(.rangePips .pipVal) {\\n    transition: all 0.15s ease;\\n  }\\n  :global(.rangePips .pip) {\\n    color: lightslategray;\\n    color: var(--pip-text);\\n    background-color: lightslategray;\\n    background-color: var(--pip);\\n  }\\n  :global(.rangePips .pip.selected) {\\n    color: darkslategrey;\\n    color: var(--pip-active-text);\\n    background-color: darkslategrey;\\n    background-color: var(--pip-active);\\n  }\\n  :global(.rangePips .pip.in-range) {\\n    color: darkslategrey;\\n    color: var(--pip-in-range-text);\\n    background-color: darkslategrey;\\n    background-color: var(--pip-in-range);\\n  }\\n</style>\\n\\n<div class=\\"rangePips\\" class:focus class:vertical>\\n  {#if ( all && first !== false ) || first }\\n    <span\\n      class=\\"pip first\\"\\n      class:selected={isSelected(min)}\\n      class:in-range={inRange(min)}\\n      style=\\"{vertical ? 'top' : 'left'}: 0%;\\">\\n      {#if all === 'label' || first === 'label'}\\n        <span class=\\"pipVal\\">\\n          {#if prefix}<span class=\\"pipVal-prefix\\">{prefix}</span>{/if}{formatter(min,0)}{#if suffix}<span class=\\"pipVal-suffix\\">{suffix}</span>{/if}\\n        </span>\\n      {/if}\\n    </span>\\n  {/if}\\n  {#if ( all && rest !== false ) || rest}\\n    {#each Array(pipCount + 1) as _, i}\\n      {#if pipVal(i) !== min && pipVal(i) !== max}\\n        <span\\n          class=\\"pip\\"\\n          class:selected={isSelected(pipVal(i))}\\n          class:in-range={inRange(pipVal(i))}\\n          style=\\"{vertical ? 'top' : 'left'}: {percentOf(pipVal(i))}%;\\">\\n          {#if all === 'label' || rest === 'label'}\\n            <span class=\\"pipVal\\">\\n              {#if prefix}<span class=\\"pipVal-prefix\\">{prefix}</span>{/if}{formatter(pipVal(i),i)}{#if suffix}<span class=\\"pipVal-suffix\\">{suffix}</span>{/if}\\n            </span>\\n          {/if}\\n        </span>\\n      {/if}\\n    {/each}\\n  {/if}\\n  {#if ( all && last !== false ) || last}\\n    <span\\n      class=\\"pip last\\"\\n      class:selected={isSelected(max)}\\n      class:in-range={inRange(max)}\\n      style=\\"{vertical ? 'top' : 'left'}: 100%;\\">\\n      {#if all === 'label' || last === 'label'}\\n        <span class=\\"pipVal\\">\\n          {#if prefix}<span class=\\"pipVal-prefix\\">{prefix}</span>{/if}{formatter(max,pipCount)}{#if suffix}<span class=\\"pipVal-suffix\\">{suffix}</span>{/if}\\n        </span>\\n      {/if}\\n    </span>\\n  {/if}\\n</div>\\n"],"names":[],"mappings":"AAkDU,YAAY,AAAE,CAAC,AACrB,KAAK,CAAE,gCAAgC,CACvC,UAAU,CAAE,iCAAiC,CAC7C,YAAY,CAAE,sCAAsC,CACpD,iBAAiB,CAAE,+CAA+C,CAClE,cAAc,CAAE,4CAA4C,CAC5D,mBAAmB,CAAE,sDAAsD,AAC7E,CAAC,AACO,UAAU,AAAE,CAAC,AACnB,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,GAAG,CACX,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,MAAM,CAAE,IAAI,AACd,CAAC,AACO,mBAAmB,AAAE,CAAC,AAC5B,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,GAAG,CACV,IAAI,CAAE,IAAI,CACV,KAAK,CAAE,IAAI,CACX,GAAG,CAAE,CAAC,CACN,MAAM,CAAE,CAAC,AACX,CAAC,AACO,eAAe,AAAE,CAAC,AACxB,MAAM,CAAE,KAAK,CACb,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,MAAM,CACX,KAAK,CAAE,GAAG,CACV,WAAW,CAAE,MAAM,AACrB,CAAC,AACO,wBAAwB,AAAE,CAAC,AACjC,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,KAAK,CACZ,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,MAAM,AACd,CAAC,AACO,wBAAwB,AAAE,CAAC,AACjC,MAAM,CAAE,MAAM,AAChB,CAAC,AACO,iCAAiC,AAAE,CAAC,AAC1C,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,MAAM,AACf,CAAC,AACO,kBAAkB,AAAE,CAAC,AAC3B,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,KAAK,CACV,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,GAAG,CAAC,AACjC,CAAC,AACO,2BAA2B,AAAE,CAAC,AACpC,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CACX,SAAS,CAAE,UAAU,GAAG,CAAC,CAAC,IAAI,CAAC,AACjC,CAAC,AACO,gCAAgC,AAAE,CAAC,AACzC,WAAW,CAAE,IAAI,CACjB,GAAG,CAAE,MAAM,AACb,CAAC,AACO,yCAAyC,AAAE,CAAC,AAClD,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,MAAM,AACd,CAAC,AACO,eAAe,AAAE,CAAC,AACxB,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,AAC5B,CAAC,AACO,kBAAkB,AAAE,CAAC,AAC3B,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,AAC5B,CAAC,AACO,eAAe,AAAE,CAAC,AACxB,KAAK,CAAE,cAAc,CACrB,KAAK,CAAE,IAAI,UAAU,CAAC,CACtB,gBAAgB,CAAE,cAAc,CAChC,gBAAgB,CAAE,IAAI,KAAK,CAAC,AAC9B,CAAC,AACO,wBAAwB,AAAE,CAAC,AACjC,KAAK,CAAE,aAAa,CACpB,KAAK,CAAE,IAAI,iBAAiB,CAAC,CAC7B,gBAAgB,CAAE,aAAa,CAC/B,gBAAgB,CAAE,IAAI,YAAY,CAAC,AACrC,CAAC,AACO,wBAAwB,AAAE,CAAC,AACjC,KAAK,CAAE,aAAa,CACpB,KAAK,CAAE,IAAI,mBAAmB,CAAC,CAC/B,gBAAgB,CAAE,aAAa,CAC/B,gBAAgB,CAAE,IAAI,cAAc,CAAC,AACvC,CAAC"}`
};
var RangePips = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let pipStep;
  let pipCount;
  let pipVal;
  let isSelected;
  let inRange;
  let { range = false } = $$props;
  let { min = 0 } = $$props;
  let { max = 100 } = $$props;
  let { step = 1 } = $$props;
  let { values = [(max + min) / 2] } = $$props;
  let { vertical = false } = $$props;
  let { pipstep = void 0 } = $$props;
  let { all = true } = $$props;
  let { first = void 0 } = $$props;
  let { last = void 0 } = $$props;
  let { rest = void 0 } = $$props;
  let { prefix = "" } = $$props;
  let { suffix = "" } = $$props;
  let { formatter = (v, i) => v } = $$props;
  let { focus = void 0 } = $$props;
  let { percentOf = void 0 } = $$props;
  if ($$props.range === void 0 && $$bindings.range && range !== void 0)
    $$bindings.range(range);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.vertical === void 0 && $$bindings.vertical && vertical !== void 0)
    $$bindings.vertical(vertical);
  if ($$props.pipstep === void 0 && $$bindings.pipstep && pipstep !== void 0)
    $$bindings.pipstep(pipstep);
  if ($$props.all === void 0 && $$bindings.all && all !== void 0)
    $$bindings.all(all);
  if ($$props.first === void 0 && $$bindings.first && first !== void 0)
    $$bindings.first(first);
  if ($$props.last === void 0 && $$bindings.last && last !== void 0)
    $$bindings.last(last);
  if ($$props.rest === void 0 && $$bindings.rest && rest !== void 0)
    $$bindings.rest(rest);
  if ($$props.prefix === void 0 && $$bindings.prefix && prefix !== void 0)
    $$bindings.prefix(prefix);
  if ($$props.suffix === void 0 && $$bindings.suffix && suffix !== void 0)
    $$bindings.suffix(suffix);
  if ($$props.formatter === void 0 && $$bindings.formatter && formatter !== void 0)
    $$bindings.formatter(formatter);
  if ($$props.focus === void 0 && $$bindings.focus && focus !== void 0)
    $$bindings.focus(focus);
  if ($$props.percentOf === void 0 && $$bindings.percentOf && percentOf !== void 0)
    $$bindings.percentOf(percentOf);
  $$result.css.add(css$m);
  pipStep = pipstep || ((max - min) / step >= (vertical ? 50 : 100) ? (max - min) / (vertical ? 10 : 20) : 1);
  pipCount = parseInt((max - min) / (step * pipStep), 10);
  pipVal = function(val) {
    return min + val * step * pipStep;
  };
  isSelected = function(val) {
    return values.some((v) => v === val);
  };
  inRange = function(val) {
    if (range === "min") {
      return values[0] > val;
    } else if (range === "max") {
      return values[0] < val;
    } else if (range) {
      return values[0] < val && values[1] > val;
    }
  };
  return `<div class="${["rangePips", (focus ? "focus" : "") + " " + (vertical ? "vertical" : "")].join(" ").trim()}">${all && first !== false || first ? `<span class="${[
    "pip first",
    (isSelected(min) ? "selected" : "") + " " + (inRange(min) ? "in-range" : "")
  ].join(" ").trim()}" style="${escape(vertical ? "top" : "left") + ": 0%;"}">${all === "label" || first === "label" ? `<span class="${"pipVal"}">${prefix ? `<span class="${"pipVal-prefix"}">${escape(prefix)}</span>` : ``}${escape(formatter(min, 0))}${suffix ? `<span class="${"pipVal-suffix"}">${escape(suffix)}</span>` : ``}</span>` : ``}</span>` : ``}
  ${all && rest !== false || rest ? `${each(Array(pipCount + 1), (_, i) => `${pipVal(i) !== min && pipVal(i) !== max ? `<span class="${[
    "pip",
    (isSelected(pipVal(i)) ? "selected" : "") + " " + (inRange(pipVal(i)) ? "in-range" : "")
  ].join(" ").trim()}" style="${escape(vertical ? "top" : "left") + ": " + escape(percentOf(pipVal(i))) + "%;"}">${all === "label" || rest === "label" ? `<span class="${"pipVal"}">${prefix ? `<span class="${"pipVal-prefix"}">${escape(prefix)}</span>` : ``}${escape(formatter(pipVal(i), i))}${suffix ? `<span class="${"pipVal-suffix"}">${escape(suffix)}</span>` : ``}
            </span>` : ``}
        </span>` : ``}`)}` : ``}
  ${all && last !== false || last ? `<span class="${[
    "pip last",
    (isSelected(max) ? "selected" : "") + " " + (inRange(max) ? "in-range" : "")
  ].join(" ").trim()}" style="${escape(vertical ? "top" : "left") + ": 100%;"}">${all === "label" || last === "label" ? `<span class="${"pipVal"}">${prefix ? `<span class="${"pipVal-prefix"}">${escape(prefix)}</span>` : ``}${escape(formatter(max, pipCount))}${suffix ? `<span class="${"pipVal-suffix"}">${escape(suffix)}</span>` : ``}</span>` : ``}</span>` : ``}</div>`;
});
var css$l = {
  code: '.rangeSlider{--slider:var(--range-slider, #d7dada);--handle-inactive:var(--range-handle-inactive, #99a2a2);--handle:var(--range-handle, #838de7);--handle-focus:var(--range-handle-focus, #4a40d4);--handle-border:var(--range-handle-border, var(--handle));--range-inactive:var(--range-range-inactive, var(--handle-inactive));--range:var(--range-range, var(--handle-focus));--float-inactive:var(--range-float-inactive, var(--handle-inactive));--float:var(--range-float, var(--handle-focus));--float-text:var(--range-float-text, white)}.rangeSlider{position:relative;border-radius:100px;height:0.5em;margin:1em;transition:opacity 0.2s ease;user-select:none}.rangeSlider *{user-select:none}.rangeSlider.pips{margin-bottom:1.8em}.rangeSlider.pip-labels{margin-bottom:2.8em}.rangeSlider.vertical{display:inline-block;border-radius:100px;width:0.5em;min-height:200px}.rangeSlider.vertical.pips{margin-right:1.8em;margin-bottom:1em}.rangeSlider.vertical.pip-labels{margin-right:2.8em;margin-bottom:1em}.rangeSlider .rangeHandle{position:absolute;display:block;height:1.4em;width:1.4em;top:0.25em;left:0.25em;transform:translateY(-50%) translateX(-50%);z-index:2}.rangeSlider .rangeNub,.rangeSlider .rangeHandle:before{position:absolute;left:0;top:0;display:block;border-radius:10em;height:100%;width:100%;transition:all 0.2s ease}.rangeSlider .rangeHandle:before{content:"";left:1px;top:1px;bottom:1px;right:1px;height:auto;width:auto;box-shadow:0 0 0 0px var(--handle-border);opacity:0}.rangeSlider .rangeHandle.hoverable:hover:before{box-shadow:0 0 0 8px var(--handle-border);opacity:0.2}.rangeSlider .rangeHandle.hoverable.press:before,.rangeSlider .rangeHandle.hoverable.press:hover:before{box-shadow:0 0 0 12px var(--handle-border);opacity:0.4}.rangeSlider.range:not(.min):not(.max) .rangeNub{border-radius:10em 10em 10em 1.6em}.rangeSlider.range .rangeHandle:nth-of-type(1) .rangeNub{transform:rotate(-135deg)}.rangeSlider.range .rangeHandle:nth-of-type(2) .rangeNub{transform:rotate(45deg)}.rangeSlider.range.vertical .rangeHandle:nth-of-type(1) .rangeNub{transform:rotate(-45deg)}.rangeSlider.range.vertical .rangeHandle:nth-of-type(2) .rangeNub{transform:rotate(135deg)}.rangeSlider .rangeFloat{display:block;position:absolute;left:50%;top:-0.5em;transform:translate(-50%, -100%);font-size:1em;text-align:center;opacity:0;pointer-events:none;white-space:nowrap;transition:all 0.2s ease;font-size:0.9em;padding:0.2em 0.4em;border-radius:0.2em}.rangeSlider .rangeHandle.active .rangeFloat,.rangeSlider .rangeHandle.hoverable:hover .rangeFloat{opacity:1;top:-0.2em;transform:translate(-50%, -100%)}.rangeSlider .rangeBar{position:absolute;display:block;transition:background 0.2s ease;border-radius:1em;height:0.5em;top:0;user-select:none;z-index:1}.rangeSlider.vertical .rangeBar{width:0.5em;height:auto}.rangeSlider{background-color:#d7dada;background-color:var(--slider)}.rangeSlider .rangeBar{background-color:#99a2a2;background-color:var(--range-inactive)}.rangeSlider.focus .rangeBar{background-color:#838de7;background-color:var(--range)}.rangeSlider .rangeNub{background-color:#99a2a2;background-color:var(--handle-inactive)}.rangeSlider.focus .rangeNub{background-color:#838de7;background-color:var(--handle)}.rangeSlider .rangeHandle.active .rangeNub{background-color:#4a40d4;background-color:var(--handle-focus)}.rangeSlider .rangeFloat{color:white;color:var(--float-text);background-color:#99a2a2;background-color:var(--float-inactive)}.rangeSlider.focus .rangeFloat{background-color:#4a40d4;background-color:var(--float)}.rangeSlider.disabled {opacity:0.5}.rangeSlider.disabled .rangeNub{background-color:#d7dada;background-color:var(--slider)}',
  map: `{"version":3,"file":"RangeSlider.svelte","sources":["RangeSlider.svelte"],"sourcesContent":["<script>\\n  import { spring } from \\"svelte/motion\\";\\n  import { createEventDispatcher } from \\"svelte\\";\\n  import RangePips from \\"./RangePips.svelte\\";\\n\\n  // range slider props\\n  export let range = false;\\n  export let pushy = false;\\n  export let min = 0;\\n  export let max = 100;\\n  export let step = 1;\\n  export let values = [(max + min) / 2];\\n  export let vertical = false;\\n  export let float = false;\\n  export let hover = true;\\n  export let disabled = false;\\n\\n  // range pips / values props\\n  export let pips = false;\\n  export let pipstep = undefined;\\n  export let all = undefined;\\n  export let first = undefined;\\n  export let last = undefined;\\n  export let rest = undefined;\\n\\n  // formatting props\\n  export let id = undefined;\\n  export let prefix = \\"\\";\\n  export let suffix = \\"\\";\\n  export let formatter = (v,i) => v;\\n  export let handleFormatter = formatter;\\n\\n  // stylistic props\\n  export let precision = 2;\\n  export let springValues = { stiffness: 0.15, damping: 0.4 };\\n\\n  // prepare dispatched events\\n  const dispatch = createEventDispatcher();\\n\\n  // dom references\\n  let slider;\\n\\n  // state management\\n  let valueLength = 0;\\n  let focus = false;\\n  let handleActivated = false;\\n  let handlePressed = false;\\n  let keyboardActive = false;\\n  let activeHandle = values.length - 1;\\n  let startValue;\\n  let previousValue;\\n\\n  // copy the initial values in to a spring function which\\n  // will update every time the values array is modified\\n\\n  let springPositions;\\n\\n  $: {\\n\\n    // check that \\"values\\" is an array, or set it as array\\n    // to prevent any errors in springs, or range trimming\\n    if ( !Array.isArray( values ) ) {\\n      values = [(max + min) / 2];\\n      console.error( \\"'values' prop should be an Array (https://github.com/simeydotme/svelte-range-slider-pips#slider-props)\\" );\\n    }\\n    // trim the range so it remains as a min/max (only 2 handles)\\n    // and also align the handles to the steps\\n    values = trimRange(values.map((v) => alignValueToStep(v)));\\n\\n    // check if the valueLength (length of values[]) has changed,\\n    // because if so we need to re-seed the spring function with the\\n    // new values array.\\n    if ( valueLength !== values.length ) {\\n      // set the initial spring values when the slider initialises,\\n      // or when values array length has changed\\n      springPositions = spring(values.map((v) => percentOf(v)), springValues );\\n    } else {\\n      // update the value of the spring function for animated handles\\n      // whenever the values has updated\\n      springPositions.set(values.map((v) => percentOf(v)));\\n    }\\n    // set the valueLength for the next check\\n    valueLength = values.length;\\n  };\\n\\n  /**\\n   * take in a value, and then calculate that value's percentage\\n   * of the overall range (min-max);\\n   * @param {number} val the value we're getting percent for\\n   * @return {number} the percentage value\\n   **/\\n  $: percentOf = function (val) {\\n    let perc = ((val - min) / (max - min)) * 100;\\n    if (isNaN(perc) || perc <= 0) {\\n      return 0;\\n    } else if (perc >= 100) {\\n      return 100;\\n    } else {\\n      return parseFloat(perc.toFixed(precision));\\n    }\\n  };\\n\\n  /**\\n   * clamp a value from the range so that it always\\n   * falls within the min/max values\\n   * @param {number} val the value to clamp\\n   * @return {number} the value after it's been clamped\\n   **/\\n  $: clampValue = function (val) {\\n    // return the min/max if outside of that range\\n    return val <= min ? min : val >= max ? max : val;\\n  };\\n\\n  /**\\n   * align the value with the steps so that it\\n   * always sits on the closest (above/below) step\\n   * @param {number} val the value to align\\n   * @return {number} the value after it's been aligned\\n   **/\\n  $: alignValueToStep = function (val) {\\n    // sanity check for performance\\n    if (val <= min) {\\n      return min;\\n    } else if (val >= max) {\\n      return max;\\n    }\\n\\n    // find the middle-point between steps\\n    // and see if the value is closer to the\\n    // next step, or previous step\\n    let remainder = (val - min) % step;\\n    let aligned = val - remainder;\\n    if (Math.abs(remainder) * 2 >= step) {\\n      aligned += remainder > 0 ? step : -step;\\n    }\\n    // make sure the value is within acceptable limits\\n    aligned = clampValue(aligned);\\n    // make sure the returned value is set to the precision desired\\n    // this is also because javascript often returns weird floats\\n    // when dealing with odd numbers and percentages\\n\\n    return parseFloat(aligned.toFixed(precision));\\n  };\\n\\n  /**\\n   * helper func to get the index of an element in it's DOM container\\n   * @param {object} el dom object reference we want the index of\\n   * @returns {number} the index of the input element\\n   **/\\n  function index(el) {\\n    if (!el) return -1;\\n    var i = 0;\\n    while ((el = el.previousElementSibling)) {\\n      i++;\\n    }\\n    return i;\\n  }\\n\\n  /**\\n   * noramlise a mouse or touch event to return the\\n   * client (x/y) object for that event\\n   * @param {event} e a mouse/touch event to normalise\\n   * @returns {object} normalised event client object (x,y)\\n   **/\\n  function normalisedClient(e) {\\n    if (e.type.includes(\\"touch\\")) {\\n      return e.touches[0];\\n    } else {\\n      return e;\\n    }\\n  }\\n\\n  /**\\n   * check if an element is a handle on the slider\\n   * @param {object} el dom object reference we want to check\\n   * @returns {boolean}\\n   **/\\n  function targetIsHandle(el) {\\n    const handles = slider.querySelectorAll(\\".handle\\");\\n    const isHandle = Array.prototype.includes.call(handles, el);\\n    const isChild = Array.prototype.some.call(handles, (e) => e.contains(el));\\n    return isHandle || isChild;\\n  }\\n\\n  /**\\n   * trim the values array based on whether the property\\n   * for 'range' is 'min', 'max', or truthy. This is because we\\n   * do not want more than one handle for a min/max range, and we do\\n   * not want more than two handles for a true range.\\n   * @param {array} values the input values for the rangeSlider\\n   * @return {array} the range array for creating a rangeSlider\\n   **/\\n  function trimRange(values) {\\n    if (range === \\"min\\" || range === \\"max\\") {\\n      return values.slice(0, 1);\\n    } else if (range) {\\n      return values.slice(0, 2);\\n    } else {\\n      return values;\\n    }\\n  }\\n\\n  /**\\n   * helper to return the slider dimensions for finding\\n   * the closest handle to user interaction\\n   * @return {object} the range slider DOM client rect\\n   **/\\n  function getSliderDimensions() {\\n    return slider.getBoundingClientRect();\\n  }\\n\\n  /**\\n   * helper to return closest handle to user interaction\\n   * @param {object} clientPos the client{x,y} positions to check against\\n   * @return {number} the index of the closest handle to clientPos\\n   **/\\n  function getClosestHandle(clientPos) {\\n    // first make sure we have the latest dimensions\\n    // of the slider, as it may have changed size\\n    const dims = getSliderDimensions();\\n    // calculate the interaction position, percent and value\\n    let hPos = 0;\\n    let hPercent = 0;\\n    let hVal = 0;\\n    if (vertical) {\\n      hPos = clientPos.clientY - dims.top;\\n      hPercent = (hPos / dims.height) * 100;\\n      hVal = ((max - min) / 100) * hPercent + min;\\n    } else {\\n      hPos = clientPos.clientX - dims.left;\\n      hPercent = (hPos / dims.width) * 100;\\n      hVal = ((max - min) / 100) * hPercent + min;\\n    }\\n\\n    let closest;\\n\\n    // if we have a range, and the handles are at the same\\n    // position, we want a simple check if the interaction\\n    // value is greater than return the second handle\\n    if (range === true && values[0] === values[1]) {\\n      if (hVal > values[1]) {\\n        return 1;\\n      } else {\\n        return 0;\\n      }\\n      // if there are multiple handles, and not a range, then\\n      // we sort the handles values, and return the first one closest\\n      // to the interaction value\\n    } else {\\n      closest = values.indexOf(\\n        [...values].sort((a, b) => Math.abs(hVal - a) - Math.abs(hVal - b))[0]\\n      );\\n    }\\n    return closest;\\n  }\\n\\n  /**\\n   * take the interaction position on the slider, convert\\n   * it to a value on the range, and then send that value\\n   * through to the moveHandle() method to set the active\\n   * handle's position\\n   * @param {object} clientPos the client{x,y} of the interaction\\n   **/\\n  function handleInteract(clientPos) {\\n    // first make sure we have the latest dimensions\\n    // of the slider, as it may have changed size\\n    const dims = getSliderDimensions();\\n    // calculate the interaction position, percent and value\\n    let hPos = 0;\\n    let hPercent = 0;\\n    let hVal = 0;\\n    if (vertical) {\\n      hPos = clientPos.clientY - dims.top;\\n      hPercent = (hPos / dims.height) * 100;\\n      hVal = ((max - min) / 100) * hPercent + min;\\n    } else {\\n      hPos = clientPos.clientX - dims.left;\\n      hPercent = (hPos / dims.width) * 100;\\n      hVal = ((max - min) / 100) * hPercent + min;\\n    }\\n    // move handle to the value\\n    moveHandle(activeHandle, hVal);\\n  }\\n\\n  /**\\n   * move a handle to a specific value, respecting the clamp/align rules\\n   * @param {number} index the index of the handle we want to move\\n   * @param {number} value the value to move the handle to\\n   * @return {number} the value that was moved to (after alignment/clamping)\\n   **/\\n  function moveHandle(index, value) {\\n    // align & clamp the value so we're not doing extra\\n    // calculation on an out-of-range value down below\\n    value = alignValueToStep(value);\\n    // if this is a range slider\\n    if (range) {\\n      // restrict the handles of a range-slider from\\n      // going past one-another unless \\"pushy\\" is true\\n      if (index === 0 && value > values[1]) {\\n        if (pushy) {\\n          values[1] = value;\\n        } else {\\n          value = values[1];\\n        }\\n      } else if (index === 1 && value < values[0]) {\\n        if (pushy) {\\n          values[0] = value;\\n        } else {\\n          value = values[0];\\n        }\\n      }\\n    }\\n\\n    // if the value has changed, update it\\n    if (values[index] !== value) {\\n      values[index] = value;\\n    }\\n\\n    // fire the change event when the handle moves,\\n    // and store the previous value for the next time\\n    if (previousValue !== value) {\\n      eChange();\\n      previousValue = value;\\n    }\\n  }\\n\\n  /**\\n   * helper to find the beginning range value for use with css style\\n   * @param {array} values the input values for the rangeSlider\\n   * @return {number} the beginning of the range\\n   **/\\n  function rangeStart(values) {\\n    if (range === \\"min\\") {\\n      return 0;\\n    } else {\\n      return values[0];\\n    }\\n  }\\n\\n  /**\\n   * helper to find the ending range value for use with css style\\n   * @param {array} values the input values for the rangeSlider\\n   * @return {number} the end of the range\\n   **/\\n  function rangeEnd(values) {\\n    if (range === \\"max\\") {\\n      return 0;\\n    } else if (range === \\"min\\") {\\n      return 100 - values[0];\\n    } else {\\n      return 100 - values[1];\\n    }\\n  }\\n\\n  /**\\n   * when the user has unfocussed (blurred) from the\\n   * slider, deactivated all handles\\n   * @param {event} e the event from browser\\n   **/\\n  function sliderBlurHandle(e) {\\n    if (keyboardActive) {\\n      focus = false;\\n      handleActivated = false;\\n      handlePressed = false;\\n    }\\n  }\\n\\n  /**\\n   * when the user focusses the handle of a slider\\n   * set it to be active\\n   * @param {event} e the event from browser\\n   **/\\n  function sliderFocusHandle(e) {\\n    if ( !disabled ) {\\n      activeHandle = index(e.target);\\n      focus = true;\\n    }\\n  }\\n\\n  /**\\n   * handle the keyboard accessible features by checking the\\n   * input type, and modfier key then moving handle by appropriate amount\\n   * @param {event} e the event from browser\\n   **/\\n  function sliderKeydown(e) {\\n    if ( !disabled ) {\\n      const handle = index(e.target);\\n      let jump = e.ctrlKey || e.metaKey || e.shiftKey ? step * 10 : step;\\n      let prevent = false;\\n\\n      switch (e.key) {\\n        case \\"PageDown\\":\\n          jump *= 10;\\n        case \\"ArrowRight\\":\\n        case \\"ArrowUp\\":\\n          moveHandle(handle, values[handle] + jump);\\n          prevent = true;\\n          break;\\n        case \\"PageUp\\":\\n          jump *= 10;\\n        case \\"ArrowLeft\\":\\n        case \\"ArrowDown\\":\\n          moveHandle(handle, values[handle] - jump);\\n          prevent = true;\\n          break;\\n        case \\"Home\\":\\n          moveHandle(handle, min);\\n          prevent = true;\\n          break;\\n        case \\"End\\":\\n          moveHandle(handle, max);\\n          prevent = true;\\n          break;\\n      }\\n      if (prevent) {\\n        e.preventDefault();\\n        e.stopPropagation();\\n      }\\n    }\\n  }\\n\\n  /**\\n   * function to run when the user touches\\n   * down on the slider element anywhere\\n   * @param {event} e the event from browser\\n   **/\\n  function sliderInteractStart(e) {\\n    if ( !disabled ) {\\n      const clientPos = normalisedClient(e);\\n      // set the closest handle as active\\n      focus = true;\\n      handleActivated = true;\\n      handlePressed = true;\\n      activeHandle = getClosestHandle(clientPos);\\n\\n      // fire the start event\\n      startValue = previousValue = alignValueToStep(values[activeHandle]);\\n      eStart();\\n\\n      // for touch devices we want the handle to instantly\\n      // move to the position touched for more responsive feeling\\n      if (e.type === \\"touchstart\\") {\\n        handleInteract(clientPos);\\n      }\\n    }\\n  }\\n\\n  /**\\n   * function to run when the user stops touching\\n   * down on the slider element anywhere\\n   * @param {event} e the event from browser\\n   **/\\n  function sliderInteractEnd(e) {\\n    // fire the stop event for touch devices\\n    if (e.type === \\"touchend\\") {\\n      eStop();\\n    }\\n    handlePressed = false;\\n  }\\n\\n  /**\\n   * unfocus the slider if the user clicked off of\\n   * it, somewhere else on the screen\\n   * @param {event} e the event from browser\\n   **/\\n  function bodyInteractStart(e) {\\n    keyboardActive = false;\\n    if (focus && e.target !== slider && !slider.contains(e.target)) {\\n      focus = false;\\n    }\\n  }\\n\\n  /**\\n   * send the clientX through to handle the interaction\\n   * whenever the user moves acros screen while active\\n   * @param {event} e the event from browser\\n   **/\\n  function bodyInteract(e) {\\n    if ( !disabled ) {\\n      if (handleActivated) {\\n        handleInteract(normalisedClient(e));\\n      }\\n    }\\n  }\\n\\n  /**\\n   * if user triggers mouseup on the body while\\n   * a handle is active (without moving) then we\\n   * trigger an interact event there\\n   * @param {event} e the event from browser\\n   **/\\n  function bodyMouseUp(e) {\\n    if ( !disabled ) {\\n      const el = e.target;\\n      // this only works if a handle is active, which can\\n      // only happen if there was sliderInteractStart triggered\\n      // on the slider, already\\n      if (handleActivated) {\\n        if (el === slider || slider.contains(el)) {\\n          focus = true;\\n          if (!targetIsHandle(el)) {\\n            handleInteract(normalisedClient(e));\\n          }\\n        }\\n        // fire the stop event for mouse device\\n        // when the body is triggered with an active handle\\n        eStop();\\n      }\\n    }\\n    handleActivated = false;\\n    handlePressed = false;\\n  }\\n\\n  /**\\n   * if user triggers touchend on the body then we\\n   * defocus the slider completely\\n   * @param {event} e the event from browser\\n   **/\\n  function bodyTouchEnd(e) {\\n    handleActivated = false;\\n    handlePressed = false;\\n  }\\n\\n  function bodyKeyDown(e) {\\n    if ( !disabled ) {\\n      if (e.target === slider || slider.contains(e.target)) {\\n        keyboardActive = true;\\n      }\\n    }\\n  }\\n\\n  function eStart() {\\n    !disabled && dispatch(\\"start\\", {\\n      activeHandle,\\n      value: startValue,\\n      values: values.map((v) => alignValueToStep(v)),\\n    });\\n  }\\n\\n  function eStop() {\\n    !disabled && dispatch(\\"stop\\", {\\n      activeHandle,\\n      startValue: startValue,\\n      value: values[activeHandle],\\n      values: values.map((v) => alignValueToStep(v)),\\n    });\\n  }\\n\\n  function eChange() {\\n    !disabled && dispatch(\\"change\\", {\\n      activeHandle,\\n      startValue: startValue,\\n      previousValue:\\n        typeof previousValue === \\"undefined\\" ? startValue : previousValue,\\n      value: values[activeHandle],\\n      values: values.map((v) => alignValueToStep(v)),\\n    });\\n  }\\n<\/script>\\n\\n<style>\\n  :global(.rangeSlider) {\\n    --slider: var(--range-slider, #d7dada);\\n    --handle-inactive: var(--range-handle-inactive, #99a2a2);\\n    --handle: var(--range-handle, #838de7);\\n    --handle-focus: var(--range-handle-focus, #4a40d4);\\n    --handle-border: var(--range-handle-border, var(--handle));\\n    --range-inactive: var(--range-range-inactive, var(--handle-inactive));\\n    --range: var(--range-range, var(--handle-focus));\\n    --float-inactive: var(--range-float-inactive, var(--handle-inactive));\\n    --float: var(--range-float, var(--handle-focus));\\n    --float-text: var(--range-float-text, white);\\n  }\\n  :global(.rangeSlider) {\\n    position: relative;\\n    border-radius: 100px;\\n    height: 0.5em;\\n    margin: 1em;\\n    transition: opacity 0.2s ease;\\n      user-select: none;\\n  }\\n  :global(.rangeSlider *) {\\n    user-select: none;\\n  }\\n  :global(.rangeSlider.pips) {\\n    margin-bottom: 1.8em;\\n  }\\n  :global(.rangeSlider.pip-labels) {\\n    margin-bottom: 2.8em;\\n  }\\n  :global(.rangeSlider.vertical) {\\n    display: inline-block;\\n    border-radius: 100px;\\n    width: 0.5em;\\n    min-height: 200px;\\n  }\\n  :global(.rangeSlider.vertical.pips) {\\n    margin-right: 1.8em;\\n    margin-bottom: 1em;\\n  }\\n  :global(.rangeSlider.vertical.pip-labels) {\\n    margin-right: 2.8em;\\n    margin-bottom: 1em;\\n  }\\n  :global(.rangeSlider .rangeHandle) {\\n    position: absolute;\\n    display: block;\\n    height: 1.4em;\\n    width: 1.4em;\\n    top: 0.25em;\\n    left: 0.25em;\\n    transform: translateY(-50%) translateX(-50%);\\n    z-index: 2;\\n  }\\n  :global(.rangeSlider .rangeNub),\\n  :global(.rangeSlider .rangeHandle:before) {\\n    position: absolute;\\n    left: 0;\\n    top: 0;\\n    display: block;\\n    border-radius: 10em;\\n    height: 100%;\\n    width: 100%;\\n    transition: all 0.2s ease;\\n  }\\n  :global(.rangeSlider .rangeHandle:before) {\\n    content: \\"\\";\\n    left: 1px;\\n    top: 1px;\\n    bottom: 1px;\\n    right: 1px;\\n    height: auto;\\n    width: auto;\\n    box-shadow: 0 0 0 0px var(--handle-border);\\n    opacity: 0;\\n  }\\n  :global(.rangeSlider .rangeHandle.hoverable:hover:before) {\\n    box-shadow: 0 0 0 8px var(--handle-border);\\n    opacity: 0.2;\\n  }\\n  :global(.rangeSlider .rangeHandle.hoverable.press:before),\\n  :global(.rangeSlider .rangeHandle.hoverable.press:hover:before) {\\n    box-shadow: 0 0 0 12px var(--handle-border);\\n    opacity: 0.4;\\n  }\\n  :global(.rangeSlider.range:not(.min):not(.max) .rangeNub) {\\n    border-radius: 10em 10em 10em 1.6em;\\n  }\\n  :global(.rangeSlider.range .rangeHandle:nth-of-type(1) .rangeNub) {\\n    transform: rotate(-135deg);\\n  }\\n  :global(.rangeSlider.range .rangeHandle:nth-of-type(2) .rangeNub) {\\n    transform: rotate(45deg);\\n  }\\n  :global(.rangeSlider.range.vertical .rangeHandle:nth-of-type(1) .rangeNub) {\\n    transform: rotate(-45deg);\\n  }\\n  :global(.rangeSlider.range.vertical .rangeHandle:nth-of-type(2) .rangeNub) {\\n    transform: rotate(135deg);\\n  }\\n  :global(.rangeSlider .rangeFloat) {\\n    display: block;\\n    position: absolute;\\n    left: 50%;\\n    top: -0.5em;\\n    transform: translate(-50%, -100%);\\n    font-size: 1em;\\n    text-align: center;\\n    opacity: 0;\\n    pointer-events: none;\\n    white-space: nowrap;\\n    transition: all 0.2s ease;\\n    font-size: 0.9em;\\n    padding: 0.2em 0.4em;\\n    border-radius: 0.2em;\\n  }\\n  :global(.rangeSlider .rangeHandle.active .rangeFloat),\\n  :global(.rangeSlider .rangeHandle.hoverable:hover .rangeFloat) {\\n    opacity: 1;\\n    top: -0.2em;\\n    transform: translate(-50%, -100%);\\n  }\\n  :global(.rangeSlider .rangeBar) {\\n    position: absolute;\\n    display: block;\\n    transition: background 0.2s ease;\\n    border-radius: 1em;\\n    height: 0.5em;\\n    top: 0;\\n    user-select: none;\\n    z-index: 1;\\n  }\\n  :global(.rangeSlider.vertical .rangeBar) {\\n    width: 0.5em;\\n    height: auto;\\n  }\\n  :global(.rangeSlider) {\\n    background-color: #d7dada;\\n    background-color: var(--slider);\\n  }\\n  :global(.rangeSlider .rangeBar) {\\n    background-color: #99a2a2;\\n    background-color: var(--range-inactive);\\n  }\\n  :global(.rangeSlider.focus .rangeBar) {\\n    background-color: #838de7;\\n    background-color: var(--range);\\n  }\\n  :global(.rangeSlider .rangeNub) {\\n    background-color: #99a2a2;\\n    background-color: var(--handle-inactive);\\n  }\\n  :global(.rangeSlider.focus .rangeNub) {\\n    background-color: #838de7;\\n    background-color: var(--handle);\\n  }\\n  :global(.rangeSlider .rangeHandle.active .rangeNub) {\\n    background-color: #4a40d4;\\n    background-color: var(--handle-focus);\\n  }\\n  :global(.rangeSlider .rangeFloat) {\\n    color: white;\\n    color: var(--float-text);\\n    background-color: #99a2a2;\\n    background-color: var(--float-inactive);\\n  }\\n  :global(.rangeSlider.focus .rangeFloat) {\\n    background-color: #4a40d4;\\n    background-color: var(--float);\\n  }\\n  :global(.rangeSlider.disabled ) {\\n    opacity: 0.5;\\n  }\\n  :global(.rangeSlider.disabled .rangeNub) {\\n    background-color: #d7dada;\\n    background-color: var(--slider);\\n  }\\n</style>\\n\\n<div\\n  {id}\\n  bind:this={slider}\\n  class=\\"rangeSlider\\"\\n  class:range\\n  class:disabled\\n  class:vertical\\n  class:focus\\n  class:min={range === 'min'}\\n  class:max={range === 'max'}\\n  class:pips\\n  class:pip-labels={all === 'label' || first === 'label' || last === 'label' || rest === 'label'}\\n  on:mousedown={sliderInteractStart}\\n  on:mouseup={sliderInteractEnd}\\n  on:touchstart|preventDefault={sliderInteractStart}\\n  on:touchend|preventDefault={sliderInteractEnd}\\n>\\n  {#each values as value, index}\\n    <span\\n      role=\\"slider\\"\\n      class=\\"rangeHandle\\"\\n      class:hoverable={hover && !disabled}\\n      class:active={focus && activeHandle === index}\\n      class:press={handlePressed && activeHandle === index}\\n      data-handle={index}\\n      on:blur={sliderBlurHandle}\\n      on:focus={sliderFocusHandle}\\n      on:keydown={sliderKeydown}\\n      style=\\"{vertical ? 'top' : 'left'}: {$springPositions[index]}%; z-index: {activeHandle === index ? 3 : 2};\\"\\n      aria-valuemin={range === true && index === 1 ? values[0] : min}\\n      aria-valuemax={range === true && index === 0 ? values[1] : max}\\n      aria-valuenow={value}\\n      aria-valuetext=\\"{prefix}{handleFormatter(value,index)}{suffix}\\"\\n      aria-orientation={vertical ? 'vertical' : 'horizontal'}\\n      aria-disabled={disabled}\\n      {disabled}\\n      tabindex=\\"{ disabled ? -1 : 0 }\\"\\n    >\\n      <span class=\\"rangeNub\\" />\\n      {#if float}\\n        <span class=\\"rangeFloat\\">\\n          {#if prefix}<span class=\\"rangeFloat-prefix\\">{prefix}</span>{/if}{handleFormatter(value,index)}{#if suffix}<span class=\\"rangeFloat-suffix\\">{suffix}</span>{/if}\\n        </span>\\n      {/if}\\n    </span>\\n  {/each}\\n  {#if range}\\n    <span\\n      class=\\"rangeBar\\"\\n      style=\\"{vertical ? 'top' : 'left'}: {rangeStart($springPositions)}%; {vertical ? 'bottom' : 'right'}:\\n      {rangeEnd($springPositions)}%;\\" />\\n  {/if}\\n  {#if pips}\\n    <RangePips\\n      {values}\\n      {min}\\n      {max}\\n      {step}\\n      {range}\\n      {vertical}\\n      {all}\\n      {first}\\n      {last}\\n      {rest}\\n      {pipstep}\\n      {prefix}\\n      {suffix}\\n      {formatter}\\n      {focus}\\n      {percentOf} />\\n  {/if}\\n</div>\\n\\n<svelte:window\\n  on:mousedown={bodyInteractStart}\\n  on:touchstart={bodyInteractStart}\\n  on:mousemove={bodyInteract}\\n  on:touchmove={bodyInteract}\\n  on:mouseup={bodyMouseUp}\\n  on:touchend={bodyTouchEnd}\\n  on:keydown={bodyKeyDown} />\\n"],"names":[],"mappings":"AAijBU,YAAY,AAAE,CAAC,AACrB,QAAQ,CAAE,4BAA4B,CACtC,iBAAiB,CAAE,qCAAqC,CACxD,QAAQ,CAAE,4BAA4B,CACtC,cAAc,CAAE,kCAAkC,CAClD,eAAe,CAAE,yCAAyC,CAC1D,gBAAgB,CAAE,mDAAmD,CACrE,OAAO,CAAE,uCAAuC,CAChD,gBAAgB,CAAE,mDAAmD,CACrE,OAAO,CAAE,uCAAuC,CAChD,YAAY,CAAE,8BAA8B,AAC9C,CAAC,AACO,YAAY,AAAE,CAAC,AACrB,QAAQ,CAAE,QAAQ,CAClB,aAAa,CAAE,KAAK,CACpB,MAAM,CAAE,KAAK,CACb,MAAM,CAAE,GAAG,CACX,UAAU,CAAE,OAAO,CAAC,IAAI,CAAC,IAAI,CAC3B,WAAW,CAAE,IAAI,AACrB,CAAC,AACO,cAAc,AAAE,CAAC,AACvB,WAAW,CAAE,IAAI,AACnB,CAAC,AACO,iBAAiB,AAAE,CAAC,AAC1B,aAAa,CAAE,KAAK,AACtB,CAAC,AACO,uBAAuB,AAAE,CAAC,AAChC,aAAa,CAAE,KAAK,AACtB,CAAC,AACO,qBAAqB,AAAE,CAAC,AAC9B,OAAO,CAAE,YAAY,CACrB,aAAa,CAAE,KAAK,CACpB,KAAK,CAAE,KAAK,CACZ,UAAU,CAAE,KAAK,AACnB,CAAC,AACO,0BAA0B,AAAE,CAAC,AACnC,YAAY,CAAE,KAAK,CACnB,aAAa,CAAE,GAAG,AACpB,CAAC,AACO,gCAAgC,AAAE,CAAC,AACzC,YAAY,CAAE,KAAK,CACnB,aAAa,CAAE,GAAG,AACpB,CAAC,AACO,yBAAyB,AAAE,CAAC,AAClC,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,KAAK,CACd,MAAM,CAAE,KAAK,CACb,KAAK,CAAE,KAAK,CACZ,GAAG,CAAE,MAAM,CACX,IAAI,CAAE,MAAM,CACZ,SAAS,CAAE,WAAW,IAAI,CAAC,CAAC,WAAW,IAAI,CAAC,CAC5C,OAAO,CAAE,CAAC,AACZ,CAAC,AACO,sBAAsB,AAAC,CACvB,gCAAgC,AAAE,CAAC,AACzC,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,OAAO,CAAE,KAAK,CACd,aAAa,CAAE,IAAI,CACnB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,IAAI,AAC3B,CAAC,AACO,gCAAgC,AAAE,CAAC,AACzC,OAAO,CAAE,EAAE,CACX,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,GAAG,CACR,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,IAAI,eAAe,CAAC,CAC1C,OAAO,CAAE,CAAC,AACZ,CAAC,AACO,gDAAgD,AAAE,CAAC,AACzD,UAAU,CAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,IAAI,eAAe,CAAC,CAC1C,OAAO,CAAE,GAAG,AACd,CAAC,AACO,gDAAgD,AAAC,CACjD,sDAAsD,AAAE,CAAC,AAC/D,UAAU,CAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,IAAI,eAAe,CAAC,CAC3C,OAAO,CAAE,GAAG,AACd,CAAC,AACO,gDAAgD,AAAE,CAAC,AACzD,aAAa,CAAE,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,KAAK,AACrC,CAAC,AACO,wDAAwD,AAAE,CAAC,AACjE,SAAS,CAAE,OAAO,OAAO,CAAC,AAC5B,CAAC,AACO,wDAAwD,AAAE,CAAC,AACjE,SAAS,CAAE,OAAO,KAAK,CAAC,AAC1B,CAAC,AACO,iEAAiE,AAAE,CAAC,AAC1E,SAAS,CAAE,OAAO,MAAM,CAAC,AAC3B,CAAC,AACO,iEAAiE,AAAE,CAAC,AAC1E,SAAS,CAAE,OAAO,MAAM,CAAC,AAC3B,CAAC,AACO,wBAAwB,AAAE,CAAC,AACjC,OAAO,CAAE,KAAK,CACd,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,MAAM,CACX,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,KAAK,CAAC,CACjC,SAAS,CAAE,GAAG,CACd,UAAU,CAAE,MAAM,CAClB,OAAO,CAAE,CAAC,CACV,cAAc,CAAE,IAAI,CACpB,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,IAAI,CACzB,SAAS,CAAE,KAAK,CAChB,OAAO,CAAE,KAAK,CAAC,KAAK,CACpB,aAAa,CAAE,KAAK,AACtB,CAAC,AACO,4CAA4C,AAAC,CAC7C,qDAAqD,AAAE,CAAC,AAC9D,OAAO,CAAE,CAAC,CACV,GAAG,CAAE,MAAM,CACX,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,KAAK,CAAC,AACnC,CAAC,AACO,sBAAsB,AAAE,CAAC,AAC/B,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,KAAK,CACd,UAAU,CAAE,UAAU,CAAC,IAAI,CAAC,IAAI,CAChC,aAAa,CAAE,GAAG,CAClB,MAAM,CAAE,KAAK,CACb,GAAG,CAAE,CAAC,CACN,WAAW,CAAE,IAAI,CACjB,OAAO,CAAE,CAAC,AACZ,CAAC,AACO,+BAA+B,AAAE,CAAC,AACxC,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,IAAI,AACd,CAAC,AACO,YAAY,AAAE,CAAC,AACrB,gBAAgB,CAAE,OAAO,CACzB,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AACjC,CAAC,AACO,sBAAsB,AAAE,CAAC,AAC/B,gBAAgB,CAAE,OAAO,CACzB,gBAAgB,CAAE,IAAI,gBAAgB,CAAC,AACzC,CAAC,AACO,4BAA4B,AAAE,CAAC,AACrC,gBAAgB,CAAE,OAAO,CACzB,gBAAgB,CAAE,IAAI,OAAO,CAAC,AAChC,CAAC,AACO,sBAAsB,AAAE,CAAC,AAC/B,gBAAgB,CAAE,OAAO,CACzB,gBAAgB,CAAE,IAAI,iBAAiB,CAAC,AAC1C,CAAC,AACO,4BAA4B,AAAE,CAAC,AACrC,gBAAgB,CAAE,OAAO,CACzB,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AACjC,CAAC,AACO,0CAA0C,AAAE,CAAC,AACnD,gBAAgB,CAAE,OAAO,CACzB,gBAAgB,CAAE,IAAI,cAAc,CAAC,AACvC,CAAC,AACO,wBAAwB,AAAE,CAAC,AACjC,KAAK,CAAE,KAAK,CACZ,KAAK,CAAE,IAAI,YAAY,CAAC,CACxB,gBAAgB,CAAE,OAAO,CACzB,gBAAgB,CAAE,IAAI,gBAAgB,CAAC,AACzC,CAAC,AACO,8BAA8B,AAAE,CAAC,AACvC,gBAAgB,CAAE,OAAO,CACzB,gBAAgB,CAAE,IAAI,OAAO,CAAC,AAChC,CAAC,AACO,sBAAsB,AAAE,CAAC,AAC/B,OAAO,CAAE,GAAG,AACd,CAAC,AACO,+BAA+B,AAAE,CAAC,AACxC,gBAAgB,CAAE,OAAO,CACzB,gBAAgB,CAAE,IAAI,QAAQ,CAAC,AACjC,CAAC"}`
};
var RangeSlider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let percentOf;
  let clampValue;
  let alignValueToStep;
  let $springPositions, $$unsubscribe_springPositions = noop, $$subscribe_springPositions = () => ($$unsubscribe_springPositions(), $$unsubscribe_springPositions = subscribe(springPositions, ($$value) => $springPositions = $$value), springPositions);
  let { range = false } = $$props;
  let { pushy = false } = $$props;
  let { min = 0 } = $$props;
  let { max = 100 } = $$props;
  let { step = 1 } = $$props;
  let { values = [(max + min) / 2] } = $$props;
  let { vertical = false } = $$props;
  let { float = false } = $$props;
  let { hover = true } = $$props;
  let { disabled = false } = $$props;
  let { pips = false } = $$props;
  let { pipstep = void 0 } = $$props;
  let { all = void 0 } = $$props;
  let { first = void 0 } = $$props;
  let { last = void 0 } = $$props;
  let { rest = void 0 } = $$props;
  let { id = void 0 } = $$props;
  let { prefix = "" } = $$props;
  let { suffix = "" } = $$props;
  let { formatter = (v, i) => v } = $$props;
  let { handleFormatter = formatter } = $$props;
  let { precision = 2 } = $$props;
  let { springValues = { stiffness: 0.15, damping: 0.4 } } = $$props;
  createEventDispatcher();
  let slider;
  let valueLength = 0;
  let focus = false;
  let activeHandle = values.length - 1;
  let springPositions;
  function trimRange(values2) {
    if (range === "min" || range === "max") {
      return values2.slice(0, 1);
    } else if (range) {
      return values2.slice(0, 2);
    } else {
      return values2;
    }
  }
  function rangeStart(values2) {
    if (range === "min") {
      return 0;
    } else {
      return values2[0];
    }
  }
  function rangeEnd(values2) {
    if (range === "max") {
      return 0;
    } else if (range === "min") {
      return 100 - values2[0];
    } else {
      return 100 - values2[1];
    }
  }
  if ($$props.range === void 0 && $$bindings.range && range !== void 0)
    $$bindings.range(range);
  if ($$props.pushy === void 0 && $$bindings.pushy && pushy !== void 0)
    $$bindings.pushy(pushy);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.vertical === void 0 && $$bindings.vertical && vertical !== void 0)
    $$bindings.vertical(vertical);
  if ($$props.float === void 0 && $$bindings.float && float !== void 0)
    $$bindings.float(float);
  if ($$props.hover === void 0 && $$bindings.hover && hover !== void 0)
    $$bindings.hover(hover);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.pips === void 0 && $$bindings.pips && pips !== void 0)
    $$bindings.pips(pips);
  if ($$props.pipstep === void 0 && $$bindings.pipstep && pipstep !== void 0)
    $$bindings.pipstep(pipstep);
  if ($$props.all === void 0 && $$bindings.all && all !== void 0)
    $$bindings.all(all);
  if ($$props.first === void 0 && $$bindings.first && first !== void 0)
    $$bindings.first(first);
  if ($$props.last === void 0 && $$bindings.last && last !== void 0)
    $$bindings.last(last);
  if ($$props.rest === void 0 && $$bindings.rest && rest !== void 0)
    $$bindings.rest(rest);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.prefix === void 0 && $$bindings.prefix && prefix !== void 0)
    $$bindings.prefix(prefix);
  if ($$props.suffix === void 0 && $$bindings.suffix && suffix !== void 0)
    $$bindings.suffix(suffix);
  if ($$props.formatter === void 0 && $$bindings.formatter && formatter !== void 0)
    $$bindings.formatter(formatter);
  if ($$props.handleFormatter === void 0 && $$bindings.handleFormatter && handleFormatter !== void 0)
    $$bindings.handleFormatter(handleFormatter);
  if ($$props.precision === void 0 && $$bindings.precision && precision !== void 0)
    $$bindings.precision(precision);
  if ($$props.springValues === void 0 && $$bindings.springValues && springValues !== void 0)
    $$bindings.springValues(springValues);
  $$result.css.add(css$l);
  clampValue = function(val) {
    return val <= min ? min : val >= max ? max : val;
  };
  alignValueToStep = function(val) {
    if (val <= min) {
      return min;
    } else if (val >= max) {
      return max;
    }
    let remainder = (val - min) % step;
    let aligned = val - remainder;
    if (Math.abs(remainder) * 2 >= step) {
      aligned += remainder > 0 ? step : -step;
    }
    aligned = clampValue(aligned);
    return parseFloat(aligned.toFixed(precision));
  };
  percentOf = function(val) {
    let perc = (val - min) / (max - min) * 100;
    if (isNaN(perc) || perc <= 0) {
      return 0;
    } else if (perc >= 100) {
      return 100;
    } else {
      return parseFloat(perc.toFixed(precision));
    }
  };
  {
    {
      if (!Array.isArray(values)) {
        values = [(max + min) / 2];
        console.error("'values' prop should be an Array (https://github.com/simeydotme/svelte-range-slider-pips#slider-props)");
      }
      values = trimRange(values.map((v) => alignValueToStep(v)));
      if (valueLength !== values.length) {
        $$subscribe_springPositions(springPositions = spring(values.map((v) => percentOf(v)), springValues));
      } else {
        springPositions.set(values.map((v) => percentOf(v)));
      }
      valueLength = values.length;
    }
  }
  $$unsubscribe_springPositions();
  return `<div${add_attribute("id", id, 0)} class="${[
    "rangeSlider",
    (range ? "range" : "") + " " + (disabled ? "disabled" : "") + " " + (vertical ? "vertical" : "") + "  " + (range === "min" ? "min" : "") + " " + (range === "max" ? "max" : "") + " " + (pips ? "pips" : "") + " " + (all === "label" || first === "label" || last === "label" || rest === "label" ? "pip-labels" : "")
  ].join(" ").trim()}"${add_attribute("this", slider, 0)}>${each(values, (value, index2) => `<span role="${"slider"}" class="${[
    "rangeHandle",
    (hover && !disabled ? "hoverable" : "") + "  "
  ].join(" ").trim()}"${add_attribute("data-handle", index2, 0)} style="${escape(vertical ? "top" : "left") + ": " + escape($springPositions[index2]) + "%; z-index: " + escape(activeHandle === index2 ? 3 : 2) + ";"}"${add_attribute("aria-valuemin", range === true && index2 === 1 ? values[0] : min, 0)}${add_attribute("aria-valuemax", range === true && index2 === 0 ? values[1] : max, 0)}${add_attribute("aria-valuenow", value, 0)} aria-valuetext="${escape(prefix) + escape(handleFormatter(value, index2)) + escape(suffix)}"${add_attribute("aria-orientation", vertical ? "vertical" : "horizontal", 0)}${add_attribute("aria-disabled", disabled, 0)} ${disabled ? "disabled" : ""}${add_attribute("tabindex", disabled ? -1 : 0, 0)}><span class="${"rangeNub"}"></span>
      ${float ? `<span class="${"rangeFloat"}">${prefix ? `<span class="${"rangeFloat-prefix"}">${escape(prefix)}</span>` : ``}${escape(handleFormatter(value, index2))}${suffix ? `<span class="${"rangeFloat-suffix"}">${escape(suffix)}</span>` : ``}
        </span>` : ``}
    </span>`)}
  ${range ? `<span class="${"rangeBar"}" style="${escape(vertical ? "top" : "left") + ": " + escape(rangeStart($springPositions)) + "%; " + escape(vertical ? "bottom" : "right") + ":\n      " + escape(rangeEnd($springPositions)) + "%;"}"></span>` : ``}
  ${pips ? `${validate_component(RangePips, "RangePips").$$render($$result, {
    values,
    min,
    max,
    step,
    range,
    vertical,
    all,
    first,
    last,
    rest,
    pipstep,
    prefix,
    suffix,
    formatter,
    focus,
    percentOf
  }, {}, {})}` : ``}</div>

`;
});
var css$k = {
  code: ".unique_title.svelte-19oyq65{font-weight:600;padding:1rem;transition:.2s;display:flex;align-items:center;justify-content:space-between;cursor:pointer}.filter_by_price.svelte-19oyq65{display:flex;width:100%;justify-content:space-between}.price_item.svelte-19oyq65{display:inline-block}.rangeSlider{margin:1rem 0.5rem 3rem;height:0.3em}.rangeSlider .rangeHandle{width:1em;height:1em;top:0.13em}.rangeSlider.focus .rangeBar{background-color:var(--main-theme-color);height:0.3em}.rangeSlider .rangeBar{background-color:var(--main-theme-color);height:0.3em}.rangeSlider .rangeHandle.active .rangeNub,\r\n			.rangeSlider .rangeHandle .rangeNub{background-color:var(--main-theme-color)}.rangeSlider.focus .rangeFloat,\r\n			.rangeSlider .rangeFloat{background:var(--main-theme-color);color:#fff}",
  map: `{"version":3,"file":"FilterByPrice.svelte","sources":["FilterByPrice.svelte"],"sourcesContent":["<script>\\r\\n    import RangeSlider from \\"svelte-range-slider-pips\\";\\r\\n    import Model from '../../../model/data-service';\\r\\n\\r\\n    export let allData = $$props;\\r\\n\\texport let changePrice = false;\\r\\n    const temp = new Model();\\r\\n\\r\\n    let min = temp.getMinPrice(allData);\\r\\n\\tlet max = temp.getMaxPrice(allData);\\r\\n\\texport let values = [\\r\\n\\t\\ttemp.getMinPrice(allData),\\r\\n\\t\\ttemp.getMaxPrice(allData)\\r\\n\\t];\\r\\n\\r\\n\\t$: if(!changePrice) values = [temp.getMinPrice(allData), temp.getMaxPrice(allData)];\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"unique_title\\">\\r\\n\\t<span class=\\"val\\">\u0426\u0435\u043D\u0430</span>\\r\\n</div>\\r\\n<div class=\\"filter_price_container\\">\\r\\n\\t<div class=\\"filter_by_price\\">\\r\\n\\t\\t<div class=\\"price_item\\">\u043E\u0442 {values[0]}</div>\\r\\n\\t\\t<div class=\\"price_item\\">\u0434\u043E {values[1]}</div>\\r\\n\\t</div>\\r\\n\\t<RangeSlider range bind:min bind:max bind:values on:change={() => changePrice = true}/>\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n\\t.unique_title {\\r\\n        font-weight: 600;\\r\\n        padding: 1rem;\\r\\n        transition: .2s;\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: space-between;\\r\\n        cursor: pointer;\\r\\n    }\\r\\n\\r\\n\\t.filter_by_price {\\r\\n\\t\\tdisplay: flex;\\r\\n\\t\\twidth: 100%;\\r\\n\\t\\tjustify-content: space-between;\\r\\n\\t}\\r\\n\\r\\n\\t.price_item {\\r\\n\\t\\tdisplay: inline-block;\\r\\n\\t}\\r\\n\\r\\n\\t:global(.rangeSlider) {\\r\\n\\t\\tmargin: 1rem 0.5rem 3rem;\\r\\n\\t\\theight: 0.3em;\\r\\n\\t}\\r\\n\\t:global(.rangeSlider .rangeHandle) {\\r\\n\\t\\twidth: 1em;\\r\\n\\t\\theight: 1em;\\r\\n\\t\\ttop: 0.13em;\\r\\n\\t}\\r\\n\\r\\n\\t:global(.rangeSlider.focus .rangeBar) {\\r\\n\\t\\tbackground-color: var(--main-theme-color);\\r\\n\\t\\theight: 0.3em;\\r\\n\\t}\\r\\n\\r\\n\\t:global(.rangeSlider .rangeBar) {\\r\\n\\t\\tbackground-color: var(--main-theme-color);\\r\\n\\t\\theight: 0.3em;\\r\\n\\t}\\r\\n\\r\\n\\t:global(.rangeSlider .rangeHandle.active .rangeNub,\\r\\n\\t\\t\\t.rangeSlider .rangeHandle .rangeNub) {\\r\\n\\t\\tbackground-color: var(--main-theme-color);\\r\\n\\t}\\r\\n\\r\\n\\t:global(.rangeSlider.focus .rangeFloat,\\r\\n\\t\\t\\t.rangeSlider .rangeFloat) {\\r\\n\\t\\tbackground: var(--main-theme-color);\\r\\n\\t\\tcolor: #fff;\\r\\n\\t}\\r\\n</style>"],"names":[],"mappings":"AA8BC,aAAa,eAAC,CAAC,AACR,WAAW,CAAE,GAAG,CAChB,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,GAAG,CACf,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,aAAa,CAC9B,MAAM,CAAE,OAAO,AACnB,CAAC,AAEJ,gBAAgB,eAAC,CAAC,AACjB,OAAO,CAAE,IAAI,CACb,KAAK,CAAE,IAAI,CACX,eAAe,CAAE,aAAa,AAC/B,CAAC,AAED,WAAW,eAAC,CAAC,AACZ,OAAO,CAAE,YAAY,AACtB,CAAC,AAEO,YAAY,AAAE,CAAC,AACtB,MAAM,CAAE,IAAI,CAAC,MAAM,CAAC,IAAI,CACxB,MAAM,CAAE,KAAK,AACd,CAAC,AACO,yBAAyB,AAAE,CAAC,AACnC,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,CACX,GAAG,CAAE,MAAM,AACZ,CAAC,AAEO,4BAA4B,AAAE,CAAC,AACtC,gBAAgB,CAAE,IAAI,kBAAkB,CAAC,CACzC,MAAM,CAAE,KAAK,AACd,CAAC,AAEO,sBAAsB,AAAE,CAAC,AAChC,gBAAgB,CAAE,IAAI,kBAAkB,CAAC,CACzC,MAAM,CAAE,KAAK,AACd,CAAC,AAEO;sCAC6B,AAAE,CAAC,AACvC,gBAAgB,CAAE,IAAI,kBAAkB,CAAC,AAC1C,CAAC,AAEO;2BACkB,AAAE,CAAC,AAC5B,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,KAAK,CAAE,IAAI,AACZ,CAAC"}`
};
var FilterByPrice = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { allData = $$props } = $$props;
  let { changePrice = false } = $$props;
  const temp = new Model();
  let min = temp.getMinPrice(allData);
  let max = temp.getMaxPrice(allData);
  let { values = [temp.getMinPrice(allData), temp.getMaxPrice(allData)] } = $$props;
  if ($$props.allData === void 0 && $$bindings.allData && allData !== void 0)
    $$bindings.allData(allData);
  if ($$props.changePrice === void 0 && $$bindings.changePrice && changePrice !== void 0)
    $$bindings.changePrice(changePrice);
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  $$result.css.add(css$k);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      if (!changePrice)
        values = [temp.getMinPrice(allData), temp.getMaxPrice(allData)];
    }
    $$rendered = `<div class="${"unique_title svelte-19oyq65"}"><span class="${"val"}">\u0426\u0435\u043D\u0430</span></div>
<div class="${"filter_price_container"}"><div class="${"filter_by_price svelte-19oyq65"}"><div class="${"price_item svelte-19oyq65"}">\u043E\u0442 ${escape(values[0])}</div>
		<div class="${"price_item svelte-19oyq65"}">\u0434\u043E ${escape(values[1])}</div></div>
	${validate_component(RangeSlider, "RangeSlider").$$render($$result, { range: true, min, max, values }, {
      min: ($$value) => {
        min = $$value;
        $$settled = false;
      },
      max: ($$value) => {
        max = $$value;
        $$settled = false;
      },
      values: ($$value) => {
        values = $$value;
        $$settled = false;
      }
    }, {})}
</div>`;
  } while (!$$settled);
  return $$rendered;
});
var { Object: Object_1 } = globals;
var css$j = {
  code: ".clear.svelte-ri2dzc{position:sticky;bottom:0;width:100%;background:var(--main-theme-color);border:1px solid var(--main-theme-color);color:var(--main-bg-color);font:600 0.75rem var(--font);text-transform:uppercase;padding:17px;cursor:pointer;transition:.2s}.svelte-ri2dzc:hover{background:var(--main-hover-color)}.filters.svelte-ri2dzc{background:var(--main-bg-color)}.close.svelte-ri2dzc{display:none}.show_results.svelte-ri2dzc{display:none;;}@media(max-width: 768px){.filters.svelte-ri2dzc{position:fixed;z-index:100;width:400px;max-width:100%;bottom:0;top:0;left:0;padding:3rem 1.25rem 1.5rem 1.25rem;transform:translate(-200%);overflow-y:auto;box-shadow:5px 0px 20px 1px rgba(0,0,0,.3);transition:.2s}.toggleFilters.svelte-ri2dzc{transform:translate(0)}.close.svelte-ri2dzc{display:initial;position:absolute;right:1.25rem;top:0.5rem;font-size:2rem;border:1px solid var(--main-border-color)}.clear.svelte-ri2dzc{position:absolute;top:1rem;bottom:unset;padding:0;width:auto;background:var(--main-bg-color);color:var(--main-theme-color);border:0}.show_results.svelte-ri2dzc{display:initial;position:sticky;bottom:0;width:100%;background:var(--main-theme-color);border:1px solid var(--main-theme-color);color:var(--main-bg-color);font:600 0.75rem var(--font);text-transform:uppercase;padding:17px;cursor:pointer}}",
  map: `{"version":3,"file":"Filters.svelte","sources":["Filters.svelte"],"sourcesContent":["<script>\\r\\n\\timport { fade } from \\"svelte/transition\\";\\r\\n\\timport SortSelect from '../../Helpers/SortSelect.svelte';\\r\\n\\timport Model from '../../../model/data-service';\\r\\n\\timport FilterCollection from './FilterCollection.svelte';\\r\\n\\timport FilterByPrice from './FilterByPrice.svelte';\\r\\n\\r\\n\\texport let selectedValue;\\r\\n\\texport let allData = $$props;\\r\\n    export let filterCollection;\\r\\n\\texport let toggleFilters = false;\\r\\n\\texport let values;\\r\\n\\r\\n\\texport let exportedActive;\\r\\n\\tlet showResetButton = false;\\r\\n\\tlet changePrice;\\r\\n\\r\\n\\tlet filledArr = [];\\r\\n\\tconst temp = new Model();\\r\\n\\tlet attributes = temp.getFilterList(filledArr, allData.category);\\r\\n\\r\\n\\tfunction handleResetFilters() {\\r\\n\\t\\tfor(let key in filterCollection) {\\r\\n\\t\\t\\tif(filterCollection[key] !== undefined) {\\r\\n\\t\\t\\t\\tfilterCollection = [];\\r\\n\\t\\t\\t}\\r\\n\\t\\t}\\r\\n\\t\\tselectedValue = \\"\\";\\r\\n\\t\\texportedActive = false;\\r\\n\\t\\tchangePrice = false;\\r\\n\\t}\\r\\n\\r\\n\\t$: selectedValue \\r\\n\\t\\t|| Object.keys(filterCollection).length !== 0 \\r\\n\\t\\t|| changePrice\\r\\n\\t\\t\\t? showResetButton = true\\r\\n\\t\\t\\t: showResetButton = false;\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"filters\\" class:toggleFilters={toggleFilters === true}>\\r\\n\\t<span class=\\"close material-icons-outlined\\" on:click={() => toggleFilters = !toggleFilters}>close</span>\\r\\n\\t<SortSelect bind:selected={selectedValue}>\\r\\n\\t\\t<option value=\\"\\" selected disabled slot=\\"s-head\\">\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430</option>\\r\\n\\t\\t<option value=\\"price_desc\\">\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435</option>\\r\\n\\t\\t<option value=\\"price_asc\\">\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u043E\u0440\u043E\u0436\u0435</option>\\r\\n\\t</SortSelect>\\r\\n\\t<FilterByPrice {...allData} bind:changePrice bind:values/>\\r\\n\\t{#each attributes as itemAttr}\\r\\n\\t\\t<FilterCollection {...itemAttr} bind:filterCollection bind:exportedActive/>\\r\\n\\t{/each}\\r\\n\\t{#if showResetButton}\\r\\n\\t\\t<button class=\\"clear\\" on:click={handleResetFilters} transition:fade={{duration: 200}}>\u043E\u0447\u0438\u0441\u0442\u0438\u0442\u044C</button>\\r\\n\\t\\t<button class=\\"show_results\\" on:click={() => toggleFilters = !toggleFilters}>\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B</button>\\r\\n\\t{/if}\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n\\t.clear {\\r\\n\\t\\tposition: sticky;\\r\\n\\t\\tbottom: 0;\\r\\n\\t\\twidth: 100%;\\r\\n\\t\\tbackground: var(--main-theme-color);\\r\\n\\t\\tborder: 1px solid var(--main-theme-color);\\r\\n\\t\\tcolor: var(--main-bg-color);\\r\\n\\t\\tfont: 600 0.75rem var(--font);\\r\\n\\t\\ttext-transform: uppercase;\\r\\n\\t\\tpadding: 17px;\\r\\n\\t\\tcursor: pointer;\\r\\n\\t\\ttransition: .2s;\\r\\n\\t}\\r\\n\\r\\n\\t:hover {\\r\\n\\t\\tbackground: var(--main-hover-color);\\r\\n\\t}\\r\\n\\r\\n\\t.filters {\\r\\n\\t\\tbackground: var(--main-bg-color);\\r\\n\\t}\\r\\n\\r\\n\\t.close {\\r\\n\\t\\tdisplay: none;\\r\\n\\t}\\r\\n\\r\\n\\t.show_results {\\r\\n\\t\\tdisplay: none;;\\r\\n\\t}\\r\\n\\r\\n\\t@media (max-width: 768px) {\\r\\n\\t\\t.filters {\\r\\n\\t\\t\\tposition: fixed;\\r\\n\\t\\t\\tz-index: 100;\\r\\n\\t\\t\\twidth: 400px;\\r\\n\\t\\t\\tmax-width: 100%;\\r\\n\\t\\t\\tbottom: 0;\\r\\n\\t\\t\\ttop: 0;\\r\\n\\t\\t\\tleft: 0;\\r\\n\\t\\t\\tpadding: 3rem 1.25rem 1.5rem 1.25rem;\\r\\n\\t\\t\\ttransform: translate(-200%);\\r\\n\\t\\t\\toverflow-y: auto;\\r\\n\\t\\t\\tbox-shadow: 5px 0px 20px 1px rgba(0,0,0,.3);\\r\\n\\t\\t\\ttransition: .2s;\\r\\n\\t\\t}\\r\\n\\r\\n\\t\\t.toggleFilters {\\r\\n\\t\\t\\ttransform: translate(0);\\r\\n\\t\\t}\\r\\n\\r\\n\\t\\t.close {\\r\\n\\t\\t\\tdisplay: initial;\\r\\n\\t\\t\\tposition: absolute;\\r\\n\\t\\t\\tright: 1.25rem;\\r\\n\\t\\t\\ttop: 0.5rem;\\r\\n\\t\\t\\tfont-size: 2rem;\\r\\n\\t\\t\\tborder: 1px solid var(--main-border-color);\\r\\n\\t\\t}\\r\\n\\r\\n\\t\\t.clear {\\r\\n\\t\\t\\tposition: absolute;\\r\\n\\t\\t\\ttop: 1rem;\\r\\n\\t\\t\\tbottom: unset;\\r\\n\\t\\t\\tpadding: 0;\\r\\n\\t\\t\\twidth: auto;\\r\\n\\t\\t\\tbackground: var(--main-bg-color);\\r\\n\\t\\t\\tcolor: var(--main-theme-color);\\r\\n\\t\\t\\tborder: 0;\\r\\n\\t\\t}\\r\\n\\r\\n\\t\\t.show_results {\\r\\n\\t\\t\\tdisplay: initial;\\r\\n\\t\\t\\tposition: sticky;\\r\\n\\t\\t\\tbottom: 0;\\r\\n\\t\\t\\twidth: 100%;\\r\\n\\t\\t\\tbackground: var(--main-theme-color);\\r\\n\\t\\t\\tborder: 1px solid var(--main-theme-color);\\r\\n\\t\\t\\tcolor: var(--main-bg-color);\\r\\n\\t\\t\\tfont: 600 0.75rem var(--font);\\r\\n\\t\\t\\ttext-transform: uppercase;\\r\\n\\t\\t\\tpadding: 17px;\\r\\n\\t\\t\\tcursor: pointer;\\r\\n\\t\\t}\\r\\n\\t}\\r\\n</style>"],"names":[],"mappings":"AAyDC,MAAM,cAAC,CAAC,AACP,QAAQ,CAAE,MAAM,CAChB,MAAM,CAAE,CAAC,CACT,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,kBAAkB,CAAC,CACzC,KAAK,CAAE,IAAI,eAAe,CAAC,CAC3B,IAAI,CAAE,GAAG,CAAC,OAAO,CAAC,IAAI,MAAM,CAAC,CAC7B,cAAc,CAAE,SAAS,CACzB,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,OAAO,CACf,UAAU,CAAE,GAAG,AAChB,CAAC,cAED,MAAM,AAAC,CAAC,AACP,UAAU,CAAE,IAAI,kBAAkB,CAAC,AACpC,CAAC,AAED,QAAQ,cAAC,CAAC,AACT,UAAU,CAAE,IAAI,eAAe,CAAC,AACjC,CAAC,AAED,MAAM,cAAC,CAAC,AACP,OAAO,CAAE,IAAI,AACd,CAAC,AAED,aAAa,cAAC,CAAC,AACd,OAAO,CAAE,IAAI,CAAC,CAAC,AAChB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC1B,QAAQ,cAAC,CAAC,AACT,QAAQ,CAAE,KAAK,CACf,OAAO,CAAE,GAAG,CACZ,KAAK,CAAE,KAAK,CACZ,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,CAAC,CACT,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CAAC,OAAO,CAAC,MAAM,CAAC,OAAO,CACpC,SAAS,CAAE,UAAU,KAAK,CAAC,CAC3B,UAAU,CAAE,IAAI,CAChB,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAC3C,UAAU,CAAE,GAAG,AAChB,CAAC,AAED,cAAc,cAAC,CAAC,AACf,SAAS,CAAE,UAAU,CAAC,CAAC,AACxB,CAAC,AAED,MAAM,cAAC,CAAC,AACP,OAAO,CAAE,OAAO,CAChB,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,OAAO,CACd,GAAG,CAAE,MAAM,CACX,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,AAC3C,CAAC,AAED,MAAM,cAAC,CAAC,AACP,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,IAAI,CACT,MAAM,CAAE,KAAK,CACb,OAAO,CAAE,CAAC,CACV,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,IAAI,eAAe,CAAC,CAChC,KAAK,CAAE,IAAI,kBAAkB,CAAC,CAC9B,MAAM,CAAE,CAAC,AACV,CAAC,AAED,aAAa,cAAC,CAAC,AACd,OAAO,CAAE,OAAO,CAChB,QAAQ,CAAE,MAAM,CAChB,MAAM,CAAE,CAAC,CACT,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,kBAAkB,CAAC,CACzC,KAAK,CAAE,IAAI,eAAe,CAAC,CAC3B,IAAI,CAAE,GAAG,CAAC,OAAO,CAAC,IAAI,MAAM,CAAC,CAC7B,cAAc,CAAE,SAAS,CACzB,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,OAAO,AAChB,CAAC,AACF,CAAC"}`
};
var Filters = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { selectedValue } = $$props;
  let { allData = $$props } = $$props;
  let { filterCollection } = $$props;
  let { toggleFilters = false } = $$props;
  let { values } = $$props;
  let { exportedActive } = $$props;
  let showResetButton = false;
  let changePrice;
  let filledArr = [];
  const temp = new Model();
  let attributes = temp.getFilterList(filledArr, allData.category);
  if ($$props.selectedValue === void 0 && $$bindings.selectedValue && selectedValue !== void 0)
    $$bindings.selectedValue(selectedValue);
  if ($$props.allData === void 0 && $$bindings.allData && allData !== void 0)
    $$bindings.allData(allData);
  if ($$props.filterCollection === void 0 && $$bindings.filterCollection && filterCollection !== void 0)
    $$bindings.filterCollection(filterCollection);
  if ($$props.toggleFilters === void 0 && $$bindings.toggleFilters && toggleFilters !== void 0)
    $$bindings.toggleFilters(toggleFilters);
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.exportedActive === void 0 && $$bindings.exportedActive && exportedActive !== void 0)
    $$bindings.exportedActive(exportedActive);
  $$result.css.add(css$j);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      selectedValue || Object.keys(filterCollection).length !== 0 || changePrice ? showResetButton = true : showResetButton = false;
    }
    $$rendered = `<div class="${["filters svelte-ri2dzc", toggleFilters === true ? "toggleFilters" : ""].join(" ").trim()}"><span class="${"close material-icons-outlined svelte-ri2dzc"}">close</span>
	${validate_component(SortSelect, "SortSelect").$$render($$result, { selected: selectedValue }, {
      selected: ($$value) => {
        selectedValue = $$value;
        $$settled = false;
      }
    }, {
      "s-head": () => `<option value="${""}" selected disabled slot="${"s-head"}" class="${"svelte-ri2dzc"}">\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430</option>`,
      default: () => `<option value="${"price_desc"}" class="${"svelte-ri2dzc"}">\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435</option>
		<option value="${"price_asc"}" class="${"svelte-ri2dzc"}">\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u043E\u0440\u043E\u0436\u0435</option>`
    })}
	${validate_component(FilterByPrice, "FilterByPrice").$$render($$result, Object_1.assign(allData, { changePrice }, { values }), {
      changePrice: ($$value) => {
        changePrice = $$value;
        $$settled = false;
      },
      values: ($$value) => {
        values = $$value;
        $$settled = false;
      }
    }, {})}
	${each(attributes, (itemAttr) => `${validate_component(FilterCollection, "FilterCollection").$$render($$result, Object_1.assign(itemAttr, { filterCollection }, { exportedActive }), {
      filterCollection: ($$value) => {
        filterCollection = $$value;
        $$settled = false;
      },
      exportedActive: ($$value) => {
        exportedActive = $$value;
        $$settled = false;
      }
    }, {})}`)}
	${showResetButton ? `<button class="${"clear svelte-ri2dzc"}">\u043E\u0447\u0438\u0441\u0442\u0438\u0442\u044C</button>
		<button class="${"show_results svelte-ri2dzc"}">\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B</button>` : ``}
</div>`;
  } while (!$$settled);
  return $$rendered;
});
var css$i = {
  code: ".toggle_filters.svelte-x5u7fl{width:100%;background:var(--main-theme-color);border:1px solid var(--main-theme-color);color:var(--main-bg-color);font:600 0.75rem var(--font);text-transform:uppercase;grid-area:filter;padding:0.5rem 0;margin:1rem 0}.empty_catalog.svelte-x5u7fl{font-size:1.5rem;font-weight:500;min-width:max-content;width:100%}.items_list.svelte-x5u7fl{display:grid;grid-template-columns:repeat(auto-fill, minmax(180px, 1fr));gap:30px 50px;height:min-content;grid-area:content}.category_box.svelte-x5u7fl{display:grid;grid-template-columns:minmax(200px, 300px) 1fr;grid-template-rows:auto 1fr;column-gap:1rem;grid-template-areas:'crumbs crumbs'\r\n            'filter content'}.toggle_filters.svelte-x5u7fl{display:none}@media(max-width: 768px){.category_box.svelte-x5u7fl{grid-template-columns:1fr 1fr;grid-template-areas:'crumbs crumbs'\r\n            'filter filter'\r\n            'content content'}.toggle_filters.svelte-x5u7fl{display:initial}}",
  map: `{"version":3,"file":"[id].svelte","sources":["[id].svelte"],"sourcesContent":["<script context=\\"module\\">\\r\\n    export async function load(ctx) {\\r\\n        let id = ctx.page.params.id;\\r\\n        return { props: {id}}\\r\\n    }\\r\\n<\/script>\\r\\n<script>\\r\\n    export let id;\\r\\n    import { onMount } from \\"svelte\\";\\r\\n    import { fade } from \\"svelte/transition\\";\\r\\n    import Model from \\"../../model/data-service\\";\\r\\n    import GoodItemView from \\"../../components/Main/Good/GoodItemView.svelte\\";\\r\\n    import Breadcrumbs from '../../components/Helpers/Breadcrumbs.svelte';\\r\\n    import Loader from '../../components/Helpers/Loader.svelte';\\r\\n    import Filters from \\"../../components/Main/Filters/Filters.svelte\\";\\r\\n\\r\\n    const temp = new Model();\\r\\n    let title = '';\\r\\n    let selectedValue;\\r\\n    let values;\\r\\n    let toggleFilters = false;\\r\\n    let exportedActive;\\r\\n\\r\\n    $: filterCollection = [];\\r\\n    $: categoryItem = temp.getCategoryItem(id, selectedValue, filterCollection, values);\\r\\n    const staticData = temp.getCategoryItem(id);\\r\\n\\r\\n    onMount(async() => {\\r\\n        const resolve = await categoryItem;\\r\\n        title = resolve.catName;\\r\\n        \\r\\n    });\\r\\n<\/script>\\r\\n\\r\\n<svelte:head>\\r\\n    <title>{title}</title>\\r\\n</svelte:head>\\r\\n\\r\\n<div class=\\"container\\">\\r\\n    <div class=\\"category_box\\">\\r\\n        {#await staticData then value}\\r\\n            {#if value.category.length > 0}\\r\\n                <Breadcrumbs refaddress={value.catName}/>\\r\\n                <Filters {...value} \\r\\n                    bind:selectedValue \\r\\n                    bind:filterCollection\\r\\n                    bind:values\\r\\n                    bind:toggleFilters\\r\\n                    bind:exportedActive\\r\\n                    />\\r\\n                <button class=\\"toggle_filters\\" on:click={() => toggleFilters = true}>\u0444\u0438\u043B\u044C\u0442\u0440\u044B</button>\\r\\n            {/if}\\r\\n        {/await}\\r\\n        {#await categoryItem}\\r\\n                <Loader/>\\r\\n        {:then value}\\r\\n            {#if value.category.length > 0}\\r\\n                <ul class=\\"items_list\\" in:fade>\\r\\n                    {#each value.category as item (item.name)}\\r\\n                        <GoodItemView {...item} categoryId={id}/>    \\r\\n                    {/each}\\r\\n                </ul>\\r\\n            {:else}\\r\\n                <div class=\\"empty_catalog\\">\u041F\u043E \u0432\u0430\u0448\u0435\u043C\u0443 \u0437\u0430\u043F\u0440\u043E\u0441\u0443 \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E</div>\\r\\n            {/if}\\r\\n        {/await}\\r\\n    </div>\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .toggle_filters {\\r\\n\\t\\twidth: 100%;\\r\\n\\t\\tbackground: var(--main-theme-color);\\r\\n\\t\\tborder: 1px solid var(--main-theme-color);\\r\\n\\t\\tcolor: var(--main-bg-color);\\r\\n\\t\\tfont: 600 0.75rem var(--font);\\r\\n\\t\\ttext-transform: uppercase; \\r\\n        grid-area: filter;\\r\\n        padding: 0.5rem 0;\\r\\n        margin: 1rem 0;\\r\\n    }\\r\\n\\r\\n    .empty_catalog {\\r\\n        font-size: 1.5rem;\\r\\n        font-weight: 500;\\r\\n        min-width: max-content;\\r\\n        width: 100%;\\r\\n    }\\r\\n    .items_list {\\r\\n        display: grid;\\r\\n        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));\\r\\n        gap: 30px 50px;\\r\\n        height: min-content;\\r\\n        grid-area: content;\\r\\n    }\\r\\n\\r\\n    .category_box {\\r\\n        display: grid;\\r\\n        grid-template-columns: minmax(200px, 300px) 1fr;\\r\\n        grid-template-rows: auto 1fr;\\r\\n        column-gap: 1rem;\\r\\n        grid-template-areas: \\r\\n            'crumbs crumbs'\\r\\n            'filter content';\\r\\n    }\\r\\n\\r\\n    .toggle_filters {\\r\\n        display: none;\\r\\n    }\\r\\n    @media (max-width: 768px) {\\r\\n        .category_box {\\r\\n            grid-template-columns: 1fr 1fr;\\r\\n            grid-template-areas: \\r\\n            'crumbs crumbs'\\r\\n            'filter filter'\\r\\n            'content content';\\r\\n        }\\r\\n\\r\\n        .toggle_filters {\\r\\n            display: initial;\\r\\n        }\\r\\n    }\\r\\n</style>\\r\\n\\r\\n"],"names":[],"mappings":"AAsEI,eAAe,cAAC,CAAC,AACnB,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,kBAAkB,CAAC,CACzC,KAAK,CAAE,IAAI,eAAe,CAAC,CAC3B,IAAI,CAAE,GAAG,CAAC,OAAO,CAAC,IAAI,MAAM,CAAC,CAC7B,cAAc,CAAE,SAAS,CACnB,SAAS,CAAE,MAAM,CACjB,OAAO,CAAE,MAAM,CAAC,CAAC,CACjB,MAAM,CAAE,IAAI,CAAC,CAAC,AAClB,CAAC,AAED,cAAc,cAAC,CAAC,AACZ,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,WAAW,CACtB,KAAK,CAAE,IAAI,AACf,CAAC,AACD,WAAW,cAAC,CAAC,AACT,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,OAAO,SAAS,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,GAAG,CAAC,CAAC,CAC5D,GAAG,CAAE,IAAI,CAAC,IAAI,CACd,MAAM,CAAE,WAAW,CACnB,SAAS,CAAE,OAAO,AACtB,CAAC,AAED,aAAa,cAAC,CAAC,AACX,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,OAAO,KAAK,CAAC,CAAC,KAAK,CAAC,CAAC,GAAG,CAC/C,kBAAkB,CAAE,IAAI,CAAC,GAAG,CAC5B,UAAU,CAAE,IAAI,CAChB,mBAAmB,CACf,eAAe;YACf,gBAAgB,AACxB,CAAC,AAED,eAAe,cAAC,CAAC,AACb,OAAO,CAAE,IAAI,AACjB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,aAAa,cAAC,CAAC,AACX,qBAAqB,CAAE,GAAG,CAAC,GAAG,CAC9B,mBAAmB,CACnB,eAAe;YACf,eAAe;YACf,iBAAiB,AACrB,CAAC,AAED,eAAe,cAAC,CAAC,AACb,OAAO,CAAE,OAAO,AACpB,CAAC,AACL,CAAC"}`
};
async function load$2(ctx) {
  let id = ctx.page.params.id;
  return { props: { id } };
}
var U5Bidu5D$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filterCollection;
  let categoryItem;
  let { id } = $$props;
  const temp = new Model();
  let title = "";
  let selectedValue;
  let values;
  let toggleFilters = false;
  let exportedActive;
  const staticData = temp.getCategoryItem(id);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  $$result.css.add(css$i);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    filterCollection = [];
    categoryItem = temp.getCategoryItem(id, selectedValue, filterCollection, values);
    $$rendered = `${$$result.head += `${$$result.title = `<title>${escape(title)}</title>`, ""}`, ""}

<div class="${"container"}"><div class="${"category_box svelte-x5u7fl"}">${function(__value) {
      if (is_promise(__value))
        return ``;
      return function(value) {
        return `
            ${value.category.length > 0 ? `${validate_component(Breadcrumbs, "Breadcrumbs").$$render($$result, { refaddress: value.catName }, {}, {})}
                ${validate_component(Filters, "Filters").$$render($$result, Object.assign(value, { selectedValue }, { filterCollection }, { values }, { toggleFilters }, { exportedActive }), {
          selectedValue: ($$value) => {
            selectedValue = $$value;
            $$settled = false;
          },
          filterCollection: ($$value) => {
            filterCollection = $$value;
            $$settled = false;
          },
          values: ($$value) => {
            values = $$value;
            $$settled = false;
          },
          toggleFilters: ($$value) => {
            toggleFilters = $$value;
            $$settled = false;
          },
          exportedActive: ($$value) => {
            exportedActive = $$value;
            $$settled = false;
          }
        }, {})}
                <button class="${"toggle_filters svelte-x5u7fl"}">\u0444\u0438\u043B\u044C\u0442\u0440\u044B</button>` : ``}
        `;
      }(__value);
    }(staticData)}
        ${function(__value) {
      if (is_promise(__value))
        return `
                ${validate_component(Loader, "Loader").$$render($$result, {}, {}, {})}
        `;
      return function(value) {
        return `
            ${value.category.length > 0 ? `<ul class="${"items_list svelte-x5u7fl"}">${each(value.category, (item) => `${validate_component(GoodItemView, "GoodItemView").$$render($$result, Object.assign(item, { categoryId: id }), {}, {})}`)}</ul>` : `<div class="${"empty_catalog svelte-x5u7fl"}">\u041F\u043E \u0432\u0430\u0448\u0435\u043C\u0443 \u0437\u0430\u043F\u0440\u043E\u0441\u0443 \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E</div>`}
        `;
      }(__value);
    }(categoryItem)}</div>
</div>`;
  } while (!$$settled);
  return $$rendered;
});
var _id_$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bidu5D$1,
  load: load$2
});
var css$h = {
  code: ".favorite_list.svelte-1x1msho{display:grid;grid-template-columns:repeat(auto-fill, minmax(180px, 1fr));gap:30px 50px;height:min-content;grid-area:content}.title.svelte-1x1msho{font-size:1.5rem;font-weight:500;margin:1rem 0}",
  map: `{"version":3,"file":"favorite.svelte","sources":["favorite.svelte"],"sourcesContent":["<script>\\r\\n    import {flip} from 'svelte/animate';\\r\\n    import { favoriteCollection } from '../stores/favoriteStore';\\r\\n    import GoodItemView from '../components/Main/Good/GoodItemView.svelte';\\r\\n<\/script>\\r\\n\\r\\n<svelte:head>\\r\\n    <title>\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435</title>\\r\\n</svelte:head>\\r\\n\\r\\n<div class=\\"container\\">\\r\\n    <div class=\\"title\\">\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435</div>\\r\\n    {#if $favoriteCollection.length > 0}\\r\\n        <ul class=\\"favorite_list\\">\\r\\n            {#each $favoriteCollection as item (item.name)}\\r\\n                <div animate:flip={{duration: 200}}>\\r\\n                    <GoodItemView {...item}/>\\r\\n                </div>\\r\\n            {/each}\\r\\n        </ul>\\r\\n    {:else}\\r\\n        \u0412\u044B \u0435\u0449\u0435 \u043D\u0435 \u0434\u043E\u0431\u0430\u0432\u0438\u043B\u0438 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u0445 \u0442\u043E\u0432\u0430\u0440\u043E\u0432\\r\\n    {/if}\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .favorite_list {\\r\\n        display: grid;\\r\\n        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));\\r\\n        gap: 30px 50px;\\r\\n        height: min-content;\\r\\n        grid-area: content;\\r\\n    }\\r\\n\\r\\n    .title {\\r\\n        font-size: 1.5rem;\\r\\n        font-weight: 500;\\r\\n        margin: 1rem 0;\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AA0BI,cAAc,eAAC,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,OAAO,SAAS,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,GAAG,CAAC,CAAC,CAC5D,GAAG,CAAE,IAAI,CAAC,IAAI,CACd,MAAM,CAAE,WAAW,CACnB,SAAS,CAAE,OAAO,AACtB,CAAC,AAED,MAAM,eAAC,CAAC,AACJ,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,MAAM,CAAE,IAAI,CAAC,CAAC,AAClB,CAAC"}`
};
var Favorite = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $favoriteCollection, $$unsubscribe_favoriteCollection;
  $$unsubscribe_favoriteCollection = subscribe(favoriteCollection, (value) => $favoriteCollection = value);
  $$result.css.add(css$h);
  $$unsubscribe_favoriteCollection();
  return `${$$result.head += `${$$result.title = `<title>\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435</title>`, ""}`, ""}

<div class="${"container"}"><div class="${"title svelte-1x1msho"}">\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435</div>
    ${$favoriteCollection.length > 0 ? `<ul class="${"favorite_list svelte-1x1msho"}">${each($favoriteCollection, (item) => `<div>${validate_component(GoodItemView, "GoodItemView").$$render($$result, Object.assign(item), {}, {})}
                </div>`)}</ul>` : `\u0412\u044B \u0435\u0449\u0435 \u043D\u0435 \u0434\u043E\u0431\u0430\u0432\u0438\u043B\u0438 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u044B\u0445 \u0442\u043E\u0432\u0430\u0440\u043E\u0432`}
</div>`;
});
var favorite = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Favorite
});
var css$g = {
  code: ".order_item.svelte-b51q7f.svelte-b51q7f{display:flex;align-items:center;margin-bottom:1rem;flex-wrap:wrap}.item_img.svelte-b51q7f.svelte-b51q7f{flex:0 1 100px;min-height:100px;display:flex;align-items:center;justify-content:center}.item_img.svelte-b51q7f img.svelte-b51q7f{max-width:100%;width:56%;height:auto}.item_name.svelte-b51q7f.svelte-b51q7f{padding:0 1rem;flex:1 1 180px}.price.svelte-b51q7f.svelte-b51q7f{font-size:1.3em;font-weight:600}.item_price.svelte-b51q7f.svelte-b51q7f{margin-left:auto}@media(max-width: 768px){.item_img.svelte-b51q7f.svelte-b51q7f{flex:0 1 50px;min-height:70px}.item_img.svelte-b51q7f img.svelte-b51q7f{width:100%}.order_item.svelte-b51q7f.svelte-b51q7f:not(:last-child){padding-bottom:1rem;border-bottom:1px solid var(--main-border-color)}}",
  map: '{"version":3,"file":"OrderItem.svelte","sources":["OrderItem.svelte"],"sourcesContent":["<script>\\r\\n    export let item = $$props;\\r\\n<\/script>\\r\\n\\r\\n<li class=\\"order_item\\">\\r\\n    <div class=\\"item_img\\">\\r\\n        <img src={item.elem.imgSet[0]} alt=\\"\\">\\r\\n    </div>\\r\\n    <div class=\\"item_name\\">{item.elem.name}</div>\\r\\n    <div class=\\"item_price\\">\\r\\n        <span class=\\"counter\\">{item.cartCounter}</span>\\r\\n        x\\r\\n        <span class=\\"price\\">{item.elem.price} \u0440\u0443\u0431</span>\\r\\n    </div>\\r\\n</li>\\r\\n\\r\\n<style>\\r\\n    .order_item {\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        margin-bottom: 1rem;\\r\\n        flex-wrap: wrap;\\r\\n    }\\r\\n\\r\\n    .item_img {\\r\\n        flex: 0 1 100px;\\r\\n        min-height: 100px;\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: center;\\r\\n    }\\r\\n\\r\\n    .item_img img {\\r\\n        max-width: 100%;\\r\\n        width: 56%;\\r\\n        height: auto;\\r\\n    }\\r\\n\\r\\n    .item_name {\\r\\n        padding: 0 1rem;\\r\\n        flex: 1 1 180px;\\r\\n    }\\r\\n\\r\\n    .price {\\r\\n        font-size: 1.3em;\\r\\n        font-weight: 600;\\r\\n    }\\r\\n\\r\\n    .item_price {\\r\\n        margin-left: auto;\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .item_img {\\r\\n            flex: 0 1 50px;\\r\\n            min-height: 70px;\\r\\n        }\\r\\n\\r\\n        .item_img img {\\r\\n            width: 100%;\\r\\n        }\\r\\n\\r\\n        .order_item:not(:last-child) {\\r\\n            padding-bottom: 1rem;\\r\\n            border-bottom: 1px solid var(--main-border-color);\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAiBI,WAAW,4BAAC,CAAC,AACT,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,aAAa,CAAE,IAAI,CACnB,SAAS,CAAE,IAAI,AACnB,CAAC,AAED,SAAS,4BAAC,CAAC,AACP,IAAI,CAAE,CAAC,CAAC,CAAC,CAAC,KAAK,CACf,UAAU,CAAE,KAAK,CACjB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,AAC3B,CAAC,AAED,uBAAS,CAAC,GAAG,cAAC,CAAC,AACX,SAAS,CAAE,IAAI,CACf,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,IAAI,AAChB,CAAC,AAED,UAAU,4BAAC,CAAC,AACR,OAAO,CAAE,CAAC,CAAC,IAAI,CACf,IAAI,CAAE,CAAC,CAAC,CAAC,CAAC,KAAK,AACnB,CAAC,AAED,MAAM,4BAAC,CAAC,AACJ,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,GAAG,AACpB,CAAC,AAED,WAAW,4BAAC,CAAC,AACT,WAAW,CAAE,IAAI,AACrB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,SAAS,4BAAC,CAAC,AACP,IAAI,CAAE,CAAC,CAAC,CAAC,CAAC,IAAI,CACd,UAAU,CAAE,IAAI,AACpB,CAAC,AAED,uBAAS,CAAC,GAAG,cAAC,CAAC,AACX,KAAK,CAAE,IAAI,AACf,CAAC,AAED,uCAAW,KAAK,WAAW,CAAC,AAAC,CAAC,AAC1B,cAAc,CAAE,IAAI,CACpB,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,AACrD,CAAC,AACL,CAAC"}'
};
var OrderItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { item = $$props } = $$props;
  if ($$props.item === void 0 && $$bindings.item && item !== void 0)
    $$bindings.item(item);
  $$result.css.add(css$g);
  return `<li class="${"order_item svelte-b51q7f"}"><div class="${"item_img svelte-b51q7f"}"><img${add_attribute("src", item.elem.imgSet[0], 0)} alt="${""}" class="${"svelte-b51q7f"}"></div>
    <div class="${"item_name svelte-b51q7f"}">${escape(item.elem.name)}</div>
    <div class="${"item_price svelte-b51q7f"}"><span class="${"counter"}">${escape(item.cartCounter)}</span>
        x
        <span class="${"price svelte-b51q7f"}">${escape(item.elem.price)} \u0440\u0443\u0431</span></div>
</li>`;
});
var css$f = {
  code: ".order_cart.svelte-1tz0lfo.svelte-1tz0lfo{flex:1;color:var(--main-text-color)}.order_list.svelte-1tz0lfo.svelte-1tz0lfo{margin-top:1rem}.subtotal.svelte-1tz0lfo.svelte-1tz0lfo{padding:1rem 0;border-top:1px solid var(--main-border-color);border-bottom:1px solid var(--main-border-color);margin-bottom:1rem}.sum.svelte-1tz0lfo.svelte-1tz0lfo{display:flex;justify-content:space-between}.sum_val.svelte-1tz0lfo.svelte-1tz0lfo{font-size:1.2em;font-weight:600}.promo.svelte-1tz0lfo.svelte-1tz0lfo{font-size:1.2em;font-weight:600;color:var(--positive-color)}.total.svelte-1tz0lfo .title.svelte-1tz0lfo{font-size:1.3em}.total.svelte-1tz0lfo .sum_val.svelte-1tz0lfo{font-size:1.5em}@media(max-width: 768px){.order_cart.svelte-1tz0lfo.svelte-1tz0lfo{order:-1}}",
  map: `{"version":3,"file":"OrderCart.svelte","sources":["OrderCart.svelte"],"sourcesContent":["<script>\\r\\n    import { cartCollection, promocodeState, orderStore } from '../../../stores/cart';\\r\\n    import OrderItem from './OrderItem.svelte';\\r\\n\\r\\n    export let deliveryCost;\\r\\n\\r\\n    $: sumAllItemsPrice = () => {\\r\\n        let sum = 0;\\r\\n        $cartCollection.forEach(el => {\\r\\n            sum += el.elem.price * el.cartCounter;\\r\\n        });\\r\\n\\r\\n        if($promocodeState) {\\r\\n            return Math.ceil(sum * 0.9) + deliveryCost;\\r\\n        }\\r\\n\\r\\n        return sum + deliveryCost;\\r\\n    };\\r\\n\\r\\n    $: $orderStore.sum = sumAllItemsPrice();\\r\\n<\/script>\\r\\n\\r\\n\\r\\n<div class=\\"order_cart\\">\\r\\n    <ul class=\\"order_list\\">\\r\\n        {#each $cartCollection as item}\\r\\n            <OrderItem {...item} />\\r\\n        {/each}\\r\\n    </ul>\\r\\n    <div class=\\"subtotal\\">\\r\\n        <div class=\\"sum\\">\\r\\n            <span class=\\"title\\">\u0421\u0443\u043C\u043C\u0430 \u043F\u043E \u0442\u043E\u0432\u0430\u0440\u0430\u043C</span>\\r\\n            <span class=\\"sum_val\\">100 \u0440\u0443\u0431</span>\\r\\n        </div>\\r\\n        <div class=\\"sum\\">\\r\\n            <span class=\\"title\\">\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</span>\\r\\n            <span class=\\"sum_val\\">{deliveryCost} \u0440\u0443\u0431</span>\\r\\n        </div>\\r\\n        {#if $promocodeState}\\r\\n            <div class=\\"sum\\">\\r\\n                <span class=\\"title\\">\u041F\u0440\u043E\u043C\u043E\u043A\u043E\u0434</span>\\r\\n                <span class=\\"promo\\">-10 %</span>\\r\\n            </div>\\r\\n        {/if}\\r\\n    </div>\\r\\n    <div class=\\"total\\">\\r\\n        <div class=\\"sum\\">\\r\\n            <span class=\\"title\\">\u0418\u0442\u043E\u0433\u043E:</span>\\r\\n            <span class=\\"sum_val\\">{sumAllItemsPrice()} \u0440\u0443\u0431</span>\\r\\n        </div>\\r\\n    </div>\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .order_cart {\\r\\n        flex: 1;\\r\\n        color: var(--main-text-color);\\r\\n    }\\r\\n\\r\\n    .order_list {\\r\\n        margin-top: 1rem;\\r\\n    }\\r\\n\\r\\n    .subtotal {\\r\\n        padding: 1rem 0;\\r\\n        border-top: 1px solid var(--main-border-color);\\r\\n        border-bottom: 1px solid var(--main-border-color);\\r\\n        margin-bottom: 1rem;\\r\\n    }\\r\\n\\r\\n    .sum {\\r\\n        display: flex;\\r\\n        justify-content: space-between;\\r\\n    }\\r\\n\\r\\n    .sum_val {\\r\\n        font-size: 1.2em;\\r\\n        font-weight: 600;\\r\\n    }\\r\\n\\r\\n    .promo {\\r\\n        font-size: 1.2em;\\r\\n        font-weight: 600;\\r\\n        color: var(--positive-color);\\r\\n    }\\r\\n\\r\\n    .total .title {\\r\\n       font-size: 1.3em;\\r\\n    }\\r\\n\\r\\n    .total .sum_val {\\r\\n        font-size: 1.5em;\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .order_cart {\\r\\n            order: -1;\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAsDI,WAAW,8BAAC,CAAC,AACT,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,IAAI,iBAAiB,CAAC,AACjC,CAAC,AAED,WAAW,8BAAC,CAAC,AACT,UAAU,CAAE,IAAI,AACpB,CAAC,AAED,SAAS,8BAAC,CAAC,AACP,OAAO,CAAE,IAAI,CAAC,CAAC,CACf,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAC9C,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CACjD,aAAa,CAAE,IAAI,AACvB,CAAC,AAED,IAAI,8BAAC,CAAC,AACF,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,AAClC,CAAC,AAED,QAAQ,8BAAC,CAAC,AACN,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,GAAG,AACpB,CAAC,AAED,MAAM,8BAAC,CAAC,AACJ,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,GAAG,CAChB,KAAK,CAAE,IAAI,gBAAgB,CAAC,AAChC,CAAC,AAED,qBAAM,CAAC,MAAM,eAAC,CAAC,AACZ,SAAS,CAAE,KAAK,AACnB,CAAC,AAED,qBAAM,CAAC,QAAQ,eAAC,CAAC,AACb,SAAS,CAAE,KAAK,AACpB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,WAAW,8BAAC,CAAC,AACT,KAAK,CAAE,EAAE,AACb,CAAC,AACL,CAAC"}`
};
var OrderCart = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let sumAllItemsPrice;
  let $orderStore, $$unsubscribe_orderStore;
  let $promocodeState, $$unsubscribe_promocodeState;
  let $cartCollection, $$unsubscribe_cartCollection;
  $$unsubscribe_orderStore = subscribe(orderStore, (value) => $orderStore = value);
  $$unsubscribe_promocodeState = subscribe(promocodeState, (value) => $promocodeState = value);
  $$unsubscribe_cartCollection = subscribe(cartCollection, (value) => $cartCollection = value);
  let { deliveryCost } = $$props;
  if ($$props.deliveryCost === void 0 && $$bindings.deliveryCost && deliveryCost !== void 0)
    $$bindings.deliveryCost(deliveryCost);
  $$result.css.add(css$f);
  sumAllItemsPrice = () => {
    let sum = 0;
    $cartCollection.forEach((el) => {
      sum += el.elem.price * el.cartCounter;
    });
    if ($promocodeState) {
      return Math.ceil(sum * 0.9) + deliveryCost;
    }
    return sum + deliveryCost;
  };
  set_store_value(orderStore, $orderStore.sum = sumAllItemsPrice(), $orderStore);
  $$unsubscribe_orderStore();
  $$unsubscribe_promocodeState();
  $$unsubscribe_cartCollection();
  return `<div class="${"order_cart svelte-1tz0lfo"}"><ul class="${"order_list svelte-1tz0lfo"}">${each($cartCollection, (item) => `${validate_component(OrderItem, "OrderItem").$$render($$result, Object.assign(item), {}, {})}`)}</ul>
    <div class="${"subtotal svelte-1tz0lfo"}"><div class="${"sum svelte-1tz0lfo"}"><span class="${"title"}">\u0421\u0443\u043C\u043C\u0430 \u043F\u043E \u0442\u043E\u0432\u0430\u0440\u0430\u043C</span>
            <span class="${"sum_val svelte-1tz0lfo"}">100 \u0440\u0443\u0431</span></div>
        <div class="${"sum svelte-1tz0lfo"}"><span class="${"title"}">\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</span>
            <span class="${"sum_val svelte-1tz0lfo"}">${escape(deliveryCost)} \u0440\u0443\u0431</span></div>
        ${$promocodeState ? `<div class="${"sum svelte-1tz0lfo"}"><span class="${"title"}">\u041F\u0440\u043E\u043C\u043E\u043A\u043E\u0434</span>
                <span class="${"promo svelte-1tz0lfo"}">-10 %</span></div>` : ``}</div>
    <div class="${"total svelte-1tz0lfo"}"><div class="${"sum svelte-1tz0lfo"}"><span class="${"title svelte-1tz0lfo"}">\u0418\u0442\u043E\u0433\u043E:</span>
            <span class="${"sum_val svelte-1tz0lfo"}">${escape(sumAllItemsPrice())} \u0440\u0443\u0431</span></div></div>
</div>`;
});
var css$e = {
  code: "input.svelte-16ixb0w.svelte-16ixb0w{visibility:hidden;position:absolute}label.svelte-16ixb0w.svelte-16ixb0w{cursor:pointer;padding:1rem;border:1px solid var(--main-border-color);transition:.2s;margin-bottom:0.5rem}label.svelte-16ixb0w.svelte-16ixb0w:hover{background:var(--filter-bg-color)}.radio_content.svelte-16ixb0w.svelte-16ixb0w{position:relative;padding-left:25px;display:flex;justify-content:space-between;align-items:center;font-size:1.3rem}.radio_content.svelte-16ixb0w.svelte-16ixb0w:before{content:'';position:absolute;left:0;top:6px;width:18px;height:18px;border:1px solid #ccc;border-radius:50%;background:#fff}.radio_content.svelte-16ixb0w.svelte-16ixb0w:after{content:'';background:rgba(255,255,255,0);position:absolute;left:5px;top:11px;width:10px;height:10px;border-radius:50px}input.svelte-16ixb0w:checked+.radio_content.svelte-16ixb0w:after{background:var(--main-theme-color)}",
  map: `{"version":3,"file":"OrderRadio.svelte","sources":["OrderRadio.svelte"],"sourcesContent":["<script>\\r\\n    export let flag;\\r\\n    export let radioValue;\\r\\n<\/script>\\r\\n\\r\\n<label>\\r\\n    <input type=\\"radio\\" bind:group={flag} value={radioValue}>\\r\\n    <span class=\\"radio_content\\">\\r\\n        <slot name=\\"value\\"></slot>\\r\\n        <slot name=\\"price\\"></slot>\\r\\n    </span>\\r\\n</label>\\r\\n\\r\\n<style>\\r\\n    input {\\r\\n        visibility: hidden;\\r\\n        position: absolute;\\r\\n    }\\r\\n\\r\\n    label {\\r\\n        cursor: pointer;\\r\\n        padding: 1rem;\\r\\n        border: 1px solid var(--main-border-color);\\r\\n        transition: .2s;\\r\\n        margin-bottom: 0.5rem;\\r\\n    }\\r\\n\\r\\n    label:hover {\\r\\n        background: var(--filter-bg-color);\\r\\n    }\\r\\n\\r\\n    .radio_content {\\r\\n        position: relative;\\r\\n        padding-left: 25px;\\r\\n        display: flex;\\r\\n        justify-content: space-between;\\r\\n        align-items: center;\\r\\n        font-size: 1.3rem;\\r\\n    }\\r\\n\\r\\n    .radio_content:before {\\r\\n        content: '';\\r\\n        position: absolute;\\r\\n        left: 0;\\r\\n        top: 6px;\\r\\n        width: 18px;\\r\\n        height: 18px;\\r\\n        border: 1px solid #ccc;\\r\\n        border-radius: 50%;\\r\\n        background: #fff;\\r\\n    }\\r\\n\\r\\n    .radio_content:after {\\r\\n        content: '';\\r\\n        background: rgba(255,255,255,0);\\r\\n        position: absolute;\\r\\n        left: 5px;\\r\\n        top: 11px;\\r\\n        width: 10px;\\r\\n        height: 10px;\\r\\n        border-radius: 50px;\\r\\n    }\\r\\n\\r\\n    input:checked + .radio_content:after {\\r\\n        background: var(--main-theme-color);\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAcI,KAAK,8BAAC,CAAC,AACH,UAAU,CAAE,MAAM,CAClB,QAAQ,CAAE,QAAQ,AACtB,CAAC,AAED,KAAK,8BAAC,CAAC,AACH,MAAM,CAAE,OAAO,CACf,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAC1C,UAAU,CAAE,GAAG,CACf,aAAa,CAAE,MAAM,AACzB,CAAC,AAED,mCAAK,MAAM,AAAC,CAAC,AACT,UAAU,CAAE,IAAI,iBAAiB,CAAC,AACtC,CAAC,AAED,cAAc,8BAAC,CAAC,AACZ,QAAQ,CAAE,QAAQ,CAClB,YAAY,CAAE,IAAI,CAClB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,MAAM,AACrB,CAAC,AAED,4CAAc,OAAO,AAAC,CAAC,AACnB,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,GAAG,CACR,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,CACtB,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,IAAI,AACpB,CAAC,AAED,4CAAc,MAAM,AAAC,CAAC,AAClB,OAAO,CAAE,EAAE,CACX,UAAU,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,CAC/B,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,IAAI,CACT,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,IAAI,AACvB,CAAC,AAED,oBAAK,QAAQ,CAAG,6BAAc,MAAM,AAAC,CAAC,AAClC,UAAU,CAAE,IAAI,kBAAkB,CAAC,AACvC,CAAC"}`
};
var OrderRadio = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { flag } = $$props;
  let { radioValue } = $$props;
  if ($$props.flag === void 0 && $$bindings.flag && flag !== void 0)
    $$bindings.flag(flag);
  if ($$props.radioValue === void 0 && $$bindings.radioValue && radioValue !== void 0)
    $$bindings.radioValue(radioValue);
  $$result.css.add(css$e);
  return `<label class="${"svelte-16ixb0w"}"><input type="${"radio"}"${add_attribute("value", radioValue, 0)} class="${"svelte-16ixb0w"}"${radioValue === flag ? add_attribute("checked", true, 1) : ""}>
    <span class="${"radio_content svelte-16ixb0w"}">${slots.value ? slots.value({}) : ``}
        ${slots.price ? slots.price({}) : ``}</span>
</label>`;
});
var css$d = {
  code: ".inp_elem.svelte-bqmc14{display:flex;flex-direction:column}input.svelte-bqmc14{padding:6px 10px;height:50px;border:1px solid var(--main-border-color);font-family:var(--font);font-size:1rem;transition:.2s}.clear.svelte-bqmc14{position:absolute;right:1rem;bottom:14px}",
  map: `{"version":3,"file":"OrderInputText.svelte","sources":["OrderInputText.svelte"],"sourcesContent":["<script>\\r\\n    import {formatByPattern} from '../../../presenter/present-service';\\r\\n\\r\\n    export let pholder;\\r\\n    export let inpVal;\\r\\n    export let idVal;\\r\\n    export let label;\\r\\n    export let pattern = false;\\r\\n\\r\\n    let input\\r\\n\\r\\n    function clearAndFocus() {\\r\\n        inpVal = \\"\\";\\r\\n        input.focus();\\r\\n    }\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"inp_elem\\">\\r\\n    <label for={idVal} >\\r\\n        <slot name=\\"label\\">{label}</slot>\\r\\n    </label>\\r\\n    {#if pattern}\\r\\n        <input type=\\"text\\" id={idVal} placeholder={pholder} use:formatByPattern={'(***) ***-**-**'} bind:value={inpVal} bind:this={input}>\\r\\n    {:else}\\r\\n        <input type=\\"text\\" id={idVal} placeholder={pholder} bind:value={inpVal} bind:this={input}>\\r\\n    {/if}\\r\\n    \\r\\n    {#if inpVal}\\r\\n        <span class=\\"material-icons-outlined clear\\" on:click={clearAndFocus}>clear</span>\\r\\n    {/if}\\r\\n</div>\\r\\n\\r\\n\\r\\n\\r\\n<style>\\r\\n    .inp_elem {\\r\\n        display: flex;\\r\\n        flex-direction: column;\\r\\n    }\\r\\n\\r\\n    input {\\r\\n        padding: 6px 10px;\\r\\n        height: 50px;\\r\\n        border: 1px solid var(--main-border-color);\\r\\n        font-family: var(--font);\\r\\n        font-size: 1rem;\\r\\n        transition: .2s;\\r\\n    }\\r\\n\\r\\n    .clear {\\r\\n        position: absolute;\\r\\n        right: 1rem;\\r\\n        bottom: 14px;\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAmCI,SAAS,cAAC,CAAC,AACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,AAC1B,CAAC,AAED,KAAK,cAAC,CAAC,AACH,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAC1C,WAAW,CAAE,IAAI,MAAM,CAAC,CACxB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,GAAG,AACnB,CAAC,AAED,MAAM,cAAC,CAAC,AACJ,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,AAChB,CAAC"}`
};
var OrderInputText = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { pholder } = $$props;
  let { inpVal } = $$props;
  let { idVal } = $$props;
  let { label } = $$props;
  let { pattern = false } = $$props;
  let input;
  if ($$props.pholder === void 0 && $$bindings.pholder && pholder !== void 0)
    $$bindings.pholder(pholder);
  if ($$props.inpVal === void 0 && $$bindings.inpVal && inpVal !== void 0)
    $$bindings.inpVal(inpVal);
  if ($$props.idVal === void 0 && $$bindings.idVal && idVal !== void 0)
    $$bindings.idVal(idVal);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.pattern === void 0 && $$bindings.pattern && pattern !== void 0)
    $$bindings.pattern(pattern);
  $$result.css.add(css$d);
  return `<div class="${"inp_elem svelte-bqmc14"}"><label${add_attribute("for", idVal, 0)}>${slots.label ? slots.label({}) : `${escape(label)}`}</label>
    ${pattern ? `<input type="${"text"}"${add_attribute("id", idVal, 0)}${add_attribute("placeholder", pholder, 0)} class="${"svelte-bqmc14"}"${add_attribute("value", inpVal, 0)}${add_attribute("this", input, 0)}>` : `<input type="${"text"}"${add_attribute("id", idVal, 0)}${add_attribute("placeholder", pholder, 0)} class="${"svelte-bqmc14"}"${add_attribute("value", inpVal, 0)}${add_attribute("this", input, 0)}>`}
    
    ${inpVal ? `<span class="${"material-icons-outlined clear svelte-bqmc14"}">clear</span>` : ``}
</div>`;
});
var css$c = {
  code: ".confirm_order.svelte-o34qea.svelte-o34qea{background:var(--main-theme-color);color:var(--main-bg-color);width:100%;border:0;text-align:center;font:500 1rem var(--font);padding:1rem}.title.svelte-o34qea.svelte-o34qea{font-size:1.5rem;font-weight:500;margin:1rem 0}.item_title.svelte-o34qea.svelte-o34qea{font-size:1.2rem;font-weight:500;margin:0.5rem 0}.order_form.svelte-o34qea.svelte-o34qea{flex:1;border-right:1px solid var(--main-border-color);padding-right:1rem;color:var(--main-text-color)}.item_block.svelte-o34qea.svelte-o34qea{display:flex;flex-direction:column;margin-bottom:2rem;position:relative}.item_block.svelte-o34qea .clear.svelte-o34qea{position:absolute;cursor:pointer;bottom:12px;right:10px;color:var(--main-text-color)}.item_block.svelte-o34qea textarea.svelte-o34qea{height:100px;resize:vertical;border:1px solid var(--main-border-color);padding:0.5rem}.towns_list.svelte-o34qea.svelte-o34qea{position:absolute;top:100%;left:0;width:100%;max-height:300px;overflow:auto;background:var(--main-bg-color);box-shadow:0px 10px 20px -10px rgba(0,0,0,0.1);border:1px solid var(--main-border-color);border-top:0;z-index:10}.towns_list.svelte-o34qea li.svelte-o34qea{padding:5px 20px;cursor:pointer;transition:.1s}.towns_list.svelte-o34qea li.svelte-o34qea:hover{background:var(--main-theme-color);color:var(--main-bg-color)}.item_block.svelte-o34qea input.svelte-o34qea{padding:6px 10px;height:50px;border:1px solid var(--main-border-color);font-family:var(--font);font-size:1rem;transition:.2s}.star.svelte-o34qea.svelte-o34qea{color:red}@media(max-width: 768px){.order_form.svelte-o34qea.svelte-o34qea{padding:0;border-right:0}}",
  map: `{"version":3,"file":"OrderForm.svelte","sources":["OrderForm.svelte"],"sourcesContent":["<script>\\r\\n    import { fade } from 'svelte/transition';\\r\\n    import { get } from '../../../routes/api/townsData';\\r\\n    import OrderRadio from './OrderRadio.svelte';\\r\\n    import OrderInputText from './OrderInputText.svelte';\\r\\n    import { goto } from '$app/navigation';\\r\\n    import { orderStore, cartCollection } from '../../../stores/cart';\\r\\n\\r\\n    export let inputValues = {\\r\\n        townSearch: '',\\r\\n        nameValue: '',\\r\\n        phoneValue: '',\\r\\n        commentValue: '',\\r\\n        emailValue: '',\\r\\n        payChoice: null,\\r\\n        deliveryChoice: 0,\\r\\n        sum: 0\\r\\n    }\\r\\n\\r\\n    $: $orderStore = inputValues;\\r\\n\\r\\n    let townInputFocus = false;\\r\\n    let input;\\r\\n\\r\\n    $: townSearchResult = get(inputValues.townSearch);\\r\\n\\r\\n    function clearAndFocus() {\\r\\n        inputValues.townSearch = \\"\\";\\r\\n        input.focus();\\r\\n    }\\r\\n\\r\\n    const handleSubmit = () => {\\r\\n        goto(\`/completeOrder\`);\\r\\n    }\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"order_form\\">\\r\\n    <div class=\\"title\\">\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u043A\u0430\u0437\u0430</div>\\r\\n    <form on:submit|preventDefault={handleSubmit}>\\r\\n        <div class=\\"order_form_item\\">\\r\\n            <div class=\\"item_title\\">\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435</div>\\r\\n            <div class=\\"item_block\\">\\r\\n                <OrderInputText \\r\\n                    idVal=\\"names\\" \\r\\n                    pholder=\\"\u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u0424\u0418\u041E \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u043E\u0433\u043E \u043B\u0438\u0446\u0430\\" \\r\\n                    bind:inpVal={inputValues.nameValue}>\\r\\n                        <span slot=label>\u0424\u0418\u041E<span class=\\"star\\">*</span></span>\\r\\n                </OrderInputText>\\r\\n            </div>\\r\\n            <div class=\\"item_block\\">\\r\\n                <OrderInputText \\r\\n                    pattern={true}\\r\\n                    idVal=\\"phone\\"\\r\\n                    bind:inpVal={inputValues.phoneValue}>\\r\\n                        <span slot=label>\u0422\u0435\u043B\u0435\u0444\u043E\u043D<span class=\\"star\\">*</span></span>\\r\\n                </OrderInputText>\\r\\n            </div>\\r\\n            <div class=\\"item_title\\">\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430</div>\\r\\n            <div class=\\"item_block\\">\\r\\n                <label for=\\"names\\">\\r\\n                    \u041D\u0430\u0441\u0435\u043B\u0435\u043D\u043D\u044B\u0439 \u043F\u0443\u043D\u043A\u0442<span class=\\"star\\">*</span>\\r\\n                </label>\\r\\n                <input type=\\"text\\" id=\\"names\\" bind:value={inputValues.townSearch}\\r\\n                    bind:this={input} \\r\\n                    on:focus={() => townInputFocus = true}\\r\\n                    on:blur={() => townInputFocus = false}>\\r\\n                {#if inputValues.townSearch}\\r\\n                    <span class=\\"material-icons-outlined clear\\" on:click={() => clearAndFocus()}>clear</span>\\r\\n                {/if}\\r\\n                {#await townSearchResult then value}\\r\\n                    <ul class=\\"towns_list\\">\\r\\n                        {#each value.body as item}\\r\\n                            {#each item as town, i (i)}\\r\\n                                {#if townInputFocus }\\r\\n                                    <li transition:fade on:click={() => inputValues.townSearch = town}>{town}</li>\\r\\n                                {/if}\\r\\n                            {/each}\\r\\n                        {/each}\\r\\n                    </ul>\\r\\n                {/await}\\r\\n            </div>\\r\\n\\r\\n            <div class=\\"item_block\\">\\r\\n                <OrderRadio bind:flag={inputValues.deliveryChoice} radioValue={0}>\\r\\n                    <span slot=\\"value\\">\u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 (\u043D\u0430 \u043F\u0443\u043D\u043A\u0442\u0435 \u0432\u044B\u0434\u0430\u0447\u0438)</span>\\r\\n                    <span slot=\\"price\\">+ 0 \u0440\u0443\u0431</span>\\r\\n                </OrderRadio>\\r\\n                <OrderRadio bind:flag={inputValues.deliveryChoice} radioValue={300}>\\r\\n                    <span slot=\\"value\\">\u041A\u0443\u0440\u044C\u0435\u0440\u043E\u043C</span>\\r\\n                    <span slot=\\"price\\">+ 300 \u0440\u0443\u0431</span>\\r\\n                </OrderRadio>\\r\\n            </div>\\r\\n            <div class=\\"item_block\\">\\r\\n                <label for=\\"comment\\">\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \u043A \u0437\u0430\u043A\u0430\u0437\u0443</label>\\r\\n                <textarea id=\\"comment\\" bind:value={inputValues.commentValue}></textarea>\\r\\n            </div>\\r\\n\\r\\n            <div class=\\"item_title\\">\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C</div>\\r\\n            <div class=\\"item_block\\">\\r\\n                <OrderInputText \\r\\n                    idVal=\\"mail\\"\\r\\n                    pholder=\\"email \u0430\u0434\u0440\u0435\u0441\\"\\r\\n                    bind:inpVal={ inputValues.emailValue }>\\r\\n                        <span slot=label>Email<span class=\\"star\\">*</span></span>\\r\\n                </OrderInputText>\\r\\n            </div>\\r\\n\\r\\n            <div class=\\"item_title\\">\u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B<span class=\\"star\\">*</span></div>\\r\\n            <div class=\\"item_block\\">\\r\\n                <OrderRadio bind:flag={inputValues.payChoice} radioValue={1}>\\r\\n                    <span slot=\\"value\\">\u041D\u0430\u043B\u0438\u0447\u043D\u044B\u043C\u0438 \u043A\u0443\u0440\u044C\u0435\u0440\u0443</span>\\r\\n                </OrderRadio>\\r\\n                <OrderRadio bind:flag={inputValues.payChoice} radioValue={2}>\\r\\n                    <span slot=\\"value\\">\u0411\u0430\u043D\u043A\u043E\u0432\u0441\u043A\u0438\u0439 \u043F\u0435\u0440\u0435\u0432\u043E\u0434</span>\\r\\n                </OrderRadio>\\r\\n            </div>\\r\\n        </div>\\r\\n        <button class=\\"confirm_order\\">\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437</button>\\r\\n    </form>\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .confirm_order {\\r\\n        background: var(--main-theme-color);\\r\\n        color: var(--main-bg-color);\\r\\n        width: 100%;\\r\\n        border: 0;\\r\\n        text-align: center;\\r\\n        font: 500 1rem var(--font);\\r\\n        padding: 1rem;\\r\\n    }\\r\\n\\r\\n    .title {\\r\\n        font-size: 1.5rem;\\r\\n        font-weight: 500;\\r\\n        margin: 1rem 0;\\r\\n    }\\r\\n\\r\\n    .item_title {\\r\\n        font-size: 1.2rem;\\r\\n        font-weight: 500;\\r\\n        margin: 0.5rem 0;\\r\\n    }\\r\\n\\r\\n    .order_form {\\r\\n        flex: 1;\\r\\n        border-right: 1px solid var(--main-border-color);\\r\\n        padding-right: 1rem;\\r\\n        color: var(--main-text-color);\\r\\n    }\\r\\n\\r\\n    .item_block {\\r\\n        display: flex;\\r\\n        flex-direction: column;\\r\\n        margin-bottom: 2rem;\\r\\n        position: relative;\\r\\n    }\\r\\n\\r\\n    .item_block .clear {\\r\\n        position: absolute;\\r\\n        cursor: pointer;\\r\\n        bottom: 12px;\\r\\n        right: 10px;\\r\\n        color: var(--main-text-color);\\r\\n    }\\r\\n\\r\\n    .item_block textarea {\\r\\n        height: 100px;\\r\\n        resize: vertical;\\r\\n        border: 1px solid var(--main-border-color);\\r\\n        padding: 0.5rem;\\r\\n    }\\r\\n\\r\\n    .towns_list {\\r\\n        position: absolute;\\r\\n        top: 100%;\\r\\n        left: 0;\\r\\n        width: 100%;\\r\\n        max-height: 300px;\\r\\n        overflow: auto;\\r\\n        background:var(--main-bg-color);\\r\\n        box-shadow: 0px 10px 20px -10px rgba(0,0,0,0.1);\\r\\n        border: 1px solid var(--main-border-color);\\r\\n        border-top: 0;\\r\\n        z-index: 10;\\r\\n    }\\r\\n\\r\\n    .towns_list li {\\r\\n        padding: 5px 20px;\\r\\n        cursor: pointer;\\r\\n        transition: .1s;\\r\\n    }\\r\\n\\r\\n    .towns_list li:hover {\\r\\n        background: var(--main-theme-color);\\r\\n        color: var(--main-bg-color);\\r\\n    }\\r\\n\\r\\n    .item_block input {\\r\\n        padding: 6px 10px;\\r\\n        height: 50px;\\r\\n        border: 1px solid var(--main-border-color);\\r\\n        font-family: var(--font);\\r\\n        font-size: 1rem;\\r\\n        transition: .2s;\\r\\n    }\\r\\n\\r\\n    .star {\\r\\n        color: red;\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .order_form {\\r\\n            padding: 0;\\r\\n            border-right: 0;\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AA0HI,cAAc,4BAAC,CAAC,AACZ,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,KAAK,CAAE,IAAI,eAAe,CAAC,CAC3B,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,CAAC,CACT,UAAU,CAAE,MAAM,CAClB,IAAI,CAAE,GAAG,CAAC,IAAI,CAAC,IAAI,MAAM,CAAC,CAC1B,OAAO,CAAE,IAAI,AACjB,CAAC,AAED,MAAM,4BAAC,CAAC,AACJ,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,MAAM,CAAE,IAAI,CAAC,CAAC,AAClB,CAAC,AAED,WAAW,4BAAC,CAAC,AACT,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,MAAM,CAAE,MAAM,CAAC,CAAC,AACpB,CAAC,AAED,WAAW,4BAAC,CAAC,AACT,IAAI,CAAE,CAAC,CACP,YAAY,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAChD,aAAa,CAAE,IAAI,CACnB,KAAK,CAAE,IAAI,iBAAiB,CAAC,AACjC,CAAC,AAED,WAAW,4BAAC,CAAC,AACT,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,aAAa,CAAE,IAAI,CACnB,QAAQ,CAAE,QAAQ,AACtB,CAAC,AAED,yBAAW,CAAC,MAAM,cAAC,CAAC,AAChB,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,OAAO,CACf,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,KAAK,CAAE,IAAI,iBAAiB,CAAC,AACjC,CAAC,AAED,yBAAW,CAAC,QAAQ,cAAC,CAAC,AAClB,MAAM,CAAE,KAAK,CACb,MAAM,CAAE,QAAQ,CAChB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAC1C,OAAO,CAAE,MAAM,AACnB,CAAC,AAED,WAAW,4BAAC,CAAC,AACT,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,IAAI,CACT,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,KAAK,CACjB,QAAQ,CAAE,IAAI,CACd,WAAW,IAAI,eAAe,CAAC,CAC/B,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,IAAI,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAC/C,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAC1C,UAAU,CAAE,CAAC,CACb,OAAO,CAAE,EAAE,AACf,CAAC,AAED,yBAAW,CAAC,EAAE,cAAC,CAAC,AACZ,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,MAAM,CAAE,OAAO,CACf,UAAU,CAAE,GAAG,AACnB,CAAC,AAED,yBAAW,CAAC,gBAAE,MAAM,AAAC,CAAC,AAClB,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,KAAK,CAAE,IAAI,eAAe,CAAC,AAC/B,CAAC,AAED,yBAAW,CAAC,KAAK,cAAC,CAAC,AACf,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAC1C,WAAW,CAAE,IAAI,MAAM,CAAC,CACxB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,GAAG,AACnB,CAAC,AAED,KAAK,4BAAC,CAAC,AACH,KAAK,CAAE,GAAG,AACd,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,WAAW,4BAAC,CAAC,AACT,OAAO,CAAE,CAAC,CACV,YAAY,CAAE,CAAC,AACnB,CAAC,AACL,CAAC"}`
};
var OrderForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let townSearchResult;
  let $orderStore, $$unsubscribe_orderStore;
  $$unsubscribe_orderStore = subscribe(orderStore, (value) => $orderStore = value);
  let { inputValues = {
    townSearch: "",
    nameValue: "",
    phoneValue: "",
    commentValue: "",
    emailValue: "",
    payChoice: null,
    deliveryChoice: 0,
    sum: 0
  } } = $$props;
  let input;
  if ($$props.inputValues === void 0 && $$bindings.inputValues && inputValues !== void 0)
    $$bindings.inputValues(inputValues);
  $$result.css.add(css$c);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    set_store_value(orderStore, $orderStore = inputValues, $orderStore);
    townSearchResult = get$1(inputValues.townSearch);
    $$rendered = `<div class="${"order_form svelte-o34qea"}"><div class="${"title svelte-o34qea"}">\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u043A\u0430\u0437\u0430</div>
    <form><div class="${"order_form_item"}"><div class="${"item_title svelte-o34qea"}">\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435</div>
            <div class="${"item_block svelte-o34qea"}">${validate_component(OrderInputText, "OrderInputText").$$render($$result, {
      idVal: "names",
      pholder: "\u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u0424\u0418\u041E \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u043E\u0433\u043E \u043B\u0438\u0446\u0430",
      inpVal: inputValues.nameValue
    }, {
      inpVal: ($$value) => {
        inputValues.nameValue = $$value;
        $$settled = false;
      }
    }, {
      label: () => `<span slot="${"label"}">\u0424\u0418\u041E<span class="${"star svelte-o34qea"}">*</span></span>`
    })}</div>
            <div class="${"item_block svelte-o34qea"}">${validate_component(OrderInputText, "OrderInputText").$$render($$result, {
      pattern: true,
      idVal: "phone",
      inpVal: inputValues.phoneValue
    }, {
      inpVal: ($$value) => {
        inputValues.phoneValue = $$value;
        $$settled = false;
      }
    }, {
      label: () => `<span slot="${"label"}">\u0422\u0435\u043B\u0435\u0444\u043E\u043D<span class="${"star svelte-o34qea"}">*</span></span>`
    })}</div>
            <div class="${"item_title svelte-o34qea"}">\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430</div>
            <div class="${"item_block svelte-o34qea"}"><label for="${"names"}">\u041D\u0430\u0441\u0435\u043B\u0435\u043D\u043D\u044B\u0439 \u043F\u0443\u043D\u043A\u0442<span class="${"star svelte-o34qea"}">*</span></label>
                <input type="${"text"}" id="${"names"}" class="${"svelte-o34qea"}"${add_attribute("value", inputValues.townSearch, 0)}${add_attribute("this", input, 0)}>
                ${inputValues.townSearch ? `<span class="${"material-icons-outlined clear svelte-o34qea"}">clear</span>` : ``}
                ${function(__value) {
      if (is_promise(__value))
        return ``;
      return function(value) {
        return `
                    <ul class="${"towns_list svelte-o34qea"}">${each(value.body, (item) => `${each(item, (town, i) => `${``}`)}`)}</ul>
                `;
      }(__value);
    }(townSearchResult)}</div>

            <div class="${"item_block svelte-o34qea"}">${validate_component(OrderRadio, "OrderRadio").$$render($$result, {
      radioValue: 0,
      flag: inputValues.deliveryChoice
    }, {
      flag: ($$value) => {
        inputValues.deliveryChoice = $$value;
        $$settled = false;
      }
    }, {
      price: () => `<span slot="${"price"}">+ 0 \u0440\u0443\u0431</span>`,
      value: () => `<span slot="${"value"}">\u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 (\u043D\u0430 \u043F\u0443\u043D\u043A\u0442\u0435 \u0432\u044B\u0434\u0430\u0447\u0438)</span>`
    })}
                ${validate_component(OrderRadio, "OrderRadio").$$render($$result, {
      radioValue: 300,
      flag: inputValues.deliveryChoice
    }, {
      flag: ($$value) => {
        inputValues.deliveryChoice = $$value;
        $$settled = false;
      }
    }, {
      price: () => `<span slot="${"price"}">+ 300 \u0440\u0443\u0431</span>`,
      value: () => `<span slot="${"value"}">\u041A\u0443\u0440\u044C\u0435\u0440\u043E\u043C</span>`
    })}</div>
            <div class="${"item_block svelte-o34qea"}"><label for="${"comment"}">\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \u043A \u0437\u0430\u043A\u0430\u0437\u0443</label>
                <textarea id="${"comment"}" class="${"svelte-o34qea"}">${inputValues.commentValue || ""}</textarea></div>

            <div class="${"item_title svelte-o34qea"}">\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C</div>
            <div class="${"item_block svelte-o34qea"}">${validate_component(OrderInputText, "OrderInputText").$$render($$result, {
      idVal: "mail",
      pholder: "email \u0430\u0434\u0440\u0435\u0441",
      inpVal: inputValues.emailValue
    }, {
      inpVal: ($$value) => {
        inputValues.emailValue = $$value;
        $$settled = false;
      }
    }, {
      label: () => `<span slot="${"label"}">Email<span class="${"star svelte-o34qea"}">*</span></span>`
    })}</div>

            <div class="${"item_title svelte-o34qea"}">\u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B<span class="${"star svelte-o34qea"}">*</span></div>
            <div class="${"item_block svelte-o34qea"}">${validate_component(OrderRadio, "OrderRadio").$$render($$result, {
      radioValue: 1,
      flag: inputValues.payChoice
    }, {
      flag: ($$value) => {
        inputValues.payChoice = $$value;
        $$settled = false;
      }
    }, {
      value: () => `<span slot="${"value"}">\u041D\u0430\u043B\u0438\u0447\u043D\u044B\u043C\u0438 \u043A\u0443\u0440\u044C\u0435\u0440\u0443</span>`
    })}
                ${validate_component(OrderRadio, "OrderRadio").$$render($$result, {
      radioValue: 2,
      flag: inputValues.payChoice
    }, {
      flag: ($$value) => {
        inputValues.payChoice = $$value;
        $$settled = false;
      }
    }, {
      value: () => `<span slot="${"value"}">\u0411\u0430\u043D\u043A\u043E\u0432\u0441\u043A\u0438\u0439 \u043F\u0435\u0440\u0435\u0432\u043E\u0434</span>`
    })}</div></div>
        <button class="${"confirm_order svelte-o34qea"}">\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437</button></form>
</div>`;
  } while (!$$settled);
  $$unsubscribe_orderStore();
  return $$rendered;
});
var css$b = {
  code: ".order.svelte-1s0webo{display:flex;gap:1rem}@media(max-width: 768px){.order.svelte-1s0webo{flex-direction:column}}",
  map: `{"version":3,"file":"newOrder.svelte","sources":["newOrder.svelte"],"sourcesContent":["<script>\\r\\n    import OrderCart from \\"../components/Main/Order/OrderCart.svelte\\";\\r\\n    import OrderForm from \\"../components/Main/Order/OrderForm.svelte\\";\\r\\n    import { cartCollection, promocodeState } from '../stores/cart';\\r\\n    \\r\\n    let inputValues = {\\r\\n        townSearch: '',\\r\\n        nameValue: '',\\r\\n        phoneValue: '',\\r\\n        commentValue: '',\\r\\n        emailValue: '',\\r\\n        payChoice: null,\\r\\n        deliveryChoice: 0,\\r\\n        sum: 0,\\r\\n        promo: $promocodeState\\r\\n    }\\r\\n\\r\\n<\/script>\\r\\n\\r\\n<svelte:head>\\r\\n    <title>\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u043A\u0430\u0437\u0430</title>    \\r\\n</svelte:head>\\r\\n\\r\\n<div class=\\"container\\">\\r\\n    {#if $cartCollection.length > 0}\\r\\n        <div class=\\"order\\">\\r\\n            <OrderForm bind:inputValues={inputValues}/>\\r\\n            <OrderCart bind:deliveryCost={inputValues.deliveryChoice}/>\\r\\n        </div>\\r\\n    {:else}\\r\\n        <div class=\\"title\\">\u041D\u0435\u0447\u0435\u0433\u043E \u043E\u0444\u043E\u0440\u043C\u043B\u044F\u0442\u044C, \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u043D\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u043A\u043E\u0440\u0437\u0438\u043D\u0443 \u0442\u043E\u0432\u0430\u0440\u0430\u043C\u0438.</div>\\r\\n    {/if}\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .order {\\r\\n        display: flex;\\r\\n        gap: 1rem;\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .order {\\r\\n            flex-direction: column;\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAmCI,MAAM,eAAC,CAAC,AACJ,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,IAAI,AACb,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,MAAM,eAAC,CAAC,AACJ,cAAc,CAAE,MAAM,AAC1B,CAAC,AACL,CAAC"}`
};
var NewOrder = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $promocodeState, $$unsubscribe_promocodeState;
  let $cartCollection, $$unsubscribe_cartCollection;
  $$unsubscribe_promocodeState = subscribe(promocodeState, (value) => $promocodeState = value);
  $$unsubscribe_cartCollection = subscribe(cartCollection, (value) => $cartCollection = value);
  let inputValues = {
    townSearch: "",
    nameValue: "",
    phoneValue: "",
    commentValue: "",
    emailValue: "",
    payChoice: null,
    deliveryChoice: 0,
    sum: 0,
    promo: $promocodeState
  };
  $$result.css.add(css$b);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${$$result.head += `${$$result.title = `<title>\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u043A\u0430\u0437\u0430</title>`, ""}`, ""}

<div class="${"container"}">${$cartCollection.length > 0 ? `<div class="${"order svelte-1s0webo"}">${validate_component(OrderForm, "OrderForm").$$render($$result, { inputValues }, {
      inputValues: ($$value) => {
        inputValues = $$value;
        $$settled = false;
      }
    }, {})}
            ${validate_component(OrderCart, "OrderCart").$$render($$result, { deliveryCost: inputValues.deliveryChoice }, {
      deliveryCost: ($$value) => {
        inputValues.deliveryChoice = $$value;
        $$settled = false;
      }
    }, {})}</div>` : `<div class="${"title"}">\u041D\u0435\u0447\u0435\u0433\u043E \u043E\u0444\u043E\u0440\u043C\u043B\u044F\u0442\u044C, \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u043D\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u043A\u043E\u0440\u0437\u0438\u043D\u0443 \u0442\u043E\u0432\u0430\u0440\u0430\u043C\u0438.</div>`}
</div>`;
  } while (!$$settled);
  $$unsubscribe_promocodeState();
  $$unsubscribe_cartCollection();
  return $$rendered;
});
var newOrder = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": NewOrder
});
var Profile = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<p>this is profile</p>`;
});
var profile = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Profile
});
function paginate({ items, pageSize: pageSize2, currentPage }) {
  return items.slice((currentPage - 1) * pageSize2, (currentPage - 1) * pageSize2 + pageSize2);
}
var PREVIOUS_PAGE = "PREVIOUS_PAGE";
var NEXT_PAGE = "NEXT_PAGE";
var ELLIPSIS = "ELLIPSIS";
function generateNavigationOptions({ totalItems, pageSize: pageSize2, currentPage, limit = null, showStepOptions = false }) {
  const totalPages = Math.ceil(totalItems / pageSize2);
  const limitThreshold = getLimitThreshold({ limit });
  const limited = limit && totalPages > limitThreshold;
  let options2 = limited ? generateLimitedOptions({ totalPages, limit, currentPage }) : generateUnlimitedOptions({ totalPages });
  return showStepOptions ? addStepOptions({ options: options2, currentPage, totalPages }) : options2;
}
function generateUnlimitedOptions({ totalPages }) {
  return new Array(totalPages).fill(null).map((value, index2) => ({
    type: "number",
    value: index2 + 1
  }));
}
function generateLimitedOptions({ totalPages, limit, currentPage }) {
  const boundarySize = limit * 2 + 2;
  const firstBoundary = 1 + boundarySize;
  const lastBoundary = totalPages - boundarySize;
  const totalShownPages = firstBoundary + 2;
  if (currentPage <= firstBoundary - limit) {
    return Array(totalShownPages).fill(null).map((value, index2) => {
      if (index2 === totalShownPages - 1) {
        return {
          type: "number",
          value: totalPages
        };
      } else if (index2 === totalShownPages - 2) {
        return {
          type: "symbol",
          symbol: ELLIPSIS,
          value: firstBoundary + 1
        };
      }
      return {
        type: "number",
        value: index2 + 1
      };
    });
  } else if (currentPage >= lastBoundary + limit) {
    return Array(totalShownPages).fill(null).map((value, index2) => {
      if (index2 === 0) {
        return {
          type: "number",
          value: 1
        };
      } else if (index2 === 1) {
        return {
          type: "symbol",
          symbol: ELLIPSIS,
          value: lastBoundary - 1
        };
      }
      return {
        type: "number",
        value: lastBoundary + index2 - 2
      };
    });
  } else if (currentPage >= firstBoundary - limit && currentPage <= lastBoundary + limit) {
    return Array(totalShownPages).fill(null).map((value, index2) => {
      if (index2 === 0) {
        return {
          type: "number",
          value: 1
        };
      } else if (index2 === 1) {
        return {
          type: "symbol",
          symbol: ELLIPSIS,
          value: currentPage - limit + (index2 - 2)
        };
      } else if (index2 === totalShownPages - 1) {
        return {
          type: "number",
          value: totalPages
        };
      } else if (index2 === totalShownPages - 2) {
        return {
          type: "symbol",
          symbol: ELLIPSIS,
          value: currentPage + limit + 1
        };
      }
      return {
        type: "number",
        value: currentPage - limit + (index2 - 2)
      };
    });
  }
}
function addStepOptions({ options: options2, currentPage, totalPages }) {
  return [
    {
      type: "symbol",
      symbol: PREVIOUS_PAGE,
      value: currentPage <= 1 ? 1 : currentPage - 1
    },
    ...options2,
    {
      type: "symbol",
      symbol: NEXT_PAGE,
      value: currentPage >= totalPages ? totalPages : currentPage + 1
    }
  ];
}
function getLimitThreshold({ limit }) {
  const maximumUnlimitedPages = 3;
  const numberOfBoundaryPages = 2;
  return limit * 2 + maximumUnlimitedPages + numberOfBoundaryPages;
}
var PaginationNav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let options2;
  let totalPages;
  createEventDispatcher();
  let { totalItems = 0 } = $$props;
  let { pageSize: pageSize2 = 1 } = $$props;
  let { currentPage = 1 } = $$props;
  let { limit = null } = $$props;
  let { showStepOptions = false } = $$props;
  if ($$props.totalItems === void 0 && $$bindings.totalItems && totalItems !== void 0)
    $$bindings.totalItems(totalItems);
  if ($$props.pageSize === void 0 && $$bindings.pageSize && pageSize2 !== void 0)
    $$bindings.pageSize(pageSize2);
  if ($$props.currentPage === void 0 && $$bindings.currentPage && currentPage !== void 0)
    $$bindings.currentPage(currentPage);
  if ($$props.limit === void 0 && $$bindings.limit && limit !== void 0)
    $$bindings.limit(limit);
  if ($$props.showStepOptions === void 0 && $$bindings.showStepOptions && showStepOptions !== void 0)
    $$bindings.showStepOptions(showStepOptions);
  options2 = generateNavigationOptions({
    totalItems,
    pageSize: pageSize2,
    currentPage,
    limit,
    showStepOptions
  });
  totalPages = Math.ceil(totalItems / pageSize2);
  return `<div class="${"pagination-nav"}">${each(options2, (option) => `<span class="${[
    "option",
    (option.type === "number" ? "number" : "") + " " + (option.type === "symbol" && option.symbol === PREVIOUS_PAGE ? "prev" : "") + " " + (option.type === "symbol" && option.symbol === NEXT_PAGE ? "next" : "") + " " + (option.type === "symbol" && option.symbol === NEXT_PAGE && currentPage >= totalPages || option.type === "symbol" && option.symbol === PREVIOUS_PAGE && currentPage <= 1 ? "disabled" : "") + " " + (option.type === "symbol" && option.symbol === ELLIPSIS ? "ellipsis" : "") + " " + (option.type === "number" && option.value === currentPage ? "active" : "")
  ].join(" ").trim()}">${option.type === "number" ? `${slots.number ? slots.number({ value: option.value }) : `
          <span>${escape(option.value)}</span>
        `}` : `${option.type === "symbol" && option.symbol === ELLIPSIS ? `${slots.ellipsis ? slots.ellipsis({}) : `
          <span>...</span>
        `}` : `${option.type === "symbol" && option.symbol === PREVIOUS_PAGE ? `${slots.prev ? slots.prev({}) : `
          <svg style="${"width:24px;height:24px"}" viewBox="${"0 0 24 24"}"><path fill="${"#000000"}" d="${"M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"}"></path></svg>
        `}` : `${option.type === "symbol" && option.symbol === NEXT_PAGE ? `${slots.next ? slots.next({}) : `
          <svg style="${"width:24px;height:24px"}" viewBox="${"0 0 24 24"}"><path fill="${"#000000"}" d="${"M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"}"></path></svg>
        `}` : ``}`}`}`}
    </span>`)}</div>`;
});
var css$a = {
  code: ".light-pagination-nav.svelte-1s2mqpp .pagination-nav{display:flex;justify-content:center;background:#FFF;border-radius:3px}.light-pagination-nav.svelte-1s2mqpp .option{padding:10px;display:flex;align-items:center;justify-content:center;transition:0.2s all ease-out;user-select:none;color:hsl(200, 90%, 10%)}.light-pagination-nav.svelte-1s2mqpp .option.number,.light-pagination-nav.svelte-1s2mqpp .option.ellipsis{padding:10px 15px}.light-pagination-nav.svelte-1s2mqpp .option:hover{background:rgba(0, 0, 0, 0.1);cursor:pointer}.light-pagination-nav.svelte-1s2mqpp .option.active{color:var(--main-theme-color)}",
  map: `{"version":3,"file":"LightPaginationNav.svelte","sources":["LightPaginationNav.svelte"],"sourcesContent":["<script>\\r\\n  import PaginationNav from './PaginationNav.svelte'\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"light-pagination-nav\\">\\r\\n  <PaginationNav {...$$props} on:setPage />\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n.light-pagination-nav :global(.pagination-nav) {\\r\\n  display: flex;\\r\\n  justify-content: center;\\r\\n  background: #FFF;\\r\\n  border-radius: 3px;\\r\\n}\\r\\n.light-pagination-nav :global(.option) {\\r\\n  padding: 10px;\\r\\n  display: flex;\\r\\n  align-items: center;\\r\\n  justify-content: center;\\r\\n  transition: 0.2s all ease-out;\\r\\n  user-select: none;\\r\\n  color: hsl(200, 90%, 10%);\\r\\n}\\r\\n\\r\\n.light-pagination-nav :global(.option.number),\\r\\n.light-pagination-nav :global(.option.ellipsis) {\\r\\n  padding: 10px 15px;\\r\\n}\\r\\n.light-pagination-nav :global(.option:hover) {\\r\\n  background: rgba(0, 0, 0, 0.1);\\r\\n  cursor: pointer;\\r\\n}\\r\\n.light-pagination-nav :global(.option.active) {\\r\\n  color: var(--main-theme-color);\\r\\n}\\r\\n</style>"],"names":[],"mappings":"AASA,oCAAqB,CAAC,AAAQ,eAAe,AAAE,CAAC,AAC9C,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,UAAU,CAAE,IAAI,CAChB,aAAa,CAAE,GAAG,AACpB,CAAC,AACD,oCAAqB,CAAC,AAAQ,OAAO,AAAE,CAAC,AACtC,OAAO,CAAE,IAAI,CACb,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,UAAU,CAAE,IAAI,CAAC,GAAG,CAAC,QAAQ,CAC7B,WAAW,CAAE,IAAI,CACjB,KAAK,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AAC3B,CAAC,AAED,oCAAqB,CAAC,AAAQ,cAAc,AAAC,CAC7C,oCAAqB,CAAC,AAAQ,gBAAgB,AAAE,CAAC,AAC/C,OAAO,CAAE,IAAI,CAAC,IAAI,AACpB,CAAC,AACD,oCAAqB,CAAC,AAAQ,aAAa,AAAE,CAAC,AAC5C,UAAU,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAC9B,MAAM,CAAE,OAAO,AACjB,CAAC,AACD,oCAAqB,CAAC,AAAQ,cAAc,AAAE,CAAC,AAC7C,KAAK,CAAE,IAAI,kBAAkB,CAAC,AAChC,CAAC"}`
};
var LightPaginationNav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$a);
  return `<div class="${"light-pagination-nav svelte-1s2mqpp"}">${validate_component(PaginationNav, "PaginationNav").$$render($$result, Object.assign($$props), {}, {})}
</div>`;
});
var css$9 = {
  code: ".result_list.svelte-c6ry3p{display:grid;grid-template-columns:repeat(auto-fill, minmax(180px, 1fr));gap:30px 50px;height:min-content;grid-area:content;margin-bottom:1rem}.title.svelte-c6ry3p{font-size:1.5rem;font-weight:500;margin:1rem 0}",
  map: `{"version":3,"file":"[query].svelte","sources":["[query].svelte"],"sourcesContent":["<script context=\\"module\\">\\r\\n    export async function load(ctx) {\\r\\n        let query = ctx.page.params.query;\\r\\n        return { props: { query }}\\r\\n    }\\r\\n<\/script>\\r\\n\\r\\n<script>\\r\\n    export let query;\\r\\n    import Model from '../../model/data-service';\\r\\n    import { beforeUpdate } from 'svelte';\\r\\n    import GoodItemView from '../../components/Main/Good/GoodItemView.svelte';\\r\\n    import {paginate, LightPaginationNav} from '../../components/Main/Pagination';\\r\\n\\r\\n    const temp = new Model();\\r\\n    let searchResultsData = temp.searchResults(query);\\r\\n\\r\\n    let items = [];\\r\\n    let currentPage = 1;\\r\\n    let pageSize = 10;\\r\\n\\r\\n    beforeUpdate(async() => {\\r\\n        searchResultsData = await temp.searchResults(query);\\r\\n        items = searchResultsData;\\r\\n    });\\r\\n\\r\\n    $: paginatedItems = paginate({items, pageSize, currentPage})\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"container\\">\\r\\n    <div class=\\"title\\">\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u043F\u043E\u0438\u0441\u043A\u0430</div>\\r\\n    {#await items then _}\\r\\n        <ul class=\\"result_list\\">\\r\\n            {#each paginatedItems as item (item.name)}\\r\\n                <div>\\r\\n                    <GoodItemView {...item}/>\\r\\n                </div>\\r\\n            {/each}\\r\\n        </ul>\\r\\n    {/await}\\r\\n\\r\\n    {#await searchResultsData then value}\\r\\n        {#if value.length > 10}\\r\\n            <LightPaginationNav\\r\\n                totalItems=\\"{value.length}\\"\\r\\n                pageSize=\\"{pageSize}\\"\\r\\n                currentPage=\\"{currentPage}\\"\\r\\n                limit=\\"{1}\\"\\r\\n                showStepOptions=\\"{true}\\"\\r\\n                on:setPage=\\"{(e) => currentPage = e.detail.page}\\"\\r\\n            />\\r\\n        {/if}\\r\\n    {/await}\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .result_list {\\r\\n        display: grid;\\r\\n        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));\\r\\n        gap: 30px 50px;\\r\\n        height: min-content;\\r\\n        grid-area: content;\\r\\n        margin-bottom: 1rem;\\r\\n    }\\r\\n\\r\\n    .title {\\r\\n        font-size: 1.5rem;\\r\\n        font-weight: 500;\\r\\n        margin: 1rem 0;\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAwDI,YAAY,cAAC,CAAC,AACV,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,OAAO,SAAS,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,GAAG,CAAC,CAAC,CAC5D,GAAG,CAAE,IAAI,CAAC,IAAI,CACd,MAAM,CAAE,WAAW,CACnB,SAAS,CAAE,OAAO,CAClB,aAAa,CAAE,IAAI,AACvB,CAAC,AAED,MAAM,cAAC,CAAC,AACJ,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,MAAM,CAAE,IAAI,CAAC,CAAC,AAClB,CAAC"}`
};
async function load$1(ctx) {
  let query = ctx.page.params.query;
  return { props: { query } };
}
var pageSize = 10;
var U5Bqueryu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let paginatedItems;
  let { query } = $$props;
  const temp = new Model();
  let searchResultsData = temp.searchResults(query);
  let items = [];
  let currentPage = 1;
  if ($$props.query === void 0 && $$bindings.query && query !== void 0)
    $$bindings.query(query);
  $$result.css.add(css$9);
  paginatedItems = paginate({ items, pageSize, currentPage });
  return `<div class="${"container"}"><div class="${"title svelte-c6ry3p"}">\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u043F\u043E\u0438\u0441\u043A\u0430</div>
    ${function(__value) {
    if (is_promise(__value))
      return ``;
    return function(_) {
      return `
        <ul class="${"result_list svelte-c6ry3p"}">${each(paginatedItems, (item) => `<div>${validate_component(GoodItemView, "GoodItemView").$$render($$result, Object.assign(item), {}, {})}
                </div>`)}</ul>
    `;
    }();
  }(items)}

    ${function(__value) {
    if (is_promise(__value))
      return ``;
    return function(value) {
      return `
        ${value.length > 10 ? `${validate_component(LightPaginationNav, "LightPaginationNav").$$render($$result, {
        totalItems: value.length,
        pageSize,
        currentPage,
        limit: 1,
        showStepOptions: true
      }, {}, {})}` : ``}
    `;
    }(__value);
  }(searchResultsData)}
</div>`;
});
var _query_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bqueryu5D,
  load: load$1
});
var css$8 = {
  code: '.old_price.svelte-5erbxc.svelte-5erbxc{color:var(--main-descr-color);display:flex;align-items:center}.old_price.svelte-5erbxc .val.svelte-5erbxc{text-decoration:line-through;margin-left:0.5rem}.old_price.svelte-5erbxc .material-icons-outlined.svelte-5erbxc{font-size:1rem;margin-right:0.5rem;color:var(--main-theme-color)}.approved.svelte-5erbxc.svelte-5erbxc{display:flex;align-items:center;color:var(--positive-color)\r\n    }.form_container.svelte-5erbxc.svelte-5erbxc{display:flex;flex-direction:column;width:100%;position:relative}.err.svelte-5erbxc.svelte-5erbxc{position:absolute;bottom:100%;left:0;color:red;font-size:0.8rem}.submit_code_btn.svelte-5erbxc.svelte-5erbxc{background:var(--main-theme-color);color:var(--main-bg-color);border:0;display:flex;align-items:center;justify-content:center;padding:0.3rem 1rem}.promo_inp.svelte-5erbxc.svelte-5erbxc{flex-grow:1;padding:6px 10px;height:50px;border:1px solid var(--main-border-color);border-right:none;box-shadow:none;font-family:var(--font);font-size:1rem;width:auto;transition:.2s}.make_order.svelte-5erbxc.svelte-5erbxc{display:flex}.make_order.svelte-5erbxc a.svelte-5erbxc{background:var(--main-theme-color);color:var(--main-bg-color);width:100%;border:0;text-align:center;font:500 1rem var(--font);padding:1rem}.cart_controls_box.svelte-5erbxc.svelte-5erbxc{position:relative}.sum_all_items.svelte-5erbxc.svelte-5erbxc{margin-top:1rem}.sum_all_items.svelte-5erbxc .val.svelte-5erbxc{font-size:1.5rem;font-weight:500}.same_as_link.svelte-5erbxc.svelte-5erbxc{background:transparent;border:0;color:var(--main-theme-color);font-size:0.9rem}.cart_controls.svelte-5erbxc.svelte-5erbxc{background:var(--gray-hover-color);padding:1.5rem;font-family:var(--font)}.cart_controls.svelte-5erbxc .title.svelte-5erbxc{margin-top:0}.controls_wrap.svelte-5erbxc.svelte-5erbxc{position:sticky;top:0}.empty.svelte-5erbxc a.svelte-5erbxc{color:var(--main-theme-color)}.item_delete_option.svelte-5erbxc.svelte-5erbxc{display:flex;white-space:nowrap;color:var(--main-descr-color);cursor:pointer;gap:0.5rem\r\n    }.item_delete_option.svelte-5erbxc.svelte-5erbxc:hover{color:var(--main-theme-color)}.title.svelte-5erbxc.svelte-5erbxc{font-size:1.5rem;font-weight:500;margin:1rem 0}.cart.svelte-5erbxc.svelte-5erbxc{display:grid;grid-auto-columns:6fr 2fr;grid-auto-rows:max-content auto;grid-template-areas:"items controls" "items controls";gap:2rem 2.5rem}.cart_item.svelte-5erbxc.svelte-5erbxc{display:grid;grid-auto-columns:150px min-content auto min-content;grid-template-areas:"image title title total"\r\n            "image delete . counter" \r\n            "image . . .";gap:1rem;padding:1rem 0}.cart_item.svelte-5erbxc.svelte-5erbxc:not(:last-child){border-bottom:1px solid var(--main-border-color)}.item_img.svelte-5erbxc.svelte-5erbxc{width:150px;height:150px;grid-area:image}.item_title.svelte-5erbxc.svelte-5erbxc{grid-area:title;font-size:1.5rem;color:var(--main-text-color);font-weight:500}.item_total.svelte-5erbxc.svelte-5erbxc{grid-area:total;white-space:nowrap;font-size:1.5rem;font-weight:500}.item_delete.svelte-5erbxc.svelte-5erbxc{display:flex;grid-area:delete;gap:1rem}.item_counter.svelte-5erbxc.svelte-5erbxc{grid-area:counter;display:flex;justify-self:end;border:1px solid var(--main-border-color)}.item_counter.svelte-5erbxc button.svelte-5erbxc{border:0;background:var(--transparent-color);font-size:0.9rem;width:40px;color:var(--main-text-color);display:flex;align-items:center;justify-content:center}.item_counter.svelte-5erbxc button.svelte-5erbxc:hover{background:var(--gray-hover-color)}.item_counter.svelte-5erbxc input.svelte-5erbxc{width:3rem;padding:0.5rem;border:0;text-align:center;font-size:1rem}.item_img.svelte-5erbxc img.svelte-5erbxc{object-fit:contain;width:100%;height:auto}@media(max-width: 992px){.cart.svelte-5erbxc.svelte-5erbxc{grid-template-areas:"items" "controls"}.item_title.svelte-5erbxc.svelte-5erbxc{font-size:1rem;font-weight:normal}.cart_item.svelte-5erbxc.svelte-5erbxc{grid-auto-columns:100px min-content auto min-content;grid-template-areas:"image title title total"\r\n                "image delete . counter" \r\n                "image . . ."}.item_img.svelte-5erbxc.svelte-5erbxc{width:100px;height:100px;grid-area:image}}@media(max-width: 768px){.cart_item.svelte-5erbxc.svelte-5erbxc{grid-auto-columns:100px min-content auto min-content;grid-template-areas:"image title title title"\r\n                "image delete delete delete" \r\n                "counter counter total total"}}',
  map: `{"version":3,"file":"cart.svelte","sources":["cart.svelte"],"sourcesContent":["<script>\\r\\n    import { flip } from 'svelte/animate';\\r\\n    import { onlyDigits } from '../presenter/present-service';\\r\\n    import { cartCollection, promocodeState } from '../stores/cart';\\r\\n\\r\\n    function cartItemRemove(idx) {\\r\\n        $cartCollection.splice(idx, 1);\\r\\n        $cartCollection = $cartCollection;\\r\\n    };\\r\\n\\r\\n    let promoObj = {\\r\\n        promocode: false,\\r\\n        promoCodeValidate: false,\\r\\n        promoValue: ''\\r\\n    }\\r\\n\\r\\n    $: cartCollectionCounter = () => {\\r\\n        let sum;\\r\\n        if($cartCollection.length > 0) {\\r\\n            sum = $cartCollection.reduce((acc, el) => acc + parseFloat(el.cartCounter), 0);\\r\\n        }\\r\\n        return sum;\\r\\n    };\\r\\n\\r\\n    function approveCode() {\\r\\n        promoObj.promoValue === \\"123\\" ? $promocodeState = true : $promocodeState = false;\\r\\n\\r\\n        if(promoObj.promoValue === \\"123\\") {\\r\\n            $promocodeState = true;\\r\\n        } else {\\r\\n            $promocodeState = false;\\r\\n            promoObj.promoCodeValidate = true;\\r\\n        }\\r\\n    }\\r\\n\\r\\n    $: sumAllItemsPrice = () => {\\r\\n        let sum = 0;\\r\\n        $cartCollection.forEach(el => {\\r\\n            sum += el.elem.price * el.cartCounter;\\r\\n        });\\r\\n\\r\\n        if($promocodeState) {\\r\\n            promoObj.promocode = false;\\r\\n            return Math.ceil(sum * 0.9);\\r\\n        }\\r\\n\\r\\n        return sum;\\r\\n    };\\r\\n\\r\\n    $: oldSumAllItemsPrice = () => {\\r\\n        let sum = 0;\\r\\n        $cartCollection.forEach(el => {\\r\\n            sum += el.elem.price * el.cartCounter;\\r\\n        });\\r\\n        return (sum);\\r\\n    }\\r\\n<\/script>\\r\\n\\r\\n<svelte:head>\\r\\n    <title>\u041A\u043E\u0440\u0437\u0438\u043D\u0430</title>\\r\\n</svelte:head>\\r\\n\\r\\n<div class=\\"container\\">\\r\\n    <div class=\\"title\\">\u041A\u043E\u0440\u0437\u0438\u043D\u0430</div>\\r\\n    <div class=\\"cart\\">\\r\\n\\r\\n        <div class=\\"cart_area\\">\\r\\n            <ul class=\\"cart_list\\">\\r\\n                {#each $cartCollection as item, idx (item.elem.name)}\\r\\n                    <li class=\\"cart_item\\" animate:flip={{duration: 200}}>\\r\\n                        <div class=\\"item_img\\">\\r\\n                            <img src=\\"{item.elem.imgSet[0]}\\" alt=\\"{item.elem.name}\\">\\r\\n                        </div>\\r\\n                        <a href=\\"/{item.categoryId}/goodItems/{item.elem.id}\\" class=\\"item_title\\">{item.elem.name}</a>\\r\\n                        <div class=\\"item_total\\">{item.elem.price * item.cartCounter} \u0440\u0443\u0431</div>\\r\\n                        <div class=\\"item_delete\\">\\r\\n                            <div class=\\"item_delete_option\\" on:click={() => cartItemRemove(idx)}>\\r\\n                                <span class=\\"material-icons-outlined\\">delete</span>\\r\\n                                <span class=\\"option_text\\">\u0443\u0434\u0430\u043B\u0438\u0442\u044C</span>\\r\\n                            </div>\\r\\n                        </div>\\r\\n                        <div class=\\"item_counter\\">\\r\\n                            <button \\r\\n                                on:click={() => item.cartCounter <= 1 ? item.cartCounter = 1 : --item.cartCounter}\\r\\n                                ><span class=\\"material-icons-outlined\\">remove</span></button>\\r\\n                            <input type=\\"text\\" use:onlyDigits bind:value={item.cartCounter} >\\r\\n                            <button on:click={() => item.cartCounter++}>\\r\\n                                <span class=\\"material-icons-outlined\\">add</span>\\r\\n                            </button>\\r\\n                        </div>\\r\\n                    </li>\\r\\n                {:else}\\r\\n                    <li class=\\"empty\\">\u041A\u043E\u0440\u0437\u0438\u043D\u0430 \u043F\u0443\u0441\u0442\u0430.\\r\\n                        <a href=\\"/\\">\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u043E\u0432\u0430\u0440</a>\\r\\n                    </li>\\r\\n                {/each}\\r\\n            </ul>\\r\\n        </div>\\r\\n        <div class=\\"cart_controls_box\\">\\r\\n            {#if $cartCollection.length > 0}\\r\\n                <div class=\\"controls_wrap\\">\\r\\n                    <div class=\\"cart_controls\\">\\r\\n                        <div class=\\"title\\">\u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0435 {cartCollectionCounter()} \u0448\u0442.</div>\\r\\n                        {#if promoObj.promocode}\\r\\n                            <form class=\\"promocode_form\\" on:submit|preventDefault={approveCode(promoObj.promoValue)}>\\r\\n                                <div class=\\"form_container\\">\\r\\n                                    <input type=\\"text\\" class=\\"promo_inp\\" placeholder=\\"\u0434\u043B\u044F \u0442\u0435\u0441\u0442\u0430 123\\" bind:value={promoObj.promoValue}>\\r\\n                                    {#if promoObj.promoCodeValidate}\\r\\n                                        <span class=\\"err\\">\u0422\u0430\u043A\u043E\u0433\u043E \u043A\u0443\u043F\u043E\u043D\u0430 \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442</span>\\r\\n                                    {/if}\\r\\n                                    <button class=\\"submit_code_btn\\">\\r\\n                                        <span class=\\"material-icons-outlined\\">upload</span>\\r\\n                                    </button>\\r\\n                                </div>\\r\\n                            </form>\\r\\n                        {/if}\\r\\n                        {#if !promoObj.promocode && !$promocodeState}\\r\\n                            <button class=\\"same_as_link\\"\\r\\n                                on:click={() => promoObj.promocode = !promoObj.promocode}\\r\\n                                >{promoObj.promocode ? \\"\u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434\\" : \\"\u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434\\"}\\r\\n                            </button>\\r\\n                        {/if}\\r\\n                        {#if $promocodeState}\\r\\n                            <div class=\\"approved\\">\u041F\u0440\u043E\u043C\u043E\u043A\u043E\u0434 \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D\\r\\n                                <span class=\\"material-icons-outlined\\">done</span>\\r\\n                            </div>\\r\\n                            <span class=\\"old_price\\">\\r\\n                                <span class=\\"material-icons-outlined\\">local_offer</span>\\r\\n                                (10%): \\r\\n                                <span class=\\"val\\">\\r\\n                                    { oldSumAllItemsPrice() }\\r\\n                                </span>\\r\\n                            </span>\\r\\n                        {/if}\\r\\n                        <div class=\\"sum_all_items\\">\\r\\n                            <span>\u0438\u0442\u043E\u0433\u043E:</span>\\r\\n                            <span class=\\"val\\">{ sumAllItemsPrice() } \u0440\u0443\u0431</span>\\r\\n                        </div>\\r\\n                    </div>\\r\\n                    <div class=\\"make_order\\">\\r\\n                        <a href=\\"/newOrder\\">\u041E\u0444\u043E\u0440\u043C\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437</a>\\r\\n                    </div>\\r\\n                </div>\\r\\n            {/if}\\r\\n        </div>\\r\\n    </div>\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .old_price {\\r\\n        color: var(--main-descr-color);\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n    }\\r\\n    .old_price .val {\\r\\n        text-decoration: line-through;\\r\\n        margin-left: 0.5rem;\\r\\n    }\\r\\n\\r\\n    .old_price .material-icons-outlined {\\r\\n        font-size: 1rem;\\r\\n        margin-right: 0.5rem;\\r\\n        color: var(--main-theme-color);\\r\\n    }\\r\\n\\r\\n    .approved {\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        color: var(--positive-color)\\r\\n    }\\r\\n\\r\\n    .form_container {\\r\\n        display: flex;\\r\\n        flex-direction: column;\\r\\n        width: 100%;\\r\\n        position: relative;\\r\\n    }\\r\\n\\r\\n    .err {\\r\\n        position: absolute;\\r\\n        bottom: 100%;\\r\\n        left: 0;\\r\\n        color: red;\\r\\n        font-size: 0.8rem;\\r\\n    }\\r\\n\\r\\n    .submit_code_btn {\\r\\n        background: var(--main-theme-color);\\r\\n        color: var(--main-bg-color);\\r\\n        border: 0;\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: center;\\r\\n        padding: 0.3rem 1rem;\\r\\n    }\\r\\n    .promo_inp {\\r\\n        flex-grow: 1;\\r\\n        padding: 6px 10px;\\r\\n        height: 50px;\\r\\n        border: 1px solid var(--main-border-color);\\r\\n        border-right: none;\\r\\n        box-shadow: none;\\r\\n        font-family: var(--font);\\r\\n        font-size: 1rem;\\r\\n        width: auto;\\r\\n        transition: .2s;\\r\\n    }\\r\\n    \\r\\n    .make_order {\\r\\n        display: flex;\\r\\n    }\\r\\n    .make_order a{\\r\\n        background: var(--main-theme-color);\\r\\n        color: var(--main-bg-color);\\r\\n        width: 100%;\\r\\n        border: 0;\\r\\n        text-align: center;\\r\\n        font: 500 1rem var(--font);\\r\\n        padding: 1rem;\\r\\n    }\\r\\n\\r\\n    .cart_controls_box {\\r\\n        position: relative;\\r\\n    }\\r\\n\\r\\n    .sum_all_items {\\r\\n        margin-top: 1rem;\\r\\n    }\\r\\n\\r\\n    .sum_all_items .val{\\r\\n        font-size: 1.5rem;\\r\\n        font-weight: 500;\\r\\n    }\\r\\n\\r\\n    .same_as_link {\\r\\n        background: transparent;\\r\\n        border: 0;\\r\\n        color: var(--main-theme-color);\\r\\n        font-size: 0.9rem;\\r\\n    }\\r\\n\\r\\n    .cart_controls {\\r\\n        background: var(--gray-hover-color);\\r\\n        padding: 1.5rem;\\r\\n        font-family: var(--font);\\r\\n    }\\r\\n\\r\\n    .cart_controls .title {\\r\\n        margin-top: 0;\\r\\n    }\\r\\n\\r\\n    .controls_wrap {\\r\\n        position: sticky;\\r\\n        top: 0;\\r\\n    }\\r\\n\\r\\n    .empty a {\\r\\n        color: var(--main-theme-color);\\r\\n    }\\r\\n\\r\\n    .item_delete_option {\\r\\n        display: flex;\\r\\n        white-space: nowrap;\\r\\n        color: var(--main-descr-color);\\r\\n        cursor: pointer;\\r\\n        gap: 0.5rem\\r\\n    }\\r\\n\\r\\n    .item_delete_option:hover {\\r\\n        color: var(--main-theme-color);\\r\\n    }\\r\\n\\r\\n    .title {\\r\\n        font-size: 1.5rem;\\r\\n        font-weight: 500;\\r\\n        margin: 1rem 0;\\r\\n    }\\r\\n\\r\\n    .cart {\\r\\n        display: grid;\\r\\n        grid-auto-columns: 6fr 2fr;\\r\\n        grid-auto-rows: max-content auto;\\r\\n        grid-template-areas: \\"items controls\\" \\"items controls\\";\\r\\n        gap: 2rem 2.5rem;\\r\\n    }\\r\\n\\r\\n    .cart_item {\\r\\n        display: grid;\\r\\n        grid-auto-columns: 150px min-content auto min-content;\\r\\n        grid-template-areas: \\r\\n            \\"image title title total\\"\\r\\n            \\"image delete . counter\\" \\r\\n            \\"image . . .\\";\\r\\n        gap: 1rem;\\r\\n        padding: 1rem 0;\\r\\n    }\\r\\n\\r\\n    .cart_item:not(:last-child) {\\r\\n        border-bottom: 1px solid var(--main-border-color);\\r\\n    }\\r\\n\\r\\n    .item_img {\\r\\n        width: 150px;\\r\\n        height: 150px;\\r\\n        grid-area: image;\\r\\n    }\\r\\n\\r\\n    .item_title {\\r\\n        grid-area: title;\\r\\n        font-size: 1.5rem;\\r\\n        color: var(--main-text-color);\\r\\n        font-weight: 500;\\r\\n    }\\r\\n\\r\\n    .item_total {\\r\\n        grid-area: total;\\r\\n        white-space: nowrap;\\r\\n        font-size: 1.5rem;\\r\\n        font-weight: 500;\\r\\n    }\\r\\n\\r\\n    .item_delete {\\r\\n        display: flex;\\r\\n        grid-area: delete;\\r\\n        gap: 1rem;\\r\\n    }\\r\\n\\r\\n    .item_counter {\\r\\n        grid-area: counter;\\r\\n        display: flex;\\r\\n        justify-self: end;\\r\\n        border: 1px solid var(--main-border-color);\\r\\n    }\\r\\n\\r\\n    .item_counter button {\\r\\n        border: 0;\\r\\n        background: var(--transparent-color);\\r\\n        font-size: 0.9rem;\\r\\n        width: 40px;\\r\\n        color: var(--main-text-color);\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: center;\\r\\n    }\\r\\n\\r\\n    .item_counter button:hover {\\r\\n        background: var(--gray-hover-color);\\r\\n    }\\r\\n    .item_counter input {\\r\\n        width: 3rem;\\r\\n        padding: 0.5rem;\\r\\n        border: 0;\\r\\n        text-align: center;\\r\\n        font-size: 1rem;\\r\\n    }\\r\\n\\r\\n    .item_img img {\\r\\n        object-fit: contain;\\r\\n        width: 100%;\\r\\n        height: auto;\\r\\n    }\\r\\n\\r\\n    @media (max-width: 992px) {\\r\\n        .cart {\\r\\n            grid-template-areas: \\"items\\" \\"controls\\";\\r\\n        }\\r\\n        \\r\\n        .item_title {\\r\\n            font-size: 1rem;\\r\\n            font-weight: normal;\\r\\n        }\\r\\n\\r\\n        .item_total {\\r\\n            /* font-size: 1rem; */\\r\\n        }\\r\\n\\r\\n        .cart_item {\\r\\n            grid-auto-columns: 100px min-content auto min-content;\\r\\n            grid-template-areas: \\r\\n                \\"image title title total\\"\\r\\n                \\"image delete . counter\\" \\r\\n                \\"image . . .\\";\\r\\n        }\\r\\n\\r\\n        .item_img {\\r\\n            width: 100px;\\r\\n            height: 100px;\\r\\n            grid-area: image;\\r\\n        }\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .cart_item {\\r\\n            grid-auto-columns: 100px min-content auto min-content;\\r\\n            grid-template-areas: \\r\\n                \\"image title title title\\"\\r\\n                \\"image delete delete delete\\" \\r\\n                \\"counter counter total total\\";\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAqJI,UAAU,4BAAC,CAAC,AACR,KAAK,CAAE,IAAI,kBAAkB,CAAC,CAC9B,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,AACvB,CAAC,AACD,wBAAU,CAAC,IAAI,cAAC,CAAC,AACb,eAAe,CAAE,YAAY,CAC7B,WAAW,CAAE,MAAM,AACvB,CAAC,AAED,wBAAU,CAAC,wBAAwB,cAAC,CAAC,AACjC,SAAS,CAAE,IAAI,CACf,YAAY,CAAE,MAAM,CACpB,KAAK,CAAE,IAAI,kBAAkB,CAAC,AAClC,CAAC,AAED,SAAS,4BAAC,CAAC,AACP,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,IAAI,gBAAgB,CAAC;IAChC,CAAC,AAED,eAAe,4BAAC,CAAC,AACb,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,KAAK,CAAE,IAAI,CACX,QAAQ,CAAE,QAAQ,AACtB,CAAC,AAED,IAAI,4BAAC,CAAC,AACF,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,IAAI,CACZ,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,GAAG,CACV,SAAS,CAAE,MAAM,AACrB,CAAC,AAED,gBAAgB,4BAAC,CAAC,AACd,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,KAAK,CAAE,IAAI,eAAe,CAAC,CAC3B,MAAM,CAAE,CAAC,CACT,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,OAAO,CAAE,MAAM,CAAC,IAAI,AACxB,CAAC,AACD,UAAU,4BAAC,CAAC,AACR,SAAS,CAAE,CAAC,CACZ,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAC1C,YAAY,CAAE,IAAI,CAClB,UAAU,CAAE,IAAI,CAChB,WAAW,CAAE,IAAI,MAAM,CAAC,CACxB,SAAS,CAAE,IAAI,CACf,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,GAAG,AACnB,CAAC,AAED,WAAW,4BAAC,CAAC,AACT,OAAO,CAAE,IAAI,AACjB,CAAC,AACD,yBAAW,CAAC,eAAC,CAAC,AACV,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,KAAK,CAAE,IAAI,eAAe,CAAC,CAC3B,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,CAAC,CACT,UAAU,CAAE,MAAM,CAClB,IAAI,CAAE,GAAG,CAAC,IAAI,CAAC,IAAI,MAAM,CAAC,CAC1B,OAAO,CAAE,IAAI,AACjB,CAAC,AAED,kBAAkB,4BAAC,CAAC,AAChB,QAAQ,CAAE,QAAQ,AACtB,CAAC,AAED,cAAc,4BAAC,CAAC,AACZ,UAAU,CAAE,IAAI,AACpB,CAAC,AAED,4BAAc,CAAC,kBAAI,CAAC,AAChB,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,AACpB,CAAC,AAED,aAAa,4BAAC,CAAC,AACX,UAAU,CAAE,WAAW,CACvB,MAAM,CAAE,CAAC,CACT,KAAK,CAAE,IAAI,kBAAkB,CAAC,CAC9B,SAAS,CAAE,MAAM,AACrB,CAAC,AAED,cAAc,4BAAC,CAAC,AACZ,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,OAAO,CAAE,MAAM,CACf,WAAW,CAAE,IAAI,MAAM,CAAC,AAC5B,CAAC,AAED,4BAAc,CAAC,MAAM,cAAC,CAAC,AACnB,UAAU,CAAE,CAAC,AACjB,CAAC,AAED,cAAc,4BAAC,CAAC,AACZ,QAAQ,CAAE,MAAM,CAChB,GAAG,CAAE,CAAC,AACV,CAAC,AAED,oBAAM,CAAC,CAAC,cAAC,CAAC,AACN,KAAK,CAAE,IAAI,kBAAkB,CAAC,AAClC,CAAC,AAED,mBAAmB,4BAAC,CAAC,AACjB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,IAAI,kBAAkB,CAAC,CAC9B,MAAM,CAAE,OAAO,CACf,GAAG,CAAE,MAAM;IACf,CAAC,AAED,+CAAmB,MAAM,AAAC,CAAC,AACvB,KAAK,CAAE,IAAI,kBAAkB,CAAC,AAClC,CAAC,AAED,MAAM,4BAAC,CAAC,AACJ,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,MAAM,CAAE,IAAI,CAAC,CAAC,AAClB,CAAC,AAED,KAAK,4BAAC,CAAC,AACH,OAAO,CAAE,IAAI,CACb,iBAAiB,CAAE,GAAG,CAAC,GAAG,CAC1B,cAAc,CAAE,WAAW,CAAC,IAAI,CAChC,mBAAmB,CAAE,gBAAgB,CAAC,gBAAgB,CACtD,GAAG,CAAE,IAAI,CAAC,MAAM,AACpB,CAAC,AAED,UAAU,4BAAC,CAAC,AACR,OAAO,CAAE,IAAI,CACb,iBAAiB,CAAE,KAAK,CAAC,WAAW,CAAC,IAAI,CAAC,WAAW,CACrD,mBAAmB,CACf,yBAAyB;YACzB,wBAAwB;YACxB,aAAa,CACjB,GAAG,CAAE,IAAI,CACT,OAAO,CAAE,IAAI,CAAC,CAAC,AACnB,CAAC,AAED,sCAAU,KAAK,WAAW,CAAC,AAAC,CAAC,AACzB,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,AACrD,CAAC,AAED,SAAS,4BAAC,CAAC,AACP,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,KAAK,CACb,SAAS,CAAE,KAAK,AACpB,CAAC,AAED,WAAW,4BAAC,CAAC,AACT,SAAS,CAAE,KAAK,CAChB,SAAS,CAAE,MAAM,CACjB,KAAK,CAAE,IAAI,iBAAiB,CAAC,CAC7B,WAAW,CAAE,GAAG,AACpB,CAAC,AAED,WAAW,4BAAC,CAAC,AACT,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,AACpB,CAAC,AAED,YAAY,4BAAC,CAAC,AACV,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,MAAM,CACjB,GAAG,CAAE,IAAI,AACb,CAAC,AAED,aAAa,4BAAC,CAAC,AACX,SAAS,CAAE,OAAO,CAClB,OAAO,CAAE,IAAI,CACb,YAAY,CAAE,GAAG,CACjB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,AAC9C,CAAC,AAED,2BAAa,CAAC,MAAM,cAAC,CAAC,AAClB,MAAM,CAAE,CAAC,CACT,UAAU,CAAE,IAAI,mBAAmB,CAAC,CACpC,SAAS,CAAE,MAAM,CACjB,KAAK,CAAE,IAAI,CACX,KAAK,CAAE,IAAI,iBAAiB,CAAC,CAC7B,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,AAC3B,CAAC,AAED,2BAAa,CAAC,oBAAM,MAAM,AAAC,CAAC,AACxB,UAAU,CAAE,IAAI,kBAAkB,CAAC,AACvC,CAAC,AACD,2BAAa,CAAC,KAAK,cAAC,CAAC,AACjB,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,MAAM,CACf,MAAM,CAAE,CAAC,CACT,UAAU,CAAE,MAAM,CAClB,SAAS,CAAE,IAAI,AACnB,CAAC,AAED,uBAAS,CAAC,GAAG,cAAC,CAAC,AACX,UAAU,CAAE,OAAO,CACnB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,AAChB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,KAAK,4BAAC,CAAC,AACH,mBAAmB,CAAE,OAAO,CAAC,UAAU,AAC3C,CAAC,AAED,WAAW,4BAAC,CAAC,AACT,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,MAAM,AACvB,CAAC,AAMD,UAAU,4BAAC,CAAC,AACR,iBAAiB,CAAE,KAAK,CAAC,WAAW,CAAC,IAAI,CAAC,WAAW,CACrD,mBAAmB,CACf,yBAAyB;gBACzB,wBAAwB;gBACxB,aAAa,AACrB,CAAC,AAED,SAAS,4BAAC,CAAC,AACP,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,KAAK,CACb,SAAS,CAAE,KAAK,AACpB,CAAC,AACL,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,UAAU,4BAAC,CAAC,AACR,iBAAiB,CAAE,KAAK,CAAC,WAAW,CAAC,IAAI,CAAC,WAAW,CACrD,mBAAmB,CACf,yBAAyB;gBACzB,4BAA4B;gBAC5B,6BAA6B,AACrC,CAAC,AACL,CAAC"}`
};
var Cart = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cartCollectionCounter;
  let sumAllItemsPrice;
  let oldSumAllItemsPrice;
  let $cartCollection, $$unsubscribe_cartCollection;
  let $promocodeState, $$unsubscribe_promocodeState;
  $$unsubscribe_cartCollection = subscribe(cartCollection, (value) => $cartCollection = value);
  $$unsubscribe_promocodeState = subscribe(promocodeState, (value) => $promocodeState = value);
  let promoObj = {
    promocode: false,
    promoCodeValidate: false,
    promoValue: ""
  };
  $$result.css.add(css$8);
  cartCollectionCounter = () => {
    let sum;
    if ($cartCollection.length > 0) {
      sum = $cartCollection.reduce((acc, el) => acc + parseFloat(el.cartCounter), 0);
    }
    return sum;
  };
  sumAllItemsPrice = () => {
    let sum = 0;
    $cartCollection.forEach((el) => {
      sum += el.elem.price * el.cartCounter;
    });
    if ($promocodeState) {
      promoObj.promocode = false;
      return Math.ceil(sum * 0.9);
    }
    return sum;
  };
  oldSumAllItemsPrice = () => {
    let sum = 0;
    $cartCollection.forEach((el) => {
      sum += el.elem.price * el.cartCounter;
    });
    return sum;
  };
  $$unsubscribe_cartCollection();
  $$unsubscribe_promocodeState();
  return `${$$result.head += `${$$result.title = `<title>\u041A\u043E\u0440\u0437\u0438\u043D\u0430</title>`, ""}`, ""}

<div class="${"container"}"><div class="${"title svelte-5erbxc"}">\u041A\u043E\u0440\u0437\u0438\u043D\u0430</div>
    <div class="${"cart svelte-5erbxc"}"><div class="${"cart_area"}"><ul class="${"cart_list"}">${$cartCollection.length ? each($cartCollection, (item, idx) => `<li class="${"cart_item svelte-5erbxc"}"><div class="${"item_img svelte-5erbxc"}"><img${add_attribute("src", item.elem.imgSet[0], 0)}${add_attribute("alt", item.elem.name, 0)} class="${"svelte-5erbxc"}"></div>
                        <a href="${"/" + escape(item.categoryId) + "/goodItems/" + escape(item.elem.id)}" class="${"item_title svelte-5erbxc"}">${escape(item.elem.name)}</a>
                        <div class="${"item_total svelte-5erbxc"}">${escape(item.elem.price * item.cartCounter)} \u0440\u0443\u0431</div>
                        <div class="${"item_delete svelte-5erbxc"}"><div class="${"item_delete_option svelte-5erbxc"}"><span class="${"material-icons-outlined"}">delete</span>
                                <span class="${"option_text"}">\u0443\u0434\u0430\u043B\u0438\u0442\u044C</span>
                            </div></div>
                        <div class="${"item_counter svelte-5erbxc"}"><button class="${"svelte-5erbxc"}"><span class="${"material-icons-outlined"}">remove</span></button>
                            <input type="${"text"}" class="${"svelte-5erbxc"}"${add_attribute("value", item.cartCounter, 0)}>
                            <button class="${"svelte-5erbxc"}"><span class="${"material-icons-outlined"}">add</span>
                            </button></div>
                    </li>`) : `<li class="${"empty svelte-5erbxc"}">\u041A\u043E\u0440\u0437\u0438\u043D\u0430 \u043F\u0443\u0441\u0442\u0430.
                        <a href="${"/"}" class="${"svelte-5erbxc"}">\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u043E\u0432\u0430\u0440</a>
                    </li>`}</ul></div>
        <div class="${"cart_controls_box svelte-5erbxc"}">${$cartCollection.length > 0 ? `<div class="${"controls_wrap svelte-5erbxc"}"><div class="${"cart_controls svelte-5erbxc"}"><div class="${"title svelte-5erbxc"}">\u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0435 ${escape(cartCollectionCounter())} \u0448\u0442.</div>
                        ${promoObj.promocode ? `<form class="${"promocode_form"}"><div class="${"form_container svelte-5erbxc"}"><input type="${"text"}" class="${"promo_inp svelte-5erbxc"}" placeholder="${"\u0434\u043B\u044F \u0442\u0435\u0441\u0442\u0430 123"}"${add_attribute("value", promoObj.promoValue, 0)}>
                                    ${``}
                                    <button class="${"submit_code_btn svelte-5erbxc"}"><span class="${"material-icons-outlined"}">upload</span></button></div></form>` : ``}
                        ${!promoObj.promocode && !$promocodeState ? `<button class="${"same_as_link svelte-5erbxc"}">${escape(promoObj.promocode ? "\u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434" : "\u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434")}</button>` : ``}
                        ${$promocodeState ? `<div class="${"approved svelte-5erbxc"}">\u041F\u0440\u043E\u043C\u043E\u043A\u043E\u0434 \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D
                                <span class="${"material-icons-outlined"}">done</span></div>
                            <span class="${"old_price svelte-5erbxc"}"><span class="${"material-icons-outlined svelte-5erbxc"}">local_offer</span>
                                (10%): 
                                <span class="${"val svelte-5erbxc"}">${escape(oldSumAllItemsPrice())}</span></span>` : ``}
                        <div class="${"sum_all_items svelte-5erbxc"}"><span>\u0438\u0442\u043E\u0433\u043E:</span>
                            <span class="${"val svelte-5erbxc"}">${escape(sumAllItemsPrice())} \u0440\u0443\u0431</span></div></div>
                    <div class="${"make_order svelte-5erbxc"}"><a href="${"/newOrder"}" class="${"svelte-5erbxc"}">\u041E\u0444\u043E\u0440\u043C\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437</a></div></div>` : ``}</div></div>
</div>`;
});
var cart = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Cart
});
var css$7 = {
  code: ".cart_control.svelte-b7rfgg.svelte-b7rfgg{display:flex;border-top:1px solid var(--main-border-color)}.cart_control.svelte-b7rfgg a.svelte-b7rfgg{flex-grow:1;display:flex;flex-direction:column;align-items:center;font-size:0.8rem;color:var(--main-text-color)}.cart_control.svelte-b7rfgg a.svelte-b7rfgg:hover{background:#f5f5f5}.items_counter.svelte-b7rfgg.svelte-b7rfgg{color:var(--main-theme-color)}.cart_control.svelte-b7rfgg button.svelte-b7rfgg{border:0;background:var(--transparent-color);font-size:0.9rem;width:40px}.cart_control.svelte-b7rfgg button.svelte-b7rfgg:hover{background:var(--gray-hover-color)}.to_cart_btn.svelte-b7rfgg.svelte-b7rfgg{display:flex;justify-content:center;align-items:center;color:#fff;background:var(--main-theme-color);border:0;padding:0.5rem;font-family:var(--font);font-size:1rem}.to_cart_btn.svelte-b7rfgg.svelte-b7rfgg:hover{background:var(--main-hover-color)}.to_cart_btn.svelte-b7rfgg span.svelte-b7rfgg{color:accent-color;margin-left:0.5rem}@media(max-width: 768px){.text.svelte-b7rfgg.svelte-b7rfgg{display:none}.to_cart_btn.svelte-b7rfgg span.svelte-b7rfgg{margin-left:0}.cart_control.svelte-b7rfgg a.svelte-b7rfgg{padding:0 0.5rem}}",
  map: `{"version":3,"file":"GoodsCounter.svelte","sources":["GoodsCounter.svelte"],"sourcesContent":["<script>\\r\\n    import { cartCollection } from '../../../stores/cart';\\r\\n\\r\\n    export let categoryId; \\r\\n    export let item = $$props;\\r\\n\\r\\n    $: counter = 0;\\r\\n    if(counter < 1) counter = 1;\\r\\n\\r\\n    function pushToCart(operation) {\\r\\n        const cartElem = {\\r\\n            categoryId: categoryId,\\r\\n            elem: item,\\r\\n            cartCounter: counter+1\\r\\n        }\\r\\n\\r\\n        const elemIndex = $cartCollection.findIndex(el => el.elem.name == item.name);\\r\\n        if(operation === \\"plus\\") {\\r\\n            if(elemIndex >= 0) {\\r\\n                return ($cartCollection[elemIndex].cartCounter += 1);\\r\\n            }\\r\\n            $cartCollection = [...$cartCollection, cartElem];\\r\\n        }\\r\\n\\r\\n        if(operation === \\"minus\\") {\\r\\n            $cartCollection[elemIndex].cartCounter -= 1\\r\\n            if($cartCollection[elemIndex].cartCounter < 1) {\\r\\n                $cartCollection = $cartCollection.filter(el => el.elem.name !== item.name);\\r\\n                counter = 0;\\r\\n            }\\r\\n        }\\r\\n    }\\r\\n\\r\\n    $: $cartCollection.forEach(el => {\\r\\n        if(el.elem.name == item.name) {\\r\\n            counter = el.cartCounter;\\r\\n        }\\r\\n    });\\r\\n<\/script>\\r\\n\\r\\n{#if counter === 0}\\r\\n    <button class=\\"to_cart_btn\\" on:click={() => pushToCart('plus')}>\\r\\n\\t\\t<span class=\\"text\\">\u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443</span>\\r\\n\\t\\t<span class=\\"material-icons-outlined\\">shopping_cart</span>\\r\\n\\t</button>\\r\\n{:else}\\r\\n\\t<div class=\\"cart_control\\">\\r\\n\\t\\t<button on:click={() => pushToCart('minus')}>\\r\\n\\t\\t\\t<span class=\\"material-icons-outlined\\">remove</span>\\r\\n\\t\\t</button>\\r\\n\\t\\t<a href=\\"/cart\\">\\r\\n\\t\\t\\t<span class=\\"items_counter\\">\u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0435 {counter} \u0448\u0442</span>\\r\\n\\t\\t\\t<span>\u041F\u0435\u0440\u0435\u0439\u0442\u0438</span>\\r\\n\\t\\t</a>\\r\\n\\t\\t<button on:click={() => pushToCart('plus')}>\\r\\n\\t\\t\\t<span class=\\"material-icons-outlined\\">add</span>\\r\\n\\t\\t</button>\\r\\n\\t</div>\\r\\n{/if}\\r\\n\\r\\n<style>\\r\\n\\t.cart_control {\\r\\n        display: flex;\\r\\n        border-top: 1px solid var(--main-border-color);\\r\\n    }\\r\\n\\r\\n    .cart_control a {\\r\\n        flex-grow: 1;\\r\\n        display: flex;\\r\\n        flex-direction: column;\\r\\n        align-items: center;\\r\\n        font-size: 0.8rem;\\r\\n        color: var(--main-text-color);\\r\\n    }\\r\\n\\r\\n    .cart_control a:hover {\\r\\n        background: #f5f5f5;\\r\\n    }\\r\\n\\r\\n    .items_counter {\\r\\n        color: var(--main-theme-color);\\r\\n    }\\r\\n\\r\\n    .cart_control button {\\r\\n        border: 0;\\r\\n        background: var(--transparent-color);\\r\\n        font-size: 0.9rem;\\r\\n        width: 40px;\\r\\n\\r\\n    }\\r\\n\\r\\n    .cart_control button:hover {\\r\\n        background: var(--gray-hover-color);\\r\\n    }\\r\\n    \\r\\n    .to_cart_btn {\\r\\n        display: flex;\\r\\n        justify-content: center;\\r\\n        align-items: center;\\r\\n        color: #fff;\\r\\n        background: var(--main-theme-color);\\r\\n        border: 0;\\r\\n        padding: 0.5rem;\\r\\n        font-family: var(--font);\\r\\n        font-size: 1rem;\\r\\n    }\\r\\n\\r\\n    .to_cart_btn:hover {\\r\\n        background: var(--main-hover-color);\\r\\n    }\\r\\n\\r\\n    .to_cart_btn span {\\r\\n        color: accent-color;\\r\\n        margin-left: 0.5rem;\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .text {\\r\\n            display: none;   \\r\\n        }\\r\\n\\r\\n        .to_cart_btn span {\\r\\n            margin-left: 0;\\r\\n        }\\r\\n\\r\\n        .cart_control a {\\r\\n            padding: 0 0.5rem;\\r\\n        }\\r\\n    }\\r\\n</style>\\r\\n"],"names":[],"mappings":"AA6DC,aAAa,4BAAC,CAAC,AACR,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,AAClD,CAAC,AAED,2BAAa,CAAC,CAAC,cAAC,CAAC,AACb,SAAS,CAAE,CAAC,CACZ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,MAAM,CACjB,KAAK,CAAE,IAAI,iBAAiB,CAAC,AACjC,CAAC,AAED,2BAAa,CAAC,eAAC,MAAM,AAAC,CAAC,AACnB,UAAU,CAAE,OAAO,AACvB,CAAC,AAED,cAAc,4BAAC,CAAC,AACZ,KAAK,CAAE,IAAI,kBAAkB,CAAC,AAClC,CAAC,AAED,2BAAa,CAAC,MAAM,cAAC,CAAC,AAClB,MAAM,CAAE,CAAC,CACT,UAAU,CAAE,IAAI,mBAAmB,CAAC,CACpC,SAAS,CAAE,MAAM,CACjB,KAAK,CAAE,IAAI,AAEf,CAAC,AAED,2BAAa,CAAC,oBAAM,MAAM,AAAC,CAAC,AACxB,UAAU,CAAE,IAAI,kBAAkB,CAAC,AACvC,CAAC,AAED,YAAY,4BAAC,CAAC,AACV,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,MAAM,CAAE,CAAC,CACT,OAAO,CAAE,MAAM,CACf,WAAW,CAAE,IAAI,MAAM,CAAC,CACxB,SAAS,CAAE,IAAI,AACnB,CAAC,AAED,wCAAY,MAAM,AAAC,CAAC,AAChB,UAAU,CAAE,IAAI,kBAAkB,CAAC,AACvC,CAAC,AAED,0BAAY,CAAC,IAAI,cAAC,CAAC,AACf,KAAK,CAAE,YAAY,CACnB,WAAW,CAAE,MAAM,AACvB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,KAAK,4BAAC,CAAC,AACH,OAAO,CAAE,IAAI,AACjB,CAAC,AAED,0BAAY,CAAC,IAAI,cAAC,CAAC,AACf,WAAW,CAAE,CAAC,AAClB,CAAC,AAED,2BAAa,CAAC,CAAC,cAAC,CAAC,AACb,OAAO,CAAE,CAAC,CAAC,MAAM,AACrB,CAAC,AACL,CAAC"}`
};
var GoodsCounter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let counter;
  let $cartCollection, $$unsubscribe_cartCollection;
  $$unsubscribe_cartCollection = subscribe(cartCollection, (value) => $cartCollection = value);
  let { categoryId } = $$props;
  let { item = $$props } = $$props;
  if (counter < 1)
    counter = 1;
  if ($$props.categoryId === void 0 && $$bindings.categoryId && categoryId !== void 0)
    $$bindings.categoryId(categoryId);
  if ($$props.item === void 0 && $$bindings.item && item !== void 0)
    $$bindings.item(item);
  $$result.css.add(css$7);
  counter = 0;
  {
    $cartCollection.forEach((el) => {
      if (el.elem.name == item.name) {
        counter = el.cartCounter;
      }
    });
  }
  $$unsubscribe_cartCollection();
  return `${counter === 0 ? `<button class="${"to_cart_btn svelte-b7rfgg"}"><span class="${"text svelte-b7rfgg"}">\u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443</span>
		<span class="${"material-icons-outlined svelte-b7rfgg"}">shopping_cart</span></button>` : `<div class="${"cart_control svelte-b7rfgg"}"><button class="${"svelte-b7rfgg"}"><span class="${"material-icons-outlined"}">remove</span></button>
		<a href="${"/cart"}" class="${"svelte-b7rfgg"}"><span class="${"items_counter svelte-b7rfgg"}">\u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0435 ${escape(counter)} \u0448\u0442</span>
			<span>\u041F\u0435\u0440\u0435\u0439\u0442\u0438</span></a>
		<button class="${"svelte-b7rfgg"}"><span class="${"material-icons-outlined"}">add</span></button></div>`}`;
});
var css$6 = {
  code: ".tabs.svelte-rfmdsn{display:flex;align-items:center;margin:3rem 0 1rem}.tab_item.svelte-rfmdsn{cursor:pointer;display:flex;align-items:center;margin-right:1.5rem;opacity:.5}.tab_item.active.svelte-rfmdsn{opacity:1}.tab_name.svelte-rfmdsn{font-size:1.5rem;margin-left:0.5rem}.title.svelte-rfmdsn{font-size:1.4rem;font-weight:500;margin-bottom:1rem}.tab_content.svelte-rfmdsn{padding:1rem;border:1px solid var(--main-border-color)}",
  map: `{"version":3,"file":"Tabs.svelte","sources":["Tabs.svelte"],"sourcesContent":["<script>\\r\\n    import {slide} from 'svelte/transition';\\r\\n    \\r\\n    export let title;\\r\\n    export let body;\\r\\n    let active = '1';   \\r\\n<\/script>\\r\\n\\r\\n<div class=\\"tabs\\">\\r\\n    <div class=\\"tab_item\\" class:active={active === \\"1\\"} on:click=\\"{() => active = \\"1\\"}\\">\\r\\n        <span class=\\"material-icons-outlined\\">source</span>\\r\\n        <span class=\\"tab_name\\">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435</span>\\r\\n    </div>\\r\\n    <div class=\\"tab_item\\" class:active={active === \\"2\\"} on:click=\\"{() => active = \\"2\\"}\\">\\r\\n        <span class=\\"material-icons-outlined\\">chat_bubble_outline</span>\\r\\n        <span class=\\"tab_name\\">\u041E\u0442\u0437\u044B\u0432\u044B</span>\\r\\n    </div>\\r\\n</div>\\r\\n\\r\\n<div class=\\"tab_content\\">\\r\\n    {#if active === \\"1\\"}\\r\\n        <div id=\\"about1\\" class=\\"tab_content_body\\" transition:slide|local>\\r\\n            <div class=\\"title\\">{title}</div>\\r\\n            <div class=\\"content\\">{body}</div>\\r\\n        </div>\\r\\n    {:else}\\r\\n        <div class=\\"tab_content_body\\" transition:slide>\\r\\n            \u043E\u0442\u0437\u044B\u0432\u044B \u043A\u0430\u043A\u0438\u0435 \u0442\u043E\\r\\n        </div>\\r\\n    {/if}\\r\\n</div>\\r\\n\\r\\n\\r\\n<style>\\r\\n    .tabs {\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        margin: 3rem 0 1rem;\\r\\n    }\\r\\n\\r\\n    .tab_item {\\r\\n        cursor: pointer;\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        margin-right: 1.5rem;\\r\\n        opacity: .5;\\r\\n    }\\r\\n\\r\\n    .tab_item.active {\\r\\n        opacity: 1;\\r\\n    }\\r\\n\\r\\n    .tab_name {\\r\\n        font-size: 1.5rem;\\r\\n        margin-left: 0.5rem;\\r\\n    }\\r\\n\\r\\n    .title {\\r\\n        font-size: 1.4rem;\\r\\n        font-weight: 500;\\r\\n        margin-bottom: 1rem;\\r\\n    }\\r\\n\\r\\n    .tab_content {\\r\\n        padding: 1rem;\\r\\n        border: 1px solid var(--main-border-color);\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAkCI,KAAK,cAAC,CAAC,AACH,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,MAAM,CAAE,IAAI,CAAC,CAAC,CAAC,IAAI,AACvB,CAAC,AAED,SAAS,cAAC,CAAC,AACP,MAAM,CAAE,OAAO,CACf,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,YAAY,CAAE,MAAM,CACpB,OAAO,CAAE,EAAE,AACf,CAAC,AAED,SAAS,OAAO,cAAC,CAAC,AACd,OAAO,CAAE,CAAC,AACd,CAAC,AAED,SAAS,cAAC,CAAC,AACP,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,MAAM,AACvB,CAAC,AAED,MAAM,cAAC,CAAC,AACJ,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,aAAa,CAAE,IAAI,AACvB,CAAC,AAED,YAAY,cAAC,CAAC,AACV,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,AAC9C,CAAC"}`
};
var Tabs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title } = $$props;
  let { body } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.body === void 0 && $$bindings.body && body !== void 0)
    $$bindings.body(body);
  $$result.css.add(css$6);
  return `<div class="${"tabs svelte-rfmdsn"}"><div class="${["tab_item svelte-rfmdsn", "active"].join(" ").trim()}"><span class="${"material-icons-outlined"}">source</span>
        <span class="${"tab_name svelte-rfmdsn"}">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435</span></div>
    <div class="${["tab_item svelte-rfmdsn", ""].join(" ").trim()}"><span class="${"material-icons-outlined"}">chat_bubble_outline</span>
        <span class="${"tab_name svelte-rfmdsn"}">\u041E\u0442\u0437\u044B\u0432\u044B</span></div></div>

<div class="${"tab_content svelte-rfmdsn"}">${`<div id="${"about1"}" class="${"tab_content_body"}"><div class="${"title svelte-rfmdsn"}">${escape(title)}</div>
            <div class="${"content"}">${escape(body)}</div></div>`}
</div>`;
});
var css$5 = {
  code: ".attr_name.svelte-igq7mg{color:var(--main-descr-color);background:var(--main-bg-color);display:inline-block;padding:5px 0}.attr_name.svelte-igq7mg:after{content:'';position:absolute;width:100%;height:1px;border-bottom:1px dotted var(--main-descr-color);left:0;bottom:10px;z-index:-1}.attr_value.svelte-igq7mg{background:var(--main-bg-color);display:inline-block;padding:5px}.feature_list_item.svelte-igq7mg{display:flex;justify-content:space-between;position:relative}.collection_vals.svelte-igq7mg{margin-bottom:1rem}.title_val.svelte-igq7mg{font-size:1rem;text-transform:uppercase;margin-bottom:0.3rem}.val_item.svelte-igq7mg{display:inline-block;margin-right:0.5rem;margin-bottom:0.5rem;padding:0 0.5rem;border:2px solid var(--main-theme-color)}",
  map: `{"version":3,"file":"FeatureItem.svelte","sources":["FeatureItem.svelte"],"sourcesContent":["<script>\\r\\n    export let name;\\r\\n    export let val;\\r\\n<\/script>\\r\\n\\r\\n<li class=\\"feature_list_item\\">\\r\\n    {#if val.length > 1}\\r\\n        <div class=\\"collection_vals\\">\\r\\n            <div class=\\"title_val\\">{name}</div>\\r\\n            {#each val as item}\\r\\n                <span class=\\"val_item\\">{item}</span>\\r\\n            {/each}\\r\\n        </div>\\r\\n    {:else}\\r\\n        <span class=\\"attr_name\\">{name}</span>\\r\\n        <span class=\\"attr_value\\">{val}</span>\\r\\n    {/if}\\r\\n</li>\\r\\n\\r\\n<style>\\r\\n    .attr_name {\\r\\n        color: var(--main-descr-color);\\r\\n        background: var(--main-bg-color);\\r\\n        display: inline-block;\\r\\n        padding: 5px 0;\\r\\n    }\\r\\n\\r\\n    .attr_name:after {\\r\\n        content: '';\\r\\n        position: absolute;\\r\\n        width: 100%;\\r\\n        height: 1px;\\r\\n        border-bottom: 1px dotted var(--main-descr-color);\\r\\n        left: 0;\\r\\n        bottom: 10px;\\r\\n        z-index: -1;\\r\\n    }\\r\\n\\r\\n    .attr_value {\\r\\n        background: var(--main-bg-color);\\r\\n        display: inline-block;\\r\\n        padding: 5px;\\r\\n    }\\r\\n\\r\\n    .feature_list_item {\\r\\n        display: flex;\\r\\n        justify-content: space-between;\\r\\n        position: relative;\\r\\n    }\\r\\n\\r\\n    .collection_vals {\\r\\n        margin-bottom: 1rem;\\r\\n    }\\r\\n\\r\\n    .title_val {\\r\\n        font-size: 1rem;\\r\\n        text-transform: uppercase;\\r\\n        margin-bottom: 0.3rem;\\r\\n    }\\r\\n\\r\\n    .val_item {\\r\\n        display: inline-block;\\r\\n        margin-right: 0.5rem;\\r\\n        margin-bottom: 0.5rem;\\r\\n        padding: 0 0.5rem;\\r\\n        border: 2px solid var(--main-theme-color);\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAoBI,UAAU,cAAC,CAAC,AACR,KAAK,CAAE,IAAI,kBAAkB,CAAC,CAC9B,UAAU,CAAE,IAAI,eAAe,CAAC,CAChC,OAAO,CAAE,YAAY,CACrB,OAAO,CAAE,GAAG,CAAC,CAAC,AAClB,CAAC,AAED,wBAAU,MAAM,AAAC,CAAC,AACd,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CACX,aAAa,CAAE,GAAG,CAAC,MAAM,CAAC,IAAI,kBAAkB,CAAC,CACjD,IAAI,CAAE,CAAC,CACP,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,EAAE,AACf,CAAC,AAED,WAAW,cAAC,CAAC,AACT,UAAU,CAAE,IAAI,eAAe,CAAC,CAChC,OAAO,CAAE,YAAY,CACrB,OAAO,CAAE,GAAG,AAChB,CAAC,AAED,kBAAkB,cAAC,CAAC,AAChB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,CAC9B,QAAQ,CAAE,QAAQ,AACtB,CAAC,AAED,gBAAgB,cAAC,CAAC,AACd,aAAa,CAAE,IAAI,AACvB,CAAC,AAED,UAAU,cAAC,CAAC,AACR,SAAS,CAAE,IAAI,CACf,cAAc,CAAE,SAAS,CACzB,aAAa,CAAE,MAAM,AACzB,CAAC,AAED,SAAS,cAAC,CAAC,AACP,OAAO,CAAE,YAAY,CACrB,YAAY,CAAE,MAAM,CACpB,aAAa,CAAE,MAAM,CACrB,OAAO,CAAE,CAAC,CAAC,MAAM,CACjB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,kBAAkB,CAAC,AAC7C,CAAC"}`
};
var FeatureItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { val } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.val === void 0 && $$bindings.val && val !== void 0)
    $$bindings.val(val);
  $$result.css.add(css$5);
  return `<li class="${"feature_list_item svelte-igq7mg"}">${val.length > 1 ? `<div class="${"collection_vals svelte-igq7mg"}"><div class="${"title_val svelte-igq7mg"}">${escape(name)}</div>
            ${each(val, (item) => `<span class="${"val_item svelte-igq7mg"}">${escape(item)}</span>`)}</div>` : `<span class="${"attr_name svelte-igq7mg"}">${escape(name)}</span>
        <span class="${"attr_value svelte-igq7mg"}">${escape(val)}</span>`}
</li>`;
});
var css$4 = {
  code: ".item_feature.svelte-1mto0wh{grid-area:about}.to_about_item.svelte-1mto0wh{color:var(--main-theme-color)}@media(max-width: 992px){}@media(max-width: 768px){.item_feature.svelte-1mto0wh{padding-right:0}}",
  map: '{"version":3,"file":"FeatureList.svelte","sources":["FeatureList.svelte"],"sourcesContent":["<script>\\r\\n    import FeatureItem from \\"./FeatureItem.svelte\\";\\r\\n\\r\\n    export let attrs;\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"item_feature\\">\\r\\n    <ul class=\\"feature_list\\">\\r\\n        {#each attrs as attrItem}\\r\\n            <FeatureItem name={attrItem.attrName} val={attrItem.attrVal}/>\\r\\n        {/each}\\r\\n    </ul>\\r\\n    <a href=\\"#about1\\" class=\\"to_about_item\\">\u043A \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u044E</a>\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .item_feature {\\r\\n        grid-area: about;\\r\\n    }\\r\\n    .to_about_item {\\r\\n        color: var(--main-theme-color);\\r\\n    }\\r\\n\\r\\n    @media (max-width: 992px) {\\r\\n\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .item_feature {\\r\\n            padding-right: 0;\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAgBI,aAAa,eAAC,CAAC,AACX,SAAS,CAAE,KAAK,AACpB,CAAC,AACD,cAAc,eAAC,CAAC,AACZ,KAAK,CAAE,IAAI,kBAAkB,CAAC,AAClC,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAE3B,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,aAAa,eAAC,CAAC,AACX,aAAa,CAAE,CAAC,AACpB,CAAC,AACL,CAAC"}'
};
var FeatureList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { attrs } = $$props;
  if ($$props.attrs === void 0 && $$bindings.attrs && attrs !== void 0)
    $$bindings.attrs(attrs);
  $$result.css.add(css$4);
  return `<div class="${"item_feature svelte-1mto0wh"}"><ul class="${"feature_list"}">${each(attrs, (attrItem) => `${validate_component(FeatureItem, "FeatureItem").$$render($$result, {
    name: attrItem.attrName,
    val: attrItem.attrVal
  }, {}, {})}`)}</ul>
    <a href="${"#about1"}" class="${"to_about_item svelte-1mto0wh"}">\u043A \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u044E</a>
</div>`;
});
var css$3 = {
  code: ".currency.svelte-5gt378{font-size:1rem}.product_price_cur.svelte-5gt378{font-size:2.3rem;font-weight:500;padding:1rem}@media(max-width: 768px){.product_price_cur.svelte-5gt378{font-size:1rem;padding:0 0 0 1rem;display:flex;align-items:center}}",
  map: `{"version":3,"file":"GoodItemPrice.svelte","sources":["GoodItemPrice.svelte"],"sourcesContent":["<script>\\r\\n    export let price;\\r\\n<\/script>\\r\\n\\r\\n<span class=\\"product_price_cur\\">\\r\\n    {(price).toLocaleString('ru')}\\r\\n    <span class=\\"currency\\">RUB</span>\\r\\n</span>\\r\\n\\r\\n<style>\\r\\n    .currency {\\r\\n        font-size: 1rem;\\r\\n    }\\r\\n\\r\\n    .product_price_cur {\\r\\n        font-size: 2.3rem;\\r\\n        font-weight: 500;\\r\\n        padding: 1rem;\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .product_price_cur {\\r\\n            font-size: 1rem;\\r\\n            padding: 0 0 0 1rem;\\r\\n            display: flex;\\r\\n            align-items: center;\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAUI,SAAS,cAAC,CAAC,AACP,SAAS,CAAE,IAAI,AACnB,CAAC,AAED,kBAAkB,cAAC,CAAC,AAChB,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,OAAO,CAAE,IAAI,AACjB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,kBAAkB,cAAC,CAAC,AAChB,SAAS,CAAE,IAAI,CACf,OAAO,CAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CACnB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,AACvB,CAAC,AACL,CAAC"}`
};
var GoodItemPrice = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { price } = $$props;
  if ($$props.price === void 0 && $$bindings.price && price !== void 0)
    $$bindings.price(price);
  $$result.css.add(css$3);
  return `<span class="${"product_price_cur svelte-5gt378"}">${escape(price.toLocaleString("ru"))}
    <span class="${"currency svelte-5gt378"}">RUB</span>
</span>`;
});
var css$2 = {
  code: ".short_gallery.svelte-e8i2pu.svelte-e8i2pu{display:flex;align-items:center;justify-content:center}.slider_for_item.svelte-e8i2pu.svelte-e8i2pu{width:200px;margin:0 auto}.item_img_box.svelte-e8i2pu .slider_for_item.svelte-e8i2pu .left{left:-4vw}.item_img_box.svelte-e8i2pu .slider_for_item.svelte-e8i2pu .right{right:-4vw}.slide_container.svelte-e8i2pu.svelte-e8i2pu{display:flex;align-items:center;justify-content:center;padding:5px;border:1px solid var(--main-border-color)}.slide_container.svelte-e8i2pu img.svelte-e8i2pu{max-width:50px;height:50px}.item_img_box.svelte-e8i2pu.svelte-e8i2pu{grid-area:img}.img_preview.svelte-e8i2pu.svelte-e8i2pu{width:100%;display:flex;align-items:center;justify-content:center}.img_preview.svelte-e8i2pu img.svelte-e8i2pu{max-width:400px;max-height:400px}@media(max-width: 768px){.img_preview.svelte-e8i2pu.svelte-e8i2pu{display:flex;justify-content:center}.img_preview.svelte-e8i2pu img.svelte-e8i2pu{max-width:400px;max-height:280px}}",
  map: `{"version":3,"file":"GoodItemImgs.svelte","sources":["GoodItemImgs.svelte"],"sourcesContent":["<script>\\r\\n    import { fly } from 'svelte/transition';\\r\\n    import Carousel from '@beyonk/svelte-carousel';\\r\\n\\r\\n    export let imgs;\\r\\n    let currentIndx = 0;\\r\\n\\r\\n    $: if(currentIndx >= imgs.length) currentIndx = 0;\\r\\n        else if(currentIndx < 0) currentIndx = (imgs.length - 1);\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"item_img_box\\">\\r\\n    <div class=\\"img_preview\\">\\r\\n        {#key currentIndx}\\r\\n            <img in:fly={{y: 100}} src={imgs[currentIndx]} alt=\\"\\">\\r\\n        {/key}\\r\\n    </div>\\r\\n    <div class=\\"slider_for_item\\">\\r\\n        {#if imgs.length > 3}\\r\\n            <Carousel dots={false} perPage={3} draggable={false}>\\r\\n                <span class=\\"control\\" slot=\\"left-control\\" on:click={() => currentIndx--}>\\r\\n                    <span class=\\"material-icons-outlined\\">arrow_back</span>\\r\\n                </span>\\r\\n                {#each imgs as imgItem}\\r\\n                    <div class=\\"slide_container\\">\\r\\n                        <img src={imgItem} alt=\\"\\">\\r\\n                    </div>\\r\\n                {/each}\\r\\n                <span class=\\"control\\" slot=\\"right-control\\" on:click={() => currentIndx++}>\\r\\n                    <span class=\\"material-icons-outlined\\">arrow_forward</span>\\r\\n                </span>\\r\\n            </Carousel>\\r\\n        {:else}\\r\\n            <div class=\\"short_gallery\\">\\r\\n                {#each imgs as imgItem}\\r\\n                    <div class=\\"slide_container\\">\\r\\n                        <img src={imgItem} alt=\\"\\">\\r\\n                    </div>\\r\\n                {/each}\\r\\n            </div>\\r\\n        {/if}\\r\\n    </div>\\r\\n    \\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .short_gallery {\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: center;\\r\\n    }\\r\\n\\r\\n    .slider_for_item {\\r\\n        width: 200px;\\r\\n        margin: 0 auto;\\r\\n    }\\r\\n\\r\\n    .item_img_box .slider_for_item :global(.left) {\\r\\n        left: -4vw;\\r\\n    }\\r\\n\\r\\n    .item_img_box .slider_for_item :global(.right) {\\r\\n        right: -4vw;\\r\\n    }\\r\\n\\r\\n    .slide_container {\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: center;\\r\\n        padding: 5px;\\r\\n        border: 1px solid var(--main-border-color);\\r\\n    }\\r\\n    .slide_container img {\\r\\n        max-width: 50px;\\r\\n        height: 50px;\\r\\n    }\\r\\n    .item_img_box {\\r\\n        grid-area: img;\\r\\n    }\\r\\n\\r\\n    .img_preview {\\r\\n        width: 100%;\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: center;\\r\\n    }\\r\\n    .img_preview img{\\r\\n        max-width: 400px;\\r\\n        max-height: 400px;\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .img_preview {\\r\\n            display: flex;\\r\\n            justify-content: center;\\r\\n        }\\r\\n\\r\\n        .img_preview img{\\r\\n            max-width: 400px;\\r\\n            max-height: 280px;\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AA8CI,cAAc,4BAAC,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,AAC3B,CAAC,AAED,gBAAgB,4BAAC,CAAC,AACd,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,CAAC,CAAC,IAAI,AAClB,CAAC,AAED,2BAAa,CAAC,8BAAgB,CAAC,AAAQ,KAAK,AAAE,CAAC,AAC3C,IAAI,CAAE,IAAI,AACd,CAAC,AAED,2BAAa,CAAC,8BAAgB,CAAC,AAAQ,MAAM,AAAE,CAAC,AAC5C,KAAK,CAAE,IAAI,AACf,CAAC,AAED,gBAAgB,4BAAC,CAAC,AACd,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,AAC9C,CAAC,AACD,8BAAgB,CAAC,GAAG,cAAC,CAAC,AAClB,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,IAAI,AAChB,CAAC,AACD,aAAa,4BAAC,CAAC,AACX,SAAS,CAAE,GAAG,AAClB,CAAC,AAED,YAAY,4BAAC,CAAC,AACV,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,AAC3B,CAAC,AACD,0BAAY,CAAC,iBAAG,CAAC,AACb,SAAS,CAAE,KAAK,CAChB,UAAU,CAAE,KAAK,AACrB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,YAAY,4BAAC,CAAC,AACV,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,AAC3B,CAAC,AAED,0BAAY,CAAC,iBAAG,CAAC,AACb,SAAS,CAAE,KAAK,CAChB,UAAU,CAAE,KAAK,AACrB,CAAC,AACL,CAAC"}`
};
var GoodItemImgs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { imgs } = $$props;
  let currentIndx = 0;
  if ($$props.imgs === void 0 && $$bindings.imgs && imgs !== void 0)
    $$bindings.imgs(imgs);
  $$result.css.add(css$2);
  {
    if (currentIndx >= imgs.length)
      currentIndx = 0;
    else if (currentIndx < 0)
      currentIndx = imgs.length - 1;
  }
  return `<div class="${"item_img_box svelte-e8i2pu"}"><div class="${"img_preview svelte-e8i2pu"}"><img${add_attribute("src", imgs[currentIndx], 0)} alt="${""}" class="${"svelte-e8i2pu"}"></div>
    <div class="${"slider_for_item svelte-e8i2pu"}">${imgs.length > 3 ? `${validate_component(Carousel, "Carousel").$$render($$result, {
    dots: false,
    perPage: 3,
    draggable: false
  }, {}, {
    "right-control": () => `<span class="${"control"}" slot="${"right-control"}"><span class="${"material-icons-outlined"}">arrow_forward</span></span>`,
    "left-control": () => `<span class="${"control"}" slot="${"left-control"}"><span class="${"material-icons-outlined"}">arrow_back</span></span>`,
    default: () => `${each(imgs, (imgItem) => `<div class="${"slide_container svelte-e8i2pu"}"><img${add_attribute("src", imgItem, 0)} alt="${""}" class="${"svelte-e8i2pu"}">
                    </div>`)}`
  })}` : `<div class="${"short_gallery svelte-e8i2pu"}">${each(imgs, (imgItem) => `<div class="${"slide_container svelte-e8i2pu"}"><img${add_attribute("src", imgItem, 0)} alt="${""}" class="${"svelte-e8i2pu"}">
                    </div>`)}</div>`}</div>
    
</div>`;
});
var css$1 = {
  code: ".favorite.svelte-1jnoa5y.svelte-1jnoa5y{display:flex;align-items:center;cursor:pointer}.favorite.svelte-1jnoa5y span.svelte-1jnoa5y{transition:.2s}.favorite.svelte-1jnoa5y:hover span.svelte-1jnoa5y{color:var(--main-theme-color)}.favorite.favState.svelte-1jnoa5y .material-icons-outlined.svelte-1jnoa5y{color:red}.text.svelte-1jnoa5y.svelte-1jnoa5y{margin-left:5px}",
  map: `{"version":3,"file":"DataFavorite.svelte","sources":["DataFavorite.svelte"],"sourcesContent":["<script>\\r\\n    import { favoriteCollection } from '../../../stores/favoriteStore';\\r\\n\\r\\n    export let item = $$props;\\r\\n    export let categoryId\\r\\n\\r\\n\\r\\n    function pushToFavorite() {\\r\\n        item.favorite = !item.favorite;\\r\\n        item.favorite\\r\\n        ? $favoriteCollection = [...$favoriteCollection, {...item, categoryId: categoryId}]\\r\\n        : $favoriteCollection = $favoriteCollection.filter(el => !el.name.includes(item.name));\\r\\n    }\\r\\n\\r\\n    $: $favoriteCollection.forEach(el => {\\r\\n        if(el.name === item.name) {\\r\\n            item.favorite = el.favorite;\\r\\n        }\\r\\n    });\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"favorite\\" on:click={pushToFavorite} class:favState={item.favorite}>\\r\\n    <span class=\\"material-icons-outlined\\">{ item.favorite ? \\"favorite\\" : \\"favorite_border\\" }</span>\\r\\n    <span class=\\"text\\">{item.favorite ? \\"\u0412 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u043C\\" : \\"\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435\\"}</span>\\r\\n</div>\\r\\n\\r\\n<style>\\r\\n    .favorite {\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        cursor: pointer;\\r\\n    }\\r\\n\\r\\n    .favorite span {\\r\\n        transition: .2s;\\r\\n    }\\r\\n\\r\\n    .favorite:hover span{\\r\\n        color: var(--main-theme-color);\\r\\n    }\\r\\n\\r\\n    .favorite.favState .material-icons-outlined {\\r\\n        color: red;\\r\\n    }\\r\\n\\r\\n    .text {\\r\\n        margin-left: 5px;\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AA2BI,SAAS,8BAAC,CAAC,AACP,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,MAAM,CAAE,OAAO,AACnB,CAAC,AAED,wBAAS,CAAC,IAAI,eAAC,CAAC,AACZ,UAAU,CAAE,GAAG,AACnB,CAAC,AAED,wBAAS,MAAM,CAAC,mBAAI,CAAC,AACjB,KAAK,CAAE,IAAI,kBAAkB,CAAC,AAClC,CAAC,AAED,SAAS,wBAAS,CAAC,wBAAwB,eAAC,CAAC,AACzC,KAAK,CAAE,GAAG,AACd,CAAC,AAED,KAAK,8BAAC,CAAC,AACH,WAAW,CAAE,GAAG,AACpB,CAAC"}`
};
var DataFavorite = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $favoriteCollection, $$unsubscribe_favoriteCollection;
  $$unsubscribe_favoriteCollection = subscribe(favoriteCollection, (value) => $favoriteCollection = value);
  let { item = $$props } = $$props;
  let { categoryId } = $$props;
  if ($$props.item === void 0 && $$bindings.item && item !== void 0)
    $$bindings.item(item);
  if ($$props.categoryId === void 0 && $$bindings.categoryId && categoryId !== void 0)
    $$bindings.categoryId(categoryId);
  $$result.css.add(css$1);
  {
    $favoriteCollection.forEach((el) => {
      if (el.name === item.name) {
        item.favorite = el.favorite;
      }
    });
  }
  $$unsubscribe_favoriteCollection();
  return `<div class="${["favorite svelte-1jnoa5y", item.favorite ? "favState" : ""].join(" ").trim()}"><span class="${"material-icons-outlined svelte-1jnoa5y"}">${escape(item.favorite ? "favorite" : "favorite_border")}</span>
    <span class="${"text svelte-1jnoa5y"}">${escape(item.favorite ? "\u0412 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u043C" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435")}</span>
</div>`;
});
var css = {
  code: '.item_price.svelte-109so6h{display:flex;flex-direction:column;grid-area:price;position:sticky;top:0}.item_price.svelte-109so6h{border:1px solid var(--main-border-color)}.item_container.svelte-109so6h{position:relative;display:grid;gap:2rem;grid-template-columns:32% minmax(auto, 400px) 340px;grid-template-areas:"img about price";padding-top:2rem;align-items:flex-start}h1.svelte-109so6h{font-size:1.5rem;font-weight:500}.item_funcs.svelte-109so6h{border-bottom:1px solid var(--main-border-color);display:flex;align-items:center;padding:0.5rem 0}@media(max-width: 992px){.item_container.svelte-109so6h{grid-template-columns:32% 1fr;grid-template-areas:"img about" "img price"}}@media(max-width: 768px){.item_price.svelte-109so6h{flex-direction:row;justify-content:space-between}.item_container.svelte-109so6h{grid-template-columns:1fr;grid-template-areas:"img" "about" "price"}}',
  map: `{"version":3,"file":"[id].svelte","sources":["[id].svelte"],"sourcesContent":["<script context=\\"module\\">\\r\\n    export async function load(ctx) {\\r\\n        let id = ctx.page.params.id;\\r\\n        let categoryId = ctx.page.params.category;\\r\\n        return { props: { id: id, categoryId: categoryId}}\\r\\n    }\\r\\n<\/script>\\r\\n\\r\\n<script>\\r\\n    export let id;\\r\\n    export let categoryId;\\r\\n\\r\\n    import Loader from '../../../components/Helpers/Loader.svelte';\\r\\n        import Model from '../../../model/data-service';\\r\\n        import { beforeUpdate, onMount } from 'svelte';\\r\\n        import Breadcrumbs from '../../../components/Helpers/Breadcrumbs.svelte';\\r\\n        import GoodsCounter from '../../../components/Main/GoodItem/GoodsCounter.svelte';\\r\\n        import Tabs from '../../../components/Main/GoodItem/Tabs.svelte';\\r\\n        import FeatureList from '../../../components/Main/GoodItem/FeatureList.svelte';\\r\\n        import GoodItemPrice from '../../../components/Main/GoodItem/GoodItemPrice.svelte';\\r\\n        import GoodItemImgs from '../../../components/Main/GoodItem/GoodItemImgs.svelte';\\r\\n        import DataFavorite from '../../../components/Main/GoodItem/DataFavorite.svelte';\\r\\n\\r\\n    const temp = new Model();\\r\\n    \\r\\n    let staticData;\\r\\n    let title = \\"\\";\\r\\n\\r\\n    function updateData() {\\r\\n        staticData   = temp.getSingleItem(categoryId, id);\\r\\n    }\\r\\n\\r\\n    onMount(async() => {\\r\\n        const resolve = await staticData;\\r\\n        title = resolve.name;\\r\\n    });\\r\\n\\r\\n    beforeUpdate(updateData);\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"container\\">\\r\\n    {#await staticData}\\r\\n        <Loader/>\\r\\n    {:then value}\\r\\n        <Breadcrumbs refaddress={value.name}/>\\r\\n        <h1>{value.name}</h1>\\r\\n        <div class=\\"item_funcs\\">\\r\\n            <DataFavorite {...value} categoryId={categoryId}/>\\r\\n        </div>\\r\\n        <div class=\\"item_container\\">\\r\\n            <GoodItemImgs imgs={value.imgSet}/>\\r\\n            <FeatureList attrs={value.attributes}/>\\r\\n            <div class=\\"item_price\\">\\r\\n                <GoodItemPrice price={value.price}/>\\r\\n                <GoodsCounter {...value} categoryId={categoryId}/>\\r\\n            </div>\\r\\n        </div>\\r\\n        <Tabs title={value.title} body={value.body}/>\\r\\n    {/await}\\r\\n</div>\\r\\n\\r\\n<svelte:head>\\r\\n    <title>{title}</title>\\r\\n</svelte:head>\\r\\n\\r\\n<style>\\r\\n    .item_price {\\r\\n        display: flex;\\r\\n        flex-direction: column;\\r\\n        grid-area: price;\\r\\n        position: sticky;\\r\\n        top: 0;\\r\\n    }\\r\\n\\r\\n    .item_price {\\r\\n        border: 1px solid var(--main-border-color);\\r\\n    }\\r\\n\\r\\n    .item_container {\\r\\n        position: relative;\\r\\n        display: grid;\\r\\n        gap: 2rem;\\r\\n        grid-template-columns: 32% minmax(auto, 400px) 340px;\\r\\n        grid-template-areas: \\"img about price\\";\\r\\n        padding-top: 2rem;\\r\\n        align-items: flex-start;\\r\\n    }\\r\\n    h1 {\\r\\n        font-size: 1.5rem;\\r\\n        font-weight: 500;\\r\\n    }\\r\\n\\r\\n    .item_funcs {\\r\\n        border-bottom: 1px solid var(--main-border-color);\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        padding: 0.5rem 0;\\r\\n    }\\r\\n\\r\\n\\r\\n    @media (max-width: 992px) {\\r\\n        .item_container {\\r\\n            grid-template-columns: 32% 1fr;\\r\\n            grid-template-areas: \\"img about\\" \\"img price\\";\\r\\n        }\\r\\n    }\\r\\n\\r\\n    @media (max-width: 768px) {\\r\\n        .item_price {\\r\\n            flex-direction: row;\\r\\n            justify-content: space-between;\\r\\n        }\\r\\n\\r\\n        .item_container {\\r\\n            grid-template-columns: 1fr;\\r\\n            grid-template-areas: \\"img\\" \\"about\\" \\"price\\";\\r\\n        }\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAkEI,WAAW,eAAC,CAAC,AACT,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,SAAS,CAAE,KAAK,CAChB,QAAQ,CAAE,MAAM,CAChB,GAAG,CAAE,CAAC,AACV,CAAC,AAED,WAAW,eAAC,CAAC,AACT,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,AAC9C,CAAC,AAED,eAAe,eAAC,CAAC,AACb,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,GAAG,CAAE,IAAI,CACT,qBAAqB,CAAE,GAAG,CAAC,OAAO,IAAI,CAAC,CAAC,KAAK,CAAC,CAAC,KAAK,CACpD,mBAAmB,CAAE,iBAAiB,CACtC,WAAW,CAAE,IAAI,CACjB,WAAW,CAAE,UAAU,AAC3B,CAAC,AACD,EAAE,eAAC,CAAC,AACA,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,AACpB,CAAC,AAED,WAAW,eAAC,CAAC,AACT,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,mBAAmB,CAAC,CACjD,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,OAAO,CAAE,MAAM,CAAC,CAAC,AACrB,CAAC,AAGD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,eAAe,eAAC,CAAC,AACb,qBAAqB,CAAE,GAAG,CAAC,GAAG,CAC9B,mBAAmB,CAAE,WAAW,CAAC,WAAW,AAChD,CAAC,AACL,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,WAAW,eAAC,CAAC,AACT,cAAc,CAAE,GAAG,CACnB,eAAe,CAAE,aAAa,AAClC,CAAC,AAED,eAAe,eAAC,CAAC,AACb,qBAAqB,CAAE,GAAG,CAC1B,mBAAmB,CAAE,KAAK,CAAC,OAAO,CAAC,OAAO,AAC9C,CAAC,AACL,CAAC"}`
};
async function load(ctx) {
  let id = ctx.page.params.id;
  let categoryId = ctx.page.params.category;
  return { props: { id, categoryId } };
}
var U5Bidu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { id } = $$props;
  let { categoryId } = $$props;
  let staticData;
  let title = "";
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.categoryId === void 0 && $$bindings.categoryId && categoryId !== void 0)
    $$bindings.categoryId(categoryId);
  $$result.css.add(css);
  return `<div class="${"container"}">${function(__value) {
    if (is_promise(__value))
      return `
        ${validate_component(Loader, "Loader").$$render($$result, {}, {}, {})}
    `;
    return function(value) {
      return `
        ${validate_component(Breadcrumbs, "Breadcrumbs").$$render($$result, { refaddress: value.name }, {}, {})}
        <h1 class="${"svelte-109so6h"}">${escape(value.name)}</h1>
        <div class="${"item_funcs svelte-109so6h"}">${validate_component(DataFavorite, "DataFavorite").$$render($$result, Object.assign(value, { categoryId }), {}, {})}</div>
        <div class="${"item_container svelte-109so6h"}">${validate_component(GoodItemImgs, "GoodItemImgs").$$render($$result, { imgs: value.imgSet }, {}, {})}
            ${validate_component(FeatureList, "FeatureList").$$render($$result, { attrs: value.attributes }, {}, {})}
            <div class="${"item_price svelte-109so6h"}">${validate_component(GoodItemPrice, "GoodItemPrice").$$render($$result, { price: value.price }, {}, {})}
                ${validate_component(GoodsCounter, "GoodsCounter").$$render($$result, Object.assign(value, { categoryId }), {}, {})}</div></div>
        ${validate_component(Tabs, "Tabs").$$render($$result, { title: value.title, body: value.body }, {}, {})}
    `;
    }(__value);
  }(staticData)}</div>

${$$result.head += `${$$result.title = `<title>${escape(title)}</title>`, ""}`, ""}`;
});
var _id_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bidu5D,
  load
});

// .svelte-kit/netlify/entry.js
init();
async function handler(event) {
  const { path, httpMethod, headers, rawQuery, body, isBase64Encoded } = event;
  const query = new URLSearchParams(rawQuery);
  const encoding = isBase64Encoded ? "base64" : headers["content-encoding"] || "utf-8";
  const rawBody = typeof body === "string" ? Buffer.from(body, encoding) : body;
  const rendered = await render({
    method: httpMethod,
    headers,
    path,
    query,
    rawBody
  });
  if (!rendered) {
    return {
      statusCode: 404,
      body: "Not found"
    };
  }
  const partial_response = {
    statusCode: rendered.status,
    ...split_headers(rendered.headers)
  };
  if (typeof rendered.body === "string") {
    return {
      ...partial_response,
      body: rendered.body
    };
  }
  return {
    ...partial_response,
    isBase64Encoded: true,
    body: Buffer.from(rendered.body).toString("base64")
  };
}
function split_headers(headers) {
  const h = {};
  const m = {};
  for (const key in headers) {
    const value = headers[key];
    const target = Array.isArray(value) ? m : h;
    target[key] = value;
  }
  return {
    headers: h,
    multiValueHeaders: m
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});

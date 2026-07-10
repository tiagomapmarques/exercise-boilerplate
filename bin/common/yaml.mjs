// Plain scalars that YAML's core schema would resolve to a non-string type
const reservedScalars = new Set([
  'true',
  'True',
  'TRUE',
  'false',
  'False',
  'FALSE',
  'null',
  'Null',
  'NULL',
  '~',
]);

const integerPattern = /^[-+]?\d+$/u;
const floatPattern = /^[-+]?(?:\d+\.\d*|\.\d+|\d+)(?:[eE][-+]?\d+)?$/u;
const leadingIndicatorPattern = /^[@`,[\]{}#&*!|>'"%]/u;
const leadingReservedWordPattern = /^[-?:](?: |$)/u;
const controlCharacterPattern = /[\n\t]/u;

const indentUnit = '  ';

// Decides whether a string must be quoted under YAML's core schema, matching js-yaml
const needsQuote = (value) => {
  if (value === '') {
    return true;
  }
  if (value.trim() !== value) {
    return true;
  }
  if (reservedScalars.has(value)) {
    return true;
  }
  if (integerPattern.test(value) || floatPattern.test(value)) {
    return true;
  }
  if (
    leadingIndicatorPattern.test(value) ||
    leadingReservedWordPattern.test(value)
  ) {
    return true;
  }
  if (value.includes(': ') || value.includes(' #')) {
    return true;
  }
  if (controlCharacterPattern.test(value)) {
    return true;
  }
  return false;
};

// Single quotes are js-yaml's default style, so only the quote itself is escaped
const singleQuote = (value) => {
  return `'${value.replaceAll("'", "''")}'`;
};

// Reserved for values with control characters a single-quoted scalar cannot represent
const doubleQuote = (value) => {
  const escaped = value
    .replaceAll('\\', '\\\\')
    .replaceAll('"', '\\"')
    .replaceAll('\n', '\\n')
    .replaceAll('\t', '\\t');
  return `"${escaped}"`;
};

// Reverses the escapes emitted by `doubleQuote`, decoded in a single scan
const doubleQuoteEscapes = { '\\': '\\', '"': '"', n: '\n', t: '\t' };
const doubleQuoteEscapePattern = /\\(?<escaped>[\\"nt])/gu;

/** Strips surrounding quotes and their escapes from a YAML scalar. */
export const unquote = (rawValue) => {
  const value = rawValue.trim();
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replaceAll("''", "'");
  }
  if (value.startsWith('"') && value.endsWith('"')) {
    return value
      .slice(1, -1)
      .replaceAll(doubleQuoteEscapePattern, (_, escaped) => {
        return doubleQuoteEscapes[escaped];
      });
  }
  return value;
};

const formatScalar = (value) => {
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (!needsQuote(value)) {
    return value;
  }
  return controlCharacterPattern.test(value)
    ? doubleQuote(value)
    : singleQuote(value);
};

const emitSequence = (sequence, depth, lines) => {
  const padding = indentUnit.repeat(depth);
  for (const item of sequence) {
    const isContainer = item !== null && typeof item === 'object';
    if (isContainer && !isEmptyContainer(item)) {
      const start = lines.length;
      emitNode(item, depth + 1, lines);
      lines[start] =
        `${padding}- ${lines[start].slice((depth + 1) * indentUnit.length)}`;
    } else {
      lines.push(`${padding}- ${formatNode(item)}`);
    }
  }
};

const emitMapping = (mapping, depth, lines) => {
  const padding = indentUnit.repeat(depth);
  for (const [key, value] of Object.entries(mapping)) {
    const formattedKey = formatScalar(key);
    const isContainer = value !== null && typeof value === 'object';
    if (isContainer && !isEmptyContainer(value)) {
      lines.push(`${padding}${formattedKey}:`);
      emitNode(value, depth + 1, lines);
    } else {
      lines.push(`${padding}${formattedKey}: ${formatNode(value)}`);
    }
  }
};

const isEmptyContainer = (value) => {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return Object.keys(value).length === 0;
};

// Renders an empty container inline, matching YAML flow notation
const formatNode = (value) => {
  if (value !== null && typeof value === 'object') {
    return Array.isArray(value) ? '[]' : '{}';
  }
  return formatScalar(value);
};

const emitNode = (value, depth, lines) => {
  if (Array.isArray(value)) {
    emitSequence(value, depth, lines);
  } else {
    emitMapping(value, depth, lines);
  }
};

/**
 * Serialises a value to block YAML, separating top-level entries with a blank line.
 *
 * NOTE: Only use this function when using the package `yaml` is not possible.
 */
export const stringify = (value) => {
  const lines = [];
  for (const [key, entryValue] of Object.entries(value)) {
    if (lines.length > 0) {
      lines.push('');
    }
    emitMapping({ [key]: entryValue }, 0, lines);
  }
  return `${lines.join('\n')}\n`;
};

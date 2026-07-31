export interface JSONStats {
  objectsCount: number;
  arraysCount: number;
  keysCount: number;
  linesCount: number;
  charsCount: number;
  fileSizeBytes: number;
  maxDepth: number;
  numbersCount: number;
  stringsCount: number;
  booleansCount: number;
  nullsCount: number;
}

export interface TreeNode {
  id: string;
  key: string;
  value: any;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  path: string;
  childCount?: number;
  children?: TreeNode[];
  line?: number;
}

/**
 * Calculates rich JSON statistics instantly from raw JSON string
 */
export function calculateJSONStats(jsonStr: string): JSONStats {
  const bytes = new Blob([jsonStr]).size;
  const lines = jsonStr ? jsonStr.split('\n').length : 0;
  const chars = jsonStr.length;

  const stats: JSONStats = {
    objectsCount: 0,
    arraysCount: 0,
    keysCount: 0,
    linesCount: lines,
    charsCount: chars,
    fileSizeBytes: bytes,
    maxDepth: 0,
    numbersCount: 0,
    stringsCount: 0,
    booleansCount: 0,
    nullsCount: 0,
  };

  if (!jsonStr.trim()) return stats;

  try {
    const parsed = JSON.parse(jsonStr);

    const traverse = (val: any, currentDepth: number) => {
      if (currentDepth > stats.maxDepth) {
        stats.maxDepth = currentDepth;
      }

      if (val === null) {
        stats.nullsCount++;
      } else if (Array.isArray(val)) {
        stats.arraysCount++;
        val.forEach(item => traverse(item, currentDepth + 1));
      } else if (typeof val === 'object') {
        stats.objectsCount++;
        const keys = Object.keys(val);
        stats.keysCount += keys.length;
        keys.forEach(k => traverse(val[k], currentDepth + 1));
      } else if (typeof val === 'number') {
        stats.numbersCount++;
      } else if (typeof val === 'string') {
        stats.stringsCount++;
      } else if (typeof val === 'boolean') {
        stats.booleansCount++;
      }
    };

    traverse(parsed, 1);
  } catch {
    // If parsing fails, stats remain safely calculated based on text metrics
  }

  return stats;
}

/**
 * Converts a parsed JS object/array into a tree data structure
 */
export function buildJSONTree(
  val: any,
  key = 'root',
  path = '',
  idPrefix = 'node'
): TreeNode {
  const currentPath = path ? path : key === 'root' ? '' : key;

  if (val === null) {
    return {
      id: idPrefix,
      key,
      value: 'null',
      type: 'null',
      path: currentPath,
    };
  }

  if (Array.isArray(val)) {
    const children: TreeNode[] = val.map((item, index) => {
      const childKey = `[${index}]`;
      const childPath = currentPath ? `${currentPath}[${index}]` : `[${index}]`;
      return buildJSONTree(item, childKey, childPath, `${idPrefix}_${index}`);
    });

    return {
      id: idPrefix,
      key,
      value: val,
      type: 'array',
      path: currentPath,
      childCount: val.length,
      children,
    };
  }

  if (typeof val === 'object') {
    const keys = Object.keys(val);
    const children: TreeNode[] = keys.map((childKey, index) => {
      const childPath = currentPath ? `${currentPath}.${childKey}` : childKey;
      return buildJSONTree(val[childKey], childKey, childPath, `${idPrefix}_${index}`);
    });

    return {
      id: idPrefix,
      key,
      value: val,
      type: 'object',
      path: currentPath,
      childCount: keys.length,
      children,
    };
  }

  let type: TreeNode['type'] = 'string';
  if (typeof val === 'number') type = 'number';
  if (typeof val === 'boolean') type = 'boolean';

  return {
    id: idPrefix,
    key,
    value: val,
    type,
    path: currentPath,
  };
}

/**
 * Locates the line number for a specific JSON Path inside a JSON string
 */
export function findLineForPath(jsonStr: string, path: string): number {
  if (!jsonStr.trim() || !path) return 1;

  const lines = jsonStr.split('\n');
  const pathParts = path.split('.').flatMap(p => p.split('[').map(s => s.replace(']', ''))).filter(Boolean);

  if (pathParts.length === 0) return 1;
  const lastKey = pathParts[pathParts.length - 1];

  for (let i = 0; i < lines.length; i++) {
    const lineStr = lines[i];
    if (lineStr.includes(`"${lastKey}"`) || lineStr.includes(`'${lastKey}'`)) {
      return i + 1;
    }
  }

  return 1;
}

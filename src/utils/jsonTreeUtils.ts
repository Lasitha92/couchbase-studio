export interface JsonMatch {
  index: number;
  path: string;
  target: "key" | "value";
  keyOrIndex: string | number;
  charOffset: number;
  length: number;
  ancestorPaths: string[];
}

export function findJsonMatches(
  data: unknown,
  query: string,
  isCaseSensitive: boolean
): {
  matches: JsonMatch[];
  matchMap: Map<string, JsonMatch[]>;
  ancestorPathsToExpand: Set<string>;
} {
  const matches: JsonMatch[] = [];
  const matchMap = new Map<string, JsonMatch[]>();
  const ancestorPathsToExpand = new Set<string>();

  if (!query || query.trim() === "") {
    return { matches, matchMap, ancestorPathsToExpand };
  }

  const searchTerm = isCaseSensitive ? query : query.toLowerCase();

  function scanString(
    text: string,
    path: string,
    target: "key" | "value",
    keyOrIndex: string | number,
    ancestors: string[]
  ) {
    const compText = isCaseSensitive ? text : text.toLowerCase();
    let startIdx = 0;
    while ((startIdx = compText.indexOf(searchTerm, startIdx)) !== -1) {
      const match: JsonMatch = {
        index: matches.length,
        path,
        target,
        keyOrIndex,
        charOffset: startIdx,
        length: query.length,
        ancestorPaths: [...ancestors],
      };
      matches.push(match);

      const mapKey = `${path}:${target}`;
      if (!matchMap.has(mapKey)) {
        matchMap.set(mapKey, []);
      }
      matchMap.get(mapKey)!.push(match);

      for (const p of ancestors) {
        ancestorPathsToExpand.add(p);
      }
      ancestorPathsToExpand.add(path);

      startIdx += searchTerm.length;
    }
  }

  function traverse(
    val: unknown,
    currentPath: string,
    keyOrIndex: string | number | null,
    ancestors: string[]
  ) {
    if (keyOrIndex !== null && typeof keyOrIndex === "string") {
      scanString(keyOrIndex, currentPath, "key", keyOrIndex, ancestors);
    }

    if (val === null || val === undefined) {
      scanString(String(val), currentPath, "value", keyOrIndex ?? "", ancestors);
    } else if (typeof val === "string") {
      scanString(val, currentPath, "value", keyOrIndex ?? "", ancestors);
    } else if (typeof val === "number" || typeof val === "boolean") {
      scanString(String(val), currentPath, "value", keyOrIndex ?? "", ancestors);
    } else if (Array.isArray(val)) {
      val.forEach((item, idx) => {
        const childPath = currentPath ? `${currentPath}.${idx}` : `${idx}`;
        traverse(item, childPath, idx, [...ancestors, currentPath]);
      });
    } else if (typeof val === "object") {
      Object.entries(val as Record<string, unknown>).forEach(([k, item]) => {
        const childPath = currentPath ? `${currentPath}.${k}` : k;
        traverse(item, childPath, k, [...ancestors, currentPath]);
      });
    }
  }

  traverse(data, "", null, [""]);
  return { matches, matchMap, ancestorPathsToExpand };
}

export function getAllContainerPaths(data: unknown): Set<string> {
  const paths = new Set<string>();
  function collect(val: unknown, currentPath: string) {
    if (val !== null && typeof val === "object") {
      paths.add(currentPath);
      if (Array.isArray(val)) {
        val.forEach((item, idx) => {
          collect(item, currentPath ? `${currentPath}.${idx}` : `${idx}`);
        });
      } else {
        Object.entries(val as Record<string, unknown>).forEach(([k, item]) => {
          collect(item, currentPath ? `${currentPath}.${k}` : k);
        });
      }
    }
  }
  collect(data, "");
  return paths;
}

export function getInitialExpandedPaths(
  data: unknown,
  maxDepth = 2
): Set<string> {
  const paths = new Set<string>();
  function collect(val: unknown, currentPath: string, depth: number) {
    if (depth <= maxDepth && val !== null && typeof val === "object") {
      paths.add(currentPath);
      if (Array.isArray(val)) {
        val.forEach((item, idx) => {
          collect(
            item,
            currentPath ? `${currentPath}.${idx}` : `${idx}`,
            depth + 1
          );
        });
      } else {
        Object.entries(val as Record<string, unknown>).forEach(([k, item]) => {
          collect(
            item,
            currentPath ? `${currentPath}.${k}` : k,
            depth + 1
          );
        });
      }
    }
  }
  collect(data, "", 0);
  return paths;
}

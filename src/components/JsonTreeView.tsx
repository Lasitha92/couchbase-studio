import React from "react";
import { Box, Typography } from "@mui/material";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { JsonMatch } from "../utils/jsonTreeUtils";

interface HighlightedTextProps {
  text: string;
  path: string;
  target: "key" | "value";
  matchMap: Map<string, JsonMatch[]>;
  activeMatchIndex: number;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  path,
  target,
  matchMap,
  activeMatchIndex,
}) => {
  const mapKey = `${path}:${target}`;
  const matches = matchMap.get(mapKey);

  if (!matches || matches.length === 0) {
    return <span>{text}</span>;
  }

  const sortedMatches = [...matches].sort((a, b) => a.charOffset - b.charOffset);
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  sortedMatches.forEach((m) => {
    if (m.charOffset > lastIndex) {
      elements.push(text.substring(lastIndex, m.charOffset));
    }
    const isCurrentActive = m.index === activeMatchIndex;
    elements.push(
      <mark
        key={`match-${m.index}`}
        id={`json-match-${m.index}`}
        style={{
          backgroundColor: isCurrentActive ? "#ff9800" : "#fff59d",
          color: isCurrentActive ? "#000" : "inherit",
          fontWeight: isCurrentActive ? "bold" : "inherit",
          borderRadius: "2px",
          padding: "0 2px",
          outline: isCurrentActive ? "2px solid #e65100" : "none",
          boxShadow: isCurrentActive
            ? "0 0 5px rgba(255, 152, 0, 0.9)"
            : "none",
          transition: "all 0.15s ease-in-out",
        }}
      >
        {text.substring(m.charOffset, m.charOffset + m.length)}
      </mark>
    );
    lastIndex = m.charOffset + m.length;
  });

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return <>{elements}</>;
};

interface JsonNodeProps {
  keyName?: string | number;
  value: unknown;
  path: string;
  level: number;
  isLast: boolean;
  expandedPaths: Set<string>;
  onTogglePath: (path: string) => void;
  matchMap: Map<string, JsonMatch[]>;
  activeMatchIndex: number;
}

const JsonNode: React.FC<JsonNodeProps> = ({
  keyName,
  value,
  path,
  level,
  isLast,
  expandedPaths,
  onTogglePath,
  matchMap,
  activeMatchIndex,
}) => {
  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);
  const isExpanded = expandedPaths.has(path);

  const renderKey = () => {
    if (keyName === undefined) return null;
    return (
      <Box component="span" sx={{ color: "#0550ae", fontWeight: 500, mr: 0.5 }}>
        {typeof keyName === "string" ? (
          <>
            <span>"</span>
            <HighlightedText
              text={keyName}
              path={path}
              target="key"
              matchMap={matchMap}
              activeMatchIndex={activeMatchIndex}
            />
            <span>"</span>
          </>
        ) : (
          <span style={{ color: "#6e7781" }}>{keyName}</span>
        )}
        <span style={{ color: "#24292f", marginRight: "4px" }}>:</span>
      </Box>
    );
  };

  if (isObject) {
    const entries = isArray
      ? (value as unknown[]).map((v, i) => [i, v] as const)
      : Object.entries(value as Record<string, unknown>);
    const count = entries.length;
    const openBracket = isArray ? "[" : "{";
    const closeBracket = isArray ? "]" : "}";

    return (
      <Box sx={{ fontFamily: "monospace", fontSize: "13px", lineHeight: "22px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.03)" },
            borderRadius: "4px",
            py: "1px",
          }}
          onClick={() => onTogglePath(path)}
        >
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 16,
              height: 16,
              mr: 0.5,
              color: "#57606a",
              flexShrink: 0,
            }}
          >
            {isExpanded ? (
              <FaChevronDown size={10} />
            ) : (
              <FaChevronRight size={10} />
            )}
          </Box>
          {renderKey()}
          <span style={{ color: "#24292f", fontWeight: 600 }}>{openBracket}</span>
          {!isExpanded && (
            <Typography
              component="span"
              sx={{
                fontSize: "11px",
                color: "#6e7781",
                bgcolor: "#f6f8fa",
                border: "1px solid #d0d7de",
                borderRadius: "10px",
                px: 1,
                py: "1px",
                mx: 0.5,
                userSelect: "none",
              }}
            >
              {isArray ? `${count} items` : `${count} keys`}
            </Typography>
          )}
          {!isExpanded && (
            <span style={{ color: "#24292f", fontWeight: 600 }}>
              {closeBracket}
              {!isLast && <span style={{ color: "#6e7781" }}>,</span>}
            </span>
          )}
        </Box>

        {isExpanded && (
          <Box
            sx={{
              pl: 2.5,
              ml: 1,
              borderLeft: "1px dashed #d0d7de",
            }}
          >
            {entries.map(([k, childVal], idx) => {
              const childPath = path ? `${path}.${k}` : `${k}`;
              return (
                <JsonNode
                  key={String(k)}
                  keyName={k}
                  value={childVal}
                  path={childPath}
                  level={level + 1}
                  isLast={idx === entries.length - 1}
                  expandedPaths={expandedPaths}
                  onTogglePath={onTogglePath}
                  matchMap={matchMap}
                  activeMatchIndex={activeMatchIndex}
                />
              );
            })}
          </Box>
        )}

        {isExpanded && (
          <Box sx={{ pl: 2.5, ml: 1 }}>
            <span style={{ color: "#24292f", fontWeight: 600 }}>
              {closeBracket}
              {!isLast && <span style={{ color: "#6e7781" }}>,</span>}
            </span>
          </Box>
        )}
      </Box>
    );
  }

  // Primitive Leaf Node
  const renderValue = () => {
    if (value === null) {
      return (
        <span style={{ color: "#6e7781", fontStyle: "italic" }}>
          <HighlightedText
            text="null"
            path={path}
            target="value"
            matchMap={matchMap}
            activeMatchIndex={activeMatchIndex}
          />
        </span>
      );
    }
    if (value === undefined) {
      return (
        <span style={{ color: "#6e7781", fontStyle: "italic" }}>
          <HighlightedText
            text="undefined"
            path={path}
            target="value"
            matchMap={matchMap}
            activeMatchIndex={activeMatchIndex}
          />
        </span>
      );
    }
    if (typeof value === "string") {
      return (
        <span style={{ color: "#0a3069", wordBreak: "break-all" }}>
          <span>"</span>
          <HighlightedText
            text={value}
            path={path}
            target="value"
            matchMap={matchMap}
            activeMatchIndex={activeMatchIndex}
          />
          <span>"</span>
        </span>
      );
    }
    if (typeof value === "number") {
      return (
        <span style={{ color: "#0969da", fontWeight: 500 }}>
          <HighlightedText
            text={String(value)}
            path={path}
            target="value"
            matchMap={matchMap}
            activeMatchIndex={activeMatchIndex}
          />
        </span>
      );
    }
    if (typeof value === "boolean") {
      return (
        <span style={{ color: "#8250df", fontWeight: 600 }}>
          <HighlightedText
            text={String(value)}
            path={path}
            target="value"
            matchMap={matchMap}
            activeMatchIndex={activeMatchIndex}
          />
        </span>
      );
    }
    return (
      <HighlightedText
        text={String(value)}
        path={path}
        target="value"
        matchMap={matchMap}
        activeMatchIndex={activeMatchIndex}
      />
    );
  };

  return (
    <Box
      sx={{
        fontFamily: "monospace",
        fontSize: "13px",
        lineHeight: "22px",
        display: "flex",
        alignItems: "flex-start",
        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" },
        borderRadius: "4px",
        py: "1px",
      }}
    >
      <Box sx={{ width: 16, mr: 0.5, flexShrink: 0 }} />
      <Box sx={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center" }}>
        {renderKey()}
        {renderValue()}
        {!isLast && <span style={{ color: "#6e7781" }}>,</span>}
      </Box>
    </Box>
  );
};

export interface JsonTreeViewProps {
  data: unknown;
  matchMap: Map<string, JsonMatch[]>;
  activeMatchIndex: number;
  expandedPaths: Set<string>;
  onTogglePath: (path: string) => void;
}

const JsonTreeView: React.FC<JsonTreeViewProps> = ({
  data,
  matchMap,
  activeMatchIndex,
  expandedPaths,
  onTogglePath,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#ffffff",
        borderRadius: "6px",
        fontFamily:
          'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
        overflow: "auto",
      }}
    >
      <JsonNode
        value={data}
        path=""
        level={0}
        isLast={true}
        expandedPaths={expandedPaths}
        onTogglePath={onTogglePath}
        matchMap={matchMap}
        activeMatchIndex={activeMatchIndex}
      />
    </Box>
  );
};

export default JsonTreeView;

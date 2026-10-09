import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
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
          color: "#000000",
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
  isDark: boolean;
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
  isDark,
}) => {
  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);
  const isExpanded = expandedPaths.has(path);

  // Palette colors depending on mode
  const keyColor = isDark ? "#79c0ff" : "#0550ae";
  const stringColor = isDark ? "#7ee787" : "#0a3069";
  const numberColor = isDark ? "#d2a8ff" : "#0969da";
  const booleanColor = isDark ? "#ff7b72" : "#8250df";
  const nullColor = isDark ? "#8b949e" : "#6e7781";
  const punctuationColor = isDark ? "#e6edf3" : "#24292f";
  const indentColor = isDark ? "rgba(255, 255, 255, 0.12)" : "#d0d7de";

  const renderKey = () => {
    if (keyName === undefined) return null;
    return (
      <Box component="span" sx={{ color: keyColor, fontWeight: 500, mr: 0.5 }}>
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
          <span style={{ color: nullColor }}>{keyName}</span>
        )}
        <span style={{ color: punctuationColor, marginRight: "4px" }}>:</span>
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
            "&:hover": {
              bgcolor: isDark
                ? "rgba(255, 255, 255, 0.04)"
                : "rgba(0, 0, 0, 0.03)",
            },
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
              color: isDark ? "#8b949e" : "#57606a",
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
          <span style={{ color: punctuationColor, fontWeight: 600 }}>
            {openBracket}
          </span>
          {!isExpanded && (
            <Typography
              component="span"
              sx={{
                fontSize: "11px",
                color: nullColor,
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.06)"
                  : "#f6f8fa",
                border: "1px solid",
                borderColor: indentColor,
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
            <span style={{ color: punctuationColor, fontWeight: 600 }}>
              {closeBracket}
              {!isLast && <span style={{ color: nullColor }}>,</span>}
            </span>
          )}
        </Box>

        {isExpanded && (
          <Box
            sx={{
              pl: 2.5,
              ml: 1,
              borderLeft: "1px dashed",
              borderColor: indentColor,
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
                  isDark={isDark}
                />
              );
            })}
          </Box>
        )}

        {isExpanded && (
          <Box sx={{ pl: 2.5, ml: 1 }}>
            <span style={{ color: punctuationColor, fontWeight: 600 }}>
              {closeBracket}
              {!isLast && <span style={{ color: nullColor }}>,</span>}
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
        <span style={{ color: nullColor, fontStyle: "italic" }}>
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
        <span style={{ color: nullColor, fontStyle: "italic" }}>
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
        <span style={{ color: stringColor, wordBreak: "break-all" }}>
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
        <span style={{ color: numberColor, fontWeight: 500 }}>
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
        <span style={{ color: booleanColor, fontWeight: 600 }}>
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
        "&:hover": {
          bgcolor: isDark
            ? "rgba(255, 255, 255, 0.04)"
            : "rgba(0, 0, 0, 0.02)",
        },
        borderRadius: "4px",
        py: "1px",
      }}
    >
      <Box sx={{ width: 16, mr: 0.5, flexShrink: 0 }} />
      <Box sx={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center" }}>
        {renderKey()}
        {renderValue()}
        {!isLast && <span style={{ color: nullColor }}>,</span>}
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
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: isDark ? "#14161a" : "#ffffff",
        borderRadius: "6px",
        border: "1px solid",
        borderColor: "divider",
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
        isDark={isDark}
      />
    </Box>
  );
};

export default JsonTreeView;

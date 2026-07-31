'use client';

import React, { useState, useMemo } from 'react';
import { TreeNode, buildJSONTree, findLineForPath } from '@/utils/jsonTreeUtils';
import * as Icons from '@/components/Icons';
import { useToast } from '@/components/ToastProvider';

interface JSONTreeExplorerProps {
  jsonString: string;
  onSelectNodePath?: (path: string, line: number) => void;
}

interface ContextMenuState {
  x: number;
  y: number;
  node: TreeNode;
}

export default function JSONTreeExplorer({
  jsonString,
  onSelectNodePath
}: JSONTreeExplorerProps) {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  // Parse JSON and build root tree node
  const { rootNode, parseError } = useMemo(() => {
    if (!jsonString.trim()) {
      return { rootNode: null, parseError: 'JSON input is empty.' };
    }
    try {
      const parsed = JSON.parse(jsonString);
      return { rootNode: buildJSONTree(parsed), parseError: null };
    } catch (e: any) {
      return { rootNode: null, parseError: e.message || 'Invalid JSON string' };
    }
  }, [jsonString]);

  // Collapse / Expand handlers
  const toggleCollapse = React.useCallback((nodeId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCollapsedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  }, []);

  const handleExpandAll = React.useCallback(() => setCollapsedNodes({}), []);

  const handleCollapseAll = React.useCallback(() => {
    if (!rootNode) return;
    const allCollapsed: Record<string, boolean> = {};
    function markAll(node: TreeNode) {
      if (node.children) {
        allCollapsed[node.id] = true;
        node.children.forEach(markAll);
      }
    }
    markAll(rootNode);
    setCollapsedNodes(allCollapsed);
  }, [rootNode]);

  // Context menu actions
  const handleCopy = React.useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label}: "${text}"`);
    setContextMenu(null);
  }, [showToast]);

  const handleNodeClick = React.useCallback((node: TreeNode) => {
    const line = findLineForPath(jsonString, node.path);
    if (onSelectNodePath) {
      onSelectNodePath(node.path, line);
    }
  }, [jsonString, onSelectNodePath]);

  // Filter check for search query with memoization
  const matchesSearch = React.useCallback((node: TreeNode, query: string): boolean => {
    if (!query) return true;
    const q = query.toLowerCase();
    if (node.key.toLowerCase().includes(q)) return true;
    if (node.path.toLowerCase().includes(q)) return true;
    if (typeof node.value === 'string' && node.value.toLowerCase().includes(q)) return true;
    if (typeof node.value === 'number' && String(node.value).includes(q)) return true;
    if (node.children && node.children.some(child => matchesSearch(child, query))) return true;
    return false;
  }, []);

  // Render individual node recursively
  const renderNode = (node: TreeNode, depth = 0) => {
    if (searchQuery && !matchesSearch(node, searchQuery)) return null;

    const isCollapsed = !!collapsedNodes[node.id];
    const isExpandable = node.type === 'object' || node.type === 'array';

    return (
      <div key={node.id} className="select-none font-mono-calc text-xs sm:text-sm">
        <div
          onClick={() => handleNodeClick(node)}
          onContextMenu={(e) => {
            e.preventDefault();
            setContextMenu({ x: e.clientX, y: e.clientY, node });
          }}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          className="flex items-center justify-between py-1.5 px-2.5 hover:bg-secondary/50 rounded-xl cursor-pointer transition-colors group"
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Collapse Icon */}
            {isExpandable ? (
              <button
                onClick={(e) => toggleCollapse(node.id, e)}
                className="p-1 hover:bg-secondary/70 rounded text-foreground shrink-0"
              >
                <Icons.ChevronRight
                  className={`h-4 w-4 transition-transform duration-150 ${isCollapsed ? '' : 'rotate-90'}`}
                />
              </button>
            ) : (
              <span className="w-5 shrink-0" />
            )}

            {/* Key Name */}
            {node.key !== 'root' && (
              <span className="font-extrabold text-sky-600 dark:text-sky-400 shrink-0">
                {node.key}
                <span className="text-muted-foreground font-normal ml-0.5">:</span>
              </span>
            )}

            {/* Primitive Value or Summary */}
            {isExpandable ? (
              <span className="text-muted-foreground text-xs font-semibold">
                {node.type === 'object' ? '{...}' : '[...]'}
                <span className="ml-2 px-2 py-0.5 rounded-md bg-secondary/60 border border-border/60 text-xs font-extrabold text-foreground">
                  {node.childCount} {node.type === 'object' ? 'keys' : 'items'}
                </span>
              </span>
            ) : (
              <span className={`truncate font-bold text-xs sm:text-sm ${
                node.type === 'string'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : node.type === 'number'
                  ? 'text-amber-600 dark:text-amber-400'
                  : node.type === 'boolean'
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-rose-500'
              }`}>
                {node.type === 'string' ? `"${node.value}"` : String(node.value)}
              </span>
            )}
          </div>

          {/* Quick Copy JSON Path Button */}
          {node.path && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(node.path, 'JSON Path');
              }}
              title={`Copy JSON Path: ${node.path}`}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-secondary/60 text-foreground rounded transition-all text-xs flex items-center gap-1 shrink-0 font-bold"
            >
              <Icons.Copy className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Copy Path</span>
            </button>
          )}
        </div>

        {/* Children Render */}
        {isExpandable && !isCollapsed && node.children && (
          <div className="relative">
            <div className="absolute left-[calc(var(--depth)*20px+16px)] top-0 bottom-0 w-px bg-border/60" />
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-card border-2 border-border/80 rounded-2xl overflow-hidden shadow-premium-sm relative">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-secondary/25 border-b border-border/80">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[160px]">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes or path..."
            className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm rounded-xl bg-card border border-border focus:outline-none focus:border-primary text-foreground font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Icons.X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Expand / Collapse Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExpandAll}
            title="Expand All Nodes (Ctrl+Shift+T)"
            className="px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-bold hover:bg-secondary/40 transition-all text-foreground"
          >
            Expand All
          </button>
          <button
            onClick={handleCollapseAll}
            title="Collapse All Nodes (Ctrl+Alt+T)"
            className="px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-bold hover:bg-secondary/40 transition-all text-foreground"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Main Tree Canvas */}
      <div className="flex-1 overflow-y-auto p-3" onClick={() => setContextMenu(null)}>
        {parseError ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-sm text-muted-foreground font-semibold gap-2">
            <Icons.AlertCircle className="h-7 w-7 text-amber-500" />
            <span>Cannot build JSON Tree: {parseError}</span>
          </div>
        ) : rootNode ? (
          renderNode(rootNode)
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground italic font-medium">
            JSON input is empty.
          </div>
        )}
      </div>

      {/* Context Menu Popup */}
      {contextMenu && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-50 bg-card border-2 border-border shadow-xl rounded-xl p-1.5 text-xs sm:text-sm font-semibold min-w-[180px] animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleCopy(contextMenu.node.key, 'Key')}
            className="w-full text-left px-3 py-2 hover:bg-secondary/50 rounded-lg flex items-center justify-between text-foreground"
          >
            <span>Copy Key</span>
            <Icons.Copy className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => handleCopy(typeof contextMenu.node.value === 'object' ? JSON.stringify(contextMenu.node.value) : String(contextMenu.node.value), 'Value')}
            className="w-full text-left px-3 py-2 hover:bg-secondary/50 rounded-lg flex items-center justify-between text-foreground"
          >
            <span>Copy Value</span>
            <Icons.Copy className="h-4 w-4 text-muted-foreground" />
          </button>
          {contextMenu.node.path && (
            <button
              onClick={() => handleCopy(contextMenu.node.path, 'JSON Path')}
              className="w-full text-left px-3 py-2 hover:bg-secondary/50 rounded-lg flex items-center justify-between font-bold text-primary"
            >
              <span>Copy JSON Path</span>
              <Icons.Copy className="h-4 w-4 text-primary" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

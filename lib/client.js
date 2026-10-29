window.__ModuleLoader__.load({
  id: "dsh-explorer",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react6 = require("react");

// src/client/ExplorerView.tsx
var import_react5 = __toESM(require("react"), 1);

// src/client/explorer.module.css
var cssText = ".dsh-exp-container {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  width: 100%;\n  background-color: var(--dsh-bg-base, #181818);\n  color: var(--dsh-fg-base, #cccccc);\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n  font-size: var(--dsh-font-size, 13px);\n  user-select: none;\n  overflow: hidden;\n  box-sizing: border-box;\n  position: relative;\n}\n\n.dsh-exp-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 6px 12px;\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  color: var(--dsh-fg-muted, #858585);\n  border-bottom: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.08));\n  flex-shrink: 0;\n}\n\n.dsh-exp-headerTitle {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dsh-exp-headerActions {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n\n.dsh-exp-iconBtn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 22px;\n  height: 22px;\n  border-radius: 4px;\n  border: none;\n  background: transparent;\n  color: inherit;\n  cursor: pointer;\n  opacity: 0.75;\n  transition: opacity 0.15s cubic-bezier(0.2, 0, 0, 1), background-color 0.15s cubic-bezier(0.2, 0, 0, 1), transform 0.12s ease;\n}\n\n.dsh-exp-iconBtn:hover {\n  opacity: 1;\n  background-color: var(--dsh-bg-hover, rgba(255, 255, 255, 0.1));\n}\n\n.dsh-exp-iconBtn:active {\n  transform: scale(0.92);\n}\n\n.dsh-exp-iconBtnActive {\n  background-color: var(--dsh-bg-active, rgba(255, 255, 255, 0.15));\n  opacity: 1;\n}\n\n.dsh-exp-searchBar {\n  padding: 6px 10px;\n  border-bottom: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.06));\n  background-color: var(--dsh-bg-subtle, rgba(0, 0, 0, 0.15));\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  flex-shrink: 0;\n  animation: searchSlide 0.16s cubic-bezier(0, 0, 0.2, 1);\n}\n\n@keyframes searchSlide {\n  from {\n    opacity: 0;\n    transform: translateY(-6px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n.dsh-exp-searchInput {\n  flex: 1;\n  background: var(--dsh-input-bg, rgba(255, 255, 255, 0.06));\n  border: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.12));\n  border-radius: 4px;\n  color: inherit;\n  padding: 4px 8px;\n  font-size: 12px;\n  outline: none;\n  transition: border-color 0.15s ease;\n}\n\n.dsh-exp-searchInput:focus {\n  border-color: #007fd4;\n}\n\n.dsh-exp-clearSearchBtn {\n  background: transparent;\n  border: none;\n  color: inherit;\n  cursor: pointer;\n  opacity: 0.6;\n  font-size: 11px;\n  transition: opacity 0.12s ease;\n}\n\n.dsh-exp-clearSearchBtn:hover {\n  opacity: 1;\n}\n\n.dsh-exp-treeBody {\n  flex: 1;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 4px 0;\n  outline: none;\n}\n\n.dsh-exp-row {\n  display: flex;\n  align-items: center;\n  height: var(--dsh-row-height, 24px);\n  line-height: var(--dsh-row-height, 24px);\n  padding-right: 8px;\n  cursor: pointer;\n  position: relative;\n  transition: background-color 0.12s cubic-bezier(0.2, 0, 0, 1);\n}\n\n.dsh-exp-row:hover {\n  background-color: var(--dsh-row-hover, rgba(255, 255, 255, 0.05));\n}\n\n.dsh-exp-rowSelected {\n  background-color: var(--dsh-row-selected, rgba(0, 122, 204, 0.25)) !important;\n}\n\n.dsh-exp-rowFocused {\n  outline: 1px solid #007fd4;\n  outline-offset: -1px;\n}\n\n.dsh-exp-indentGuide {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: 1px;\n  background-color: rgba(255, 255, 255, 0.06);\n}\n\n.dsh-exp-chevron {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: var(--dsh-icon-size, 16px);\n  height: var(--dsh-icon-size, 16px);\n  margin-right: 2px;\n  color: inherit;\n  opacity: 0.6;\n  transition: transform 0.22s cubic-bezier(0.2, 0, 0, 1), opacity 0.15s ease;\n  flex-shrink: 0;\n  will-change: transform;\n}\n\n.dsh-exp-chevronExpanded {\n  transform: rotate(90deg);\n}\n\n.dsh-exp-chevronHidden {\n  visibility: hidden;\n}\n\n/* Motion Collapse: CSS Grid animation for silky smooth folder expanding & collapsing */\n.dsh-exp-folderGroup {\n  display: flex;\n  flex-direction: column;\n}\n\n.dsh-exp-folderChildren {\n  display: grid;\n  grid-template-rows: 0fr;\n  transition: grid-template-rows 0.22s cubic-bezier(0.2, 0, 0, 1), opacity 0.18s ease;\n  opacity: 0;\n  overflow: hidden;\n  will-change: grid-template-rows, opacity;\n}\n\n.dsh-exp-folderChildrenOpen {\n  grid-template-rows: 1fr;\n  opacity: 1;\n}\n\n.dsh-exp-folderChildrenClosed {\n  grid-template-rows: 0fr;\n  opacity: 0;\n  pointer-events: none;\n}\n\n.dsh-exp-folderChildrenInner {\n  overflow: hidden;\n  min-height: 0;\n}\n\n.dsh-exp-iconWrap {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: var(--dsh-icon-size, 18px);\n  height: var(--dsh-icon-size, 18px);\n  margin-right: 6px;\n  flex-shrink: 0;\n}\n\n.dsh-exp-label {\n  flex: 1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: var(--dsh-font-size, 13px);\n}\n\n.dsh-exp-labelDimmed {\n  opacity: 0.5;\n}\n\n.dsh-exp-gitBadge {\n  font-size: 10px;\n  font-weight: 700;\n  margin-left: auto;\n  margin-right: 4px;\n  padding: 1px 5px;\n  border-radius: 3px;\n  line-height: 1;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  letter-spacing: 0.04em;\n}\n\n.dsh-exp-gitModified {\n  color: #e2c08d !important;\n}\n\n.dsh-exp-gitUntracked {\n  color: #73c991 !important;\n}\n\n.dsh-exp-gitDeleted {\n  color: #e5534b !important;\n}\n\n.dsh-exp-gitBadge.dsh-exp-gitModified {\n  background-color: rgba(226, 192, 141, 0.18);\n}\n\n.dsh-exp-gitBadge.dsh-exp-gitUntracked {\n  background-color: rgba(115, 201, 145, 0.18);\n}\n\n.dsh-exp-gitBadge.dsh-exp-gitDeleted {\n  background-color: rgba(229, 83, 75, 0.18);\n}\n\n.dsh-exp-hoverActions {\n  display: none;\n  align-items: center;\n  gap: 2px;\n  margin-left: 4px;\n  flex-shrink: 0;\n  animation: actionsFadeIn 0.12s ease;\n}\n\n@keyframes actionsFadeIn {\n  from {\n    opacity: 0;\n    transform: translateX(4px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n\n.dsh-exp-row:hover .dsh-exp-hoverActions {\n  display: flex;\n}\n\n.dsh-exp-actionBtn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 20px;\n  height: 20px;\n  border-radius: 3px;\n  border: none;\n  background: transparent;\n  color: inherit;\n  cursor: pointer;\n  opacity: 0.7;\n  padding: 0;\n  transition: opacity 0.12s ease, background-color 0.12s ease, transform 0.12s ease;\n}\n\n.dsh-exp-actionBtn:hover {\n  opacity: 1;\n  background-color: rgba(255, 255, 255, 0.15);\n  transform: scale(1.08);\n}\n\n.dsh-exp-actionBtn:active {\n  transform: scale(0.92);\n}\n\n.dsh-exp-inlineInput {\n  flex: 1;\n  background: var(--dsh-input-bg, #252526);\n  border: 1px solid #007fd4;\n  border-radius: 2px;\n  color: inherit;\n  padding: 1px 4px;\n  font-size: 12px;\n  outline: none;\n  height: 20px;\n}\n\n.dsh-exp-contextMenu {\n  position: fixed;\n  background: var(--dsh-menu-bg, #252526);\n  border: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.1));\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);\n  border-radius: 6px;\n  padding: 4px 0;\n  z-index: 10000;\n  min-width: 180px;\n  font-size: 12px;\n  color: var(--dsh-fg-base, #cccccc);\n  animation: contextMenuPop 0.12s cubic-bezier(0, 0, 0.2, 1);\n  transform-origin: top left;\n}\n\n@keyframes contextMenuPop {\n  from {\n    opacity: 0;\n    transform: scale(0.96) translateY(-4px);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1) translateY(0);\n  }\n}\n\n.dsh-exp-menuItem {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 5px 12px;\n  cursor: pointer;\n  transition: background-color 0.1s ease;\n}\n\n.dsh-exp-menuItem:hover {\n  background-color: var(--dsh-menu-hover, #094771);\n  color: #ffffff;\n}\n\n.dsh-exp-menuDivider {\n  height: 1px;\n  background-color: var(--dsh-border, rgba(255, 255, 255, 0.08));\n  margin: 4px 0;\n}\n\n.dsh-exp-menuShortcut {\n  font-size: 10px;\n  opacity: 0.6;\n  margin-left: 16px;\n}\n\n.dsh-exp-emptyState {\n  padding: 24px 16px;\n  text-align: center;\n  opacity: 0.6;\n  font-size: 12px;\n}\n\n/* Motion disable override */\n.dsh-exp-noMotion,\n.dsh-exp-noMotion * {\n  transition: none !important;\n  animation: none !important;\n}\n\n.dsh-exp-noMotion .dsh-exp-chevron,\n.dsh-exp-noMotion .dsh-exp-folderChildren,\n.dsh-exp-noMotion .dsh-exp-actionBtn,\n.dsh-exp-noMotion .dsh-exp-hoverActions,\n.dsh-exp-noMotion .dsh-exp-optionsPopover,\n.dsh-exp-noMotion .dsh-exp-contextMenu {\n  transition: none !important;\n  animation: none !important;\n}\n\n/* Options Popover */\n.dsh-exp-optionsPopover {\n  position: absolute;\n  top: 36px;\n  right: 8px;\n  width: 280px;\n  max-width: calc(100% - 16px);\n  max-height: calc(100% - 48px);\n  background-color: var(--dsh-bg-elevated, #202020);\n  border: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.14));\n  border-radius: 6px;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4);\n  display: flex;\n  flex-direction: column;\n  z-index: 1000;\n  overflow: hidden;\n  animation: popoverFadeIn 0.15s cubic-bezier(0, 0, 0.2, 1);\n}\n\n@keyframes popoverFadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(-6px) scale(0.97);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n}\n\n.dsh-exp-optionsHeader {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 8px 12px;\n  background-color: rgba(0, 0, 0, 0.25);\n  border-bottom: 1px solid var(--dsh-border, rgba(255, 255, 255, 0.08));\n}\n\n.dsh-exp-optionsHeaderTitle {\n  display: flex;\n  align-items: center;\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: 0.05em;\n  color: var(--dsh-fg-muted, #999999);\n}\n\n.dsh-exp-optionsIconBtn {\n  background: transparent;\n  border: none;\n  color: inherit;\n  opacity: 0.7;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 3px;\n  border-radius: 3px;\n  transition: opacity 0.15s ease, background-color 0.15s ease;\n}\n\n.dsh-exp-optionsIconBtn:hover {\n  opacity: 1;\n  background-color: rgba(255, 255, 255, 0.1);\n}\n\n.dsh-exp-optionsBody {\n  overflow-y: auto;\n  padding: 10px 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n\n.dsh-exp-optionsSection {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n\n.dsh-exp-optionsSectionTitle {\n  font-size: 10.5px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  color: var(--dsh-fg-muted, #858585);\n  margin-bottom: 2px;\n}\n\n.dsh-exp-optionsRow {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n\n.dsh-exp-optionsLabelWrap {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n}\n\n.dsh-exp-optionsLabel {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--dsh-fg-base, #cccccc);\n}\n\n.dsh-exp-optionsSubLabel {\n  font-size: 10.5px;\n  color: var(--dsh-fg-muted, #808080);\n}\n\n.dsh-exp-optionsBadge {\n  font-size: 11px;\n  font-weight: 600;\n  padding: 1px 6px;\n  border-radius: 3px;\n  background-color: rgba(255, 255, 255, 0.08);\n  color: var(--dsh-fg-base, #cccccc);\n  font-family: monospace;\n}\n\n.dsh-exp-optionsMiniBtn {\n  background: rgba(255, 255, 255, 0.08);\n  border: none;\n  color: inherit;\n  font-size: 10px;\n  padding: 1px 5px;\n  border-radius: 3px;\n  cursor: pointer;\n  opacity: 0.8;\n  transition: opacity 0.12s ease;\n}\n\n.dsh-exp-optionsMiniBtn:hover {\n  opacity: 1;\n  background: rgba(255, 255, 255, 0.16);\n}\n\n.dsh-exp-optionsSlider {\n  width: 100%;\n  accent-color: #007fd4;\n  cursor: pointer;\n  margin-top: 4px;\n  height: 4px;\n}\n\n.dsh-exp-segmentGroup {\n  display: flex;\n  background: rgba(0, 0, 0, 0.25);\n  border-radius: 4px;\n  padding: 2px;\n  gap: 2px;\n  border: 1px solid rgba(255, 255, 255, 0.06);\n}\n\n.dsh-exp-segmentBtn {\n  flex: 1;\n  border: none;\n  background: transparent;\n  color: inherit;\n  padding: 4px 6px;\n  font-size: 11px;\n  border-radius: 3px;\n  cursor: pointer;\n  text-align: center;\n  opacity: 0.75;\n  transition: all 0.15s ease;\n}\n\n.dsh-exp-segmentBtn:hover {\n  opacity: 1;\n  background: rgba(255, 255, 255, 0.06);\n}\n\n.dsh-exp-segmentBtnActive {\n  background: var(--dsh-bg-active, #007fd4) !important;\n  color: #ffffff !important;\n  opacity: 1;\n  font-weight: 600;\n}\n\n.dsh-exp-switch {\n  position: relative;\n  width: 32px;\n  height: 18px;\n  border-radius: 9px;\n  background: rgba(255, 255, 255, 0.16);\n  cursor: pointer;\n  transition: background 0.2s ease;\n  flex-shrink: 0;\n}\n\n.dsh-exp-switchActive {\n  background: #007fd4;\n}\n\n.dsh-exp-switchKnob {\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  width: 14px;\n  height: 14px;\n  border-radius: 50%;\n  background: #ffffff;\n  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);\n}\n\n.dsh-exp-switchKnobActive {\n  transform: translateX(14px);\n}\n";
if (typeof document !== "undefined") {
  let style = document.getElementById("dsh-explorer-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "dsh-explorer-styles";
    style.textContent = cssText;
    document.head.appendChild(style);
  }
}
var explorer_default = { "folderChildrenClosed": "dsh-exp-folderChildrenClosed", "folderChildrenInner": "dsh-exp-folderChildrenInner", "optionsSectionTitle": "dsh-exp-optionsSectionTitle", "folderChildrenOpen": "dsh-exp-folderChildrenOpen", "optionsHeaderTitle": "dsh-exp-optionsHeaderTitle", "optionsLabelWrap": "dsh-exp-optionsLabelWrap", "segmentBtnActive": "dsh-exp-segmentBtnActive", "switchKnobActive": "dsh-exp-switchKnobActive", "chevronExpanded": "dsh-exp-chevronExpanded", "optionsSubLabel": "dsh-exp-optionsSubLabel", "clearSearchBtn": "dsh-exp-clearSearchBtn", "folderChildren": "dsh-exp-folderChildren", "optionsPopover": "dsh-exp-optionsPopover", "optionsIconBtn": "dsh-exp-optionsIconBtn", "optionsSection": "dsh-exp-optionsSection", "optionsMiniBtn": "dsh-exp-optionsMiniBtn", "headerActions": "dsh-exp-headerActions", "iconBtnActive": "dsh-exp-iconBtnActive", "chevronHidden": "dsh-exp-chevronHidden", "optionsHeader": "dsh-exp-optionsHeader", "optionsSlider": "dsh-exp-optionsSlider", "gitUntracked": "dsh-exp-gitUntracked", "hoverActions": "dsh-exp-hoverActions", "menuShortcut": "dsh-exp-menuShortcut", "optionsLabel": "dsh-exp-optionsLabel", "optionsBadge": "dsh-exp-optionsBadge", "segmentGroup": "dsh-exp-segmentGroup", "switchActive": "dsh-exp-switchActive", "headerTitle": "dsh-exp-headerTitle", "searchInput": "dsh-exp-searchInput", "rowSelected": "dsh-exp-rowSelected", "indentGuide": "dsh-exp-indentGuide", "folderGroup": "dsh-exp-folderGroup", "labelDimmed": "dsh-exp-labelDimmed", "gitModified": "dsh-exp-gitModified", "inlineInput": "dsh-exp-inlineInput", "contextMenu": "dsh-exp-contextMenu", "menuDivider": "dsh-exp-menuDivider", "optionsBody": "dsh-exp-optionsBody", "rowFocused": "dsh-exp-rowFocused", "gitDeleted": "dsh-exp-gitDeleted", "emptyState": "dsh-exp-emptyState", "optionsRow": "dsh-exp-optionsRow", "segmentBtn": "dsh-exp-segmentBtn", "switchKnob": "dsh-exp-switchKnob", "container": "dsh-exp-container", "searchBar": "dsh-exp-searchBar", "actionBtn": "dsh-exp-actionBtn", "treeBody": "dsh-exp-treeBody", "iconWrap": "dsh-exp-iconWrap", "gitBadge": "dsh-exp-gitBadge", "menuItem": "dsh-exp-menuItem", "noMotion": "dsh-exp-noMotion", "iconBtn": "dsh-exp-iconBtn", "chevron": "dsh-exp-chevron", "header": "dsh-exp-header", "switch": "dsh-exp-switch", "label": "dsh-exp-label", "row": "dsh-exp-row" };

// src/client/api.ts
async function fetchTree(sessionId, dir) {
  const params = new URLSearchParams();
  if (sessionId) params.set("sessionId", sessionId);
  if (dir) params.set("dir", dir);
  const res = await fetch(`/dsh-explorer/api/tree?${params.toString()}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  const json = await res.json();
  if (!json.ok) throw new Error(json.message || "Failed to fetch directory");
  return json.listing;
}
async function fetchBatchTree(paths) {
  const res = await fetch("/dsh-explorer/api/batch-tree", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paths })
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.message || "Failed to fetch batch trees");
  return json.results;
}
async function fetchGitStatus(sessionId, dir) {
  const params = new URLSearchParams();
  if (sessionId) params.set("sessionId", sessionId);
  if (dir) params.set("dir", dir);
  const res = await fetch(`/dsh-explorer/api/git-status?${params.toString()}`);
  const json = await res.json();
  if (!json.ok) return { isRepo: false, entries: [] };
  return json.git;
}
async function fetchFileContent(path) {
  const params = new URLSearchParams({ path });
  const res = await fetch(`/dsh-explorer/api/read-file?${params.toString()}`);
  const json = await res.json();
  if (!json.ok) throw new Error(json.message || "Failed to read file");
  return json.text;
}
async function apiCreateNewFile(dir, name) {
  const res = await fetch("/dsh-explorer/api/new-file", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dir, name })
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.message || "Failed to create file");
  return json;
}
async function apiCreateDirectory(dir, name) {
  const res = await fetch("/dsh-explorer/api/mkdir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dir, name })
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.message || "Failed to create folder");
  return json;
}
async function apiRename(path, newName) {
  const res = await fetch("/dsh-explorer/api/rename", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, newName })
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.message || "Failed to rename");
  return json;
}
async function apiDelete(path) {
  const res = await fetch("/dsh-explorer/api/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path })
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.message || "Failed to delete");
}

// src/client/ExplorerHeader.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var ExplorerHeader = ({
  title,
  searchOpen,
  optionsOpen,
  onToggleSearch,
  onToggleOptions,
  onNewFile,
  onNewFolder,
  onRefresh,
  onCollapseAll
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: explorer_default.header, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: explorer_default.headerTitle, title, children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: explorer_default.headerActions, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          className: `${explorer_default.iconBtn} ${searchOpen ? explorer_default.iconBtnActive : ""}`,
          title: "Filter files",
          onClick: onToggleSearch,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" }) })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: explorer_default.iconBtn, title: "New File", onClick: onNewFile, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6L9 1zm0 1.5L12.5 6H9V2.5zM8 8.5V11h1V8.5h2.5v-1H9V5H8v2.5H5.5v1H8z" }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: explorer_default.iconBtn, title: "New Folder", onClick: onNewFolder, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7 2l2 2h5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5zm2.5 6.5H8V6H7v2.5H4.5v1H7V12h1V9.5h2.5v-1z" }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: explorer_default.iconBtn, title: "Refresh", onClick: onRefresh, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M13.65 2.35A7.958 7.958 0 0 0 8 0a8 8 0 1 0 8 8h-2a6 6 0 1 1-1.76-4.24l-2.24 2.24H16V0l-2.35 2.35z" }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: explorer_default.iconBtn, title: "Collapse All Folders", onClick: onCollapseAll, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M1 3.5l1.5-1.5L8 7.5 13.5 2 15 3.5 8 10.5 1 3.5zM1 9.5l1.5-1.5L8 13.5 13.5 8 15 9.5 8 16.5 1 9.5z" }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          className: `${explorer_default.iconBtn} ${optionsOpen ? explorer_default.iconBtnActive : ""}`,
          title: "Explorer Options",
          onClick: onToggleOptions,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" }) })
        }
      )
    ] })
  ] });
};

// src/client/ExplorerSearch.tsx
var import_react = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var ExplorerSearch = ({ value, onChange, onClose }) => {
  const inputRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    inputRef.current?.focus();
  }, []);
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: explorer_default.searchBar, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "input",
      {
        ref: inputRef,
        type: "text",
        className: explorer_default.searchInput,
        placeholder: "Filter by name (fuzzy)...",
        value,
        onChange: (e) => onChange(e.target.value),
        onKeyDown: handleKeyDown
      }
    ),
    value && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: explorer_default.clearSearchBtn, title: "Clear filter", onClick: () => onChange(""), children: "\u2715" })
  ] });
};

// src/client/ExplorerRow.tsx
var import_react2 = require("react");

// src/client/vscode-theme.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function getFileExtension(filename) {
  const at = filename.lastIndexOf(".");
  return at <= 0 ? "" : filename.slice(at + 1).toLowerCase();
}
function getLanguageColor(filename, isDir) {
  if (isDir) return "#dcb67a";
  const ext = getFileExtension(filename);
  const lowerName = filename.toLowerCase();
  if (lowerName === "dockerfile" || lowerName.startsWith("dockerfile.")) return "#2496ed";
  if (lowerName === ".gitignore" || lowerName === ".gitattributes") return "#f14e32";
  if (lowerName === "package.json") return "#cb3837";
  if (lowerName.startsWith(".env")) return "#ecd53f";
  switch (ext) {
    case "ts":
    case "mts":
    case "cts":
      return "#3178c6";
    case "tsx":
      return "#3178c6";
    case "js":
    case "mjs":
    case "cjs":
      return "#f7df1e";
    case "jsx":
      return "#00d8ff";
    case "py":
    case "pyw":
      return "#3572a5";
    case "rs":
      return "#dea584";
    case "go":
      return "#00add8";
    case "c":
    case "h":
      return "#a8b9cc";
    case "cpp":
    case "cc":
    case "cxx":
    case "hpp":
      return "#00599c";
    case "cs":
      return "#178600";
    case "java":
    case "jar":
      return "#b07219";
    case "kt":
    case "kts":
      return "#a97bff";
    case "swift":
      return "#f05138";
    case "php":
      return "#777bb4";
    case "rb":
      return "#cc342d";
    case "html":
    case "htm":
      return "#e34c26";
    case "css":
      return "#42a5f5";
    case "scss":
    case "sass":
      return "#cd6799";
    case "less":
      return "#1d365d";
    case "json":
    case "jsonc":
    case "json5":
      return "#cbcb41";
    case "yaml":
    case "yml":
      return "#cb171e";
    case "toml":
      return "#9c4221";
    case "md":
    case "markdown":
    case "mdx":
      return "#519aba";
    case "sql":
      return "#e38c00";
    case "sh":
    case "bash":
    case "zsh":
      return "#89e051";
    case "ps1":
    case "psm1":
      return "#012456";
    case "svg":
      return "#ff9800";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
    case "ico":
      return "#ab47bc";
    case "zip":
    case "tar":
    case "gz":
    case "7z":
    case "rar":
      return "#ec407a";
    default:
      return "#90a4ae";
  }
}
function renderFileIcon(filename, isDir, isOpen = false, size = 16) {
  if (isDir) {
    const folderColor = isOpen ? "#e5c07b" : "#dcb67a";
    if (isOpen) {
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M1.5 2.5C1.5 1.94772 1.94772 1.5 2.5 1.5H6.29289C6.5581 1.5 6.81249 1.60536 7 1.79289L8.20711 3H13.5C14.0523 3 14.5 3.44772 14.5 4V5H2.5L1.5 2.5Z", fill: folderColor, opacity: "0.8" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M1.5 5.5H14.5L13.5 13.5C13.5 14.0523 13.0523 14.5 12.5 14.5H3.5C2.94772 14.5 2.5 14.0523 2.5 13.5L1.5 5.5Z", fill: folderColor }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M1.5 5.5L2.8 14H13.2L14.5 5.5H1.5Z", fill: "#ffe082", fillOpacity: "0.25" })
      ] });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M1.5 2.5C1.5 1.94772 1.94772 1.5 2.5 1.5H6.29289C6.5581 1.5 6.81249 1.60536 7 1.79289L8.20711 3H13.5C14.0523 3 14.5 3.44772 14.5 4V13.5C14.5 14.0523 14.0523 14.5 13.5 14.5H2.5C1.94772 14.5 1.5 14.0523 1.5 13.5V2.5Z", fill: folderColor }) });
  }
  const ext = getFileExtension(filename);
  const lowerName = filename.toLowerCase();
  const color = getLanguageColor(filename, false);
  if (ext === "ts") {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("rect", { width: "16", height: "16", rx: "2.5", fill: "#3178c6" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("text", { x: "3", y: "12", fill: "#ffffff", fontSize: "9.5", fontWeight: "bold", fontFamily: "monospace", children: "TS" })
    ] });
  }
  if (ext === "tsx") {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("rect", { width: "16", height: "16", rx: "2.5", fill: "#3178c6" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("circle", { cx: "8", cy: "8", r: "2", fill: "#00d8ff" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ellipse", { cx: "8", cy: "8", rx: "5", ry: "2.2", stroke: "#00d8ff", strokeWidth: "0.9", fill: "none" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ellipse", { cx: "8", cy: "8", rx: "5", ry: "2.2", stroke: "#00d8ff", strokeWidth: "0.9", fill: "none", transform: "rotate(60 8 8)" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ellipse", { cx: "8", cy: "8", rx: "5", ry: "2.2", stroke: "#00d8ff", strokeWidth: "0.9", fill: "none", transform: "rotate(120 8 8)" })
    ] });
  }
  if (ext === "js" || ext === "mjs" || ext === "cjs") {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("rect", { width: "16", height: "16", rx: "2.5", fill: "#f7df1e" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("text", { x: "3.5", y: "12", fill: "#000000", fontSize: "9.5", fontWeight: "bold", fontFamily: "monospace", children: "JS" })
    ] });
  }
  if (ext === "jsx") {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("rect", { width: "16", height: "16", rx: "2.5", fill: "#20232a" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("circle", { cx: "8", cy: "8", r: "2", fill: "#00d8ff" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ellipse", { cx: "8", cy: "8", rx: "5", ry: "2.2", stroke: "#00d8ff", strokeWidth: "0.9", fill: "none" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ellipse", { cx: "8", cy: "8", rx: "5", ry: "2.2", stroke: "#00d8ff", strokeWidth: "0.9", fill: "none", transform: "rotate(60 8 8)" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ellipse", { cx: "8", cy: "8", rx: "5", ry: "2.2", stroke: "#00d8ff", strokeWidth: "0.9", fill: "none", transform: "rotate(120 8 8)" })
    ] });
  }
  if (ext === "py") {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M7.9 1.5C5.2 1.5 5.3 2.7 5.3 2.7V4H8V4.4H3.8C2.5 4.4 1.5 5.5 1.5 7.2C1.5 8.9 2.3 9.4 3.3 9.4H4.3V8.1C4.3 6.6 5.5 5.5 7 5.5H9.6C10.5 5.5 11.2 4.8 11.2 3.9V2.7C11.2 1.8 10.3 1.5 7.9 1.5ZM6.5 2.6C6.9 2.6 7.2 2.9 7.2 3.3C7.2 3.7 6.9 4 6.5 4C6.1 4 5.8 3.7 5.8 3.3C5.8 2.9 6.1 2.6 6.5 2.6Z", fill: "#3572a5" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M8.1 14.5C10.8 14.5 10.7 13.3 10.7 13.3V12H8V11.6H12.2C13.5 11.6 14.5 10.5 14.5 8.8C14.5 7.1 13.7 6.6 12.7 6.6H11.7V7.9C11.7 9.4 10.5 10.5 9 10.5H6.4C5.5 10.5 4.8 11.2 4.8 12.1V13.3C4.8 14.2 5.7 14.5 8.1 14.5ZM9.5 13.4C9.1 13.4 8.8 13.1 8.8 12.7C8.8 12.3 9.1 12 9.5 12C9.9 12 10.2 12.3 10.2 12.7C10.2 13.1 9.9 13.4 9.5 13.4Z", fill: "#ffd43b" })
    ] });
  }
  if (ext === "rs") {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("circle", { cx: "8", cy: "8", r: "6.5", stroke: "#dea584", strokeWidth: "1.2", fill: "#1e1e1e" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M5.5 5H9C9.8 5 10.5 5.5 10.5 6.3C10.5 7 10 7.6 9.3 7.8L10.8 11H9.3L8 8.2H7V11H5.5V5ZM7 7.1H8.8C9.2 7.1 9.5 6.8 9.5 6.4C9.5 6 9.2 5.8 8.8 5.8H7V7.1Z", fill: "#dea584" })
    ] });
  }
  if (ext === "go") {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("rect", { width: "16", height: "16", rx: "2.5", fill: "#00add8" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("text", { x: "2", y: "11.5", fill: "#ffffff", fontSize: "8", fontWeight: "bold", fontFamily: "sans-serif", children: "GO" })
    ] });
  }
  if (ext === "json") {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M2.5 2C2.5 1.44772 2.94772 1 3.5 1H10L14 5V14C14 14.5523 13.5523 15 13 15H3.5C2.94772 15 2.5 14.5523 2.5 14V2Z", fill: "#2d3748" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("text", { x: "4", y: "11", fill: "#cbcb41", fontSize: "9", fontWeight: "bold", fontFamily: "monospace", children: "{}" })
    ] });
  }
  if (ext === "md" || ext === "markdown") {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("rect", { x: "1", y: "3", width: "14", height: "10", rx: "1.5", stroke: "#519aba", strokeWidth: "1.2", fill: "#1e1e1e" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M3.5 10V6L5.5 8.5L7.5 6V10", stroke: "#519aba", strokeWidth: "1.1", strokeLinecap: "round", strokeLinejoin: "round" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M11 6V10M9.5 8.5L11 10L12.5 8.5", stroke: "#519aba", strokeWidth: "1.1", strokeLinecap: "round", strokeLinejoin: "round" })
    ] });
  }
  if (lowerName === ".gitignore" || lowerName === ".gitattributes") {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M14.6 7.4L8.6 1.4C8.2 1 7.6 1 7.2 1.4L1.4 7.2C1 7.6 1 8.2 1.4 8.6L7.4 14.6C7.8 15 8.4 15 8.8 14.6L14.6 8.8C15 8.4 15 7.8 14.6 7.4ZM8.5 10.8V8.3C7.4 8.4 6.8 9 6.8 9.5C6.8 9.7 6.6 9.8 6.4 9.8C6.2 9.8 6 9.6 6 9.4C6 8.3 7 7.3 8.5 7.1V5.5C8.1 5.4 7.8 5 7.8 4.5C7.8 3.9 8.2 3.5 8.8 3.5C9.4 3.5 9.8 3.9 9.8 4.5C9.8 5 9.4 5.4 9.1 5.5V10.8C9.4 10.9 9.8 11.3 9.8 11.8C9.8 12.4 9.4 12.8 8.8 12.8C8.2 12.8 7.8 12.4 7.8 11.8C7.8 11.3 8.1 10.9 8.5 10.8Z", fill: "#f14e32" }) });
  }
  if (lowerName === "dockerfile" || lowerName.startsWith("dockerfile.")) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M14.5 7.5C14 7.5 13.5 7.8 13.2 8.2C12.4 7.7 11.2 7.7 10.5 8.2V5H8.5V7H9.5V8.5H5.5V6H3.5V8.5H2V7H1V8.5C0.4 8.8 0 9.4 0 10C0 12.2 2.5 14 6.5 14C11.5 14 14.8 11.2 15 8.5C15 8 14.8 7.5 14.5 7.5Z", fill: "#2496ed" }) });
  }
  const shortExt = ext.slice(0, 3).toUpperCase();
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M3 2C3 1.44772 3.44772 1 4 1H10L14 5V14C14 14.5523 13.5523 15 13 15H4C3.44772 15 3 14.5523 3 14V2Z", fill: "#2b313c", stroke: "#3e4451", strokeWidth: "0.8" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M10 1V5H14", fill: "#3e4451", opacity: "0.6" }),
    shortExt ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("text", { x: "4", y: "11", fill: color, fontSize: "6", fontWeight: "bold", fontFamily: "monospace", children: shortExt }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("circle", { cx: "8", cy: "9", r: "1.8", fill: color })
  ] });
}

// src/client/conversation-draft.ts
var lastKnownSessionId = "";
var trackedCaret = null;
function setLastKnownSessionId(id) {
  if (id) lastKnownSessionId = id;
}
function safeService(ctx, name) {
  try {
    return ctx?.get ? ctx.get(name) : ctx?.reflect?.get ? ctx.reflect.get(name, false) : ctx?.[name];
  } catch {
    try {
      return ctx?.reflect?.get?.(name, false);
    } catch {
      return void 0;
    }
  }
}
function resolveActiveSessionId(ctx, explicitId) {
  if (explicitId) {
    lastKnownSessionId = explicitId;
    return explicitId;
  }
  if (lastKnownSessionId) return lastKnownSessionId;
  try {
    const sessions = safeService(ctx, "sessions");
    if (sessions) {
      const snapshot = sessions.list?.getSnapshot?.();
      if (snapshot?.byId) {
        for (const [id, row] of Object.entries(snapshot.byId)) {
          if ((row?.retainedBy?.mainView ?? 0) > 0) {
            lastKnownSessionId = id;
            return id;
          }
        }
        if (snapshot.activeId) {
          lastKnownSessionId = snapshot.activeId;
          return snapshot.activeId;
        }
        if (Array.isArray(snapshot.ids) && snapshot.ids.length > 0) {
          const id = snapshot.ids[snapshot.ids.length - 1];
          lastKnownSessionId = id;
          return id;
        }
        const keys = Object.keys(snapshot.byId);
        if (keys.length > 0) {
          const id = keys[keys.length - 1];
          lastKnownSessionId = id;
          return id;
        }
      }
      if (sessions.active?.id) {
        lastKnownSessionId = sessions.active.id;
        return sessions.active.id;
      }
      if (sessions.current?.id) {
        lastKnownSessionId = sessions.current.id;
        return sessions.current.id;
      }
    }
  } catch {
  }
  return "";
}
function findComposerElement() {
  if (typeof document === "undefined") return null;
  const composerInput = document.querySelector('[data-composer-input="true"]') ?? document.querySelector("[data-composer-input]");
  if (composerInput) return composerInput;
  const slot = document.querySelector('[data-slot="conversation"]') ?? document.querySelector('[data-slot*="conversation"]') ?? document.body;
  const ce = slot.querySelector('[contenteditable="true"][role="textbox"]') ?? slot.querySelector('[contenteditable="true"]');
  if (ce) return ce;
  return document.querySelector("textarea[data-phase]") ?? document.querySelector("textarea") ?? document.querySelector('[contenteditable="true"]') ?? null;
}
function recordLiveCaret() {
  if (typeof document === "undefined") return;
  const el = findComposerElement();
  if (!el) return;
  if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
    const ta = el;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    if (typeof start === "number" && typeof end === "number" && Number.isFinite(start) && Number.isFinite(end)) {
      trackedCaret = {
        start: Math.max(0, Math.min(start, ta.value.length)),
        end: Math.max(start, Math.min(end, ta.value.length)),
        draft: ta.value,
        timestamp: Date.now()
      };
    }
  } else if (el.isContentEditable) {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && el.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      const preRange = range.cloneRange();
      preRange.selectNodeContents(el);
      preRange.setEnd(range.startContainer, range.startOffset);
      const start = preRange.toString().length;
      const length = range.toString().length;
      trackedCaret = {
        start,
        end: start + length,
        draft: el.innerText ?? el.textContent ?? "",
        timestamp: Date.now()
      };
    }
  }
}
var caretTrackerAttached = false;
function setupCaretTracker() {
  if (caretTrackerAttached || typeof document === "undefined") return () => {
  };
  caretTrackerAttached = true;
  const handleSelection = () => recordLiveCaret();
  document.addEventListener("selectionchange", handleSelection, { passive: true });
  document.addEventListener("keyup", handleSelection, { passive: true });
  document.addEventListener("mouseup", handleSelection, { passive: true });
  document.addEventListener("input", handleSelection, { passive: true });
  document.addEventListener("focusin", handleSelection, { passive: true });
  return () => {
    document.removeEventListener("selectionchange", handleSelection);
    document.removeEventListener("keyup", handleSelection);
    document.removeEventListener("mouseup", handleSelection);
    document.removeEventListener("input", handleSelection);
    document.removeEventListener("focusin", handleSelection);
    caretTrackerAttached = false;
  };
}
function snapCaretToWordBoundary(draft, caret) {
  if (!caret || draft.length === 0) return caret;
  let { start, end } = caret;
  const isWordChar = (ch) => {
    return Boolean(ch && !/[\s\r\n\t]/.test(ch));
  };
  if (start === end && start > 0 && start < draft.length) {
    const prevChar = draft[start - 1];
    const nextChar = draft[start];
    if (isWordChar(prevChar) && isWordChar(nextChar)) {
      while (start < draft.length && isWordChar(draft[start])) {
        start++;
      }
      end = start;
    }
  }
  return { start, end };
}
function probeComposerCaret(draft, targetPoint) {
  const el = findComposerElement();
  if (el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT")) {
    const ta = el;
    if (!ta.disabled && !ta.readOnly) {
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      if (typeof start === "number" && typeof end === "number" && Number.isFinite(start) && Number.isFinite(end) && (document.activeElement === ta || ta.value === draft)) {
        const clampedStart = Math.max(0, Math.min(start, draft.length));
        const clampedEnd = Math.max(clampedStart, Math.min(end, draft.length));
        trackedCaret = { start: clampedStart, end: clampedEnd, draft, timestamp: Date.now() };
        return { start: clampedStart, end: clampedEnd };
      }
    }
  }
  if (trackedCaret) {
    const clampedStart = Math.max(0, Math.min(trackedCaret.start, draft.length));
    const clampedEnd = Math.max(clampedStart, Math.min(trackedCaret.end, draft.length));
    return { start: clampedStart, end: clampedEnd };
  }
  return null;
}
function placeComposerCaret(expectedDraft, caretIndex) {
  let remaining = 3;
  const check = () => {
    remaining -= 1;
    const el = findComposerElement();
    if (!el) return;
    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
      const textarea = el;
      if (textarea.disabled || textarea.readOnly) return;
      const clamped = Math.max(0, Math.min(caretIndex, textarea.value.length));
      textarea.focus();
      textarea.setSelectionRange(clamped, clamped);
      trackedCaret = { start: clamped, end: clamped, draft: textarea.value, timestamp: Date.now() };
      return;
    } else if (el.isContentEditable) {
      el.focus();
      trackedCaret = { start: caretIndex, end: caretIndex, draft: expectedDraft, timestamp: Date.now() };
      return;
    }
    if (remaining > 0) {
      if (typeof requestAnimationFrame === "function") requestAnimationFrame(check);
      else setTimeout(check, 16);
    }
  };
  if (typeof requestAnimationFrame === "function") requestAnimationFrame(check);
  else setTimeout(check, 16);
}
function spliceInsert(draft, text, rawCaret) {
  const caret = snapCaretToWordBoundary(draft, rawCaret);
  if (!caret || draft === "") {
    const next2 = draft.trim() === "" ? text : `${draft}${/\s$/.test(draft) ? "" : " "}${text}`;
    return { draft: next2, caretAfter: next2.length };
  }
  const prefix = draft.slice(0, caret.start);
  const suffix = draft.slice(caret.end);
  const left = prefix === "" || /\s$/.test(prefix) ? "" : " ";
  const right = suffix === "" || /^\s/.test(suffix) || /\s$/.test(text) ? "" : " ";
  const next = `${prefix}${left}${text}${right}${suffix}`;
  const caretAfter = prefix.length + left.length + text.length;
  return {
    draft: next,
    caretAfter
  };
}
function mentionForPath(relativePath, isDir) {
  const norm = relativePath.replace(/[\\/]+$/, "").replace(/\\/g, "/");
  const target = isDir ? `${norm}/` : norm;
  return /\s/.test(target) ? `@"${target}"` : `@${target}`;
}
function baseName(path) {
  const at = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
  return at === -1 ? path : path.slice(at + 1);
}
function insertMentionToComposer(ctx, sessionId, relativePath, isDir, targetPoint) {
  try {
    const mention = mentionForPath(relativePath, isDir);
    const name = baseName(relativePath);
    const label = isDir ? `${name}/` : name;
    const appearance = isDir ? "folder" : "file";
    if (targetPoint && typeof document !== "undefined") {
      const el2 = findComposerElement();
      if (el2) {
        let range = null;
        if (typeof document.caretRangeFromPoint === "function") {
          range = document.caretRangeFromPoint(targetPoint.x, targetPoint.y);
        } else if (typeof document.caretPositionFromPoint === "function") {
          const pos = document.caretPositionFromPoint(targetPoint.x, targetPoint.y);
          if (pos && pos.offsetNode) {
            range = document.createRange();
            range.setStart(pos.offsetNode, pos.offset);
            range.collapse(true);
          }
        }
        if (range && el2.contains(range.startContainer)) {
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
          el2.focus({ preventScroll: true });
        }
      }
    }
    const sessions = safeService(ctx, "sessions");
    const targetSessionId = resolveActiveSessionId(ctx, sessionId);
    const actx = targetSessionId && sessions?.scope ? sessions.scope(targetSessionId) : void 0;
    const conversation = safeService(ctx, "conversation");
    if (conversation && actx) {
      const shell = conversation.input?.for(actx);
      if (shell) {
        if (shell.draftEditor && typeof shell.draftEditor.insertFileReferences === "function") {
          try {
            const revBefore = shell.rev ?? shell.state?.getSnapshot?.()?.draftRev ?? 0;
            const applied = shell.draftEditor.insertFileReferences([
              {
                source: "reference",
                ref: mention,
                label,
                appearance,
                clipboardText: mention
              }
            ]);
            const revAfter = shell.rev ?? shell.state?.getSnapshot?.()?.draftRev ?? 0;
            if (applied || revAfter !== revBefore) {
              shell.focus?.();
              return true;
            }
          } catch (err) {
            console.warn("[dsh-explorer] draftEditor.insertFileReferences failed, trying actx.bail:", err);
          }
        }
        let span = shell.actions?.captureInsertion?.() ?? shell.captureInsertion?.();
        if (span && span.draftRev !== void 0) {
          const detectText = shell.projection?.detectText ?? "";
          let charBefore = span.start > 0 ? detectText[span.start - 1] ?? "" : "";
          if (!charBefore) {
            try {
              const sel = window.getSelection();
              if (sel && sel.anchorNode) {
                const text = sel.anchorNode.textContent ?? "";
                const offset = sel.anchorOffset;
                if (offset > 0) charBefore = text[offset - 1] ?? "";
              }
            } catch {
            }
          }
          if (!charBefore) {
            const draftText = shell.state?.getSnapshot?.()?.draft ?? "";
            if (span.start > 0 && span.start <= draftText.length) {
              charBefore = draftText[span.start - 1] ?? "";
            }
          }
          if (charBefore && !/\s/.test(charBefore)) {
            if (typeof shell.actions?.insertText === "function") {
              try {
                shell.actions.insertText(" ", span);
              } catch {
              }
            } else if (typeof shell.insertText === "function") {
              try {
                shell.insertText(" ", span);
              } catch {
              }
            }
            const updated = shell.actions?.captureInsertion?.() ?? shell.captureInsertion?.();
            if (updated && updated.draftRev !== void 0) {
              span = updated;
            }
          }
          const revBefore = shell.rev ?? shell.state?.getSnapshot?.()?.draftRev ?? 0;
          let applied = false;
          try {
            if (typeof actx.bail === "function") {
              applied = Boolean(
                actx.bail(actx, "slash/input-insert-reference", {
                  reference: {
                    source: "reference",
                    ref: mention,
                    label,
                    appearance,
                    clipboardText: mention
                  },
                  span
                })
              );
            }
          } catch {
          }
          if (!applied) {
            try {
              actx.emit?.("slash/input-insert-reference", {
                reference: {
                  source: "reference",
                  ref: mention,
                  label,
                  appearance,
                  clipboardText: mention
                },
                span
              });
            } catch {
            }
          }
          const revAfter = shell.rev ?? shell.state?.getSnapshot?.()?.draftRev ?? 0;
          if (applied || revAfter !== revBefore) {
            shell.focus?.();
            return true;
          }
          let leadSpace = "";
          if (charBefore && !/\s/.test(charBefore)) leadSpace = " ";
          const textToInsert = `${leadSpace}${mention} `;
          if (typeof shell.actions?.insertText === "function") {
            try {
              if (shell.actions.insertText(textToInsert, span)) {
                shell.focus?.();
                return true;
              }
            } catch {
            }
          }
          if (typeof shell.insertText === "function") {
            try {
              if (shell.insertText(textToInsert, span)) {
                shell.focus?.();
                return true;
              }
            } catch {
            }
          }
        }
      }
    }
    const el = findComposerElement();
    if (el) {
      if (el.isContentEditable) {
        el.focus();
        let needLeadingSpace = false;
        try {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            const r = sel.getRangeAt(0);
            if (r.startContainer.nodeType === Node.TEXT_NODE) {
              const text = r.startContainer.textContent ?? "";
              if (r.startOffset > 0 && !/\s/.test(text[r.startOffset - 1])) {
                needLeadingSpace = true;
              }
            } else if (r.startContainer.previousSibling) {
              const text = r.startContainer.previousSibling.textContent ?? "";
              if (text && !/\s/.test(text.slice(-1))) {
                needLeadingSpace = true;
              }
            }
          }
        } catch {
        }
        const textToInsert = `${needLeadingSpace ? " " : ""}${mention} `;
        try {
          if (document.execCommand("insertText", false, textToInsert)) {
            recordLiveCaret();
            return true;
          }
        } catch {
        }
        try {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            const textNode = document.createTextNode(textToInsert);
            range.insertNode(textNode);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
            el.dispatchEvent(new Event("input", { bubbles: true }));
            recordLiveCaret();
            return true;
          }
        } catch {
        }
      }
      if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
        const textarea = el;
        const current = textarea.value;
        const rawCaret = probeComposerCaret(current, targetPoint) ?? {
          start: textarea.selectionStart ?? current.length,
          end: textarea.selectionEnd ?? current.length
        };
        const { draft: next, caretAfter } = spliceInsert(current, `${mention} `, rawCaret);
        textarea.value = next;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        placeComposerCaret(next, caretAfter);
        return true;
      }
    }
    if (conversation && actx) {
      const shell = conversation.input?.for(actx);
      if (shell?.setDraft) {
        const currentDraft = shell.state?.getSnapshot?.()?.draft ?? "";
        const rawCaret = probeComposerCaret(currentDraft, targetPoint);
        const { draft: next, caretAfter } = spliceInsert(currentDraft, `${mention} `, rawCaret);
        shell.setDraft(next);
        placeComposerCaret(next, caretAfter);
        return true;
      }
    }
    return false;
  } catch (err) {
    console.warn("[dsh-explorer] insertMentionToComposer failed:", err);
    return false;
  }
}
function insertSnippetToComposer(ctx, sessionId, relativePath, content, targetPoint) {
  try {
    const ext = relativePath.slice(relativePath.lastIndexOf(".") + 1) || "text";
    const block = `
\`\`\`${ext} title="${relativePath}"
${content}
\`\`\`
`;
    const targetSessionId = resolveActiveSessionId(ctx, sessionId);
    const sessions = safeService(ctx, "sessions");
    const actx = targetSessionId && sessions?.scope ? sessions.scope(targetSessionId) : void 0;
    const conversation = safeService(ctx, "conversation");
    if (conversation && actx) {
      const shell = conversation.input?.for(actx);
      if (shell) {
        const span = shell.actions?.captureInsertion?.() ?? shell.captureInsertion?.();
        if (span && span.draftRev !== void 0) {
          if (typeof shell.actions?.insertText === "function") {
            try {
              if (shell.actions.insertText(block, span)) {
                shell.focus?.();
                return true;
              }
            } catch {
            }
          }
          if (typeof shell.insertText === "function") {
            try {
              if (shell.insertText(block, span)) {
                shell.focus?.();
                return true;
              }
            } catch {
            }
          }
        }
      }
    }
    const el = findComposerElement();
    if (el) {
      if (el.isContentEditable) {
        el.focus();
        try {
          if (document.execCommand("insertText", false, block)) {
            recordLiveCaret();
            return true;
          }
        } catch {
        }
      }
      if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
        const textarea = el;
        const current = textarea.value;
        const rawCaret = probeComposerCaret(current, targetPoint) ?? {
          start: textarea.selectionStart ?? current.length,
          end: textarea.selectionEnd ?? current.length
        };
        const { draft: next, caretAfter } = spliceInsert(current, block, rawCaret);
        textarea.value = next;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        placeComposerCaret(next, caretAfter);
        return true;
      }
    }
    return false;
  } catch (err) {
    console.warn("[dsh-explorer] insertSnippetToComposer failed:", err);
    return false;
  }
}

// src/client/drag-drop.ts
var DSH_EXPLORER_MIME = "application/vnd.dsh.explorer-items";
var currentDragItems = null;
function setupDragStart(e, items) {
  currentDragItems = items;
  const payload = JSON.stringify(items);
  try {
    e.dataTransfer.setData(DSH_EXPLORER_MIME, payload);
  } catch {
  }
  const plainText = items.map((item) => item.isDir ? `@${item.relativePath}/` : `@${item.relativePath}`).join(" ");
  try {
    e.dataTransfer.setData("text/plain", plainText);
  } catch {
  }
  e.dataTransfer.effectAllowed = "copy";
}
function setupDragEnd() {
  setTimeout(() => {
    currentDragItems = null;
  }, 200);
}
var activeOverlay = null;
function getOrCreateOverlay(targetEl) {
  if (activeOverlay && document.body.contains(activeOverlay)) {
    return activeOverlay;
  }
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.inset = "0";
  div.style.backgroundColor = "rgba(33, 150, 243, 0.08)";
  div.style.border = "2px dashed #007fd4";
  div.style.borderRadius = "8px";
  div.style.zIndex = "9999";
  div.style.pointerEvents = "none";
  div.style.display = "flex";
  div.style.flexDirection = "column";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  div.style.gap = "8px";
  div.style.backdropFilter = "blur(2px)";
  div.style.transition = "opacity 0.15s cubic-bezier(0.2, 0, 0, 1)";
  div.innerHTML = `
    <div style="font-weight: 600; font-size: 13px; color: #58a6ff; background: rgba(22, 27, 34, 0.85); border: 1px solid rgba(88, 166, 255, 0.3); padding: 8px 16px; border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 8px;">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2z"/>
      </svg>
      Drop at cursor to mention
    </div>
    <div style="font-size: 11px; opacity: 0.9; color: #8b949e; background: rgba(22, 27, 34, 0.7); padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.06);">
      Hold <b>Alt</b> or <b>Shift</b> to embed code snippet
    </div>
  `;
  activeOverlay = div;
  return div;
}
function attachGlobalConversationDropListener(ctx) {
  let dragDepth = 0;
  const hasExplorerData = (e) => {
    if (currentDragItems && currentDragItems.length > 0) return true;
    try {
      const types = Array.from(e.dataTransfer?.types ?? []);
      return types.includes(DSH_EXPLORER_MIME) || types.includes("text/plain");
    } catch {
      return false;
    }
  };
  const getConversationContainer = () => {
    return document.querySelector('[data-slot="conversation.session"]') ?? document.querySelector('[data-slot="conversation.shell"]') ?? document.querySelector('[data-slot*="conversation"]') ?? document.querySelector(".an3WzG_root") ?? document.querySelector(".conversation-main") ?? document.querySelector("main") ?? document.querySelector("#root > div") ?? null;
  };
  const handleDragEnter = (e) => {
    if (!hasExplorerData(e)) return;
    const container = getConversationContainer();
    if (!container) return;
    dragDepth += 1;
    const overlay = getOrCreateOverlay(container);
    if (!container.contains(overlay)) {
      if (getComputedStyle(container).position === "static") {
        container.style.position = "relative";
      }
      container.appendChild(overlay);
    }
  };
  const handleDragOver = (e) => {
    if (!hasExplorerData(e)) return;
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  };
  const handleDragLeave = (e) => {
    if (!hasExplorerData(e)) return;
    dragDepth -= 1;
    if (dragDepth <= 0) {
      dragDepth = 0;
      activeOverlay?.remove();
    }
  };
  const handleDrop = async (e) => {
    if (!hasExplorerData(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepth = 0;
    activeOverlay?.remove();
    let items = currentDragItems;
    if (!items || items.length === 0) {
      try {
        const raw = e.dataTransfer?.getData(DSH_EXPLORER_MIME);
        if (raw) items = JSON.parse(raw);
      } catch {
      }
    }
    if (!items || items.length === 0) {
      const plain = e.dataTransfer?.getData("text/plain");
      if (plain && plain.startsWith("@")) {
        const relativePath = plain.replace(/^@"?/, "").replace(/"?$/, "");
        items = [{
          path: relativePath,
          relativePath,
          isDir: relativePath.endsWith("/"),
          name: relativePath
        }];
      }
    }
    if (!items || items.length === 0) return;
    try {
      const activeSessionId = resolveActiveSessionId(ctx);
      const isAlt = e.altKey || e.shiftKey;
      let currentPoint = { x: e.clientX, y: e.clientY };
      for (const item of items) {
        if (isAlt && !item.isDir) {
          try {
            const content = await fetchFileContent(item.path);
            insertSnippetToComposer(ctx, activeSessionId, item.relativePath, content, currentPoint);
          } catch {
            insertMentionToComposer(ctx, activeSessionId, item.relativePath, item.isDir, currentPoint);
          }
        } else {
          insertMentionToComposer(ctx, activeSessionId, item.relativePath, item.isDir, currentPoint);
        }
        currentPoint = void 0;
        if (items.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 40));
        }
      }
    } catch (err) {
      console.warn("[dsh-explorer] drop failed:", err);
    }
  };
  document.addEventListener("dragenter", handleDragEnter, true);
  document.addEventListener("dragover", handleDragOver, true);
  document.addEventListener("dragleave", handleDragLeave, true);
  document.addEventListener("drop", handleDrop, true);
  return () => {
    document.removeEventListener("dragenter", handleDragEnter, true);
    document.removeEventListener("dragover", handleDragOver, true);
    document.removeEventListener("dragleave", handleDragLeave, true);
    document.removeEventListener("drop", handleDrop, true);
    activeOverlay?.remove();
  };
}

// src/client/ExplorerRow.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var ExplorerRow = ({
  entry,
  depth,
  isExpanded,
  isSelected,
  isFocused,
  gitStatus,
  relativePath,
  compactChain,
  indentStep = 16,
  iconSize = 16,
  enableMotion = true,
  showGitBadges = true,
  compactFolders = true,
  singleClickAction = "select",
  onToggle,
  onSelect,
  onDoubleClick,
  onContextMenu,
  onInsertReference,
  onCopyRelativePath,
  onRenameSubmit,
  onDelete
}) => {
  const [isRenaming, setIsRenaming] = (0, import_react2.useState)(false);
  const [renameVal, setRenameVal] = (0, import_react2.useState)(entry.name);
  const inputRef = (0, import_react2.useRef)(null);
  (0, import_react2.useEffect)(() => {
    if (isRenaming) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isRenaming]);
  const handleDragStart = (e) => {
    const item = {
      path: entry.path,
      relativePath,
      isDir: entry.isDir,
      name: entry.name
    };
    setupDragStart(e, [item]);
  };
  const handleRenameKeyDown = (e) => {
    if (e.key === "Enter") {
      const trimmed = renameVal.trim();
      if (trimmed && trimmed !== entry.name) {
        onRenameSubmit(trimmed);
      }
      setIsRenaming(false);
    } else if (e.key === "Escape") {
      setRenameVal(entry.name);
      setIsRenaming(false);
    }
  };
  const displayName = compactFolders && compactChain && compactChain.length > 1 ? compactChain.map((c) => c.name).join("/") : compactFolders && entry.compactName ? entry.compactName : entry.name;
  let gitClass = "";
  let gitLetter = "";
  if (gitStatus) {
    if (gitStatus.includes("M")) {
      gitClass = explorer_default.gitModified;
      gitLetter = "M";
    } else if (gitStatus.includes("?") || gitStatus.includes("A")) {
      gitClass = explorer_default.gitUntracked;
      gitLetter = "U";
    } else if (gitStatus.includes("D")) {
      gitClass = explorer_default.gitDeleted;
      gitLetter = "D";
    }
  }
  const isIgnored = gitStatus?.includes("!");
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "div",
    {
      className: `${explorer_default.row} ${isSelected ? explorer_default.rowSelected : ""} ${isFocused ? explorer_default.rowFocused : ""}`,
      style: { paddingLeft: `${depth * indentStep + 8}px` },
      onClick: (e) => {
        onSelect(e);
        if (entry.isDir) {
          onToggle();
        } else if (singleClickAction === "mention") {
          onInsertReference();
        }
      },
      onDoubleClick: (e) => {
        if (!entry.isDir) {
          e.stopPropagation();
          onDoubleClick?.();
        }
      },
      onContextMenu,
      draggable: !isRenaming,
      onDragStart: handleDragStart,
      onDragEnd: setupDragEnd,
      children: [
        Array.from({ length: depth }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "span",
          {
            className: explorer_default.indentGuide,
            style: { left: `${i * indentStep + 15}px` }
          },
          i
        )),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "span",
          {
            className: `${explorer_default.chevron} ${isExpanded ? explorer_default.chevronExpanded : ""} ${!entry.isDir ? explorer_default.chevronHidden : ""}`,
            style: !enableMotion ? { transition: "none" } : void 0,
            onClick: (e) => {
              e.stopPropagation();
              onToggle();
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("svg", { width: "10", height: "10", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M6 3.5L10.5 8 6 12.5V3.5Z" }) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: explorer_default.iconWrap, children: renderFileIcon(entry.name, entry.isDir, isExpanded, iconSize) }),
        isRenaming ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "input",
          {
            ref: inputRef,
            type: "text",
            className: explorer_default.inlineInput,
            value: renameVal,
            onChange: (e) => setRenameVal(e.target.value),
            onKeyDown: handleRenameKeyDown,
            onBlur: () => {
              const trimmed = renameVal.trim();
              if (trimmed && trimmed !== entry.name) {
                onRenameSubmit(trimmed);
              }
              setIsRenaming(false);
            },
            onClick: (e) => e.stopPropagation()
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "span",
          {
            className: `${explorer_default.label} ${isIgnored ? explorer_default.labelDimmed : ""} ${showGitBadges ? gitClass : ""}`,
            title: relativePath,
            children: displayName
          }
        ),
        showGitBadges && gitLetter && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: `${explorer_default.gitBadge} ${gitClass}`, children: gitLetter }),
        !isRenaming && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: explorer_default.hoverActions, onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "button",
            {
              className: explorer_default.actionBtn,
              title: "Mention in Chat (@)",
              onClick: (e) => {
                e.stopPropagation();
                onInsertReference();
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zM7 5h2v2h2v2H9v2H7V9H5V7h2V5z" }) })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "button",
            {
              className: explorer_default.actionBtn,
              title: "Copy Relative Path",
              onClick: (e) => {
                e.stopPropagation();
                onCopyRelativePath();
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M4 4h6v1H4v9h7v-4h1v5H3V4h1zm3-2h7v7h-1V3.7L7.7 9 7 8.3 12.3 3H7V2z" }) })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "button",
            {
              className: explorer_default.actionBtn,
              title: "Rename (F2)",
              onClick: (e) => {
                e.stopPropagation();
                setIsRenaming(true);
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("svg", { width: "11", height: "11", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" }) })
            }
          )
        ] })
      ]
    }
  );
};

// src/client/ExplorerContextMenu.tsx
var import_react3 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var ExplorerContextMenu = ({
  x,
  y,
  entry,
  relativePath,
  onClose,
  onOpenFile,
  onInsertReference,
  onInsertSnippet,
  onCopyPath,
  onCopyRelativePath,
  onNewFile,
  onNewFolder,
  onRename,
  onDelete
}) => {
  const menuRef = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);
  const top = Math.min(y, window.innerHeight - 260);
  const left = Math.min(x, window.innerWidth - 200);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { ref: menuRef, className: explorer_default.contextMenu, style: { top, left }, children: [
    !entry.isDir && onOpenFile && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
        "div",
        {
          className: explorer_default.menuItem,
          onClick: () => {
            onOpenFile();
            onClose();
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "Open in New Tab" }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: explorer_default.menuShortcut, children: "Double-Click" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: explorer_default.menuDivider })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "div",
      {
        className: explorer_default.menuItem,
        onClick: () => {
          onInsertReference();
          onClose();
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "Insert Mention to Chat" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: explorer_default.menuShortcut, children: "@" })
        ]
      }
    ),
    !entry.isDir && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "div",
      {
        className: explorer_default.menuItem,
        onClick: () => {
          onInsertSnippet();
          onClose();
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "Insert Code to Chat" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: explorer_default.menuShortcut, children: "Alt+Drop" })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: explorer_default.menuDivider }),
    entry.isDir && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "div",
        {
          className: explorer_default.menuItem,
          onClick: () => {
            onNewFile();
            onClose();
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "New File..." })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "div",
        {
          className: explorer_default.menuItem,
          onClick: () => {
            onNewFolder();
            onClose();
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "New Folder..." })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: explorer_default.menuDivider })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "div",
      {
        className: explorer_default.menuItem,
        onClick: () => {
          onCopyRelativePath();
          onClose();
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "Copy Relative Path" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "div",
      {
        className: explorer_default.menuItem,
        onClick: () => {
          onCopyPath();
          onClose();
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "Copy Path" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: explorer_default.menuDivider }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "div",
      {
        className: explorer_default.menuItem,
        onClick: () => {
          onRename();
          onClose();
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "Rename..." }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: explorer_default.menuShortcut, children: "F2" })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "div",
      {
        className: explorer_default.menuItem,
        onClick: () => {
          onDelete();
          onClose();
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { color: "#f44336" }, children: "Delete" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: explorer_default.menuShortcut, children: "Del" })
        ]
      }
    )
  ] });
};

// src/client/ExplorerOptionsModal.tsx
var import_react4 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
var ExplorerOptionsModal = ({
  options,
  onChange,
  onReset,
  onClose
}) => {
  const popoverRef = (0, import_react4.useRef)(null);
  (0, import_react4.useEffect)(() => {
    const handleMouseDown = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleMouseDown, true);
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [onClose]);
  const handleDensityChange = (density) => {
    onChange({ density });
  };
  const handleScaleChange = (e) => {
    const scale = parseFloat(e.target.value);
    if (!Number.isNaN(scale)) {
      onChange({ scale: Math.round(scale * 100) / 100 });
    }
  };
  const handleActionChange = (action) => {
    onChange({ singleClickAction: action });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { ref: popoverRef, className: explorer_default.optionsPopover, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsHeader, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsHeaderTitle, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { width: "13", height: "13", viewBox: "0 0 16 16", fill: "currentColor", style: { marginRight: "6px" }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" }) }),
        "EXPLORER OPTIONS"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: "4px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { className: explorer_default.optionsIconBtn, title: "Reset to defaults", onClick: onReset, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M13.65 2.35A7.958 7.958 0 0 0 8 0a8 8 0 1 0 8 8h-2a6 6 0 1 1-1.76-4.24l-2.24 2.24H16V0l-2.35 2.35z" }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { className: explorer_default.optionsIconBtn, title: "Close", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" }) }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsBody, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsSection, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: explorer_default.optionsSectionTitle, children: "Scale & Density" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.segmentGroup, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "button",
            {
              type: "button",
              className: `${explorer_default.segmentBtn} ${options.density === "compact" ? explorer_default.segmentBtnActive : ""}`,
              onClick: () => handleDensityChange("compact"),
              children: "Compact"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "button",
            {
              type: "button",
              className: `${explorer_default.segmentBtn} ${options.density === "normal" ? explorer_default.segmentBtnActive : ""}`,
              onClick: () => handleDensityChange("normal"),
              children: "Normal"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "button",
            {
              type: "button",
              className: `${explorer_default.segmentBtn} ${options.density === "relaxed" ? explorer_default.segmentBtnActive : ""}`,
              onClick: () => handleDensityChange("relaxed"),
              children: "Relaxed"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsRow, style: { marginTop: "6px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsLabelWrap, children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: explorer_default.optionsLabel, children: "Zoom Scale" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: explorer_default.optionsSubLabel, children: "Resize tree text and icons" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: explorer_default.optionsBadge, children: [
              Math.round(options.scale * 100),
              "%"
            ] }),
            options.scale !== 1 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              "button",
              {
                type: "button",
                className: explorer_default.optionsMiniBtn,
                title: "Reset scale to 100%",
                onClick: () => onChange({ scale: 1 }),
                children: "1x"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "input",
          {
            type: "range",
            min: "0.75",
            max: "1.35",
            step: "0.05",
            value: options.scale,
            onChange: handleScaleChange,
            className: explorer_default.optionsSlider
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsSection, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: explorer_default.optionsSectionTitle, children: "Motion & Transitions" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsRow, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsLabelWrap, children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: explorer_default.optionsLabel, children: "Smooth Animations" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: explorer_default.optionsSubLabel, children: "Fluid folder collapse & icon turns" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "div",
            {
              className: `${explorer_default.switch} ${options.enableMotion ? explorer_default.switchActive : ""}`,
              onClick: () => onChange({ enableMotion: !options.enableMotion }),
              role: "switch",
              "aria-checked": options.enableMotion,
              children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: `${explorer_default.switchKnob} ${options.enableMotion ? explorer_default.switchKnobActive : ""}` })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsSection, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: explorer_default.optionsSectionTitle, children: "Workspace View" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsRow, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsLabelWrap, children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: explorer_default.optionsLabel, children: "Show Hidden Files" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: explorer_default.optionsSubLabel, children: "Include dotfiles and config directories" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "div",
            {
              className: `${explorer_default.switch} ${options.showHiddenFiles ? explorer_default.switchActive : ""}`,
              onClick: () => onChange({ showHiddenFiles: !options.showHiddenFiles }),
              role: "switch",
              "aria-checked": options.showHiddenFiles,
              children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: `${explorer_default.switchKnob} ${options.showHiddenFiles ? explorer_default.switchKnobActive : ""}` })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsRow, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsLabelWrap, children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: explorer_default.optionsLabel, children: "Git Status Indicators" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: explorer_default.optionsSubLabel, children: "Highlight modified & untracked files" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "div",
            {
              className: `${explorer_default.switch} ${options.showGitBadges ? explorer_default.switchActive : ""}`,
              onClick: () => onChange({ showGitBadges: !options.showGitBadges }),
              role: "switch",
              "aria-checked": options.showGitBadges,
              children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: `${explorer_default.switchKnob} ${options.showGitBadges ? explorer_default.switchKnobActive : ""}` })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsRow, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsLabelWrap, children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: explorer_default.optionsLabel, children: "Compact Folders" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: explorer_default.optionsSubLabel, children: "Chain single-child directory paths" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "div",
            {
              className: `${explorer_default.switch} ${options.compactFolders ? explorer_default.switchActive : ""}`,
              onClick: () => onChange({ compactFolders: !options.compactFolders }),
              role: "switch",
              "aria-checked": options.compactFolders,
              children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: `${explorer_default.switchKnob} ${options.compactFolders ? explorer_default.switchKnobActive : ""}` })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsSection, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: explorer_default.optionsSectionTitle, children: "Interaction" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: explorer_default.optionsRow, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.optionsLabelWrap, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: explorer_default.optionsLabel, children: "File Click Behavior" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: explorer_default.optionsSubLabel, children: "Direct action when clicking a file" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: explorer_default.segmentGroup, style: { marginTop: "4px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "button",
            {
              type: "button",
              className: `${explorer_default.segmentBtn} ${options.singleClickAction === "select" ? explorer_default.segmentBtnActive : ""}`,
              onClick: () => handleActionChange("select"),
              children: "Select / Focus"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "button",
            {
              type: "button",
              className: `${explorer_default.segmentBtn} ${options.singleClickAction === "mention" ? explorer_default.segmentBtnActive : ""}`,
              onClick: () => handleActionChange("mention"),
              children: "Insert @Mention"
            }
          )
        ] })
      ] })
    ] })
  ] });
};

// src/client/options.ts
var DEFAULT_OPTIONS = {
  scale: 1,
  density: "normal",
  enableMotion: true,
  showHiddenFiles: true,
  showGitBadges: true,
  compactFolders: false,
  singleClickAction: "select"
};
var STORAGE_KEY = "dsh_explorer_options_v1";
function loadExplorerOptions() {
  if (typeof window === "undefined" || !window.localStorage) {
    return { ...DEFAULT_OPTIONS };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_OPTIONS };
    const parsed = JSON.parse(raw);
    return {
      scale: typeof parsed.scale === "number" && Number.isFinite(parsed.scale) ? Math.max(0.75, Math.min(1.35, Math.round(parsed.scale * 100) / 100)) : DEFAULT_OPTIONS.scale,
      density: parsed.density === "compact" || parsed.density === "relaxed" ? parsed.density : "normal",
      enableMotion: typeof parsed.enableMotion === "boolean" ? parsed.enableMotion : DEFAULT_OPTIONS.enableMotion,
      showHiddenFiles: typeof parsed.showHiddenFiles === "boolean" ? parsed.showHiddenFiles : DEFAULT_OPTIONS.showHiddenFiles,
      showGitBadges: typeof parsed.showGitBadges === "boolean" ? parsed.showGitBadges : DEFAULT_OPTIONS.showGitBadges,
      compactFolders: typeof parsed.compactFolders === "boolean" ? parsed.compactFolders : DEFAULT_OPTIONS.compactFolders,
      singleClickAction: parsed.singleClickAction === "mention" ? "mention" : "select"
    };
  } catch {
    return { ...DEFAULT_OPTIONS };
  }
}
function saveExplorerOptions(options) {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
  } catch {
  }
}

// src/client/ExplorerView.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function safeService2(ctx, name) {
  if (!ctx) return void 0;
  try {
    if (typeof ctx.get === "function") {
      const val = ctx.get(name);
      if (val !== void 0) return val;
    }
    return ctx[name];
  } catch {
    return void 0;
  }
}
function openFileInTab(ctx, sessionId, filePath, relPath) {
  const normPath = filePath.replace(/\\/g, "/");
  const fileName = baseName(filePath);
  try {
    const betterSidebar = safeService2(ctx, "betterSidebar");
    if (betterSidebar && typeof betterSidebar.openTab === "function") {
      betterSidebar.openTab({
        type: "editor",
        title: fileName,
        path: filePath,
        id: `editor:${filePath}`
      });
      return;
    }
  } catch {
  }
  try {
    const sidebarRight = safeService2(ctx, "sidebarRight");
    if (sidebarRight && typeof sidebarRight.openResource === "function") {
      const normRel = relPath.replace(/\\/g, "/");
      const encodePath = (p) => p.split("/").map((seg) => encodeURIComponent(seg).replace(/%3A/gi, ":")).join("/");
      const address = sessionId ? `dsh-resource://file/session/${encodeURIComponent(sessionId)}/${encodePath(normRel)}` : `dsh-resource://file/absolute/${encodePath(normPath.replace(/^\/+/, ""))}`;
      sidebarRight.openResource(address);
      return;
    }
  } catch {
  }
  try {
    const tabs = safeService2(ctx, "tabs");
    if (tabs && typeof tabs.open === "function") {
      tabs.open({ path: filePath, title: fileName });
      return;
    }
  } catch {
  }
  try {
    const remote = ctx?.remote?.session;
    if (remote && typeof remote.openWorkspacePath === "function") {
      remote.openWorkspacePath({ path: filePath });
      return;
    }
  } catch {
  }
  try {
    window.open(`/dsh-explorer/api/read-file?path=${encodeURIComponent(filePath)}`, "_blank");
  } catch {
  }
}
var TreeNode = import_react5.default.memo(({
  entry,
  depth,
  rootPath,
  levels,
  expanded,
  selected,
  focusedPath,
  gitStatusMap,
  filterText,
  creating,
  creatingName,
  createInputRef,
  options,
  indentStep,
  iconSize,
  reloadDirectory,
  onToggle,
  onSelect,
  onOpenFile,
  onContextMenu,
  onInsertReference,
  onCopyRelativePath,
  onRenameSubmit,
  onDelete,
  onCreatingNameChange,
  onCreatingKeyDown,
  onCreatingBlur,
  getRelativePath
}) => {
  const relPath = getRelativePath(entry.path);
  const normPath = entry.path.replace(/\\/g, "/");
  const listing = levels[entry.path] ?? levels[normPath];
  const hasLoaded = listing !== void 0;
  if (!options.showHiddenFiles && (entry.hidden || entry.name.startsWith("."))) {
    return null;
  }
  if (filterText) {
    const selfMatches = entry.name.toLowerCase().includes(filterText.toLowerCase()) || relPath.toLowerCase().includes(filterText.toLowerCase());
    if (!selfMatches && !entry.isDir) {
      return null;
    }
  }
  const compactChain = (0, import_react5.useMemo)(() => {
    if (!options.compactFolders || !entry.isDir) return void 0;
    const chain = [entry];
    let curr = entry;
    let currListing = levels[curr.path] ?? levels[curr.path.replace(/\\/g, "/")];
    while (currListing && currListing.entries) {
      const valid = options.showHiddenFiles ? currListing.entries : currListing.entries.filter((c) => !c.hidden && !c.name.startsWith("."));
      if (valid.length === 1 && valid[0].isDir) {
        const next = valid[0];
        chain.push(next);
        curr = next;
        currListing = levels[curr.path] ?? levels[curr.path.replace(/\\/g, "/")];
      } else {
        break;
      }
    }
    return chain.length > 1 ? chain : void 0;
  }, [options.compactFolders, options.showHiddenFiles, entry, levels]);
  const isCompacted = compactChain !== void 0 && compactChain.length > 1;
  const effectiveEntry = isCompacted ? compactChain[compactChain.length - 1] : entry;
  const targetPath = effectiveEntry.path;
  const targetRelPath = getRelativePath(targetPath);
  const isExpanded = entry.isDir && (expanded.has(entry.path) || expanded.has(targetPath) || Boolean(filterText));
  const isSel = selected.has(entry.path) || selected.has(targetPath);
  const isFoc = focusedPath === entry.path || focusedPath === targetPath;
  const normRel = targetRelPath.replace(/\\/g, "/").toLowerCase();
  const status = gitStatusMap.get(normRel) ?? gitStatusMap.get(targetPath.replace(/\\/g, "/").toLowerCase()) ?? gitStatusMap.get(relPath.replace(/\\/g, "/").toLowerCase());
  const targetListing = levels[targetPath] ?? levels[targetPath.replace(/\\/g, "/")];
  const hasTargetLoaded = targetListing !== void 0;
  (0, import_react5.useEffect)(() => {
    if (isExpanded && targetPath !== entry.path && !hasTargetLoaded) {
      reloadDirectory(targetPath);
    }
  }, [isExpanded, targetPath, entry.path, hasTargetLoaded, reloadDirectory]);
  (0, import_react5.useEffect)(() => {
    if (options.compactFolders && entry.isDir && entry.compact && !hasLoaded) {
      reloadDirectory(entry.path);
    }
  }, [options.compactFolders, entry.isDir, entry.compact, hasLoaded, entry.path, reloadDirectory]);
  const handleToggle = () => {
    if (isCompacted && targetPath !== entry.path) {
      const isCurrentlyExpanded = expanded.has(entry.path) || expanded.has(targetPath);
      if (isCurrentlyExpanded) {
        if (expanded.has(entry.path)) onToggle(entry.path);
        if (expanded.has(targetPath)) onToggle(targetPath);
      } else {
        onToggle(entry.path);
        onToggle(targetPath);
      }
    } else {
      onToggle(entry.path);
    }
  };
  if (!entry.isDir) {
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      ExplorerRow,
      {
        entry,
        depth,
        isExpanded: false,
        isSelected: isSel,
        isFocused: isFoc,
        gitStatus: status,
        relativePath: relPath,
        indentStep,
        iconSize,
        enableMotion: options.enableMotion,
        showGitBadges: options.showGitBadges,
        compactFolders: options.compactFolders,
        singleClickAction: options.singleClickAction,
        onToggle: () => {
        },
        onSelect: (e) => onSelect(entry.path, e),
        onDoubleClick: () => onOpenFile(entry.path, relPath),
        onContextMenu: (e) => onContextMenu(entry, relPath, e),
        onInsertReference: () => onInsertReference(relPath, false),
        onCopyRelativePath: () => onCopyRelativePath(relPath),
        onRenameSubmit: (newName) => onRenameSubmit(entry.path, newName),
        onDelete: () => onDelete(entry)
      }
    );
  }
  const visibleChildren = hasTargetLoaded && targetListing.entries ? options.showHiddenFiles ? targetListing.entries : targetListing.entries.filter((c) => !c.hidden && !c.name.startsWith(".")) : [];
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: explorer_default.folderGroup, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      ExplorerRow,
      {
        entry,
        depth,
        isExpanded,
        isSelected: isSel,
        isFocused: isFoc,
        gitStatus: status,
        relativePath: targetRelPath,
        compactChain,
        indentStep,
        iconSize,
        enableMotion: options.enableMotion,
        showGitBadges: options.showGitBadges,
        compactFolders: options.compactFolders,
        singleClickAction: options.singleClickAction,
        onToggle: handleToggle,
        onSelect: (e) => onSelect(targetPath, e),
        onContextMenu: (e) => onContextMenu(entry, targetRelPath, e),
        onInsertReference: () => onInsertReference(targetRelPath, true),
        onCopyRelativePath: () => onCopyRelativePath(targetRelPath),
        onRenameSubmit: (newName) => onRenameSubmit(entry.path, newName),
        onDelete: () => onDelete(entry)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "div",
      {
        className: `${explorer_default.folderChildren} ${isExpanded ? explorer_default.folderChildrenOpen : explorer_default.folderChildrenClosed}`,
        style: !options.enableMotion ? { transition: "none" } : void 0,
        children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: explorer_default.folderChildrenInner, children: [
          creating && (creating.parentDir === entry.path || creating.parentDir === targetPath) && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: explorer_default.row, style: { paddingLeft: `${(depth + 1) * indentStep + 8}px` }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: explorer_default.iconWrap, children: creating.isDir ? "\u{1F4C1}" : "\u{1F4C4}" }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
              "input",
              {
                ref: createInputRef,
                autoFocus: true,
                type: "text",
                className: explorer_default.inlineInput,
                placeholder: creating.isDir ? "Folder name..." : "File name...",
                value: creatingName,
                onChange: (e) => onCreatingNameChange(e.target.value),
                onKeyDown: onCreatingKeyDown,
                onBlur: onCreatingBlur
              }
            )
          ] }),
          visibleChildren.length > 0 ? visibleChildren.map((child) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            TreeNode,
            {
              entry: child,
              depth: depth + 1,
              parentDir: targetPath,
              rootPath,
              levels,
              expanded,
              selected,
              focusedPath,
              gitStatusMap,
              filterText,
              creating,
              creatingName,
              createInputRef,
              options,
              indentStep,
              iconSize,
              reloadDirectory,
              onToggle,
              onSelect,
              onOpenFile,
              onContextMenu,
              onInsertReference,
              onCopyRelativePath,
              onRenameSubmit,
              onDelete,
              onCreatingNameChange,
              onCreatingKeyDown,
              onCreatingBlur,
              getRelativePath
            },
            child.path
          )) : hasTargetLoaded && targetListing.entries && targetListing.entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "div",
            {
              className: explorer_default.row,
              style: {
                paddingLeft: `${(depth + 1) * indentStep + 8}px`,
                opacity: 0.45,
                fontStyle: "italic",
                fontSize: "12px"
              },
              children: "Empty folder"
            }
          ) : null
        ] })
      }
    )
  ] });
});
var ExplorerView = ({ ctx, sessionId, initialCwd }) => {
  const [rootPath, setRootPath] = (0, import_react5.useState)(initialCwd ?? "");
  const [levels, setLevels] = (0, import_react5.useState)({});
  const [expanded, setExpanded] = (0, import_react5.useState)(() => /* @__PURE__ */ new Set());
  const [selected, setSelected] = (0, import_react5.useState)(() => /* @__PURE__ */ new Set());
  const [focusedPath, setFocusedPath] = (0, import_react5.useState)(null);
  const [filterText, setFilterText] = (0, import_react5.useState)("");
  const [searchOpen, setSearchOpen] = (0, import_react5.useState)(false);
  const [optionsOpen, setOptionsOpen] = (0, import_react5.useState)(false);
  const [options, setOptions] = (0, import_react5.useState)(() => loadExplorerOptions());
  const [loading, setLoading] = (0, import_react5.useState)(false);
  const [errorMessage, setErrorMessage] = (0, import_react5.useState)(null);
  const [gitData, setGitData] = (0, import_react5.useState)({ isRepo: false, entries: [] });
  const [creating, setCreating] = (0, import_react5.useState)(null);
  const [creatingName, setCreatingName] = (0, import_react5.useState)("");
  const [contextMenu, setContextMenu] = (0, import_react5.useState)(null);
  const treeBodyRef = (0, import_react5.useRef)(null);
  const createInputRef = (0, import_react5.useRef)(null);
  const handleUpdateOptions = (0, import_react5.useCallback)((patch) => {
    setOptions((prev) => {
      const next = { ...prev, ...patch };
      saveExplorerOptions(next);
      return next;
    });
  }, []);
  const handleResetOptions = (0, import_react5.useCallback)(() => {
    setOptions({ ...DEFAULT_OPTIONS });
    saveExplorerOptions({ ...DEFAULT_OPTIONS });
  }, []);
  const baseRowHeight = options.density === "compact" ? 20 : options.density === "relaxed" ? 28 : 24;
  const baseFontSize = options.density === "compact" ? 11.5 : options.density === "relaxed" ? 14 : 13;
  const baseIconSize = options.density === "compact" ? 14 : options.density === "relaxed" ? 18 : 16;
  const baseIndent = options.density === "compact" ? 12 : options.density === "relaxed" ? 20 : 16;
  const rowHeight = Math.round(baseRowHeight * options.scale);
  const fontSize = Math.round(baseFontSize * options.scale);
  const iconSize = Math.round(baseIconSize * options.scale);
  const indentStep = Math.round(baseIndent * options.scale);
  const containerStyles = (0, import_react5.useMemo)(
    () => ({
      "--dsh-row-height": `${rowHeight}px`,
      "--dsh-font-size": `${fontSize}px`,
      "--dsh-icon-size": `${iconSize}px`,
      "--dsh-scale": `${options.scale}`
    }),
    [rowHeight, fontSize, iconSize, options.scale]
  );
  (0, import_react5.useEffect)(() => {
    if (sessionId) {
      setLastKnownSessionId(sessionId);
    }
  }, [sessionId]);
  (0, import_react5.useEffect)(() => {
    if (rootPath) return;
    const sessions = safeService2(ctx, "sessions");
    const snapshot = sessions?.list?.getSnapshot?.();
    const activeId = sessionId ?? sessions?.active?.id ?? sessions?.current?.id ?? snapshot?.ids?.[0];
    if (activeId && snapshot?.byId?.[activeId]?.cwd) {
      setRootPath(snapshot.byId[activeId].cwd);
      return;
    }
    if (snapshot?.byId) {
      const first = Object.values(snapshot.byId).find((s) => s?.cwd);
      if (first?.cwd) {
        setRootPath(first.cwd);
        return;
      }
    }
    const workspaces = safeService2(ctx, "workspaces");
    const ws = workspaces?.list?.getSnapshot?.();
    const item = ws?.items?.find((w) => w.sessionIds?.includes(activeId)) ?? ws?.items?.[0];
    if (item?.path) {
      setRootPath(item.path);
      return;
    }
    setLoading(true);
    fetchTree(activeId).then((listing) => {
      const normPath = listing.path.replace(/\\/g, "/");
      setRootPath(listing.path);
      setLevels((prev) => ({
        ...prev,
        [listing.path]: listing,
        [normPath]: listing
      }));
      setExpanded((prev) => new Set(prev).add(listing.path));
    }).catch((err) => {
      console.warn("[dsh-explorer] root fetchTree error:", err);
      setErrorMessage(err?.message || "Failed to connect to file service");
    }).finally(() => {
      setLoading(false);
    });
  }, [rootPath, sessionId, ctx]);
  const reloadDirectory = (0, import_react5.useCallback)(
    async (dir) => {
      setLoading(true);
      setErrorMessage(null);
      const normDir = dir.replace(/\\/g, "/");
      try {
        const sessions = safeService2(ctx, "sessions");
        const snapshot = sessions?.list?.getSnapshot?.();
        const activeId = sessionId ?? sessions?.active?.id ?? snapshot?.ids?.[0];
        const listing = await fetchTree(activeId, dir);
        if (listing) {
          const normListingPath = listing.path.replace(/\\/g, "/");
          setLevels((prev) => ({
            ...prev,
            [dir]: listing,
            [normDir]: listing,
            [listing.path]: listing,
            [normListingPath]: listing
          }));
        }
      } catch (err) {
        console.warn("[dsh-explorer] failed to load dir:", dir, err);
        setErrorMessage(err?.message || "Failed to load directory");
      } finally {
        setLoading(false);
      }
    },
    [sessionId, ctx]
  );
  const reloadGit = (0, import_react5.useCallback)(
    async (dir) => {
      try {
        const sessions = safeService2(ctx, "sessions");
        const activeId = sessionId ?? sessions?.active?.id;
        const git = await fetchGitStatus(activeId, dir);
        setGitData(git);
      } catch {
      }
    },
    [sessionId, ctx]
  );
  const expandedRef = (0, import_react5.useRef)(expanded);
  (0, import_react5.useEffect)(() => {
    expandedRef.current = expanded;
  }, [expanded]);
  const refreshAll = (0, import_react5.useCallback)(async () => {
    if (!rootPath) return;
    const currentExpanded = Array.from(expandedRef.current);
    const dirsToRefresh = Array.from(/* @__PURE__ */ new Set([rootPath, ...currentExpanded]));
    try {
      const [batch, rootListing2] = await Promise.all([
        fetchBatchTree(dirsToRefresh).catch(() => ({})),
        fetchTree(sessionId, rootPath).catch(() => null)
      ]);
      const mergedBatch = { ...batch };
      if (rootListing2) {
        mergedBatch[rootPath] = rootListing2;
        if (rootListing2.path) mergedBatch[rootListing2.path] = rootListing2;
      }
      setLevels((prev) => {
        const next = { ...prev };
        for (const [dirKey, listing] of Object.entries(mergedBatch)) {
          if (!listing) continue;
          const norm = dirKey.replace(/\\/g, "/");
          next[dirKey] = listing;
          next[norm] = listing;
          if (listing.path) {
            next[listing.path] = listing;
            next[listing.path.replace(/\\/g, "/")] = listing;
          }
        }
        for (const path of dirsToRefresh) {
          const norm = path.replace(/\\/g, "/");
          if (!mergedBatch[path] && !mergedBatch[norm] && path !== rootPath) {
            delete next[path];
            delete next[norm];
          }
        }
        return next;
      });
      setExpanded((prev) => {
        let changed = false;
        const next = new Set(prev);
        for (const expPath of prev) {
          if (expPath === rootPath) continue;
          const normExp = expPath.replace(/\\/g, "/");
          if (!mergedBatch[expPath] && !mergedBatch[normExp]) {
            next.delete(expPath);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
      reloadGit(rootPath);
    } catch (err) {
      console.warn("[dsh-explorer] refreshAll failed:", err);
    }
  }, [rootPath, sessionId, reloadGit]);
  (0, import_react5.useEffect)(() => {
    if (!rootPath) return;
    refreshAll();
    setExpanded((prev) => new Set(prev).add(rootPath));
  }, [rootPath, refreshAll]);
  (0, import_react5.useEffect)(() => {
    if (!rootPath) return;
    let debounceTimer = null;
    const scheduleRefresh = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        refreshAll();
      }, 100);
    };
    let es = null;
    try {
      const sseUrl = `/dsh-explorer/api/events?dir=${encodeURIComponent(rootPath)}`;
      es = new EventSource(sseUrl);
      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === "connected") return;
        } catch {
        }
        scheduleRefresh();
      };
    } catch (err) {
      console.warn("[dsh-explorer] SSE init error:", err);
    }
    let ws = null;
    try {
      const loc = window.location;
      const host = loc.host || (loc.port ? `127.0.0.1:${loc.port}` : "127.0.0.1");
      const wsProtocol = loc.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${wsProtocol}//${host}/dsh-explorer/api/watch?dir=${encodeURIComponent(rootPath)}`;
      ws = new WebSocket(wsUrl);
      ws.onmessage = () => {
        scheduleRefresh();
      };
    } catch {
    }
    const onFocus = () => {
      scheduleRefresh();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        scheduleRefresh();
      }
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        scheduleRefresh();
      }
    }, 3e3);
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (es) {
        try {
          es.close();
        } catch {
        }
      }
      if (ws) {
        try {
          ws.close();
        } catch {
        }
      }
    };
  }, [rootPath, refreshAll]);
  const toggleExpand = (0, import_react5.useCallback)(
    async (path) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(path)) {
          next.delete(path);
        } else {
          next.add(path);
          const norm = path.replace(/\\/g, "/");
          if (!levels[path] && !levels[norm]) {
            reloadDirectory(path);
          }
        }
        return next;
      });
    },
    [levels, reloadDirectory]
  );
  const getRelativePath = (0, import_react5.useCallback)(
    (fullPath) => {
      if (!rootPath) return fullPath;
      const normRoot = rootPath.replace(/\\/g, "/").replace(/\/+$/, "");
      const normTarget = fullPath.replace(/\\/g, "/");
      if (normTarget.toLowerCase().startsWith(`${normRoot.toLowerCase()}/`)) {
        return normTarget.slice(normRoot.length + 1);
      }
      return fullPath;
    },
    [rootPath]
  );
  const gitStatusMap = (0, import_react5.useMemo)(() => {
    const map = /* @__PURE__ */ new Map();
    for (const entry of gitData.entries) {
      const p = entry.path.replace(/\\/g, "/").toLowerCase();
      map.set(p, entry.xy);
      let parent = p;
      while (true) {
        const lastSlash = parent.lastIndexOf("/");
        if (lastSlash === -1) break;
        parent = parent.slice(0, lastSlash);
        if (!parent) break;
        const existing = map.get(parent);
        if (!existing) {
          map.set(parent, entry.xy);
        } else if (entry.xy.includes("M") && !existing.includes("M")) {
          map.set(parent, " M");
        }
      }
    }
    return map;
  }, [gitData]);
  const visibleFlatRows = (0, import_react5.useMemo)(() => {
    const normRoot = rootPath.replace(/\\/g, "/");
    const rootListing2 = levels[rootPath] ?? levels[normRoot];
    if (!rootPath || !rootListing2) return [];
    const rows = [];
    const walk = (dir) => {
      const normD = dir.replace(/\\/g, "/");
      const listing = levels[dir] ?? levels[normD];
      if (!listing) return;
      for (const entry of listing.entries) {
        if (!options.showHiddenFiles && (entry.hidden || entry.name.startsWith("."))) {
          continue;
        }
        const rel = getRelativePath(entry.path);
        if (filterText) {
          const match = entry.name.toLowerCase().includes(filterText.toLowerCase()) || rel.toLowerCase().includes(filterText.toLowerCase());
          if (!match && !entry.isDir) continue;
        }
        if (options.compactFolders && entry.isDir) {
          const chain = [entry];
          let curr = entry;
          let currL = levels[curr.path] ?? levels[curr.path.replace(/\\/g, "/")];
          while (currL && currL.entries) {
            const valid = options.showHiddenFiles ? currL.entries : currL.entries.filter((c) => !c.hidden && !c.name.startsWith("."));
            if (valid.length === 1 && valid[0].isDir) {
              const next = valid[0];
              chain.push(next);
              curr = next;
              currL = levels[curr.path] ?? levels[curr.path.replace(/\\/g, "/")];
            } else {
              break;
            }
          }
          if (chain.length > 1) {
            const compactRel = getRelativePath(curr.path);
            rows.push({ entry: curr, relativePath: compactRel });
            if (expanded.has(entry.path) || expanded.has(curr.path) || Boolean(filterText)) {
              walk(curr.path);
            }
            continue;
          }
        }
        rows.push({ entry, relativePath: rel });
        if (entry.isDir && (expanded.has(entry.path) || Boolean(filterText))) {
          walk(entry.path);
        }
      }
    };
    walk(rootPath);
    return rows;
  }, [rootPath, levels, expanded, filterText, getRelativePath, options.showHiddenFiles, options.compactFolders]);
  const handleKeyDown = (e) => {
    if (visibleFlatRows.length === 0) return;
    const currentIndex = visibleFlatRows.findIndex((r) => r.entry.path === focusedPath);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = currentIndex < visibleFlatRows.length - 1 ? currentIndex + 1 : 0;
      const nextRow = visibleFlatRows[nextIndex];
      if (nextRow) {
        setFocusedPath(nextRow.entry.path);
        setSelected(/* @__PURE__ */ new Set([nextRow.entry.path]));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : visibleFlatRows.length - 1;
      const prevRow = visibleFlatRows[prevIndex];
      if (prevRow) {
        setFocusedPath(prevRow.entry.path);
        setSelected(/* @__PURE__ */ new Set([prevRow.entry.path]));
      }
    } else if (e.key === "ArrowRight") {
      const currentRow = visibleFlatRows[currentIndex];
      if (currentRow?.entry.isDir && !expanded.has(currentRow.entry.path)) {
        e.preventDefault();
        toggleExpand(currentRow.entry.path);
      }
    } else if (e.key === "ArrowLeft") {
      const currentRow = visibleFlatRows[currentIndex];
      if (currentRow?.entry.isDir && expanded.has(currentRow.entry.path)) {
        e.preventDefault();
        toggleExpand(currentRow.entry.path);
      }
    } else if (e.key === "Enter") {
      const currentRow = visibleFlatRows[currentIndex];
      if (currentRow) {
        e.preventDefault();
        if (currentRow.entry.isDir) {
          toggleExpand(currentRow.entry.path);
        } else {
          const activeId = sessionId ?? safeService2(ctx, "sessions")?.active?.id ?? "";
          insertMentionToComposer(ctx, activeId, currentRow.relativePath, false);
        }
      }
    }
  };
  const handleRowSelect = (entryPath, e) => {
    setFocusedPath(entryPath);
    if (e.ctrlKey || e.metaKey) {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(entryPath)) next.delete(entryPath);
        else next.add(entryPath);
        return next;
      });
    } else {
      setSelected(/* @__PURE__ */ new Set([entryPath]));
    }
  };
  const handleCreateSubmit = async () => {
    if (!creating || !creatingName.trim()) {
      setCreating(null);
      return;
    }
    const name = creatingName.trim();
    const parent = creating.parentDir;
    try {
      if (creating.isDir) {
        await apiCreateDirectory(parent, name);
      } else {
        await apiCreateNewFile(parent, name);
      }
      refreshAll();
      setExpanded((prev) => new Set(prev).add(parent));
    } catch (err) {
      alert(err.message || "Operation failed");
    } finally {
      setCreating(null);
      setCreatingName("");
    }
  };
  const handleRename = async (entryPath, newName) => {
    try {
      await apiRename(entryPath, newName);
      refreshAll();
    } catch (err) {
      alert(err.message || "Rename failed");
    }
  };
  const handleDelete = async (entry) => {
    if (!confirm(`Are you sure you want to delete "${entry.name}"?`)) return;
    try {
      await apiDelete(entry.path);
      refreshAll();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };
  const handleExplorerDrop = async (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      const targetDir = rootPath;
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        const uploadUrl = `/dsh-explorer/api/upload?dir=${encodeURIComponent(targetDir)}&relativePath=${encodeURIComponent(file.name)}`;
        await fetch(uploadUrl, { method: "POST", body: file });
      }
      refreshAll();
    }
  };
  const handleOpenFile = (0, import_react5.useCallback)(
    (filePath, relPath) => {
      openFileInTab(ctx, sessionId ?? "", filePath, relPath);
    },
    [ctx, sessionId]
  );
  const title = rootPath ? baseName(rootPath) : "EXPLORER";
  const rootListing = levels[rootPath] ?? levels[rootPath.replace(/\\/g, "/")];
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    "div",
    {
      className: `${explorer_default.container} ${!options.enableMotion ? explorer_default.noMotion : ""}`,
      style: containerStyles,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          ExplorerHeader,
          {
            title: `EXPLORER: ${title}`,
            searchOpen,
            optionsOpen,
            onToggleSearch: () => setSearchOpen(!searchOpen),
            onToggleOptions: () => setOptionsOpen(!optionsOpen),
            onNewFile: () => {
              setCreating({ parentDir: rootPath, isDir: false });
              setCreatingName("");
            },
            onNewFolder: () => {
              setCreating({ parentDir: rootPath, isDir: true });
              setCreatingName("");
            },
            onRefresh: () => {
              refreshAll();
            },
            onCollapseAll: () => {
              setExpanded(/* @__PURE__ */ new Set());
            }
          }
        ),
        optionsOpen && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          ExplorerOptionsModal,
          {
            options,
            onChange: handleUpdateOptions,
            onReset: handleResetOptions,
            onClose: () => setOptionsOpen(false)
          }
        ),
        searchOpen && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          ExplorerSearch,
          {
            value: filterText,
            onChange: setFilterText,
            onClose: () => {
              setFilterText("");
              setSearchOpen(false);
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "div",
          {
            ref: treeBodyRef,
            className: explorer_default.treeBody,
            tabIndex: 0,
            onKeyDown: handleKeyDown,
            onDragOver: (e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            },
            onDrop: handleExplorerDrop,
            children: [
              creating && creating.parentDir === rootPath && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: explorer_default.row, style: { paddingLeft: `${indentStep + 8}px` }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: explorer_default.iconWrap, children: creating.isDir ? "\u{1F4C1}" : "\u{1F4C4}" }),
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                  "input",
                  {
                    ref: createInputRef,
                    autoFocus: true,
                    type: "text",
                    className: explorer_default.inlineInput,
                    placeholder: creating.isDir ? "Folder name..." : "File name...",
                    value: creatingName,
                    onChange: (e) => setCreatingName(e.target.value),
                    onKeyDown: (e) => {
                      if (e.key === "Enter") handleCreateSubmit();
                      else if (e.key === "Escape") setCreating(null);
                    },
                    onBlur: handleCreateSubmit
                  }
                )
              ] }),
              rootListing?.entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                TreeNode,
                {
                  entry,
                  depth: 0,
                  parentDir: rootPath,
                  rootPath,
                  levels,
                  expanded,
                  selected,
                  focusedPath,
                  gitStatusMap,
                  filterText,
                  creating,
                  creatingName,
                  createInputRef,
                  options,
                  indentStep,
                  iconSize,
                  reloadDirectory,
                  onToggle: toggleExpand,
                  onSelect: handleRowSelect,
                  onOpenFile: handleOpenFile,
                  onContextMenu: (ent, rel, e) => {
                    e.preventDefault();
                    setContextMenu({
                      x: e.clientX,
                      y: e.clientY,
                      entry: ent,
                      relativePath: rel
                    });
                  },
                  onInsertReference: (rel, isDir) => {
                    const activeId = sessionId ?? safeService2(ctx, "sessions")?.active?.id ?? "";
                    insertMentionToComposer(ctx, activeId, rel, isDir);
                  },
                  onCopyRelativePath: (rel) => {
                    navigator.clipboard.writeText(rel);
                  },
                  onRenameSubmit: (path, newName) => handleRename(path, newName),
                  onDelete: handleDelete,
                  onCreatingNameChange: setCreatingName,
                  onCreatingKeyDown: (e) => {
                    if (e.key === "Enter") handleCreateSubmit();
                    else if (e.key === "Escape") setCreating(null);
                  },
                  onCreatingBlur: handleCreateSubmit,
                  getRelativePath
                },
                entry.path
              )),
              visibleFlatRows.length === 0 && !creating && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: explorer_default.emptyState, children: loading ? "Loading workspace files..." : errorMessage ? `Error: ${errorMessage}` : filterText ? "No matching files found" : !options.showHiddenFiles ? "Only hidden files present (enable in options)" : "Empty directory" })
            ]
          }
        ),
        contextMenu && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          ExplorerContextMenu,
          {
            x: contextMenu.x,
            y: contextMenu.y,
            entry: contextMenu.entry,
            relativePath: contextMenu.relativePath,
            onClose: () => setContextMenu(null),
            onOpenFile: () => handleOpenFile(contextMenu.entry.path, contextMenu.relativePath),
            onInsertReference: () => {
              const activeId = sessionId ?? safeService2(ctx, "sessions")?.active?.id ?? "";
              insertMentionToComposer(ctx, activeId, contextMenu.relativePath, contextMenu.entry.isDir);
            },
            onInsertSnippet: async () => {
              const activeId = sessionId ?? safeService2(ctx, "sessions")?.active?.id ?? "";
              try {
                const content = await fetchFileContent(contextMenu.entry.path);
                insertSnippetToComposer(ctx, activeId, contextMenu.relativePath, content);
              } catch (err) {
                alert(err.message || "Failed to read file");
              }
            },
            onCopyPath: () => {
              navigator.clipboard.writeText(contextMenu.entry.path);
            },
            onCopyRelativePath: () => {
              navigator.clipboard.writeText(contextMenu.relativePath);
            },
            onNewFile: () => {
              setCreating({ parentDir: contextMenu.entry.path, isDir: false });
              setCreatingName("");
            },
            onNewFolder: () => {
              setCreating({ parentDir: contextMenu.entry.path, isDir: true });
              setCreatingName("");
            },
            onRename: () => {
              setFocusedPath(contextMenu.entry.path);
            },
            onDelete: () => handleDelete(contextMenu.entry)
          }
        )
      ]
    }
  );
};

// src/client/index.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
var inject = [
  "slots",
  "sessions",
  "locale"
];
var ExplorerTabIcon = () => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d: "M14 4.5V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6.5L14 4.5zm-1 0H9.5a.5.5 0 0 1-.5-.5V2H3v12h10V4.5z" }) });
var ExplorerTabTitle = (0, import_react6.memo)(function ExplorerTabTitle2() {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { style: { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ExplorerTabIcon, {}),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: "Explorer" })
  ] });
});
var ExplorerPaneBody = (0, import_react6.memo)(function ExplorerPaneBody2(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ExplorerView, { ctx: props.ctx, sessionId: props.sessionId });
});
var ExplorerHeaderButton = ({ ctx, sessionId }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "button",
    {
      type: "button",
      title: "Explorer (File Tree)",
      "aria-label": "Explorer",
      onClick: () => {
        try {
          const sr = ctx.get ? ctx.get("sidebarRight") : ctx.sidebarRight;
          if (sessionId && sr?.openTabIn) {
            sr.openTabIn(sessionId, "explorer");
          } else if (sr?.openTab) {
            sr.openTab("explorer");
          }
        } catch (err) {
          console.warn("[dsh-explorer] failed to open sidebar tab:", err);
        }
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "3px 6px",
        borderRadius: "6px",
        color: "var(--dsw-alias-label-secondary, #8b949e)",
        transition: "color 0.15s, background-color 0.15s"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.color = "var(--dsw-alias-label-primary, #ffffff)";
        e.currentTarget.style.backgroundColor = "var(--dsw-alias-bg-hover, rgba(255, 255, 255, 0.08))";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.color = "var(--dsw-alias-label-secondary, #8b949e)";
        e.currentTarget.style.backgroundColor = "transparent";
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ExplorerTabIcon, {})
    }
  );
};
function apply(ctx) {
  ctx.effect(() => {
    try {
      return setupCaretTracker();
    } catch (err) {
      console.warn("[dsh-explorer] failed to setup caret tracker:", err);
      return () => {
      };
    }
  }, "dsh-explorer: caret tracker");
  ctx.effect(() => {
    try {
      return attachGlobalConversationDropListener(ctx);
    } catch (err) {
      console.warn("[dsh-explorer] failed to attach conversation drop listener:", err);
      return () => {
      };
    }
  }, "dsh-explorer: conversation drop listener");
  ctx.slots.inject(
    "conversation.session.header.utilities",
    () => ctx.slots.register(
      {
        name: "conversation.session.header.utilities",
        id: "dsh-explorer:header-button",
        order: 15,
        inject: (sessionId) => ({ sessionId })
      },
      (props) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ExplorerHeaderButton, { ctx, sessionId: props.sessionId })
    )
  );
  ctx.inject(["sidebarRightTabs"], (injected) => {
    const tabs = injected.get ? injected.get("sidebarRightTabs") : injected.sidebarRightTabs;
    if (!tabs?.register) return;
    const unregisterExplorer = tabs.register({
      id: "dsh-explorer",
      kind: "explorer",
      keepMounted: true,
      priority: "extension",
      title: () => "Explorer",
      guide: [
        {
          id: "dsh-explorer",
          order: 5,
          title: () => "Explorer",
          description: () => "VS Code style file explorer with drag & drop to chat",
          icon: ExplorerTabIcon
        }
      ]
    });
    const offBody = ctx.slots.inject(
      "sidebar.right.pane.tab",
      () => ctx.slots.register(
        {
          name: "sidebar.right.pane.tab",
          key: "dsh-explorer",
          inject: (sessionId) => ({ ctx, sessionId })
        },
        ExplorerPaneBody
      )
    );
    const offTitle = ctx.slots.inject(
      "sidebar.right.pane.tab.title",
      () => ctx.slots.register(
        {
          name: "sidebar.right.pane.tab.title",
          key: "dsh-explorer",
          inject: (sessionId) => ({ sessionId })
        },
        ExplorerTabTitle
      )
    );
    return () => {
      try {
        offTitle?.();
      } catch {
      }
      try {
        offBody?.();
      } catch {
      }
      try {
        unregisterExplorer?.();
      } catch {
      }
    };
  });
}


    return module.exports;
  }
});

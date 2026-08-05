import React, { useState } from 'react';
import { CalculationHistoryItem } from '../types';
import { Trash2, Copy, Download, Bookmark, Check, CornerDownLeft } from 'lucide-react';
import { formatDisplayNumber } from '../lib/calcEngine';

interface HistorySidebarProps {
  history: CalculationHistoryItem[];
  onSelectHistoryItem: (item: CalculationHistoryItem) => void;
  onClearHistory: () => void;
  onToggleArchiveItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClose?: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
  onToggleArchiveItem,
  onDeleteItem,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'archive'>('history');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) =>
    activeTab === 'archive' ? item.isArchived : !item.isArchived
  );

  const handleCopy = (item: CalculationHistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${item.expression} = ${item.result}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `calc_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0B] border-l border-white/10 w-full sm:w-80 md:w-96 select-none shadow-2xl">
      {/* Header Tabs */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#141416]">
        <div className="flex items-center space-x-4">
          <button
            id="tab-history"
            onClick={() => setActiveTab('history')}
            className={`text-xs font-mono font-medium transition-colors ${
              activeTab === 'history' ? 'text-white border-b-2 border-blue-500 pb-1' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            History ({history.filter((i) => !i.isArchived).length})
          </button>
          <button
            id="tab-archive"
            onClick={() => setActiveTab('archive')}
            className={`text-xs font-mono font-medium transition-colors ${
              activeTab === 'archive' ? 'text-white border-b-2 border-blue-500 pb-1' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Archive ({history.filter((i) => i.isArchived).length})
          </button>
        </div>

        <button
          id="btn-export-history"
          onClick={handleExportJSON}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-white/5"
          title="Export History JSON"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-xs font-mono">
            <p>No calculations in {activeTab}</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistoryItem(item)}
              className="group relative flex flex-col items-end p-3.5 rounded-xl bg-[#141416] hover:bg-white/5 border border-white/10 transition-all cursor-pointer"
            >
              <div className="text-xs font-mono text-slate-400 tracking-wide mb-1 overflow-x-auto max-w-full text-right no-scrollbar">
                {item.expression} =
              </div>

              <div className="text-lg sm:text-xl font-mono font-semibold text-white tracking-tight overflow-x-auto max-w-full text-right no-scrollbar">
                {formatDisplayNumber(item.result)}
              </div>

              {/* Action Buttons Overlay on Hover */}
              <div className="flex items-center gap-1 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectHistoryItem(item);
                  }}
                  className="p-1.5 text-xs text-blue-400 hover:bg-blue-500/20 rounded-lg flex items-center gap-1 border border-blue-500/20"
                  title="Insert into Calculator"
                >
                  <CornerDownLeft className="w-3.5 h-3.5" />
                  <span>Insert</span>
                </button>

                <button
                  onClick={(e) => handleCopy(item, e)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg border border-white/5"
                  title="Copy Expression"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleArchiveItem(item.id);
                  }}
                  className={`p-1.5 rounded-lg border ${
                    item.isArchived
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                      : 'text-slate-400 hover:text-amber-300 hover:bg-white/10 border-white/5'
                  }`}
                  title={item.isArchived ? 'Unarchive' : 'Archive'}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-white/5"
                  title="Delete Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-white/10 bg-[#141416] flex items-center justify-between text-xs font-mono text-slate-400">
        <button
          id="btn-clear-history-all"
          onClick={onClearHistory}
          className="flex items-center space-x-1.5 hover:text-rose-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>

        <span className="text-[10px] text-slate-500 tracking-wider">AUTO-SYNCED</span>
      </div>
    </div>
  );
};

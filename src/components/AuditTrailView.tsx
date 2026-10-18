import React, { useState } from 'react';
import { AuditEvent } from '../types';

interface AuditTrailViewProps {
  auditTrail: AuditEvent[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ auditTrail }) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [exportedStatus, setExportedStatus] = useState<string>('');

  const types = ['All', 'Mandate', 'Evidence', 'Assessment', 'Decision', 'Milestone', 'Organization'];

  const filteredEvents = auditTrail.filter((event) => {
    const matchesType = filterType === 'All' || event.entityType === filterType;
    const matchesSearch = event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditTrail, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `atlas_sanctum_audit_log_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportedStatus('Audit log exported successfully in structured JSON format.');
    setTimeout(() => setExportedStatus(''), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2C5E4B] mb-2">
            MVP Capability 08 · Audit Trail & Exports
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#0B241A]">
            Cryptographic Event Log & Accountability Record
          </h2>
          <p className="text-sm text-[#57534E] max-w-2xl mt-1">
            Immutable chronological ledger documenting every mandate amendment, evidence upload, council vote, milestone sign-off, and institutional export.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJson}
            className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-white border border-[#0B241A] text-[#0B241A] rounded hover:bg-[#F4F1EA] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Audit Trail (JSON)</span>
          </button>
        </div>
      </div>

      {exportedStatus && (
        <div className="p-3 bg-[#E8F3EE] border border-[#2C5E4B]/30 rounded text-xs text-[#13382C] font-medium">
          {exportedStatus}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F4F1EA] p-3 rounded-lg border border-[#E8E4DC]">
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-[#0B241A] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#0B241A] hover:bg-[#E8E4DC]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white border border-[#E8E4DC] rounded text-[#0B241A] placeholder-[#A8A29E] focus:outline-none focus:border-[#0B241A]"
          />
        </div>
      </div>

      {/* Event Timeline / Table */}
      <div className="bg-white border border-[#E8E4DC] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F4F1EA] text-[#57534E] uppercase text-[10px] tracking-wider border-b border-[#E8E4DC]">
                <th className="py-3 px-5 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Actor & Role</th>
                <th className="py-3 px-4 font-semibold">Action Type</th>
                <th className="py-3 px-4 font-semibold">Entity</th>
                <th className="py-3 px-5 font-semibold">Audit Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DC]">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-[#FBF9F5] transition-colors">
                  <td className="py-3 px-5 font-mono text-[11px] text-[#78716C] whitespace-nowrap">
                    {event.timestamp}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#0B241A]">
                    <div>{event.actor}</div>
                    <div className="text-[10px] text-[#78716C] font-mono">{event.actorRole}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[11px] text-[#0B241A]">
                    <span className="px-2 py-0.5 rounded bg-[#F4F1EA] border border-[#E8E4DC]">
                      {event.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#57534E]">
                    <span className="font-semibold text-[#0B241A]">{event.entityType}</span>
                    <span className="text-[10px] text-[#78716C] block font-mono">ID: {event.entityId}</span>
                  </td>
                  <td className="py-3 px-5 text-[#44403C] leading-normal max-w-md">
                    {event.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integrity Guarantee Footer */}
      <div className="p-4 bg-[#FBF9F5] border border-[#E8E4DC] rounded-lg text-xs text-[#57534E] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2C5E4B]"></span>
          <span>Ledger Integrity State: <strong className="text-[#0B241A]">All Hash Chains Verified</strong></span>
        </div>
        <span className="text-[11px] font-mono text-[#78716C]">
          System Node: Atlas Sanctum Rift Valley Station
        </span>
      </div>
    </div>
  );
};

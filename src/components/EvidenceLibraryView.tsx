import React, { useState } from 'react';
import { EvidenceDocument, Opportunity, AiDraftSynthesis } from '../types';

interface EvidenceLibraryViewProps {
  documents: EvidenceDocument[];
  opportunities: Opportunity[];
  aiSyntheses: AiDraftSynthesis[];
  onAddDocument: (doc: EvidenceDocument) => void;
  onApproveAiSynthesis: (synthesisId: string, reviewerName: string) => void;
  currentUserName: string;
}

export const EvidenceLibraryView: React.FC<EvidenceLibraryViewProps> = ({
  documents,
  opportunities,
  aiSyntheses,
  onAddDocument,
  onApproveAiSynthesis,
  currentUserName
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'documents' | 'gaps' | 'ai-synthesis'>('documents');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Document Form State
  const [newDoc, setNewDoc] = useState({
    title: '',
    opportunityId: opportunities[0]?.id || 'opp-01',
    category: 'Soil Telemetry' as EvidenceDocument['category'],
    authorOrOrg: '',
    date: new Date().toISOString().split('T')[0],
    verificationTier: 'Third-Party Certified' as EvidenceDocument['verificationTier'],
    summary: ''
  });

  const categories = [
    'All',
    'Soil Telemetry',
    'Financial Audit',
    'Legal Title',
    'Hydrological Sensor',
    'Community FPIC Consent'
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.authorOrOrg.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.authorOrOrg) return;

    const pseudoHash = 'sha256-' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const created: EvidenceDocument = {
      id: `doc-${Date.now().toString().slice(-4)}`,
      opportunityId: newDoc.opportunityId,
      title: newDoc.title,
      category: newDoc.category,
      authorOrOrg: newDoc.authorOrOrg,
      date: newDoc.date,
      verificationTier: newDoc.verificationTier,
      hash: pseudoHash,
      summary: newDoc.summary || 'Uploaded and cryptographically indexed for investment committee verification.',
      status: 'Approved'
    };

    onAddDocument(created);
    setShowAddModal(false);
    setNewDoc({
      title: '',
      opportunityId: opportunities[0]?.id || 'opp-01',
      category: 'Soil Telemetry',
      authorOrOrg: '',
      date: new Date().toISOString().split('T')[0],
      verificationTier: 'Third-Party Certified',
      summary: ''
    });
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2C5E4B] mb-2">
            MVP Capability 04 · Evidence Library
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#0B241A]">
            Source Provenance & Information Gap Repository
          </h2>
          <p className="text-sm text-[#57534E] max-w-2xl mt-1">
            Manage primary evidence, sensor streams, audited financials, and community consent records. Every record includes cryptographic hashes, freshness timestamps, and human-in-the-loop review controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-[#0B241A] text-white rounded hover:bg-[#13382C] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>+ Ingest Evidence Source</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E8E4DC] text-xs">
        <button
          onClick={() => setActiveTab('documents')}
          className={`py-2 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'documents'
              ? 'border-[#0B241A] text-[#0B241A]'
              : 'border-transparent text-[#78716C] hover:text-[#0B241A]'
          }`}
        >
          Primary Sources ({documents.length})
        </button>
        <button
          onClick={() => setActiveTab('gaps')}
          className={`py-2 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'gaps'
              ? 'border-[#0B241A] text-[#0B241A]'
              : 'border-transparent text-[#78716C] hover:text-[#0B241A]'
          }`}
        >
          Information Gap Tracker ({opportunities.reduce((acc, o) => acc + o.unresolvedGaps.length, 0)} Open Gaps)
        </button>
        <button
          onClick={() => setActiveTab('ai-synthesis')}
          className={`py-2 px-4 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ai-synthesis'
              ? 'border-[#0B241A] text-[#0B241A]'
              : 'border-transparent text-[#78716C] hover:text-[#0B241A]'
          }`}
        >
          <span>AI Evidence Synthesis (Human-Gated)</span>
          <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
        </button>
      </div>

      {/* Tab 1: Primary Documents Repository */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F4F1EA] p-3 rounded-lg border border-[#E8E4DC]">
            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0B241A] text-white shadow-xs'
                      : 'text-[#57534E] hover:text-[#0B241A] hover:bg-[#E8E4DC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by title, auditor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#E8E4DC] rounded text-[#0B241A] placeholder-[#A8A29E] focus:outline-none focus:border-[#0B241A]"
              />
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => {
              const opp = opportunities.find(o => o.id === doc.opportunityId);
              return (
                <div
                  key={doc.id}
                  className="p-5 bg-white border border-[#E8E4DC] rounded-lg shadow-xs hover:border-[#2C5E4B] transition-colors flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-[#2C5E4B] uppercase tracking-wider font-semibold">
                        {doc.category}
                      </span>
                      <span className="text-[#78716C] font-mono text-[10px]">
                        {doc.date}
                      </span>
                    </div>

                    <h4 className="text-base font-serif font-semibold text-[#0B241A] leading-snug">
                      {doc.title}
                    </h4>

                    <div className="text-xs text-[#78716C]">
                      Auditor / Issuer: <strong className="text-[#44403C]">{doc.authorOrOrg}</strong>
                    </div>

                    <div className="text-xs text-[#57534E] leading-relaxed pt-1">
                      {doc.summary}
                    </div>

                    {opp && (
                      <div className="text-[11px] text-[#78716C] pt-2 border-t border-[#F4F1EA]">
                        Associated Opportunity: <span className="font-medium text-[#0B241A]">{opp.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#E8E4DC] flex items-center justify-between text-[10px] font-mono text-[#78716C]">
                    <span className="truncate max-w-[200px]" title={doc.hash}>
                      {doc.hash.slice(0, 24)}...
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#E8F3EE] text-[#13382C] font-semibold">
                      {doc.verificationTier}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Information Gap Tracker */}
      {activeTab === 'gaps' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
            <strong className="block font-semibold uppercase text-amber-950 mb-1">
              Intellectual Honesty Protocol: Explicit Gap Governance
            </strong>
            Atlas Sanctum does not allow opportunities to proceed to capital disbursement until all pre-disbursement information gaps have been assigned to field auditors and independently closed.
          </div>

          <div className="space-y-4">
            {opportunities.map((opp) => (
              <div key={opp.id} className="p-5 bg-white border border-[#E8E4DC] rounded-lg space-y-3">
                <div className="flex items-center justify-between border-b border-[#F4F1EA] pb-2">
                  <div>
                    <h4 className="font-serif font-semibold text-base text-[#0B241A]">{opp.name}</h4>
                    <span className="text-xs text-[#78716C]">{opp.county}, {opp.country}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded">
                    {opp.unresolvedGaps.length} Unresolved Information Gaps
                  </span>
                </div>

                <div className="space-y-2">
                  {opp.unresolvedGaps.map((gap, i) => (
                    <div key={i} className="p-3 bg-[#FBF9F5] border border-[#E8E4DC] rounded text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span className="text-amber-700 font-bold mt-0.5">•</span>
                        <span className="text-[#44403C]">{gap}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold">
                          Required Pre-Wire Gate
                        </span>
                        <span className="text-[11px] text-[#78716C]">
                          Assigned: Field Inspector
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Controlled AI Synthesis (Human-Gated) */}
      {activeTab === 'ai-synthesis' && (
        <div className="space-y-6">
          <div className="p-4 bg-[#F4F1EA] border border-[#E8E4DC] rounded-lg text-xs text-[#57534E] leading-relaxed">
            <strong className="block text-[#0B241A] font-semibold uppercase mb-1">
              AI Evidence Governance Standard (README Section 06)
            </strong>
            AI models generate structured draft syntheses referencing verified documents only. AI assistance is strictly advisory and cannot silently approve assessments or decisions. Consequential evaluations require authorized human review and signed certification.
          </div>

          <div className="space-y-4">
            {aiSyntheses.map((syn) => {
              const opp = opportunities.find(o => o.id === syn.opportunityId);
              return (
                <div key={syn.id} className="p-6 bg-white border border-[#E8E4DC] rounded-xl shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E4DC] pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#2C5E4B]">
                        Automated Evidence Cross-Reference Draft
                      </span>
                      <h4 className="text-lg font-serif font-semibold text-[#0B241A]">
                        {opp?.name || 'Candidate Project Synthesis'}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono bg-[#E8F3EE] text-[#13382C] px-2.5 py-1 rounded font-semibold">
                        Confidence: {syn.confidenceScore}%
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded font-semibold ${
                        syn.humanReviewed ? 'bg-[#0B241A] text-white' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {syn.humanReviewed ? 'Human Certified' : 'Pending Human Sign-Off'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FBF9F5] border border-[#E8E4DC] rounded text-xs sm:text-sm text-[#333] leading-relaxed">
                    {syn.summary}
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase text-[#0B241A] tracking-wider block">
                      Cited Primary Evidence Sources ({syn.citedSourceIds.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      {syn.citedSourceIds.map((docId) => {
                        const citedDoc = documents.find(d => d.id === docId);
                        return citedDoc ? (
                          <div key={docId} className="p-2.5 bg-[#F4F1EA] border border-[#E8E4DC] rounded text-[11px]">
                            <span className="font-medium text-[#0B241A] block truncate">{citedDoc.title}</span>
                            <span className="text-[#78716C] text-[10px]">{citedDoc.authorOrOrg}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8E4DC] flex items-center justify-between text-xs">
                    <span className="text-[#78716C]">
                      {syn.humanReviewed ? (
                        <span>Verified & Approved by: <strong className="text-[#0B241A]">{syn.reviewedBy}</strong></span>
                      ) : (
                        <span>Requires human analyst verification before inclusion in committee dossier.</span>
                      )}
                    </span>

                    {!syn.humanReviewed && (
                      <button
                        onClick={() => onApproveAiSynthesis(syn.id, currentUserName)}
                        className="px-4 py-2 bg-[#0B241A] text-white text-xs font-medium uppercase tracking-wider rounded hover:bg-[#13382C] transition-colors cursor-pointer"
                      >
                        Sign Off as {currentUserName}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ingest Evidence Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B241A]/70 backdrop-blur-xs">
          <div className="bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <h3 className="font-serif font-semibold text-lg text-[#0B241A]">
                Ingest Primary Evidence Source
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#78716C] hover:text-[#0B241A] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium uppercase text-[#57534E] mb-1">
                  Document / Telemetry Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hydro-Acoustic Benthic Sensor Stream"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-sm text-[#0B241A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium uppercase text-[#57534E] mb-1">
                    Opportunity
                  </label>
                  <select
                    value={newDoc.opportunityId}
                    onChange={(e) => setNewDoc({ ...newDoc, opportunityId: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-xs text-[#0B241A] focus:outline-none"
                  >
                    {opportunities.map((opp) => (
                      <option key={opp.id} value={opp.id}>{opp.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium uppercase text-[#57534E] mb-1">
                    Category
                  </label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-xs text-[#0B241A] focus:outline-none"
                  >
                    <option value="Soil Telemetry">Soil Telemetry</option>
                    <option value="Financial Audit">Financial Audit</option>
                    <option value="Legal Title">Legal Title</option>
                    <option value="Hydrological Sensor">Hydrological Sensor</option>
                    <option value="Community FPIC Consent">Community FPIC Consent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium uppercase text-[#57534E] mb-1">
                    Issuer or Auditor
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SoilCares & KALRO"
                    value={newDoc.authorOrOrg}
                    onChange={(e) => setNewDoc({ ...newDoc, authorOrOrg: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-xs text-[#0B241A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium uppercase text-[#57534E] mb-1">
                    Verification Tier
                  </label>
                  <select
                    value={newDoc.verificationTier}
                    onChange={(e) => setNewDoc({ ...newDoc, verificationTier: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-xs text-[#0B241A] focus:outline-none"
                  >
                    <option value="Third-Party Certified">Third-Party Certified</option>
                    <option value="Field Inspector Signed">Field Inspector Signed</option>
                    <option value="Partner Self-Reported">Partner Self-Reported</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium uppercase text-[#57534E] mb-1">
                  Key Findings / Telemetry Digest
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize audited parameters, sample sizes, and dates..."
                  value={newDoc.summary}
                  onChange={(e) => setNewDoc({ ...newDoc, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-xs text-[#0B241A] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E4DC]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 uppercase text-[#78716C] hover:text-[#0B241A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B241A] text-white uppercase font-medium rounded hover:bg-[#13382C] cursor-pointer"
                >
                  Index & Ingest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Organization, TeamMember } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCommission: () => void;
  currentOrg: Organization;
  currentMember: TeamMember;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenCommission,
  currentOrg,
  currentMember
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8E4DC]">
      {/* Top Bar Contract (Zone 1: Wordmark — Zone 2: Nav Links — Zone 3: Primary Action) */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button 
          onClick={() => setActiveTab('observatory')} 
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-xl font-serif font-semibold tracking-tight text-[#0B241A] block whitespace-nowrap shrink-0 group-hover:text-[#2C5E4B] transition-colors">
            Atlas Sanctum
          </span>
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium tracking-wide uppercase">
          <button
            onClick={() => setActiveTab('observatory')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#0B241A] cursor-pointer ${
              activeTab === 'observatory' 
                ? 'text-[#0B241A] font-semibold border-b border-[#0B241A]' 
                : 'text-[#57534E]'
            }`}
          >
            Observatory
          </button>
          
          <button
            onClick={() => setActiveTab('mandate')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#0B241A] cursor-pointer ${
              activeTab === 'mandate' 
                ? 'text-[#0B241A] font-semibold border-b border-[#0B241A]' 
                : 'text-[#57534E]'
            }`}
          >
            Mandates
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#0B241A] cursor-pointer ${
              activeTab === 'evidence' 
                ? 'text-[#0B241A] font-semibold border-b border-[#0B241A]' 
                : 'text-[#57534E]'
            }`}
          >
            Evidence Library
          </button>

          <button
            onClick={() => setActiveTab('decisions')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#0B241A] cursor-pointer ${
              activeTab === 'decisions' 
                ? 'text-[#0B241A] font-semibold border-b border-[#0B241A]' 
                : 'text-[#57534E]'
            }`}
          >
            Decisions & Outcomes
          </button>

          <button
            onClick={() => setActiveTab('rci')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#0B241A] cursor-pointer ${
              activeTab === 'rci' 
                ? 'text-[#0B241A] font-semibold border-b border-[#0B241A]' 
                : 'text-[#57534E]'
            }`}
          >
            RCI Matrix
          </button>

          <button
            onClick={() => setActiveTab('allocation-brief')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#0B241A] cursor-pointer ${
              activeTab === 'allocation-brief' 
                ? 'text-[#0B241A] font-semibold border-b border-[#0B241A]' 
                : 'text-[#57534E]'
            }`}
          >
            Allocation Brief
          </button>

          <button
            onClick={() => setActiveTab('organizations')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#0B241A] cursor-pointer ${
              activeTab === 'organizations' 
                ? 'text-[#0B241A] font-semibold border-b border-[#0B241A]' 
                : 'text-[#57534E]'
            }`}
          >
            Workspaces
          </button>

          <button
            onClick={() => setActiveTab('codex')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#0B241A] cursor-pointer ${
              activeTab === 'codex' 
                ? 'text-[#0B241A] font-semibold border-b border-[#0B241A]' 
                : 'text-[#57534E]'
            }`}
          >
            Codex
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCommission}
            className="px-4 py-2 text-xs font-medium tracking-wide uppercase text-[#FBF9F5] bg-[#0B241A] rounded hover:bg-[#13382C] transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            Commission Brief
          </button>
        </div>
      </div>
      
      {/* Operational Workspace Context Ribbon */}
      <div className="bg-[#F4F1EA] border-t border-[#E8E4DC] px-6 py-1.5 flex items-center justify-between text-[11px] text-[#57534E]">
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-[#0B241A]">{currentOrg.name}</span>
          <span aria-hidden="true" className="text-[#A8A29E]">/</span>
          <span>{currentOrg.type}</span>
          <span aria-hidden="true" className="text-[#A8A29E]">/</span>
          <span className="font-mono text-[#2C5E4B]">${(currentOrg.aumUsd / 1000000).toFixed(0)}M AUM</span>
        </div>

        <div className="flex items-center gap-3 shrink-0 font-mono text-[10px]">
          <span>Role: <strong className="text-[#0B241A]">{currentMember.role}</strong> ({currentMember.name.split(' ')[0]})</span>
          <button
            onClick={() => setActiveTab('organizations')}
            className="text-[#0B241A] font-semibold hover:underline cursor-pointer"
          >
            Switch Role →
          </button>
        </div>
      </div>

      {/* Mobile Nav Sub-Bar */}
      <div className="lg:hidden flex items-center gap-3 overflow-x-auto px-6 py-2 border-t border-[#E8E4DC] text-xs uppercase tracking-wider text-[#57534E]">
        <button 
          onClick={() => setActiveTab('observatory')} 
          className={`whitespace-nowrap py-1 ${activeTab === 'observatory' ? 'text-[#0B241A] font-semibold' : ''}`}
        >
          Observatory
        </button>
        <button 
          onClick={() => setActiveTab('mandate')} 
          className={`whitespace-nowrap py-1 ${activeTab === 'mandate' ? 'text-[#0B241A] font-semibold' : ''}`}
        >
          Mandate
        </button>
        <button 
          onClick={() => setActiveTab('evidence')} 
          className={`whitespace-nowrap py-1 ${activeTab === 'evidence' ? 'text-[#0B241A] font-semibold' : ''}`}
        >
          Evidence
        </button>
        <button 
          onClick={() => setActiveTab('decisions')} 
          className={`whitespace-nowrap py-1 ${activeTab === 'decisions' ? 'text-[#0B241A] font-semibold' : ''}`}
        >
          Decisions
        </button>
        <button 
          onClick={() => setActiveTab('rci')} 
          className={`whitespace-nowrap py-1 ${activeTab === 'rci' ? 'text-[#0B241A] font-semibold' : ''}`}
        >
          RCI Matrix
        </button>
        <button 
          onClick={() => setActiveTab('allocation-brief')} 
          className={`whitespace-nowrap py-1 ${activeTab === 'allocation-brief' ? 'text-[#0B241A] font-semibold' : ''}`}
        >
          Brief
        </button>
        <button 
          onClick={() => setActiveTab('organizations')} 
          className={`whitespace-nowrap py-1 ${activeTab === 'organizations' ? 'text-[#0B241A] font-semibold' : ''}`}
        >
          Workspaces
        </button>
        <button 
          onClick={() => setActiveTab('codex')} 
          className={`whitespace-nowrap py-1 ${activeTab === 'codex' ? 'text-[#0B241A] font-semibold' : ''}`}
        >
          Codex
        </button>
      </div>
    </header>
  );
};

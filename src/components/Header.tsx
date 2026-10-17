import React from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCommission: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenCommission }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button 
          onClick={() => setActiveTab('observatory')} 
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-xl font-serif font-semibold tracking-tight text-[#0B241A] block whitespace-nowrap shrink-0 group-hover:text-[#2C5E4B] transition-colors">
            Atlas Sanctum
          </span>
        </button>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-wide uppercase">
          <button
            onClick={() => setActiveTab('observatory')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#0B241A] cursor-pointer ${
              activeTab === 'observatory' 
                ? 'text-[#0B241A] font-semibold border-b border-[#0B241A]' 
                : 'text-[#57534E]'
            }`}
          >
            The Observatory
          </button>
          
          <button
            onClick={() => setActiveTab('mandate')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#0B241A] cursor-pointer ${
              activeTab === 'mandate' 
                ? 'text-[#0B241A] font-semibold border-b border-[#0B241A]' 
                : 'text-[#57534E]'
            }`}
          >
            Legacy Mandate
          </button>

          <button
            onClick={() => setActiveTab('rci')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#0B241A] cursor-pointer ${
              activeTab === 'rci' 
                ? 'text-[#0B241A] font-semibold border-b border-[#0B241A]' 
                : 'text-[#57534E]'
            }`}
          >
            Regenerative Capacity
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
            onClick={() => setActiveTab('codex')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#0B241A] cursor-pointer ${
              activeTab === 'codex' 
                ? 'text-[#0B241A] font-semibold border-b border-[#0B241A]' 
                : 'text-[#57534E]'
            }`}
          >
            Civilizational Codex
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
          onClick={() => setActiveTab('codex')} 
          className={`whitespace-nowrap py-1 ${activeTab === 'codex' ? 'text-[#0B241A] font-semibold' : ''}`}
        >
          12 Deliverables
        </button>
      </div>
    </header>
  );
};

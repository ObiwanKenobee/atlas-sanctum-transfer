import React from 'react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="border-t border-[#E8E4DC] bg-[#F4F1EA] text-[#57534E] text-xs">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        
        {/* 5 Governing Values Strip */}
        <div className="space-y-3 pb-8 border-b border-[#E8E4DC]">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[#0B241A]">
            The Five Atlas Sanctum Governing Values
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            <div>
              <strong className="text-[#0B241A] block">01. Human Flourishing</strong>
              <span className="text-[#78716C] text-[11px]">Dignity, agency, knowledge, and durable livelihoods.</span>
            </div>
            <div>
              <strong className="text-[#0B241A] block">02. Ecological Regeneration</strong>
              <span className="text-[#78716C] text-[11px]">Living soil, restored watersheds, and biodiversity.</span>
            </div>
            <div>
              <strong className="text-[#0B241A] block">03. Just Institutions</strong>
              <span className="text-[#78716C] text-[11px]">Transparent governance and equitable participation.</span>
            </div>
            <div>
              <strong className="text-[#0B241A] block">04. Resilient Economies</strong>
              <span className="text-[#78716C] text-[11px]">Productive enterprise and responsible capital formation.</span>
            </div>
            <div>
              <strong className="text-[#0B241A] block">05. Wisdom-Guided Tech</strong>
              <span className="text-[#78716C] text-[11px]">Useful intelligence, explainable decisions, and human accountability.</span>
            </div>
          </div>
        </div>

        {/* Links & Disclaimer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-2">
            <span className="text-base font-serif font-semibold text-[#0B241A]">Atlas Sanctum</span>
            <p className="text-xs text-[#78716C] leading-relaxed max-w-sm">
              Decision intelligence infrastructure for high-stakes, long-horizon decisions affecting economies, ecosystems, institutions, and human lives.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2">
            <span className="font-semibold text-[#0B241A] uppercase tracking-wider text-[11px] block">
              Observatory Modules
            </span>
            <div className="flex flex-col space-y-1.5 text-xs">
              <button 
                onClick={() => onSelectTab('observatory')} 
                className="text-left text-[#57534E] hover:text-[#0B241A] transition-colors cursor-pointer"
              >
                East Africa Opportunity Observatory
              </button>
              <button 
                onClick={() => onSelectTab('mandate')} 
                className="text-left text-[#57534E] hover:text-[#0B241A] transition-colors cursor-pointer"
              >
                The Legacy Mandate Builder
              </button>
              <button 
                onClick={() => onSelectTab('rci')} 
                className="text-left text-[#57534E] hover:text-[#0B241A] transition-colors cursor-pointer"
              >
                Regenerative Capacity Index (RCI) Matrix
              </button>
              <button 
                onClick={() => onSelectTab('codex')} 
                className="text-left text-[#57534E] hover:text-[#0B241A] transition-colors cursor-pointer"
              >
                The 12 Civilizational Deliverables & Manifesto
              </button>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2 text-[11px] text-[#78716C]">
            <span className="font-semibold text-[#0B241A] uppercase tracking-wider text-[11px] block">
              Legal & Fiduciary Boundary
            </span>
            <p className="leading-relaxed">
              Atlas Sanctum provides independent empirical research, verification telemetry, and decision-intelligence software. We do not provide regulated investment advice, fund management, or brokerage services.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#78716C]">
          <div>
            © {new Date().getFullYear()} Atlas Sanctum. All rights reserved.
          </div>
          <div>
            Nairobi · London · Geneva · The Great Rift Valley Intelligence Station
          </div>
        </div>

      </div>
    </footer>
  );
};

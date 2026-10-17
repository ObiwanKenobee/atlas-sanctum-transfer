import React from 'react';

interface HeroSectionProps {
  onExploreObservatory: () => void;
  onOpenMandate: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreObservatory, onOpenMandate }) => {
  return (
    <section className="relative border-b border-[#E8E4DC] bg-[#FBF9F5] overflow-hidden">
      {/* 2-Column Institutional Split */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Editorial Narrative */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#2C5E4B] mb-4">
              <span>Decision Intelligence Infrastructure</span>
              <span aria-hidden="true">·</span>
              <span>The Great Wealth Transfer</span>
              <span aria-hidden="true">·</span>
              <span>East Africa Proving Ground</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#0B241A] tracking-tight leading-[1.15] max-w-2xl mb-6">
              Architecting the Infrastructure of Generational Stewardship.
            </h1>

            <p className="text-base sm:text-lg text-[#44403C] leading-relaxed max-w-xl mb-8">
              Atlas Sanctum connects long-horizon family capital, diaspora networks, and next-generation stewards with verified regenerative enterprises across Africa—governed by transparent evidence, ethical accountability, and measurable human flourishing.
            </p>

            <div className="p-5 bg-[#F4F1EA] border border-[#E8E4DC] rounded-lg mb-8 max-w-xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#0B241A] mb-1">
                The Atlas Sanctum Covenant
              </div>
              <p className="text-xs sm:text-sm text-[#57534E] leading-normal italic">
                “Stewardship rather than extraction without responsibility; service rather than domination; truth rather than performance; and enduring capability transmitted to future generations.”
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreObservatory}
              className="px-5 py-2.5 bg-[#0B241A] text-[#FBF9F5] text-xs font-medium uppercase tracking-wider rounded hover:bg-[#13382C] transition-colors cursor-pointer"
            >
              Explore Observatory
            </button>
            <button
              onClick={onOpenMandate}
              className="px-5 py-2.5 bg-transparent border border-[#0B241A] text-[#0B241A] text-xs font-medium uppercase tracking-wider rounded hover:bg-[#0B241A]/5 transition-colors cursor-pointer"
            >
              Define Family Mandate
            </button>
          </div>
        </div>

        {/* Right Architectural Focal Image */}
        <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-[460px] rounded-lg overflow-hidden border border-[#E8E4DC] shadow-sm bg-[#EBE6DF]">
          <img
            src="/src/assets/images/hero_atlas_observatory_1792231068416.jpg"
            alt="Atlas Sanctum Intelligence Observatory overlooking the Great Rift Valley landscape at dawn"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B241A]/80 via-transparent to-transparent flex flex-col justify-end p-6">
            <div className="text-xs uppercase tracking-widest text-[#FBF9F5]/70 font-mono">
              Great Rift Valley Intelligence Station
            </div>
            <div className="text-sm font-serif text-[#FBF9F5] font-medium">
              Ground-truthing high-stakes decisions across East African ecosystems
            </div>
          </div>
        </div>

      </div>

      {/* 4-Column Full-Width Institutional Utility Strip */}
      <div className="border-t border-[#E8E4DC] bg-[#F4F1EA]/80">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-[#57534E]">
          <div className="space-y-1">
            <div className="font-semibold text-[#0B241A] uppercase tracking-wider">Independent Research</div>
            <div className="text-xs text-[#78716C]">Zero placement broker fees, zero token carry, zero conflict of interest.</div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-[#0B241A] uppercase tracking-wider">4-Pillar RCI Audit</div>
            <div className="text-xs text-[#78716C]">Ecological, governance, financial durability, and ground additionality.</div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-[#0B241A] uppercase tracking-wider">East Africa Focus</div>
            <div className="text-xs text-[#78716C]">Rigorous initial proving ground across Kenya, Rwanda, Uganda, and Tanzania.</div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-[#0B241A] uppercase tracking-wider">Outcome Traceability</div>
            <div className="text-xs text-[#78716C]">Direct linkage from capital mandate to sensor telemetry and community consent.</div>
          </div>
        </div>
      </div>
    </section>
  );
};

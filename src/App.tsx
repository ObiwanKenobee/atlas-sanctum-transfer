import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { Observatory } from './components/Observatory';
import { LegacyMandateBuilder } from './components/LegacyMandateBuilder';
import { RciMatrix } from './components/RciMatrix';
import { ScenarioModeler } from './components/ScenarioModeler';
import { AllocationBriefViewer } from './components/AllocationBriefViewer';
import { CivilizationalCodex } from './components/CivilizationalCodex';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { CommissionBriefModal } from './components/CommissionBriefModal';
import { Footer } from './components/Footer';

import { INITIAL_OPPORTUNITIES, INITIAL_MANDATE, ALLOCATION_SCENARIOS } from './data/opportunities';
import { Opportunity, LegacyMandate, AllocationScenario } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('observatory');
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [mandate, setMandate] = useState<LegacyMandate>(INITIAL_MANDATE);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(['opp-01', 'opp-02', 'opp-03']);
  const [activeScenario, setActiveScenario] = useState<AllocationScenario>(ALLOCATION_SCENARIOS[1]);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState<boolean>(false);

  const handleToggleShortlist = (opportunity: Opportunity) => {
    if (opportunity.status === 'Excluded') return;
    setShortlistedIds((prev) => 
      prev.includes(opportunity.id) 
        ? prev.filter(id => id !== opportunity.id)
        : [...prev, opportunity.id]
    );
  };

  const shortlistedOpportunities = opportunities.filter(o => shortlistedIds.includes(o.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      {/* 3-Zone Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCommission={() => setIsCommissionModalOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {activeTab === 'observatory' && (
          <div>
            <HeroSection
              onExploreObservatory={() => {
                const el = document.getElementById('observatory-main');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenMandate={() => setActiveTab('mandate')}
            />
            <div id="observatory-main" className="max-w-7xl mx-auto px-6 py-12">
              <Observatory
                opportunities={opportunities}
                onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
                shortlistedIds={shortlistedIds}
                onToggleShortlist={handleToggleShortlist}
              />
            </div>
          </div>
        )}

        {activeTab === 'mandate' && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <LegacyMandateBuilder
              mandate={mandate}
              onUpdateMandate={(updated) => setMandate(updated)}
              opportunities={opportunities}
              onOpenBrief={() => setActiveTab('allocation-brief')}
            />
          </div>
        )}

        {activeTab === 'rci' && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <RciMatrix
              opportunities={opportunities}
              onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            />
          </div>
        )}

        {activeTab === 'allocation-brief' && (
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
            <AllocationBriefViewer
              mandate={mandate}
              shortlistedOpportunities={shortlistedOpportunities}
              activeScenario={activeScenario}
              onInspectOpportunity={(opp) => setSelectedOpportunity(opp)}
              onOpenCommissionModal={() => setIsCommissionModalOpen(true)}
            />

            <div className="pt-8 border-t border-[#E8E4DC]">
              <ScenarioModeler
                mandate={mandate}
                onSelectScenarioForBrief={(scenario) => {
                  setActiveScenario(scenario);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'codex' && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <CivilizationalCodex />
          </div>
        )}
      </main>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        onAddToBrief={handleToggleShortlist}
        isShortlisted={selectedOpportunity ? shortlistedIds.includes(selectedOpportunity.id) : false}
      />

      {/* Commission Brief Modal */}
      <CommissionBriefModal
        isOpen={isCommissionModalOpen}
        onClose={() => setIsCommissionModalOpen(false)}
        defaultFamilyName={mandate.familyName}
      />

      {/* Footer */}
      <Footer onSelectTab={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}

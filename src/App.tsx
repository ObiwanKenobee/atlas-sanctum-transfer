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
import { EvidenceLibraryView } from './components/EvidenceLibraryView';
import { DecisionsAndOutcomesView } from './components/DecisionsAndOutcomesView';
import { OrganizationsView } from './components/OrganizationsView';
import { AuditTrailView } from './components/AuditTrailView';
import { Footer } from './components/Footer';

import { INITIAL_OPPORTUNITIES, INITIAL_MANDATE, ALLOCATION_SCENARIOS } from './data/opportunities';
import { 
  INITIAL_ORGANIZATIONS, 
  INITIAL_TEAM_MEMBERS, 
  INITIAL_EVIDENCE_DOCUMENTS, 
  INITIAL_DECISION_RECORDS, 
  INITIAL_MILESTONES, 
  INITIAL_OUTCOME_INDICATORS, 
  INITIAL_AUDIT_TRAIL, 
  INITIAL_AI_SYNTHESES 
} from './data/mvpData';

import { 
  Opportunity, 
  LegacyMandate, 
  AllocationScenario, 
  Organization, 
  TeamMember, 
  EvidenceDocument, 
  DecisionRecord, 
  Milestone, 
  OutcomeIndicator, 
  AuditEvent,
  AiDraftSynthesis,
  RegenerativeAnnotation
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('observatory');
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [mandate, setMandate] = useState<LegacyMandate>(INITIAL_MANDATE);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(['opp-01', 'opp-02', 'opp-03']);
  const [activeScenario, setActiveScenario] = useState<AllocationScenario>(ALLOCATION_SCENARIOS[1]);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState<boolean>(false);

  // MVP Capabilities State
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [currentOrg, setCurrentOrg] = useState<Organization>(INITIAL_ORGANIZATIONS[0]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [currentMember, setCurrentMember] = useState<TeamMember>(INITIAL_TEAM_MEMBERS[0]);

  const [evidenceDocuments, setEvidenceDocuments] = useState<EvidenceDocument[]>(INITIAL_EVIDENCE_DOCUMENTS);
  const [decisions, setDecisions] = useState<DecisionRecord[]>(INITIAL_DECISION_RECORDS);
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [indicators, setIndicators] = useState<OutcomeIndicator[]>(INITIAL_OUTCOME_INDICATORS);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>(INITIAL_AUDIT_TRAIL);
  const [aiSyntheses, setAiSyntheses] = useState<AiDraftSynthesis[]>(INITIAL_AI_SYNTHESES);

  // Helper to record an audit event
  const logAuditEvent = (action: string, entityType: AuditEvent['entityType'], entityId: string, details: string) => {
    const newEvent: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      actor: currentMember.name,
      actorRole: currentMember.role,
      action,
      entityType,
      entityId,
      details
    };
    setAuditTrail(prev => [newEvent, ...prev]);
  };

  const handleToggleShortlist = (opportunity: Opportunity) => {
    if (opportunity.status === 'Excluded') return;
    setShortlistedIds((prev) => {
      const isRemoving = prev.includes(opportunity.id);
      const next = isRemoving ? prev.filter(id => id !== opportunity.id) : [...prev, opportunity.id];
      logAuditEvent(
        isRemoving ? 'SHORTLIST_REMOVED' : 'SHORTLIST_ADDED',
        'Assessment',
        opportunity.id,
        `${isRemoving ? 'Removed' : 'Added'} ${opportunity.name} to family brief shortlist.`
      );
      return next;
    });
  };

  const handleUpdateMandate = (updated: LegacyMandate) => {
    setMandate(updated);
    logAuditEvent('MANDATE_AMENDED', 'Mandate', currentOrg.activeMandateId, `Updated capital parameters: $${(updated.capitalPoolUsd/1000000).toFixed(0)}M USD pool, ${updated.timeHorizonYears}-yr horizon.`);
  };

  const handleAddAnnotation = (opportunityId: string, annotationData: Omit<RegenerativeAnnotation, 'id' | 'timestamp'>) => {
    const newAnnotation: RegenerativeAnnotation = {
      ...annotationData,
      id: `ann-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 10)
    };

    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === opportunityId) {
          const updatedAnnotations = [...(opp.annotations || []), newAnnotation];
          return { ...opp, annotations: updatedAnnotations };
        }
        return opp;
      })
    );

    setSelectedOpportunity((prev) => {
      if (prev && prev.id === opportunityId) {
        return {
          ...prev,
          annotations: [...(prev.annotations || []), newAnnotation]
        };
      }
      return prev;
    });

    logAuditEvent(
      'ANNOTATION_ATTACHED',
      'Opportunity',
      opportunityId,
      `Attached qualitative regenerative annotation [${annotationData.category}] by ${annotationData.authorName}.`
    );
  };

  const handleAddEvidenceDocument = (doc: EvidenceDocument) => {
    setEvidenceDocuments(prev => [doc, ...prev]);
    logAuditEvent('EVIDENCE_INGESTED', 'Evidence', doc.id, `Ingested ${doc.title} (${doc.category}) by ${doc.authorOrOrg}.`);
  };

  const handleApproveAiSynthesis = (synthesisId: string, reviewerName: string) => {
    setAiSyntheses(prev => prev.map(syn => syn.id === synthesisId ? { ...syn, humanReviewed: true, reviewedBy: reviewerName } : syn));
    logAuditEvent('AI_SYNTHESIS_CERTIFIED', 'Evidence', synthesisId, `Human analyst ${reviewerName} verified and signed off on AI synthesis.`);
  };

  const handleAddDecision = (decision: DecisionRecord) => {
    setDecisions(prev => [decision, ...prev]);
    logAuditEvent('DECISION_RECORDED', 'Decision', decision.id, `Formally logged ${decision.type} for ${decision.opportunityName}.`);
  };

  const handleUpdateMilestone = (milestoneId: string, progress: number, status: Milestone['status']) => {
    setMilestones(prev => prev.map(ms => ms.id === milestoneId ? { ...ms, progressPercent: progress, status } : ms));
    logAuditEvent('MILESTONE_UPDATED', 'Milestone', milestoneId, `Milestone advanced to ${progress}% (${status}).`);
  };

  const handleAddTeamMember = (member: TeamMember) => {
    setTeamMembers(prev => [...prev, member]);
    logAuditEvent('MEMBER_ENROLLED', 'Organization', member.id, `Enrolled ${member.name} as ${member.role} in ${currentOrg.name}.`);
  };

  const handleSelectOrganization = (org: Organization) => {
    setCurrentOrg(org);
    logAuditEvent('WORKSPACE_SWITCHED', 'Organization', org.id, `User session switched workspace to ${org.name}.`);
  };

  const shortlistedOpportunities = opportunities.filter(o => shortlistedIds.includes(o.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      {/* 3-Zone Header with Active Workspace Context */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCommission={() => setIsCommissionModalOpen(true)}
        currentOrg={currentOrg}
        currentMember={currentMember}
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
                onAddAnnotation={handleAddAnnotation}
              />
            </div>
          </div>
        )}

        {activeTab === 'mandate' && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <LegacyMandateBuilder
              mandate={mandate}
              onUpdateMandate={handleUpdateMandate}
              opportunities={opportunities}
              onOpenBrief={() => setActiveTab('allocation-brief')}
            />
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <EvidenceLibraryView
              documents={evidenceDocuments}
              opportunities={opportunities}
              aiSyntheses={aiSyntheses}
              onAddDocument={handleAddEvidenceDocument}
              onApproveAiSynthesis={handleApproveAiSynthesis}
              currentUserName={currentMember.name}
            />
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <DecisionsAndOutcomesView
              decisions={decisions}
              milestones={milestones}
              indicators={indicators}
              opportunities={opportunities}
              teamMembers={teamMembers}
              onAddDecision={handleAddDecision}
              onUpdateMilestone={handleUpdateMilestone}
              currentMember={currentMember}
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
              allOpportunities={opportunities}
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

        {activeTab === 'organizations' && (
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
            <OrganizationsView
              organizations={organizations}
              currentOrg={currentOrg}
              onSelectOrg={handleSelectOrganization}
              teamMembers={teamMembers}
              currentMember={currentMember}
              onSelectMember={(m) => setCurrentMember(m)}
              onAddMember={handleAddTeamMember}
            />

            <div className="pt-8 border-t border-[#E8E4DC]">
              <AuditTrailView auditTrail={auditTrail} />
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
        onAddAnnotation={handleAddAnnotation}
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

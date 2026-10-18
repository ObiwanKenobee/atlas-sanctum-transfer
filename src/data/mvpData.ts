import { 
  Organization, 
  TeamMember, 
  EvidenceDocument, 
  DecisionRecord, 
  Milestone, 
  OutcomeIndicator, 
  AuditEvent,
  AiDraftSynthesis
} from '../types';

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-01',
    name: 'Ochieng Family Council',
    type: 'Single Family Office',
    headquarters: 'Nairobi, Kenya',
    establishedYear: 1988,
    aumUsd: 45000000,
    activeMandateId: 'mandate-01'
  },
  {
    id: 'org-02',
    name: 'Kenyatta Stewardship Trust',
    type: 'Multi-Generational Stewardship Council',
    headquarters: 'Karen, Nairobi, Kenya',
    establishedYear: 1974,
    aumUsd: 85000000,
    activeMandateId: 'mandate-02'
  },
  {
    id: 'org-03',
    name: 'East Africa Diaspora Capital Syndicate',
    type: 'Diaspora Capital Syndicate',
    headquarters: 'London, UK & Nairobi, Kenya',
    establishedYear: 2021,
    aumUsd: 18000000,
    activeMandateId: 'mandate-03'
  },
  {
    id: 'org-04',
    name: 'Great Rift Conservation & Watershed Endowment',
    type: 'Conservation Endowment',
    headquarters: 'Naivasha, Kenya',
    establishedYear: 2015,
    aumUsd: 32000000,
    activeMandateId: 'mandate-04'
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'user-01',
    name: 'Dr. Amina Ochieng',
    email: 'amina@ochieng.family',
    role: 'Principal Steward',
    organizationId: 'org-01',
    joinedDate: '2023-01-15',
    status: 'Active'
  },
  {
    id: 'user-02',
    name: 'David Muthomi, FCA',
    email: 'dmuthomi@fiduciary.co.ke',
    role: 'Fiduciary Trustee',
    organizationId: 'org-01',
    joinedDate: '2023-03-20',
    status: 'Active'
  },
  {
    id: 'user-03',
    name: 'Kiptoo Chebet',
    email: 'kiptoo@ochieng.family',
    role: 'Investment Committee Lead',
    organizationId: 'org-01',
    joinedDate: '2023-06-10',
    status: 'Active'
  },
  {
    id: 'user-04',
    name: 'Zahara Ochieng',
    email: 'zahara@ochieng.family',
    role: 'Next-Gen Fellow',
    organizationId: 'org-01',
    joinedDate: '2024-02-01',
    status: 'Active'
  },
  {
    id: 'user-05',
    name: 'Eng. Samuel Otieno',
    email: 's.otieno@audit-africa.org',
    role: 'Field Auditor',
    organizationId: 'org-01',
    joinedDate: '2024-04-18',
    status: 'Active'
  }
];

export const INITIAL_EVIDENCE_DOCUMENTS: EvidenceDocument[] = [
  {
    id: 'doc-01',
    opportunityId: 'opp-01',
    title: 'Soil Organic Carbon (SOC) Core Testing & Infiltration Profile',
    category: 'Soil Telemetry',
    authorOrOrg: 'KALRO & SoilCares East Africa',
    date: '2025-09-14',
    verificationTier: 'Third-Party Certified',
    hash: 'sha256-8f4b23e9a1c875d4e12089b3f465c17983ea19024f0c40e53a7138b1d98e721a',
    summary: '48 sampled farm clusters demonstrated +1.84% mean SOC increase over 24 months. Bulk density reduced from 1.34 to 1.18 g/cm³.',
    status: 'Approved'
  },
  {
    id: 'doc-02',
    opportunityId: 'opp-01',
    title: 'Audited Financial Statements & Tax Clearance (FY2023-2025)',
    category: 'Financial Audit',
    authorOrOrg: 'PKF Eastern Africa',
    date: '2025-06-30',
    verificationTier: 'Third-Party Certified',
    hash: 'sha256-1192e43ba67c9d0092f15e8b45c22881a7b0312014bdf8820c746e49221147a2',
    summary: 'Unqualified audit opinion. Operating break-even reached in Year 2. Debt Service Coverage Ratio (DSCR) 1.82x with zero defaults.',
    status: 'Approved'
  },
  {
    id: 'doc-03',
    opportunityId: 'opp-01',
    title: 'Kirinyaga Organic Farmers Union FPIC Resolution & Charter',
    category: 'Community FPIC Consent',
    authorOrOrg: 'Kirinyaga County Cooperative Registrar & Elders Council',
    date: '2024-11-12',
    verificationTier: 'Field Inspector Signed',
    hash: 'sha256-43bba12009214fe7a3512b9d0012e841209b5523a1cde89921b34c0098f413a1',
    summary: 'Documented 94% affirmative voting record across 8 village general meetings confirming 40% equity stake in centralized processing.',
    status: 'Approved'
  },
  {
    id: 'doc-04',
    opportunityId: 'opp-02',
    title: 'Lake Victoria Water Quality & Hydro-Acoustic Biomass Audit',
    category: 'Hydrological Sensor',
    authorOrOrg: 'Kenya Marine and Fisheries Research Institute (KMFRI)',
    date: '2025-01-20',
    verificationTier: 'Third-Party Certified',
    hash: 'sha256-7889bc019a234f9810b45d123490ef45b23a18902c34d890a21345678912bc01',
    summary: 'Recorded dissolved oxygen (>6.2 mg/L) and phosphate levels within compliant oligotrophic parameters across deepwater pen coordinates.',
    status: 'Approved'
  },
  {
    id: 'doc-05',
    opportunityId: 'opp-03',
    title: 'EPRA Commercial Mini-Grid Distribution License & PPA Concession',
    category: 'Legal Title',
    authorOrOrg: 'Energy and Petroleum Regulatory Authority (EPRA)',
    date: '2024-10-04',
    verificationTier: 'Third-Party Certified',
    hash: 'sha256-3245f8910a2345bc67890def1234567890abcdef1234567890abcdef12345678',
    summary: 'Approved retail productive agricultural tariff of KES 18.5/kWh with 15-year exclusive micro-utility distribution rights.',
    status: 'Approved'
  },
  {
    id: 'doc-06',
    opportunityId: 'opp-05',
    title: 'Customary Pastoral Grazing Rights Investigative Audit (REJECTION EVIDENCE)',
    category: 'Community FPIC Consent',
    authorOrOrg: 'Atlas Sanctum Independent Research & Legal Council',
    date: '2025-08-15',
    verificationTier: 'Field Inspector Signed',
    hash: 'sha256-aa11bb22cc33dd44ee55ff6677889900112233445566778899aabbccddeeff00',
    summary: 'Severe lack of FPIC consent. Proposed rangeland fencing violates traditional Maasai dry-season grazing corridors. Negative additionality confirmed.',
    status: 'Approved'
  }
];

export const INITIAL_DECISION_RECORDS: DecisionRecord[] = [
  {
    id: 'dec-01',
    opportunityId: 'opp-01',
    opportunityName: 'Kilimo Hai Highlands Agroforestry',
    date: '2026-09-18',
    type: 'Conditional Approval with Precedent Gates',
    rationale: 'High alignment with family ecological food sovereignty mandate. Outstanding RCI score (88/100). Conditioned on establishing local bank FX forward hedging facility before Tranche 1 disbursement.',
    recordedBy: 'Dr. Amina Ochieng',
    votes: [
      { role: 'Principal Steward', memberName: 'Dr. Amina Ochieng', vote: 'Approve', comment: 'Demonstrates authentic smallholder agency and soil regeneration.' },
      { role: 'Fiduciary Trustee', memberName: 'David Muthomi, FCA', vote: 'Approve', comment: 'Balance sheet and DSCR 1.82x satisfy risk thresholds. FX hedging condition mandatory.' },
      { role: 'Investment Committee Lead', memberName: 'Kiptoo Chebet', vote: 'Approve', comment: 'Revenue share model provides non-correlated inflation protection.' },
      { role: 'Next-Gen Fellow', memberName: 'Zahara Ochieng', vote: 'Approve', comment: 'Youth agroforestry training center inclusion confirms intergenerational values.' }
    ],
    conditionsPrecedent: [
      'Execution of Tier-1 Kenyan commercial bank USD/KES currency forward contract.',
      'Deposit of centralized processing hub title deeds into fiduciary escrow.',
      'Physical inspection sign-off on 48 sampled farm clusters by appointed field auditor.'
    ],
    signatureHash: 'sig-ecdsa-9912ba0093fe21ab887201cd994e1123f890ba12',
    status: 'Final'
  },
  {
    id: 'dec-02',
    opportunityId: 'opp-05',
    opportunityName: 'Savannah Carbon Tokenization Ltd',
    date: '2026-08-22',
    type: 'Rejected / Integrity Exclusion',
    rationale: 'Failed Atlas Sanctum Covenant integrity gate. Extractive token dilution, ungrounded rangeland carbon claims, absence of Free, Prior, and Informed Consent (FPIC), and direct harm to pastoral mobility.',
    recordedBy: 'David Muthomi, FCA',
    votes: [
      { role: 'Principal Steward', memberName: 'Dr. Amina Ochieng', vote: 'Reject', comment: 'Cannot countenance schemes that displace pastoralist communities.' },
      { role: 'Fiduciary Trustee', memberName: 'David Muthomi, FCA', vote: 'Reject', comment: 'Unacceptable legal and regulatory liability under Kenya Carbon Markets Act 2024.' },
      { role: 'Investment Committee Lead', memberName: 'Kiptoo Chebet', vote: 'Reject', comment: 'Financial model depends on secondary token speculation, not real economic value.' },
      { role: 'Next-Gen Fellow', memberName: 'Zahara Ochieng', vote: 'Reject', comment: 'Completely contrary to genuine regenerative stewardship.' }
    ],
    conditionsPrecedent: [],
    signatureHash: 'sig-ecdsa-4411ee880022ff771133aa558822cc994411bb22',
    status: 'Final'
  }
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'ms-01',
    opportunityId: 'opp-01',
    title: 'Phase I Soil Baseline Core Ingestion & Bio-Inoculant Pilot',
    targetQuarter: 'Q1 2026',
    status: 'Completed & Verified',
    verifiedBy: 'Eng. Samuel Otieno (Field Auditor)',
    evidenceDocId: 'doc-01',
    progressPercent: 100
  },
  {
    id: 'ms-02',
    opportunityId: 'opp-01',
    title: 'Commissioning of 2nd Solar-Powered Cold Storage & Pulper Hub',
    targetQuarter: 'Q3 2026',
    status: 'In Progress',
    progressPercent: 65
  },
  {
    id: 'ms-03',
    opportunityId: 'opp-01',
    title: 'Fair-Trade Direct European Roaster Offtake Delivery (450 MT)',
    targetQuarter: 'Q4 2026',
    status: 'Pending Tranche',
    progressPercent: 20
  },
  {
    id: 'ms-04',
    opportunityId: 'opp-02',
    title: 'Deployment of 12 Circular Deep-Water HDPE Cages in Homa Bay',
    targetQuarter: 'Q2 2026',
    status: 'Completed & Verified',
    verifiedBy: 'KMFRI Senior Marine Biologist',
    evidenceDocId: 'doc-04',
    progressPercent: 100
  },
  {
    id: 'ms-05',
    opportunityId: 'opp-02',
    title: 'Beach Management Unit Solar Cold-Locker Installation (6 Sites)',
    targetQuarter: 'Q4 2026',
    status: 'In Progress',
    progressPercent: 50
  },
  {
    id: 'ms-06',
    opportunityId: 'opp-03',
    title: 'Smart Meter Productive Load Testing & Micro-Grid Interconnect',
    targetQuarter: 'Q2 2026',
    status: 'Completed & Verified',
    evidenceDocId: 'doc-05',
    progressPercent: 100
  }
];

export const INITIAL_OUTCOME_INDICATORS: OutcomeIndicator[] = [
  {
    id: 'ind-01',
    opportunityId: 'opp-01',
    metricName: 'Soil Organic Carbon (SOC)',
    unit: '% Carbon by Weight',
    baselineValue: 1.42,
    targetValue: 3.50,
    currentValue: 3.26,
    verificationMethod: 'KALRO Lab Core Sampling (48 GPS Points)',
    lastUpdated: '2026-09-15'
  },
  {
    id: 'ind-02',
    opportunityId: 'opp-01',
    metricName: 'Participating Smallholder Households',
    unit: 'Families',
    baselineValue: 450,
    targetValue: 1800,
    currentValue: 1420,
    verificationMethod: 'Cooperative Registry & M-Pesa Farmgate Disbursements',
    lastUpdated: '2026-08-30'
  },
  {
    id: 'ind-03',
    opportunityId: 'opp-01',
    metricName: 'Land Under Multi-Strata Agroforestry',
    unit: 'Hectares',
    baselineValue: 600,
    targetValue: 2500,
    currentValue: 1850,
    verificationMethod: 'Sentinel-2 Multispectral NDVI Vegetation Index',
    lastUpdated: '2026-09-01'
  },
  {
    id: 'ind-04',
    opportunityId: 'opp-02',
    metricName: 'Post-Harvest Fishery Spoilage Rate',
    unit: '% Catch Lost',
    baselineValue: 38.0,
    targetValue: 5.0,
    currentValue: 6.8,
    verificationMethod: 'Kisumu Beach Landing Digital Weight Logs',
    lastUpdated: '2026-09-10'
  },
  {
    id: 'ind-05',
    opportunityId: 'opp-03',
    metricName: 'Productive Agricultural Power Delivered',
    unit: 'MWh / Month',
    baselineValue: 0.0,
    targetValue: 180.0,
    currentValue: 154.2,
    verificationMethod: 'EPRA Certified Telemetry Stream',
    lastUpdated: '2026-10-01'
  }
];

export const INITIAL_AUDIT_TRAIL: AuditEvent[] = [
  {
    id: 'audit-01',
    timestamp: '2026-10-17 02:45:12 UTC',
    actor: 'Dr. Amina Ochieng',
    actorRole: 'Principal Steward',
    action: 'MANDATE_UPDATED',
    details: 'Formalized 15-year horizon and locked 25% catalytic / 75% commercial allocation split.',
    entityType: 'Mandate',
    entityId: 'mandate-01'
  },
  {
    id: 'audit-02',
    timestamp: '2026-10-16 14:22:04 UTC',
    actor: 'Eng. Samuel Otieno',
    actorRole: 'Field Auditor',
    action: 'EVIDENCE_INGESTED',
    details: 'Verified and ingested KALRO Soil Organic Carbon Core Sample (doc-01) with cryptographic hash.',
    entityType: 'Evidence',
    entityId: 'doc-01'
  },
  {
    id: 'audit-03',
    timestamp: '2026-10-15 11:05:39 UTC',
    actor: 'Kiptoo Chebet',
    actorRole: 'Investment Committee Lead',
    action: 'ASSESSMENT_COMPLETED',
    details: 'Completed 4-Pillar RCI evaluation for Kilimo Hai Highlands Agroforestry (Score: 88/100).',
    entityType: 'Assessment',
    entityId: 'opp-01'
  },
  {
    id: 'audit-04',
    timestamp: '2026-10-14 16:30:00 UTC',
    actor: 'David Muthomi, FCA',
    actorRole: 'Fiduciary Trustee',
    action: 'DECISION_FINALIZED',
    details: 'Executed conditional investment committee approval for opp-01 with mandatory FX hedging gate.',
    entityType: 'Decision',
    entityId: 'dec-01'
  },
  {
    id: 'audit-05',
    timestamp: '2026-10-12 09:12:15 UTC',
    actor: 'Zahara Ochieng',
    actorRole: 'Next-Gen Fellow',
    action: 'MILESTONE_VERIFIED',
    details: 'Reviewed and confirmed completion of Lake Victoria Circular Cage deployment (ms-04).',
    entityType: 'Milestone',
    entityId: 'ms-04'
  }
];

export const INITIAL_AI_SYNTHESES: AiDraftSynthesis[] = [
  {
    id: 'syn-01',
    opportunityId: 'opp-01',
    generatedAt: '2026-10-16 10:15:00 UTC',
    summary: 'Cross-referencing KALRO 2025 soil cores against PKF audited statements confirms that biological topsoil remediation (+1.84% SOC) directly correlates with a 28% export price premium on specialty coffee, yielding a sustainable 1.82x Debt Service Coverage Ratio. Recommended action: Proceed with Tranche 1 conditional upon tier-1 bank FX hedging confirmation.',
    confidenceScore: 92,
    citedSourceIds: ['doc-01', 'doc-02', 'doc-03'],
    humanReviewed: true,
    reviewedBy: 'Kiptoo Chebet (Investment Committee Lead)'
  }
];

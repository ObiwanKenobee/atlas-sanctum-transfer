import React, { useState } from 'react';
import { Organization, TeamMember, UserRole } from '../types';

interface OrganizationsViewProps {
  organizations: Organization[];
  currentOrg: Organization;
  onSelectOrg: (org: Organization) => void;
  teamMembers: TeamMember[];
  currentMember: TeamMember;
  onSelectMember: (member: TeamMember) => void;
  onAddMember: (member: TeamMember) => void;
}

export const OrganizationsView: React.FC<OrganizationsViewProps> = ({
  organizations,
  currentOrg,
  onSelectOrg,
  teamMembers,
  currentMember,
  onSelectMember,
  onAddMember
}) => {
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Next-Gen Fellow' as UserRole
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    const created: TeamMember = {
      id: `user-${Date.now().toString().slice(-4)}`,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      organizationId: currentOrg.id,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    onAddMember(created);
    setShowInviteModal(false);
    setNewMember({ name: '', email: '', role: 'Next-Gen Fellow' });
  };

  const roles: { role: UserRole; description: string; permissions: string[] }[] = [
    {
      role: 'Principal Steward',
      description: 'Family founder or designated head of family assembly. Possesses ultimate veto and mandate approval authority.',
      permissions: ['Lock/Amend Mandate', 'Authorize Tranche Disbursements', 'Approve Final Decisions', 'Commission Briefs']
    },
    {
      role: 'Fiduciary Trustee',
      description: 'Licensed legal counsel, chartered accountant, or institutional trust company ensuring statutory and regulatory compliance.',
      permissions: ['Execute Regulatory Review', 'Audit Financial Statements', 'Verify Escrow & Titles', 'Enforce Precedent Gates']
    },
    {
      role: 'Investment Committee Lead',
      description: 'Senior capital allocator managing due diligence, financial underwriting, and direct negotiations with enterprise founders.',
      permissions: ['Conduct RCI Assessments', 'Formulate Allocation Scenarios', 'Draft Decision Records', 'Structure Instruments']
    },
    {
      role: 'Next-Gen Fellow',
      description: 'Second- or third-generation family member serving on advisory committees, conducting site visits, and championing values.',
      permissions: ['Participate in Consensus Votes', 'Review AI Syntheses', 'Lead Youth Initiatives', 'Submit Diligence Queries']
    },
    {
      role: 'Field Auditor',
      description: 'Independent agronomic, hydrological, or technical inspector responsible for primary telemetry ground-truthing.',
      permissions: ['Ingest Sensor Data', 'Sign Verification Certificates', 'Raise Gap Alerts', 'Audit Soil/Water Baselines']
    }
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#2C5E4B] mb-2">
            MVP Capability 01 · Organization & Membership
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#0B241A]">
            Workspaces & Role-Based Access Control (RBAC)
          </h2>
          <p className="text-sm text-[#57534E] max-w-2xl mt-1">
            Isolate organizations, define intergenerational family governance rights, and assign granular permissions across founders, trustees, committee leads, and independent field auditors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-[#0B241A] text-white rounded hover:bg-[#13382C] transition-colors cursor-pointer"
          >
            + Invite Council Member
          </button>
        </div>
      </div>

      {/* Current Active Workspace & Role Selector Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Organization Card */}
        <div className="lg:col-span-6 p-6 bg-white border border-[#E8E4DC] rounded-xl shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#2C5E4B] font-semibold">
                Active Organization Workspace
              </span>
              <span className="text-xs font-mono bg-[#E8F3EE] text-[#13382C] px-2.5 py-0.5 rounded font-bold">
                ${(currentOrg.aumUsd / 1000000).toFixed(0)}M AUM
              </span>
            </div>

            <h3 className="text-2xl font-serif font-semibold text-[#0B241A]">
              {currentOrg.name}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs text-[#57534E] pt-2 border-t border-[#F4F1EA]">
              <div>
                <span className="text-[#78716C] block uppercase text-[10px]">Entity Type</span>
                <span className="font-medium text-[#0B241A]">{currentOrg.type}</span>
              </div>
              <div>
                <span className="text-[#78716C] block uppercase text-[10px]">Headquarters</span>
                <span className="font-medium text-[#0B241A]">{currentOrg.headquarters}</span>
              </div>
            </div>
          </div>

          {/* Switch Organization Dropdown */}
          <div className="pt-4 border-t border-[#E8E4DC]">
            <label className="block text-[11px] font-mono text-[#78716C] uppercase mb-1">
              Switch Workspace Account:
            </label>
            <select
              value={currentOrg.id}
              onChange={(e) => {
                const found = organizations.find(o => o.id === e.target.value);
                if (found) onSelectOrg(found);
              }}
              className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E8E4DC] rounded text-[#0B241A] focus:outline-none focus:border-[#0B241A]"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.type} · ${(org.aumUsd / 1000000).toFixed(0)}M)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Member Role Simulation Card */}
        <div className="lg:col-span-6 p-6 bg-[#F4F1EA] border border-[#E8E4DC] rounded-xl shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#0B241A] font-semibold">
                Simulated Active User Identity
              </span>
              <span className="text-xs font-mono bg-[#0B241A] text-white px-2.5 py-0.5 rounded font-semibold">
                {currentMember.role}
              </span>
            </div>

            <div>
              <h4 className="text-xl font-serif font-semibold text-[#0B241A]">
                {currentMember.name}
              </h4>
              <p className="text-xs text-[#57534E]">
                {currentMember.email} · Member since {currentMember.joinedDate}
              </p>
            </div>

            <div className="text-xs text-[#57534E] leading-relaxed p-3 bg-white border border-[#E8E4DC] rounded">
              <strong className="text-[#0B241A] block mb-0.5">Role Governance Scope:</strong>
              {roles.find(r => r.role === currentMember.role)?.description}
            </div>
          </div>

          {/* Switch User Role Dropdown */}
          <div className="pt-3 border-t border-[#E8E4DC]">
            <label className="block text-[11px] font-mono text-[#78716C] uppercase mb-1">
              Switch Perspective to Test Permissions:
            </label>
            <select
              value={currentMember.id}
              onChange={(e) => {
                const found = teamMembers.find(m => m.id === e.target.value);
                if (found) onSelectMember(found);
              }}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E8E4DC] rounded text-[#0B241A] focus:outline-none focus:border-[#0B241A]"
            >
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.role}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#0B241A]">
          Governance Roles & Authority Matrix
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((r) => {
            const isCurrent = currentMember.role === r.role;
            return (
              <div
                key={r.role}
                className={`p-5 rounded-lg border text-xs space-y-3 transition-colors ${
                  isCurrent
                    ? 'bg-white border-[#0B241A] ring-1 ring-[#0B241A] shadow-xs'
                    : 'bg-[#FBF9F5] border-[#E8E4DC]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-semibold text-sm text-[#0B241A]">{r.role}</span>
                  {isCurrent && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#2C5E4B] font-bold">
                      Active
                    </span>
                  )}
                </div>

                <p className="text-[#57534E] leading-relaxed text-[11px]">
                  {r.description}
                </p>

                <div className="space-y-1 pt-2 border-t border-[#E8E4DC]">
                  <span className="text-[10px] font-mono uppercase text-[#78716C] block">Assigned Powers:</span>
                  <ul className="space-y-0.5 text-[11px] text-[#44403C]">
                    {r.permissions.map((p, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-[#2C5E4B]">✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Membership Roster */}
      <div className="bg-white border border-[#E8E4DC] rounded-xl overflow-hidden shadow-xs space-y-4">
        <div className="p-5 border-b border-[#E8E4DC] flex items-center justify-between">
          <div>
            <h3 className="font-serif font-semibold text-lg text-[#0B241A]">
              Council & Trustee Directory
            </h3>
            <span className="text-xs text-[#78716C]">
              {teamMembers.length} Verified Council Stewards
            </span>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-3 py-1.5 text-xs font-semibold uppercase text-[#0B241A] hover:bg-[#F4F1EA] rounded border border-[#E8E4DC] cursor-pointer"
          >
            + Add Member
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F4F1EA] text-[#57534E] uppercase text-[10px] tracking-wider border-b border-[#E8E4DC]">
                <th className="py-3 px-5 font-semibold">Steward Name</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Join Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-5 font-semibold text-right">Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DC]">
              {teamMembers.map((m) => {
                const isSelected = m.id === currentMember.id;
                return (
                  <tr key={m.id} className={`hover:bg-[#FBF9F5] ${isSelected ? 'bg-[#E8F3EE]/30' : ''}`}>
                    <td className="py-3 px-5 font-medium text-[#0B241A]">
                      <div className="font-semibold text-sm">{m.name}</div>
                      {isSelected && <span className="text-[10px] text-[#2C5E4B] font-mono">Current User Session</span>}
                    </td>
                    <td className="py-3 px-4 text-[#44403C] font-mono">
                      {m.role}
                    </td>
                    <td className="py-3 px-4 text-[#57534E]">
                      {m.email}
                    </td>
                    <td className="py-3 px-4 text-[#78716C] font-mono">
                      {m.joinedDate}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#E8F3EE] text-[#13382C] font-mono text-[10px] font-semibold">
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => onSelectMember(m)}
                        className="text-xs font-semibold text-[#0B241A] hover:underline cursor-pointer"
                      >
                        {isSelected ? 'Active' : 'Assume Role'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B241A]/70 backdrop-blur-xs">
          <div className="bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <h3 className="font-serif font-semibold text-lg text-[#0B241A]">
                Invite Council Member
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-[#78716C] hover:text-[#0B241A] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium uppercase text-[#57534E] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jonathan Kenyatta"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-sm text-[#0B241A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium uppercase text-[#57534E] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="jonathan@kenyatta.trust"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-sm text-[#0B241A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium uppercase text-[#57534E] mb-1">
                  Assigned Governance Role
                </label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-xs text-[#0B241A] focus:outline-none"
                >
                  <option value="Principal Steward">Principal Steward</option>
                  <option value="Fiduciary Trustee">Fiduciary Trustee</option>
                  <option value="Investment Committee Lead">Investment Committee Lead</option>
                  <option value="Next-Gen Fellow">Next-Gen Fellow</option>
                  <option value="Field Auditor">Field Auditor</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E4DC]">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 uppercase text-[#78716C] hover:text-[#0B241A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B241A] text-white uppercase font-medium rounded hover:bg-[#13382C] cursor-pointer"
                >
                  Issue Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

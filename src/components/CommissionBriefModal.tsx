import React, { useState } from 'react';

interface CommissionBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFamilyName?: string;
}

export const CommissionBriefModal: React.FC<CommissionBriefModalProps> = ({
  isOpen,
  onClose,
  defaultFamilyName = ''
}) => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    institutionOrFamily: defaultFamilyName || 'Ochieng Family Council',
    role: 'Principal / Family Member',
    email: '',
    allocationRange: '$1,000,000 - $3,000,000 USD',
    sectorFocus: 'Regenerative Agriculture & Watersheds',
    primaryChallenge: 'Vetting genuine operating additionality and avoiding predatory intermediaries',
    confidentialityConfirmed: true
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B241A]/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl shadow-2xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DC] bg-[#F4F1EA]">
          <div className="text-xs uppercase tracking-widest text-[#57534E] font-medium">
            Africa Regeneration Allocation Brief · Commissioning Protocol
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#78716C] hover:text-[#0B241A] transition-colors rounded hover:bg-[#E8E4DC] cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-[#1C1917]">
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-medium text-[#0B241A]">
                Commission an Independent Decision Brief
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                Atlas Sanctum conducts fixed-fee research and field verification for high-conviction family offices, foundations, and diaspora syndicates. Zero broker commissions, zero conflicts of interest.
              </p>
            </div>

            <div className="p-3 bg-[#F4F1EA] border border-[#E8E4DC] rounded text-xs text-[#44403C] flex justify-between items-center">
              <span>Standard 4-Week Research Deliverable</span>
              <strong className="font-mono text-[#0B241A]">$22,500 USD Fixed Fee</strong>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-[#57534E] uppercase mb-1">
                  Principal Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Amina Ochieng"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-sm text-[#0B241A] focus:outline-none focus:border-[#0B241A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#57534E] uppercase mb-1">
                  Family Office or Entity
                </label>
                <input
                  type="text"
                  required
                  value={formData.institutionOrFamily}
                  onChange={(e) => setFormData({ ...formData, institutionOrFamily: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-sm text-[#0B241A] focus:outline-none focus:border-[#0B241A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-[#57534E] uppercase mb-1">
                  Confidential Contact Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="principal@familyoffice.ke"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-sm text-[#0B241A] focus:outline-none focus:border-[#0B241A]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#57534E] uppercase mb-1">
                  Target Allocation Pool
                </label>
                <select
                  value={formData.allocationRange}
                  onChange={(e) => setFormData({ ...formData, allocationRange: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-sm text-[#0B241A] focus:outline-none focus:border-[#0B241A]"
                >
                  <option value="$500,000 - $1,000,000 USD">$500,000 - $1,000,000 USD</option>
                  <option value="$1,000,000 - $3,000,000 USD">$1,000,000 - $3,000,000 USD</option>
                  <option value="$3,000,000 - $10,000,000 USD">$3,000,000 - $10,000,000 USD</option>
                  <option value="$10,000,000+ USD">$10,000,000+ USD Institutional Syndicate</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-medium text-[#57534E] uppercase mb-1">
                Primary Stewardship or Succession Concern
              </label>
              <textarea
                rows={3}
                value={formData.primaryChallenge}
                onChange={(e) => setFormData({ ...formData, primaryChallenge: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded text-sm text-[#0B241A] focus:outline-none focus:border-[#0B241A]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-[#57534E] pt-2">
              <input
                type="checkbox"
                id="confidentiality"
                checked={formData.confidentialityConfirmed}
                onChange={(e) => setFormData({ ...formData, confidentialityConfirmed: e.target.checked })}
                className="accent-[#0B241A]"
              />
              <label htmlFor="confidentiality">
                I understand Atlas Sanctum operates under strict fiduciary non-disclosure (NDA) and does not provide regulated securities brokerage.
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E4DC]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium uppercase text-[#57534E] hover:text-[#0B241A] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0B241A] text-white text-xs font-medium uppercase tracking-wider rounded hover:bg-[#13382C] transition-colors cursor-pointer"
              >
                Submit Commission Request
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 space-y-6 text-center text-[#1C1917]">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#E8F3EE] flex items-center justify-center text-[#2C5E4B]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2C5E4B]">
                Intake Confirmed · Reference #AS-2026-904
              </span>
              <h2 className="text-2xl font-serif font-medium text-[#0B241A]">
                Brief Commission Initiated
              </h2>
              <p className="text-sm text-[#57534E] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name || 'Principal'}</strong>. Your diagnostic intake has been logged under mutual non-disclosure. An Atlas Sanctum senior research fellow will coordinate your 90-minute mandate discovery session within 2 business days.
              </p>
            </div>

            <div className="p-4 bg-[#F4F1EA] border border-[#E8E4DC] rounded text-xs text-[#57534E] max-w-md mx-auto text-left space-y-1">
              <div><strong>Client Entity:</strong> {formData.institutionOrFamily}</div>
              <div><strong>Scope:</strong> Africa Regeneration Allocation Brief</div>
              <div><strong>Allocation Target:</strong> {formData.allocationRange}</div>
              <div><strong>Delivery Target:</strong> 28 Business Days from Mandate Lock</div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-[#0B241A] text-white text-xs font-medium uppercase tracking-wider rounded hover:bg-[#13382C] transition-colors cursor-pointer"
              >
                Return to Observatory
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export type CaseWorkflowStatus =
  | "Evidence review"
  | "Needs more information"
  | "Manual review"
  | "Ready for support decision"
  | "Escalated";

export type CaseAttentionLevel = "Low attention" | "Review signals" | "Manual review recommended";

export type CaseEvidenceType =
  | "Receipt"
  | "Order screenshot"
  | "Shipping confirmation"
  | "Customer message"
  | "Product-photo-like unsupported";

export type CaseEvidenceReviewState =
  | "Receipt analysis complete"
  | "Needs clearer copy"
  | "Context only"
  | "Unsupported manual review";

export type CaseEvidenceItem = {
  key: string;
  type: CaseEvidenceType;
  title: string;
  reviewState: CaseEvidenceReviewState;
  attentionLevel: CaseAttentionLevel;
  safeSummary: string;
  limitations: readonly string[];
  signals: readonly string[];
  recommendedReviewerAction: string;
  externalVerification: "Not performed";
  verificationStatus: "Not externally verified";
  noLiveAnalysis?: {
    ocrInvoked: false;
    metadataInvoked: false;
    productPhotoRuntimeLive: false;
    productPhotoReviewPanelRouted: false;
  };
};

export type CaseTimelineCategory =
  | "Evidence added"
  | "Analysis completed"
  | "Manual review needed"
  | "Rep note drafted"
  | "Customer-safe wording prepared"
  | "Case status changed"
  | "Escalation marker";

export type CaseTimelineSeverity = "Informational" | "Complete" | "Needs review" | "Escalation";

export type CaseTimelineEvent = {
  key: string;
  category: CaseTimelineCategory;
  statusLabel: string;
  severity: CaseTimelineSeverity;
  timestamp: string;
  relativeTime: string;
  actor: string;
  detail: string;
  caseStatusAfter: CaseWorkflowStatus;
  relatedEvidenceKeys: readonly string[];
  reviewerImpact: string;
};

export type CaseManualDecisionTone = "Active review" | "Escalation path" | "Info needed" | "Safety hold";

export type CaseManualDecisionState = {
  key: string;
  label: string;
  tone: CaseManualDecisionTone;
  detail: string;
};

export type CaseManualReviewWorkspace = {
  summary: string;
  notSavedBoundary: string;
  decisionStates: readonly CaseManualDecisionState[];
  internalNotes: readonly string[];
  policyConsiderations: readonly string[];
  selectedEvidenceRationale: Record<string, readonly string[]>;
  customerSafeHandoff: string;
  timelineConnection: string;
};

export type CaseReviewSummary = {
  evidenceReviewed: string;
  missingInformation: readonly string[];
  manualReviewDrivers: readonly string[];
  recommendedSupportAction: string;
};

export type ClaimGuardLocalCase = {
  caseRef: string;
  workflowStatus: CaseWorkflowStatus;
  attentionLevel: CaseAttentionLevel;
  privacyPosture: string;
  customerClaimSummary: string;
  evidenceItems: readonly CaseEvidenceItem[];
  reviewSummary: CaseReviewSummary;
  manualReviewWorkspace: CaseManualReviewWorkspace;
  customerSafeWordingDraft: string;
  timeline: readonly CaseTimelineEvent[];
};

export const phase32MockCase: ClaimGuardLocalCase = {
  caseRef: "Local case alpha",
  workflowStatus: "Manual review",
  attentionLevel: "Manual review recommended",
  privacyPosture: "Synthetic local review state only. No customer evidence is stored by this shell.",
  customerClaimSummary:
    "Customer reports a shipment concern and submitted mixed evidence for support review. Details are intentionally redacted in this local shell.",
  evidenceItems: [
    {
      key: "receipt-summary",
      type: "Receipt",
      title: "Receipt review summary",
      reviewState: "Receipt analysis complete",
      attentionLevel: "Review signals",
      safeSummary:
        "Local receipt analysis summary is represented as a case evidence item without changing the receipt analyzer.",
      limitations: [
        "External Verification: Not performed",
        "Verification Status: Not externally verified",
        "Score reflects local evidence quality and internal consistency only",
      ],
      signals: [
        "Review signal: extracted fields are present enough for support review",
        "Review signal: manual policy check still required",
      ],
      recommendedReviewerAction:
        "Compare the receipt summary with support policy and other available case evidence.",
      externalVerification: "Not performed",
      verificationStatus: "Not externally verified",
    },
    {
      key: "order-context",
      type: "Order screenshot",
      title: "Order context screenshot",
      reviewState: "Needs clearer copy",
      attentionLevel: "Review signals",
      safeSummary:
        "Screenshot context is included as local reviewer context only and is not treated as external verification.",
      limitations: [
        "No provider lookup was performed",
        "No raw screenshot or private order details are represented",
        "Needs manual review before support action",
      ],
      signals: [
        "Review signal: screenshot context may help compare dates and item context",
        "Needs clearer evidence if the support team cannot read the submitted copy",
      ],
      recommendedReviewerAction:
        "Request a clearer copy if the submitted context is not readable enough for policy review.",
      externalVerification: "Not performed",
      verificationStatus: "Not externally verified",
    },
    {
      key: "photo-unsupported",
      type: "Product-photo-like unsupported",
      title: "Product-photo-like evidence",
      reviewState: "Unsupported manual review",
      attentionLevel: "Manual review recommended",
      safeSummary:
        "This evidence type is represented as unsupported/manual-review-only. No automated analysis result was produced for this evidence item.",
      limitations: [
        "OCR was not run for this evidence item",
        "Metadata processing was not run for this evidence item",
        "Product-photo runtime is not live",
        "ProductPhotoReviewPanel is not routed",
      ],
      signals: [
        "Manual review recommended before action",
        "Could not be verified from available evidence in this local shell",
      ],
      recommendedReviewerAction:
        "Use support policy and available evidence, or request eligible receipt evidence if needed.",
      externalVerification: "Not performed",
      verificationStatus: "Not externally verified",
      noLiveAnalysis: {
        ocrInvoked: false,
        metadataInvoked: false,
        productPhotoRuntimeLive: false,
        productPhotoReviewPanelRouted: false,
      },
    },
    {
      key: "customer-message",
      type: "Customer message",
      title: "Customer context summary",
      reviewState: "Context only",
      attentionLevel: "Low attention",
      safeSummary:
        "Message context is summarized for reviewer orientation only and is kept separate from customer-safe response wording.",
      limitations: [
        "No private message text is stored in the mock case",
        "Context does not replace evidence review",
      ],
      signals: [
        "Review signal: customer context may explain what additional information to request",
        "Manual decision remains reviewer-entered",
      ],
      recommendedReviewerAction:
        "Use the context to choose the next support question without copying internal notes to the customer.",
      externalVerification: "Not performed",
      verificationStatus: "Not externally verified",
    },
  ],
  reviewSummary: {
    evidenceReviewed: "Four synthetic evidence items are staged for local case review.",
    missingInformation: [
      "Clearer eligible receipt copy may be needed if support policy requires it",
      "External order verification is not connected",
      "Unsupported evidence requires manual review outside automated analysis",
    ],
    manualReviewDrivers: [
      "Mixed evidence types in one case",
      "Unsupported product-photo-like evidence is not live-analyzed",
      "Support action should remain separate from local review signals",
    ],
    recommendedSupportAction:
      "Continue manual review, compare eligible receipt context with policy, and request clearer evidence if needed.",
  },
  manualReviewWorkspace: {
    summary:
      "Manual review is still required because the case combines eligible receipt context, screenshot context, and unsupported product-photo-like evidence.",
    notSavedBoundary:
      "Static mock review plan only. These notes and decision states are not saved, submitted, or sent to any external system.",
    decisionStates: [
      {
        key: "needs-review",
        label: "Needs review",
        tone: "Active review",
        detail: "Reviewer should compare available evidence with support policy before choosing a customer response.",
      },
      {
        key: "request-more-information",
        label: "Request more information",
        tone: "Info needed",
        detail: "A clearer eligible receipt copy may be useful if policy requires stronger purchase context.",
      },
      {
        key: "escalate",
        label: "Escalate",
        tone: "Escalation path",
        detail: "Senior review may be useful when mixed evidence types need a second policy check.",
      },
      {
        key: "reviewer-required",
        label: "Reviewer decision required",
        tone: "Safety hold",
        detail: "The shell does not decide the claim, send a message, or update a case record.",
      },
    ],
    internalNotes: [
      "Compare receipt summary with screenshot context before requesting more information.",
      "Keep unsupported product-photo-like evidence in manual review; no automated analysis result is available.",
      "Use customer-safe wording if asking for a clearer receipt or additional context.",
    ],
    policyConsiderations: [
      "External Verification: Not performed",
      "Verification Status: Not externally verified",
      "Support action should remain reviewer-entered",
      "Do not copy internal notes into customer-facing wording",
    ],
    selectedEvidenceRationale: {
      "receipt-summary": [
        "Receipt summary can support policy comparison, but it is not externally verified.",
        "Review local evidence-quality signals alongside other case context.",
      ],
      "order-context": [
        "Screenshot context may help align dates and item context.",
        "A clearer copy may be needed if the submitted context is not readable enough.",
      ],
      "photo-unsupported": [
        "Product-photo-like evidence remains unsupported and manual-review-only.",
        "No OCR, metadata processing, or product-photo runtime analysis was performed.",
      ],
      "customer-message": [
        "Customer context can guide the next support question.",
        "Keep internal rationale separate from customer-safe response wording.",
      ],
    },
    customerSafeHandoff:
      "Use the customer-safe wording panel when asking for clearer evidence or additional context; do not include internal review rationale.",
    timelineConnection:
      "Timeline entries show when notes, wording, manual review, and escalation markers were staged as mock events.",
  },
  customerSafeWordingDraft:
    "Thanks for sending the information. We are reviewing the available evidence and may ask for a clearer receipt or additional context if it is needed to complete the support review.",
  timeline: [
    {
      key: "case-opened",
      category: "Case status changed",
      statusLabel: "Case opened",
      severity: "Informational",
      timestamp: "Today 09:12",
      relativeTime: "42 minutes ago",
      actor: "Reviewer",
      detail: "Synthetic case shell loaded with redacted summary fields and no stored customer evidence.",
      caseStatusAfter: "Evidence review",
      relatedEvidenceKeys: [],
      reviewerImpact: "Creates a local review workspace before any support action is considered.",
    },
    {
      key: "receipt-evidence-added",
      category: "Evidence added",
      statusLabel: "Receipt summary added",
      severity: "Informational",
      timestamp: "Today 09:18",
      relativeTime: "36 minutes ago",
      actor: "Reviewer",
      detail: "Receipt evidence was represented as a privacy-safe local summary, without raw OCR or file details.",
      caseStatusAfter: "Evidence review",
      relatedEvidenceKeys: ["receipt-summary"],
      reviewerImpact: "Adds eligible receipt context for comparison with support policy.",
    },
    {
      key: "receipt-analysis-completed",
      category: "Analysis completed",
      statusLabel: "Receipt review summary complete",
      severity: "Complete",
      timestamp: "Today 09:21",
      relativeTime: "33 minutes ago",
      actor: "ClaimGuard shell",
      detail: "Local receipt review summary is staged as an evidence item; external verification was not performed.",
      caseStatusAfter: "Evidence review",
      relatedEvidenceKeys: ["receipt-summary"],
      reviewerImpact: "Gives the rep local evidence-quality signals without changing receipt analyzer behavior.",
    },
    {
      key: "order-context-added",
      category: "Evidence added",
      statusLabel: "Order context added",
      severity: "Informational",
      timestamp: "Today 09:28",
      relativeTime: "26 minutes ago",
      actor: "Reviewer",
      detail: "Order screenshot context was summarized for manual comparison only.",
      caseStatusAfter: "Evidence review",
      relatedEvidenceKeys: ["order-context"],
      reviewerImpact: "May help the rep decide whether a clearer copy is needed.",
    },
    {
      key: "unsupported-stopped",
      category: "Manual review needed",
      statusLabel: "Unsupported evidence marked",
      severity: "Needs review",
      timestamp: "Today 09:34",
      relativeTime: "20 minutes ago",
      actor: "ClaimGuard shell",
      detail: "Product-photo-like evidence remains manual-review-only and no automated analysis result was produced.",
      caseStatusAfter: "Manual review",
      relatedEvidenceKeys: ["photo-unsupported"],
      reviewerImpact: "Prompts the rep to use support policy or request eligible receipt evidence if needed.",
    },
    {
      key: "status-manual-review",
      category: "Case status changed",
      statusLabel: "Status moved to manual review",
      severity: "Needs review",
      timestamp: "Today 09:35",
      relativeTime: "19 minutes ago",
      actor: "Reviewer",
      detail: "Case status reflects mixed evidence and unsupported manual-review-only evidence.",
      caseStatusAfter: "Manual review",
      relatedEvidenceKeys: ["receipt-summary", "order-context", "photo-unsupported"],
      reviewerImpact: "Keeps the workflow human-entered and avoids a system-made support recommendation.",
    },
    {
      key: "rep-note-drafted",
      category: "Rep note drafted",
      statusLabel: "Internal note drafted",
      severity: "Informational",
      timestamp: "Today 09:41",
      relativeTime: "13 minutes ago",
      actor: "Reviewer",
      detail: "Internal note placeholder records what to compare next without private evidence details.",
      caseStatusAfter: "Manual review",
      relatedEvidenceKeys: ["customer-message", "order-context"],
      reviewerImpact: "Separates internal review context from language that may be sent to the customer.",
    },
    {
      key: "wording-drafted",
      category: "Customer-safe wording prepared",
      statusLabel: "Customer-safe wording ready",
      severity: "Complete",
      timestamp: "Today 09:46",
      relativeTime: "8 minutes ago",
      actor: "Reviewer",
      detail: "Draft wording asks for clearer receipt context if needed and avoids presenting a support outcome.",
      caseStatusAfter: "Manual review",
      relatedEvidenceKeys: ["customer-message"],
      reviewerImpact: "Gives the rep a careful response draft while the case remains under manual review.",
    },
    {
      key: "escalation-marker",
      category: "Escalation marker",
      statusLabel: "Senior review may be needed",
      severity: "Escalation",
      timestamp: "Today 09:51",
      relativeTime: "3 minutes ago",
      actor: "Reviewer",
      detail: "Escalation marker is available if policy requires a second reviewer for mixed evidence.",
      caseStatusAfter: "Manual review",
      relatedEvidenceKeys: ["photo-unsupported", "receipt-summary"],
      reviewerImpact: "Flags a review pathway, not a conclusion about the customer or evidence.",
    },
  ],
};

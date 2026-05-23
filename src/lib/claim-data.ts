import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileSearch,
  Inbox,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type RiskLevel = "Low" | "Medium" | "High";

export type RedFlag = {
  label: string;
  detail: string;
  confidence: "Low confidence" | "Inconclusive" | "Manual review recommended";
};

export type CaseRecord = {
  id: string;
  customer: string;
  submittedAt: string;
  item: string;
  channel: string;
  risk: RiskLevel;
  score: number;
  status: string;
};

export type NavItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Claim Review", icon: FileSearch },
  { label: "Inbox", icon: Inbox },
  { label: "Safe Replies", icon: MessageSquareText },
  { label: "Policies", icon: ShieldCheck },
  { label: "Settings", icon: SlidersHorizontal },
];

export const redFlags: RedFlag[] = [
  {
    label: "Potential alteration detected",
    detail: "Receipt total alignment differs from nearby fields.",
    confidence: "Manual review recommended",
  },
  {
    label: "Needs proof of purchase verification",
    detail: "Merchant name is visible, but order ID clarity is limited.",
    confidence: "Inconclusive",
  },
  {
    label: "Low confidence image consistency check",
    detail: "Damage photo lighting does not match the surrounding product surface.",
    confidence: "Low confidence",
  },
];

export const recentCases: CaseRecord[] = [
  {
    id: "CG-1048",
    customer: "Maya R.",
    submittedAt: "Today, 10:42 AM",
    item: "Countertop blender",
    channel: "Zendesk",
    risk: "Medium",
    score: 68,
    status: "Manual review",
  },
  {
    id: "CG-1047",
    customer: "Jon Bell",
    submittedAt: "Today, 9:18 AM",
    item: "Wireless earbuds",
    channel: "Email",
    risk: "Low",
    score: 91,
    status: "Ready to approve",
  },
  {
    id: "CG-1046",
    customer: "N. Patel",
    submittedAt: "Yesterday, 4:55 PM",
    item: "Standing desk",
    channel: "Intercom",
    risk: "High",
    score: 38,
    status: "Proof requested",
  },
  {
    id: "CG-1045",
    customer: "Elena M.",
    submittedAt: "Yesterday, 2:07 PM",
    item: "Smart lock",
    channel: "Shopify",
    risk: "Medium",
    score: 72,
    status: "Manual review",
  },
];

export const statusCards = [
  {
    label: "Open reviews",
    value: "28",
    trend: "+6 today",
    icon: Clock3,
  },
  {
    label: "Low-risk clears",
    value: "184",
    trend: "91% this week",
    icon: CheckCircle2,
  },
  {
    label: "Manual checks",
    value: "43",
    trend: "Avg. 7 min",
    icon: AlertTriangle,
  },
];

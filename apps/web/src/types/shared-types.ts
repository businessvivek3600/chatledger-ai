// User & Auth Roles
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  PLATFORM_SUPPORT = 'PLATFORM_SUPPORT',
  PLATFORM_FINANCE = 'PLATFORM_FINANCE',
  BUSINESS_OWNER = 'BUSINESS_OWNER',
  BUSINESS_ADMIN = 'BUSINESS_ADMIN',
  MANAGER = 'MANAGER',
  SALES_AGENT = 'SALES_AGENT',
  CUSTOMER_SUPPORT = 'CUSTOMER_SUPPORT',
  APPOINTMENT_MANAGER = 'APPOINTMENT_MANAGER',
  VIEWER = 'VIEWER',
}

// Granular Permissions
export enum Permission {
  // Tenant & Organization
  MANAGE_TENANT = 'manage_tenant',
  VIEW_TENANT = 'view_tenant',
  MANAGE_SETTINGS = 'manage_settings',
  MANAGE_BILLING = 'manage_billing',

  // Team & Users
  MANAGE_TEAM = 'manage_team',
  VIEW_TEAM = 'view_team',

  // WhatsApp & Inbox
  VIEW_ALL_CONVERSATIONS = 'view_all_conversations',
  VIEW_ASSIGNED_CONVERSATIONS = 'view_assigned_conversations',
  SEND_MESSAGES = 'send_messages',
  ASSIGN_CONVERSATION = 'assign_conversation',
  MANAGE_TEMPLATES = 'manage_templates',

  // CRM: Leads & Customers
  MANAGE_LEADS = 'manage_leads',
  VIEW_LEADS = 'view_leads',
  VIEW_ASSIGNED_LEADS = 'view_assigned_leads',
  MANAGE_CUSTOMERS = 'manage_customers',
  VIEW_CUSTOMERS = 'view_customers',

  // Appointments
  MANAGE_APPOINTMENTS = 'manage_appointments',
  VIEW_APPOINTMENTS = 'view_appointments',
  VIEW_ASSIGNED_APPOINTMENTS = 'view_assigned_appointments',

  // AI & Knowledge Base
  MANAGE_AI = 'manage_ai',
  MANAGE_KNOWLEDGE_BASE = 'manage_knowledge_base',

  // Automations & Campaigns
  MANAGE_AUTOMATIONS = 'manage_automations',
  MANAGE_CAMPAIGNS = 'manage_campaigns',

  // Payments & Tasks
  MANAGE_PAYMENTS = 'manage_payments',
  VIEW_PAYMENTS = 'view_payments',
  MANAGE_TASKS = 'manage_tasks',

  // Reports
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_FINANCIAL_REPORTS = 'view_financial_reports',

  // Super Admin
  SUPER_ADMIN_ACCESS = 'super_admin_access',
}

// Industry Types
export enum IndustryType {
  CLINIC = 'CLINIC',
  SALON = 'SALON',
  COACHING = 'COACHING',
  REAL_ESTATE = 'REAL_ESTATE',
  RETAIL = 'RETAIL',
  CONSULTING = 'CONSULTING',
  REPAIR = 'REPAIR',
  AGENCY = 'AGENCY',
  OTHER = 'OTHER',
}

// Subscription Plans
export enum SubscriptionPlanTier {
  FREE_TRIAL = 'FREE_TRIAL',
  STARTER = 'STARTER',
  GROWTH = 'GROWTH',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

export enum SubscriptionStatus {
  TRIALING = 'TRIALING',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
}

// WhatsApp Conversation Status
export enum ConversationStatus {
  UNASSIGNED = 'UNASSIGNED',
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  ARCHIVED = 'ARCHIVED',
}

export enum HandlingMode {
  AI = 'AI',
  HUMAN = 'HUMAN',
  AI_ASSISTED = 'AI_ASSISTED',
}

// WhatsApp Message Types & Statuses
export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  TEMPLATE = 'TEMPLATE',
  INTERACTIVE = 'INTERACTIVE',
  LOCATION = 'LOCATION',
  NOTE = 'NOTE', // Internal agent note
}

export enum MessageSender {
  CUSTOMER = 'CUSTOMER',
  AGENT = 'AGENT',
  AI = 'AI',
  SYSTEM = 'SYSTEM',
}

export enum MessageDeliveryStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

// CRM Lead Statuses & Priority
export enum LeadStage {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  INTERESTED = 'INTERESTED',
  PROPOSAL_SENT = 'PROPOSAL_SENT',
  NEGOTIATION = 'NEGOTIATION',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
}

export enum LeadPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum LeadSource {
  WHATSAPP = 'WHATSAPP',
  WEBSITE = 'WEBSITE',
  LANDING_PAGE = 'LANDING_PAGE',
  MANUAL = 'MANUAL',
  AD_CAMPAIGN = 'AD_CAMPAIGN',
  REFERRAL = 'REFERRAL',
  API = 'API',
}

// Appointments
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED',
}

// Task Status & Priority
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// Payments
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
}

// Automation
export enum AutomationTriggerType {
  NEW_MESSAGE = 'NEW_MESSAGE',
  NEW_LEAD = 'NEW_LEAD',
  LEAD_STAGE_CHANGED = 'LEAD_STAGE_CHANGED',
  APPOINTMENT_BOOKED = 'APPOINTMENT_BOOKED',
  APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  NO_RESPONSE_DELAY = 'NO_RESPONSE_DELAY',
  SCHEDULED_TIME = 'SCHEDULED_TIME',
}

export enum AutomationActionType {
  SEND_WHATSAPP_MESSAGE = 'SEND_WHATSAPP_MESSAGE',
  SEND_TEMPLATE = 'SEND_TEMPLATE',
  ASSIGN_EMPLOYEE = 'ASSIGN_EMPLOYEE',
  CREATE_LEAD = 'CREATE_LEAD',
  UPDATE_LEAD_STAGE = 'UPDATE_LEAD_STAGE',
  ADD_TAG = 'ADD_TAG',
  CREATE_TASK = 'CREATE_TASK',
  SCHEDULE_FOLLOWUP = 'SCHEDULE_FOLLOWUP',
  GENERATE_PAYMENT_LINK = 'GENERATE_PAYMENT_LINK',
  ESCALATE_TO_HUMAN = 'ESCALATE_TO_HUMAN',
}

// Campaign Status
export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  SENDING = 'SENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Common Payload Interfaces
export interface JwtUserPayload {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  tenantId?: string;
  tenantSlug?: string;
  permissions: Permission[];
}

export interface BusinessTenantProfile {
  id: string;
  name: string;
  slug: string;
  industry: IndustryType;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  gstin?: string;
  timezone: string;
  currency: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'ONBOARDING';
  logoUrl?: string;
  planTier: SubscriptionPlanTier;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

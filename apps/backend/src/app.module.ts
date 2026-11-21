import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { AiModule } from './modules/ai/ai.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';
import { LeadsModule } from './modules/leads/leads.module';
import { CustomersModule } from './modules/customers/customers.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AutomationsModule } from './modules/automations/automations.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { InboxGateway } from './gateways/inbox.gateway';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    WhatsAppModule,
    ConversationsModule,
    AiModule,
    KnowledgeBaseModule,
    LeadsModule,
    CustomersModule,
    AppointmentsModule,
    AutomationsModule,
    CampaignsModule,
    TasksModule,
    PaymentsModule,
    ReportsModule,
    SuperAdminModule,
  ],
  providers: [InboxGateway],
})
export class AppModule {}

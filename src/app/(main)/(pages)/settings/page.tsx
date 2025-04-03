'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ProfileTabs } from "./_components/profile-tabs";
import { TeamTabs } from "./_components/team-tabs";
import { IntegrationsTabs } from "./_components/integrations-tabs";

export default function Page() {
  return (
    <div className='space-y-4'>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="border border-neutral-200 dark:border-neutral-700 shadow-md">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileTabs />
        </TabsContent>
        <TabsContent value="team">
          <TeamTabs /> 
        </TabsContent>
        <TabsContent value="integrations">
          <IntegrationsTabs />
        </TabsContent>
      </Tabs>
    </div>
  );
}

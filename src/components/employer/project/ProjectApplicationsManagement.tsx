import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectApplicationsManagementProps {
  projectId: string;
}

export const ProjectApplicationsManagement: React.FC<ProjectApplicationsManagementProps> = ({
  projectId,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Applications management will be implemented here.
        </p>
      </CardContent>
    </Card>
  );
};
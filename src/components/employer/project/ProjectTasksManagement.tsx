import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectTasksManagementProps {
  projectId: string;
}

export const ProjectTasksManagement: React.FC<ProjectTasksManagementProps> = ({
  projectId,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Tasks management will be implemented here.
        </p>
      </CardContent>
    </Card>
  );
};
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectDiscussionsManagementProps {
  projectId: string;
}

export const ProjectDiscussionsManagement: React.FC<ProjectDiscussionsManagementProps> = ({
  projectId,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Discussions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Discussions management will be implemented here.
        </p>
      </CardContent>
    </Card>
  );
};
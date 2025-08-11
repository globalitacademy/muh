import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectFilesManagementProps {
  projectId: string;
}

export const ProjectFilesManagement: React.FC<ProjectFilesManagementProps> = ({
  projectId,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Files</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Files management will be implemented here.
        </p>
      </CardContent>
    </Card>
  );
};
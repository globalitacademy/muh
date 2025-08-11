import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectTimelineManagementProps {
  project: any;
}

export const ProjectTimelineManagement: React.FC<ProjectTimelineManagementProps> = ({
  project,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Timeline management will be implemented here.
        </p>
      </CardContent>
    </Card>
  );
};
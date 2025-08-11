import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectReviewsManagementProps {
  projectId: string;
}

export const ProjectReviewsManagement: React.FC<ProjectReviewsManagementProps> = ({
  projectId,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Reviews management will be implemented here.
        </p>
      </CardContent>
    </Card>
  );
};
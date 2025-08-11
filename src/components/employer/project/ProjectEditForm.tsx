import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectEditFormProps {
  project: any;
  onSave: () => void;
  onCancel: () => void;
}

export const ProjectEditForm: React.FC<ProjectEditFormProps> = ({
  project,
  onSave,
  onCancel,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Project: {project.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Project editing form will be implemented here.
        </p>
        <div className="flex gap-2">
          <Button onClick={onSave}>Save Changes</Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
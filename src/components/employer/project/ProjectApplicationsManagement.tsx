import React from "react";
import ApplicationManagement from "@/components/projects/ApplicationManagement";

interface ProjectApplicationsManagementProps {
  projectId: string;
}

export const ProjectApplicationsManagement: React.FC<ProjectApplicationsManagementProps> = ({
  projectId,
}) => {
  return <ApplicationManagement projectId={projectId} />;
};
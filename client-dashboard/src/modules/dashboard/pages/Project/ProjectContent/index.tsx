import React from 'react';
import ProjectHeader from './component/Header';
import ProjectTable from './component/ProjectTable';
import { ProjectContentWrapper } from './style';

const ProjectContent = () => {
  return (
    <div>
      <ProjectHeader />
      <ProjectTable />
    </div>
  );
};

export default ProjectContent;

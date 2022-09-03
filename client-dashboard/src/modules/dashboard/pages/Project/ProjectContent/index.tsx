import React from 'react';
import ProjectHeader from './component/Header';
import ProjectTable from './component/ProjectTable';
import { ProjectContentWrapper } from './style';

const ProjectContent = () => {
  return (
    <>
      <ProjectHeader />
      <ProjectTable />
    </>
  );
};

export default ProjectContent;

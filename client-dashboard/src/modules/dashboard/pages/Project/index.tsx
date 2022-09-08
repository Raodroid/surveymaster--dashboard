import React from 'react';
import { ProjectWrapper } from './style';
import ProjectSider from './ProjectSider';
import ProjectContent from './ProjectContent';

const Project = () => {
  return (
    <ProjectWrapper>
      <ProjectSider />
      <ProjectContent />
    </ProjectWrapper>
  );
};

export default Project;

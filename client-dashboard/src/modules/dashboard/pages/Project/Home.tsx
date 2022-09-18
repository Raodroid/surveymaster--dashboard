import React from 'react';
import ProjectContent from './ProjectContent';
import ProjectSider from './ProjectSider';
import { ProjectWrapper } from './style';

function Home() {
  return (
    <ProjectWrapper>
      <ProjectSider />
      <ProjectContent />
    </ProjectWrapper>
  );
}

export default Home;

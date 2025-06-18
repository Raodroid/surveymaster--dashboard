import styled from 'styled-components/macro';
import templateVariable from '../app/template-variables.module.scss';
interface IIcons {
  className?: string;
}
export const Icons = styled.div<IIcons>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${p =>
    p.className === 'bg-blue-success' && templateVariable.success_color};
  background-color: ${p =>
    p.className === 'bg-orange-warning' && templateVariable.warning_color};
`;

import React from 'react';
import styled from 'styled-components';

export const Toast = styled.div`
  position: absolute;
  width: ${({ width }) => (width ? `${width}` : `15em`)};
  height: ${({ height }) => (height ? `${height}` : `auto`)};
  top: 0;
  transform: translateY(
    ${({ translate }) => (translate ? `${translate}%` : `-110%`)}
  );
  border: 2px solid ${({ color }) => `${color}`};
  background: ${({ background }) => `${background}`};
  color: ${({ color }) => `${color}`};
  text-align: center;
  font-weight: bold;
  font-size: 13px;

  padding: 0 0.5em 0 0.5em;
`;

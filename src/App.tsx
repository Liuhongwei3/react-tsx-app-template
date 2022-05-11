import { Row } from '@qunhe/muya-ui';
import React from 'react';
import styled from 'styled-components';
import './App.css';
import ShowFields from './show-fields';
import YapiFields from './yapi-fields';

function App() {
  return (
    <div className="App">
      <StyledHeader>
        <h2>前端配置工具</h2>
      </StyledHeader>

      <Row justify='space-between'>
        <ShowFields />
        <YapiFields />
      </Row>
    </div>
  );
}

export default App;

const StyledHeader = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
`;

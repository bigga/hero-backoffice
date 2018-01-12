import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import LoginPage from './pages/login/LoginPage';
import UserPage from './pages/user/UserPage';
import KnowledgePage from "./pages/knowledge/KnowledgePage";

export default (props) => {
  return (
    <BrowserRouter>
      <div>
        <Route path="/login" component={LoginPage} />
        <Route path="/user" component={UserPage} />
        <Route path="/knowledge" component={KnowledgePage} />
      </div>
    </BrowserRouter>
  );
}

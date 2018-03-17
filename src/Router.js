import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import LoginPage from './pages/login/LoginPage';
import UserPage from './pages/user/UserPage';
import KnowledgePage from "./pages/knowledge/KnowledgePage";
import ChatPage from "./pages/chat/ChatPage";
import InvitationPage from "./pages/invitation/InvitationPage";

export default (props) => {
  return (
    <BrowserRouter>
      <div>
        <Route path="/login" component={LoginPage} />
        <Route path="/user" component={UserPage} />
        <Route path="/knowledge" component={KnowledgePage} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/invitation" component={InvitationPage} />
      </div>
    </BrowserRouter>
  );
}

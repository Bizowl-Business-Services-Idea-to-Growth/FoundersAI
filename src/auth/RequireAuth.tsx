import React from "react";
// In demo/no-auth mode we allow access to all routes. Keep this component
// present so the route tree doesn't need further changes when SSO is added.

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default RequireAuth;

import React from 'react';

export type userContextType = {
  socket: any;
  refreshData: string;
  //Updaters
  createServer: () => void;
  updateSocket: (value: any) => void;
};

export const UserContext = React.createContext<userContextType>({
  socket: null,
  refreshData: '',
  createServer: () => {},
  updateSocket: () => {},
});

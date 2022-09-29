import React from 'react';
import { useSelector } from 'react-redux';

/**
 * Use Media Hook
 */
export default () => {
  const directory = useSelector((state) => state.directory);
  const directoryFile = useSelector((state) => state.directoryFile);

  return React.useMemo(() => directoryFile[directory] || {}, [directory, directoryFile]);
};

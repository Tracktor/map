import { ReactNode, useEffect, useState } from "react";

const PopupContent = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setReady(true));
  }, []);

  return ready ? children : null;
};

export default PopupContent;

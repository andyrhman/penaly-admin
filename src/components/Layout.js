import React, { useEffect, useState } from "react";
import Loader from "./common/Loader";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {loading ? <Loader /> : children}
    </div>
  );
};

export default Layout;
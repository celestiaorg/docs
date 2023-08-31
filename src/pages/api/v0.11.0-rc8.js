import React, { useState, useEffect } from 'react';
import ApiComponent from "@site/src/components/ApiComponent";
import Layout from '@theme/Layout';

export default function Api() {
  const [openrpcData, setOpenrpcData] = useState(null);

  useEffect(() => {
    import(`@site/src/openrpc-spec/openrpc-v0.11.0-rc8.json`)
      .then((data) => {
        setOpenrpcData(data.default);
      })
      .catch((error) => {
        console.error("Error loading file:", error);
      });
  }, []);

  if (!openrpcData) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title="Celestia Node API" description="The Celestia Node API is the collection of RPC methods that can be used to interact with the services provided by Celestia Data Availability Nodes.">
      <ApiComponent openrpcData={openrpcData} />
    </Layout>
  );
}
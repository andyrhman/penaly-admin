import Layout from "../components/Layout";
import DefaultLayout from "../components/Layouts/DefaultLayout";
import Dashboard from "../components/Dashboard";
import SEO from "../components/SEO";

export default function Home() {
  const pageTitle = `Dashboard | ${process.env.siteTitle}`

  return (
    <Layout>
      <SEO title={pageTitle} />
      <DefaultLayout>
        <Dashboard />
      </DefaultLayout>
    </Layout>
  );
}

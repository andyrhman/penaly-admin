import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import TableOne from "../../components/Tables/TableOne";
import TableThree from "../../components/Tables/TableThree";
import TableTwo from "../../components/Tables/TableTwo";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import Layout from '../../components/Layout';
import SEO from "../../components/SEO";

const TablesPage = () => {
  const pageTitle = `Tables | ${process.env.siteTitle}`;

  return (
    <Layout>
      <SEO title={pageTitle} />
      <DefaultLayout>
        <Breadcrumb pageName="Tables" />
        <div className="flex flex-col gap-10">
          <TableOne />
          <TableTwo />
          <TableThree />
        </div>
      </DefaultLayout>
    </Layout>
  );
};

export default TablesPage;

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import DefaultLayout from "../../../components/Layouts/DefaultLayout";
import Layout from '../../../components/Layout';
import SEO from "../../../components/SEO";
import FormatDate from "../../../services/format-time";
import * as sanitizeHtml from 'sanitize-html';
import 'react-toastify/dist/ReactToastify.css';

const ShowRole = () => {
    const [name, setName] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [selected, setSelected] = useState([]);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            (
                async () => {
                    try {
                        const response = await axios.get('permissions');
                        setPermissions(response.data);

                        const { data } = await axios.get(`roles/${id}`);

                        setName(data.nama);
                        setSelected(data.permissions.map((permission) => permission.id));
                    } catch (error) {
                        if (error.response && [401, 403].includes(error.response.status)) {
                            router.push('/login');
                        }
                    }
                }
            )();
        }
    }, [router, id]);

    const check = (id) => {
        if (selected.some(s => s === id)) {
            setSelected(selected.filter(s => s !== id));
            return;
        }
        setSelected([...selected, id]);
    }

    const pageTitle = `${sanitizeHtml(name)} | ${process.env.siteTitle}`;

    return (
        <Layout>
            <SEO title={pageTitle} />
            <DefaultLayout>
                <div className="mb-6 flex sm:flex-row sm:items-center">
                    <Link href="/roles" className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                        </svg>
                        <span>Kembali</span>
                    </Link>
                </div>
                <div className="flex flex-col gap-10">
                    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-16 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
                        <div className="rounded-sm bg-white">
                            <div className="flex flex-col gap-5.5 p-6.5">

                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Nama
                                    </label>
                                    <h3 className="font-medium text-black dark:text-white">
                                        {name}
                                    </h3>
                                </div>
                                <div>
                                    <label className="mt-3 block text-sm font-medium text-black dark:text-white">
                                        Perizinan
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {permissions.map((permission) => (
                                            <div key={permission.id} className="flex items-center p-2">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox text-blue-500 hover:bg-transparent"
                                                    checked={selected.some(s => s === permission.id)}
                                                    onChange={() => check(permission.id)}
                                                    value={permission.id}
                                                    id={`permission-${permission.id}`}
                                                />
                                                <label htmlFor={`permission-${permission.id}`} className="ml-2">
                                                    {permission.nama}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </Layout>
    );
};

export default ShowRole;

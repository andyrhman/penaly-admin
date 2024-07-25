import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import DefaultLayout from "../../../components/Layouts/DefaultLayout";
import Layout from '../../../components/Layout';
import SEO from "../../../components/SEO";
import FormatDate from "../../../services/format-time";
import Image from "next/image";
import * as sanitizeHtml from 'sanitize-html';
import 'react-toastify/dist/ReactToastify.css';

const EditUser = () => {

    const [nama, setNama] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');
    const [createDate, setCreatedDate] = useState('');
    const [role_id, setRoleId] = useState('');
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            (
                async () => {
                    try {
                        const { data } = await axios.get(`users/${id}`);
                        setNama(data.namaLengkap);
                        setUsername(data.username);
                        setEmail(data.email);
                        setImage(data.foto);
                        setCreatedDate(data.dibuat_pada);
                        setRoleId(data.role.id);
                    } catch (error) {
                        if (error.response && [401, 403].includes(error.response.status)) {
                            router.push('/login');
                        }
                    }
                }
            )();
        }
    }, [router, id]);
    const pageTitle = `Detail ${sanitizeHtml(nama)} | ${process.env.siteTitle}`;

    return (
        <Layout>
            <SEO title={pageTitle} />
            <DefaultLayout>
                <div className="mb-6 flex sm:flex-row sm:items-center">
                    <Link href="/users" className="flex items-center space-x-2">
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
                                <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                                    <div className="relative drop-shadow-2">
                                        <Image
                                            src={image}
                                            width={160}
                                            height={160}
                                            style={{
                                                width: "auto",
                                                height: "auto",
                                            }}
                                            alt={nama}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Nama Lengkap
                                    </label>
                                    <h3 className="font-medium text-black dark:text-white">
                                        {nama}
                                    </h3>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Username
                                    </label>
                                    <h3 className="font-medium text-black dark:text-white">
                                        {username}
                                    </h3>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Email
                                    </label>
                                    <h3 className="font-medium text-black dark:text-white">
                                        {email}
                                    </h3>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Peran
                                    </label>
                                    <h3 className="font-medium text-black dark:text-white">
                                        {role_id}
                                    </h3>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Bergabung Pada
                                    </label>
                                    <h3 className="font-medium text-black dark:text-white">
                                        <FormatDate timestamp={createDate} />
                                    </h3>
                                </div>
                                <br />
                            </div>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </Layout>
    );
};

export default EditUser;

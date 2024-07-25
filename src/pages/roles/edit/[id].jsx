import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast, Slide } from 'react-toastify';
import Link from "next/link";
import axios from "axios";
import DefaultLayout from "../../../components/Layouts/DefaultLayout";
import Layout from '../../../components/Layout';
import SEO from "../../../components/SEO";
import * as sanitizeHtml from 'sanitize-html';
import ButtonSpinner from "../../../components/common/ButtonSpinner";
import UpdateError from "../../../components/Alerts/UpdateError";
import 'react-toastify/dist/ReactToastify.css';

const EditRole = () => {
    const [name, setName] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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
            )()
        }

    }, [id]);

    const check = (id) => {
        if (selected.some(s => s === id)) {
            setSelected(selected.filter(s => s !== id));
            return;
        }
        setSelected([...selected, id]);
    }

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await axios.put(`roles/${id}`, {
                nama: name,
                permissions: selected
            });
            if (data) {
                toast.success('Role Berhasil Diupdate!', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide
                });
                router.push('/roles');
            } else {
                setError('An error occurred during sign-in');
            }
        } catch (error) {
            console.error(error.response);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }

    const pageTitle = `Edit ${sanitizeHtml(name)} | ${process.env.siteTitle}`;

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
                                <form>
                                    <UpdateError error={error} />
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Nama
                                        </label>
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            type="text"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

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

                                    <br />
                                </form>
                                <button
                                    onClick={submit}
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 w-full lg:w-full xl:w-full"
                                >
                                    {loading ? <ButtonSpinner /> : "Update"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </Layout>
    );
};

export default EditRole;

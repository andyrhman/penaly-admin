import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import DefaultLayout from '../../components/Layouts/DefaultLayout';
import UpdateError from '../../components/Alerts/UpdateError';
import ButtonSpinner from '../../components/common/ButtonSpinner';
import Link from 'next/link';
import Image from 'next/image';
import ImageUploadArticle from '../../components/Uploads/ImageUploadArticle';
import { useRouter } from 'next/router';
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateUser = () => {
    const defaultImageUrl = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}uploads/default-article.jpg`;

    const [title, setTitle] = useState('');
    const [deskripsi_kecil, setDeskripsiKecil] = useState('');
    const [deskripsi_panjang, setDeskripsiPanjang] = useState('');
    const [estimasi_membaca, setEstimasiMembaca] = useState('');
    const [gambar, setGambar] = useState(defaultImageUrl);
    const [tag_id, setTagId] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tags, setTags] = useState([])

    const router = useRouter();
    useEffect(() => {

        (
            async () => {
                try {
                    const { data } = await axios.get('tags');
                    setTags(data);
                } catch (error) {
                    if (error.response && [401, 403].includes(error.response.status)) {
                        router.push('/login');
                    }
                }
            }
        )()

    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post('articles', {
                title,
                deskripsi_kecil,
                deskripsi_panjang,
                estimasi_membaca,
                gambar,
                tag_id
            });

            if (data) {
                toast.success('Artikel berhasil dibuat.', {
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
                router.push('/articles')
            } else {
                setError('Terjadi kesalahan, mohon ulang lagi sebentar.');
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
    const pageTitle = `Buat Artikel | ${process.env.siteTitle}`;
    return (
        <Layout>
            <SEO title={pageTitle} />
            <DefaultLayout>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link href="/articles" className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                        </svg>
                        <span>Kembali</span>
                    </Link>
                    <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                        Buat Artikel
                    </h2>
                </div>
                <div className="flex flex-col gap-10">
                    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-16 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-20">
                        <div className="rounded-sm bg-white">
                            <div className="flex flex-col gap-5.5 p-6.5">
                                <form onSubmit={submit}>
                                    <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                                        <div className='relative drop-shadow-2 mb-5'>
                                            <div className='mb-5'>
                                                {gambar ? (
                                                    <Image src={gambar} alt='gambar' width={200} height={200} className='h-auto max-w-full rounded-lg' />
                                                ) : (
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}uploads/default-article.jpg`}
                                                        width={160}
                                                        height={160}
                                                        style={{
                                                            width: "auto",
                                                            height: "auto",
                                                        }}
                                                        alt="profile"
                                                    />
                                                )}
                                                <input
                                                    className='hidden'
                                                    value={gambar}
                                                    onChange={(e) => setGambar(e.target.value)}
                                                />
                                                <ImageUploadArticle uploaded={setGambar} />
                                            </div>
                                            <label
                                                htmlFor="profile"
                                                className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                                            >
                                                <svg
                                                    className="fill-current"
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 14 14"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                                                        fill=""
                                                    />
                                                </svg>
                                                <input
                                                    type="file"
                                                    name="profile"
                                                    id="profile"
                                                    className="sr-only"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <UpdateError error={error} />
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Judul
                                        </label>
                                        <input
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Masukkan Judul"
                                            type="text"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Deskripsi
                                        </label>
                                        <textarea
                                            onChange={(e) => setDeskripsiKecil(e.target.value)}
                                            rows={6}
                                            placeholder="Masukkan Deskripsi"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Isi Konten
                                        </label>
                                        <textarea
                                            onChange={(e) => setDeskripsiPanjang(e.target.value)}
                                            rows={6}
                                            placeholder="Masukkan Isi Konten"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Estimasi Membaca
                                        </label>
                                        <input
                                            onChange={(e) => setEstimasiMembaca(e.target.value)}
                                            placeholder="5 Menit, 20 Menit"
                                            type="text"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Tag
                                        </label>

                                        <div className="relative z-20 bg-white dark:bg-form-input">
                                            <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-lock" viewBox="0 0 16 16">
                                                    <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 5.996V14H3s-1 0-1-1 1-4 6-4q.845.002 1.544.107a4.5 4.5 0 0 0-.803.918A11 11 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664zM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1" />
                                                </svg>
                                            </span>

                                            <select
                                                onChange={(e) => setTagId(e.target.value)}
                                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black"
                                                value={`${tag_id}`}
                                            >
                                                <option value="">Pilih Tag</option>
                                                {tags.map((t) => (
                                                    <option key={t.id} value={t.id} className="text-body dark:text-bodydark">
                                                        {t.nama}
                                                    </option>
                                                ))}
                                            </select>

                                            <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g opacity="0.8">
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                            fill="#637381"
                                                        ></path>
                                                    </g>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <br />
                                    <button
                                        type='submit'
                                        className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 w-full lg:w-full xl:w-full"
                                    >
                                        {loading ? <ButtonSpinner /> : "Terapkan"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </Layout>
    );
};

export default CreateUser;

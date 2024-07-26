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
import Komentar from "../../../components/Komentar";

const ShowUser = () => {
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [deskripsi_kecil, setDeskripsiKecil] = useState('');
    const [deskripsi_panjang, setDeskripsiPanjang] = useState('');
    const [estimasi_membaca, setEstimasiMembaca] = useState('');
    const [gambar, setGambar] = useState('');
    const [tag_id, setTagId] = useState('');
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const router = useRouter();
    const { slug } = router.query;

    // * Show data
    useEffect(() => {
        if (slug) {
            fetchData();
        }
    }, [router, slug]);
    const fetchData = async () => {
        try {
            const { data } = await axios.get(`articles/${slug}`);
            setId(data.id)
            setTitle(data.title);
            setDeskripsiKecil(data.deskripsi_kecil);
            setDeskripsiPanjang(data.deskripsi_panjang);
            setEstimasiMembaca(data.estimasi_membaca);
            setGambar(data.gambar);
            setTagId(data.tag);
            setLikeCount(data.likes);
            checkUserLike(data.id);
        } catch (error) {
            if (error.response && [401, 403].includes(error.response.status)) {
                router.push('/login');
            }
        }
    };

    // * Check like
    const checkUserLike = async (articleId) => {
        try {
            const { data } = await axios.get(`articles/like/${articleId}`);
            setIsLiked(data.message === 'True');
        } catch (error) {
            console.error('Failed to check if user liked the article', error);
        }
    };
    const handleLike = async () => {
        try {
            if (isLiked) {
                await axios.put(`articles/dislike/${id}`);
            } else {
                await axios.put(`articles/like/${id}`);
            }
            fetchData();
        } catch (error) {
            console.error('Failed to like the article', error);
        }
    };

    const pageTitle = `${sanitizeHtml(title)} | ${process.env.siteTitle}`;
    const [isContentVisible, setIsContentVisible] = useState(false);

    // * Show / hide content
    const toggleContentVisibility = () => {
        setIsContentVisible(!isContentVisible);
    };
    return (
        <Layout>
            <SEO title={pageTitle} />
            <DefaultLayout>
                <div className="mb-6 flex sm:flex-row sm:items-center">
                    <Link href="/articles" className="flex items-center space-x-2">
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
                                <div className="relative z-30 mx-auto -mt-22 max-w-full rounded-full bg-white/20 p-1 backdrop-blur sm:h-full sm:max-w-full sm:p-3">
                                    <div className="relative drop-shadow-2">
                                        <Image
                                            src={gambar}
                                            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"

                                            width={160}
                                            height={160}
                                            style={{
                                                width: "auto",
                                                height: "auto",
                                            }}
                                            alt={title}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Judul
                                    </label>
                                    <h3 className="font-medium text-black dark:text-white">
                                        {title}
                                    </h3>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Deskripsi
                                    </label>
                                    <h3 className="font-medium text-black dark:text-white">
                                        {deskripsi_kecil}
                                    </h3>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Isi Konten
                                    </label>
                                    <button
                                        onClick={toggleContentVisibility}
                                        className="mb-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5 bi bi-eye" viewBox="0 0 16 16">
                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                        </svg>&nbsp;
                                        {isContentVisible ? 'Sembunyikan' : 'Lihat'}
                                    </button>
                                    {isContentVisible && (
                                        <div
                                            className="font-medium text-black dark:text-white"
                                            dangerouslySetInnerHTML={{ __html: deskripsi_panjang }}
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Estimasi Membaca
                                    </label>
                                    <h3 className="font-medium text-black dark:text-white">
                                        {estimasi_membaca}
                                    </h3>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Tag
                                    </label>
                                    <h3 className="font-medium text-black dark:text-white">
                                        {tag_id}
                                    </h3>
                                </div>
                                <br />
                                <div className="relative z-30 mx-auto -mt-22 max-w-full rounded-full bg-white/20 p-1 backdrop-blur sm:h-full sm:max-w-full sm:p-3">
                                    <div
                                        className="relative drop-shadow-2 cursor-pointer hover:opacity-75"
                                        onClick={handleLike}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={`h-12 w-12 bi bi-heart-fill ${isLiked ? 'text-[#CD5D5D]' : 'text-gray-500'}`} viewBox="0 0 18 18">
                                            <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
                                        </svg>
                                        <span className="absolute bottom-0 right-0 text-sm text-black dark:text-white">{likeCount}</span>
                                    </div>
                                </div>

                                <Komentar id={id} slug={slug}/>
                            </div>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </Layout>
    );
};

export default ShowUser;

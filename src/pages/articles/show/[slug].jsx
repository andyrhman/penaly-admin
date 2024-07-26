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

const ShowUser = () => {
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [deskripsi_kecil, setDeskripsiKecil] = useState('');
    const [deskripsi_panjang, setDeskripsiPanjang] = useState('');
    const [estimasi_membaca, setEstimasiMembaca] = useState('');
    const [gambar, setGambar] = useState('');
    const [tag_id, setTagId] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        if (slug) {
            (
                async () => {
                    try {
                        const { data } = await axios.get(`articles/${slug}`);
                        setId(data.id);
                        setTitle(data.title);
                        setDeskripsiKecil(data.deskripsi_kecil);
                        setDeskripsiPanjang(data.deskripsi_panjang);
                        setEstimasiMembaca(data.estimasi_membaca)
                        setGambar(data.gambar);
                        setTagId(data.tag);

                        const likeStatus = await axios.get(`articles/like/${data.id}`);
                        setIsLiked(likeStatus.data.message === "True");
                    } catch (error) {
                        if (error.response && [401, 403].includes(error.response.status)) {
                            router.push('/login');
                        }
                    }
                }
            )();
        }
    }, [router, slug]);

    const handleLike = async () => {
        try {
            if (isLiked) {
                await axios.put(`articles/dislike/${id}`);
                setIsLiked(false);
            } else {
                await axios.put(`articles/like/${id}`);
                setIsLiked(true);
            }
        } catch (error) {
            console.error('Failed to like the article', error);
        }
    };

    const pageTitle = `Detail ${sanitizeHtml(title)} | ${process.env.siteTitle}`;

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
                                    <h3 className="font-medium text-black dark:text-white">
                                        {deskripsi_panjang}
                                    </h3>
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

export default ShowUser;

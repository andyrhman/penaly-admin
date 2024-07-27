import { useEffect, useState } from "react";
import axios from "axios";
import ButtonSpinner from './common/ButtonSpinner';
import Image from "next/image";
import FormatDate from "../services/format-time";
import { useRouter } from 'next/router';
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Komentar = ({ id, slug }) => {
    const [komentar, setKomentar] = useState('');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (id) {
            (
                async () => {
                    try {
                        const { data } = await axios.get(`comments/${id}`);
                        setComments(data);
                    } catch (error) {
                        if (error.response && [401, 403].includes(error.response.status)) {
                            router.push('/login');
                        }
                    }
                }
            )();
        }
    }, [id]);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post(`comments/${id}`, {
                komentar
            });

            if (data) {
                toast.success('Komentar terkirim!', {
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
                window.location.reload();
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

    const toggleLike = async (commentId, liked) => {
        try {
            if (liked) {
                await axios.post(`comments/dislike/${commentId}`);
            } else {
                await axios.post(`comments/like/${commentId}`);
            }
            setComments(comments.map(comment => {
                if (comment.id === commentId) {
                    const newLikeStatus = !liked;
                    return {
                        ...comment,
                        komentarLike: newLikeStatus ? [{ ...comment.komentarLike[0], likes: 1 }] : [],
                        komentarLikeCount: newLikeStatus ? comment.komentarLikeCount + 1 : comment.komentarLikeCount - 1
                    };
                }
                return comment;
            }));
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const [replyCommentId, setReplyCommentId] = useState(null);
    const [replyContent, setReplyContent] = useState('');

    const toggleReply = (commentId) => {
        setReplyCommentId(replyCommentId === commentId ? null : commentId);
        setReplyContent('');
    };

    const submitReply = async (e, commentId) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post('balaskomentar', {
                komentar_id: commentId,
                reply: replyContent
            });
            setComments(comments.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        balasKomentar: comment.balasKomentar ? [...comment.balasKomentar, data] : [data]
                    };
                }
                return comment;
            }));
            setReplyCommentId(null);
            window.location.reload();

        } catch (error) {
            console.error('Error submitting reply:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const [replyingTo, setReplyingTo] = useState({});

    const toggleReplyComment = (commentId, username = '') => {
        setReplyingTo(prevState => ({
            ...prevState,
            [commentId]: prevState[commentId] ? '' : username
        }));
    };

    const handleReplyChange = (e, commentId) => {
        setReplyContent(e.target.value);
    };

    const handleReplySubmit = async (e, commentId) => {
        e.preventDefault();

        try {
            const username = replyingTo[commentId];
            const replyContentWithUsername = `@${username} ${replyContent}`;

            await axios.post('balaskomentar', {
                komentar_id: commentId,
                reply: replyContentWithUsername
            });
            window.location.reload();

            // handle the response and update the state to show the new reply
        } catch (error) {
            console.error('Error submitting reply:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        } finally {
            toggleReply(commentId);
            setReplyContent('');
        }
    };

    // const [commentList, setCommentList] = useState(comments);

    const toggleLikeReply = async (commentId, isLiked) => {
        try {
            const response = await axios.post(isLiked ? 'komentar/dislike/balas' : 'komentar/like/balas', {
                komentar_id: commentId
            });

            const updatedComments = comments.map(comment => {
                if (comment.balasKomentar) {
                    comment.balasKomentar = comment.balasKomentar.map(reply => {
                        if (reply.id === commentId) {
                            return {
                                ...reply,
                                komentarBalasLike: isLiked ? [] : [{ id: commentId, user_id: 'current_user_id' }],
                                komentarBalasLikeCount: isLiked ? reply.komentarBalasLikeCount - 1 : reply.komentarBalasLikeCount + 1
                            };
                        }
                        return reply;
                    });
                }
                return comment;
            });

            setComments(updatedComments);
        } catch (error) {
            console.error(error.response);
        }
    };
    return (
        <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Diskusi (20)</h2>
                </div>
                <form className="mb-6">
                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <label htmlFor="comment" className="sr-only">Komentar Anda</label>
                        <textarea
                            onChange={(e) => setKomentar(e.target.value)}
                            id="comment"
                            rows="6"
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                            placeholder="Tulis komentar anda..."
                            required
                        >
                        </textarea>
                        {error && <div className="text-[#B45454] text-xs mt-1">{error}</div>}
                    </div>
                    <button onClick={submit}
                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                        {loading ? <ButtonSpinner /> : "Kirim Komentar"}
                    </button>
                </form>

                {comments.map((c, index) => (
                    <div key={index}>
                        <article className="p-6 mb-3 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                            <footer className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                        <Image
                                            className="mr-2 w-6 h-6 rounded-full"
                                            width={6}
                                            height={6}
                                            src={c.user.foto}
                                            alt="Bonnie Green" />
                                        {c.user.namaLengkap}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400"><span><FormatDate timestamp={c.dibuat_pada} /></span></p>
                                </div>
                                {/* Delete Comment */}
                                <button
                                    type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-[#B45454] w-5 h-5 bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                    </svg>
                                </button>

                            </footer>
                            <p className="text-gray-500 dark:text-gray-400">
                                {c.komentar}
                            </p>
                            <div className="flex items-center mt-4 space-x-4">
                                <button
                                    type="button"
                                    className={`flex items-center text-sm ${c.komentarLike.length > 0 ? 'text-[#CD5D5D]' : 'text-gray-500'} hover:underline dark:text-gray-400 font-medium`}
                                    onClick={() => toggleLike(c.id, c.komentarLike.length > 0)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="mr-1.5 w-3.5 h-3.5 bi bi-heart" viewBox="0 0 20 18">
                                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                    </svg>
                                    {c.komentarLike.length > 0 ? 'Disukai' : 'Suka'} ({c.komentarLikeCount})
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
                                    onClick={() => toggleReply(c.id)}
                                >
                                    <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                                    </svg>
                                    Balas
                                </button>
                            </div>
                            {replyCommentId === c.id && (
                                <form onSubmit={(e) => submitReply(e, c.id)} className="mt-4">
                                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                        <label htmlFor="reply" className="sr-only">Balasan Anda</label>
                                        <textarea
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            id="reply"
                                            rows="3"
                                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                            placeholder="Tulis balasan anda..."
                                            value={replyContent}
                                            required
                                        />
                                        {error && <div className="text-[#B45454] text-xs mt-1">{error}</div>}
                                    </div>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                                    >
                                        {loading ? <ButtonSpinner /> : "Kirim Balasan"}
                                    </button>
                                </form>
                            )}
                        </article>
                        {c.balasKomentar && c.balasKomentar.map((reply, replyIndex) => (
                            <article key={replyIndex} className="p-6 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900">
                                <footer className="flex justify-between items-center mb-2">
                                    <div className="flex items-center">
                                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                            <Image className="mr-2 w-6 h-6 rounded-full" width={6} height={6} src={reply.user.foto} alt="User" />
                                            {reply.user.namaLengkap}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span><FormatDate timestamp={reply.dibuat_pada} /></span>
                                        </p>
                                    </div>
                                    {/* Delete Comment */}
                                    <button
                                        type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-[#B45454] w-5 h-5 bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                        </svg>
                                    </button>
                                </footer>
                                <p className="text-gray-500 dark:text-gray-400">{reply.reply}</p>
                                <div className="flex items-center mt-4 space-x-4">
                                    <button
                                        type="button"
                                        className={`flex items-center text-sm ${reply.komentarBalasLike.length > 0 ? 'text-[#CD5D5D]' : 'text-gray-500'} hover:underline dark:text-gray-400 font-medium`}
                                        onClick={() => toggleLikeReply(reply.id, reply.komentarBalasLike.length > 0)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="mr-1.5 w-3.5 h-3.5 bi bi-heart" viewBox="0 0 20 18">
                                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                        </svg>
                                        {reply.komentarBalasLike.length > 0 ? 'Disukai' : 'Suka'} ({reply.komentarBalasLikeCount})
                                    </button>
                                    <button
                                        type="button"
                                        className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
                                        onClick={() => toggleReplyComment(reply.komentar_id, reply.user.namaLengkap)}
                                    >
                                        <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                                        </svg>
                                        Balas
                                    </button>
                                </div>
                                {replyingTo[reply.komentar_id] && (
                                    <form className="mt-4" onSubmit={(e) => handleReplySubmit(e, reply.komentar_id)}>
                                        <textarea
                                            onChange={(e) => handleReplyChange(e, reply.komentar_id)}
                                            value={replyContent}
                                            placeholder={`@${replyingTo[reply.komentar_id]} `}
                                            className="w-full p-2 border rounded"
                                        />
                                        <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">Kirim</button>
                                    </form>
                                )}
                            </article>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Komentar;
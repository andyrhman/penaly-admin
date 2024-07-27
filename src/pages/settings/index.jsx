import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import SEO from "../../components/SEO";
import Layout from '../../components/Layout';
import ImageUploadUser from "../../components/Uploads/ImageUploadUser";
import ButtonSpinner from "../../components/common/ButtonSpinner";
import UpdateError from "../../components/Alerts/UpdateError";
import { useRouter } from "next/router";
import { Slide, toast } from 'react-toastify';
import { connect } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';

const Settings = ({ user }) => {
  const pageTitle = `Informasi Pengguna | ${process.env.siteTitle}`;
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [strength, setStrength] = useState(0);
  const router = useRouter();

  useEffect(() => {
    (
      async () => {
        try {
          setName(user.namaLengkap);
          setImage(user.foto)
          setUsername(user.username);
          setEmail(user.email);
        } catch (error) {
          if (error.response && [401, 403].includes(error.response.status)) {
            router.push('/login');
          }
        }
      }
    )()
  }, [router, user]);


  const ref = useRef(null);
  const updateImage = (url) => {
    if (ref.current) {
      ref.current.value = url;
    }
    setImage(url);
  }

  const submitInfo = async (e) => {
    setLoading(true);
    e.preventDefault()
    try {
      await axios.put('user/info', {
        namaLengkap: name,
        username,
        email,
        foto: image
      });
      sessionStorage.setItem('updateSuccess', '1');
      window.location.reload();
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

  const submitPassword = async (e) => {
    setLoading(true);
    e.preventDefault()
    try {
      await axios.put('user/password', {
        password,
        password_confirm: confirmPassword
      });
      sessionStorage.setItem('updateSuccess', '1');
      window.location.reload();
    } catch (error) {
      console.error(error.response);
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessage = error.response.data.message;
        setError(errorMessage);
        if (errorMessage.includes('Password')) {
          setPasswordError(errorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  function checkPasswordStrength(password) {
    let strength = 0;
    if (password.match(/[a-z]/)) strength++; // lower case letter
    if (password.match(/[A-Z]/)) strength++; // upper case letter
    if (password.match(/[0-9]/)) strength++; // number
    if (password.match(/[^a-zA-Z0-9]/)) strength++; // special character
    if (password.length >= 6) strength++; // length 8 or more
    return strength;
  }

  const validatePassword = (value) => {
    setPassword(value);
    setPasswordError('');
    const strength = checkPasswordStrength(value);
    setStrength(strength);

    if (!value) {
      setPasswordError('Password harus diisi');
    } else if (value.length < 6) {
      setPasswordError('Password harus memiliki 6 huruf maksimal');
    }
  };
  const validateConfirmPassword = (value) => {
    setConfirmPassword(value);
    setConfirmPasswordError('');

    if (!value) {
      setConfirmPasswordError('Konfirmasi Password harus diisi');
    } else if (value !== password) {
      setConfirmPasswordError('Password tidak sama');
    }
  };

  const strengthBarColor = () => {
    switch (strength) {
      case 1: return 'red';
      case 2: return 'orange';
      case 3: return 'yellow';
      case 4: return 'lime';
      case 5: return 'green';
      default: return 'gray';
    }
  }

  const strengthText = () => {
    switch (strength) {
      case 1: return 'Terlalu Pendek';
      case 2: return 'Lemah';
      case 3: return 'Okay';
      case 4: return 'Bagus';
      case 5: return 'Kuat';
      default: return '';
    }
  }

  useEffect(() => {
    const updateSuccess = sessionStorage.getItem('updateSuccess');
    if (updateSuccess === '1') {
      toast.success('Informasi berhasil diupdate!', {
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
      sessionStorage.removeItem('updateSuccess');
    }
  }, []);
  return (
    <Layout>
      <DefaultLayout>
        <SEO title={pageTitle} />
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Pengaturan" />

          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-5 xl:col-span-3">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Informasi Pengguna
                  </h3>
                </div>
                <div className="p-7">
                  <form>
                    <div className="mt-2 relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                      <div className="relative drop-shadow-2">
                        <Image
                          src={image}
                          width={160}
                          height={160}
                          style={{
                            width: "auto",
                            height: "auto",
                          }}
                          alt={name}
                        />
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
                          <ImageUploadUser uploaded={updateImage} />
                        </label>
                      </div>
                    </div>

                    <UpdateError error={error} />

                    <div className="mb-5.5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-person" viewBox="0 0 22 22">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                          </svg>
                        </span>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="fullName"
                          id="fullName"
                        />
                      </div>
                    </div>

                    <div className="mb-5.5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="emailAddress"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                                fill=""
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          name="emailAddress"
                          id="emailAddress"
                        />
                      </div>
                    </div>

                    <div className="mb-5.5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="username"
                      >
                        Username
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-vcard" viewBox="0 0 20 20">
                            <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8m1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5" />
                            <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96q.04-.245.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 1 1 12z" />
                          </svg>
                        </span>
                        <input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="username"
                          id="username"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4.5">
                      <button
                        onClick={submitInfo}
                        className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                        type="submit"
                      >
                        {loading ? <ButtonSpinner /> : "Update"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-span-5 xl:col-span-2">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Ganti Password
                  </h3>
                </div>
                <div className="p-7">
                  <form action="#">
                    <div className="mb-5.5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="Username"
                      >
                        Password
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Masukkan Password"
                        onChange={(e) => validatePassword(e.target.value)}
                      />
                      <div style={{
                        fontSize: '12px',
                        textAlign: 'right',
                        color: strengthBarColor(),
                      }}>
                        {strengthText()}
                      </div>
                      <div style={{
                        height: '10px',
                        width: `${strength * 20}%`,
                        backgroundColor: strengthBarColor(),
                        transition: 'width 0.3s ease-in-out',
                      }} />
                      {passwordError && <div className="text-[#B45454] text-xs mt-1">{passwordError}</div>}
                    </div>
                    <div className="mb-5.5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="Username"
                      >
                        Konfirmasi Password
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="password"
                        name="password_confirm"
                        id="password_confirm"
                        placeholder="Masukkan Konfimasi Password"
                        onChange={(e) => validateConfirmPassword(e.target.value)}
                      />
                      {confirmPasswordError && <div className="text-[#B45454] text-xs mt-1">{confirmPasswordError}</div>}
                    </div>
                    <div className="flex justify-end gap-4.5">
                      <button
                        onClick={submitPassword}
                        className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                        type="submit"
                      >
                        {loading ? <ButtonSpinner /> : "Update"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </Layout>
  );
};

export default connect(
  (state) => {
    return {
      user: state.user.user
    }
  }
)(Settings);  

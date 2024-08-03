"use client";
import React, { useState, useEffect } from "react";

const SelectTag = ({ nama_tag, tags, onChange }) => {
    const [selectedOption, setSelectedOption] = useState("");

    useEffect(() => {
        setSelectedOption(nama_tag);
    }, [nama_tag]);

    const [isOptionSelected, setIsOptionSelected] = useState(false);

    const changeTextColor = () => {
        setIsOptionSelected(true);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value);
        changeTextColor();
        onChange(value); // Call the parent callback
    };

    return (
        <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Pilih Tag
            </label>

            <div className="relative z-20 bg-white dark:bg-form-input">
                <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tags" viewBox="0 0 16 16">
                        <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z" />
                        <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z" />
                    </svg>
                </span>

                <select
                    value={selectedOption}
                    onChange={handleChange}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${isOptionSelected ? "text-black dark:text-white" : ""}`}
                >
                    <option value="" disabled className="text-body dark:text-bodydark">
                        Pilih Tag
                    </option>
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
    );
};

export default SelectTag;
"use client";
import React, { useState, useEffect } from "react";

const SelectRole = ({ nama_role, roles, onChange }) => {
    const [selectedOption, setSelectedOption] = useState("");

    useEffect(() => {
        setSelectedOption(nama_role);
    }, [nama_role]);

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
                Pilih Peran
            </label>

            <div className="relative z-20 bg-white dark:bg-form-input">
                <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-lock" viewBox="0 0 16 16">
                        <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 5.996V14H3s-1 0-1-1 1-4 6-4q.845.002 1.544.107a4.5 4.5 0 0 0-.803.918A11 11 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664zM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1" />
                    </svg>
                </span>

                <select
                    value={selectedOption}
                    onChange={handleChange}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${isOptionSelected ? "text-black dark:text-white" : ""}`}
                >
                    <option value="" disabled className="text-body dark:text-bodydark">
                        Pilih Peran
                    </option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id} className="text-body dark:text-bodydark">
                            {role.nama}
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

export default SelectRole;

"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const UserChart = () => {
  const [series, setSeries] = useState([{ name: "User Registrations", data: [] }]);
  const [categories, setCategories] = useState([]);
  const [time, setTime] = useState("day");

  const options = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#3056D3", "#80CAEE"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
    },
  };

  const fetchData = async (time) => {
    try {
      const response = await axios.get(`admin/user-chart?time=${time}`);
      const data = response.data;

      const dates = data.map(item => item.date);
      const counts = data.map(item => parseInt(item.count, 10));

      setCategories(dates);
      setSeries([{ name: "Total Registrasi", data: counts }]);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData(time);
  }, [time]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Registrasi</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button
              className={`rounded px-3 py-1 text-xs font-medium text-black ${time === 'day' ? 'bg-white shadow-card' : 'hover:bg-white hover:shadow-card'} dark:text-white dark:hover:bg-boxdark`}
              onClick={() => setTime('day')}
            >
              Hari
            </button>
            <button
              className={`rounded px-3 py-1 text-xs font-medium text-black ${time === 'week' ? 'bg-white shadow-card' : 'hover:bg-white hover:shadow-card'} dark:text-white dark:hover:bg-boxdark`}
              onClick={() => setTime('week')}
            >
              Minggu
            </button>
            <button
              className={`rounded px-3 py-1 text-xs font-medium text-black ${time === 'month' ? 'bg-white shadow-card' : 'hover:bg-white hover:shadow-card'} dark:text-white dark:hover:bg-boxdark`}
              onClick={() => setTime('month')}
            >
              Bulan
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default UserChart;

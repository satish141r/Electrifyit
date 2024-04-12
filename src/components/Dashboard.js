import React from 'react'
import { useState, useEffect } from 'react';
// import { data } from '../data'; 
const Dashboard = () => {
    const [reportType, setReportType] = useState('Total Miles Driven');
    const [frequency, setFrequency] = useState('Daily');
    const [timeFrame, setTimeFrame] = useState({ startDate: null, endDate: null });
    const [reportData, setReportData] = useState([]);
    const [milesData, setMilesData] = useState({});
    const [data, setData] = useState([]);


    const calculateTotalMiles = (startDate, endDate) => {
        let totalMiles = 0;
        for (let item of data) {
            const itemDate = new Date(item.Date);
            if (itemDate >= new Date(startDate) && itemDate <= new Date(endDate)) {
                totalMiles += parseInt(item.Miles_Driven);
            }
        }
        return totalMiles;
    };


    const calculateMilesData = (startDate, endDate) => {
        let totalMiles = 0;
        let maxMiles = -Infinity;
        let minMiles = Infinity;
        let maxDate = null;
        let minDate = null;

        for (let item of data) {
            const itemDate = new Date(item.Date);
            if (itemDate >= new Date(startDate) && itemDate <= new Date(endDate)) {
                const miles = parseInt(item.Miles_Driven);
                totalMiles += miles;
                if (miles > maxMiles) {
                    maxMiles = miles;
                    maxDate = item.Date;
                }
                if (miles < minMiles) {
                    minMiles = miles;
                    minDate = item.Date;
                }
            }
        }

        return { totalMiles, maxMiles, maxDate, minMiles, minDate };
    };


    const groupDataByFrequency = (frequency, startDate, endDate) => {
        const groupedData = [];
        let currentDate = new Date(startDate);
        let endDateForGrouping = new Date(endDate);

        while (currentDate <= endDateForGrouping) {
            let nextDate = new Date(currentDate);

            if (frequency === 'Daily') {

                nextDate.setDate(nextDate.getDate() + 1);
            } else if (frequency === 'Weekly') {
                nextDate.setDate(nextDate.getDate() + 7);
            } else if (frequency === 'Monthly') {
                nextDate.setMonth(nextDate.getMonth() + 1);
                nextDate.setDate(1);
            } else if (frequency === 'Yearly') {
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                nextDate.setMonth(0);
                nextDate.setDate(1);
            }

            nextDate.setDate(nextDate.getDate() - 1);


            let totalMiles = 0;
            for (let item of data) {
                const itemDate = new Date(item.Date);
                if (itemDate >= currentDate && itemDate <= nextDate) {
                    totalMiles += parseInt(item.Miles_Driven);
                }
            }
            groupedData.push({
                startDate: currentDate.toISOString().slice(0, 10),
                endDate: nextDate.toISOString().slice(0, 10),
                totalMiles: totalMiles
            });


            currentDate = new Date(nextDate);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return groupedData;
    };



    const handleReportTypeChange = (event) => {
        setReportType(event.target.value);
    };


    const handleFrequencyChange = (e) => {
        console.log(e.target.value);

        setFrequency(e.target.value);

    };

    const handleTimeFrameChange = (startDate, endDate) => {
        setTimeFrame({ startDate, endDate });
    };
    useEffect(() => {
        fetch('https://electrifyit.onrender.com/vehicles')
            .then((res) => {
                return res.json();
            })
            .then((final) => {
                console.log(final);
                setData(final);
            });
    }, [])

    useEffect(() => {

        const { startDate, endDate } = timeFrame;
        let newData = [];
        let milesData = {};

        if (startDate && endDate) {
            const formattedStartDate = new Date(startDate);
            const formattedEndDate = new Date(endDate);

            if (frequency === 'Daily') {
                console.log("first")
                newData = data.filter(item => {
                    const itemDate = new Date(item.Date);
                    return itemDate >= formattedStartDate && itemDate <= formattedEndDate;
                });
            } else {
                console.log("montly")
                newData = groupDataByFrequency(frequency, formattedStartDate, formattedEndDate);
            }
            milesData = calculateMilesData(formattedStartDate, formattedEndDate);
        }

        setReportData(newData);
        setMilesData(milesData);
    }, [frequency, timeFrame]);


    return (
        <div className="App min-h-screen flex flex-col justify-between md:ml-[280px]">

            <div className="container mx-auto px-4">
                <h2 className="text-xl font-bold text-center mt-5">Reports Dashboard</h2>
                <div className="flex flex-wrap gap-4 justify-center items-end mt-5">
                    <label className="flex flex-col">Report Type:
                        <select className="mt-1 p-2 border rounded" value={reportType} onChange={handleReportTypeChange}>
                            <option value="Total Miles Driven">Total Miles Driven</option>

                        </select>
                    </label>
                    <label className="flex flex-col">Frequency:
                        <select className="mt-1 p-2 border rounded" value={frequency} onChange={handleFrequencyChange}>
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Yearly">Yearly</option>
                        </select>
                    </label>
                    <div className="flex gap-4">
                        Start Date: <input className="p-1 border rounded" type="date" onChange={(e) => setTimeFrame({ ...timeFrame, startDate: e.target.value })} />
                        End Date: <input className="p-1 border rounded" type="date" onChange={(e) => setTimeFrame({ ...timeFrame, endDate: e.target.value })} />
                    </div>
                </div>
                {reportType === 'Total Miles Driven' && (
                    <div className="mt-5 p-4 shadow-lg rounded">
                        <h3 className="text-lg font-semibold">Total Miles Driven</h3>
                        <p>Total Miles: {milesData.totalMiles}</p>
                        <p>Maximum Miles Driven: {milesData.maxMiles} (Date: {new Date(milesData.maxDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        })})</p>
                        <p>Minimum Miles Driven: {milesData.minMiles} (Date: {new Date(milesData.minDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        })})</p>
                    </div>
                )}

            </div>
            <div className="container mx-auto px-4">
                <div className="overflow-x-auto">
                    {frequency === 'Daily' ? (
                        <table className="table-auto w-full text-left whitespace-no-wrap">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Miles Driven</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="px-4 py-2">{new Date(item.Date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })}</td>
                                        <td className="px-4 py-2">{item.Miles_Driven}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (<table className="table-auto w-full text-left whitespace-no-wrap">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2">Start Date</th>
                                <th className="px-4 py-2">End Date</th>
                                <th className="px-4 py-2">Total Miles</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((item, index) => (
                                <tr key={index} className="border-b">
                                    <td className="px-4 py-2">{item.startDate}</td>
                                    <td className="px-4 py-2">{item.endDate}</td>
                                    <td className="px-4 py-2">{item.totalMiles}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>

            <div className="py-4 bg-gray-100 mt-5">
                <p className="text-center text-sm">© 2024 ElectrifyIt. All rights reserved.</p>
            </div>
        </div>

    )
}

export default Dashboard

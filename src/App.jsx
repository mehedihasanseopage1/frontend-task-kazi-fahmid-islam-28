import React, { useEffect, useState } from 'react'
import { IoIosSettings } from "react-icons/io";
import { FaHourglassHalf } from "react-icons/fa6";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LiaArrowUpSolid } from "react-icons/lia";
export const App = () => {
  // 
  const [dataJson, setDataJson] = useState(null);
  console.log(dataJson)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items to display per page

  const [isOpenSetting, setIsOpenSetting] = useState(false)
  const chunkSize = 25;
  const leadsChunks = [];
  if (dataJson && dataJson.data) {
    for (let i = 0; i < dataJson.data.length; i += chunkSize) {
      leadsChunks.push(dataJson.data.slice(i, i + chunkSize));
    }
  }

  const chartData = leadsChunks.map((chunk, index) => {
    const status1Count = chunk.filter(item => item.deal_status === 1).length;
    return {
      name: `${index * chunkSize + 1}-${(index + 1) * chunkSize}`,
      pv: status1Count
    };
  });

  console.log(chartData)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from an API or any other source
        const response = await fetch('https://erp.seopage1.net/api/leads');
        const fetchedData = await response.json();

        // Set the fetched data in the state
        setDataJson(fetchedData);
      } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the function to fetch data
  }, []);


  const formatBiddingTime = (minutes, seconds) => {
    const totalSeconds = minutes * 60 + seconds;
    const formattedMinutes = Math.floor(totalSeconds / 60);
    const formattedSeconds = totalSeconds % 60;
    return `${formattedMinutes}m ${formattedSeconds}s`;
  };


  const pageNumbers = [];
  if (dataJson?.data) {
    for (let i = 1; i <= Math.ceil(dataJson.data.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
  }
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataJson?.data?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [showName, setShowName] = useState(true);
  const [showProjectLink, setShowProjectLink] = useState(true);


  const [showProjectId, setShowProjectId] = useState(true);


  const [showProjectBudget, setShowProjectBudget] = useState(true);

  const [showBidValue, setShowBidValue] = useState(true);

  const [showCreated, setShowCreated] = useState(true);

  const [showCreatedBy, setShowCreatedBy] = useState(true);
  const [showBiddingDelayTime, setShowBiddingDelayTime] = useState(true);
  const [showStatus, setShowStatus] = useState(true);

  const [showDealStatus, setShowDealStatus] = useState(true);
  // ... other checkbox state variables ...
  const [selectAll, setSelectAll] = useState(false);
  // State variable for the filtered data to be displayed
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // When data changes, filter the data based on checkbox selections
    if (dataJson) {
      const filtered = dataJson.data.filter((item) => {
        // Implement your checkbox filtering logic here
        // For example, if 'showName' checkbox is checked, include 'client_name' data
        return (
          (!showName || item.client_name) &&
          (!showProjectLink || item.project_link) &&
          (!showProjectId || item.project_id) &&
          (!showProjectBudget || item.value) &&
          (!showBidValue || item.bid_value) &&
          (!showCreated || item.deadline) &&
          (!showCreatedBy || item.client_email) &&
          (!showBiddingDelayTime || formatBiddingTime(item.bidding_minutes, item.bidding_seconds)) &&
          (!showStatus || item.status_id) &&
          (!showDealStatus || item.deal_status)
          // Add similar conditions for other checkboxes
        );
      });
      setFilteredData(filtered);
    }
  }, [dataJson, showName, showProjectLink, showProjectId,
    showProjectBudget,
    showBidValue,
    showCreated,
    showCreatedBy,
    showBiddingDelayTime,
    showStatus,
    showDealStatus]);
  const handleSelectAll = (event) => {
    const { checked } = event.target;
    setSelectAll(checked);

    // Set all other checkbox states based on the "Select All" checkbox
    setShowName(checked)
    setShowProjectLink(checked)
    setShowProjectId(checked)
    setShowProjectBudget(checked)
    setShowBidValue(checked)
    setShowCreated(checked)
    setShowCreatedBy(checked)
    setShowBiddingDelayTime(checked)
    setShowStatus(checked)
    setShowDealStatus(checked)
    // ... set other checkbox states based on the "Select All" checkbox ...
  };

  const initialColumns = [
    { id: 'name', label: 'Name' },
    { id: 'projectLink', label: 'Project Link' },
    // ...other columns
  ];

  const [columns, setColumns] = useState(initialColumns);

  const handleDragStart = (e, columnIndex) => {
    e.dataTransfer.setData('columnIndex', columnIndex);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    const draggedColumnIndex = e.dataTransfer.getData('columnIndex');
    const draggedColumn = columns[draggedColumnIndex];

    // Create a new array with the dragged column moved to the target index
    const newColumns = columns.filter((_, index) => index !== draggedColumnIndex);
    newColumns.splice(targetIndex, 0, draggedColumn);

    setColumns(newColumns);
  };
  const MAX_BUTTONS = 5;
  return (
    <>
      <div className=' bg-white p-5  mt-5' >
        <div className='flex justify-between items-center relative '>
          {/*  */}
          <div className='flex justify-start items-center gap-3'>
            <div className='flex justify-start items-center gap-2'>
              <button className="btn bg-blue-500 text-white px-8 rounded-md">Task</button>
              <button className="btn bg-white border text-gray-400 px-8 rounded-md">Sub Task</button>
            </div>
            <div className='flex justify-start items-center gap-2'>
              <div className="   bg-blue-500 rounded-sm text-white  py-1 px-2 flex justify-start items-center gap-3" > <FaHourglassHalf className='text-white' />Primary Page [Need Authorization] <span className='px-2 ms-1 font-semibold bg-white  rounded-sm text-black'>{dataJson?.data.length}</span></div>
              <div className="   bg-blue-500  rounded-sm text-white py-1 px-2 flex justify-start items-center gap-3" > <FaHourglassHalf className='text-white' />Tasks [Need Authorization] <span className='px-2 ms-1 font-semibold bg-white  rounded-sm text-black'>12</span></div>
            </div>
          </div>
          <div className='flex justify-end items-center ms-4  gap-2' >
            <button className="btn bg-blue-500 text-white px-6 rounded-md">Refresh</button>
            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            <button className="btn bg-white border text-gray-400 px-3 rounded-md" onClick={() => setIsOpenSetting(!isOpenSetting)}><IoIosSettings className='text-2xl text-black' /></button>



            {isOpenSetting && <div className='bg-white shadow-md absolute w-80 rounded-md px-3 top-8 z-50 py-3'>
              <div>
                <div className='flex justify-start items-center gap-3'>
                  <input onChange={handleSelectAll}
                    checked={selectAll} type="checkbox" />
                  <h6>Select  All</h6>

                </div>
              </div>





              <div className="mt-4">
                <div className='flex justify-start items-center gap-3'>
                  <input
                    type="checkbox"
                    onChange={() => setShowName(!showName)}
                    checked={showName}
                  />
                  <h6>Project Name</h6>

                </div>
              </div>


              <div className="mt-4">
                <div className='flex justify-start items-center gap-3'>
                  <input type="checkbox" onChange={() => setShowProjectLink(!showProjectLink)}
                    checked={showProjectLink} />
                  <h6>Project Link</h6>

                </div>
              </div>


              <div className="mt-4">
                <div className='flex justify-start items-center gap-3'>
                  <input type="checkbox" onChange={() => setShowProjectId(!showProjectId)}
                    checked={showProjectId} />
                  <h6>Project Id</h6>

                </div>
              </div>

              <div className="mt-4">
                <div className='flex justify-start items-center gap-3'>
                  <input type="checkbox" onChange={() => setShowProjectBudget(!showProjectBudget)}
                    checked={showProjectBudget} />
                  <h6>Project Budget</h6>

                </div>
              </div>

              <div className="mt-4">
                <div className='flex justify-start items-center gap-3'>
                  <input type="checkbox" onChange={() => setShowBidValue(!showBidValue)}
                    checked={showBidValue} />
                  <h6>Bid Value</h6>

                </div>
              </div>


              <div className="mt-4">
                <div className='flex justify-start items-center gap-3'>
                  <input type="checkbox" onChange={() => setShowCreated(!showCreated)}
                    checked={showCreated} />
                  <h6>Created</h6>

                </div>
              </div>
              <div className="mt-4">
                <div className='flex justify-start items-center gap-3'>
                  <input type="checkbox" onChange={() => setShowCreatedBy(!showCreatedBy)}
                    checked={showCreatedBy} />
                  <h6>Created By</h6>

                </div>
              </div>

              <div className="mt-4">
                <div className='flex justify-start items-center gap-3'>
                  <input type="checkbox" onChange={() => setShowBiddingDelayTime(!showBiddingDelayTime)}
                    checked={showBiddingDelayTime} />
                  <h6>Bidding Delay Time</h6>

                </div>
              </div>


              <div className="mt-4">
                <div className='flex justify-start items-center gap-3'>
                  <input type="checkbox" onChange={() => setShowStatus(!showStatus)}
                    checked={showStatus} />
                  <h6>Status</h6>

                </div>
              </div>

              <div className="mt-4">
                <div className='flex justify-start items-center gap-3'>
                  <input type="checkbox" onChange={() => setShowDealStatus(!showDealStatus)}
                    checked={showDealStatus} />
                  <h6>Deal Status</h6>

                </div>
              </div>






















            </div>}
          </div>
        </div>


        {/* table areas start */}
        <div className="overflow-x-auto mt-6 ">
          <table className="table table-xs">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                {showName && <th className='text-grey-500 flex justify-between items-center'>Name </th>}
                {showProjectLink && <th className='text-grey-500'>Project Link  </th>}
                {showProjectId && <th className='text-grey-500'>Project Id</th>}
                {showProjectBudget && <th className='text-grey-500'>Project Budget</th>}
                {showBidValue && <th className='text-grey-500'>Bid Value</th>}
                {showCreated && <th className='text-grey-500'>Created</th>}
                {showCreatedBy && <th className='text-grey-500'>Created By</th>}
                {showBiddingDelayTime && <th className='text-grey-500'>Bidding Delay Time</th>}
                {showStatus && <th className='text-grey-500'>Status</th>}
                {showDealStatus && <th className='text-grey-500'>Deal Status</th>}
                <th className='text-grey-500'>Action</th>

              </tr>
            </thead>
            <tbody>

              {currentItems?.map((data, index) => {
                return <tr>
                  <td className='flex justify-center items-center gap-2'><input type="checkbox" className='mt-4' /> <span className='mt-4'>{index + 1}</span></td>
                  {showName && <td className='text-grey-500 w-48'>{data?.client_name}</td>}
                  {showProjectLink && <td className='text-grey-500 w-40 '>{data?.project_link}</td>}
                  {showProjectId && <td className='text-grey-500'>{data?.project_id === null ? "N/A" : data?.project_id}</td>}
                  {showProjectBudget && <td className='text-grey-500'>{data?.value}</td>}
                  {showBidValue && <td className='text-grey-500'>{data?.bid_value}</td>}
                  {showCreated && <td className='text-grey-500 w-28'>{data?.deadline}</td>}
                  {showCreatedBy && <td className='text-grey-500'>{data?.client_email === null ? "N/A" : data?.client_email}</td>}
                  {showBiddingDelayTime && <td className='text-grey-500 '>{formatBiddingTime(data.bidding_minutes, data.bidding_seconds)}</td>}
                  {showStatus && <td className='w-44'><span className={`${data?.deal_status === 0 ? "bg-red-500 text-white px-2 py-1 rounded" : "bg-green-400 text-white  px-2 py-1 rounded"}  `}>{data?.deal_status === 0 ? "Not Converted to Deal" : "Conterted to Deal"}</span></td>}
                  {showDealStatus && <td className='text-grey-500 w-44'> <span className={`${data?.deal_status === 0 ? " " : "bg-yellow-400 text-black  px-2 py-1 rounded font-semibold"}  `}>{data?.deal_status === 0 ? "Not Applicable" : "Not Activity Yet"}</span></td>}
                  <td className='text-grey-500'><button className="btn bg-white border">:</button></td>
                </tr>
              })}










            </tbody>

          </table>
        </div>

        {/* table areas end */}

        <div className='mt-6'>
          <div className="pagination flex justify-end items-center gap-5">
            <div className="text-gray-500 text-end">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, dataJson?.data?.length)} out of {dataJson?.data?.length} entries
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn bg-white border text-gray-400 px-8 rounded-md "
              >
                Previous
              </button>
              {pageNumbers.length > MAX_BUTTONS ? (
                <>
                  {pageNumbers.slice(
                    Math.max(0, currentPage - Math.floor(MAX_BUTTONS / 2)),
                    Math.min(pageNumbers.length, currentPage + Math.floor(MAX_BUTTONS / 2))
                  ).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={currentPage === number ? 'btn bg-blue-500 border text-white rounded-md me-3' : 'btn bg-white border text-gray-400 rounded-md me-3'}
                    >
                      {number}
                    </button>
                  ))}
                  {currentPage < pageNumbers.length - Math.floor(MAX_BUTTONS / 2) &&
                    <button
                      className='btn bg-white border text-gray-400 rounded-md '
                    >
                      ...
                    </button>
                  }
                </>
              ) : (
                pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={currentPage === number ? 'btn bg-blue-500 border text-white rounded-md me-3' : 'btn bg-white border text-gray-400 rounded-md me-3'}
                  >
                    {number}
                  </button>
                ))
              )}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastItem >= dataJson?.data?.length}
                className="btn bg-white border text-gray-400 px-8 rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>


      <h2 className='text-center text-5xl mt-28'>Chart Area</h2>

      {/* charts area start  */}

      <BarChart
        data={chartData}
        width={800}
        height={300}
        className='mx-auto'
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis dataKey="pv" />

        <Legend />
        <Bar dataKey="pv" barSize={50} fill="#8884d8" />
      </BarChart>


      <div>

      </div>















      {/* charts area end  */}
    </>
  )
}

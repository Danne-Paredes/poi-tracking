import React, {useState, useEffect, useRef, } from 'react'
import { handleStateUpdate, timeTransformer, dateTimeTransformer } from './functions';
// import { getComponentByName, handleCloseModal, handleStateUpdate, addPoi, getSubmitByName, fetchCurrentPoiList } from './functions';


export const CasinoReportModalViewer = (props) => {
// export const Modal = ({ state, setState, currentPoiList, setCurrentPoiList, selectedCasino }) => {
  const { state, setState } = props
  const {
    openModal = false, // Provide default values if 'state' could be undefined
    filteredPois,
    index,
  } = state || {}; // Default to an empty object if 'state' is nullish
  
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {

    console.log('filteredPois',filteredPois,filteredPois[index])
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleStateUpdate(false,'openModal',setState)
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleStateUpdate(false,'openModal',setState)
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);  
  
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [])

  return (
    <div
      className="justify-center items-start pt-6 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-dark-denim">
      <div ref={modalRef} className="relative w-auto  mx-auto max-w-3xl">
        {/*content*/}
        <div className="border-0 rounded-lg mt-0 items-center shadow-lg relative flex flex-col w-full bg-dark-leather-2 outline-none focus:outline-none">
          {/*header*/}
          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold text-center text-kv-gray" >
              Visits During Time Period
            </h3>
          </div>
          {/*body*/}

          {
            filteredPois[index].visits.map(visit => {
                let total = 0;
                if (visit?.transactions) {
                  visit?.transactions.forEach(transaction => {
                    if (transaction.type === 'Buy In') {
                      total -= parseInt(transaction.amount, 10);
                    } else if (transaction.type === 'Cash Out') {
                      total += parseInt(transaction.amount, 10);
                    }
                  });
                }
                let winLoss
                // Format the total value to include the dollar sign
                if (total < 0) {
                  winLoss = 'Loss'
                } else {
                  winLoss = 'Win'
                }
                return (
                  <div className='text-kv-gray'>
                    <div className='text-center font-bold p-1' onClick={()=>console.log(state)}>{`Arrival: ${dateTimeTransformer(visit.arrival)}`}</div>
                    <div className='text-center font-bold p-1' onClick={()=>console.log(visit)}>{`Departure: ${dateTimeTransformer(visit.departure)}`}</div>
                    <ul className='list-none font-bold'>
                      {visit?.transactions.filter(transaction => transaction.type !== "Note").map((transaction, index) => (
                        <li key={index} className={`group flex items-center justify-between px-4`}>
                            <div className="flex flex-1 justify-center space-x-4">
                                <span className="text-center">{timeTransformer(transaction.date)}</span>
                                <span className="text-center">{transaction.type === 'Buy In' ? `+${transaction.amount}` : `-${transaction.amount}`}</span>
                            </div>
                        </li>
                      ))}
                    </ul>
                    <div className='mt-2 text-kv-gray justify-center text-center items-center text-xl font-bold'>Total: <span className={winLoss == 'Win' ? 'text-blue-500' : 'text-kv-red'}>{total}</span></div>
                    {filteredPois[index].visits.length !== 1 && <div>--------------------------------------------</div>}
                  </div>
                )
            })
          }

          {/*footer*/}
          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
            <button
              className={`btn-close`}
              type="button"
              onClick={ ()=> handleStateUpdate(false,'openModal',setState) }
            >
              Close
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}
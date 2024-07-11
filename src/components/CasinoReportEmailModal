import React, {useState, useEffect, useRef, } from 'react'
import { handleStateUpdate, timeTransformer, dateTimeTransformer } from './functions';
import MultiSelect from './MultiSelect';
// import { getComponentByName, handleCloseModal, handleStateUpdate, addPoi, getSubmitByName, fetchCurrentPoiList } from './functions';


export const CasinoReportEmailModal = (props) => {
// export const Modal = ({ state, setState, currentPoiList, setCurrentPoiList, selectedCasino }) => {
  const { state, setState } = props
  const {
    openEmailModal,
    filteredPois,
    index,
    emails,
    htmlTable,
    filteredVisits=[],
  } = state || {}; // Default to an empty object if 'state' is nullish
  
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const table = (htmlTable)

  const sendEmail = async () => {
    const url = 'https://us-central1-poi-tracking.cloudfunctions.net/sendEmail';
    const emailData = {
      emails,
      htmlTable

    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });
      if (response.ok) {
        console.log('Emails sent successfully');
      } else {
        console.error('Error sending emails:', await response.text());
      }
    } catch (error) {
      console.error('Error sending emails:', error);
    }
  };

  useEffect(() => {

    console.log('filteredPois',filteredPois,filteredPois[index])
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleStateUpdate(false,'openEmailModal',setState)
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleStateUpdate(false,'openEmailModal',setState)
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);  
  
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [])

  const numberOfVisits = filteredVisits?.length;

  const totalBuyIn = filteredVisits?.reduce((sum, visit) => {
    const buyIns = visit.transactions
      .filter(transaction => transaction.type === 'Buy In')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    return sum + buyIns;
  }, 0);

  const totalResults = filteredVisits?.reduce((sum, visit) => {
    const results = visit.transactions.reduce((sum, transaction) => {
      return sum + (transaction.type === 'Cash Out' ? -transaction.amount : transaction.amount);
    }, 0);
    return sum + results;
  }, 0);

  return (
    <div
      className="justify-center items-start pt-6 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-dark-denim">
      <div ref={modalRef} className="relative w-auto  mx-auto max-w-3xl">
        {/*content*/}
        <div className="border-0 rounded-lg mt-0 items-center shadow-lg relative flex flex-col w-full bg-dark-leather-2 outline-none focus:outline-none">
          {/*header*/}
          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t" onClick={()=>console.log(state)}>
            <h3 className="text-3xl font-semibold text-center text-kv-gray" >
              Send Casino Report
            </h3>
          </div>
          {/*body*/}

          <MultiSelect
                      className='pref-input input' 
                      options={emails} 
                      placeholder='Select Active Casinos' 
                      // onChange={(e)=>handleLocationChange(e, setState, selectedPoi)}
                      />

          {/* <div dangerouslySetInnerHTML={{ __html: htmlTable }} /> */}

          {/*footer*/}
          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
            <button
              className={`btn-close`}
              type="button"
              onClick={ ()=> handleStateUpdate(false,'openEmailModal',setState) }
            >
              Close
            </button>
            <button
              className={`btn-gray`}
              type="button"
              onClick={ ()=> handleStateUpdate(false,'openEmailModal',setState) }
            >
              Send Email
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}
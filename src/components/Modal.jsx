import React, {useState, useEffect, useRef, } from 'react'
import { getComponentByName, handleCloseModal, handleStateUpdate, addPoi, getSubmitByName, fetchCurrentPoiList } from './functions';


export const Modal = (props) => {
// export const Modal = ({ state, setState, currentPoiList, setCurrentPoiList, selectedCasino }) => {
  const { state, setState, currentPoiList=[], setCurrentPoiList, selectedCasino } = props
  const {
    openModal = false, // Provide default values if 'state' could be undefined
    selectedVisit = {},
    poi = {},
    sortedVisit = [],
    selectedPoi,
    selectedModal,
    isNew = false, 
    index,
    transactionIndex,
    notesEditMode = false,
    playerInfoEdited ,
  } = state || {}; // Default to an empty object if 'state' is nullish
  
  const inputRef = useRef(null);
  const modalRef = useRef(null);
 
  const generateModalTitle = (selectedModal)=>{
    switch (selectedModal) {
      case 'playerAdd':
        return 'Add New POI Visit';
        break;
      case 'transactionAdd':
        return 'Add Transaction Details'
        break;
      case 'arriveDepart':
        return 'Update Arrival / Departure Time'
        break;
      case 'notesViewer':
        return 'View Past Visits'
        break;
      case 'playerInfo':
        return `${selectedPoi.name}`
        break;
    
      default:
        break;
    }
  }

  const games = [
    'BJ',
    'BC',
    'TCP',
    'UTH',
    'PGP',
    'TL',
  ]

  // useEffect(() => {
  //   console.log('notesEditMode (Parent Component) changed:', notesEditMode);

  // }, [notesEditMode]);

  useEffect(() => {
    // console.log('Modal.jsx')
    fetchCurrentPoiList(selectedCasino, setCurrentPoiList)
    // console.log("state")
    // console.log(state)
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        // handleStateUpdate([],selectedVisit,setState)
        // handleStateUpdate([...poi.visits].sort((a, b) => new Date(b.arrival) - new Date(a.arrival)),sortedVisit, setState)
        handleCloseModal(setState);
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // setSelectedVisit([]);
        // setSortedVisits([...poi.visits].sort((a, b) => new Date(b.arrival) - new Date(a.arrival)))
        handleCloseModal(setState);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);  
  
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [])

  useEffect(() => {
    handleStateUpdate(currentPoiList[index],'selectedPoi', setState)
  }, [currentPoiList])
  

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(selectedModal);
    }
  };
  
  const modalClose = ( setState )=>{
    handleCloseModal(setState)
  }
  const modalProps = {
    state, setState, currentPoiList, setCurrentPoiList, inputRef, handleKeyDown, selectedCasino, modalClose
  }

  const handleSubmit = (selectedModal) => {
    // console.log(selectedModal)
      switch (selectedModal) {
        case 'playerAdd':
          getSubmitByName(selectedModal,state, setState, currentPoiList, setCurrentPoiList, selectedCasino, modalClose)
          break;

        case 'transactionAdd':
          getSubmitByName(selectedModal,state, setState, currentPoiList, setCurrentPoiList, selectedCasino, transactionIndex, modalClose)
          break;

        case 'arriveDepart':
          getSubmitByName(selectedModal,state, setState, currentPoiList, setCurrentPoiList, selectedCasino, modalClose)
          break;
        case 'notesViewer':
          getSubmitByName(selectedModal,state, setState, currentPoiList, setCurrentPoiList, selectedCasino, modalClose)
          break;
      
        case 'playerInfo':
          getSubmitByName(selectedModal,state, setState, currentPoiList, setCurrentPoiList, selectedCasino, modalClose)
          break;
      
        default:
          break;
      }

  }
  return (
    <div
      className="justify-center items-start pt-6 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-dark-denim">
      {/* <div ref={modalRef} className="relative w-auto  mx-auto max-w-3xl"> */}
      <div ref={modalRef} className="relative w-auto  mx-auto max-w-3xl">
        {/*content*/}
        <div className="border-0 rounded-lg mt-0 items-center shadow-lg relative flex flex-col w-full bg-dark-leather-2 outline-none focus:outline-none">
          {/*header*/}
          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold text-center text-kv-gray" onClick={()=>console.log(selectedPoi)}>
              {generateModalTitle(selectedModal)}
            </h3>
          </div>
          {/*body*/}

          {getComponentByName(selectedModal, modalProps)}

          {/*footer*/}
          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
           { selectedModal !== 'playerInfo' && 
              <>
                <button
                    className={`btn-close ${transactionIndex===null? '' :'hidden'}`}
                    type="button"
                    onClick={ ()=>modalClose( setState ) }
                  >
                  Close
                </button>
                <button
                  className={`btn-close ${transactionIndex===null? 'hidden' :''}`}
                  type="button"
                  onClick={ ()=>{
                    const newForm = {
                      
                    }
                    handleStateUpdate(null, 'transactionIndex', setState );
                    handleStateUpdate(newForm, 'transactionDetails', setState );
                    handleStateUpdate(false, 'notesEditMode', setState)
                  } 
                }
                >
                  reset
                </button>
              </>
            }
            { selectedModal === 'playerInfo' && 
              <>
              <button
                  className={`btn-close ${!playerInfoEdited ? '' :'hidden'}`}
                  type="button"
                  onClick={ ()=>modalClose( setState ) }
                >
                Close
              </button>
              <button
                className={`btn-close ${!playerInfoEdited? 'hidden' :''}`}
                type="button"
                onClick={ ()=>{
                  // const newForm = {
                    
                  // }
                  // handleStateUpdate(null, 'transactionIndex', setState );
                  // handleStateUpdate(newForm, 'transactionDetails', setState );
                  handleStateUpdate(false, 'playerInfoEdited', setState)
                } 
              }
              >
                reset
              </button>
            </> 
            }
            {(selectedModal !== 'notesViewer' || (selectedModal === 'notesViewer' && notesEditMode)) && (
              <button
                className="btn-gray"
                type="button"
                onClick={() => handleSubmit(selectedModal)}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
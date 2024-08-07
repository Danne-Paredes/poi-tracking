import React, { useState, useEffect } from 'react';
import SingleSelect from '../components/SingleSelect';
import { PoiCard } from '../components/PoiCard';
import { Modal } from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import { handleCasinoChange, fetchDataVals, handleOpenModal, handleStateUpdate, fetchCurrentPoiList, handleVisibilityChange, handleFocus, handleBlur, logoutUser, handleSignOut } from '../components/functions';
import { AiOutlinePlusCircle  } from 'react-icons/ai'
import { updateCurrentPoiList, manualAclUpdate } from '../config/firebase';

const PoiTracker = ({user}) => {
  const [isActive, setIsActive] = useState(!document.hidden);

  const [ state, setState ] = useState({
    poi: { casinos: []},
    poiList: [],
    sortedVisit:[],
    selectedModal: '',
    openModal: false,
    dataValsList: { casinos:[]},
    selectedCasino:'',
    transactionDetails: {
      amount: 0,
      date:'',
      type: "Buy In",
      note:'',
      game:''
    },
    transactionIndex:null,
  });

  const { poiList, selectedModal, openModal, dataValsList, selectedCasino } = state;
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const [currentPoiList, setCurrentPoiList] = useState([])

  const options = [ 
  ...dataValsList.casinos.map((casino) => {
      return { value: casino, label: casino };
    })];


  //   useEffect(() => {
  //     // Check if the user array is empty
  //     if (Array.isArray(user) && user.length === 0) {
  //         console.log('User array is empty. Reloading page.');
  //         // window.location.reload();
          
  //     }
  // }, [user]);
    
    
    
    useEffect(() => {
      const savedCasino = sessionStorage.getItem('currentCasino');
      const defaultCasino = user?.location ? user.location : 'Select A Casino';
      fetchDataVals(setState, JSON.parse(savedCasino), setCurrentPoiList);
      handleStateUpdate(user, 'user', setState);
      handleStateUpdate(savedCasino ? JSON.parse(savedCasino) : defaultCasino, 'selectedCasino', setState);
    
     // Handle visibility change
     const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // console.log('Tab is now visible');
        setIsActive(true);

        // Trigger any actions you need to 'when the tab is refocused, such as re-syncing
        // console.log('handleVisibilityChange')
        fetchCurrentPoiList(selectedCasino, setCurrentPoiList);
      } else {
        // console.log('Tab is now hidden');
        setIsActive(false);
      }
    };

    // Handle window focus
    const handleFocus = () => {
      // console.log('Window has gained focus');
      setIsActive(true);

      // Trigger resync or other important updates
      // console.log('handleFocus')
      // console.log('selectedCasino:', selectedCasino)
      fetchCurrentPoiList(selectedCasino, setCurrentPoiList);
    };

    // Handle window blur
    const handleBlur = () => {
      // console.log('Window has lost focus');
      setIsActive(false);
    };


    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);


    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      
    };
  }, []);

  useEffect(() => {
      if (user && user.location) {
          setState(prevState => {
              // Only update if the previous value is 'Select A Casino'
              return {
                  ...prevState,
                  selectedCasino: user.location !== "Corp - Knighted Ventures" && prevState.selectedCasino === 'Select A Casino' ? user.location : prevState.selectedCasino
              };
          });
          fetchCurrentPoiList(state.selectedCasino, setCurrentPoiList);
      }
  }, [user, user?.location]);  // Note the dependency on user?.location to handle changes in location


  const modalProps = {
    state, setState, currentPoiList, setCurrentPoiList, selectedCasino
  }

    
 

  return (
    <>
      <div className='flex justify-center mt-10 items-center'>
          <SingleSelect
              className="max-w-xs min-w-4 snap-center"
              onChange={(e)=> handleCasinoChange(e, setCurrentPoiList, setState)}
              value={selectedCasino ? { label: selectedCasino, value: selectedCasino } : null}
              options={options}
              placeholder='Select a casino'
              />
      </div>
      {isLocalhost && <div className='flex justify-center mt-10'>
          <button className='btn' onClick={()=>{
                                                // const newPoi = currentPoiList[1]
                                                // newPoi.id = '46ecae38-8370-4ca4-8c2d-8c57e385788d'
                                                // const newCurrent = [...currentPoiList]
                                                // newCurrent[1] = newPoi
                                                // setCurrentPoiList(newCurrent)
                                                console.log(currentPoiList)
                                              }
                                                }>current poiList</button>
          <button className='btn' onClick={handleSignOut}>handleSignOut</button>
          <button className='btn' onClick={()=>console.log(state)}>current state</button>
          <button className='btn' onClick={()=>manualAclUpdate()}>manualAclUpdate</button>
          <button className='btn' onClick={()=>{
                                                const today = new Date('2024-07-10')
                                                console.log(new Date('2024-07-10').toLocaleString().split(',')[0] )

                                                }}>Last Week</button>
          <button className='btn' onClick={()=>{
                                handleStateUpdate('', 'selectedCasino', setState)
                                sessionStorage.setItem("currentCasino", JSON.stringify(''))
          }}>reset selectedCasino poiList</button>
      </div>}

      {poiList.length !== 0 && currentPoiList.length === 0  && selectedCasino !== 'Select A Casino' && (
                  <div className='flex justify-center mt-10'>
                    <button
                      type="button"
                      className="btn-sm bg-dark-leather"
                      onClick={()=>handleOpenModal( "playerAdd", state, setState )}
                      >
                      <AiOutlinePlusCircle className="inner-icon" />
                    </button>
                  </div>
        )}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-10 justify-center mt-10'>
          {
            currentPoiList && currentPoiList.map((singlePoi, index) => (
              <PoiCard key={index} index={index} poi={singlePoi} state={state} setState={setState} currentPoiList={currentPoiList} setCurrentPoiList={setCurrentPoiList} selectedCasino={selectedCasino}/>
            ))
          }
      </div>
      
      {openModal && <Modal {...modalProps} />}
      {/* {openModal && <Modal state={state} setState={setState} currentPoiList={currentPoiList} setCurrentPoiList={setCurrentPoiList} selectedCasino={selectedCasino} />} */}

    </>
  )
}

export default PoiTracker
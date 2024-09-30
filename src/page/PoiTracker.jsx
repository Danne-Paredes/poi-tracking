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
          <button className='btn' onClick={()=>{
            
                                                const newPoi = currentPoiList[0]
                                                newPoi.id = '823a4bfa-e157-4070-af1c-5f5bdadf99db'
                                                // const newPoi2 = currentPoiList[1]
                                                const newPoi2 = {
                                                  "description": "",
                                                  "id": "18206cc0-b295-48a5-b3e8-ab58a1d15e18",
                                                  "visitId": "13528407-e55e-4ae2-bfb7-54bf1237d871",
                                                  "transactions": [
                                                      {
                                                          "date": "2024-07-30T08:14",
                                                          "amount": 2000,
                                                          "game": "",
                                                          "note": "",
                                                          "type": "Buy In"
                                                      },
                                                      {
                                                          "game": "TL",
                                                          "note": "",
                                                          "date": "2024-07-30T08:43",
                                                          "type": "Cash Out",
                                                          "amount": 10500
                                                      }
                                                  ],
                                                  "arrival": "2024-07-30T08:14",
                                                  "visits": [
                                                      {
                                                          "transactions": [
                                                              {
                                                                  "note": "",
                                                                  "amount": 1300,
                                                                  "type": "Buy In",
                                                                  "game": "",
                                                                  "date": "2024-07-01T09:17"
                                                              }
                                                          ],
                                                          "arrival": "2024-07-01T09:16",
                                                          "id": "891bfcc2-15ea-4b11-9a50-ef2fc74062c7",
                                                          "departure": "2024-07-01T09:20",
                                                          "casino": "Lotus",
                                                          "user": "kxiong@knighted.com"
                                                      },
                                                      {
                                                          "transactions": [
                                                              {
                                                                  "note": "",
                                                                  "amount": 2000,
                                                                  "type": "Buy In",
                                                                  "game": "",
                                                                  "date": "2024-07-02T10:35"
                                                              }
                                                          ],
                                                          "departure": "2024-07-02T11:00",
                                                          "user": "kxiong@knighted.com",
                                                          "casino": "Lotus",
                                                          "arrival": "2024-07-02T10:35",
                                                          "id": "16c7e49a-3432-4a05-84fd-4efdcd392187"
                                                      },
                                                      {
                                                          "departure": "2024-07-06T10:20",
                                                          "arrival": "2024-07-06T08:22",
                                                          "user": "jmichener@knighted.com",
                                                          "id": "999a48eb-0344-412f-b29e-5c0f7ef7b52b",
                                                          "transactions": [
                                                              {
                                                                  "type": "Buy In",
                                                                  "date": "2024-07-06T08:23",
                                                                  "note": "",
                                                                  "game": "",
                                                                  "amount": 1000
                                                              }
                                                          ],
                                                          "casino": "Lotus"
                                                      },
                                                      {
                                                          "casino": "Lotus",
                                                          "transactions": [
                                                              {
                                                                  "game": "",
                                                                  "note": "",
                                                                  "amount": 2400,
                                                                  "date": "2024-07-08T16:19",
                                                                  "type": "Buy In"
                                                              }
                                                          ],
                                                          "departure": "2024-07-08T18:19",
                                                          "user": "klu@knighted.com",
                                                          "arrival": "2024-07-08T16:19",
                                                          "id": "f2d029c5-9997-4add-9ecb-bee72f627407"
                                                      },
                                                      {
                                                          "casino": "Lotus",
                                                          "user": "jmichener@knighted.com",
                                                          "transactions": [
                                                              {
                                                                  "amount": 2000,
                                                                  "date": "2024-07-09T10:20",
                                                                  "type": "Buy In",
                                                                  "game": "",
                                                                  "note": ""
                                                              }
                                                          ],
                                                          "arrival": "2024-07-09T10:20",
                                                          "departure": "2024-07-09T10:20",
                                                          "id": "0c6372bb-b8ff-41e0-81fa-65312f528c42"
                                                      },
                                                      {
                                                          "departure": "2024-07-11T15:07",
                                                          "transactions": [
                                                              {
                                                                  "amount": 4000,
                                                                  "type": "Buy In",
                                                                  "date": "2024-07-11T13:50",
                                                                  "game": "",
                                                                  "note": ""
                                                              },
                                                              {
                                                                  "date": "2024-07-11T15:07",
                                                                  "game": "TL",
                                                                  "type": "Cash Out",
                                                                  "amount": 12000,
                                                                  "note": ""
                                                              }
                                                          ],
                                                          "arrival": "2024-07-11T15:07",
                                                          "casino": "Lotus",
                                                          "id": "dab5a1cc-42cd-4d7c-aa05-f8ffa2084243",
                                                          "user": "kxiong@knighted.com"
                                                      },
                                                      {
                                                          "arrival": "2024-07-12T08:24",
                                                          "transactions": [
                                                              {
                                                                  "game": "",
                                                                  "date": "2024-07-12T08:24",
                                                                  "amount": 6000,
                                                                  "type": "Buy In",
                                                                  "note": ""
                                                              },
                                                              {
                                                                  "amount": 10000,
                                                                  "type": "Cash Out",
                                                                  "note": "",
                                                                  "date": "2024-07-12T09:28",
                                                                  "game": "TL"
                                                              }
                                                          ],
                                                          "id": "c4968bde-fcd3-4366-975e-8b2217774f85",
                                                          "user": "jmichener@knighted.com",
                                                          "departure": "2024-07-12T11:41",
                                                          "casino": "Lotus"
                                                      },
                                                      {
                                                          "user": "vvue@knighted.com",
                                                          "departure": "2024-07-15T09:19",
                                                          "id": "f89e680b-0171-43ac-bf6e-179897c73499",
                                                          "casino": "Lotus",
                                                          "arrival": "2024-07-15T08:00",
                                                          "transactions": [
                                                              {
                                                                  "game": "",
                                                                  "note": "",
                                                                  "date": "2024-07-15T09:38",
                                                                  "type": "Buy In",
                                                                  "amount": 6500
                                                              },
                                                              {
                                                                  "date": "2024-07-15T09:38",
                                                                  "amount": 0,
                                                                  "game": "TL",
                                                                  "note": "",
                                                                  "type": "Cash Out"
                                                              }
                                                          ]
                                                      },
                                                      {
                                                          "arrival": "2024-07-16T08:13",
                                                          "id": "55272600-b63b-491c-af57-8103b3a8acee",
                                                          "departure": "2024-07-16T09:17",
                                                          "casino": "Lotus",
                                                          "transactions": [
                                                              {
                                                                  "note": "",
                                                                  "date": "2024-07-16T09:00",
                                                                  "type": "Buy In",
                                                                  "game": "",
                                                                  "amount": 11000
                                                              }
                                                          ],
                                                          "user": "jmichener@knighted.com"
                                                      },
                                                      {
                                                          "transactions": [
                                                              {
                                                                  "type": "Buy In",
                                                                  "date": "2024-07-16T09:43",
                                                                  "amount": 1000,
                                                                  "note": "",
                                                                  "game": ""
                                                              }
                                                          ],
                                                          "departure": "2024-07-16T09:44",
                                                          "id": "5c6b4bc0-5b90-4874-9084-757f3a3522f2",
                                                          "arrival": "2024-07-16T09:43",
                                                          "user": "jmichener@knighted.com",
                                                          "casino": "Lotus"
                                                      },
                                                      {
                                                          "transactions": [
                                                              {
                                                                  "note": "",
                                                                  "game": "",
                                                                  "type": "Buy In",
                                                                  "date": "2024-07-17T10:40",
                                                                  "amount": 4000
                                                              }
                                                          ],
                                                          "casino": "Lotus",
                                                          "user": "jmichener@knighted.com",
                                                          "departure": "2024-07-17T12:02",
                                                          "arrival": "2024-07-17T10:40",
                                                          "id": "57843715-4344-4ed5-9448-5d9176c3aa52"
                                                      },
                                                      {
                                                          "arrival": "2024-07-20T17:26",
                                                          "user": "klu@knighted.com",
                                                          "id": "855757a7-a34a-454d-b119-c667605a9d2b",
                                                          "casino": "Lotus",
                                                          "departure": "2024-07-20T17:41",
                                                          "transactions": [
                                                              {
                                                                  "type": "Buy In",
                                                                  "note": "",
                                                                  "date": "2024-07-20T17:26",
                                                                  "amount": 2000,
                                                                  "game": ""
                                                              }
                                                          ]
                                                      },
                                                      {
                                                          "arrival": "2024-07-23T08:46",
                                                          "casino": "Lotus",
                                                          "user": "jmichener@knighted.com",
                                                          "transactions": [
                                                              {
                                                                  "type": "Buy In",
                                                                  "game": "",
                                                                  "note": "",
                                                                  "amount": 1000,
                                                                  "date": "2024-07-23T08:47"
                                                              }
                                                          ],
                                                          "departure": "2024-07-23T10:54",
                                                          "id": "5cf71021-cd82-4e80-b59a-c8a85b05bef0"
                                                      },
                                                      {
                                                          "transactions": [
                                                              {
                                                                  "type": "Buy In",
                                                                  "amount": 1500,
                                                                  "date": "2024-07-23T16:35",
                                                                  "note": "",
                                                                  "game": ""
                                                              },
                                                              {
                                                                  "date": "2024-07-24T16:39",
                                                                  "type": "Buy In",
                                                                  "note": "",
                                                                  "amount": 4700,
                                                                  "game": ""
                                                              }
                                                          ],
                                                          "id": "43c73646-c090-43bc-90bf-0c395eae4c6d",
                                                          "user": "jmichener@knighted.com",
                                                          "departure": "2024-07-24T16:39",
                                                          "arrival": "2024-07-23T16:35",
                                                          "casino": "Lotus"
                                                      },
                                                      {
                                                          "arrival": "2024-07-25T10:40",
                                                          "departure": "2024-07-25T12:54",
                                                          "user": "mxiong@knighted.com",
                                                          "id": "780c7c2f-b7ec-4129-88a8-de5f6df1df6a",
                                                          "transactions": [
                                                              {
                                                                  "amount": 300,
                                                                  "note": "Free Play chips",
                                                                  "game": "",
                                                                  "date": "2024-07-25T12:53",
                                                                  "type": "Buy In"
                                                              },
                                                              {
                                                                  "date": "2024-07-25T12:53",
                                                                  "game": "TL",
                                                                  "amount": 1200,
                                                                  "note": "",
                                                                  "type": "Cash Out"
                                                              }
                                                          ],
                                                          "casino": "Lotus"
                                                      },
                                                      {
                                                          "departure": "2024-07-27T09:40",
                                                          "arrival": "2024-07-27T08:30",
                                                          "user": "mxiong@knighted.com",
                                                          "id": "ef9bb314-952a-4270-a67d-d855c77a3d15",
                                                          "casino": "Lotus",
                                                          "transactions": [
                                                              {
                                                                  "amount": 1000,
                                                                  "note": "",
                                                                  "game": "",
                                                                  "date": "2024-07-27T10:47",
                                                                  "type": "Buy In"
                                                              },
                                                              {
                                                                  "note": "",
                                                                  "type": "Cash Out",
                                                                  "game": "TL",
                                                                  "amount": 4000,
                                                                  "date": "2024-07-27T10:47"
                                                              }
                                                          ]
                                                      },
                                                      {
                                                          "transactions": [
                                                              {
                                                                  "game": "",
                                                                  "note": "",
                                                                  "amount": 800,
                                                                  "date": "2024-07-29T17:16",
                                                                  "type": "Buy In"
                                                              }
                                                          ],
                                                          "departure": "2024-07-29T21:43",
                                                          "casino": "Lotus",
                                                          "id": "69e3d65f-f4b0-4de1-bba5-7b2a7049ee0d",
                                                          "arrival": "2024-07-29T17:15",
                                                          "user": "klu@knighted.com"
                                                      }
                                                  ],
                                                  "name": "Jerry",
                                                  "casinos": [
                                                      "Lotus"
                                                  ]
                                              }
                                                newPoi2.id = 'fed576d3-02cd-4c1a-b936-a5629d6dc89d'
                                                const newCurrent = [...currentPoiList]
                                                newCurrent[0] = newPoi
                                                newCurrent[1] = newPoi2
                                                updateCurrentPoiList(selectedCasino,newCurrent)
                                                setCurrentPoiList(newCurrent)
                                                console.log(currentPoiList)
                                              }
                                                }>Update id</button>
          {/* <button className='btn' onClick={user}>user</button> */}
          <button className='btn' onClick={()=>console.log(user)}> user</button>
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
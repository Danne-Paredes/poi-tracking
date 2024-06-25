import React, { useState, useEffect, useRef } from 'react'
import SingleSelect from '../components/SingleSelect'
import {db, updateCollection, getDataVals, getPoiData} from '../config/firebase'
import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { AiOutlineEdit }  from 'react-icons/ai'
import { ImCancelCircle } from 'react-icons/im'
import { RosterEditModal } from "../modals/RosterEditModal";
import { handleStateUpdate } from '../components/functions';



const Roster = (props) => {
    const [ state, setState ] = useState({
      openModal: false,
      casinoList:[],
      dataValsList: {
        casinos:[]
      },
      showInactive:false,
      showMergedOnly:false,
      mergeMode:false,
      poiList:[],
      filteredPoiList:[],
      poiIndex:'',
      poi:{},
      filteredPoi:'',
      selectedCasino:'All Casinos',
      selectedPoi:{},
      checkedState:{},
    })

    const {openModal, casinoList, dataValsList, showInactive, poiList, filteredPoiList, poiIndex, poi, filteredPoi, selectedCasino, selectedPoi, mergeMode, checkedState, showMergedOnly} = state

    useEffect(() => {
      const savedCasino = sessionStorage.getItem('currentCasino');
      savedCasino && handleStateUpdate(JSON.parse(savedCasino), 'selectedCasino', setState)

      // Initialize the checkedState object based on the filteredPoiList
      const initialCheckedState = {};
        filteredPoiList.forEach(poi => {
          initialCheckedState[poi.id] = false; // Initialize all checkboxes to unchecked
        });
      handleStateUpdate(initialCheckedState,'checkedState',setState);

      fetchDataVals();
    }, [])

    const handleCheckboxChange = (id) => {
      setState(prevState => ({
        ...prevState,
        checkedState: {
          ...prevState.checkedState,
          [id]: !prevState.checkedState[id]
        }
      }));
    };
    
    
    const options = [ 
      { value: 'All Casinos', label: 'All Casinos' },
    ...dataValsList.casinos.map((casino) => {
        return { value: casino, label: casino };
    })];

    const poiOptions = poiList
  .sort((a, b) => {
    // First, sort by active status.
    if (a.active && !b.active) return -1;
    if (!a.active && b.active) return 1;

    // If both have the same active status, sort alphabetically by name.
    return a.name.localeCompare(b.name);
  })
  .filter((poi) => {
    if (selectedCasino === 'All Casinos' && showInactive) {
      return true;
    } else if (selectedCasino === 'All Casinos' && !showInactive) {
      return poi.active;
    } else if (showInactive) {
      return poi.casinos.includes(selectedCasino);
    } else {
      return poi.active && poi.casinos.includes(selectedCasino);
    }
  })
  .map(poi => ({ value: poi.name, label: poi.name })); // Corrected line: removed unnecessary curly braces and return


    const tbodyRef = useRef(null);

    const toggleInactiveRows = () => {
        handleStateUpdate(!showInactive, 'showInactive', setState);
      };
    const toggleMergeMode = () => {
        handleStateUpdate(!mergeMode, 'mergeMode', setState);
      };
    
    const fetchDataVals = async () => {
        const data = await getDataVals();
        const data2 = await getPoiData();

        handleStateUpdate(data, 'dataValsList', setState);
        handleStateUpdate(data2, 'poiList', setState);
        handleStateUpdate(data.casinos, 'casinoList', setState);
    };



    useEffect(() => {
      if (filteredPoi) {
        const lowerCaseFilteredPoi = filteredPoi.toLowerCase(); // assuming filteredPoi is a string
        const newFilteredPoiList = poiList.filter(poi => 
          poi.name.toLowerCase().includes(lowerCaseFilteredPoi)
        );
        handleStateUpdate(newFilteredPoiList, 'filteredPoiList', setState);
      } else {
        handleStateUpdate(poiList, 'filteredPoiList', setState);
      }
    }, [filteredPoi, poiList]); // Re-run when either filteredPoi or poiList changes
      

    const handleCasinoChange = (selectedOption) => {
      handleStateUpdate(selectedOption.value, 'selectedCasino', setState);
      sessionStorage.setItem("currentCasino", JSON.stringify(selectedOption.value));
      };
    const handlePoiChange = (selectedOption) => {
      handleStateUpdate(selectedOption.value, 'filteredPoi', setState);
      };

    const handleStatusChange = async (poiId, active, casinos) => {
        try {
          const poiRef = doc(db, 'poi', poiId);
          if (casinos.length === 1) {
            await updateDoc(poiRef, { active: !active });
            console.log('Document updated successfully!');
          } else {
            if (active) {
              const updatedCasinos = casinos.filter(casino => casino !== selectedCasino);
              await updateDoc(poiRef, { casinos: updatedCasinos });
              console.log('Document updated successfully!');
            } else {
              await updateDoc(poiRef, { active: true });
              console.log('Document updated successfully!');
            }
          }
          fetchDataVals();
        } catch (error) {
          console.error('Error updating document:', error);
        }
      };

    const handleEditPoi = async (poiInfo, poiIndex) => {
        console.log('made it to poitracker');
        console.log('poiList Before changes');
        console.log(poiList);
        const {name, active, casinos ,id, description, notes} = poiInfo
    
        try {
          const poiRef = doc(db, 'poi', id);
          await updateDoc(poiRef, { active: active, name: name, description: description, casinos:casinos, notes: notes });
          console.log('Document updated successfully!');
          fetchDataVals();
        } catch (error) {
          console.error('Error updating document:', error);
        }
      
        handleStateUpdate(false, 'openModal', setState);
      };

    const handleOpenEditPoiModal = (poi, index) =>{
      console.log('click')
      handleStateUpdate(poi, 'selectedPoi',setState)
      handleStateUpdate(index, 'poiIndex',setState)
      handleStateUpdate(true, 'openModal',setState)
    }

  return (
    <>
        <div className='flex justify-center mt-10 items-center'>
            {filteredPoi && <button onClick={()=>handleStateUpdate(null, 'filteredPoi', setState)} className='bg-kv-gray mr-1 rounded-full'><ImCancelCircle/></button>}
            <SingleSelect
                className="max-w-xs snap-center mr-2"
                onChange={handlePoiChange}
                value={filteredPoi ? { label: filteredPoi, value: filteredPoi } : null}
                options={poiOptions}
                placeholder='Filter by POI'
                />
            <SingleSelect
                className="max-w-xs snap-center"
                onChange={handleCasinoChange}
                value={selectedCasino ? { label: selectedCasino, value: selectedCasino } : null}
                options={options}
                placeholder='Select a casino'
                />
            {!mergeMode? <button onClick={toggleInactiveRows} className='btn ml-4'>{showInactive ? 'Hide Inactive' : 'Show Inactive'}</button> :<button onClick={toggleInactiveRows} className='btn ml-4'>{showMergedOnly ? 'Show All' : 'Show Merge Only'}</button>}
            {/* <button onClick={toggleMergeMode} className='btn ml-4'>{mergeMode ? 'Deactivate Merge Mode' : 'Activate Merge Mode'}</button> */}
        </div>
      <div className="flex justify-center items-center mx-2">
        <table className='justify-center items-center mt-2 border  border-kv-gray'>
          <thead className='bg-dark-leather-2'> 
            <tr>
              <th className='border border-kv-gray p-4'>POI</th>
              <th className='border border-kv-gray p-4 hidden xxs:table-cell'>Description</th>
              <th className='border border-kv-gray p-4 hidden xxs:table-cell'>Casinos</th>
              { !mergeMode &&
               <>
                <th className='border border-kv-gray p-4'>Active Status</th>
                <th className='border border-kv-gray p-4'>Edit</th>
               </> 
              }
              {
                mergeMode && <th className='border border-kv-gray p-4'>
                                <button className='btn-gray'>Merge</button>
                              </th>
              }
            </tr>
          </thead>
            <tbody>
              {filteredPoiList &&
                filteredPoiList
                .sort((a, b) => {
                  // First, sort by active status. 
                  // If one is active and the other isn't, it should come first.
                  if (a.active && !b.active) return -1;
                  if (!a.active && b.active) return 1;
              
                  // If both have the same active status, sort alphabetically by name.
                  return a.name.localeCompare(b.name);
              })
                .filter((poi) => {
                  if (selectedCasino === 'All Casinos' && showInactive) {
                    return true;
                  } else if (selectedCasino === 'All Casinos' && !showInactive) {
                    return poi.active;
                  } else if (showInactive) {
                    return poi.casinos.includes(selectedCasino);
                  } else {
                    return poi.active && poi.casinos.includes(selectedCasino);
                  }
                })
                  .map((poi, index) => (
                    <>
                      <tr key={poi.id} className={index % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray'}>
                        <td className='text-center border-r border-b border-black p-4 hidden xxs:table-cell'>{poi.name}</td>
                        <td className='text-center border-r border-b border-black p-4 xxs:hidden text-lg'>{poi.name} <br/> <span className='text-xs '>"{poi.description}"</span></td>
                        {/* Hide these on screen sizes below 640px */}
                        <td className='text-center border-r border-b border-black p-4 hidden xxs:table-cell'>{poi.description}</td>
                        <td className='text-center border-r border-b border-black p-4 hidden xxs:table-cell'>{poi.casinos.join(', ')}</td>
                        { !mergeMode &&
                          <>
                            <td className='text-center border-r border-b border-black p-4'>
                                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <label className="relative inline-flex items-center mr-5 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name={`toggle-${poi.id}`} 
                                        id={`toggle-${poi.id}`} 
                                        checked={poi.active}
                                        onChange={() => handleStatusChange(poi.id, poi.active,poi.casinos)} className="sr-only peer"/>
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-kv-red"></div>
                                    </label>
                                </div>
                            </td>

                            <td className='text-center border-b border-black p-4'>
                              {/* <button onClick={() => console.log('hi')} className="btn-sm bg-dark-leather"> */}
                              <button onClick={() => handleOpenEditPoiModal(poi, index)} className="btn-sm bg-dark-leather">
                                  <AiOutlineEdit  />
                              </button>
                            </td>
                          </>
                        }
                        {
                          mergeMode && <td 
                                          className='text-center border-b border-black p-4 cursor-pointer' onClick={() => handleCheckboxChange(poi.id)}>
                                          <label className="block w-full h-full" onClick={() => handleCheckboxChange(poi.id)}>
                                            <input
                                              type="checkbox"
                                              className="w-6 h-6"
                                              checked={checkedState[poi.id] || false}
                                              onChange={() => handleCheckboxChange(poi.id)}
                                              onClick={(e) => e.stopPropagation()}
                                            />
                                          </label>
                                        </td>
                        }
                      </tr>
                    </>
                  ))}
            </tbody>
        </table>
      </div>
        {openModal && <RosterEditModal  editPoi={handleEditPoi} state={state} setState={setState} selectedPoi={selectedPoi} poiListInfo={poiList} index={poiIndex} casinos={casinoList}/>}
    </>
  )
}

export default Roster
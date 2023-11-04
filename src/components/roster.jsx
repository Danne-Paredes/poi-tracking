import React, { useState, useEffect, useRef } from 'react'
import SingleSelect from '../components/singleSelect'
import {db, updateCollection, getDataVals, getPoiData} from '../config/firebase'
import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { AiOutlineEdit }  from 'react-icons/ai'
import { ImCancelCircle } from 'react-icons/im'
import { NewPlayerRosterEditModal } from "./modals/NewPlayerRosterEditModal";



const Roster = (props) => {
    const [openPlayerRosterEditModal,setOpenPlayerRosterEditModal] = useState(false);
    const [openPlayerNotesEditModal,setOpenPlayerNotesEditModal] = useState(false)
    const [casinoList, setCasinoList] = useState()
    const [dataValsList, setDataValsList] = useState({ casinos: [] })
    const [showInactive, setShowInactive] = useState(false);
    const [poiList, setPoiList] = useState([])
    const [filteredPoiList, setFilteredPoiList] = useState([])
    const [poiIndex, setPoiIndex] = useState('');
    const [poi, setPoi] = useState([]);
    const [filteredPoi, setFilteredPoi] = useState('')
    const [selectedCasino, setSelectedCasino] = useState(() => {
        const savedCasino = sessionStorage.getItem('currentCasino');
        return savedCasino ? JSON.parse(savedCasino) : 'All Casinos';
      }); // Initialize as an empty array
    
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
        setShowInactive(!showInactive);
      };
    
    const fetchDataVals = async () => {
        const data = await getDataVals();
        const data2 = await getPoiData();
        setDataValsList(data);
        setPoiList(data2);
        setCasinoList(data.casinos)
    };

    useEffect(() => {
        fetchDataVals();
      }, []);

    useEffect(() => {
      if (filteredPoi) {
        const lowerCaseFilteredPoi = filteredPoi.toLowerCase(); // assuming filteredPoi is a string
        const newFilteredPoiList = poiList.filter(poi => 
          poi.name.toLowerCase().includes(lowerCaseFilteredPoi)
        );
        setFilteredPoiList(newFilteredPoiList);
      } else {
        setFilteredPoiList(poiList); // No filter applied
      }
    }, [filteredPoi, poiList]); // Re-run when either filteredPoi or poiList changes
      

    const handleCasinoChange = (selectedOption) => {
    setSelectedCasino(selectedOption.value);
    sessionStorage.setItem("currentCasino", JSON.stringify(selectedOption.value));
    };
    const handlePoiChange = (selectedOption) => {
    setFilteredPoi(selectedOption.value);
    };

    const handleStatusChange = async (poiId, active, casinos) => {
        try {
          const poiRef = doc(db, 'poi', poiId);
          if (casinos.length === 1) {
            await updateDoc(poiRef, { active: !active });
            console.log('Document updated successfully!');
          } else {
            const updatedCasinos = casinos.filter(casino => casino !== selectedCasino);
            await updateDoc(poiRef, { casinos: updatedCasinos });
            console.log('Document updated successfully!');
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
      
        setOpenPlayerRosterEditModal(false);
      };

      const handleOpenPlayerRosterEdit = (poi)=>{
        const index = poiList.findIndex(obj => obj.id === poi.id);
    
        setPoi(poi)
        setPoiIndex(index)
        setOpenPlayerRosterEditModal(true)
        console.log(poi)
      }
      const handleOpenPlayerNotesEdit = (poi)=>{
        const index = poiList.findIndex(obj => obj.id === poi.id);
    
        setPoi(poi)
        setPoiIndex(index)
        setOpenPlayerRosterEditModal(true)
        console.log(poi)
      }

  return (
    <>
        <div className='flex justify-center mt-10 items-center'>
            {filteredPoi && <button onClick={()=>setFilteredPoi(null)} className='bg-kv-gray mr-1 rounded-full'><ImCancelCircle/></button>}
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
            <button onClick={toggleInactiveRows} className='btn ml-4'>{showInactive ? 'Hide Inactive' : 'Show Inactive'}</button>
        </div>
      <div className="flex justify-center items-center">
        <table className='justify-center items-center mt-2 border  border-kv-gray'>
          <thead className='bg-dark-leather-2'> 
            <tr>
              <th className='border border-kv-gray p-4'>POI</th>
              <th className='border border-kv-gray p-4 hidden xxs:table-cell'>Description</th>
              <th className='border border-kv-gray p-4 hidden xxs:table-cell'>Casinos</th>
              <th className='border border-kv-gray p-4'>Active Status</th>
              <th className='border border-kv-gray p-4'>Edit</th>
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
                    <tr key={poi.id} className={index % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray'}>
                      <td className='text-center border-r border-b border-black p-4 hidden xxs:table-cell'>{poi.name}</td>
                      <td className='text-center border-r border-b border-black p-4 xxs:hidden text-lg'>{poi.name} <br/> <span className='text-xs '>"{poi.description}"</span></td>
                       {/* Hide these on screen sizes below 640px */}
                      <td className='text-center border-r border-b border-black p-4 hidden xxs:table-cell'>{poi.description}</td>
                      <td className='text-center border-r border-b border-black p-4 hidden xxs:table-cell'>{poi.casinos.join(', ')}</td>
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
                        <button onClick={() => handleOpenPlayerRosterEdit(poi)} className="btn-sm bg-dark-leather">
                            <AiOutlineEdit  />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
        </table>
      </div>
        {openPlayerRosterEditModal && <NewPlayerRosterEditModal setShowModal={setOpenPlayerRosterEditModal} editPoi={handleEditPoi} poiInfo={poi} poiListInfo={poiList} index={poiIndex} casinos={casinoList}/>}
    </>
  )
}

export default Roster
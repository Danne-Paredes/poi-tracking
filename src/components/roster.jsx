import React, { useState, useEffect } from 'react'
import SingleSelect from '../components/singleSelect'
import {db, updateCollection, getDataVals, getPoiData} from '../config/firebase'


const Roster = (props) => {
    const [casinoList, setCasinoList] = useState()
    const [dataValsList, setDataValsList] = useState({ casinos: [] })
    const [poiList, setPoiList] = useState([])
    const [selectedCasino, setSelectedCasino] = useState(() => {
        const savedCasino = sessionStorage.getItem('currentCasino');
        return savedCasino ? JSON.parse(savedCasino) : 'Select A Casino';
      }); // Initialize as an empty array
    
    const options = [ 
    ...dataValsList.casinos.map((casino) => {
        return { value: casino, label: casino };
    })];

    useEffect(() => {
        const fetchDataVals = async () => {
          const data = await getDataVals();
          const data2 = await getPoiData();
          setDataValsList(data);
          setPoiList(data2);
        };
        fetchDataVals();
      }, []);

    const handleCasinoChange = (selectedOption) => {
    setSelectedCasino(selectedOption.value);
    sessionStorage.setItem("currentCasino", JSON.stringify(selectedOption.value));
    };

  return (
    <>
        <div className='flex justify-center mt-10 items-center'>
            <SingleSelect
                className="max-w-xs snap-center"
                onChange={handleCasinoChange}
                value={selectedCasino ? { label: selectedCasino, value: selectedCasino } : null}
                options={options}
                placeholder='Select a casino'
                />
        </div>
        <div>Roster</div>
    </>
  )
}

export default Roster
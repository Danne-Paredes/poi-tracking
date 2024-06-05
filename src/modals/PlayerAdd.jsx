import React, { useState, useEffect } from 'react'
import SingleSelect from '../components/SingleSelect';
import MultiSelect from '../components/MultiSelect';
import { handleStateUpdate, handleIsNewChange, handleSelectPoi, handleLocationChange, handleAddDescription, handleAddNotes } from '../components/functions';

const PlayerAdd = (props) => {
    const { state: parentState, setState: setParentState, currentPoiList, setCurrentPoiList, inputRef, handleKeyDown, selectedCasino, modalClose } = props;
    const { poiList = [],
            poi = { casinos:[selectedCasino]},
            casinos = parentState.dataValsList.casinos,
        } = parentState || {};
  

    const [state, setState] = useState({
        poiId: '',
        selectedPoi: { casinos: [selectedCasino]},
        poiDescription: '',
        isNew: false,
        selectedDateTime: '',
        selectedLocations: [],
      });

    const { poiId, isNew, selectedDateTime, selectedLocations, poiDescription, selectedPoi } = state;

    const options = [ 
        ...poiList
          .filter((poi) => poi.casinos.includes(selectedCasino))
          .filter((poi) => poi.active)
          .map((poi) => {
           return { value: poi.name, label: poi.name };
        }).sort((a, b) => a.label.localeCompare(b.label))
      ];
    const allOptions = [ 
    ...poiList
        .filter((poi) => poi.active)
        .map((poi) => {
        return { value: poi.name, label: poi.name };
    }).sort((a, b) => a.label.localeCompare(b.label))
    ];
    const casinoOptions = [ 
        ...casinos.map((casino) => {
            return { value: casino, label: casino };
        })];
    
    useEffect(() => {
        const currentDate = new Date();
        const timezoneOffsetInMinutes = currentDate.getTimezoneOffset();
        const adjustedDate = new Date(currentDate.getTime() - timezoneOffsetInMinutes * 60000);
    
        const adjustedDateTime = adjustedDate.toISOString().slice(0, 16);
    
        setState((prevState) => ({
            ...prevState,
            selectedDateTime: adjustedDateTime,
            poiList: poiList,
            locations: casinos,
    
        }));
        // console.log(poiList)
        if (inputRef.current) {
            inputRef.current.focus();
          }
        }, []);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        }, [isNew]);

    useEffect(() => {
        setParentState((prev)=>({
            ...prev,
            poi:state.selectedPoi
        }))
        }, [state.selectedPoi]);

  return (
    <div className="relative p-6 flex-auto">
         <input
            className='justify-center mx-auto items-center text-center block mb-2'
            type="datetime-local"
            defaultValue={selectedDateTime}
            onChange={(event)=>handleStateUpdate(event.target.value, 'selectedDateTime', setState)}
        />
         <label className='text-kv-gray' onClick={()=>console.log(parentState)}>New POI:</label>
        <input type="checkbox" checked={isNew} onChange={(e)=>{
            // console.log(state)
            handleIsNewChange(e,setState,setParentState)
        }}/>
        <br/>
        {!isNew && (
            <>
                <SingleSelect 
                    ref={inputRef} 
                    id="pois" 
                    onKeyDown={handleKeyDown} 
                    onChange={(e)=> handleSelectPoi( e, state, setState, poi, poiList)} 
                    className="max-w-xs mx-auto pb-2" 
                    value={selectedPoi && selectedPoi.name ? { label: selectedPoi.name, value: selectedPoi.name } : null} 
                    options={selectedCasino === 'Select A Casino' ? allOptions : options} 
                    placeholder='Select a Player'
                />
                <label className='text-kv-gray'> Description: </label>
                <p className='text-kv-gray text-center'>{poiDescription}</p>
            </>
        )}
        {isNew && (
            <>
                <input
                className='justify-center mx-auto items-center text-center mb-2 block'
                ref={inputRef}
                id="pois"
                type="text"
                onKeyDown={handleKeyDown}
                placeholder="Enter POI Name"
                onChange={(e)=> handleSelectPoi( e, state, setState, selectedPoi, poiList)}
                required
                />
                <input
                id="description"
                className='justify-center mx-auto items-center text-center block mb-2'
                onKeyDown={handleKeyDown}
                placeholder="Enter Description"
                onChange={(e)=>handleAddDescription(e.target.value, setState, selectedPoi)}
                required
                />
                <textarea
                id="notes"
                className='justify-center mx-auto items-center text-center block mb-2'
                onKeyDown={handleKeyDown}
                placeholder="Enter Player Notes"
                onChange={(e)=>handleAddNotes(e.target.value, setState, selectedPoi)}
                required
                />
                <MultiSelect 
                    className='pref-input input' 
                    options={casinos} 
                    placeholder='Select Active Casinos' 
                    onChange={(e)=>handleLocationChange(e, setState, selectedPoi)}
                />
            </>
        )}
            

    </div>
  )
}

export default PlayerAdd
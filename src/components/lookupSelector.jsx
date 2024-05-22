import React from 'react'
import SingleSelect from '../components/SingleSelect'
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';

const LookupSelector = ({
    currentPoi, 
    selectedCasino, 
    setSelectedCasino, 
    selectedDayRange, 
    setSelectedDayRange, 
    renderCustomInput, 
    setFilteredPoi, 
    visitDateRange, 
    casinoOptions, 
    poiOptions, 
    handlePoiChange,
    }) => {
  return (
    <>
        <div className='hidden sm:flex justify-center items-center mx-2'>
            <div className=' inline-block align-middle mb-6'>
                <table className='justify-center items-center mt-2 border border-kv-gray'>
                    <thead className='bg-dark-leather-2' onClick={() => console.log(currentPoi)}>
                    <tr>
                        <th>Select POI</th>
                        <th>Casino Filter</th>
                        <th>Date Range</th>
                    </tr>
                    <tr>
                        <th className='p-2'>
                            <SingleSelect 
                            value={currentPoi.name ? {
                                label: currentPoi.name,
                                value: currentPoi.name
                            } : null} 
                            options={poiOptions} 
                            onChange={e => handlePoiChange(e)}
                        />
                        </th>
                        <th className='p-2'>
                            <SingleSelect value={selectedCasino ? {
                                label: selectedCasino,
                                value: selectedCasino
                                } : null} options={casinoOptions} onChange={e => {
                                setSelectedCasino(e.value);
                                sessionStorage.setItem("currentCasino", JSON.stringify(e.value));
                                }} />
                        </th>
                        <th>
                            <DatePicker value={selectedDayRange} className={'mr-2 -z-1'} onChange={setSelectedDayRange} inputPlaceholder="Select a day" renderInput={renderCustomInput} minimumDate={visitDateRange.from} maximumDate={visitDateRange.to} shouldHighlightWeekends />
                        </th>
                    </tr>
                    </thead>
                </table>
            </div>
            {selectedDayRange.to !== visitDateRange.to && selectedDayRange.from !== visitDateRange.from && <button className='btn-xs mt-8 ml-1' onClick={() => {
                setSelectedDayRange({
                from: visitDateRange.from,
                to: visitDateRange.to
                });
                setFilteredPoi(null);
            }}>Reset</button>}
        </div>
        <div className='flex sm:hidden justify-center items-center'>
            <div className=' inline-block align-middle mb-6'>
                <table className='justify-center items-center mt-2 border border-kv-gray'>
                    <thead className='bg-dark-leather-2' onClick={() => console.log(currentPoi)}>
                    <tr>
                        <th>Casino Filter</th>
                    </tr>
                    <tr>
                        <th className='p-2'>
                            <SingleSelect value={selectedCasino ? {
                                label: selectedCasino,
                                value: selectedCasino
                                } : null} options={casinoOptions} onChange={e => {
                                setSelectedCasino(e.value);
                                sessionStorage.setItem("currentCasino", JSON.stringify(e.value));
                                }} />
                        </th>
                    </tr>
                    <tr>
                        <th>Select POI</th>
                    </tr>
                    <tr>
                        <th className='p-2'>
                            <SingleSelect 
                            value={currentPoi.name ? {
                                label: currentPoi.name,
                                value: currentPoi.name
                            } : null} 
                            options={poiOptions} 
                            onChange={e => handlePoiChange(e)}
                        />
                        </th>
                    </tr>
                    <tr>
                        <th colSpan={2}>Date Range</th>
                    </tr>
                    <tr>
                        <th colSpan={2} className='relative z-0'>
                            <div className="flex justify-center">
                            <div className="flex items-center">
                                <DatePicker
                                value={selectedDayRange}
                                className={'mr-auto'}
                                onChange={setSelectedDayRange}
                                inputPlaceholder="Select a day"
                                renderInput={renderCustomInput}
                                minimumDate={visitDateRange.from}
                                maximumDate={visitDateRange.to}
                                shouldHighlightWeekends
                                />
                                {selectedDayRange.to !== visitDateRange.to && selectedDayRange.from !== visitDateRange.from && (
                                <button
                                    className='btn-xs-gray'
                                    onClick={() => {
                                    setSelectedDayRange({
                                        from: visitDateRange.from,
                                        to: visitDateRange.to
                                    });
                                    setFilteredPoi(null);
                                    }}
                                >
                                    Reset
                                </button>
                                )}
                            </div>
                            </div>
                        </th>

                    </tr>
                    </thead>
                </table>
            </div>
            
        </div>
    </>
  )
}

export default LookupSelector
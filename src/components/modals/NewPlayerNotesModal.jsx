import React, {useState, useEffect, useRef} from 'react'
import SingleSelect from '../singleSelect';
import MultiSelect from '../multiSelect';

export const NewPlayerNotesModal = ({ setShowModal, poi }) => {
  const [formState, setFormState] = useState({
    total: '',
    filteredTransactions: '',
    sortOrder: 'asc',
    filterOptions: false,
    poiList: [],
    selectedFilters: '',
    filterVisibility: {
                        date: false,
                        time: false,
                        type: false,
                        amount: false,
                        note: false,
                      },
  });
  const {total, filteredTransactions,sortOrder,filterOptions,selectedFilters,filterVisibility} = formState
  const dateTransformer = (date) => {
    const transformedDate = date.split('T')
    return transformedDate[0]
  }

  const timeTransformer = (date) => {
    const transformedDate = date.split('T')
    return transformedDate[1]
  }

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && setShowModal(true)) {
        setShowModal(false);
      }
    };

    const calculatedTotal = () => {
      if (poi.transactions) {
        poi.transactions.forEach(transaction => {
          console.log(transaction);
        });
      }
    };

    setFormState((prevState) => ({
      ...prevState,
      total: calculatedTotal,
    }));

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [setShowModal, poi.transactions]);

  const handleSort = (field) => {
    const sortedTransactions = [...filteredTransactions];

    if (sortOrder === 'asc') {
      sortedTransactions.sort((a, b) => (a[field] > b[field] ? 1 : -1));
      setFormState((prevState) => ({
        ...prevState,
        sortOrder: 'desc',
      }));
    } else {
      sortedTransactions.sort((a, b) => (a[field] < b[field] ? 1 : -1));
      setFormState((prevState) => ({
        ...prevState,
        sortOrder: 'asc',
      }));
    }

    setFormState((prevState) => ({
      ...prevState,
      filteredTransactions: sortedTransactions,
    }));
  };

  const handleFilterSelection = (field, option) => {
    const isSelected = selectedFilters.some(filter => filter.field === field && filter.option === option);

    if (isSelected && field === 'date') {
      const updatedFilters = selectedFilters.filter(filter => !(filter.field === field && filter.option === option));
      setFormState((prevState)=>({
        ...prevState,
        selectedFilters:updatedFilters
      }))
    } else if (isSelected) {
      const updatedFilters = selectedFilters.filter(filter => !(filter.field === field && filter.option === option));
      setFormState((prevState) => ({
        selectedFilters: updatedFilters,
      }))
    } else {
      const newFilter = { field, option };
      setFormState((prevState) => ({
        ...prevState,
        selectedFilters: [...prevState.selectedFilters, newFilter],
      }));
    }
  };

  const isTransactionFiltered = (transaction) => {
    if (selectedFilters.length === 0) {
      return true;
    }

    return selectedFilters.some(filter => {
      const { field, option } = filter;

      return transaction[field] === option;
    });
  };

  const handleToggleFilterVisibility = (field) => {
    setFormState(prevState => ({
      ...prevState,
      filterVisibility: {
        ...prevState.filterVisibility,
        [field]: !prevState.filterVisibility[field],
      },
    }));    
  };

  const handleSortButton = () => {
    const sortedTransactions = [...filteredTransactions];

    if (sortOrder === 'asc') {
      sortedTransactions.sort((a, b) => (a.id > b.id ? 1 : -1));
      setFormState((prevState) => ({
        sortOrder:'desc',
      }))
    } else {
      sortedTransactions.sort((a, b) => (a.id < b.id ? 1 : -1));
      setFormState((prevState) =>({
        sortOrder: 'asc',
      }))
    }
    setFormState((prevState) => ({
      filteredTransactions: sortedTransactions,
    }))
  };


  return (
    <div
      className="justify-center items-start pt-6 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-dark-denim"
    >
      <div className="relative w-auto  mx-auto max-w-3xl">
        {/*content*/}
        <div className="border-0 rounded-lg mt-0 items-center shadow-lg relative flex flex-col w-full bg-dark-leather-2 outline-none focus:outline-none">
          {/*header*/}
          <div onClick={()=>console.log(formState)}  className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold text-center text-kv-gray" >
              POI Transactions
            </h3>
          </div>
          {/*body*/}
          <div className="relative p-6 flex-auto">
            

          </div>
          {/*footer*/}
          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
            <button
              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
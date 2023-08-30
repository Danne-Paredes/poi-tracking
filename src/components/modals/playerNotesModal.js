import React, { useEffect, useCallback, useState } from 'react';
import "./.modal.css";
import { v4 as uuidv4 } from 'uuid';

function PlayerNotesModal({ isOpen, poi }) {
  const [total, setTotal] = useState(0);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterVisibility, setFilterVisibility] = useState({
    date: false,
    time: false,
    type: false,
    amount: false,
    note: false,
  });

  const onClose = useCallback(() => {
    isOpen(false);
  });

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
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const calculatedTotal = () => {
      if (poi.transactions) {
        poi.transactions.forEach(transaction => {
          console.log(transaction);
        });
      }
    };

    setTotal(calculatedTotal);

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, poi.transactions]);

  useEffect(() => {
    setFilteredTransactions(poi.transactions);

    const calculateFilterOptions = () => {
      const uniqueDates = [...new Set(poi.transactions.map(transaction => transaction.date))];
      const uniqueTimes = [...new Set(poi.transactions.map(transaction => transaction.time))];
      const uniqueTypes = [...new Set(poi.transactions.map(transaction => transaction.type))];
      const uniqueAmounts = [...new Set(poi.transactions.map(transaction => transaction.amount))];
      const uniqueNotes = [...new Set(poi.transactions.map(transaction => transaction.note))];

      setFilterOptions({
        date: uniqueDates,
        time: uniqueTimes,
        type: uniqueTypes,
        amount: uniqueAmounts,
        note: uniqueNotes,
      });
    };

    calculateFilterOptions();
  }, [poi.transactions]);

  const handleSort = (field) => {
    const sortedTransactions = [...filteredTransactions];

    if (sortOrder === 'asc') {
      sortedTransactions.sort((a, b) => (a[field] > b[field] ? 1 : -1));
      setSortOrder('desc');
    } else {
      sortedTransactions.sort((a, b) => (a[field] < b[field] ? 1 : -1));
      setSortOrder('asc');
    }

    setFilteredTransactions(sortedTransactions);
  };

  const handleFilterSelection = (field, option) => {
    const isSelected = selectedFilters.some(filter => filter.field === field && filter.option === option);

    if (isSelected && field === 'date') {
      const updatedFilters = selectedFilters.filter(filter => !(filter.field === field && filter.option === option));
      setSelectedFilters(updatedFilters);
    } else if (isSelected) {
      const updatedFilters = selectedFilters.filter(filter => !(filter.field === field && filter.option === option));
      setSelectedFilters(updatedFilters);
    } else {
      const newFilter = { field, option };
      setSelectedFilters([...selectedFilters, newFilter]);
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
    setFilterVisibility(prevVisibility => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  const handleSortButton = () => {
    const sortedTransactions = [...filteredTransactions];

    if (sortOrder === 'asc') {
      sortedTransactions.sort((a, b) => (a.id > b.id ? 1 : -1));
      setSortOrder('desc');
    } else {
      sortedTransactions.sort((a, b) => (a.id < b.id ? 1 : -1));
      setSortOrder('asc');
    }

    setFilteredTransactions(sortedTransactions);
  };

  return (
    <div className='modalBackground'>
      <div className='notesModalContainer'>
        <div className='titleCloseBtn'>
          <button onClick={onClose}> X </button>
        </div>
        <div className='title'>
          <h1>{poi.poi} {total}</h1>
          {/* Filter Options */}
          {Object.entries(filterOptions).map(([field, options]) => (
            <div key={field} style={{ display: filterVisibility[field] ? 'block' : 'none' }}>
              <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
              {options.map(option => (
                <label key={option}>
                  <input
                    type="checkbox"
                    checked={selectedFilters.some(filter => filter.field === field && filter.option === option)}
                    onChange={() => handleFilterSelection(field, option)}
                  />
                  {field === 'date' && <span>{dateTransformer(option)}</span>}
                  {/* {field === 'time' && <span>{timeTransformer(option)}</span>} */}
                  {field !== 'date' && option}
                </label>
              ))}
            </div>
          ))}
        </div>
        <div className='body'>
          <div style={{ maxHeight: '300px', minHeight: '300px', overflow: 'auto' }}>
            <table>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>
                <tr>
                  <th>
                    Date
                    <span className="sort-caret" onClick={() => handleSortButton()}>
                      {sortOrder === 'asc' ? '▲' : '▼'}
                    </span>
                    <span className="filter-caret" onClick={() => handleToggleFilterVisibility('date')}>
                      🔍
                    </span>
                  </th>
                  <th>
                    Time
                    <span className="sort-caret" onClick={() => handleSortButton()}>
                      {sortOrder === 'asc' ? '▲' : '▼'}
                    </span>
                    <span className="filter-caret" onClick={() => handleToggleFilterVisibility('date','time')}>
                      🔍
                    </span>
                  </th>
                  <th onClick={() => handleSort('type')}>
                    Type
                    <span className="filter-caret" onClick={() => handleToggleFilterVisibility('type')}>
                      {filterVisibility.type ? '▲' : '▼'}
                    </span>
                    <span className="filter-caret" onClick={() => handleToggleFilterVisibility('type')}>
                      🔍
                    </span>
                  </th>
                  <th onClick={() => handleSort('amount')}>
                    Amount
                    <span className="filter-caret" onClick={() => handleToggleFilterVisibility('amount')}>
                      {filterVisibility.amount ? '▲' : '▼'}
                    </span>
                    <span className="filter-caret" onClick={() => handleToggleFilterVisibility('amount')}>
                      🔍
                    </span>
                  </th>
                  <th onClick={() => handleSort('note')}>
                    Notes
                    <span className="filter-caret" onClick={() => handleToggleFilterVisibility('note')}>
                      {filterVisibility.note ? '▲' : '▼'}
                    </span>
                    <span className="filter-caret" onClick={() => handleToggleFilterVisibility('note')}>
                      🔍
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
              {filteredTransactions.map((transaction, index) =>
                isTransactionFiltered(transaction) && (
                  <tr
                    key={`transaction-${uuidv4()}`}
                    style={{
                      backgroundColor: index % 2 === 0 ? 'lightgray' : 'darkgray',
                    }}
                  >
                    <td>{dateTransformer(transaction.date)}</td>
                    <td>{timeTransformer(transaction.date)}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.note}</td>
                  </tr>
                )
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerNotesModal;

import React from 'react'
import { useState, useRef, useEffect } from 'react';
import "./.modal.css";

function PlayerTransactionModal({isOpen, addTransaction, index}) {
  const [transactionAmount, addTransactionAmount] = useState(0)
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [type, setType] = useState('Buy In');
  const [note, setNote] = useState('');
  const [transactionDetails, addTransactionDetails] = useState([])
    // 
   
    const inputRef = useRef(null);
    const modalRef = useRef(null);
   
    const onClose = ()=>{
        isOpen(false)
    }
    useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 7);
    const adjustedDateTime = currentDate.toISOString().slice(0, 16);
    setSelectedDateTime(adjustedDateTime);
    }, []);

    useEffect(()=>{
      addTransactionDetails({
        date:selectedDateTime,
        type:type,
        amount:transactionAmount,
        note:note,
        index:index
      })

      },[transactionAmount,selectedDateTime,note,type]);

    
    useEffect(() => {
      const handleEscape = (event) => {
        if (event.key === 'Escape' && isOpen) {
          onClose();
        }
      };
    
  
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target) && isOpen) {
          onClose();
        }
      };
  
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
  
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, onClose]);

    useEffect(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen]);

    const handleAmountChange = (e)=>{
      const inputNumber = parseInt(e.target.value);
      addTransactionAmount(inputNumber)
      console.log(`transaction amount: ${transactionAmount}`)
    }

    const handleNoteChange = (e)=>{
      const note = e.target.value;
      setNote(note)
      console.log(`Note: ${note}`)
    }
    const handleTypeChange = (e)=>{
      const type = e.target.value;
      setType(type)
      console.log(`Type: ${type}`)
    }
    const handleDateTimeChange = (event) => {
      const inputDate = event.target.value;
      setSelectedDateTime(inputDate);
    };
    
    const handleTransaction = ()=>{
      const {amount,date,type, note,index} = transactionDetails
      console.log('index:')
      console.log(index)
      addTransaction(amount,date,type, note,index)
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        // event.preventDefault(); // Prevent form submission
        handleTransaction()
      }
    };

  return (
    <div className='modalBackground'>
        <div ref={modalRef} className='modalContainer'>
            <div className='titleCloseBtn'>
                <button onClick={onClose}> X </button>
            </div>
            <div className='title'>
                <h1>Log Transaction</h1>
            </div>
            <div className='body'>
                <div className='radio-group'>
                  <input onClick={handleTypeChange} type="radio" defaultValue="Buy In" name="gender" defaultChecked/> Buy In <br></br>
                  <input onClick={handleTypeChange} type="radio" defaultValue="Cash Out" name="gender" /> Cash Out
                </div>
                <input type="datetime-local" defaultValue={selectedDateTime} onChange={handleDateTimeChange} />
                <input onKeyDown={handleKeyDown} ref={inputRef} type='number'   onChange={handleAmountChange}/>
                <textarea onKeyDown={handleKeyDown} onChange={handleNoteChange}></textarea>
            </div>
            
            <div className='footer'>
                <button onClick={onClose} id='cancelBtn'>Cancel</button>
                <button onClick={handleTransaction} >Continue</button>
                {/* <button onClick={()=>addPoi(poi)}>Continue</button> */}
            </div>
        </div>
    </div>
  )
}

export default PlayerTransactionModal
import { Link } from "react-router-dom";
import './index.css'

const TransactionItem = props => {
  const {transactionDetails} = props
  const { id,title, amount, type, date,category} = transactionDetails

  const colors = type === "Income"?  "green-colour":"red-colour"

  const formattedDate = date ? String(date).split("T")[0] : "";

  return (
    <li className="table-row">
      <p className="transaction-text">{title}</p>
      <p className={`transaction-text ${colors} `}>Rs {amount}</p>
      <p className="transaction-text" >{formattedDate}</p>
       <p className="transaction-text">{category}</p>
      <p className="transaction-text">{type}</p>
     
      <div className='delete-edit-container'>
        <Link to={`/${id}/delete`}>
        <img className="delete-image transaction-text" src="https://assets.ccbp.in/frontend/react-js/money-manager/delete.png" alt="delete"/>
        </Link>
        <Link to={`/${id}/edit`} className="transaction-text">Edit</Link>

      </div>
      
    </li>
  )
}

export default TransactionItem
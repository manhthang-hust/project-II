import React from 'react'
import './Pagination.scss'

const Pagination = (props) => {
    const { pagination, onPageChange } = props
    const { page, limit, total } = pagination
    const totalPages = Math.ceil(total/limit)

    const handlePageChange = (newPage) => {
        if(onPageChange) {
            onPageChange(newPage)
        }
    }
    return (
        <div className="paginationUser">
            <button disabled={page<=1 } onClick={() => handlePageChange(page-1)} className={page<=1 ? "disabled" : ""}>Prev</button>
            <button disabled={page>=totalPages} onClick={() => handlePageChange(page+1)} className={page>=totalPages ? "disabled" : ""}>Next</button>
        </div>
    )
}

export default Pagination

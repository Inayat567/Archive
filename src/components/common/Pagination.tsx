import PaginateBack from 'styles/images/contacts/paginate-back.svg';
import PaginateForward from 'styles/images/contacts/paginate-forward.svg';

interface Props{
    handleClick: any,
    pagination: number,
    maxPagination: number,
}

export default function Pagination(props: Props){

    const { pagination, maxPagination, handleClick } = props;

    return (
        <div className="pagination">
            <div className="pagination__arrows">
                <button onClick={()=>{ handleClick(pagination-1) }}>
                    <img src={PaginateBack} />
                </button>
            </div>
            <div className='pagination__dots'>
                <ul>
                {
                    [...Array(maxPagination).keys()].map((num)=>{
                        return (
                            <li 
                                className={pagination-1 == num ? 'active' : ''} 
                                key={num}>
                                <button onClick={()=>{ handleClick(num)}} ></button>
                            </li>
                        )
                    })
                }
                </ul>
            </div>
            <div className="pagination__arrows">
                <button onClick={()=>{ handleClick(pagination+1) }}>
                    <img src={PaginateForward} />
                </button>
            </div>
        </div>
    )
}
import React from 'react'
import './CatType.scss'
import {useState, useEffect} from 'react'
import { Fragment } from 'react';
import { Link } from "react-router-dom";
import {useDispatch, useSelector } from 'react-redux'
import { getCategory, getCategorySuccess } from '../../../../redux/slice/categorySlice';
const CatType = () => {

    const dispatch = useDispatch()
    //const[categories, setCategories]=useState([])
    const { categories } = useSelector((state) => state.category)
    const[click, setClick]= useState('');

    useEffect( async () =>{
            const res = await dispatch(getCategory());
            dispatch(getCategorySuccess(res.payload.data.categories))

        }, [])
    return (
        <Fragment>
        
        {categories.map( (value) => (
            <Link to={`/categories/${value._id}`} className="link" key={value._id}>
            <div 
                key={value._id} 
                className={(click===value._id)?"catName clicked":"catName"}
                onClick={()=>setClick(value._id)}>    
                {value.name}
            </div>
            </Link>
        ))}
        </Fragment>
    )
}

export default CatType

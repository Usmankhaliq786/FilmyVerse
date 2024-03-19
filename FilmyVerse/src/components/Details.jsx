import React, { useEffect, useState } from 'react'
import ReactStars from 'react-stars'
import { useParams } from 'react-router-dom'
import { db } from './fireBase/fireBase';
import { doc, getDoc } from 'firebase/firestore';
import Reviews from './Reviews';

export default function Details() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
 const Detail = () =>{
  rating: 0
 }
  useEffect(() => {
    async function getData() {
      try {
        const movieDocRef = doc(db, 'movies', id);
        const snapshot = await getDoc(movieDocRef);
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() });
          console.log("Fetched data:", snapshot.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false when data fetching is complete
      }
    }
    
    getData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>No data found for this movie.</p>;
  }

  return (
    <div className='p-4 mt-4 w-full flex flex-col md:flex-row items-center md:items-start justify-center'>
      <div className='flex flex-col md:flex-row items-center md:items-start fff' >
        <img className='h-96 block md:sticky top-24 doremon ' src={data.image} alt={data.title} />
        <div className='md:ml-4 ml-0 w-full md:w-1/2'>
          <h1 className='text-3xl font-bold text-gray-400'>{data.title} <span className='text-xl'>({data.year})</span></h1>
          <ReactStars 
            size={20}
            half={true}
            value={4.5}
            edit={false}
          />
          <p className='mt-2'>
            {data.description}
          </p>
          <Reviews id ={id} prevRating= {data.rating} />
        </div>
      </div>
    </div> 
  );
}

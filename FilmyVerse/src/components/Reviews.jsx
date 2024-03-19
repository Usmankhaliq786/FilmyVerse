import React, { useEffect, useState } from 'react';
import ReactStars from 'react-stars';
import { reviewsref } from './fireBase/fireBase';
import { addDoc, query, where, getDocs } from 'firebase/firestore';
import { TailSpin, ThreeDots } from 'react-loader-spinner';
import swal from 'sweetalert';

export default function Reviews({ id }) {
  const [rate, setRating] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [form, setForm] = useState("");
  const [reviewsData, setReviewsData] = useState([]);

  const sendReviews = async () => {
    try {
      if (!id) {
        throw new Error("Movie ID is undefined.");
      }

      setLoading(true);
       
      await addDoc(reviewsref, {
        movieid: id, 
        name: "usman awan",
        rating: rate,
        thought: form,
        timestamp: new Date().getTime()
      });

      setLoading(false);
      setRating(0);
      setForm("");
      swal({
        title: "Review Sent",
        icon: "success",
        buttons: false,
        timer: 3000
      });
    } catch (error) {
      setLoading(false);
      
      swal({
        title: error.message,
        icon: "error",
        buttons: false,
        timer: 3000
      });
    }
  }

  useEffect(() => {
    async function getData() {
      setReviewsLoading(true);
      try {
        const reviewsQuery = query(reviewsref, where('movieid', '==', id));
        const querySnapshot = await getDocs(reviewsQuery);
        const reviews = [];
        querySnapshot.forEach((doc) => {
          reviews.push(doc.data());
        });
        setReviewsData(reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        swal({
          title: "Error fetching reviews",
          icon: "error",
          buttons: false,
          timer: 3000
        });
      }
      setReviewsLoading(false);
    }
    getData();
  }, [id]);

  return (
    <div className='mt-4 border-t-2 border-gray-800 w-full'>
      <ReactStars 
        size={30}
        half={true}
        value={rate}
        onChange={(rate) => setRating(rate)}
      />
      <input 
        value={form}
        onChange={(e) => setForm(e.target.value)}
        placeholder='Enter your thoughts....'
        className='w-96 p-1 outline-none header'
      />
      <button onClick={sendReviews} className='bg-green-600 w-96 flex justify-center p-2'>
        {loading ? <TailSpin height={20} color='white' /> : 'Share'}
      </button>
      {reviewsLoading ? (
        <div className='mt-6 flex justify-center'><ThreeDots height={10} color='white'/></div>
      ) : (
        <div className='mt-4  '>
          {reviewsData.map((review, index) => (
            <div className='bg-gray-900 p-2 w-96 mt-2' key={index}>
              <ReactStars 
        size={15}
        half={true}
        value={rate}
        edit= {false}
        
      />
              <div><p>{review.thought}</p></div>
              <div>Rating: {review.rating}</div>
              <div>Name: {review.name}</div>
              <div>Timestamp: {new Date(review.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

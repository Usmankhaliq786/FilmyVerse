import { getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Audio, ThreeDots } from "react-loader-spinner";
import ReactStars from "react-stars";
import { moviesref } from "./fireBase/fireBase";
import { Link } from "react-router-dom";

export default function Cards() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const _data = await getDocs(moviesref);
      const newData = _data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setData(newData);
      setLoading(false);
    }
    getData();
  }, []);

  return (
    <div className="flex flex-wrap justify-between px-3 mt-2 cardd">
      {loading ? (
        <div className="w-100 flex justify-center items-center h-96">
          <ThreeDots height={40} color="white" />
        </div>
      ) : (
        data.map((e, i) => (
          <Link key={i} to={`/Details/${e.id}`} className="card font-medium shadow-lg p-4 hover:-translate-y-3 cursor-pointer mt-6 transition-all duration-500">
            <img className="h-60 md:h-72 w-full object-cover" src={e.image} alt={e.title} />

            <h1>
              <span className="text-gray-500"> Name: </span> {e.title}
            </h1>
            <h1 className="flex items-center mr-1">
              <span className="text-gray-500"> Rating :</span>
              <ReactStars size={20} half={true} value={5} edit={false} />
            </h1>
            <h1>
              {" "}
              <span className="text-gray-500"> Year :</span> {e.year}
            </h1>
          </Link>
        ))
      )}
    </div>
  );
}

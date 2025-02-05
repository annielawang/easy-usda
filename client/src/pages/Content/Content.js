import { React, useEffect, useState } from "react";
import "./Content.css";
import { REMOVE_FOOD } from "../../utils/mutations";
import { QUERY_ME } from "../../utils/queries";
import { useQuery, useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import { removeFoodId } from "../../utils/localStorage";

const Content = () => {
  const [savedFoodSearch, setSavedFoodSearch] = useState([]);
  const { data } = useQuery(QUERY_ME);
  const [deleteFood] = useMutation(REMOVE_FOOD);
  const userData = data?.me || {};

  useEffect(() => {
    document.title = ` Easy-FDA | Content `;
    const savedFoodStr = localStorage.getItem("saved_food");
    setSavedFoodSearch(!savedFoodStr ? [] : JSON.parse(savedFoodStr));
  }, []);

  if (!userData?.username) {
    return <p>Must be logged in!</p>;
  }
  const handleDeleteFood = async (fdcId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    // try {
    //   await deleteFood({
    //     variables: { fdcId: fdcId },
    //       update: cache => {
    //       const data = cache.readQuery({ query: QUERY_ME });
    //       const userDataCache = data.me;
    //       const savedFoodCache = userDataCache.savedFood;
    //       const updatedFoodCache =savedFoodCache.filter((food) => food.fdcId !== fdcId);
    //       data.me.savedFood = updatedFoodCache;
    //         cache.writeQuery({
    //           query: QUERY_ME,
    //           data: { data: { ...data.me.savedFood } },
    //         });
    //       },
    //     });
    //     removeFoodId(fdcId);
    //   } catch (error) {
    //     console.error(error);
    //    }
  };

  return (
    <div className="contentContainer">
      {savedFoodSearch.map((oneFoodSearch) => {
        return (
          <>
            <div
              key={`${oneFoodSearch.description}`}
              className="cardsContainer"
            >
              <div className="infoContainer1">
                <h2>{oneFoodSearch.description}</h2>
                <p>{oneFoodSearch.dataType}</p>
                <p>{oneFoodSearch.brandOwner}</p>
              </div>
              {
                <table className="content-table">
                  <thead>
                    <tr>
                      <th>Nutrient Name</th>
                      <th>Amount</th>
                      <th>Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {oneFoodSearch.foodNutrients.map((foodNutrient, index) => {
                      return (
                        <tr key={`${oneFoodSearch.description}-${index}`}>
                          <td>{foodNutrient.nutrientName}</td>
                          <td>{foodNutrient.nutrientNumber}</td>
                          <td>{foodNutrient.unitName}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              }
            </div>
            <div key={`${oneFoodSearch.description}-space`}>&nbsp; &nbsp;</div>
          </>
        );
      })}
    </div>
    // <div className="contentContainer">
    //   <div className="cardsContainer">
    //     <div className="card">
    //       <div className="card-image"></div>
    //       <div className="card-text">
    //         <span className="date cards">4 days ago</span>
    //         <h2 className="cards">
    //           {/* {userData.savedFood.length
    //         ? `Viewing ${userData.savedFood.length} saved ${userData.savedFood.length === 1 ? 'food' : 'food items'}:`
    //         : 'You have no saved food items!'}  */}
    //         </h2>
    //         <p className="cards">
    //           Lorem ipsum dolor sit amet consectetur adipisicing elit. Non fuga
    //           tempora odio laborum deleniti nulla, impedit exercitationem alias
    //           fugit consectetur nihil
    //         </p>
    //       </div>
    //       <div className="card-stats">
    //         <div className="stat">
    //           <div className="value">314</div>
    //           <div className="type">calories</div>
    //         </div>
    //         <div className="stat border">
    //           <div className="value">513</div>
    //           <div className="type">calories</div>
    //         </div>
    //         <div className="stat">
    //           <div className="value">1234</div>
    //           <div className="type">afssfa</div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    // <div className={`infoContainer1 ${toogleDark1}`}>
    //   {searchedFood.map((food) => (
    //     <>
    //       <h2>{food.description}</h2>
    //       <p>{food.dataType}</p>
    //       <p>{food.brandOwner}</p>
    //     </>
    //   ))}
    // </div>

    // <div className={`tableBottom ${toogleDark3}`}>
    // <table className="content-table">
    //   <thead>
    //     <tr>
    //       <th>Nutrient Name</th>
    //       <th>Amount</th>

    //       <th>Unit</th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {searchedFood.map((nutrient) => {
    //       return nutrient.foodNutrients.map((foodNutrient, index) => (
    //             <tr key={`${nutrient.description}-${index}`}>
    //               <td>{foodNutrient.nutrientName}</td>
    //               <td>{foodNutrient.nutrientNumber}</td>
    //               <td>{foodNutrient.unitName}</td>
    //             </tr>
    //           ));
    //     })}
    //   </tbody>
    // </table>
    //         </div>
  );
};

export default Content;

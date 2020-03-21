import React from 'react'; 
import axios from 'axios';

const StopList = (props) => {


    if (props && props.stops) {
        const stopList = Object.values(props.stops).map((stop) => {
            return  <tr className="">
                        <td className="">{stop.id}</td>
                        <td className="">{stop.name}</td>
                    </tr>
        });
        return  <div>
            <table className="ui sortable celled table">
                <thead className="main">
                    <tr className="head-main">
                        <th className="">Stop ID</th>
                        <th className="">Stop Name</th>
                    </tr>
                </thead>
                <tbody>
                    {stopList}
                </tbody>
            </table>
        </div>
    } else {
        return (<p> Loading ... </p>)
    }



}

export default StopList;
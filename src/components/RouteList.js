import React from 'react'; 

const RouteList = (props) => {

    var route_list = props.routes.map((route) => {
        return <tr className="">
                    <td className="">{route.vehicle_id}</td>
                    <td className="">{route.route_name}</td>
                    <td className="">{route.arrival_time}</td>
                    <td className="">{route.departure_time}</td>
                    <td className="">{route.status}</td>
                </tr>
    })

    return  <div>
                <table className="ui sortable celled table">
                    <thead className="main">
                        <tr className="head-main">
                            <th className="">Train ID</th>
                            <th className="">Route</th>
                            <th className="sorted descending">Arrival Time</th>
                            <th className="">Departure Time</th>
                            <th className="">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {route_list}
                    </tbody>
                </table>
            </div>

};

export default RouteList;
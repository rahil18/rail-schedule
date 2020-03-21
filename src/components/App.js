import React from 'react'; 
import axios from 'axios'; 
import Search from './Search'; 
import RouteList from './RouteList'; 
import StopList from './StopList'; 


class App extends React.Component{

    state = {routes: [] , stops:[], isLoaded: false, curTime: null}; 

    onSearchSubmit = async (term) => {
       
        var stop_id = "https://api-v3.mbta.com/predictions?filter[stop]=".concat(term);
        const response_prediction = await axios.get(stop_id, {});

        var predictions = [];                                           //Object to hold all the predictions
        var count = Object.keys(response_prediction.data.data).length;
        var valid_prediction_count = 0;                                 //Keeping count of predictions
        for(var i =0; i < count; i++){
            if(response_prediction.data.data[i].relationships.vehicle.data !== null){
                var arr = ""; 
                var dep = "";
                var obj = {};
                if(response_prediction.data.data[i].attributes.arrival_time && response_prediction.data.data[i].attributes.departure_time){
                    arr = response_prediction.data.data[i].attributes.arrival_time.substring(response_prediction.data.data[i].attributes.arrival_time.indexOf("T") + 1);
                    dep = response_prediction.data.data[i].attributes.departure_time.substring(response_prediction.data.data[i].attributes.departure_time.indexOf("T") + 1);
                    arr = arr.substring(0, arr.indexOf('-'));
                    dep = dep.substring(0, dep.indexOf('-'));
                    arr = this.tConvert(arr); 
                    dep = this.tConvert(dep);

                    obj = {
                        arrival_time: arr, 
                        departure_time: dep, 
                        status: response_prediction.data.data[i].attributes.status, 
                        route_id: response_prediction.data.data[i].relationships.route.data.id, 
                        vehicle_id: response_prediction.data.data[i].relationships.vehicle.data.id
                    }

                    predictions[valid_prediction_count] = obj; 
                    valid_prediction_count++;
                }
                else if(response_prediction.data.data[i].attributes.arrival_time && !response_prediction.data.data[i].attributes.departure_time){
                    arr = response_prediction.data.data[i].attributes.arrival_time.substring(response_prediction.data.data[i].attributes.arrival_time.indexOf("T") + 1);
                    dep = "N/A";
                    arr = arr.substring(0, arr.indexOf('-'));
                    arr = this.tConvert(arr); 

                    obj = {
                        arrival_time: arr, 
                        departure_time: dep, 
                        status: response_prediction.data.data[i].attributes.status, 
                        route_id: response_prediction.data.data[i].relationships.route.data.id, 
                        vehicle_id: response_prediction.data.data[i].relationships.vehicle.data.id
                    }

                    predictions[valid_prediction_count] = obj; 
                    valid_prediction_count++;
                }
                else if(!response_prediction.data.data[i].attributes.arrival_time && response_prediction.data.data[i].attributes.departure_time){
                    arr = "N/A";
                    dep = response_prediction.data.data[i].attributes.departure_time.substring(response_prediction.data.data[i].attributes.departure_time.indexOf("T") + 1);
                    dep = dep.substring(0, dep.indexOf('-'));
                    dep = this.tConvert(dep);

                    obj = {
                        arrival_time: arr, 
                        departure_time: dep, 
                        status: response_prediction.data.data[i].attributes.status, 
                        route_id: response_prediction.data.data[i].relationships.route.data.id, 
                        vehicle_id: response_prediction.data.data[i].relationships.vehicle.data.id
                    }

                    predictions[valid_prediction_count] = obj; 
                    valid_prediction_count++;
                }
            }
        }
        for(i = 0; i< predictions.length; i++){
            const r_id = predictions[i].route_id; 
            var route_id = "https://api-v3.mbta.com/routes/".concat(r_id);
            const response_routes = await axios.get(route_id, {});
            predictions[i].route_name = response_routes.data.data.attributes.long_name; 
            
        }
        this.setState({routes: predictions });
    }

    componentDidMount(){
        this.fetchData();
        setInterval( () => {
            this.setState({
            curTime : new Date().toLocaleString()
            })
        },1000)
    }
    
    
    fetchData = async() =>{

        var id_name = {}; 
        var temp_obj = {}
        const stop_name = await axios.get("https://api-v3.mbta.com/stops/", {}        
        ).then(function(value) {
            var count = Object.keys(value.data.data).length;

            for(var i =0; i<count; i++){
                temp_obj = {
                    name : value.data.data[i].attributes.name,
                    id : value.data.data[i].id
                }
                id_name[i] = temp_obj; 
                 
            }
      });;

        this.setState({stops: id_name});
        this.setState({isLoaded: true}); 
            
    }

    //Helper function to convert time to 12 hour format
    tConvert = (time) => {
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
      
        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join (''); // return adjusted time or original string
    }

    render(){
        const isLoadedComponent = this.state.isLoaded;

        return <div className="ui container" style={{ marginTop: '10px'}}> 

                <div class="ui divider"></div>
                <div style={{ marginLeft: '40%'}} class="ui mini statistic">
                    <div class="label">Time</div>
                    <div class="value">{this.state.curTime}</div>
                </div>
                <div class="ui divider"></div>
                <Search onSearch = {this.onSearchSubmit} /> 
                <div class="ui pointing below blue label">Found: {this.state.routes.length} routes</div>
                <br />
                <RouteList routes= {this.state.routes} /> 
                <br />
                <div className="ui segment">
                <div>
                    <h3 className="ui icon center aligned header">
                        <i aria-hidden="true" className="question circle icon"></i>
                        <div className="content">Find a station in the below chart and use the corresponding Stop ID to search:</div>
                        <div className="content">(To search for North Station, use the id place-north)</div>
                    </h3>
                </div>
                <br />
                </div>
                <br />
                {isLoadedComponent ? <StopList stops={this.state.stops} /> : <div> Loading.... </div> }
            </div>; 
    }

}

export default App